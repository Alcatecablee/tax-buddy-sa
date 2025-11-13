import { TaxCalculationResult, TaxCalculationInput } from "./taxCalculator";
import { formatCurrency } from "./utils";

// Extended interface for SARS eFiling that includes all necessary fields
export interface SarsEfilingInput extends TaxCalculationInput {
  taxYear?: string;
  taxPaid?: number;
  travelAllowance?: number;
  employerName?: string;
  employerTaxNumber?: string;
  employeeNumber?: string;
  taxReferenceNumber?: string;
}

export interface SarsEfilingData {
  taxYear: string;
  grossIncome: number;
  taxPaid: number;
  refundDue: number;
  retirementContributions: number;
  medicalContributions: number;
  travelAllowance: number;
  medicalCredits: number;
  employerName: string;
  employerTaxNumber: string;
  employeeNumber: string;
  taxReferenceNumber: string;
}

export interface EfilingExportOptions {
  format: "csv" | "excel" | "json";
  includeCalculations: boolean;
  includeRecommendations: boolean;
}

export class SarsEfilingExporter {
  /**
   * Export tax data in SARS eFiling compatible format
   */
  static exportForSarsEfiling(
    input: SarsEfilingInput,
    result: TaxCalculationResult,
    taxPaid: number,
    refundAmount: number,
    options: EfilingExportOptions = {
      format: "csv",
      includeCalculations: true,
      includeRecommendations: false,
    },
  ): string {
    const efilingData = this.prepareSarsData(input, result, taxPaid, refundAmount);

    switch (options.format) {
      case "csv":
        return this.generateCSV(efilingData, options);
      case "excel":
        return this.generateExcel(efilingData, options);
      case "json":
        return this.generateJSON(efilingData, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Download SARS eFiling export file
   */
  static downloadSarsEfilingExport(
    input: SarsEfilingInput,
    result: TaxCalculationResult,
    taxPaid: number,
    refundAmount: number,
    format: "csv" | "excel" | "json" = "csv",
  ): void {
    const exportData = this.exportForSarsEfiling(input, result, taxPaid, refundAmount, {
      format,
      includeCalculations: true,
      includeRecommendations: true,
    });

    const filename = `SARS_eFiling_Data_${input.taxYear || new Date().getFullYear()}.${format}`;
    const mimeType = this.getMimeType(format);

    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Prepare data in SARS-compatible format
   */
  private static prepareSarsData(
    input: SarsEfilingInput,
    result: TaxCalculationResult,
    taxPaid: number,
    refundAmount: number,
  ): SarsEfilingData {
    return {
      taxYear: input.taxYear || new Date().getFullYear().toString(),
      grossIncome: input.grossIncome,
      taxPaid: taxPaid,
      refundDue: refundAmount,
      retirementContributions: input.retirementContrib || 0,
      medicalContributions: input.medicalContrib || 0,
      travelAllowance: input.travelAllowance || 0,
      medicalCredits: result.medicalTaxCredits || 0,
      employerName: input.employerName || "",
      employerTaxNumber: input.employerTaxNumber || "",
      employeeNumber: input.employeeNumber || "",
      taxReferenceNumber: input.taxReferenceNumber || "",
    };
  }

  /**
   * Generate CSV format for SARS eFiling
   */
  private static generateCSV(
    data: SarsEfilingData,
    options: EfilingExportOptions,
  ): string {
    const headers = ["Field", "Value", "SARS_Section", "Description"];

    const rows = [
      headers,
      ["Tax Year", data.taxYear, "General", "Tax year for this return"],
      [
        "Gross Income",
        data.grossIncome.toString(),
        "Section_1",
        "Total gross income before deductions",
      ],
      [
        "PAYE Tax Paid",
        data.taxPaid.toString(),
        "Section_2",
        "Total PAYE tax paid during the year",
      ],
      [
        "Retirement Contributions",
        data.retirementContributions.toString(),
        "Section_3",
        "Retirement fund contributions",
      ],
      [
        "Medical Contributions",
        data.medicalContributions.toString(),
        "Section_4",
        "Medical aid contributions",
      ],
      [
        "Travel Allowance",
        data.travelAllowance.toString(),
        "Section_5",
        "Travel allowance received",
      ],
      [
        "Medical Credits",
        data.medicalCredits.toString(),
        "Section_6",
        "Medical scheme fees tax credit",
      ],
      [
        "Tax Refund Due",
        data.refundDue.toString(),
        "Calculated",
        "Calculated tax refund amount",
      ],
      ["Employer Name", data.employerName, "Employer_Info", "Name of employer"],
      [
        "Employer Tax Number",
        data.employerTaxNumber,
        "Employer_Info",
        "Employer tax reference number",
      ],
      [
        "Employee Number",
        data.employeeNumber,
        "Employee_Info",
        "Employee number or ID",
      ],
      [
        "Tax Reference Number",
        data.taxReferenceNumber,
        "Personal_Info",
        "Personal tax reference number",
      ],
    ];

    return rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  /**
   * Generate Excel-compatible CSV format
   */
  private static generateExcel(
    data: SarsEfilingData,
    options: EfilingExportOptions,
  ): string {
    // For Excel, we generate a more structured CSV with additional metadata
    const sections = [
      ["SARS eFiling Data Export"],
      ["Generated by Taxfy on:", new Date().toISOString()],
      [""],
      ["PERSONAL INFORMATION"],
      ["Tax Reference Number", data.taxReferenceNumber],
      ["Tax Year", data.taxYear],
      [""],
      ["EMPLOYER INFORMATION"],
      ["Employer Name", data.employerName],
      ["Employer Tax Number", data.employerTaxNumber],
      ["Employee Number", data.employeeNumber],
      [""],
      ["INCOME INFORMATION"],
      ["Gross Income", formatCurrency(data.grossIncome)],
      ["PAYE Tax Paid", formatCurrency(data.taxPaid)],
      ["Travel Allowance", formatCurrency(data.travelAllowance)],
      [""],
      ["DEDUCTIONS"],
      [
        "Retirement Contributions",
        formatCurrency(data.retirementContributions),
      ],
      ["Medical Contributions", formatCurrency(data.medicalContributions)],
      [""],
      ["CREDITS"],
      ["Medical Credits", formatCurrency(data.medicalCredits)],
      [""],
      ["CALCULATION RESULT"],
      ["Tax Refund Due", formatCurrency(data.refundDue)],
      [""],
      ["INSTRUCTIONS"],
      ["1. Log into SARS eFiling at www.sarsefiling.co.za"],
      ["2. Start your ITR12 return"],
      ["3. Use the values above to fill in each section"],
      ["4. Verify all information is correct"],
      ["5. Submit your return electronically"],
      ["6. Keep this file for your records"],
    ];

    return sections
      .map((row) => row.map((cell) => `"${cell || ""}"`).join(","))
      .join("\n");
  }

  /**
   * Generate JSON format for API integration
   */
  private static generateJSON(
    data: SarsEfilingData,
    options: EfilingExportOptions,
  ): string {
    interface ExportObject {
      metadata: {
        exportDate: string;
        exportedBy: string;
        version: string;
        format: string;
      };
      taxData: SarsEfilingData;
      instructions: string[];
      calculationNotes?: string[];
    }

    const exportObj: ExportObject = {
      metadata: {
        exportDate: new Date().toISOString(),
        exportedBy: "Taxfy",
        version: "1.0",
        format: "SARS_eFiling_Compatible",
      },
      taxData: data,
      instructions: [
        "This data is formatted for SARS eFiling compatibility",
        "Log into SARS eFiling at www.sarsefiling.co.za",
        "Start your ITR12 return and enter the values from taxData",
        "Verify all information before submitting to SARS",
        "Keep this export for your records",
      ],
    };

    if (options.includeCalculations) {
      exportObj.calculationNotes = [
        "All amounts are in South African Rand (ZAR)",
        "Tax calculations follow SARS 2025/26 tax tables",
        "Deductions are applied according to SARS regulations",
        "Medical credits calculated per SARS guidelines",
      ];
    }

    return JSON.stringify(exportObj, null, 2);
  }

  /**
   * Get MIME type for export format
   */
  private static getMimeType(format: string): string {
    switch (format) {
      case "csv":
        return "text/csv;charset=utf-8;";
      case "excel":
        return "application/vnd.ms-excel;charset=utf-8;";
      case "json":
        return "application/json;charset=utf-8;";
      default:
        return "text/plain;charset=utf-8;";
    }
  }

  /**
   * Validate data before export
   */
  static validateExportData(
    input: SarsEfilingInput,
    taxPaid: number,
    refundAmount: number,
  ): string[] {
    const errors: string[] = [];

    if (!input.grossIncome || input.grossIncome <= 0) {
      errors.push("Gross income is required and must be greater than zero");
    }

    if (taxPaid === undefined || taxPaid < 0) {
      errors.push("Tax paid amount is required and cannot be negative");
    }

    if (!input.taxYear) {
      errors.push("Tax year is required");
    }

    if (refundAmount === undefined) {
      errors.push("Tax calculation result is required");
    }

    return errors;
  }

  /**
   * Generate summary for user before export
   */
  static generateExportSummary(
    input: SarsEfilingInput,
    taxPaid: number,
    refundAmount: number,
  ): string {
    return `
SARS eFiling Export Summary
==========================

Tax Year: ${input.taxYear || "Current"}
Gross Income: ${formatCurrency(input.grossIncome)}
Tax Paid: ${formatCurrency(taxPaid)}
Calculated Refund: ${formatCurrency(refundAmount)}

This export contains all the information needed to complete your SARS eFiling return.
The data is formatted to be easily entered into the SARS eFiling system.

Next Steps:
1. Download the export file (CSV recommended for easy viewing)
2. Log into SARS eFiling at www.sarsefiling.co.za
3. Start your ITR12 return
4. Use the exported data to fill in each section
5. Submit your return through the official SARS system

Note: Always verify your information before submitting to SARS.
SARS does not accept direct XML uploads - you must enter data via their web portal.
    `.trim();
  }
}
