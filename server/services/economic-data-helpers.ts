/**
 * Helper functions for processing SARB API responses
 */

import { sarbApi, SARB_SERIES, type SarbTimeSeries } from './sarb-api';
import { cache } from './cache';

/**
 * Historical rate cache to persist last 2 observations
 * Keyed by rate type (e.g., 'repo_rate')
 */
interface HistoricalRateCache {
  current: number;
  previous: number | null;
  lastChanged: string;
  fetchedAt: string;
}

/**
 * Extract rate information from CPD Rates response with historical data enrichment
 * Now fetches historical data from SARB getTimeSeries for accurate previous values
 */
export async function extractFromCPDRates(
  cpdRates: any[],
  ...keywords: string[]
): Promise<{ current: number; previous: number; lastChanged: string } | null> {
  if (!cpdRates || !Array.isArray(cpdRates) || cpdRates.length === 0) {
    return null;
  }
  
  // Find entry matching all keywords (case-insensitive)
  const matchingEntry = cpdRates.find(entry => {
    const name = (entry.Name || '').toLowerCase();
    return keywords.every(keyword => name.includes(keyword.toLowerCase()));
  });
  
  if (!matchingEntry) {
    return null;
  }
  
  const current = parseFloat(matchingEntry.Value);
  const date = matchingEntry.Date;
  
  if (isNaN(current)) {
    return null;
  }
  
  // Try to enrich with historical data for accurate previous value
  try {
    const historicalData = await fetchHistoricalRepoRate(current, date);
    
    return {
      current,
      previous: historicalData.previous,
      lastChanged: date || new Date().toISOString(),
    };
  } catch (error) {
    console.warn('[EconomicDataHelpers] Failed to fetch historical data:', error);
    
    // Fallback: return current value with null previous (will trigger warning in service)
    return {
      current,
      previous: current, // Fallback to current when historical data unavailable
      lastChanged: date || new Date().toISOString(),
    };
  }
}

/**
 * Fetch historical repo rate data from SARB time series API
 * Uses cache to minimize API calls and persist last 2 observations
 * 
 * CRITICAL: Aligns with CPD observation date to ensure consistency between CPD and time series
 * Finds the previous DISTINCT value from SARB time series to enable proper trend calculation
 */
async function fetchHistoricalRepoRate(
  currentValue: number,
  currentDate: string
): Promise<{ current: number; previous: number }> {
  const cacheKey = `economic:historical:repo_rate:${currentDate}`;
  
  // Check cache first - keyed by date to ensure CPD/SARB alignment
  const cached = cache.get<HistoricalRateCache>(cacheKey);
  
  if (cached && Math.abs(cached.current - currentValue) < 0.001) {
    return {
      current: cached.current,
      previous: cached.previous || cached.current,
    };
  }
  
  // Fetch from SARB time series API
  try {
    const timeSeries = await sarbApi.getTimeSeries(SARB_SERIES.REPO_RATE);
    
    // SARB DataSeries returns data in ascending order (oldest first)
    // Filter non-null values
    const validData = timeSeries.data
      .filter(point => point.value !== null && point.value !== undefined);
    
    if (validData.length === 0) {
      throw new Error('No valid historical data found');
    }
    
    // Parse CPD date to find matching or most recent observation on or before CPD date
    const cpdDate = new Date(currentDate);
    const threshold = 0.001; // Consider values within 0.001% as same (rounding tolerance)
    
    // Find the observation at or before CPD date that matches current value
    let currentIndex = -1;
    for (let i = validData.length - 1; i >= 0; i--) {
      const pointDate = new Date(validData[i].date);
      if (pointDate <= cpdDate) {
        // Found an observation on or before CPD date
        if (Math.abs(validData[i].value! - currentValue) < threshold) {
          currentIndex = i;
          break;
        }
      }
    }
    
    // If no exact match found, use the most recent observation before CPD date
    if (currentIndex === -1) {
      for (let i = validData.length - 1; i >= 0; i--) {
        const pointDate = new Date(validData[i].date);
        if (pointDate <= cpdDate) {
          currentIndex = i;
          break;
        }
      }
    }
    
    // If still no match, use latest (CPD might be ahead of time series)
    if (currentIndex === -1) {
      currentIndex = validData.length - 1;
    }
    
    const currentObservation = validData[currentIndex];
    
    // Find previous DISTINCT value by iterating backwards from current observation
    let previousValue: number | null = null;
    
    for (let i = currentIndex - 1; i >= 0; i--) {
      const point = validData[i];
      if (point.value !== null && Math.abs(point.value - currentObservation.value!) > threshold) {
        previousValue = point.value;
        break;
      }
    }
    
    // If no distinct previous value found, use current
    if (previousValue === null) {
      previousValue = currentObservation.value!;
    }
    
    // Cache the result with date-specific key
    const historicalCache: HistoricalRateCache = {
      current: currentObservation.value!,
      previous: previousValue,
      lastChanged: currentDate,
      fetchedAt: new Date().toISOString(),
    };
    
    cache.set(cacheKey, historicalCache, 7200); // Cache for 2 hours
    
    return {
      current: currentObservation.value!,
      previous: previousValue,
    };
    
  } catch (error) {
    console.error('[EconomicDataHelpers] Failed to fetch time series:', error);
    
    // Use cached value if available, otherwise return current
    if (cached) {
      return {
        current: currentValue,
        previous: cached.previous || currentValue,
      };
    }
    
    // Return current value as both current and previous (no trend available)
    return {
      current: currentValue,
      previous: currentValue,
    };
  }
}
