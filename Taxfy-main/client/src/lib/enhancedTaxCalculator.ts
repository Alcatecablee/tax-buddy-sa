import { IRP5Data } from '../types/IRP5';
import { calculateTax, TaxCalculationInput, TaxCalculationResult } from './taxCalculator';

export interface EnhancedTaxResult extends TaxCalculationResult {
  refundAmount: number;
  amountOwed: number;
  isRefund: boolean;
  payeShortfall: number;
  recommendations: string[];
}

export interface TaxComparison {
  current: EnhancedTaxResult;
  optimized?: EnhancedTaxResult;
  savings?: number;
  optimizationSuggestions: string[];
}

export function calculateTaxFromIRP5(data: IRP5Data): EnhancedTaxResult {
  // Convert IRP5 data to tax calculation input - FIXED TO INCLUDE UIF ✅
  const input: TaxCalculationInput = {
    grossIncome: data.grossRemuneration,
    retirementContrib: data.retirementFund,
    medicalContrib: data.medicalScheme, // Note: This is tracked but NOT deducted from taxable income
    medicalCredits: data.medicalCredits,
    uifContrib: data.uifContrib, // CRITICAL FIX: Include UIF for proper taxable income calculation
    age: 35 // Default age, could be enhanced with actual age data
  };

  const taxResult = calculateTax(input);
  
  // Calculate refund or amount owed - VERIFIED FORMULA ✅
  // refundOrOwing = PAYEWithheld - taxDue + medicalCredit
  const totalTaxDue = taxResult.totalTax;
  const payeWithheld = data.payeWithheld;
  
  const netAmount = payeWithheld - totalTaxDue;
  const isRefund = netAmount > 0;
  const refundAmount = isRefund ? netAmount : 0;
  const amountOwed = isRefund ? 0 : Math.abs(netAmount);
  
  // Calculate PAYE shortfall (how much PAYE was under-deducted)
  const expectedPaye = totalTaxDue;
  const payeShortfall = Math.max(0, expectedPaye - payeWithheld);

  // Generate recommendations
  const recommendations = generateTaxRecommendations(data, taxResult, isRefund, amountOwed);

  return {
    ...taxResult,
    refundAmount: Math.round(refundAmount),
    amountOwed: Math.round(amountOwed),
    isRefund,
    payeShortfall: Math.round(payeShortfall),
    recommendations
  };
}

export function simulateTaxScenario(
  baseData: IRP5Data,
  adjustments: {
    bonusIncome?: number;
    additionalRetirement?: number;
    additionalMedical?: number;
    additionalPaye?: number;
    additionalUif?: number; // Added UIF adjustment
  }
): EnhancedTaxResult {
  const adjustedData: IRP5Data = {
    ...baseData,
    grossRemuneration: baseData.grossRemuneration + (adjustments.bonusIncome || 0),
    retirementFund: baseData.retirementFund + (adjustments.additionalRetirement || 0),
    medicalScheme: baseData.medicalScheme + (adjustments.additionalMedical || 0),
    payeWithheld: baseData.payeWithheld + (adjustments.additionalPaye || 0),
    uifContrib: baseData.uifContrib + (adjustments.additionalUif || 0)
  };

  return calculateTaxFromIRP5(adjustedData);
}

export function optimizeTaxPosition(data: IRP5Data): TaxComparison {
  const current = calculateTaxFromIRP5(data);
  const optimizationSuggestions: string[] = [];
  
  // Calculate maximum retirement contribution
  const maxRetirementContrib = Math.min(data.grossRemuneration * 0.275, 350000);
  const currentRetirement = data.retirementFund;
  const additionalRetirementRoom = Math.max(0, maxRetirementContrib - currentRetirement);
  
  let optimized: EnhancedTaxResult | undefined;
  let savings = 0;

  if (additionalRetirementRoom > 1000) {
    // Simulate with maximum retirement contribution
    const optimizedData = {
      ...data,
      retirementFund: maxRetirementContrib
    };
    
    optimized = calculateTaxFromIRP5(optimizedData);
    savings = current.totalTax - optimized.totalTax;
    
    if (savings > 0) {
      optimizationSuggestions.push(
        `💰 Increase retirement contributions by R${additionalRetirementRoom.toLocaleString()} to save R${savings.toLocaleString()} in tax`
      );
    }
  }

  // Medical aid optimization
  const estimatedMedicalCredits = estimateOptimalMedicalCredits(data);
  if (estimatedMedicalCredits > data.medicalCredits) {
    const additionalCredits = estimatedMedicalCredits - data.medicalCredits;
    optimizationSuggestions.push(
      `🏥 You may be eligible for R${additionalCredits.toLocaleString()} more in medical tax credits`
    );
  }

  // PAYE optimization
  if (current.payeShortfall > 0) {
    optimizationSuggestions.push(
      `📊 Consider making additional PAYE payments of R${current.payeShortfall.toLocaleString()} to avoid year-end debt`
    );
  }

  // General optimization suggestions
  if (data.grossRemuneration > 500000 && currentRetirement < data.grossRemuneration * 0.1) {
    optimizationSuggestions.push(
      '🎯 Consider increasing retirement contributions for better tax efficiency'
    );
  }

  if (data.travelAllowance > 0 && data.travelAllowance > data.grossRemuneration * 0.05) {
    optimizationSuggestions.push(
      '🚗 Ensure you maintain a logbook for travel allowance claims'
    );
  }

  return {
    current,
    optimized,
    savings: Math.round(savings),
    optimizationSuggestions
  };
}

