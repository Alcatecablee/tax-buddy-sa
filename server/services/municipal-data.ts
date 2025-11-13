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

// Municipal data TTL: 24 hours (less volatile than economic data)
const MUNICIPAL_TTL = 86400;

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
 * Calculate property tax
 */
export async function calculatePropertyTax(
  input: PropertyTaxCalculation
): Promise<PropertyTaxResult> {
  const { municipalityCode, propertyValue, propertyCategory, rebates } = input;
  
  const municipality = await getMunicipalityByCode(municipalityCode);
  
  if (!municipality) {
    throw new Error(`Municipality ${municipalityCode} not found`);
  }
  
  const taxRate = municipalApi.getPropertyTaxRate(municipalityCode, propertyCategory);
  const rateFreeThreshold = municipality.rateFreeThreshold;
  
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
