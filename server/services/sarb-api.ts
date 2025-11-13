/**
 * SARB (South African Reserve Bank) Web API Client
 * 
 * Production-ready API client for accessing economic and financial data
 * from the South African Reserve Bank's public Web API.
 * 
 * API Documentation: https://custom.resbank.co.za/SarbWebApi/Help
 */

import { z } from 'zod';
import { sarbConfig } from '../config';

// ===== TYPES & SCHEMAS =====

/**
 * SARB API data point schema
 */
export const SarbDataPointSchema = z.object({
  date: z.string(),
  value: z.number().nullable(),
});

export type SarbDataPoint = z.infer<typeof SarbDataPointSchema>;

/**
 * SARB CPD Rate entry schema
 * Validates individual rate entries from CPDRates endpoint
 */
export const SarbCPDRateSchema = z.object({
  Name: z.string(),
  Value: z.union([z.string(), z.number()]),
  Date: z.string().optional(),
});

export type SarbCPDRate = z.infer<typeof SarbCPDRateSchema>;

/**
 * SARB CPD Rates response schema
 * Validates the complete CPDRates endpoint response
 */
export const SarbCPDRatesResponseSchema = z.array(SarbCPDRateSchema);

/**
 * SARB HomePage Rate entry schema
 * Validates individual entries from HomePageRates endpoint
 */
export const SarbHomePageRateSchema = z.object({
  Name: z.string(),
  SectionId: z.string(),
  SectionName: z.string(),
  TimeseriesCode: z.string(),
  Date: z.string(),
  Value: z.number(),
  UpDown: z.number(),
  FormatNumber: z.string(),
  FormatDate: z.string(),
});

export type SarbHomePageRate = z.infer<typeof SarbHomePageRateSchema>;

/**
 * SARB HomePageRates response schema
 * Validates the complete HomePageRates endpoint response
 */
export const SarbHomePageRatesResponseSchema = z.array(SarbHomePageRateSchema);

/**
 * SARB time series raw data point schema
 * Handles various SARB API response formats before normalization
 */
export const SarbRawDataPointSchema = z.object({
  Date: z.string().optional(),
  date: z.string().optional(),
  Period: z.string().optional(),
  period: z.string().optional(),
  Value: z.union([z.string(), z.number(), z.null()]).optional(),
  value: z.union([z.string(), z.number(), z.null()]).optional(),
});

/**
 * SARB time series raw response schema
 * Validates raw API response before transformation
 */
export const SarbRawTimeSeriesSchema = z.union([
  z.array(SarbRawDataPointSchema),
  z.object({
    SeriesName: z.string().optional(),
    seriesName: z.string().optional(),
    Frequency: z.string().optional(),
    frequency: z.string().optional(),
    DataPoints: z.array(SarbRawDataPointSchema).optional(),
    dataPoints: z.array(SarbRawDataPointSchema).optional(),
    data: z.array(SarbRawDataPointSchema).optional(),
  }),
]);

/**
 * SARB time series response schema
 */
export const SarbTimeSeriesSchema = z.object({
  seriesCode: z.string(),
  seriesName: z.string().optional(),
  frequency: z.string().optional(),
  data: z.array(SarbDataPointSchema),
});

export type SarbTimeSeries = z.infer<typeof SarbTimeSeriesSchema>;

/**
 * Economic indicators snapshot
 */
export const EconomicIndicatorsSchema = z.object({
  inflation: z.object({
    current: z.number(),
    previous: z.number(),
    trend: z.enum(['up', 'down', 'stable']),
    lastUpdated: z.string(),
  }),
  repoRate: z.object({
    current: z.number(),
    previous: z.number(),
    lastChanged: z.string(),
  }),
  primeRate: z.object({
    current: z.number(),
    lastUpdated: z.string(),
  }),
  exchangeRates: z.object({
    usdZar: z.number(),
    eurZar: z.number(),
    gbpZar: z.number(),
    lastUpdated: z.string(),
  }),
});

export type EconomicIndicators = z.infer<typeof EconomicIndicatorsSchema> & {
  isFallback?: boolean; // Indicates degraded service using fallback data
  warnings?: string[]; // Optional warnings about data quality
};

// ===== SARB SERIES CODES =====

/**
 * Official SARB data series codes for key economic indicators
 */
