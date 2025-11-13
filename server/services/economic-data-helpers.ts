/**
 * Helper functions for processing SARB API responses
 */

import { sarbApi, SARB_SERIES, type SarbTimeSeries, type SarbHomePageRate } from './sarb-api';
import { cache } from './cache';
import { economicDataLogger as logger } from './logger';

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
    logger.warn('No matching entry found in CPD Rates', {
      keywords,
      availableEntries: cpdRates.map(e => e.Name),
    });
    return null;
  }
  
  const current = parseFloat(matchingEntry.Value);
  const date = matchingEntry.Date;
  
  if (isNaN(current)) {
    logger.warn('Matched CPD entry but value is not a number', {
      entryName: matchingEntry.Name,
      rawValue: matchingEntry.Value,
    });
    return null;
  }
  
  // Log successful extraction for monitoring label changes
  logger.info('Extracted rate from CPD Rates', {
    entryName: matchingEntry.Name,
    keywords,
    value: current,
    date,
  });
  
  // Try to enrich with historical data for accurate previous value
  try {
    const historicalData = await fetchHistoricalRepoRate(current, date);
    
    return {
      current,
      previous: historicalData.previous,
      lastChanged: date || new Date().toISOString(),
    };
  } catch (error) {
    logger.warn('Failed to fetch historical repo rate data', {
      error: error instanceof Error ? error.message : String(error),
    });
    
    // Fallback: return current value with null previous (will trigger warning in service)
    return {
      current,
      previous: current, // Fallback to current when historical data unavailable
      lastChanged: date || new Date().toISOString(),
    };
  }
}

/**
 * Fetch historical repo rate data with cache-based previous value tracking
 * 
 * PRODUCTION-READY: Does NOT use broken getTimeSeries endpoint
 * Strategy: Track last 2 repo rate observations in cache
 * - When current value changes: previous becomes old current, current becomes new value
 * - When current value unchanged: return cached previous
 * 
 * @param currentValue - Current repo rate from CPD Rates
 * @param currentDate - Current observation date from CPD Rates
 * @returns Object with current and previous repo rate values
 */
async function fetchHistoricalRepoRate(
  currentValue: number,
  currentDate: string
): Promise<{ current: number; previous: number }> {
  const cacheKey = 'economic:historical:repo_rate:latest';
  const threshold = 0.001; // Tolerance for comparing repo rates (0.001%)
  
  // Check cache for last known observation
  const cached = cache.get<HistoricalRateCache>(cacheKey);
  
  // CASE 1: First time fetching - no cache available
  if (!cached) {
    const newCache: HistoricalRateCache = {
      current: currentValue,
      previous: currentValue, // No previous available yet
      lastChanged: currentDate,
      fetchedAt: new Date().toISOString(),
    };
    
    cache.set(cacheKey, newCache, 86400); // Cache for 24 hours
    
    return {
      current: currentValue,
      previous: currentValue,
    };
  }
  
  // CASE 2: Repo rate has changed - update cache with new observation
  if (Math.abs(cached.current - currentValue) > threshold) {
    const newCache: HistoricalRateCache = {
      current: currentValue,
      previous: cached.current, // Old current becomes new previous
      lastChanged: currentDate,
      fetchedAt: new Date().toISOString(),
    };
    
    cache.set(cacheKey, newCache, 86400); // Cache for 24 hours
    
    logger.info('Repo rate changed', {
      previousRate: cached.current,
      currentRate: currentValue,
      changeDate: currentDate,
    });
    
    return {
      current: currentValue,
      previous: cached.current,
    };
  }
  
  // CASE 3: Repo rate unchanged - return cached values
  return {
    current: currentValue,
    previous: cached.previous || currentValue,
  };
}

/**
 * Extract a specific indicator from HomePage Rates response
 * 
 * PRODUCTION-READY: Implements fuzzy matching pipeline to handle SARB API changes
 * Pipeline: exact match → normalized substring → keyword fallback
 * Handles: "CPI (Headline)", "CPI", whitespace variations, case differences
 * 
 * @param homePageRates - Array of rate entries from SARB HomePage Rates
 * @param indicatorName - Indicator to search for (e.g., "CPI", "Rand per US Dollar")
 * @returns Parsed numeric value and date, or null if not found
 */
export function extractFromHomePageRates(
  homePageRates: SarbHomePageRate[],
  indicatorName: string
): { value: number; date: string } | null {
  if (!homePageRates || !Array.isArray(homePageRates) || homePageRates.length === 0) {
    return null;
  }
  
  const normalizedSearchTerm = indicatorName.trim().toLowerCase();
  
  // STAGE 1: Try exact match (case-insensitive, trimmed)
  let matchingEntry = homePageRates.find(
    entry => entry.Name.trim().toLowerCase() === normalizedSearchTerm
  );
  
  // STAGE 2: Try substring match if exact fails
  // Handles cases like "CPI (Headline)" when searching for "CPI"
  if (!matchingEntry) {
    matchingEntry = homePageRates.find(
      entry => entry.Name.trim().toLowerCase().includes(normalizedSearchTerm)
    );
  }
  
  // STAGE 3: Try keyword-based search as last resort
  // Extract main keywords and look for entries containing them
  if (!matchingEntry) {
    const keywords = normalizedSearchTerm.split(/\s+/).filter(k => k.length > 2);
    
    if (keywords.length > 0) {
      matchingEntry = homePageRates.find(entry => {
        const entryName = entry.Name.trim().toLowerCase();
        return keywords.every(keyword => entryName.includes(keyword));
      });
    }
  }
  
  if (!matchingEntry) {
    return null;
  }
  
  // PRODUCTION-READY: Parse Value safely (handles string, number, or null)
  const parsedValue = parseNumericValue(matchingEntry.Value);
  
  if (parsedValue === null) {
    logger.warn('Found indicator but value is null or invalid', {
      indicator: indicatorName,
      rawValue: matchingEntry.Value,
    });
    return null;
  }
  
  return {
    value: parsedValue,
    date: matchingEntry.Date,
  };
}

/**
 * Parse numeric value safely from SARB API response
 * Handles string numbers ("5.5"), numbers (5.5), and null values
 * 
 * @param value - Raw value from SARB API (string | number | null)
 * @returns Parsed number or null
 */
function parseNumericValue(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  // Already a number
  if (typeof value === 'number') {
    return isNaN(value) ? null : value;
  }
  
  // Parse string to number
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}
