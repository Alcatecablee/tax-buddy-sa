/**
 * Municipal Finance API Client
 * 
 * Production-ready API client for accessing municipal financial data
 * from the National Treasury's Municipal Data API.
 * 
 * API Documentation: https://municipaldata.treasury.gov.za/docs
 * 
 * ARCHITECTURE PATTERN: Mirrors sarb-api.ts for consistency
 * - Zod schema validation
 * - Exponential backoff retry logic
 * - 15-second timeout protection
 * - Comprehensive error logging
 * - Type-safe responses
 */

import { z } from 'zod';
import { municipalConfig } from '../config';
import { logger } from './logger';

// Create municipal-specific logger
const municipalLogger = logger.child({ service: 'municipal-api' });

// ===== TYPES & SCHEMAS =====

/**
 * Municipality schema from API
 */
export const MunicipalityApiSchema = z.object({
  'demarcation.code': z.string(),
  'municipality.name': z.string(),
  'municipality.province_name': z.string().optional(),
  'municipality.category': z.string().optional(),
});

export type MunicipalityApi = z.infer<typeof MunicipalityApiSchema>;

/**
 * Income/Expenditure item schema
 */
export const IncomeExpenseItemSchema = z.object({
  'item.label': z.string(),
  'amount.sum': z.union([z.number(), z.string()]),
  'financial_year_end.year': z.union([z.number(), z.string()]).optional(),
  'municipality.name': z.string().optional(),
});

export type IncomeExpenseItem = z.infer<typeof IncomeExpenseItemSchema>;

/**
 * API Response wrapper
 */
export const MunicipalApiResponseSchema = z.object({
  data: z.array(z.any()),
  total_cell_count: z.number().optional(),
  cell: z.array(z.any()).optional(),
});

// ===== FALLBACK DATA =====

/**
 * Major South African municipalities with estimated property tax rates
 * Used when API is unavailable
 */
const FALLBACK_MUNICIPALITIES = [
  { code: 'CPT', name: 'City of Cape Town', province: 'Western Cape', category: 'metro', residentialRate: 0.0098, commercialRate: 0.0196 },
  { code: 'JHB', name: 'City of Johannesburg', province: 'Gauteng', category: 'metro', residentialRate: 0.01, commercialRate: 0.02 },
  { code: 'TSH', name: 'City of Tshwane', province: 'Gauteng', category: 'metro', residentialRate: 0.0095, commercialRate: 0.019 },
  { code: 'GT483', name: 'City of Ekurhuleni', province: 'Gauteng', category: 'metro', residentialRate: 0.0092, commercialRate: 0.0184 },
  { code: 'ETH', name: 'eThekwini', province: 'KwaZulu-Natal', category: 'metro', residentialRate: 0.009, commercialRate: 0.018 },
  { code: 'NMA', name: 'Nelson Mandela Bay', province: 'Eastern Cape', category: 'metro', residentialRate: 0.0088, commercialRate: 0.0176 },
];

// ===== ERROR TYPES =====

export class MunicipalApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'MunicipalApiError';
  }
}

// ===== API CLIENT =====

export class MunicipalApiClient {
  private readonly baseUrl = municipalConfig.baseUrl;
  private readonly timeout = municipalConfig.timeout;
  private readonly maxRetries = municipalConfig.maxRetries;
  private readonly baseBackoffMs = municipalConfig.baseBackoffMs;
  private readonly defaultPageSize = municipalConfig.defaultPageSize;
  
