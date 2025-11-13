export interface IRP5Data {
  // Core IRP5 fields
  grossRemuneration: number;
  payeWithheld: number;
  uifContrib: number;
  retirementFund: number;
  medicalScheme: number;
  travelAllowance: number;
  medicalCredits: number;
  taxYear: string;
  
  // Additional required fields
  totalTax: number;
  
  // Additional fields for enhanced analysis
  employerName?: string;
  employeeNumber?: string;
  taxReferenceNumber?: string;
  periodOfEmployment?: {
    startDate: string;
    endDate: string;
  };
  
  // Calculated fields
  taxableIncome?: number;
  taxDue?: number;
  refundDue?: number;
  effectiveRate?: number;
  
  // Metadata
  uploadedAt?: string;
  confidence?: number;
  source: 'pdf_upload' | 'manual_entry' | 'api_import';
}

export interface AnomalyFlag {
  type: 'warning' | 'error' | 'info';
  code: string;
  message: string;
  field: keyof IRP5Data;
  severity: 'low' | 'medium' | 'high';
  suggestion?: string;
}

export interface IRP5Analysis {
  data: IRP5Data;
  anomalies: AnomalyFlag[];
  auditRiskScore: number;
  recommendations: string[];
  comparisonToPeers?: {
    percentile: number;
    averageForIncome: number;
    field: string;
  }[];
}

export interface TaxProjection {
  currentYear: IRP5Data;
  projectedYear: {
    grossIncome: number;
    bonusExpected: number;
    retirementContrib: number;
    medicalContrib: number;
    estimatedPAYE: number;
    estimatedRefund: number;
    recommendedActions: string[];
  };
}

export interface DebtAnalysis {
  year: number;
  declaredIncome: number;
  payeWithheld: number;
  taxDue: number;
  shortfall: number;
  interestAccrued: number;
  totalOwed: number;
  status: 'paid' | 'outstanding' | 'disputed';
}

export interface UserTaxProfile {
  userId: string;
  irp5History: IRP5Data[];
  debtAnalysis: DebtAnalysis[];
  preferences: {
    remindersEnabled: boolean;
    reminderFrequency: 'monthly' | 'quarterly' | 'yearly';
    nextReminderDate?: string;
    whatsappNumber?: string;
    emailNotifications: boolean;
  };
  riskProfile: {
    auditRiskScore: number;
    riskFactors: string[];
    lastUpdated: string;
  };
} 