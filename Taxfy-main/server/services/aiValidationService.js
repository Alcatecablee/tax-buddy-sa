// Backend AI Validation Service for South African Tax Validation

class AIValidationService {
  constructor() {
    this.isInitialized = true;
  }

  async validateField(field, value, context) {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    switch (field) {
      case "grossSalary":
      case "grossRemuneration":
        return this.validateGrossSalary(numericValue, context);

      case "payeWithheld":
        return this.validatePayeWithheld(numericValue, context);

      case "retirementContribution":
      case "retirementFund":
        return this.validateRetirementContribution(numericValue, context);

      case "medicalAidContribution":
      case "medicalScheme":
        return this.validateMedicalContribution(numericValue, context);

      case "medicalCredits":
        return this.validateMedicalCredits(numericValue, context);

      case "uifContribution":
        return this.validateUIFContribution(numericValue, context);

      case "travelAllowance":
        return this.validateTravelAllowance(numericValue, context);

      default:
        return this.validateGeneric(numericValue, context);
    }
  }

  validateGrossSalary(value, context) {
    const suggestions = [];
    const anomalies = [];

    // South African salary benchmarks (2024/2025)
    const minWage = 3500; // Monthly minimum wage
    const averageSalary = 25000; // Monthly average
    const highSalary = 100000; // Monthly high earner

    if (value < minWage) {
      anomalies.push("Salary below minimum wage threshold");
      suggestions.push("Verify if this includes all income sources");
      return {
        isValid: false,
        confidence: 65,
        message: "Unusually low salary detected",
        suggestions,
        anomalies,
        severity: "medium",
      };
    }

    if (value > highSalary * 12) {
      suggestions.push("High income - ensure all deductions are maximized");
      suggestions.push("Consider additional tax planning strategies");
    }

    // Check against PAYE if available
    if (context.relatedFields?.payeWithheld) {
      const expectedPAYE = this.calculateExpectedPAYE(value);
      const actualPAYE = context.relatedFields.payeWithheld;
      const variance = Math.abs(expectedPAYE - actualPAYE) / expectedPAYE;

      if (variance > 0.15) {
        // 15% variance threshold
        anomalies.push(
          "PAYE withholding does not match expected amount for this salary level",
        );
        suggestions.push("Double-check PAYE amount on your IRP5");
      }
    }

    return {
      isValid: true,
      confidence: anomalies.length > 0 ? 78 : 92,
      message:
        anomalies.length > 0
          ? "Some anomalies detected"
          : "Salary amount appears reasonable",
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      anomalies: anomalies.length > 0 ? anomalies : undefined,
      severity: anomalies.length > 0 ? "medium" : "low",
    };
  }

  validatePayeWithheld(value, context) {
    const suggestions = [];
    const anomalies = [];

    if (value <= 0) {
      return {
        isValid: false,
        confidence: 85,
        message: "No PAYE withheld - unusual for employed individuals",
        suggestions: [
          "Verify if you were employed for the full tax year",
          "Check if this is correct on your IRP5",
        ],
        severity: "high",
      };
    }

    // Check against gross salary if available
    if (
      context.relatedFields?.grossSalary ||
      context.relatedFields?.grossRemuneration
    ) {
      const grossSalary =
        context.relatedFields.grossSalary ||
        context.relatedFields.grossRemuneration;
      const payePercentage = (value / grossSalary) * 100;

      if (payePercentage < 15) {
        anomalies.push("PAYE percentage seems low for this income level");
        suggestions.push("Verify PAYE amount on IRP5 certificate");
      } else if (payePercentage > 45) {
        anomalies.push("PAYE percentage seems high - may indicate errors");
        suggestions.push("Check for any additional voluntary tax payments");
      }
    }

    return {
      isValid: true,
      confidence: anomalies.length > 0 ? 75 : 88,
      message:
        anomalies.length > 0
          ? "PAYE amount may need verification"
          : "PAYE amount appears reasonable",
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      anomalies: anomalies.length > 0 ? anomalies : undefined,
      severity: anomalies.length > 0 ? "medium" : "low",
    };
  }

  validateRetirementContribution(value, context) {
    const suggestions = [];
    const anomalies = [];

    if (value < 0) {
      return {
        isValid: false,
        confidence: 95,
        message: "Retirement contribution cannot be negative",
        severity: "high",
      };
    }

    // Check against gross salary for reasonableness
    if (
      context.relatedFields?.grossSalary ||
      context.relatedFields?.grossRemuneration
    ) {
      const grossSalary =
        context.relatedFields.grossSalary ||
        context.relatedFields.grossRemuneration;
      const contributionPercentage = (value / grossSalary) * 100;

      if (contributionPercentage > 27.5) {
        anomalies.push(
          "Retirement contribution exceeds tax-deductible limit (27.5%)",
        );
        suggestions.push("Consider if excess contributions are included");
      } else if (contributionPercentage < 5 && grossSalary > 300000) {
        suggestions.push(
          "Consider increasing retirement contributions for better tax efficiency",
        );
      }
    }

    return {
      isValid: true,
      confidence: 90,
      message:
        value > 0
          ? "Retirement contribution amount verified"
          : "No retirement contribution detected",
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      anomalies: anomalies.length > 0 ? anomalies : undefined,
      severity: anomalies.length > 0 ? "medium" : "low",
    };
  }