export const SARB_SERIES = {
  // Consumer Price Index (Inflation)
  CPI_HEADLINE: 'KBP7170N',           // Headline CPI (2016=100)
  CPI_CORE: 'KBP7171N',               // Core CPI (excl. food, fuel, energy)
  
  // Interest Rates
  REPO_RATE: 'KBP1390M',              // Repo rate
  PRIME_RATE: 'KBP1391M',             // Prime overdraft rate
  
  // Exchange Rates (ZAR per foreign currency)
  USD_ZAR: 'KBP5317M',                // US Dollar spot rate
  EUR_ZAR: 'KBP5362M',                // Euro spot rate
  GBP_ZAR: 'KBP5322M',                // British Pound spot rate
  
  // GDP
  GDP_CURRENT: 'KBP6006L',            // GDP at current prices
  GDP_CONSTANT: 'KBP6007L',           // GDP at constant prices
  
  // Government Bonds
  BOND_10YR: 'KBPP1001M',             // 10-year gov bond yield
} as const;

// ===== API CLIENT =====

export class SarbApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public seriesCode?: string
  ) {
    super(message);
    this.name = 'SarbApiError';
  }
}

export class SarbApiClient {
  private readonly baseUrl = sarbConfig.baseUrl;
  private readonly timeout = sarbConfig.timeout;
  private readonly maxRetries = sarbConfig.maxRetries;
  private readonly baseBackoffMs = sarbConfig.baseBackoffMs;
  
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
      
