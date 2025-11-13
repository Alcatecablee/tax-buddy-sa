import { jsPDF } from "jspdf";
import { TaxCalculationInput, TaxCalculationResult } from "./taxCalculator";
import {
  initializePDFWithUTF8Support,
  renderTextSafe,
  renderSectionHeader,
  loadCustomFont,
} from "./fontUtils";

export interface ComprehensiveReportData {
  // Document metadata
  documentName: string;
  processingDate: string;
  processingTime: string;
  taxYear: string;

  // Input data
  input: TaxCalculationInput;

  // Calculation results
  result: TaxCalculationResult;

  // Additional data
  payeWithheld: number;
  refundOrOwing: number;
  isRefund: boolean;

  // Audit trail
  auditSteps: AuditStep[];

  // Recommendations
  recommendations: TaxRecommendation[];

  // Compliance info
  complianceChecks: ComplianceCheck[];
}

export interface AuditStep {
  step: number;
  title: string;
  calculation: string;
  result: number;
  formula: string;
  sarsReference: string;
  verified: boolean;
  notes?: string;
}

export interface TaxRecommendation {
  id: string;
  category: "deduction" | "investment" | "planning" | "compliance";
  title: string;
  description: string;
  potentialSaving: number;
  priority: "high" | "medium" | "low";
  actionRequired: string;
  deadline?: string;
}

export interface ComplianceCheck {
  requirement: string;
  status: "compliant" | "warning" | "non-compliant";
  description: string;
  reference: string;
}

export class EnhancedPDFGenerator {
  private static async loadLogo(): Promise<string | null> {
    try {
      console.log("🔍 Starting logo loading process...");

      // Try multiple logo paths
      const logoPaths = [
        "https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800",
        "/assets/logo-ta.png",
        "/assets/logo-t.png",
      ];

      for (const logoPath of logoPaths) {
        try {
          console.log(`📸 Attempting to load logo from: ${logoPath}`);
          const response = await fetch(logoPath);
          console.log(
            `📡 Fetch response status: ${response.status} ${response.statusText}`,
          );

          if (response.ok) {
            const blob = await response.blob();
            console.log(
              `📦 Blob created, size: ${(blob.size / 1024 / 1024).toFixed(2)}MB, type: ${blob.type}`,
            );

            // Check if blob is too large (>1MB might cause issues)
            if (blob.size > 1024 * 1024) {
              console.warn(
                `⚠️ Logo file is large (${(blob.size / 1024 / 1024).toFixed(2)}MB), compressing for PDF...`,
              );

              // Compress the image using canvas
              const compressedDataUrl = await this.compressImage(
                blob,
                0.7,
                200,
                200,
              );
              console.log("✅ Logo compressed successfully");
              return compressedDataUrl;
            } else {
              // Convert to data URL for smaller images
              const dataUrl = await this.blobToDataUrl(blob);
              console.log("✅ Logo converted to data URL");
              return dataUrl;
            }
          } else {
            console.warn(
              `⚠️ Failed to fetch logo from ${logoPath}: ${response.status}`,
            );
          }
        } catch (pathError) {
          console.warn(`⚠️ Error loading logo from ${logoPath}:`, pathError);
        }
      }

      console.warn("⚠️ All logo paths failed, proceeding without logo");
      return null;
    } catch (error) {
      console.error("❌ Logo loading failed completely:", error);
      return null;
    }
  }

