/**
 * SARB (South African Reserve Bank) Web API Client
 * 
 * Production-ready API client for accessing economic and financial data
 * from the South African Reserve Bank's public Web API.
 * 
 * API Documentation: https://custom.resbank.co.za/SarbWebApi/Help
 */

import { z } from 'zod';

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
  private readonly baseUrl = 'https://custom.resbank.co.za/SarbWebApi';
  private readonly timeout = 10000; // 10 second timeout
  
  /**
   * Get CPD Rates which includes repo rate and other key rates
   * This is a verified working endpoint
   */
  async getCPDRates(): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/WebIndicators/CPDRates`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
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
      
      return await response.json();
      
    } catch (error) {
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
  }
  
  /**
   * Fetch time series data for a specific SARB series code
   * NOTE: This endpoint structure needs verification - use getCPDRates() for reliable data
   */
  async getTimeSeries(seriesCode: string): Promise<SarbTimeSeries> {
    try {
      // Correct endpoint structure from SARB API documentation
      const url = `${this.baseUrl}/WebIndicators/DataSeries/${seriesCode}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
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
      
      const data: any = await response.json();
      
      // Transform SARB API response to our schema
      const timeSeries: SarbTimeSeries = {
        seriesCode,
        seriesName: data.SeriesName || data.seriesName,
        frequency: data.Frequency || data.frequency,
        data: this.transformDataPoints(data),
      };
      
      return SarbTimeSeriesSchema.parse(timeSeries);
      
    } catch (error) {
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
