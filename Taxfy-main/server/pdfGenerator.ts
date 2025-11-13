import { jsPDF } from 'jspdf';

export interface ReportPDFData {
  user_id: string;
  report_type: string;
  tax_year: number;
  calculations: any[];
  uploads: any[];
  generatedAt: string;
  summary: {
    totalCalculations: number;
    totalUploads: number;
    totalTaxOwed: number;
    totalRefund: number;
  };
}

// Professional PDF theme constants matching application theme
const COLORS = {
  PRIMARY: '#2563eb',    // Primary blue
  SECONDARY: '#1f2937',  // Dark gray for subheaders
  TEXT: '#111827',       // Near black for body text
  MUTED: '#6b7280',      // Muted gray for metadata
  BORDER: '#e5e7eb',     // Light border color
  SUCCESS: '#059669',    // Green for refunds
  ERROR: '#dc2626'       // Red for amounts owing
};

const FONTS = {
  TITLE: 20,
  HEADER: 14,
  SUBHEADER: 12,
  BODY: 10,
  SMALL: 8
};

const SPACING = {
  MARGIN: 20,
  LINE_HEIGHT: 6,
  SECTION_GAP: 12,
  INDENT: 10
};

// SARS Tax Brackets 2025/26
const TAX_BRACKETS_2026 = [
  { min: 0, max: 237100, rate: 0.18, base: 0 },
  { min: 237100, max: 370500, rate: 0.26, base: 42678 },
  { min: 370500, max: 512800, rate: 0.31, base: 77362 },
  { min: 512800, max: 673000, rate: 0.36, base: 121475 },
  { min: 673000, max: 857900, rate: 0.39, base: 179147 },
  { min: 857900, max: 1817000, rate: 0.41, base: 251258 },
  { min: 1817000, max: Infinity, rate: 0.45, base: 644489 }
];

// Tax Rebates 2025/26
const PRIMARY_REBATE = 17235;
const SECONDARY_REBATE = 9444;  // 65+ years
const TERTIARY_REBATE = 3145;   // 75+ years

