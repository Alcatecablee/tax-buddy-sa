/**
 * Economic Data API Routes
 * 
 * RESTful endpoints for accessing SARB economic data
 */

import { Router, type Request, type Response } from 'express';
import { economicDataService } from '../services/economic-data';
import { sarbApi, SARB_SERIES } from '../services/sarb-api';
import { cached } from '../services/cache';

const router = Router();

/**
 * GET /api/economic/indicators
 * Get comprehensive economic indicators snapshot
 * 
 * This is the main endpoint for the dashboard.
 * Results are cached for 1 hour to minimize API calls and improve performance.
 */
router.get('/indicators', async (req: Request, res: Response) => {
  try {
    const indicators = await cached(
      'economic:indicators',
      () => economicDataService.getEconomicIndicators(),
      3600 // 1 hour cache
    );
    
    res.json({
      success: true,
      data: indicators,
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
      21600 // 6 hours cache
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
    if (!validSeries.includes(series)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid series code',
        message: `Valid series: ${validSeries.join(', ')}`,
      });
    }
    
    const data = await cached(
      `economic:historical:${series}:${months}`,
      () => economicDataService.getHistoricalData(series as any, months),
      7200 // 2 hours cache for historical data
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
      3600 // 1 hour cache
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
