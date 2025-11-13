/**
 * Municipal Data Service
 * 
 * Business logic layer for municipal and property tax calculations.
 * Orchestrates Municipal API client and implements tax calculation logic.
 * 
 * ARCHITECTURE PATTERN: Mirrors economic-data.ts for consistency
 */

import { municipalApi } from './municipal-api';
import { CacheService } from './cache';
import { cacheConfig } from '../config';

const cacheService = new CacheService();
import { logger } from './logger';
import type {
  Municipality,
  PropertyTaxRate,
  PropertyTaxCalculation,
  PropertyTaxResult,
  MunicipalityComparison,
} from '../../shared/schema';

const municipalLogger = logger.child({ service: 'municipal-data' });

// ===== CACHE KEYS =====
const CACHE_KEYS = {
  municipalities: 'municipal:all_municipalities',
  municipality: (code: string) => `municipal:municipality:${code}`,
  taxRate: (code: string, category: string) => `municipal:rate:${code}:${category}`,
};

// Municipal data TTL: 1 hour (matching Phase 1 pattern)
const MUNICIPAL_TTL = cacheConfig.municipalDataTtl;

/**
 * Get all municipalities
 */
export async function getAllMunicipalities(): Promise<Municipality[]> {
  try {
    const cached = await cacheService.get<Municipality[]>(CACHE_KEYS.municipalities);
    if (cached) {
      municipalLogger.info('Municipalities retrieved from cache');
      return cached;
    }
    
    const apiData = await municipalApi.getMunicipalities();
    
    const municipalities: Municipality[] = apiData.map(m => ({
      code: m['demarcation.code'],
      name: m['municipality.name'],
      province: m['municipality.province_name'] || 'Unknown',
      category: (m['municipality.category'] || 'local') as 'metro' | 'district' | 'local',
      rateFreeThreshold: 50000,
      lastUpdated: new Date().toISOString(),
    }));
    
    await cacheService.set(CACHE_KEYS.municipalities, municipalities, MUNICIPAL_TTL);
    
    municipalLogger.info('Municipalities fetched and cached', {
      count: municipalities.length,
    });
    
    return municipalities;
  } catch (error) {
    municipalLogger.error('Failed to fetch municipalities', {
      error: error instanceof Error ? error.message : String(error),
    });
    
    return getFallbackMunicipalities();
  }
}

/**
 * Get municipality by code
 */
export async function getMunicipalityByCode(code: string): Promise<Municipality | null> {
  try {
    const cached = await cacheService.get<Municipality>(CACHE_KEYS.municipality(code));
    if (cached) {
      return cached;
    }
    
    const apiData = await municipalApi.getMunicipalityByCode(code);
    
    if (!apiData) {
      return null;
    }
    
    const municipality: Municipality = {
      code: apiData['demarcation.code'],
      name: apiData['municipality.name'],
      province: apiData['municipality.province_name'] || 'Unknown',
      category: (apiData['municipality.category'] || 'local') as 'metro' | 'district' | 'local',
      rateFreeThreshold: 50000,
      lastUpdated: new Date().toISOString(),
    };
    
    await cacheService.set(CACHE_KEYS.municipality(code), municipality, MUNICIPAL_TTL);
    
    return municipality;
  } catch (error) {
    municipalLogger.error('Failed to fetch municipality', {
      code,
      error: error instanceof Error ? error.message : String(error),
    });
    
    const fallbacks = getFallbackMunicipalities();
    return fallbacks.find(m => m.code === code) || null;
  }
}

/**
 * Get property tax rate from storage (manual overrides)
 * Phase 2: Returns null (no storage yet)
 * Phase 3: Will query database for manual overrides
 */
async function getManualPropertyTaxRate(
  municipalityCode: string,
  category: PropertyTaxCalculation['propertyCategory'],
  financialYear: string
): Promise<PropertyTaxRate | null> {
  return null;
}

/**
 * Get validated fallback property tax rate with full provenance
 */
function getValidatedFallbackRate(
  municipalityCode: string,
  category: PropertyTaxCalculation['propertyCategory'],
  financialYear: string
): PropertyTaxRate {
  const rate = municipalApi.getPropertyTaxRate(municipalityCode, category);
  
  const ratesByMunicipality: Record<string, { lastValidated: string; sourceUrl?: string }> = {
    'CPT': {
      lastValidated: '2024-11-01',
      sourceUrl: 'https://www.capetown.gov.za/Family%20and%20home/residential-utility-services/residential-water-and-sanitation-services/your-water-and-sanitation-tariffs/property-rates',
    },
    'JHB': {
      lastValidated: '2024-10-15', 
      sourceUrl: 'https://www.joburg.org.za/documents_/Pages/Key%20Documents/policies/Development%20Planning%20%EF%BC%86-Urban-Management/Citywide%20Spatial%20Policies/Property-Rates-Policy.aspx',
    },
  };
  
  const metadata = ratesByMunicipality[municipalityCode] || {
    lastValidated: '2024-11-01',
  };
  
  return {
    municipalityCode,
    financialYear,
    category,
    rate,
    rateFreeThreshold: 50000,
    source: 'validated_fallback',
    lastValidated: metadata.lastValidated,
    sourceUrl: metadata.sourceUrl,
    validatedBy: 'system',
    notes: 'Validated average municipal rate based on 2024/2025 budgets',
    effectiveDate: `${financialYear.split('/')[0]}-07-01`,
  };
}

/**
 * Get property tax rate with caching and provenance
 * Priority: manual_override (storage) → validated_fallback
 */