export class TaxReportPDFGenerator {
  static generateTaxReportPDF(report: any): Buffer {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (SPACING.MARGIN * 2);
    let yPosition = SPACING.MARGIN;

    // Helper functions
    const addText = (text: string, x: number, y: number, align: 'left' | 'center' | 'right' = 'left'): number => {
      if (align === 'center') {
        doc.text(text, pageWidth / 2, y, { align: 'center' });
      } else if (align === 'right') {
        doc.text(text, pageWidth - SPACING.MARGIN, y, { align: 'right' });
      } else {
        doc.text(text, x, y);
      }
      return y + SPACING.LINE_HEIGHT;
    };

    const addTextBlock = (text: string, x: number, y: number, maxWidth: number = contentWidth): number => {
      const lines = doc.splitTextToSize(text, maxWidth);
      let currentY = y;
      lines.forEach((line: string) => {
        doc.text(line, x, currentY);
        currentY += SPACING.LINE_HEIGHT;
      });
      return currentY;
    };

    const checkNewPage = (requiredSpace: number): number => {
      if (yPosition + requiredSpace > pageHeight - SPACING.MARGIN - 20) {
        doc.addPage();
        return SPACING.MARGIN;
      }
      return yPosition;
    };

    const addSectionDivider = (): void => {
      yPosition += SPACING.SECTION_GAP / 2;
      doc.setDrawColor(COLORS.BORDER);
      doc.setLineWidth(0.3);
      doc.line(SPACING.MARGIN, yPosition, pageWidth - SPACING.MARGIN, yPosition);
      yPosition += SPACING.SECTION_GAP;
    };

    const addTwoColumnRow = (label: string, value: string, y: number, bold: boolean = false): number => {
      if (bold) doc.setFont('helvetica', 'bold');
      doc.text(label, SPACING.MARGIN, y);
      doc.text(value, SPACING.MARGIN + contentWidth * 0.55, y, { align: 'right' });
      if (bold) doc.setFont('helvetica', 'normal');
      return y + SPACING.LINE_HEIGHT;
    };

    const formatCurrency = (amount: number): string => {
      return `R ${Math.abs(amount).toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    };

    const getTaxBracketBreakdown = (taxableIncome: number): string => {
      let breakdown = '';
      for (let i = 0; i < TAX_BRACKETS_2026.length; i++) {
        const bracket = TAX_BRACKETS_2026[i];
        if (taxableIncome <= bracket.min) break;
        
        const bracketMax = bracket.max === Infinity ? taxableIncome : Math.min(bracket.max, taxableIncome);
        const taxableInBracket = bracketMax - bracket.min;
        const taxInBracket = taxableInBracket * bracket.rate;
        
        if (taxableInBracket > 0) {
          breakdown += `R${bracket.min.toLocaleString()} - R${bracket.max === Infinity ? '∞' : bracketMax.toLocaleString()} @ ${(bracket.rate * 100)}%: R${taxInBracket.toLocaleString()}\n`;
        }
      }
      return breakdown || 'No tax calculated';
    };

    // Document Header
    doc.setFontSize(FONTS.TITLE);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.PRIMARY);
    yPosition = addText('SARS TAX REPORT', 0, yPosition, 'center');
    
    doc.setFontSize(FONTS.SUBHEADER);
    doc.setTextColor(COLORS.SECONDARY);
    yPosition = addText(report.report_type.toUpperCase(), 0, yPosition, 'center');
    yPosition += SPACING.SECTION_GAP;

    // Report metadata
    doc.setFontSize(FONTS.BODY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.TEXT);

    yPosition = addTwoColumnRow('Tax Year:', `${report.tax_year}/${String(report.tax_year + 1).slice(-2)}`, yPosition);
    yPosition = addTwoColumnRow('Generated:', new Date(report.created_at).toLocaleDateString('en-ZA', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    }), yPosition);
    yPosition = addTwoColumnRow('Report Reference:', `TXR-${report.id.toString().padStart(6, '0')}`, yPosition);
    yPosition = addTwoColumnRow('Status:', report.status.charAt(0).toUpperCase() + report.status.slice(1), yPosition);

    addSectionDivider();

    if (report.report_data) {
      const data = report.report_data as ReportPDFData;

      // Executive Summary
      yPosition = checkNewPage(60);
      doc.setFontSize(FONTS.HEADER);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.PRIMARY);
      yPosition = addText('EXECUTIVE SUMMARY', SPACING.MARGIN, yPosition);
      yPosition += SPACING.LINE_HEIGHT;

      if (data.summary) {
        doc.setFontSize(FONTS.BODY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.TEXT);

        yPosition = addTwoColumnRow('Tax Calculations:', data.summary.totalCalculations.toString(), yPosition);
        yPosition = addTwoColumnRow('Documents Uploaded:', data.summary.totalUploads.toString(), yPosition);
        yPosition += SPACING.LINE_HEIGHT / 2;

        doc.setFont('helvetica', 'bold');
        yPosition = addTwoColumnRow('Total Tax Liability:', formatCurrency(data.summary.totalTaxOwed || 0), yPosition, true);
        yPosition = addTwoColumnRow('Total Refunds Due:', formatCurrency(data.summary.totalRefund || 0), yPosition, true);

        yPosition += SPACING.LINE_HEIGHT / 2;
        const netPosition = (data.summary.totalRefund || 0) - (data.summary.totalTaxOwed || 0);
        const netLabel = netPosition >= 0 ? 'Net Refund Position:' : 'Net Amount Owing:';
        doc.setTextColor(netPosition >= 0 ? COLORS.SUCCESS : COLORS.ERROR);
        yPosition = addTwoColumnRow(netLabel, formatCurrency(netPosition), yPosition, true);
        doc.setTextColor(COLORS.TEXT);
      }

      addSectionDivider();

      // Detailed Tax Calculations with Formulas
      if (data.calculations && data.calculations.length > 0) {
        data.calculations.forEach((calc: any, calcIndex: number) => {
          yPosition = checkNewPage(100);
          
          // Calculation Header
          doc.setFontSize(FONTS.HEADER);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(COLORS.PRIMARY);
          yPosition = addText(`TAX CALCULATION ${calcIndex + 1}: ${calc.calculation_type}`, SPACING.MARGIN, yPosition);
          yPosition += SPACING.LINE_HEIGHT;

          doc.setFontSize(FONTS.SMALL);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(COLORS.MUTED);
          yPosition = addText(`Processed: ${new Date(calc.created_at).toLocaleDateString('en-ZA')}`, SPACING.MARGIN, yPosition);
          yPosition += SPACING.LINE_HEIGHT;

          if (calc.result_data && calc.input_data) {
            const input = calc.input_data;
            const result = calc.result_data;

            // STEP 1: Gross Income
            yPosition = checkNewPage(70);
            doc.setFontSize(FONTS.SUBHEADER);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLORS.SECONDARY);
            yPosition = addText('STEP 1: Gross Remuneration', SPACING.MARGIN, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            doc.setFontSize(FONTS.SMALL);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(COLORS.MUTED);
            yPosition = addText('SARS Reference: IRP5 Code 3601', SPACING.MARGIN + SPACING.INDENT, yPosition);
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.TEXT);
            yPosition = addTwoColumnRow('Gross Income:', formatCurrency(input.grossIncome || 0), yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            // STEP 2: Retirement Fund Deduction
            yPosition = checkNewPage(70);
            doc.setFontSize(FONTS.SUBHEADER);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLORS.SECONDARY);
            yPosition = addText('STEP 2: Retirement Fund Deduction', SPACING.MARGIN, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            doc.setFontSize(FONTS.SMALL);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(COLORS.MUTED);
            yPosition = addText('SARS Reference: Section 11F - Max 27.5% or R350,000', SPACING.MARGIN + SPACING.INDENT, yPosition);
            
            const maxRetirement = Math.min((input.grossIncome || 0) * 0.275, 350000);
            const actualRetirement = Math.min(input.retirementContrib || 0, maxRetirement);
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.TEXT);
            yPosition = addTwoColumnRow('Retirement Contribution:', formatCurrency(input.retirementContrib || 0), yPosition);
            yPosition = addTwoColumnRow('Maximum Allowed:', formatCurrency(maxRetirement), yPosition);
            yPosition = addTwoColumnRow('Deductible Amount:', formatCurrency(actualRetirement), yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            // STEP 3: UIF Contribution
            yPosition = checkNewPage(70);
            doc.setFontSize(FONTS.SUBHEADER);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLORS.SECONDARY);
            yPosition = addText('STEP 3: UIF Employee Contribution', SPACING.MARGIN, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            doc.setFontSize(FONTS.SMALL);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(COLORS.MUTED);
            yPosition = addText('SARS Reference: UIF Act - 1% of gross (max R2,125.44 annually)', SPACING.MARGIN + SPACING.INDENT, yPosition);
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.TEXT);
            yPosition = addTwoColumnRow('UIF Contribution:', formatCurrency(input.uifContrib || 0), yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            // STEP 4: Taxable Income
            yPosition = checkNewPage(70);
            doc.setFontSize(FONTS.SUBHEADER);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLORS.SECONDARY);
            yPosition = addText('STEP 4: Taxable Income', SPACING.MARGIN, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            doc.setFontSize(FONTS.SMALL);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(COLORS.MUTED);
            yPosition = addText('Formula: Gross - Retirement - UIF', SPACING.MARGIN + SPACING.INDENT, yPosition);
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.TEXT);
            yPosition = addTwoColumnRow('Gross Income:', formatCurrency(input.grossIncome || 0), yPosition);
            yPosition = addTwoColumnRow('Less: Retirement:', `(${formatCurrency(actualRetirement)})`, yPosition);
            yPosition = addTwoColumnRow('Less: UIF:', `(${formatCurrency(input.uifContrib || 0)})`, yPosition);
            doc.setFont('helvetica', 'bold');
            yPosition = addTwoColumnRow('Taxable Income:', formatCurrency(result.taxableIncome || 0), yPosition, true);
            doc.setFont('helvetica', 'normal');
            yPosition += SPACING.LINE_HEIGHT / 2;

            // STEP 5: Income Tax (with bracket breakdown)
            yPosition = checkNewPage(100);
            doc.setFontSize(FONTS.SUBHEADER);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLORS.SECONDARY);
            yPosition = addText('STEP 5: Income Tax (Before Rebates)', SPACING.MARGIN, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            doc.setFontSize(FONTS.SMALL);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(COLORS.MUTED);
            yPosition = addText('SARS Reference: Income Tax Act - 2025/26 Tax Tables', SPACING.MARGIN + SPACING.INDENT, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.TEXT);
            const breakdown = getTaxBracketBreakdown(result.taxableIncome || 0);
            const breakdownLines = breakdown.split('\n');
            breakdownLines.forEach(line => {
              if (line.trim()) {
                yPosition = checkNewPage(10);
                yPosition = addText(line, SPACING.MARGIN + SPACING.INDENT, yPosition);
              }
            });
            
            doc.setFont('helvetica', 'bold');
            yPosition = addTwoColumnRow('Total Income Tax:', formatCurrency(result.incomeTax || 0), yPosition, true);
            doc.setFont('helvetica', 'normal');
            yPosition += SPACING.LINE_HEIGHT / 2;

            // STEP 6: Tax Rebates
            yPosition = checkNewPage(70);
            doc.setFontSize(FONTS.SUBHEADER);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLORS.SECONDARY);
            yPosition = addText('STEP 6: Tax Rebates', SPACING.MARGIN, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            doc.setFontSize(FONTS.SMALL);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(COLORS.MUTED);
            yPosition = addText('SARS Reference: Income Tax Act - Age-based Rebates', SPACING.MARGIN + SPACING.INDENT, yPosition);
            
            const age = input.age || 35;
            let rebateText = `Primary Rebate (All taxpayers): R${PRIMARY_REBATE.toLocaleString()}`;
            if (age >= 75) {
              rebateText = `Primary + Secondary + Tertiary (75+): R${(PRIMARY_REBATE + SECONDARY_REBATE + TERTIARY_REBATE).toLocaleString()}`;
            } else if (age >= 65) {
              rebateText = `Primary + Secondary (65+): R${(PRIMARY_REBATE + SECONDARY_REBATE).toLocaleString()}`;
            }
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.TEXT);
            yPosition = addText(rebateText, SPACING.MARGIN + SPACING.INDENT, yPosition);
            doc.setFont('helvetica', 'bold');
            yPosition = addTwoColumnRow('Total Rebates:', formatCurrency(result.primaryRebate || 0), yPosition, true);
            doc.setFont('helvetica', 'normal');
            yPosition += SPACING.LINE_HEIGHT / 2;

            // STEP 7: Medical Tax Credits
            yPosition = checkNewPage(70);
            doc.setFontSize(FONTS.SUBHEADER);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLORS.SECONDARY);
            yPosition = addText('STEP 7: Medical Tax Credits', SPACING.MARGIN, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            doc.setFontSize(FONTS.SMALL);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(COLORS.MUTED);
            yPosition = addText('SARS Reference: Section 6A - Medical Scheme Fees Tax Credit', SPACING.MARGIN + SPACING.INDENT, yPosition);
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.TEXT);
            yPosition = addTwoColumnRow('Medical Aid Contributions:', formatCurrency(input.medicalContrib || 0), yPosition);
            doc.setFont('helvetica', 'bold');
            yPosition = addTwoColumnRow('Medical Tax Credits:', formatCurrency(result.medicalTaxCredits || 0), yPosition, true);
            doc.setFont('helvetica', 'normal');
            yPosition += SPACING.LINE_HEIGHT / 2;

            // STEP 8: Final Tax Liability
            yPosition = checkNewPage(70);
            doc.setFontSize(FONTS.SUBHEADER);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLORS.SECONDARY);
            yPosition = addText('STEP 8: Final Tax Liability', SPACING.MARGIN, yPosition);
            yPosition += SPACING.LINE_HEIGHT / 2;

            doc.setFontSize(FONTS.SMALL);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(COLORS.MUTED);
            yPosition = addText('Formula: Max(0, Income Tax - Rebates - Medical Credits)', SPACING.MARGIN + SPACING.INDENT, yPosition);
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.TEXT);
            yPosition = addTwoColumnRow('Income Tax:', formatCurrency(result.incomeTax || 0), yPosition);
            yPosition = addTwoColumnRow('Less: Tax Rebates:', `(${formatCurrency(result.primaryRebate || 0)})`, yPosition);
            yPosition = addTwoColumnRow('Less: Medical Credits:', `(${formatCurrency(result.medicalTaxCredits || 0)})`, yPosition);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(FONTS.SUBHEADER);
            yPosition = addTwoColumnRow('FINAL TAX LIABILITY:', formatCurrency(result.totalTax || 0), yPosition, true);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(FONTS.BODY);
            yPosition += SPACING.LINE_HEIGHT;

            // STEP 9: Refund/Owing (if PAYE data available)
            if (result.refundAmount !== undefined || result.amountOwed !== undefined) {
              yPosition = checkNewPage(70);
              doc.setFontSize(FONTS.SUBHEADER);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(COLORS.SECONDARY);
              yPosition = addText('STEP 9: Tax Refund / Amount Owing', SPACING.MARGIN, yPosition);
              yPosition += SPACING.LINE_HEIGHT / 2;

              doc.setFontSize(FONTS.SMALL);
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(COLORS.MUTED);
              yPosition = addText('SARS Reference: IRP5 Code 4102 - PAYE Withheld', SPACING.MARGIN + SPACING.INDENT, yPosition);
              
              const payeWithheld = (result.refundAmount || 0) + (result.totalTax || 0);
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(COLORS.TEXT);
              yPosition = addTwoColumnRow('PAYE Withheld:', formatCurrency(payeWithheld), yPosition);
              yPosition = addTwoColumnRow('Less: Tax Liability:', `(${formatCurrency(result.totalTax || 0)})`, yPosition);
              
              if (result.refundAmount && result.refundAmount > 0) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(COLORS.SUCCESS);
                doc.setFontSize(FONTS.SUBHEADER);
                yPosition = addTwoColumnRow('REFUND DUE:', formatCurrency(result.refundAmount), yPosition, true);
              } else if (result.amountOwed && result.amountOwed > 0) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(COLORS.ERROR);
                doc.setFontSize(FONTS.SUBHEADER);
                yPosition = addTwoColumnRow('AMOUNT OWING:', formatCurrency(result.amountOwed), yPosition, true);
              }
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(FONTS.BODY);
              doc.setTextColor(COLORS.TEXT);
              yPosition += SPACING.LINE_HEIGHT;
            }

            // Tax Summary Box
            yPosition = checkNewPage(50);
            doc.setDrawColor(COLORS.PRIMARY);
            doc.setLineWidth(0.5);
            doc.rect(SPACING.MARGIN, yPosition, contentWidth, 40);
            
            yPosition += 8;
            doc.setFontSize(FONTS.BODY);
            doc.setFont('helvetica', 'bold');
            yPosition = addText('TAX CALCULATION SUMMARY', SPACING.MARGIN + 5, yPosition);
            yPosition += 2;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(FONTS.SMALL);
            yPosition = addTwoColumnRow('Effective Tax Rate:', `${(result.effectiveRate || 0).toFixed(2)}%`, yPosition);
            yPosition = addTwoColumnRow('Marginal Tax Rate:', `${(result.marginalRate || 0).toFixed(2)}%`, yPosition);
            
            yPosition += 15;
          }

          addSectionDivider();
        });
      }

      // Supporting Documents
      if (data.uploads && data.uploads.length > 0) {
        yPosition = checkNewPage(60);
        doc.setFontSize(FONTS.HEADER);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.PRIMARY);
        yPosition = addText('SUPPORTING DOCUMENTS', SPACING.MARGIN, yPosition);
        yPosition += SPACING.LINE_HEIGHT;

        data.uploads.forEach((upload: any, index: number) => {
          yPosition = checkNewPage(25);
          doc.setFontSize(FONTS.BODY);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(COLORS.TEXT);

          yPosition = addText(`${index + 1}. ${upload.original_name}`, SPACING.MARGIN, yPosition);
          yPosition = addTwoColumnRow('   File Size:', `${(upload.file_size / 1024).toFixed(1)} KB`, yPosition);
          yPosition = addTwoColumnRow('   Uploaded:', new Date(upload.created_at).toLocaleDateString('en-ZA'), yPosition);
          yPosition += SPACING.LINE_HEIGHT / 2;
        });
      }

    } else {
      // Fallback content
      yPosition = checkNewPage(80);
      doc.setFontSize(FONTS.HEADER);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.PRIMARY);
      yPosition = addText('REPORT STATUS', SPACING.MARGIN, yPosition);
      yPosition += SPACING.LINE_HEIGHT;

      doc.setFontSize(FONTS.BODY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.TEXT);

      yPosition = addTextBlock('This report has been generated and is ready to be populated with your tax data. Upload your tax documents and process calculations through Taxfy to see comprehensive details here.', SPACING.MARGIN, yPosition);
    }

    // Professional footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setDrawColor(COLORS.BORDER);
      doc.setLineWidth(0.3);
      doc.line(SPACING.MARGIN, pageHeight - 15, pageWidth - SPACING.MARGIN, pageHeight - 15);

      doc.setFontSize(FONTS.SMALL);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.MUTED);

      doc.text('Taxfy.co.za | SARS-Compliant Tax Calculator', SPACING.MARGIN, pageHeight - 8);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - SPACING.MARGIN, pageHeight - 8, { align: 'right' });
      doc.text('Generated: ' + new Date().toLocaleDateString('en-ZA'), pageWidth / 2, pageHeight - 8, { align: 'center' });
    }

    return Buffer.from(doc.output('arraybuffer'));
  }
}
