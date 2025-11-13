import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  initializePDFWithUTF8Support,
  renderTextSafe,
  renderSectionHeader,
} from "../lib/fontUtils";

interface ReportData {
  documentName: string;
  processingDate: string;
  processingTime: string;
  grossRemuneration: number;
  payeWithheld: number;
  uifContrib: number;
  retirementFund: number;
  medicalScheme: number;
  travelAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  primaryRebate: number;
  totalTaxDue: number;
  refundOrOwing: number;
  isRefund: boolean;
  absoluteAmount: number;
}

interface BrandingSettings {
  companyName?: string;
  companyLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headerText?: string;
  footerText?: string;
  showTaxfyBranding?: boolean;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
  };
}

interface UserProfile {
  subscription_plan: string;
  firm_name?: string;
  email?: string;
}

export class EnhancedPDFGenerator {
  private static async loadImage(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  private static async getAppLogo(): Promise<string> {
    try {
      return await this.loadImage(
        "https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800",
      );
    } catch (error) {
      console.warn("Could not load app logo, trying fallback:", error);
      try {
        return await this.loadImage("/assets/logo-ta.png");
      } catch (fallbackError) {
        console.warn("Could not load fallback logo:", fallbackError);
        return "";
      }
    }
  }

  private static async getCompanyLogo(logoUrl?: string): Promise<string> {
    if (!logoUrl) return "";
    try {
      return await this.loadImage(logoUrl);
    } catch (error) {
      console.warn("Could not load company logo:", error);
      return "";
    }
  }

  private static isWhiteLabel(
    profile?: UserProfile,
    branding?: BrandingSettings,
  ): boolean {
    return (
      (profile?.subscription_plan === "pro" ||
        profile?.subscription_plan === "business") &&
      branding?.showTaxfyBranding === false
    );
  }

  public static async generateEnhancedPDF(
    data: ReportData,
    profile?: UserProfile,
    branding?: BrandingSettings,
  ): Promise<void> {
    try {
      const pdf = initializePDFWithUTF8Support();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // Load logos with better error handling
      let appLogo = "";
      let companyLogo = "";

      try {
        appLogo = await this.getAppLogo();
      } catch (error) {
        console.warn("Could not load app logo, continuing without it:", error);
      }

      try {
        companyLogo = await this.getCompanyLogo(branding?.companyLogo);
      } catch (error) {
        console.warn(
          "Could not load company logo, continuing without it:",
          error,
        );
      }

      const isWhiteLabelMode = this.isWhiteLabel(profile, branding);

      // Colors with fallbacks
      const primaryColor = branding?.primaryColor || "#2563eb";
      const secondaryColor = branding?.secondaryColor || "#64748b";
      const accentColor = branding?.accentColor || "#10b981";

      // Helper function to convert hex to RGB with error handling
      const hexToRgb = (hex: string) => {
        try {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
              }
            : { r: 37, g: 99, b: 235 };
        } catch (error) {
          console.warn("Invalid color format, using default:", hex);
          return { r: 37, g: 99, b: 235 };
        }
      };

      const primaryRgb = hexToRgb(primaryColor);
      const accentRgb = hexToRgb(accentColor);

      let yPosition = margin;

      // Header Section with UTF-8 support
      try {
        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.rect(0, 0, pageWidth, 40, "F");

        // Logo and Company Info
        if (isWhiteLabelMode && companyLogo) {
          // White-label mode: Use company logo
          try {
            pdf.addImage(companyLogo, "PNG", margin, 8, 24, 24);
          } catch (error) {
            console.warn("Error adding company logo:", error);
          }

          renderTextSafe(
            pdf,
            branding?.companyName || profile?.firm_name || "Tax Report",
            margin + 30,
            20,
            {
              fontSize: 20,
              fontStyle: "bold",
              color: [255, 255, 255],
            },
          );

          renderTextSafe(
            pdf,
            branding?.headerText || "Professional Tax Report",
            margin + 30,
            28,
            {
              fontSize: 12,
              color: [255, 255, 255],
            },
          );
        } else {
          // Standard mode: Use Taxfy logo
          if (appLogo) {
            try {
              pdf.addImage(appLogo, "PNG", margin, 8, 24, 24);
            } catch (error) {
              console.warn("Error adding app logo:", error);
            }
          }

          renderTextSafe(pdf, "COMPREHENSIVE TAX REPORT", margin + 30, 20, {
            fontSize: 20,
            fontStyle: "bold",
            color: [255, 255, 255],
          });

          renderTextSafe(
            pdf,
            "Professional Tax Calculation & Analysis Report",
            margin + 30,
            28,
            {
              fontSize: 12,
              color: [255, 255, 255],
            },
          );
        }

        // Date and time with UTF-8 support
        const dateText = `Generated: ${data.processingDate} ${data.processingTime}`;
        const docText = `Document: ${data.documentName || "undefined"}`;

        const dateWidth = pdf.getTextWidth(dateText);
        const docWidth = pdf.getTextWidth(docText);

        renderTextSafe(pdf, dateText, pageWidth - margin - dateWidth, 20, {
          fontSize: 10,
          color: [255, 255, 255],
        });
        renderTextSafe(pdf, docText, pageWidth - margin - docWidth, 28, {
          fontSize: 10,
          color: [255, 255, 255],
        });
      } catch (error) {
        console.error("Error creating PDF header:", error);
        // Continue with basic header
        renderTextSafe(pdf, "TAX REPORT", margin, 30, {
          fontSize: 18,
          fontStyle: "bold",
          color: [0, 0, 0],
        });
      }

      yPosition = 55;

      // Result Box with better formatting
      try {
        const resultColor = data.isRefund
          ? accentRgb
          : { r: 220, g: 38, b: 38 };
        pdf.setFillColor(resultColor.r, resultColor.g, resultColor.b, 0.1);
        pdf.setDrawColor(resultColor.r, resultColor.g, resultColor.b);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, yPosition, contentWidth, 30, 5, 5, "FD");

        pdf.setTextColor(resultColor.r, resultColor.g, resultColor.b);
        pdf.setFontSize(24);
        pdf.setFont("helvetica", "bold");

        // Ensure amount is properly formatted
        const amount = data.absoluteAmount || 0;
        const amountText = `R${amount.toLocaleString("en-ZA")}`;
        const amountWidth = pdf.getTextWidth(amountText);
        pdf.text(amountText, (pageWidth - amountWidth) / 2, yPosition + 15);

        pdf.setFontSize(14);
        const statusText = data.isRefund ? "REFUND DUE" : "AMOUNT OWED";
        const statusWidth = pdf.getTextWidth(statusText);
        pdf.text(statusText, (pageWidth - statusWidth) / 2, yPosition + 25);
      } catch (error) {
        console.error("Error creating result box:", error);
        // Fallback to simple text
        pdf.setFontSize(16);
        pdf.text(
          `Result: R${(data.absoluteAmount || 0).toLocaleString("en-ZA")}`,
          margin,
          yPosition + 15,
        );
      }

      yPosition += 45;

      // Income Information Section with better error handling
      try {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("📊 Income Information", margin, yPosition);
        yPosition += 10;

        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        const incomeData = [
          [
            "Gross Remuneration",
            `R${(data.grossRemuneration || 0).toLocaleString("en-ZA")}`,
          ],
          [
            "Retirement Fund Contributions",
            `R${(data.retirementFund || 0).toLocaleString("en-ZA")}`,
          ],
          [
            "UIF Contributions",
            `R${(data.uifContrib || 0).toLocaleString("en-ZA")}`,
          ],
          [
            "Medical Scheme Contributions",
            `R${(data.medicalScheme || 0).toLocaleString("en-ZA")}`,
          ],
          [
            "Travel Allowance",
            `R${(data.travelAllowance || 0).toLocaleString("en-ZA")}`,
          ],
        ];

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");

        incomeData.forEach(([label, value], index) => {
          try {
            const bgColor = index % 2 === 0 ? 248 : 255;
            pdf.setFillColor(bgColor, bgColor, bgColor);
            pdf.rect(margin, yPosition - 2, contentWidth, 8, "F");

            pdf.setTextColor(0, 0, 0);
            pdf.text(label, margin + 2, yPosition + 3);

            pdf.setFont("helvetica", "bold");
            const valueWidth = pdf.getTextWidth(value);
            pdf.text(value, pageWidth - margin - valueWidth - 2, yPosition + 3);
            pdf.setFont("helvetica", "normal");

            yPosition += 8;
          } catch (error) {
            console.warn(`Error rendering income data row ${index}:`, error);
            yPosition += 8; // Continue with next row
          }
        });
      } catch (error) {
        console.error("Error creating income section:", error);
        yPosition += 50; // Skip section
      }

      yPosition += 10;

      // Tax Calculations Section with better error handling
      try {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("🧮 Tax Calculations", margin, yPosition);
        yPosition += 10;

        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        const taxData = [
          [
            "Taxable Income",
            `R${(data.taxableIncome || 0).toLocaleString("en-ZA")}`,
          ],
          ["Income Tax", `R${(data.incomeTax || 0).toLocaleString("en-ZA")}`],
          [
            "Primary Rebate",
            `-R${(data.primaryRebate || 0).toLocaleString("en-ZA")}`,
          ],
          [
            "Total Tax Due",
            `R${(data.totalTaxDue || 0).toLocaleString("en-ZA")}`,
          ],
          [
            "PAYE Withheld",
            `R${(data.payeWithheld || 0).toLocaleString("en-ZA")}`,
          ],
        ];

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");

        taxData.forEach(([label, value], index) => {
          try {
            const bgColor = index % 2 === 0 ? 248 : 255;
            pdf.setFillColor(bgColor, bgColor, bgColor);
            pdf.rect(margin, yPosition - 2, contentWidth, 8, "F");

            pdf.setTextColor(0, 0, 0);
            pdf.text(label, margin + 2, yPosition + 3);

            pdf.setFont("helvetica", "bold");
            const valueWidth = pdf.getTextWidth(value);
            pdf.text(value, pageWidth - margin - valueWidth - 2, yPosition + 3);
            pdf.setFont("helvetica", "normal");

            yPosition += 8;
          } catch (error) {
            console.warn(`Error rendering tax data row ${index}:`, error);
            yPosition += 8; // Continue with next row
          }
        });

        // Final Result
        yPosition += 5;
        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b, 0.1);
        pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.rect(margin, yPosition - 2, contentWidth, 10, "FD");

        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        const finalResult = `Final Result: ${data.isRefund ? "REFUND" : "OWING"} R${(data.absoluteAmount || 0).toLocaleString("en-ZA")}`;
        pdf.text(finalResult, margin + 2, yPosition + 5);
      } catch (error) {
        console.error("Error creating tax calculations section:", error);
      }

