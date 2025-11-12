// South African Tax Calculator Engine - 2024/2025 Tax Year
// Based on official SARS tax brackets and regulations

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  baseAmount: number;
}

export interface TaxThresholds {
  primary: number;
  secondary: number; // 65-74 years
  tertiary: number;  // 75+ years
}

// 2024/2025 Tax Year Brackets (March 2024 - February 2025)
export const TAX_BRACKETS_2024: TaxBracket[] = [
  { min: 0, max: 237100, rate: 0.18, baseAmount: 0 },
  { min: 237101, max: 370500, rate: 0.26, baseAmount: 42678 },
  { min: 370501, max: 512800, rate: 0.31, baseAmount: 77362 },
  { min: 512801, max: 673000, rate: 0.36, baseAmount: 121475 },
  { min: 673001, max: 857900, rate: 0.39, baseAmount: 179147 },
  { min: 857901, max: 1817000, rate: 0.41, baseAmount: 251258 },
  { min: 1817001, max: null, rate: 0.45, baseAmount: 644489 }
];

// Tax thresholds (below these amounts, no tax is payable)
export const TAX_THRESHOLDS_2024: TaxThresholds = {
  primary: 95750,    // Under 65
  secondary: 148217,  // 65-74 years
  tertiary: 165689    // 75+ years
};

// Rebates for 2024/2025
export const TAX_REBATES_2024 = {
  primary: 17235,    // All taxpayers
  secondary: 9444,   // 65-74 years (additional)
  tertiary: 3145     // 75+ years (additional)
};

// Medical aid tax credits (per month)
export const MEDICAL_AID_CREDITS_2024 = {
  mainMember: 364,
  firstDependent: 364,
  additionalDependents: 246
};

export interface IncomeInputs {
  salary: number;
  freelance: number;
  rental: number;
  investment: number;
}

export interface DeductionInputs {
  retirementContributions: number;
  medicalAidContributions: number;
  medicalExpenses: number;
  charitableDonations: number;
}

export interface TaxPaidInputs {
  paye: number;
  provisionalTax: number;
}

export type AgeCategory = 'under_65' | '65_to_74' | '75_plus';

export interface TaxCalculationResult {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeRebates: number;
  totalRebates: number;
  taxAfterRebates: number;
  totalTaxPaid: number;
  refundAmount: number;
  effectiveTaxRate: number;
  breakdown: {
    income: IncomeInputs;
    deductions: DeductionInputs;
    taxPaid: TaxPaidInputs;
  };
}

function calculateTaxOnIncome(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  for (const bracket of TAX_BRACKETS_2024) {
    if (bracket.max === null || taxableIncome <= bracket.max) {
      return bracket.baseAmount + ((taxableIncome - bracket.min) * bracket.rate);
    }
  }
  
  return 0;
}

function calculateRebates(ageCategory: AgeCategory): number {
  let totalRebates = TAX_REBATES_2024.primary;
  
  if (ageCategory === '65_to_74') {
    totalRebates += TAX_REBATES_2024.secondary;
  } else if (ageCategory === '75_plus') {
    totalRebates += TAX_REBATES_2024.secondary + TAX_REBATES_2024.tertiary;
  }
  
  return totalRebates;
}

function calculateRetirementDeduction(
  retirementContributions: number,
  totalIncome: number
): number {
  // Retirement contributions are capped at 27.5% of taxable income or R350,000
  const maxDeduction = Math.min(totalIncome * 0.275, 350000);
  return Math.min(retirementContributions, maxDeduction);
}

function calculateMedicalExpensesDeduction(
  medicalExpenses: number,
  medicalAidContributions: number,
  taxableIncome: number,
  ageCategory: AgeCategory
): number {
  // Complex medical expenses calculation based on SARS rules
  // Simplified version: expenses above 7.5% of taxable income are deductible
  
  if (ageCategory !== 'under_65') {
    // For 65+, all qualifying medical expenses are deductible
    return medicalExpenses;
  }
  
  // For under 65, only expenses exceeding 7.5% of taxable income
  const threshold = taxableIncome * 0.075;
  const excessExpenses = Math.max(0, medicalExpenses - threshold);
  
  return excessExpenses;
}

function calculateCharitableDeduction(
  donations: number,
  taxableIncome: number
): number {
  // Charitable donations are capped at 10% of taxable income
  return Math.min(donations, taxableIncome * 0.10);
}

export function calculateTax(
  income: IncomeInputs,
  deductions: DeductionInputs,
  taxPaid: TaxPaidInputs,
  ageCategory: AgeCategory
): TaxCalculationResult {
  // Calculate total income
  const totalIncome = income.salary + income.freelance + income.rental + income.investment;
  
  // Calculate deductions
  const retirementDeduction = calculateRetirementDeduction(
    deductions.retirementContributions,
    totalIncome
  );
  
  const medicalExpensesDeduction = calculateMedicalExpensesDeduction(
    deductions.medicalExpenses,
    deductions.medicalAidContributions,
    totalIncome,
    ageCategory
  );
  
  const charitableDeduction = calculateCharitableDeduction(
    deductions.charitableDonations,
    totalIncome
  );
  
  const totalDeductions = retirementDeduction + medicalExpensesDeduction + charitableDeduction;
  
  // Calculate taxable income
  let taxableIncome = Math.max(0, totalIncome - totalDeductions);
  
  // Apply tax threshold
  const threshold = ageCategory === 'under_65' 
    ? TAX_THRESHOLDS_2024.primary
    : ageCategory === '65_to_74'
    ? TAX_THRESHOLDS_2024.secondary
    : TAX_THRESHOLDS_2024.tertiary;
    
  if (taxableIncome < threshold) {
    taxableIncome = 0;
  }
  
  // Calculate tax before rebates
  const taxBeforeRebates = calculateTaxOnIncome(taxableIncome);
  
  // Apply rebates
  const totalRebates = calculateRebates(ageCategory);
  const taxAfterRebates = Math.max(0, taxBeforeRebates - totalRebates);
  
  // Calculate refund/amount owing
  const totalTaxPaid = taxPaid.paye + taxPaid.provisionalTax;
  const refundAmount = totalTaxPaid - taxAfterRebates;
  
  // Calculate effective tax rate
  const effectiveTaxRate = totalIncome > 0 ? (taxAfterRebates / totalIncome) * 100 : 0;
  
  return {
    totalIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeRebates,
    totalRebates,
    taxAfterRebates,
    totalTaxPaid,
    refundAmount,
    effectiveTaxRate,
    breakdown: {
      income,
      deductions,
      taxPaid
    }
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(rate: number): string {
  return `${rate.toFixed(2)}%`;
}
