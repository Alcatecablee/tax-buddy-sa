/**
 * Helper functions for processing SARB API responses
 */

/**
 * Extract rate information from CPD Rates response
 */
export function extractFromCPDRates(
  cpdRates: any[],
  ...keywords: string[]
): { current: number; previous: number; lastChanged: string } | null {
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
  
  // For previous value, we'd need historical data
  // For now, use a reasonable estimate
  return {
    current,
    previous: current, // TODO: Fetch historical data for actual previous value
    lastChanged: date || new Date().toISOString(),
  };
}