      // Footer with better error handling
      try {
        yPosition = pageHeight - 40;

        // Contact Information (for white-label)
        if (isWhiteLabelMode && branding?.contactInfo) {
          pdf.setTextColor(100, 100, 100);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");

          const contactInfo = branding.contactInfo;
          let contactY = yPosition;

          if (contactInfo.email) {
            pdf.text(`Email: ${contactInfo.email}`, margin, contactY);
            contactY += 4;
          }
          if (contactInfo.phone) {
            pdf.text(`Phone: ${contactInfo.phone}`, margin, contactY);
            contactY += 4;
          }
          if (contactInfo.website) {
            pdf.text(`Web: ${contactInfo.website}`, margin, contactY);
            contactY += 4;
          }
          if (contactInfo.address) {
            const addressLines = contactInfo.address.split("\n");
            addressLines.forEach((line) => {
              pdf.text(line, margin, contactY);
              contactY += 4;
            });
          }
        }

        // Footer text and branding
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");

        if (isWhiteLabelMode) {
          const footerText =
            branding?.footerText || "Prepared by certified tax professionals";
          pdf.text(footerText, margin, pageHeight - 18);

          if (branding?.showTaxfyBranding !== false) {
            pdf.text(
              "Powered by Taxfy",
              pageWidth - margin - 40,
              pageHeight - 18,
            );
          }
        } else {
          pdf.text(
            "This report was generated by Taxfy - Your trusted tax refund calculator",
            margin,
            pageHeight - 18,
          );
        }

        pdf.setFontSize(8);
        pdf.text(
          "⚠️ This is an estimate. Please consult with SARS or a tax professional for official calculations.",
          margin,
          pageHeight - 12,
        );

        // Page number
        pdf.text("Page 1 of 1", pageWidth - margin - 20, pageHeight - 8);
      } catch (error) {
        console.error("Error creating footer:", error);
      }