      // Don't retry on validation errors or 4xx errors
      if (error instanceof SarbApiError) {
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          throw error; // Client errors shouldn't be retried
        }
      }
      
      if (isLastAttempt) {
        console.error(`[SARB API] ${context} failed after ${this.maxRetries} attempts`);
        throw error;
      }
      
      // Calculate exponential backoff with jitter
      const exponentialDelay = this.baseBackoffMs * Math.pow(2, attempt);
      const jitter = Math.random() * this.baseBackoffMs;
      const delay = exponentialDelay + jitter;
      
      console.warn(`[SARB API] ${context} failed (attempt ${attempt + 1}/${this.maxRetries}), retrying in ${Math.round(delay)}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.retryWithBackoff(operation, context, attempt + 1);
    }
  }
  
  /**
   * Get CPD Rates which includes repo rate and other key rates
   * This is a verified working endpoint with Zod validation and retry logic
   */
  async getCPDRates(): Promise<SarbCPDRate[]> {
    return this.retryWithBackoff(
      async () => {
        const url = `${this.baseUrl}/WebIndicators/CPDRates`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new SarbApiError(
              `SARB API returned status ${response.status}`,
              response.status
            );
          }
          
          const rawData = await response.json();
          
          // Validate response with Zod schema
          try {
            const validatedData = SarbCPDRatesResponseSchema.parse(rawData);
            return validatedData;
          } catch (validationError) {
            console.error('[SARB API] CPD rates validation failed:', validationError);
            throw new SarbApiError(
              'Invalid response format from SARB CPDRates endpoint',
              undefined
            );
          }
        } catch (error) {
          clearTimeout(timeoutId);
          
          if (error instanceof SarbApiError) {
            throw error;
          }
          
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              throw new SarbApiError('Request timeout fetching CPD rates');
            }
            throw new SarbApiError(`Failed to fetch CPD rates: ${error.message}`);
          }
          
          throw new SarbApiError('Unknown error fetching CPD rates');
        }
      },
      'CPD Rates fetch'
    );
  }
  
  /**
   * Get HomePage Rates which includes CPI, PPI, repo rate, prime rate, and exchange rates
   * This is a verified working endpoint with comprehensive economic indicators
   * 
   * RECOMMENDED: Use this endpoint for CPI and exchange rates instead of getTimeSeries()
   */
  async getHomePageRates(): Promise<SarbHomePageRate[]> {
    return this.retryWithBackoff(
      async () => {
        const url = `${this.baseUrl}/WebIndicators/HomePageRates`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new SarbApiError(
              `SARB API returned status ${response.status}`,
              response.status
            );
          }
          
          const rawData = await response.json();
          
          // Validate response with Zod schema
          try {
            const validatedData = SarbHomePageRatesResponseSchema.parse(rawData);
            return validatedData;
          } catch (validationError) {
            console.error('[SARB API] HomePage rates validation failed:', validationError);
            throw new SarbApiError(
              'Invalid response format from SARB HomePageRates endpoint',
              undefined
            );
          }
        } catch (error) {
          clearTimeout(timeoutId);
          
          if (error instanceof SarbApiError) {
            throw error;
          }
          
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              throw new SarbApiError('Request timeout fetching HomePage rates');
            }
            throw new SarbApiError(`Failed to fetch HomePage rates: ${error.message}`);
          }
          
          throw new SarbApiError('Unknown error fetching HomePage rates');
        }
      },
      'HomePage Rates fetch'
    );
  }
  
  /**
   * Fetch time series data for a specific SARB series code
   * NOTE: This endpoint structure needs verification - use getCPDRates() for reliable data
   */
  async getTimeSeries(seriesCode: string): Promise<SarbTimeSeries> {
    return this.retryWithBackoff(
      async () => {
        const url = `${this.baseUrl}/WebIndicators/DataSeries/${seriesCode}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new SarbApiError(
              `SARB API returned status ${response.status}`,
              response.status,
              seriesCode
            );
          }
          
          const rawData: any = await response.json();
          
          // Validate raw response with Zod schema
          try {
            SarbRawTimeSeriesSchema.parse(rawData);
          } catch (validationError) {
            console.error('[SARB API] Time series validation failed for', seriesCode, validationError);
            throw new SarbApiError(
              `Invalid response format from SARB for series ${seriesCode}`,
              undefined,
              seriesCode
            );
          }
          
          // Transform SARB API response to our schema
          const timeSeries: SarbTimeSeries = {
            seriesCode,
            seriesName: rawData.SeriesName || rawData.seriesName,
            frequency: rawData.Frequency || rawData.frequency,
            data: this.transformDataPoints(rawData),
          };
          
          return SarbTimeSeriesSchema.parse(timeSeries);
          
        } catch (error) {
          clearTimeout(timeoutId);
          
          if (error instanceof SarbApiError) {
            throw error;
          }
          
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              throw new SarbApiError(
                `Request timeout fetching series ${seriesCode}`,
                undefined,
                seriesCode
              );
            }
            throw new SarbApiError(
              `Failed to fetch SARB series ${seriesCode}: ${error.message}`,
              undefined,
              seriesCode
            );
          }
          
          throw new SarbApiError(
            `Unknown error fetching series ${seriesCode}`,
            undefined,
            seriesCode
          );
        }
      },
      `Time series fetch (${seriesCode})`
    );
  }
  
  /**
   * Get the latest data point from a time series
   */
  async getLatestValue(seriesCode: string): Promise<SarbDataPoint> {
    const series = await this.getTimeSeries(seriesCode);
    
    if (!series.data || series.data.length === 0) {
      throw new SarbApiError(
        `No data available for series ${seriesCode}`,
        undefined,
        seriesCode
      );
    }
    
    // SARB data is typically in chronological order, return last element
    return series.data[series.data.length - 1];
  }
  
  /**
   * Get multiple time series in parallel
   */
  async getMultipleSeries(seriesCodes: string[]): Promise<Map<string, SarbTimeSeries>> {
    const results = await Promise.allSettled(
      seriesCodes.map(code => this.getTimeSeries(code))
    );
    
    const seriesMap = new Map<string, SarbTimeSeries>();
    
    results.forEach((result, index) => {
      const code = seriesCodes[index];
      if (result.status === 'fulfilled') {
        seriesMap.set(code, result.value);
      } else {
        console.error(`Failed to fetch series ${code}:`, result.reason);
      }
    });
    
    return seriesMap;
  }
  
  /**
   * Transform SARB API data points to our schema
   * SARB API can return data in various formats, normalize it
   */
  private transformDataPoints(data: any): SarbDataPoint[] {
    // Handle different SARB API response formats
    // SARB API returns array directly for WebIndicators/DataSeries
    const rawData = Array.isArray(data) ? data : (data.DataPoints || data.dataPoints || data.data || []);
    
    return rawData.map((point: any) => ({
      date: point.Date || point.date || point.Period || point.period,
      value: this.parseValue(point.Value || point.value),
    }));
  }
  
  /**
   * Parse value, handling null, empty strings, etc.
   */
  private parseValue(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
}

// Export singleton instance
export const sarbApi = new SarbApiClient();
