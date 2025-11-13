/**
 * Municipal & Property Tax API Routes
 * 
 * RESTful API endpoints for municipal data and property tax calculations.
 * 
 * ENDPOINTS:
 * - GET /api/municipal/municipalities - List all municipalities
 * - GET /api/municipal/municipalities/:code - Get municipality by code
 * - POST /api/municipal/calculate - Calculate property tax
 * - POST /api/municipal/compare - Compare municipalities
 */

import { Router } from 'express';
import {
  getAllMunicipalities,
  getMunicipalityByCode,
  calculatePropertyTax,
  compareMunicipalities,
} from '../services/municipal-data';
import {
  propertyTaxCalculationSchema,
  municipalityComparisonSchema,
} from '../../shared/schema';

const router = Router();

/**
 * GET /api/municipal/municipalities
 * List all municipalities
 */
router.get('/municipalities', async (req, res) => {
  try {
    const municipalities = await getAllMunicipalities();
    
    res.json({
      success: true,
      data: municipalities,
      count: municipalities.length,
    });
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch municipalities',
    });
  }
});

/**
 * GET /api/municipal/municipalities/:code
 * Get municipality by code
 */
router.get('/municipalities/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const municipality = await getMunicipalityByCode(code.toUpperCase());
    
    if (!municipality) {
      return res.status(404).json({
        success: false,
        error: `Municipality ${code} not found`,
      });
    }
    
    res.json({
      success: true,
      data: municipality,
    });
  } catch (error) {
    console.error('Error fetching municipality:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch municipality',
    });
  }
});

/**
 * POST /api/municipal/calculate
 * Calculate property tax for a single municipality
 */
router.post('/calculate', async (req, res) => {
  try {
    const validation = propertyTaxCalculationSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validation.error.errors,
      });
    }
    
    const result = await calculatePropertyTax(validation.data);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error calculating property tax:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate property tax',
    });
  }
});

/**
 * POST /api/municipal/compare
 * Compare property taxes across multiple municipalities
 */
router.post('/compare', async (req, res) => {
  try {
    const validation = municipalityComparisonSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validation.error.errors,
      });
    }
    
    const results = await compareMunicipalities(validation.data);
    
    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error comparing municipalities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare municipalities',
    });
  }
});

export default router;