      // Save the PDF with better error handling
      try {
        const fileName =
          isWhiteLabelMode && branding?.companyName
            ? `${branding.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_Tax_Report_${data.processingDate.replace(/\//g, "-")}.pdf`
            : `Taxfy_Tax_Report_${data.processingDate.replace(/\//g, "-")}.pdf`;

        pdf.save(fileName);
        console.log("✅ PDF generated successfully:", fileName);
      } catch (error) {
        console.error("Error saving PDF:", error);
        // Try with a simple filename
        pdf.save("Tax_Report.pdf");
      }
    } catch (error) {
      console.error("❌ PDF generation failed completely:", error);
      throw new Error(
        `PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  public static async generateBasicPDF(data: ReportData): Promise<void> {
    // Fallback for users without enhanced features
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;

    let yPosition = margin;

    // Simple header
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Tax Report", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.text(
      `Generated: ${data.processingDate} ${data.processingTime}`,
      margin,
      yPosition,
    );
    yPosition += 15;

    // Result
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    const resultText = `${data.isRefund ? "REFUND DUE" : "AMOUNT OWED"}: R${data.absoluteAmount.toLocaleString()}`;
    pdf.text(resultText, margin, yPosition);
    yPosition += 20;

    // Basic data
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    const basicData = [
      `Gross Income: R${data.grossRemuneration.toLocaleString()}`,
      `Tax Due: R${data.totalTaxDue.toLocaleString()}`,
      `PAYE Withheld: R${data.payeWithheld.toLocaleString()}`,
      `Final Result: R${data.absoluteAmount.toLocaleString()}`,
    ];

    basicData.forEach((line) => {
      pdf.text(line, margin, yPosition);
      yPosition += 8;
    });

    pdf.save(`Basic_Tax_Report_${data.processingDate.replace(/\//g, "-")}.pdf`);
  }
}