  validateMedicalContribution(value, context) {
    const suggestions = [];

    if (value < 0) {
      return {
        isValid: false,
        confidence: 95,
        message: "Medical aid contribution cannot be negative",
        severity: "high",
      };
    }

    if (value > 0 && value < 1000) {
      suggestions.push(
        "Unusually low medical aid contribution - verify amount",
      );
    }

    if (value > 50000) {
      suggestions.push(
        "High medical aid contribution - ensure this includes family members",
      );
    }

    return {
      isValid: true,
      confidence: 87,
      message:
        value > 0
          ? "Medical aid contribution appears reasonable"
          : "No medical aid contribution",
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      severity: "low",
    };
  }

  validateMedicalCredits(value, context) {
    if (value < 0) {
      return {
        isValid: false,
        confidence: 95,
        message: "Medical credits cannot be negative",
        severity: "high",
      };
    }

    // Medical tax credits for 2024/2025 tax year
    const singleCredit = 347 * 12; // R347 per month
    const familyCredit = singleCredit + 234 * 12 * 2; // Additional for dependents

    const suggestions = [];

    if (value > familyCredit) {
      suggestions.push("Medical credits seem high - verify calculation");
    }

    return {
      isValid: true,
      confidence: 85,
      message:
        value > 0 ? "Medical credits calculated" : "No medical credits claimed",
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      severity: "low",
    };
  }

  validateUIFContribution(value, context) {
    if (value < 0) {
      return {
        isValid: false,
        confidence: 95,
        message: "UIF contribution cannot be negative",
        severity: "high",
      };
    }

    // UIF is 1% of salary up to R17,712 annually (2024/2025)
    const maxUIFContribution = 177.12 * 12; // Monthly cap

    const suggestions = [];

    if (value > maxUIFContribution) {
      suggestions.push("UIF contribution exceeds maximum annual amount");
    }

    if (context.relatedFields?.grossSalary) {
      const expectedUIF = Math.min(
        context.relatedFields.grossSalary * 0.01,
        maxUIFContribution,
      );
      const variance = Math.abs(value - expectedUIF) / expectedUIF;

      if (variance > 0.1) {
        suggestions.push(
          "UIF contribution does not match expected 1% of salary",
        );
      }
    }

    return {
      isValid: true,
      confidence: 88,
      message: "UIF contribution verified",
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      severity: "low",
    };
  }

  validateTravelAllowance(value, context) {
    if (value < 0) {
      return {
        isValid: false,
        confidence: 95,
        message: "Travel allowance cannot be negative",
        severity: "high",
      };
    }

    const suggestions = [];

    if (value > 0) {
      suggestions.push(
        "Remember to claim actual travel expenses to reduce taxable travel allowance",
      );
    }

    return {
      isValid: true,
      confidence: 90,
      message: value > 0 ? "Travel allowance noted" : "No travel allowance",
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      severity: "low",
    };
  }

  validateGeneric(value, context) {
    if (isNaN(value)) {
      return {
        isValid: false,
        confidence: 90,
        message: "Invalid numeric value",
        severity: "high",
      };
    }

    return {
      isValid: true,
      confidence: 80,
      message: "Value appears valid",
      severity: "low",
    };
  }

  calculateExpectedPAYE(annualSalary) {
    // Simplified PAYE calculation for 2024/2025
    const taxBrackets = [
      { min: 0, max: 237100, rate: 0.18 },
      { min: 237100, max: 370500, rate: 0.26 },
      { min: 370500, max: 512800, rate: 0.31 },
      { min: 512800, max: 673000, rate: 0.36 },
      { min: 673000, max: 857900, rate: 0.39 },
      { min: 857900, max: 1817000, rate: 0.41 },
      { min: 1817000, max: Infinity, rate: 0.45 },
    ];

    let tax = 0;

    for (const bracket of taxBrackets) {
      if (annualSalary > bracket.min) {
        const taxableInBracket = Math.min(
          annualSalary - bracket.min,
          bracket.max - bracket.min,
        );
        tax += taxableInBracket * bracket.rate;
      }
    }

    // Primary rebate for 2024/2025
    const primaryRebate = 17235;

    return Math.max(0, tax - primaryRebate);
  }

  async validateMultipleFields(fields, context) {
    const results = {};

    for (const [field, value] of Object.entries(fields)) {
      results[field] = await this.validateField(field, value, {
        ...context,
        relatedFields: fields,
      });
    }

    return results;
  }
}

export const aiValidationService = new AIValidationService();
export default aiValidationService;
