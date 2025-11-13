import { IRP5Data, AnomalyFlag } from '../types/IRP5';

// Peer group data for comparison (these would typically come from a database)
const PEER_GROUP_AVERAGES = {
  payeRatio: {
    '0-300000': 0.15,
    '300000-500000': 0.20,
    '500000-750000': 0.25,
    '750000-1000000': 0.30,
    '1000000+': 0.35
  },
  retirementRatio: {
    '0-300000': 0.08,
    '300000-500000': 0.12,
    '500000-750000': 0.15,
    '750000-1000000': 0.18,
    '1000000+': 0.22
  },
  medicalRatio: {
    '0-300000': 0.03,
    '300000-500000': 0.04,
    '500000-750000': 0.045,
    '750000-1000000': 0.05,
    '1000000+': 0.055
  }
};

function getIncomeGroup(income: number): string {
  if (income <= 300000) return '0-300000';
  if (income <= 500000) return '300000-500000';
  if (income <= 750000) return '500000-750000';
  if (income <= 1000000) return '750000-1000000';
  return '1000000+';
}

export function detectAnomalies(data: IRP5Data): AnomalyFlag[] {
  const anomalies: AnomalyFlag[] = [];
  const incomeGroup = getIncomeGroup(data.grossRemuneration);

  // 1. PAYE Under-deduction Detection
  const expectedPayeRatio = PEER_GROUP_AVERAGES.payeRatio[incomeGroup];
  const actualPayeRatio = data.payeWithheld / data.grossRemuneration;
  
  if (actualPayeRatio < expectedPayeRatio * 0.8) {
    anomalies.push({
      type: 'warning',
      code: 'PAYE_UNDER_DEDUCTED',
      message: `PAYE appears low for your income level. Expected ~${(expectedPayeRatio * 100).toFixed(1)}%, actual ${(actualPayeRatio * 100).toFixed(1)}%`,
      field: 'payeWithheld',
      severity: 'high',
      suggestion: 'Consider topping up your PAYE via eFiling eWallet to avoid year-end debt'
    });
  }

  // 2. Excessive Medical Credits
  const maxMedicalCredits = data.grossRemuneration * 0.05; // 5% is unusually high
  if (data.medicalCredits > maxMedicalCredits) {
    anomalies.push({
      type: 'error',
      code: 'MEDICAL_CREDITS_HIGH',
      message: `Medical credits seem excessive (${((data.medicalCredits / data.grossRemuneration) * 100).toFixed(1)}% of income)`,
      field: 'medicalCredits',
      severity: 'high',
      suggestion: 'Verify your medical aid dependents and months of coverage'
    });
  }

  // 3. Retirement Contribution Cap Exceeded
  const maxRetirementContrib = Math.min(data.grossRemuneration * 0.275, 350000);
  if (data.retirementFund > maxRetirementContrib) {
    anomalies.push({
      type: 'error',
      code: 'RETIREMENT_CAP_EXCEEDED',
      message: `Retirement contributions exceed the 27.5% cap (R${maxRetirementContrib.toLocaleString()} max)`,
      field: 'retirementFund',
      severity: 'high',
      suggestion: 'Excess contributions will be taxed as income'
    });
  }

  // 4. Missing UIF Contributions
  const expectedUIF = Math.min(data.grossRemuneration * 0.01, 177.12 * 12); // 1% capped at R177.12/month
  if (data.uifContrib === 0 && data.grossRemuneration > 50000) {
    anomalies.push({
      type: 'warning',
      code: 'UIF_MISSING',
      message: 'No UIF contributions recorded for significant income',
      field: 'uifContrib',
      severity: 'medium',
      suggestion: 'Verify with your employer if UIF should have been deducted'
    });
  } else if (data.uifContrib > expectedUIF * 1.1) {
    anomalies.push({
      type: 'warning',
      code: 'UIF_EXCESSIVE',
      message: `UIF contributions appear high (expected ~R${expectedUIF.toFixed(2)})`,
      field: 'uifContrib',
      severity: 'low',
      suggestion: 'Check if UIF was correctly calculated'
    });
  }

  // 5. Travel Allowance Without Logbook
  if (data.travelAllowance > 0 && data.travelAllowance > data.grossRemuneration * 0.1) {
    anomalies.push({
      type: 'info',
      code: 'TRAVEL_ALLOWANCE_HIGH',
      message: 'Significant travel allowance detected',
      field: 'travelAllowance',
      severity: 'medium',
      suggestion: 'Ensure you have a logbook and can prove business use of vehicle'
    });
  }

  // 6. Inconsistent Medical Scheme vs Credits
  const expectedMedicalCredits = estimateExpectedMedicalCredits(data.medicalScheme);
  if (data.medicalScheme > 0 && Math.abs(data.medicalCredits - expectedMedicalCredits) > expectedMedicalCredits * 0.3) {
    anomalies.push({
      type: 'warning',
      code: 'MEDICAL_MISMATCH',
      message: 'Medical scheme contributions and tax credits don\'t align',
      field: 'medicalCredits',
      severity: 'medium',
      suggestion: 'Verify your medical aid certificate and dependent details'
    });
  }

  // 7. Round Number Detection (possible estimation)
  const roundNumbers = [
    { field: 'grossRemuneration' as keyof IRP5Data, value: data.grossRemuneration },
    { field: 'payeWithheld' as keyof IRP5Data, value: data.payeWithheld },
    { field: 'retirementFund' as keyof IRP5Data, value: data.retirementFund }
  ];

  roundNumbers.forEach(({ field, value }) => {
    if (value > 0 && value % 1000 === 0 && value > 10000) {
      anomalies.push({
        type: 'info',
        code: 'ROUND_NUMBER_DETECTED',
        message: `${field} is a round number - verify accuracy`,
        field,
        severity: 'low',
        suggestion: 'Double-check this figure against your IRP5 certificate'
      });
    }
  });

  // 8. Income vs Deductions Ratio
  const totalDeductions = data.retirementFund + data.medicalScheme + data.uifContrib;
  const deductionRatio = totalDeductions / data.grossRemuneration;
  
  if (deductionRatio > 0.4) {
    anomalies.push({
      type: 'warning',
      code: 'HIGH_DEDUCTION_RATIO',
      message: `Total deductions are ${(deductionRatio * 100).toFixed(1)}% of income`,
      field: 'grossRemuneration',
      severity: 'medium',
      suggestion: 'Verify all deduction amounts are correct'
    });
  }

  return anomalies;
}

