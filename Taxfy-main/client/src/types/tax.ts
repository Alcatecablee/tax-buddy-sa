export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
}

export interface DeductionCategory {
  id: string;
  name: string;
  description: string;
  maxAmount?: number;
  percentage?: number;
  type: 'fixed' | 'percentage' | 'calculated';
}

// Re-export IRP5Data from the existing file
export type { IRP5Data, AnomalyFlag, IRP5Analysis, TaxProjection, DebtAnalysis, UserTaxProfile } from './IRP5'; 