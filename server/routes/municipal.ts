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
  propertyTaxRateSchema,
} from '../../shared/schema';
import type { IStorage } from '../storage';
import { requireAdmin } from '../middleware/auth';

const router = Router();

let storageInstance: IStorage | null = null;

export function setMunicipalStorage(storage: IStorage) {
  storageInstance = storage;
}

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

/**
 * POST /api/municipal/rates
 * Create or update manual override property tax rate (Phase 2/3 - Admin only)
 * 
 * SECURITY: Protected by Supabase Auth middleware with admin role requirement
 * Only authenticated users with role='admin' can access this endpoint
 */
router.post('/rates', requireAdmin, async (req, res) => {
  try {
    if (!storageInstance) {
      return res.status(503).json({
        success: false,
        error: 'Storage not initialized',
      });
    }
    
    const validation = propertyTaxRateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property tax rate data',
        details: validation.error.errors,
      });
    }
    
    const rateData = validation.data;
    
    const existingRate = await storageInstance.getPropertyTaxRate(
      rateData.municipalityCode,
      rateData.category,
      rateData.financialYear
    );
    
    let result;
    if (existingRate) {
      result = await storageInstance.updatePropertyTaxRate(
        rateData.municipalityCode,
        rateData.category,
        rateData.financialYear,
        rateData
      );
      
      res.json({
        success: true,
        data: result,
        message: 'Property tax rate updated successfully',
      });
    } else {
      result = await storageInstance.createPropertyTaxRate(rateData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Property tax rate created successfully',
      });
    }
  } catch (error) {
    console.error('Error creating/updating property tax rate:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save property tax rate',
    });
  }
});

/**
 * GET /api/municipal/rates
 * Get all manual override property tax rates (Phase 2/3 - Admin only)
 * 
 * SECURITY: Protected by Supabase Auth middleware with admin role requirement
 * Only authenticated users with role='admin' can access this endpoint
 */
router.get('/rates', requireAdmin, async (req, res) => {
  try {
    if (!storageInstance) {
      return res.status(503).json({
        success: false,
        error: 'Storage not initialized',
      });
    }
    
    const rates = await storageInstance.getAllPropertyTaxRates();
    
    res.json({
      success: true,
      data: rates,
      count: rates.length,
    });
  } catch (error) {
    console.error('Error fetching property tax rates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property tax rates',
    });
  }
});

export default router;
