/**
 * Economic Data API Routes
 * 
 * RESTful endpoints for accessing SARB economic data
 */

import { Router, type Request, type Response } from 'express';
import { economicDataService } from '../services/economic-data';
import { sarbApi, SARB_SERIES } from '../services/sarb-api';
import { cached, cachedWithMetadata } from '../services/cache';
import { cacheConfig } from '../config';

const router = Router();

/**
 * GET /api/economic/indicators
 * Get comprehensive economic indicators snapshot with data quality transparency
 * 
 * This is the main endpoint for the dashboard.
 * Results are cached for 1 hour to minimize API calls and improve performance.
 * 
 * Response includes transparency fields:
 * - degraded: true if using fallback/stale data
 * - source: 'live' | 'fallback' | 'stale-cache'
 * - dataAge: ISO timestamp of last successful live fetch
 * - nextRefreshEta: ISO timestamp of next planned refresh
 */
router.get('/indicators', async (req: Request, res: Response) => {
  try {
    const { data: indicators, metadata } = await cachedWithMetadata(
      'economic:indicators',
      () => economicDataService.getEconomicIndicators(),
      cacheConfig.indicatorsTtl
    );
    
    // Determine if service is degraded
    const isDegraded = indicators.isFallback || 
                       (metadata?.source !== 'live' && metadata?.source !== undefined);
    
    // Calculate data age
    const dataAge = metadata?.lastLiveFetch || 
                    metadata?.lastFallbackAt || 
                    new Date().toISOString();
    
    // Surface warnings and transparency info at response level
    res.json({
      success: true,
      data: indicators,
      ...(indicators.warnings && { warnings: indicators.warnings }),
      ...(indicators.isFallback && { isFallback: true }),
      ...(isDegraded && { degraded: true }),
      source: metadata?.source || (indicators.isFallback ? 'fallback' : 'live'),
      dataAge,
      ...(metadata?.nextRefreshEta && { nextRefreshEta: metadata.nextRefreshEta }),
    });
    
  } catch (error) {
    console.error('[API] Error fetching economic indicators:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch economic indicators',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/economic/tips
 * Get personalized tax planning tips based on current economic conditions
 * 
 * Cached for 6 hours as tips don't change as frequently.
 */
router.get('/tips', async (req: Request, res: Response) => {
  try {
    const tips = await cached(
      'economic:tips',
      () => economicDataService.getTaxPlanningTips(),
      cacheConfig.tipsTtl
    );
    
    res.json({
      success: true,
      data: tips,
    });
    
  } catch (error) {
    console.error('[API] Error fetching tax tips:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tax planning tips',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/economic/historical/:series
 * Get historical data for a specific SARB series
 * 
 * PREMIUM FEATURE - Consider adding auth middleware later
 * 
 * Query params:
 *   - months: Number of months of historical data (default: 12, max: 60)
 */
router.get('/historical/:series', async (req: Request, res: Response) => {
  try {
    const { series } = req.params;
    const months = Math.min(
      parseInt(req.query.months as string) || 12,
      60 // Max 5 years
    );
    
    // Validate series code
    const validSeries = Object.values(SARB_SERIES);
    if (!validSeries.includes(series as any)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid series code',
        message: `Valid series: ${validSeries.join(', ')}`,
      });
    }
    
    const data = await cached(
      `economic:historical:${series}:${months}`,
      () => economicDataService.getHistoricalData(series as any, months),
      cacheConfig.historicalTtl
    );
    
    res.json({
      success: true,
      data,
    });
    
  } catch (error) {
    console.error('[API] Error fetching historical data:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/economic/series/:code
 * Get raw time series data for a specific SARB series code
 * 
 * This is a lower-level endpoint for advanced users.
 */
router.get('/series/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    
    const data = await cached(
      `economic:series:${code}`,
      () => sarbApi.getTimeSeries(code),
      cacheConfig.seriesTtl
    );
    
    res.json({
      success: true,
      data,
    });
    
  } catch (error) {
    console.error('[API] Error fetching series data:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch series data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/economic/health
 * Health check endpoint for economic data service
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Try to fetch a simple series to verify SARB API is accessible
    await sarbApi.getLatestValue(SARB_SERIES.REPO_RATE);
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
