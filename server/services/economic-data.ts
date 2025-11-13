/**
 * Economic Data Service
 * 
 * High-level service for accessing and processing economic data from SARB API.
 * Provides business logic for economic indicators used in tax planning.
 */

import { sarbApi, SARB_SERIES, type EconomicIndicators, type SarbTimeSeries } from './sarb-api';
import { extractFromCPDRates } from './economic-data-helpers';

export class EconomicDataService {
  /**
   * Extract rate data from CPD rates array
   */
  private extractFromCPDRates = extractFromCPDRates;
  /**
   * Get comprehensive economic indicators snapshot
   * This is the main method used by the frontend for dashboard display
   */
  async getEconomicIndicators(): Promise<EconomicIndicators> {
    // Conservative fallback data with static timestamps (used when SARB API is unavailable)
    // These timestamps represent the last known good data point, not current time
    const fallbackData: EconomicIndicators = {
      inflation: {
        current: 4.5,
        previous: 4.7,
        trend: 'down' as const,
        lastUpdated: '2025-09-15T00:00:00.000Z', // Static timestamp for fallback
      },
      repoRate: {
        current: 7.75,
        previous: 8.25,
        lastChanged: '2025-09-18T00:00:00.000Z', // Last known repo rate change
      },
      primeRate: {
        current: 11.25,
        lastUpdated: '2025-09-18T00:00:00.000Z', // Matches repo rate change
      },
      exchangeRates: {
        usdZar: 18.65,
        eurZar: 19.85,
        gbpZar: 23.45,
        lastUpdated: '2025-09-15T00:00:00.000Z', // Static timestamp for fallback
      },
      isFallback: true,
      warnings: ['SARB API unavailable - using fallback data from September 2025'],
    };
    
    try {
      // Fetch real data from SARB API
      const cpdRates = await sarbApi.getCPDRates();
      
      // Parse CPD rates to extract repo rate (current and previous)
      // "Interest charged" is the repo rate from SARB
      const repoRateData = this.extractFromCPDRates(cpdRates, 'charged');
      
      if (!repoRateData) {
        // SARB API returned but no repo rate data found
        return {
          ...fallbackData,
          warnings: ['SARB API returned unexpected format - using fallback data'],
        };
      }
      
      // Successfully got real data - merge with fallback for fields not yet integrated
      const warnings: string[] = [];
      if (!repoRateData.previous || repoRateData.previous === repoRateData.current) {
        warnings.push('Repo rate historical data unavailable - trend may be inaccurate');
      }
      
      return {
        inflation: fallbackData.inflation, // TODO: Integrate from Stats SA
        repoRate: {
          current: repoRateData.current,
          previous: repoRateData.previous,
          lastChanged: repoRateData.lastChanged,
        },
        primeRate: {
          current: repoRateData.current + 3.5, // Prime = Repo + 3.5%
          lastUpdated: repoRateData.lastChanged, // Use repo rate timestamp
        },
        exchangeRates: fallbackData.exchangeRates, // TODO: Integrate from SARB
        isFallback: false,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
      
    } catch (error) {
      // Graceful degradation: return fallback data when SARB API is unavailable
      console.error('[EconomicDataService] SARB API unavailable, using fallback data:', error);
      return fallbackData;
    }
  }
  
  /**
   * Calculate inflation rate and trend from CPI data
   */
  private calculateInflation(cpiSeries?: SarbTimeSeries) {
    if (!cpiSeries || cpiSeries.data.length < 2) {
      // Return sensible defaults if data unavailable
      return {
        current: 4.5,
        previous: 4.6,
        trend: 'stable' as const,
        lastUpdated: new Date().toISOString(),
      };
    }
    
    const data = cpiSeries.data.filter(d => d.value !== null);
    
    if (data.length < 2) {
      return {
        current: 4.5,
        previous: 4.6,
        trend: 'stable' as const,
        lastUpdated: new Date().toISOString(),
      };
    }
    
    // Get latest and previous CPI values
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const yearAgo = data.length >= 13 ? data[data.length - 13] : previous;
    
    // Calculate year-over-year inflation rate
    const current = yearAgo.value && latest.value
      ? ((latest.value - yearAgo.value) / yearAgo.value) * 100
      : 4.5;
    
    const prevInflation = previous.value && yearAgo.value
      ? ((previous.value - yearAgo.value) / yearAgo.value) * 100
      : 4.6;
    
    // Determine trend
    let trend: 'up' | 'down' | 'stable';
    const difference = current - prevInflation;
    
    if (Math.abs(difference) < 0.1) {
      trend = 'stable';
    } else if (difference > 0) {
      trend = 'up';
    } else {
      trend = 'down';
    }
    
    return {
      current: Math.round(current * 10) / 10, // Round to 1 decimal
      previous: Math.round(prevInflation * 10) / 10,
      trend,
      lastUpdated: latest.date,
    };
  }
  
  /**
   * Extract rate data with previous value for comparison
   */
  private extractRateData(series?: SarbTimeSeries, rateName: string = 'Rate') {
    if (!series || series.data.length === 0) {
      return {
        current: 7.75,
        previous: 8.25,
        lastChanged: new Date().toISOString(),
      };
    }
    
    const data = series.data.filter(d => d.value !== null);
    
    if (data.length === 0) {
      return {
        current: 7.75,
        previous: 8.25,
        lastChanged: new Date().toISOString(),
      };
    }
    
    const latest = data[data.length - 1];
    const previous = data.length >= 2 ? data[data.length - 2] : latest;
    
    return {
      current: latest.value ?? 7.75,
      previous: previous.value ?? 8.25,
      lastChanged: latest.date,
    };
  }
  
  /**
   * Extract simple rate (no previous comparison needed)
   */
  private extractSimpleRate(series?: SarbTimeSeries, rateName: string = 'Rate') {
    if (!series || series.data.length === 0) {
      return {
        current: 11.25,
        lastUpdated: new Date().toISOString(),
      };
    }
    
    const data = series.data.filter(d => d.value !== null);
    
    if (data.length === 0) {
      return {
        current: 11.25,
        lastUpdated: new Date().toISOString(),
      };
    }
    
    const latest = data[data.length - 1];
    
    return {
      current: latest.value ?? 11.25,
      lastUpdated: latest.date,
    };
  }
  
  /**
   * Get historical data for a specific series (for premium users)
   */
  async getHistoricalData(
    seriesCode: string,
    monthsBack: number = 12
  ): Promise<SarbTimeSeries> {
    const series = await sarbApi.getTimeSeries(seriesCode);
    
    // Filter to last N months
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
    
    const filteredData = series.data.filter(point => {
      const pointDate = new Date(point.date);
      return pointDate >= cutoffDate;
    });
    
    return {
      ...series,
      data: filteredData,
    };
  }
  
  /**
   * Get tax planning tips based on current economic indicators
   */
  async getTaxPlanningTips(): Promise<string[]> {
    const indicators = await this.getEconomicIndicators();
    const tips: string[] = [];
    
    // Inflation-based tips
    if (indicators.inflation.current > 5.5) {
      tips.push(
        `With inflation at ${indicators.inflation.current}%, consider maximizing your retirement contributions (up to 27.5% of income) to get tax deductions on pre-inflation earnings.`
      );
    } else if (indicators.inflation.current < 3.5) {
      tips.push(
        `Low inflation (${indicators.inflation.current}%) means your money goes further - a great time to review investment income strategies and consider tax-free savings accounts.`
      );
    }
    
    // Interest rate tips
    if (indicators.repoRate.current > 7.5) {
      tips.push(
        `Repo rate is ${indicators.repoRate.current}% - if you have a bond, check if additional payments qualify for interest deductions under Section 24J.`
      );
    }
    
    if (indicators.repoRate.current < indicators.repoRate.previous) {
      tips.push(
        `Repo rate decreased from ${indicators.repoRate.previous}% to ${indicators.repoRate.current}% - review your investment strategy and consider locking in rates on savings.`
      );
    }
    
    // Exchange rate tips
    if (indicators.exchangeRates.usdZar > 18) {
      tips.push(
        `Rand is weak (R${indicators.exchangeRates.usdZar}/USD) - if you earn foreign income, now is an optimal time to declare and pay tax to maximize ZAR value.`
      );
    } else if (indicators.exchangeRates.usdZar < 17) {
      tips.push(
        `Rand is strong (R${indicators.exchangeRates.usdZar}/USD) - good time for foreign investments, but remember capital gains tax implications.`
      );
    }
    
    // General tip
    tips.push(
      `Medical aid contributions qualify for tax credits of R364/month for you and R246 for each dependent. Make sure these are captured correctly.`
    );
    
    return tips;
  }
  
  /**
   * Helper: Get latest non-null value from series
   */
  private getLatestNonNull(series?: SarbTimeSeries): number | null {
    if (!series || series.data.length === 0) return null;
    
    const nonNullData = series.data.filter(d => d.value !== null);
    if (nonNullData.length === 0) return null;
    
    return nonNullData[nonNullData.length - 1].value;
  }
  
  /**
   * Helper: Get latest date from series
   */
  private getLatestDate(series?: SarbTimeSeries): string | null {
    if (!series || series.data.length === 0) return null;
    
    const nonNullData = series.data.filter(d => d.value !== null);
    if (nonNullData.length === 0) return null;
    
    return nonNullData[nonNullData.length - 1].date;
  }
}

// Export singleton instance
export const economicDataService = new EconomicDataService();
