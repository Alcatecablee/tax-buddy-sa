import { IRP5Data, AnomalyFlag } from '../types/IRP5';
import { calculateAnomalySeverityScore } from './anomalyDetector';

export interface AuditRiskFactors {
  payeUnderDeduction: number;
  medicalCreditsHigh: number;
  retirementCapExceeded: number;
  roundNumbersUsed: number;
  inconsistentData: number;
  highDeductionRatio: number;
  travelAllowanceHigh: number;
  anomalySeverity: number;
}

export interface AuditRiskResult {
  score: number;
  level: 'Low' | 'Medium' | 'High' | 'Very High';
  factors: AuditRiskFactors;
  recommendations: string[];
  color: string;
}

export function calculateAuditRisk(data: IRP5Data, anomalies: AnomalyFlag[]): AuditRiskResult {
  const factors: AuditRiskFactors = {
    payeUnderDeduction: 0,
    medicalCreditsHigh: 0,
    retirementCapExceeded: 0,
    roundNumbersUsed: 0,
    inconsistentData: 0,
    highDeductionRatio: 0,
    travelAllowanceHigh: 0,
    anomalySeverity: 0
  };

  // 1. PAYE Under-deduction Risk (High impact)
  const expectedPayeRatio = getExpectedPayeRatio(data.grossRemuneration);
  const actualPayeRatio = data.payeWithheld / data.grossRemuneration;
  
  if (actualPayeRatio < expectedPayeRatio * 0.7) {
    factors.payeUnderDeduction = 35; // Very high risk
  } else if (actualPayeRatio < expectedPayeRatio * 0.85) {
    factors.payeUnderDeduction = 20; // High risk
  } else if (actualPayeRatio < expectedPayeRatio * 0.95) {
    factors.payeUnderDeduction = 10; // Medium risk
  }

  // 2. Medical Credits Risk
  const medicalCreditsRatio = data.medicalCredits / data.grossRemuneration;
  if (medicalCreditsRatio > 0.06) {
    factors.medicalCreditsHigh = 25;
  } else if (medicalCreditsRatio > 0.04) {
    factors.medicalCreditsHigh = 15;
  } else if (medicalCreditsRatio > 0.03) {
    factors.medicalCreditsHigh = 8;
  }

  // 3. Retirement Contribution Cap
  const maxRetirementContrib = Math.min(data.grossRemuneration * 0.275, 350000);
  if (data.retirementFund > maxRetirementContrib) {
    const excessRatio = (data.retirementFund - maxRetirementContrib) / maxRetirementContrib;
    if (excessRatio > 0.2) {
      factors.retirementCapExceeded = 30;
    } else if (excessRatio > 0.1) {
      factors.retirementCapExceeded = 20;
    } else {
      factors.retirementCapExceeded = 10;
    }
  }

  // 4. Round Numbers (Estimation Risk)
  const roundNumberFields = [
    data.grossRemuneration,
    data.payeWithheld,
    data.retirementFund,
    data.medicalScheme
  ];
  
  const roundNumberCount = roundNumberFields.filter(value => 
    value > 0 && value % 1000 === 0 && value > 10000
  ).length;
  
  factors.roundNumbersUsed = Math.min(roundNumberCount * 5, 15);

  // 5. Data Inconsistencies
  const totalDeductions = data.retirementFund + data.medicalScheme + data.uifContrib;
  const deductionRatio = totalDeductions / data.grossRemuneration;
  
  if (deductionRatio > 0.5) {
    factors.inconsistentData = 20;
  } else if (deductionRatio > 0.4) {
    factors.inconsistentData = 12;
  } else if (deductionRatio > 0.35) {
    factors.inconsistentData = 6;
  }

  // 6. High Deduction Ratio
  if (deductionRatio > 0.4) {
    factors.highDeductionRatio = 15;
  } else if (deductionRatio > 0.3) {
    factors.highDeductionRatio = 8;
  }

  // 7. Travel Allowance Risk
  const travelRatio = data.travelAllowance / data.grossRemuneration;
  if (travelRatio > 0.15) {
    factors.travelAllowanceHigh = 15;
  } else if (travelRatio > 0.1) {
    factors.travelAllowanceHigh = 8;
  } else if (travelRatio > 0.05) {
    factors.travelAllowanceHigh = 4;
  }

  // 8. Anomaly Severity Score
  factors.anomalySeverity = Math.min(calculateAnomalySeverityScore(anomalies) * 0.3, 25);

  // Calculate total score
  const totalScore = Math.min(
    Object.values(factors).reduce((sum, score) => sum + score, 0),
    100
  );

  // Determine risk level and color
  let level: AuditRiskResult['level'];
  let color: string;
  
  if (totalScore >= 70) {
    level = 'Very High';
    color = 'text-red-600';
  } else if (totalScore >= 50) {
    level = 'High';
    color = 'text-red-500';
  } else if (totalScore >= 30) {
    level = 'Medium';
    color = 'text-yellow-500';
  } else {
    level = 'Low';
    color = 'text-green-600';
  }

  // Generate recommendations
  const recommendations = generateAuditRiskRecommendations(factors, totalScore);

  return {
    score: Math.round(totalScore),
    level,
    factors,
    recommendations,
    color
  };
}