function estimateExpectedMedicalCredits(medicalSchemeContrib: number): number {
  // Rough estimation based on typical medical aid costs
  // Main member: R347/month, dependents: R347 first + R234 additional
  if (medicalSchemeContrib === 0) return 0;
  
  const monthlyContrib = medicalSchemeContrib / 12;
  
  // Estimate number of members based on contribution
  if (monthlyContrib <= 500) return 347 * 12; // Single member
  if (monthlyContrib <= 800) return (347 + 347) * 12; // Member + 1 dependent
  if (monthlyContrib <= 1200) return (347 + 347 + 234) * 12; // Member + 2 dependents
  
  // For higher contributions, estimate more dependents
  const additionalDependents = Math.floor((monthlyContrib - 800) / 234);
  return (347 + 347 + (additionalDependents * 234)) * 12;
}

export function calculateAnomalySeverityScore(anomalies: AnomalyFlag[]): number {
  let score = 0;
  
  anomalies.forEach(anomaly => {
    switch (anomaly.severity) {
      case 'high':
        score += 30;
        break;
      case 'medium':
        score += 15;
        break;
      case 'low':
        score += 5;
        break;
    }
    
    // Additional weight for error types
    if (anomaly.type === 'error') {
      score += 10;
    }
  });
  
  return Math.min(score, 100); // Cap at 100
}

export function getAnomalyRecommendations(anomalies: AnomalyFlag[]): string[] {
  const recommendations: string[] = [];
  
  // Group anomalies by type for better recommendations
  const highSeverityAnomalies = anomalies.filter(a => a.severity === 'high');
  const payeIssues = anomalies.filter(a => a.code.includes('PAYE'));
  const medicalIssues = anomalies.filter(a => a.code.includes('MEDICAL'));
  
  if (highSeverityAnomalies.length > 0) {
    recommendations.push('🚨 Address high-priority issues immediately to avoid SARS penalties');
  }
  
  if (payeIssues.length > 0) {
    recommendations.push('💰 Consider making additional PAYE payments via eFiling eWallet');
  }
  
  if (medicalIssues.length > 0) {
    recommendations.push('🏥 Review your medical aid certificate and dependent information');
  }
  
  if (anomalies.some(a => a.code === 'RETIREMENT_CAP_EXCEEDED')) {
    recommendations.push('📊 Consult a tax advisor about excess retirement contributions');
  }
  
  if (anomalies.length > 3) {
    recommendations.push('📋 Consider professional tax review before filing your return');
  }
  
  return recommendations;
} 