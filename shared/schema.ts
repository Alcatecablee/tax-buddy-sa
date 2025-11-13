import { z } from "zod";

export const taxCalculationSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional().nullable(),
  taxYear: z.string(),
  ageCategory: z.enum(["under_65", "65_to_74", "75_plus"]),
  salaryIncome: z.number().default(0),
  freelanceIncome: z.number().default(0),
  rentalIncome: z.number().default(0),
  investmentIncome: z.number().default(0),
  retirementContributions: z.number().default(0),
  medicalAidContributions: z.number().default(0),
  medicalExpenses: z.number().default(0),
  charitableDonations: z.number().default(0),
  payePaid: z.number().default(0),
  provisionalTaxPaid: z.number().default(0),
  totalIncome: z.number().optional(),
  taxableIncome: z.number().optional(),
  totalTaxOwed: z.number().optional(),
  totalTaxPaid: z.number().optional(),
  refundAmount: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TaxCalculation = z.infer<typeof taxCalculationSchema>;

export const insertTaxCalculationSchema = taxCalculationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTaxCalculation = z.infer<typeof insertTaxCalculationSchema>;

/**
 * Municipality Schema
 * Reference data for South African municipalities
 */
export const municipalitySchema = z.object({
  code: z.string(),
  name: z.string(),
  province: z.string(),
  category: z.enum(['metro', 'district', 'local']),
  population: z.number().optional(),
  rateFreeThreshold: z.number().default(50000),
  lastUpdated: z.string().optional(),
});

export type Municipality = z.infer<typeof municipalitySchema>;

/**
 * Property Tax Rate Schema (Enhanced with Provenance)
 * Tax rates for different property categories by municipality
 * 
 * Phase 2: Uses validated fallback data with documented sources
 * Phase 3: Will support manual overrides via admin interface
 */
export const propertyTaxRateSchema = z.object({
  municipalityCode: z.string(),
  financialYear: z.string(),
  category: z.enum(['residential', 'commercial', 'industrial', 'agricultural', 'vacant_land']),
  rate: z.number(),
  rateFreeThreshold: z.number().default(50000),
  
  source: z.enum(['manual_override', 'validated_fallback', 'api']).default('validated_fallback'),
  sourceUrl: z.string().optional(),
  lastValidated: z.string().optional(),
  validatedBy: z.string().optional(),
  notes: z.string().optional(),
  effectiveDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

export type PropertyTaxRate = z.infer<typeof propertyTaxRateSchema>;

/**
 * Property Tax Calculation Input Schema
 */
export const propertyTaxCalculationSchema = z.object({
  municipalityCode: z.string().min(1, "Municipality is required"),
  propertyValue: z.number().min(0, "Property value must be positive"),
  propertyCategory: z.enum(['residential', 'commercial', 'industrial', 'agricultural', 'vacant_land']),
  financialYear: z.string().default("2024/2025"),
  rebates: z.object({
    pensioner: z.boolean().default(false),
    disabled: z.boolean().default(false),
    lowIncome: z.boolean().default(false),
  }).optional(),
});

export type PropertyTaxCalculation = z.infer<typeof propertyTaxCalculationSchema>;

/**
 * Property Tax Result Schema (Enhanced with Full Provenance)
 * CRITICAL: Must include ALL provenance fields for Phase 2/3 admin transparency
 */
export const propertyTaxResultSchema = z.object({
  municipalityName: z.string(),
  propertyValue: z.number(),
  propertyCategory: z.string(),
  taxRate: z.number(),
  rateFreeThreshold: z.number(),
  taxableValue: z.number(),
  annualTax: z.number(),
  monthlyTax: z.number(),
  appliedRebates: z.array(z.string()).optional(),
  totalRebateAmount: z.number().optional(),
  netAnnualTax: z.number(),
  netMonthlyTax: z.number(),
  
  dataSource: z.string().optional(),
  lastValidated: z.string().optional(),
  sourceUrl: z.string().optional(),
  effectiveDate: z.string().optional(),
  expiryDate: z.string().optional(),
  validatedBy: z.string().optional(),
  notes: z.string().optional(),
});

export type PropertyTaxResult = z.infer<typeof propertyTaxResultSchema>;

/**
 * Municipality Comparison Input Schema
 */
export const municipalityComparisonSchema = z.object({
  municipalityCodes: z.array(z.string()).min(2, "Select at least 2 municipalities").max(5, "Maximum 5 municipalities"),
  propertyValue: z.number().min(0, "Property value must be positive"),
  propertyCategory: z.enum(['residential', 'commercial', 'industrial', 'agricultural', 'vacant_land']),
  financialYear: z.string().default("2024/2025"),
});

export type MunicipalityComparison = z.infer<typeof municipalityComparisonSchema>;
