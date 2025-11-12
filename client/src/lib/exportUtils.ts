import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import { formatCurrency } from './taxCalculator';

interface ExportCalculation {
  id: string;
  tax_year: string;
  age_category: string;
  salary_income?: number | null;
  freelance_income?: number | null;
  rental_income?: number | null;
  investment_income?: number | null;
  retirement_contributions?: number | null;
  medical_aid_contributions?: number | null;
  medical_expenses?: number | null;
  charitable_donations?: number | null;
  paye_paid?: number | null;
  provisional_tax_paid?: number | null;
  total_income: number | null;
  taxable_income: number | null;
  total_tax_owed: number | null;
  total_tax_paid?: number | null;
  refund_amount: number | null;
  created_at: string;
  updated_at: string;
}

const getAgeCategoryLabel = (category: string) => {
  switch (category) {
    case 'under_65':
      return 'Under 65';
    case '65_to_74':
      return '65-74 years';
    case '75_plus':
      return '75+ years';
    default:
      return category;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function exportCalculationToPDF(calculation: ExportCalculation) {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SARS Tax Calculation Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Generated on ${formatDate(new Date().toISOString())}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Information', margin, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Tax Year: ${calculation.tax_year}`, margin, yPos);
  yPos += 6;
  doc.text(`Age Category: ${getAgeCategoryLabel(calculation.age_category)}`, margin, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Income Sources', margin, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Salary Income: ${formatCurrency(calculation.salary_income ?? 0)}`, margin, yPos);
  yPos += 6;
  doc.text(`Freelance Income: ${formatCurrency(calculation.freelance_income ?? 0)}`, margin, yPos);
  yPos += 6;
  doc.text(`Rental Income: ${formatCurrency(calculation.rental_income ?? 0)}`, margin, yPos);
  yPos += 6;
  doc.text(`Investment Income: ${formatCurrency(calculation.investment_income ?? 0)}`, margin, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Deductions & Tax Credits', margin, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Retirement Contributions: ${formatCurrency(calculation.retirement_contributions ?? 0)}`, margin, yPos);
  yPos += 6;
  doc.text(`Medical Aid Contributions: ${formatCurrency(calculation.medical_aid_contributions ?? 0)}`, margin, yPos);
  yPos += 6;
  doc.text(`Medical Expenses: ${formatCurrency(calculation.medical_expenses ?? 0)}`, margin, yPos);
  yPos += 6;
  doc.text(`Charitable Donations: ${formatCurrency(calculation.charitable_donations ?? 0)}`, margin, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Tax Already Paid', margin, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`PAYE Paid: ${formatCurrency(calculation.paye_paid ?? 0)}`, margin, yPos);
  yPos += 6;
  doc.text(`Provisional Tax Paid: ${formatCurrency(calculation.provisional_tax_paid ?? 0)}`, margin, yPos);
  yPos += 10;
  
  doc.setFillColor(240, 240, 240);
  doc.rect(margin - 5, yPos - 2, pageWidth - (margin * 2) + 10, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Summary', margin, yPos + 5);
  yPos += 13;
  
  doc.setFontSize(12);
  doc.text(`Total Income: ${formatCurrency(calculation.total_income ?? 0)}`, margin, yPos);
  yPos += 8;
  doc.text(`Taxable Income: ${formatCurrency(calculation.taxable_income ?? 0)}`, margin, yPos);
  yPos += 8;
  doc.text(`Total Tax Owed: ${formatCurrency(calculation.total_tax_owed ?? 0)}`, margin, yPos);
  yPos += 8;
  doc.text(`Total Tax Paid: ${formatCurrency(calculation.total_tax_paid ?? 0)}`, margin, yPos);
  yPos += 8;
  
  const refundAmount = calculation.refund_amount ?? 0;
  const isRefund = refundAmount > 0;
  const isOwing = refundAmount < 0;
  
  doc.setFontSize(14);
  if (isRefund) {
    doc.setTextColor(0, 128, 0);
    doc.text(`Refund Expected: ${formatCurrency(Math.abs(refundAmount))}`, margin, yPos);
  } else if (isOwing) {
    doc.setTextColor(200, 0, 0);
    doc.text(`Amount Owing: ${formatCurrency(Math.abs(refundAmount))}`, margin, yPos);
  } else {
    doc.setTextColor(0);
    doc.text(`Status: Settled`, margin, yPos);
  }
  
  doc.setTextColor(100);
  doc.setFontSize(8);
  doc.text(`Calculation saved on ${formatDate(calculation.created_at)}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  
  doc.save(`tax-calculation-${calculation.tax_year}-${calculation.id.substring(0, 8)}.pdf`);
}

export function exportCalculationToCSV(calculation: ExportCalculation) {
  const data = [
    { Field: 'Tax Year', Value: calculation.tax_year },
    { Field: 'Age Category', Value: getAgeCategoryLabel(calculation.age_category) },
    { Field: '', Value: '' },
    { Field: 'INCOME SOURCES', Value: '' },
    { Field: 'Salary Income', Value: calculation.salary_income ?? 0 },
    { Field: 'Freelance Income', Value: calculation.freelance_income ?? 0 },
    { Field: 'Rental Income', Value: calculation.rental_income ?? 0 },
    { Field: 'Investment Income', Value: calculation.investment_income ?? 0 },
    { Field: '', Value: '' },
    { Field: 'DEDUCTIONS & CREDITS', Value: '' },
    { Field: 'Retirement Contributions', Value: calculation.retirement_contributions ?? 0 },
    { Field: 'Medical Aid Contributions', Value: calculation.medical_aid_contributions ?? 0 },
    { Field: 'Medical Expenses', Value: calculation.medical_expenses ?? 0 },
    { Field: 'Charitable Donations', Value: calculation.charitable_donations ?? 0 },
    { Field: '', Value: '' },
    { Field: 'TAX PAID', Value: '' },
    { Field: 'PAYE Paid', Value: calculation.paye_paid ?? 0 },
    { Field: 'Provisional Tax Paid', Value: calculation.provisional_tax_paid ?? 0 },
    { Field: '', Value: '' },
    { Field: 'SUMMARY', Value: '' },
    { Field: 'Total Income', Value: calculation.total_income ?? 0 },
    { Field: 'Taxable Income', Value: calculation.taxable_income ?? 0 },
    { Field: 'Total Tax Owed', Value: calculation.total_tax_owed ?? 0 },
    { Field: 'Total Tax Paid', Value: calculation.total_tax_paid ?? 0 },
    { Field: 'Refund Amount', Value: calculation.refund_amount ?? 0 },
    { Field: '', Value: '' },
    { Field: 'Created', Value: formatDate(calculation.created_at) },
    { Field: 'Updated', Value: formatDate(calculation.updated_at) },
  ];
  
  const csv = Papa.unparse(data);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `tax-calculation-${calculation.tax_year}-${calculation.id.substring(0, 8)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAllCalculationsToCSV(calculations: ExportCalculation[]) {
  const data = calculations.map(calc => {
    const refundAmount = calc.refund_amount ?? 0;
    let status = 'Settled';
    if (refundAmount > 0) status = 'Refund Expected';
    if (refundAmount < 0) status = 'Amount Owing';
    
    return {
      'Tax Year': calc.tax_year,
      'Age Category': getAgeCategoryLabel(calc.age_category),
      'Salary Income': calc.salary_income ?? 0,
      'Freelance Income': calc.freelance_income ?? 0,
      'Rental Income': calc.rental_income ?? 0,
      'Investment Income': calc.investment_income ?? 0,
      'Retirement Contributions': calc.retirement_contributions ?? 0,
      'Medical Aid Contributions': calc.medical_aid_contributions ?? 0,
      'Medical Expenses': calc.medical_expenses ?? 0,
      'Charitable Donations': calc.charitable_donations ?? 0,
      'PAYE Paid': calc.paye_paid ?? 0,
      'Provisional Tax Paid': calc.provisional_tax_paid ?? 0,
      'Total Income': calc.total_income ?? 0,
      'Taxable Income': calc.taxable_income ?? 0,
      'Total Tax Owed': calc.total_tax_owed ?? 0,
      'Total Tax Paid': calc.total_tax_paid ?? 0,
      'Refund Amount': refundAmount,
      'Status': status,
      'Created': formatDate(calc.created_at),
      'Updated': formatDate(calc.updated_at),
    };
  });
  
  const csv = Papa.unparse(data);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `all-tax-calculations-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