async function getPropertyTaxRateWithCache(
  municipalityCode: string,
  category: PropertyTaxCalculation['propertyCategory'],
  financialYear: string
): Promise<PropertyTaxRate> {
  const cacheKey = CACHE_KEYS.taxRate(municipalityCode, category);
  
  const cached = await cacheService.get<PropertyTaxRate>(cacheKey);
  if (cached) {
    municipalLogger.debug('Property tax rate retrieved from cache', {
      municipalityCode,
      category,
      source: cached.source,
    });
    return cached;
  }
  
  const manualRate = await getManualPropertyTaxRate(municipalityCode, category, financialYear);
  if (manualRate) {
    await cacheService.set(cacheKey, manualRate, MUNICIPAL_TTL);
    municipalLogger.info('Using manual override rate', {
      municipalityCode,
      category,
      source: 'manual_override',
    });
    return manualRate;
  }
  
  const fallbackRate = getValidatedFallbackRate(municipalityCode, category, financialYear);
  await cacheService.set(cacheKey, fallbackRate, MUNICIPAL_TTL);
  
  municipalLogger.info('Using validated fallback rate', {
    municipalityCode,
    category,
    lastValidated: fallbackRate.lastValidated,
  });
  
  return fallbackRate;
}

/**
 * Calculate property tax
 */
export async function calculatePropertyTax(
  input: PropertyTaxCalculation
): Promise<PropertyTaxResult> {
  const { municipalityCode, propertyValue, propertyCategory, rebates, financialYear } = input;
  
  const municipality = await getMunicipalityByCode(municipalityCode);
  
  if (!municipality) {
    throw new Error(`Municipality ${municipalityCode} not found`);
  }
  
  const taxRateData = await getPropertyTaxRateWithCache(
    municipalityCode,
    propertyCategory,
    financialYear || '2024/2025'
  );
  const taxRate = taxRateData.rate;
  const rateFreeThreshold = taxRateData.rateFreeThreshold || municipality.rateFreeThreshold;
  
  let taxableValue = Math.max(0, propertyValue - rateFreeThreshold);
  
  const annualTax = taxableValue * taxRate;
  const monthlyTax = annualTax / 12;
  
  const appliedRebates: string[] = [];
  let totalRebateAmount = 0;
  
  if (rebates) {
    if (rebates.pensioner) {
      const pensionerRebate = annualTax * 0.25;
      totalRebateAmount += pensionerRebate;
      appliedRebates.push(`Pensioner rebate: R${Math.round(pensionerRebate).toLocaleString()}`);
    }
    
    if (rebates.disabled) {
      const disabledRebate = annualTax * 0.5;
      totalRebateAmount += disabledRebate;
      appliedRebates.push(`Disabled person rebate: R${Math.round(disabledRebate).toLocaleString()}`);
    }
    
    if (rebates.lowIncome && propertyValue < 400000) {
      const lowIncomeRebate = Math.min(annualTax * 0.5, 5000);
      totalRebateAmount += lowIncomeRebate;
      appliedRebates.push(`Low income rebate: R${Math.round(lowIncomeRebate).toLocaleString()}`);
    }
  }
  
  const netAnnualTax = Math.max(0, annualTax - totalRebateAmount);
  const netMonthlyTax = netAnnualTax / 12;
  
  municipalLogger.info('Property tax calculated', {
    municipalityCode,
    propertyValue,
    category: propertyCategory,
    annualTax: Math.round(annualTax),
    netAnnualTax: Math.round(netAnnualTax),
  });
  
  return {
    municipalityName: municipality.name,
    propertyValue,
    propertyCategory,
    taxRate,
    rateFreeThreshold,
    taxableValue,
    annualTax: Math.round(annualTax),
    monthlyTax: Math.round(monthlyTax),
    appliedRebates: appliedRebates.length > 0 ? appliedRebates : undefined,
    totalRebateAmount: totalRebateAmount > 0 ? Math.round(totalRebateAmount) : undefined,
    netAnnualTax: Math.round(netAnnualTax),
    netMonthlyTax: Math.round(netMonthlyTax),
    
    dataSource: taxRateData.source,
    lastValidated: taxRateData.lastValidated,
    sourceUrl: taxRateData.sourceUrl,
    effectiveDate: taxRateData.effectiveDate,
  };
}

/**
 * Compare property taxes across municipalities
 */
export async function compareMunicipalities(
  input: MunicipalityComparison
): Promise<PropertyTaxResult[]> {
  const { municipalityCodes, propertyValue, propertyCategory, financialYear } = input;
  
  const comparisons = await Promise.all(
    municipalityCodes.map(code =>
      calculatePropertyTax({
        municipalityCode: code,
        propertyValue,
        propertyCategory,
        financialYear,
      })
    )
  );
  
  comparisons.sort((a, b) => a.netAnnualTax - b.netAnnualTax);
  
  municipalLogger.info('Municipality comparison completed', {
    municipalityCount: municipalityCodes.length,
    propertyValue,
    category: propertyCategory,
  });
  
  return comparisons;
}

/**
 * Get fallback municipalities (major metros)
 */
function getFallbackMunicipalities(): Municipality[] {
  const fallbacks = municipalApi.getFallbackMunicipalities();
  
  return fallbacks.map(m => ({
    code: m.code,
    name: m.name,
    province: m.province,
    category: m.category as 'metro' | 'district' | 'local',
    rateFreeThreshold: 50000,
    lastUpdated: new Date().toISOString(),
  }));
}