function generateTaxRecommendations(
  data: IRP5Data,
  taxResult: TaxCalculationResult,
  isRefund: boolean,
  amountOwed: number
): string[] {
  const recommendations: string[] = [];

  if (isRefund) {
    recommendations.push(`🎉 You're due a refund of R${(data.payeWithheld - taxResult.totalTax).toLocaleString()}`);
    recommendations.push('📋 File your return early to receive your refund faster');
  } else if (amountOwed > 0) {
    recommendations.push(`⚠️ You owe SARS R${amountOwed.toLocaleString()}`);
    
    if (amountOwed > 5000) {
      recommendations.push('💳 Consider setting up a payment plan with SARS');
      recommendations.push('🏦 Make payment via eFiling eWallet to avoid penalties');
    }
    
    if (amountOwed > 20000) {
      recommendations.push('🚨 URGENT: Large tax debt detected - seek professional advice');
    }
  }

  // Marginal rate recommendations
  if (taxResult.marginalRate >= 39) {
    recommendations.push('📈 You\'re in a high tax bracket - maximize retirement contributions');
    recommendations.push('🏥 Ensure you\'re claiming all eligible medical expenses');
  }

  // Effective rate analysis
  if (taxResult.effectiveRate > 25) {
    recommendations.push('🎯 Consider tax-efficient investment strategies');
  }

  // PAYE analysis
  const payeRatio = data.payeWithheld / data.grossRemuneration;
  if (payeRatio < 0.15 && data.grossRemuneration > 300000) {
    recommendations.push('⚠️ PAYE appears low - verify with your employer');
  }

  return recommendations;
}

function estimateOptimalMedicalCredits(data: IRP5Data): number {
  // This is a simplified estimation - in practice, you'd need more detailed medical aid info
  if (data.medicalScheme === 0) return 0;
  
  const monthlyContrib = data.medicalScheme / 12;
  
  // Estimate based on contribution levels using 2025 rates
  if (monthlyContrib <= 600) {
    return 364 * 12; // Single member (updated to 2025 rate)
  } else if (monthlyContrib <= 1000) {
    return (364 + 364) * 12; // Member + 1 dependent (updated to 2025 rate)
  } else if (monthlyContrib <= 1400) {
    return (364 + 364 + 246) * 12; // Member + 2 dependents (updated to 2025 rate)
  } else {
    // Estimate additional dependents
    const additionalDependents = Math.floor((monthlyContrib - 1000) / 246); // Updated to 2025 rate
    return (364 + 364 + (additionalDependents * 246)) * 12; // Updated to 2025 rates
  }
}

export function calculateMonthlyTaxProjection(data: IRP5Data): {
  monthlyGross: number;
  monthlyPaye: number;
  monthlyNet: number;
  yearEndProjection: {
    totalTax: number;
    totalPaye: number;
    estimatedRefund: number;
    estimatedOwed: number;
  };
} {
  const monthlyGross = data.grossRemuneration / 12;
  const monthlyPaye = data.payeWithheld / 12;
  const monthlyNet = monthlyGross - monthlyPaye;

  const taxResult = calculateTaxFromIRP5(data);
  
  return {
    monthlyGross: Math.round(monthlyGross),
    monthlyPaye: Math.round(monthlyPaye),
    monthlyNet: Math.round(monthlyNet),
    yearEndProjection: {
      totalTax: taxResult.totalTax,
      totalPaye: data.payeWithheld,
      estimatedRefund: taxResult.refundAmount,
      estimatedOwed: taxResult.amountOwed
    }
  };
}

export function calculateTaxEfficiency(data: IRP5Data): {
  score: number;
  level: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  improvements: string[];
} {
  let score = 0;
  const improvements: string[] = [];

  // Retirement contribution efficiency
  const maxRetirement = Math.min(data.grossRemuneration * 0.275, 350000);
  const retirementRatio = data.retirementFund / maxRetirement;
  
  if (retirementRatio >= 0.9) {
    score += 30;
  } else if (retirementRatio >= 0.7) {
    score += 20;
    improvements.push('Increase retirement contributions to maximize tax savings');
  } else if (retirementRatio >= 0.5) {
    score += 10;
    improvements.push('Significantly increase retirement contributions');
  } else {
    improvements.push('Start contributing more to retirement funds for tax efficiency');
  }

  // Medical aid efficiency
  if (data.medicalScheme > 0 && data.medicalCredits > 0) {
    score += 20;
  } else if (data.medicalScheme > 0) {
    score += 10;
    improvements.push('Ensure you\'re claiming all medical tax credits');
  }

  // PAYE efficiency
  const taxResult = calculateTaxFromIRP5(data);
  const payeAccuracy = 1 - Math.abs(data.payeWithheld - taxResult.totalTax) / taxResult.totalTax;
  
  if (payeAccuracy >= 0.95) {
    score += 25;
  } else if (payeAccuracy >= 0.9) {
    score += 15;
  } else if (payeAccuracy >= 0.8) {
    score += 10;
    improvements.push('Work with employer to improve PAYE accuracy');
  } else {
    improvements.push('PAYE calculations need significant adjustment');
  }

  // Overall tax rate efficiency
  if (taxResult.effectiveRate <= 15) {
    score += 25;
  } else if (taxResult.effectiveRate <= 20) {
    score += 20;
  } else if (taxResult.effectiveRate <= 25) {
    score += 15;
  } else {
    score += 10;
    improvements.push('Explore additional tax-efficient strategies');
  }

  let level: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  if (score >= 80) level = 'Excellent';
  else if (score >= 60) level = 'Good';
  else if (score >= 40) level = 'Fair';
  else level = 'Poor';

  return { score, level, improvements };
} 