  private static async compressImage(
    blob: Blob,
    quality: number,
    maxWidth: number,
    maxHeight: number,
  ): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.src = URL.createObjectURL(blob);
    });
  }

  private static async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  private static getModernTheme() {
    return {
      // Primary brand colors - modern blue palette
      primary: { r: 59, g: 130, b: 246 }, // Blue-500
      primaryLight: { r: 147, g: 197, b: 253 }, // Blue-300
      primaryDark: { r: 29, g: 78, b: 216 }, // Blue-700

      // Neutral colors for professional look with stronger contrast
      gray: {
        50: { r: 249, g: 250, b: 251 },
        100: { r: 243, g: 244, b: 246 },
        200: { r: 209, g: 213, b: 219 }, // Darker for better visibility
        300: { r: 156, g: 163, b: 175 }, // Much darker
        400: { r: 107, g: 114, b: 128 }, // Darker
        500: { r: 75, g: 85, b: 99 }, // Darker
        600: { r: 55, g: 65, b: 81 }, // Darker
        700: { r: 31, g: 41, b: 55 }, // Darker
        800: { r: 17, g: 24, b: 39 }, // Much darker
        900: { r: 0, g: 0, b: 0 }, // Pure black for maximum contrast
      },

      // Status colors
      success: { r: 34, g: 197, b: 94 }, // Green-500
      warning: { r: 245, g: 158, b: 11 }, // Amber-500
      error: { r: 239, g: 68, b: 68 }, // Red-500

      // Special colors
      accent: { r: 139, g: 92, b: 246 }, // Violet-500
      background: { r: 255, g: 255, b: 255 }, // White
      cardBg: { r: 240, g: 245, b: 251 }, // Much more visible background
    };
  }

  private static addModernHeader(
    pdf: jsPDF,
    data: ComprehensiveReportData,
    logo: string | null,
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const theme = this.getModernTheme();

    // Clean white background with subtle brand accent
    pdf.setFillColor(
      theme.background.r,
      theme.background.g,
      theme.background.b,
    );
    pdf.rect(0, 0, pageWidth, 70, "F");

    // Brand accent bar at top
    pdf.setFillColor(theme.primary.r, theme.primary.g, theme.primary.b);
    pdf.rect(0, 0, pageWidth, 4, "F");

    // Logo placement (if available)
    if (logo) {
      try {
        pdf.addImage(logo, "JPEG", 25, 15, 30, 30, undefined, "FAST");
      } catch (logoError) {
        console.warn("⚠️ Failed to add logo to PDF:", logoError);
      }
    }

    // Modern typography with hierarchy
    const textStartX = logo ? 65 : 25;

    // Main title - modern, clean typography
    renderTextSafe(pdf, "TAX REPORT", textStartX, 25, {
      fontSize: 24,
      fontStyle: "bold",
      color: [theme.gray[900].r, theme.gray[900].g, theme.gray[900].b],
    });

    // Subtitle with modern styling
    renderTextSafe(
      pdf,
      "Professional Tax Analysis & Calculation",
      textStartX,
      35,
      {
        fontSize: 12,
        fontStyle: "normal",
        color: [theme.gray[600].r, theme.gray[600].g, theme.gray[600].b],
      },
    );

    // Tax year with accent color
    renderTextSafe(pdf, `Tax Year ${data.taxYear}`, textStartX, 45, {
      fontSize: 11,
      fontStyle: "bold",
      color: [theme.primary.r, theme.primary.g, theme.primary.b],
    });

    // Right-aligned metadata with modern styling
    const rightX = pageWidth - 25;
    const metadataColor = [
      theme.gray[500].r,
      theme.gray[500].g,
      theme.gray[500].b,
    ];

    // Create right-aligned text
    const dateText = `${data.processingDate}`;
    const timeText = `${data.processingTime}`;
    const docText = `${data.documentName}`;

    renderTextSafe(pdf, dateText, rightX - pdf.getTextWidth(dateText), 20, {
      fontSize: 9,
      color: metadataColor,
    });
    renderTextSafe(pdf, timeText, rightX - pdf.getTextWidth(timeText), 28, {
      fontSize: 9,
      color: metadataColor,
    });
    renderTextSafe(pdf, docText, rightX - pdf.getTextWidth(docText), 36, {
      fontSize: 9,
      color: metadataColor,
    });

    // Powered by Taxfy with modern styling
    renderTextSafe(pdf, "Powered by Taxfy", textStartX, 55, {
      fontSize: 9,
      color: [theme.gray[400].r, theme.gray[400].g, theme.gray[400].b],
    });

    // Subtle separator line
    pdf.setDrawColor(theme.gray[200].r, theme.gray[200].g, theme.gray[200].b);
    pdf.setLineWidth(0.5);
    pdf.line(25, 65, pageWidth - 25, 65);

    return 70; // Reduced spacing
  }

  private static addExecutiveSummary(
    pdf: jsPDF,
    data: ComprehensiveReportData,
    yPos: number,
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const theme = this.getModernTheme();

    // Modern section header
    yPos = this.addSectionTitle(pdf, "Executive Summary", yPos, margin);

    // Hero card for main result - much more compact
    const cardHeight = 45;
    const cardY = yPos + 2;

    // Card background with subtle shadow effect
    pdf.setFillColor(theme.cardBg.r, theme.cardBg.g, theme.cardBg.b);
    pdf.roundedRect(margin, cardY, contentWidth, cardHeight, 4, 4, "F");

    // Card border - much darker and thicker
    pdf.setDrawColor(theme.gray[800].r, theme.gray[800].g, theme.gray[800].b);
    pdf.setLineWidth(2);
    pdf.roundedRect(margin, cardY, contentWidth, cardHeight, 4, 4, "S");

    // Status indicator stripe
    const statusColor = data.isRefund ? theme.success : theme.error;
    pdf.setFillColor(statusColor.r, statusColor.g, statusColor.b);
    pdf.roundedRect(margin, cardY, 4, cardHeight, 2, 2, "F");

    // Main amount - large, prominent
    const refundOrOwing = data.refundOrOwing ?? 0;
    const amountText = `R${Math.abs(refundOrOwing).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const amountWidth = pdf.getTextWidth(amountText);
    const centerX = margin + contentWidth / 2;

    renderTextSafe(pdf, amountText, centerX - amountWidth / 2, cardY + 30, {
      fontSize: 28,
      fontStyle: "bold",
      color: [statusColor.r, statusColor.g, statusColor.b],
    });

    // Status label
    const statusText = data.isRefund ? "REFUND DUE" : "TAX OWING";
    const statusWidth = pdf.getTextWidth(statusText);
    renderTextSafe(pdf, statusText, centerX - statusWidth / 2, cardY + 45, {
      fontSize: 12,
      fontStyle: "bold",
      color: [theme.gray[600].r, theme.gray[600].g, theme.gray[600].b],
    });

    yPos = cardY + cardHeight + 20;

    // Key metrics in a grid layout
    yPos = this.addMetricsGrid(pdf, data, yPos, margin);

    return yPos + 10;
  }

  private static addMetricsGrid(
    pdf: jsPDF,
    data: ComprehensiveReportData,
    yPos: number,
    margin: number,
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;
    const theme = this.getModernTheme();

    // Grid of 3x2 metric cards - much more compact
    const cardWidth = (contentWidth - 10) / 3; // 5px gap between cards
    const cardHeight = 35;
    const gap = 5;

    // Safe access to data properties with fallbacks
    const grossIncome = data.result?.grossIncome ?? 0;
    const taxableIncome = data.result?.taxableIncome ?? 0;
    const totalTax = data.result?.totalTax ?? 0;
    const payeWithheld = data.payeWithheld ?? 0;
    const effectiveTaxRate = data.result?.effectiveTaxRate ?? 0;
    const marginalTaxRate = data.result?.marginalTaxRate ?? 0;

    const metrics = [
      {
        label: "Gross Income",
        value: `R${grossIncome.toLocaleString("en-ZA")}`,
        color: theme.gray[700],
      },
      {
        label: "Taxable Income",
        value: `R${taxableIncome.toLocaleString("en-ZA")}`,
        color: theme.gray[700],
      },
      {
        label: "Tax Due",
        value: `R${totalTax.toLocaleString("en-ZA")}`,
        color: theme.gray[700],
      },
      {
        label: "PAYE Withheld",
        value: `R${payeWithheld.toLocaleString("en-ZA")}`,
        color: theme.primary,
      },
      {
        label: "Effective Rate",
        value: `${effectiveTaxRate.toFixed(1)}%`,
        color: theme.accent,
      },
      {
        label: "Marginal Rate",
        value: `${marginalTaxRate.toFixed(0)}%`,
        color: theme.accent,
      },
    ];

    for (let i = 0; i < metrics.length; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const cardX = margin + col * (cardWidth + gap);
      const cardY = yPos + row * (cardHeight + gap);

      // Card background
      pdf.setFillColor(
        theme.background.r,
        theme.background.g,
        theme.background.b,
      );
      pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 4, 4, "F");

      // Card border - much darker and thicker
      pdf.setDrawColor(theme.gray[800].r, theme.gray[800].g, theme.gray[800].b);
      pdf.setLineWidth(2);
      pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 4, 4, "S");

      // Metric value
      renderTextSafe(pdf, metrics[i].value, cardX + 8, cardY + 18, {
        fontSize: 14,
        fontStyle: "bold",
        color: [metrics[i].color.r, metrics[i].color.g, metrics[i].color.b],
      });

      // Metric label
      renderTextSafe(pdf, metrics[i].label, cardX + 8, cardY + 32, {
        fontSize: 9,
        color: [theme.gray[500].r, theme.gray[500].g, theme.gray[500].b],
      });
    }

    return yPos + cardHeight * 2 + gap + 20;
  }

  private static addSectionTitle(
    pdf: jsPDF,
    title: string,
    yPos: number,
    margin: number,
  ): number {
    const theme = this.getModernTheme();

    renderTextSafe(pdf, title, margin, yPos + 15, {
      fontSize: 16,
      fontStyle: "bold",
      color: [theme.gray[900].r, theme.gray[900].g, theme.gray[900].b],
    });

    // Underline accent
    pdf.setDrawColor(theme.primary.r, theme.primary.g, theme.primary.b);
    pdf.setLineWidth(2);
    pdf.line(
      margin,
      yPos + 20,
      margin + pdf.getTextWidth(title) + 10,
      yPos + 20,
    );

    return yPos + 30;
  }

  private static addDetailedBreakdown(
    pdf: jsPDF,
    data: ComprehensiveReportData,
    yPos: number,
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const theme = this.getModernTheme();

    yPos = this.checkPageBreak(pdf, yPos, 100);
    yPos = this.addSectionTitle(
      pdf,
      "Income & Deduction Breakdown",
      yPos,
      margin,
    );

    // Income sources card - more compact and darker borders
    const cardHeight = 50;
    pdf.setFillColor(theme.cardBg.r, theme.cardBg.g, theme.cardBg.b);
    pdf.roundedRect(margin, yPos, contentWidth, cardHeight, 4, 4, "F");

    pdf.setDrawColor(theme.gray[800].r, theme.gray[800].g, theme.gray[800].b);
    pdf.setLineWidth(2);
    pdf.roundedRect(margin, yPos, contentWidth, cardHeight, 4, 4, "S");

    // Card header
    renderTextSafe(pdf, "Income Sources", margin + 15, yPos + 15, {
      fontSize: 12,
      fontStyle: "bold",
      color: [theme.gray[800].r, theme.gray[800].g, theme.gray[800].b],
    });

    // Income breakdown
    const incomeItems = [
      {
        label: "Gross Remuneration (IRP5)",
        value: data.result?.grossIncome ?? 0,
      },
      { label: "Taxable Benefits", value: 0 },
      { label: "Other Income", value: 0 },
    ];

    let itemY = yPos + 25;
    incomeItems.forEach((item) => {
      renderTextSafe(pdf, item.label, margin + 15, itemY, {
        fontSize: 10,
        color: [theme.gray[600].r, theme.gray[600].g, theme.gray[600].b],
      });

      const valueText = `R${item.value.toLocaleString("en-ZA")}`;
      renderTextSafe(
        pdf,
        valueText,
        margin + contentWidth - 15 - pdf.getTextWidth(valueText),
        itemY,
        {
          fontSize: 10,
          fontStyle: "bold",
          color: [theme.gray[700].r, theme.gray[700].g, theme.gray[700].b],
        },
      );

      itemY += 12;
    });

    return yPos + cardHeight + 20;
  }

  private static addAuditTrail(
    pdf: jsPDF,
    data: ComprehensiveReportData,
    yPos: number,
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const theme = this.getModernTheme();

    yPos = this.checkPageBreak(pdf, yPos, 150);
    yPos = this.addSectionTitle(
      pdf,
      "Tax Calculation Audit Trail",
      yPos,
      margin,
    );

    const auditSteps = data.auditSteps ?? [];
    auditSteps.forEach((step, index) => {
      yPos = this.checkPageBreak(pdf, yPos, 80);

      // Step card - more compact and darker borders
      const stepCardHeight = 60;

      // Card background with step number indicator
      pdf.setFillColor(
        theme.background.r,
        theme.background.g,
        theme.background.b,
      );
      pdf.roundedRect(margin, yPos, contentWidth, stepCardHeight, 4, 4, "F");

      // Border - much darker and thicker
      pdf.setDrawColor(theme.gray[800].r, theme.gray[800].g, theme.gray[800].b);
      pdf.setLineWidth(2);
      pdf.roundedRect(margin, yPos, contentWidth, stepCardHeight, 4, 4, "S");

      // Step number circle
      pdf.setFillColor(theme.primary.r, theme.primary.g, theme.primary.b);
      pdf.circle(margin + 20, yPos + 15, 8, "F");

      renderTextSafe(pdf, step.step.toString(), margin + 17, yPos + 18, {
        fontSize: 10,
        fontStyle: "bold",
        color: [255, 255, 255],
      });

      // Step title
      renderTextSafe(pdf, step.title, margin + 35, yPos + 15, {
        fontSize: 12,
        fontStyle: "bold",
        color: [theme.gray[800].r, theme.gray[800].g, theme.gray[800].b],
      });

      // Result highlight
      const stepResult = step.result ?? 0;
      const resultText = `R${stepResult.toLocaleString("en-ZA")}`;
      const resultWidth = pdf.getTextWidth(resultText);
      renderTextSafe(
        pdf,
        resultText,
        margin + contentWidth - 15 - resultWidth,
        yPos + 15,
        {
          fontSize: 12,
          fontStyle: "bold",
          color: [theme.success.r, theme.success.g, theme.success.b],
        },
      );

      // Formula and reference
      renderTextSafe(pdf, step.formula, margin + 35, yPos + 30, {
        fontSize: 9,
        color: [theme.gray[600].r, theme.gray[600].g, theme.gray[600].b],
      });

      renderTextSafe(
        pdf,
        `SARS Reference: ${step.sarsReference}`,
        margin + 35,
        yPos + 42,
        {
          fontSize: 8,
          color: [theme.gray[500].r, theme.gray[500].g, theme.gray[500].b],
        },
      );

      // Verified checkmark
      if (step.verified) {
        renderTextSafe(pdf, "��� Verified", margin + 35, yPos + 55, {
          fontSize: 8,
          color: [theme.success.r, theme.success.g, theme.success.b],
        });
      }

      yPos += stepCardHeight + 12;
    });

    return yPos;
  }

  private static addRecommendations(
    pdf: jsPDF,
    data: ComprehensiveReportData,
    yPos: number,
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const theme = this.getModernTheme();

    const recommendations = data.recommendations ?? [];
    if (recommendations.length === 0) return yPos;

    yPos = this.checkPageBreak(pdf, yPos, 100);
    yPos = this.addSectionTitle(
      pdf,
      "Tax Optimization Recommendations",
      yPos,
      margin,
    );

    recommendations.forEach((rec) => {
      yPos = this.checkPageBreak(pdf, yPos, 60);

      const cardHeight = 55;

      // Priority color
      const priorityColor =
        rec.priority === "high"
          ? theme.error
          : rec.priority === "medium"
            ? theme.warning
            : theme.gray[500];

      // Card background
      pdf.setFillColor(
        theme.background.r,
        theme.background.g,
        theme.background.b,
      );
      pdf.roundedRect(margin, yPos, contentWidth, cardHeight, 6, 6, "F");

      // Priority indicator stripe
      pdf.setFillColor(priorityColor.r, priorityColor.g, priorityColor.b);
      pdf.roundedRect(margin, yPos, 4, cardHeight, 2, 2, "F");

      // Border
      pdf.setDrawColor(theme.gray[200].r, theme.gray[200].g, theme.gray[200].b);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, yPos, contentWidth, cardHeight, 6, 6, "S");

      // Priority badge
      const priorityText = rec.priority.toUpperCase();
      const badgeWidth = pdf.getTextWidth(priorityText) + 12;
      pdf.setFillColor(priorityColor.r, priorityColor.g, priorityColor.b, 0.1);
      pdf.roundedRect(margin + 15, yPos + 8, badgeWidth, 12, 6, 6, "F");

      renderTextSafe(pdf, priorityText, margin + 21, yPos + 16, {
        fontSize: 8,
        fontStyle: "bold",
        color: [priorityColor.r, priorityColor.g, priorityColor.b],
      });

      // Title
      renderTextSafe(pdf, rec.title, margin + 15, yPos + 30, {
        fontSize: 11,
        fontStyle: "bold",
        color: [theme.gray[800].r, theme.gray[800].g, theme.gray[800].b],
      });

      // Potential saving
      const potentialSaving = rec.potentialSaving ?? 0;
      const savingText = `Potential Saving: R${potentialSaving.toLocaleString("en-ZA")}`;
      const savingWidth = pdf.getTextWidth(savingText);
      renderTextSafe(
        pdf,
        savingText,
        margin + contentWidth - 15 - savingWidth,
        yPos + 30,
        {
          fontSize: 10,
          fontStyle: "bold",
          color: [theme.success.r, theme.success.g, theme.success.b],
        },
      );

      // Description
      renderTextSafe(pdf, rec.description, margin + 15, yPos + 45, {
        fontSize: 9,
        color: [theme.gray[600].r, theme.gray[600].g, theme.gray[600].b],
      });

      yPos += cardHeight + 12;
    });

    return yPos;
  }

  private static addComplianceSection(
    pdf: jsPDF,
    data: ComprehensiveReportData,
    yPos: number,
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const theme = this.getModernTheme();

    yPos = this.checkPageBreak(pdf, yPos, 100);
    yPos = this.addSectionTitle(
      pdf,
      "Compliance & Regulatory Checks",
      yPos,
      margin,
    );

    const complianceChecks = data.complianceChecks ?? [];
    complianceChecks.forEach((check) => {
      yPos = this.checkPageBreak(pdf, yPos, 40);

      const cardHeight = 35;
      const statusColor =
        check.status === "compliant"
          ? theme.success
          : check.status === "warning"
            ? theme.warning
            : theme.error;

      // Card background
      pdf.setFillColor(
        theme.background.r,
        theme.background.g,
        theme.background.b,
      );
      pdf.roundedRect(margin, yPos, contentWidth, cardHeight, 4, 4, "F");

      // Status indicator
      pdf.setFillColor(statusColor.r, statusColor.g, statusColor.b);
      pdf.circle(margin + 15, yPos + 17, 6, "F");

      // Status checkmark or warning
      const statusIcon =
        check.status === "compliant"
          ? "✓"
          : check.status === "warning"
            ? "!"
            : "✗";
      renderTextSafe(pdf, statusIcon, margin + 12, yPos + 20, {
        fontSize: 10,
        fontStyle: "bold",
        color: [255, 255, 255],
      });

      // Requirement title
      renderTextSafe(pdf, check.requirement, margin + 30, yPos + 15, {
        fontSize: 10,
        fontStyle: "bold",
        color: [theme.gray[800].r, theme.gray[800].g, theme.gray[800].b],
      });

      // Description
      renderTextSafe(pdf, check.description, margin + 30, yPos + 27, {
        fontSize: 8,
        color: [theme.gray[600].r, theme.gray[600].g, theme.gray[600].b],
      });

      yPos += cardHeight + 8;
    });

    return yPos;
  }

  private static addModernFooter(pdf: jsPDF): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const theme = this.getModernTheme();

    // Footer background
    pdf.setFillColor(theme.gray[50].r, theme.gray[50].g, theme.gray[50].b);
    pdf.rect(0, pageHeight - 30, pageWidth, 30, "F");

    // Footer border
    pdf.setDrawColor(theme.gray[200].r, theme.gray[200].g, theme.gray[200].b);
    pdf.setLineWidth(0.5);
    pdf.line(0, pageHeight - 30, pageWidth, pageHeight - 30);

    // Footer text
    renderTextSafe(
      pdf,
      "This report was generated by Taxfy - Professional Tax Calculation Platform",
      25,
      pageHeight - 15,
      {
        fontSize: 9,
        color: [theme.gray[600].r, theme.gray[600].g, theme.gray[600].b],
      },
    );

    // Disclaimer
    renderTextSafe(
      pdf,
      "This is an estimate. Please consult with SARS or a qualified tax professional for official calculations.",
      25,
      pageHeight - 5,
      {
        fontSize: 8,
        color: [theme.gray[500].r, theme.gray[500].g, theme.gray[500].b],
      },
    );

    // Page number (right aligned)
    const pageText = `Page ${pdf.internal.getCurrentPageInfo().pageNumber}`;
    const pageTextWidth = pdf.getTextWidth(pageText);
    renderTextSafe(
      pdf,
      pageText,
      pageWidth - 25 - pageTextWidth,
      pageHeight - 10,
      {
        fontSize: 9,
        color: [theme.gray[500].r, theme.gray[500].g, theme.gray[500].b],
      },
    );
  }

  private static checkPageBreak(
    pdf: jsPDF,
    currentY: number,
    requiredSpace: number = 50,
  ): number {
    const pageHeight = pdf.internal.pageSize.getHeight();
    if (currentY + requiredSpace > pageHeight - 40) {
      pdf.addPage();
      return 30; // Top margin for new page
    }
    return currentY;
  }

  private static addSectionBreak(pdf: jsPDF, yPos: number): number {
    return this.checkPageBreak(pdf, yPos + 25, 50);
  }

  static async generateComprehensiveReport(
    data: ComprehensiveReportData,
  ): Promise<void> {
    try {
      console.log("🚀 Starting enhanced PDF generation...");

      // Initialize PDF with UTF-8 support
      const pdf = initializePDFWithUTF8Support();
      console.log("✅ jsPDF instance created with UTF-8 support");

      // Load logo with timeout
      console.log("📸 Loading logo...");
      const logoPromise = this.loadLogo();
      const timeoutPromise = new Promise<string | null>((resolve) => {
        setTimeout(() => {
          console.warn("⏰ Logo loading timeout, proceeding without logo");
          resolve(null);
        }, 3000);
      });

      const logo = await Promise.race([logoPromise, timeoutPromise]);
      console.log(
        logo ? "✅ Logo loaded successfully" : "ℹ️ Proceeding without logo",
      );

      // Generate PDF content with modern design
      console.log("📄 Adding modern PDF content...");
      let yPosition = this.addModernHeader(pdf, data, logo);

      yPosition = this.addExecutiveSummary(pdf, data, yPosition);
      yPosition = this.addSectionBreak(pdf, yPosition);

      yPosition = this.addDetailedBreakdown(pdf, data, yPosition);
      yPosition = this.addSectionBreak(pdf, yPosition);

      yPosition = this.addAuditTrail(pdf, data, yPosition);
      yPosition = this.addSectionBreak(pdf, yPosition);

      yPosition = this.addRecommendations(pdf, data, yPosition);
      yPosition = this.addSectionBreak(pdf, yPosition);

      yPosition = this.addComplianceSection(pdf, data, yPosition);

      this.addModernFooter(pdf);
      console.log("✅ Modern PDF content added successfully");

      // Save the PDF
      const fileName = `Taxfy_Professional_Tax_Report_${data.processingDate.replace(/\//g, "-")}.pdf`;
      console.log(`💾 Saving PDF as: ${fileName}`);

      pdf.save(fileName);
      console.log("🎉 Enhanced PDF generated and downloaded successfully!");
    } catch (error) {
      console.error("❌ PDF generation failed:", error);
      throw new Error(
        `PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