function getExpectedPayeRatio(income: number): number {
  if (income <= 300000) return 0.15;
  if (income <= 500000) return 0.20;
  if (income <= 750000) return 0.25;
  if (income <= 1000000) return 0.30;
  return 0.35;
}

function generateAuditRiskRecommendations(factors: AuditRiskFactors, totalScore: number): string[] {
  const recommendations: string[] = [];

  if (factors.payeUnderDeduction > 15) {
    recommendations.push('🚨 Top up your PAYE immediately via eFiling eWallet');
    recommendations.push('📞 Contact your employer to verify PAYE calculations');
  }

  if (factors.medicalCreditsHigh > 15) {
    recommendations.push('🏥 Gather medical aid certificates for all dependents');
    recommendations.push('📋 Verify months of medical aid coverage');
  }

  if (factors.retirementCapExceeded > 0) {
    recommendations.push('💼 Consult a tax advisor about excess retirement contributions');
    recommendations.push('📊 Consider adjusting future retirement contributions');
  }

  if (factors.roundNumbersUsed > 10) {
    recommendations.push('🔍 Double-check all figures against original documents');
    recommendations.push('📄 Ensure you have supporting documentation');
  }

  if (factors.travelAllowanceHigh > 10) {
    recommendations.push('🚗 Maintain a detailed vehicle logbook');
    recommendations.push('📝 Keep records of business vs private vehicle use');
  }

  if (totalScore >= 50) {
    recommendations.push('⚖️ Consider professional tax review before filing');
    recommendations.push('📚 Keep detailed records of all income and deductions');
    recommendations.push('🛡️ Consider tax audit insurance');
  }

  if (totalScore >= 70) {
    recommendations.push('🚨 URGENT: Address high-risk factors immediately');
    recommendations.push('👨‍💼 Seek professional tax advice before filing');
    recommendations.push('📋 Prepare comprehensive supporting documentation');
  }

  return recommendations;
}

export function getAuditRiskExplanation(score: number): string {
  if (score >= 70) {
    return 'Your tax return has multiple red flags that significantly increase audit risk. SARS may scrutinize your return closely.';
  } else if (score >= 50) {
    return 'Several factors in your return may trigger SARS attention. Review and correct issues before filing.';
  } else if (score >= 30) {
    return 'Your return has some areas of concern but is generally within normal ranges.';
  } else {
    return 'Your tax data appears consistent and within normal ranges for your income level.';
  }
}

export function getTopRiskFactors(factors: AuditRiskFactors): Array<{ factor: string; score: number; description: string }> {
  const factorDescriptions = {
    payeUnderDeduction: 'PAYE Under-deduction',
    medicalCreditsHigh: 'High Medical Credits',
    retirementCapExceeded: 'Retirement Cap Exceeded',
    roundNumbersUsed: 'Round Numbers Used',
    inconsistentData: 'Data Inconsistencies',
    highDeductionRatio: 'High Deduction Ratio',
    travelAllowanceHigh: 'High Travel Allowance',
    anomalySeverity: 'Data Anomalies'
  };

  return Object.entries(factors)
    .filter(([_, score]) => score > 0)
    .map(([factor, score]) => ({
      factor,
      score,
      description: factorDescriptions[factor as keyof AuditRiskFactors]
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5 risk factors
} 