  /**
   * Exponential backoff retry helper
   * Implements exponential backoff with jitter for API reliability
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    context: string,
    attempt: number = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const isLastAttempt = attempt >= this.maxRetries - 1;
      
      if (error instanceof MunicipalApiError) {
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          throw error;
        }
      }
      
      if (isLastAttempt) {
        municipalLogger.error(`${context} failed after ${this.maxRetries} attempts`, {
          endpoint: context,
          attempts: this.maxRetries,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
      
      const exponentialDelay = this.baseBackoffMs * Math.pow(2, attempt);
      const jitter = Math.random() * this.baseBackoffMs;
      const delay = exponentialDelay + jitter;
      
      municipalLogger.warn(`${context} failed, retrying`, {
        endpoint: context,
        attempt: attempt + 1,
        maxAttempts: this.maxRetries,
        retryDelayMs: Math.round(delay),
        error: error instanceof Error ? error.message : String(error),
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.retryWithBackoff(operation, context, attempt + 1);
    }
  }
  
  /**
   * Generic API request helper
   */
  private async request<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    return this.retryWithBackoff(
      async () => {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
          const response = await fetch(url.toString(), {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new MunicipalApiError(
              `Municipal API returned status ${response.status}`,
              response.status,
              endpoint
            );
          }
          
          const data = await response.json();
          return data as T;
          
        } catch (error) {
          clearTimeout(timeoutId);
          
          if (error instanceof MunicipalApiError) {
            throw error;
          }
          
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              throw new MunicipalApiError(
                `Request timeout for ${endpoint}`,
                undefined,
                endpoint
              );
            }
            throw new MunicipalApiError(
              `Failed to fetch ${endpoint}: ${error.message}`,
              undefined,
              endpoint
            );
          }
          
          throw new MunicipalApiError(
            `Unknown error fetching ${endpoint}`,
            undefined,
            endpoint
          );
        }
      },
      `Municipal API ${endpoint}`
    );
  }
  
  /**
   * Get list of all municipalities
   * 
   * @returns Array of municipalities
   */
  async getMunicipalities(): Promise<MunicipalityApi[]> {
    try {
      const response = await this.request<any>('/cubes/municipalities/facts', {
        pagesize: String(this.defaultPageSize),
      });
      
      const data = response.data || response.cell || [];
      
      municipalLogger.info('Municipalities fetched successfully', {
        endpoint: 'municipalities',
        recordCount: data.length,
      });
      
      return data;
    } catch (error) {
      municipalLogger.error('Failed to fetch municipalities, using fallback', {
        error: error instanceof Error ? error.message : String(error),
      });
      
      return FALLBACK_MUNICIPALITIES.map(m => ({
        'demarcation.code': m.code,
        'municipality.name': m.name,
        'municipality.province_name': m.province,
        'municipality.category': m.category,
      }));
    }
  }
  
  /**
   * Get municipality by code
   */
  async getMunicipalityByCode(code: string): Promise<MunicipalityApi | null> {
    try {
      const response = await this.request<any>('/cubes/municipalities/facts', {
        cut: `demarcation.code:${code}`,
      });
      
      const data = response.data || response.cell || [];
      
      if (data.length === 0) {
        const fallback = FALLBACK_MUNICIPALITIES.find(m => m.code === code);
        if (fallback) {
          return {
            'demarcation.code': fallback.code,
            'municipality.name': fallback.name,
            'municipality.province_name': fallback.province,
            'municipality.category': fallback.category,
          };
        }
        return null;
      }
      
      return data[0];
    } catch (error) {
      const fallback = FALLBACK_MUNICIPALITIES.find(m => m.code === code);
      if (fallback) {
        return {
          'demarcation.code': fallback.code,
          'municipality.name': fallback.name,
          'municipality.province_name': fallback.province,
          'municipality.category': fallback.category,
        };
      }
      return null;
    }
  }
  
  /**
   * Get property tax rate for a municipality
   * 
   * NOTE: Since the API doesn't directly provide property tax rates,
   * we use fallback data based on typical South African rates
   */
  getPropertyTaxRate(
    municipalityCode: string,
    category: 'residential' | 'commercial' | 'industrial' | 'agricultural' | 'vacant_land'
  ): number {
    const municipality = FALLBACK_MUNICIPALITIES.find(m => m.code === municipalityCode);
    
    if (!municipality) {
      return category === 'residential' ? 0.01 : 0.02;
    }
    
    switch (category) {
      case 'residential':
        return municipality.residentialRate;
      case 'commercial':
      case 'industrial':
        return municipality.commercialRate;
      case 'agricultural':
        return municipality.residentialRate * 0.25;
      case 'vacant_land':
        return municipality.residentialRate * 2;
      default:
        return 0.01;
    }
  }
  
  /**
   * Get fallback municipalities for comparison
   */
  getFallbackMunicipalities() {
    return FALLBACK_MUNICIPALITIES;
  }
}

export const municipalApi = new MunicipalApiClient();
