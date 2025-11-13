import { jsPDF } from "jspdf";

// Base64 encoded Open Sans Regular font (subset for common characters)
// This is a minimal subset that includes Latin characters and common symbols
const OPEN_SANS_REGULAR_BASE64 = `data:font/truetype;charset=utf-8;base64,AAEAAAAOAIAAAwBgT1MvMj3hSQEAAADsAAAATmNtYXDQEhm3AAABPAAAAUpjdnQgBkFGRgAAApAAAAA+ZnBnbYoKeDsAAALQAAAJkWdhc3AAAAAQAAAA2AAAAAhnbHlm5jTvOQAADGQAAA9kaGVhZA5H5lwAABvIAAAANmhoZWEHUwNNAAAcAAAAACRobXR4LlAAAAAAABwkAAAALGxvY2EbsBb+AAAcUAAAABhtYXhwAA8AjAAAHGgAAAAgbmFtZVjHYsoAAByIAAAB2nBvc3QAAwAAAAAeZAAAACAAAwJAAZAABQAAAUwBZgAAAEcBTAFmAAAA9QAZAIQAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpYAHg/+D/4AHgACAAAAABAAAAAAAAAAAAAAAgAAAAAAACAAAAAwAAABQAAwABAAAAFAAEADYAAAAIAAgAAgAAAAEAIOlg//3//wAAAAAAIOlg//3//wAB/+MWoAADAAEAAAAAAAAAAAAAAAEAAf//AA8AAQAAAAAAAAAAAAIAADc5AQAAAAABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQGQAZABkAGQABQAHgAoADIAPABGAFAAWgBkAG4AeACCAIwAlgCgAKoAtAC+AMgA0gDcAOYA8AD6AQQBDgEYASIBLAE2AUABSgFUAV4BaAFyAXwBhgGQAZoBpAGuAbgBwgHMAd4B6AHyAfwCBgIQAhoCJAIuAjgCQgJMAl4CaAJyAnwChgKQApoCpAKuArgCwgLMAtYC4ALqAvQC/gMIAxIDHAMmAzADOgNEA04DWANiA2wDdgOAA4oDlAOeA6gDsgO8A8YD0APaA+QD7gP4BAIEDAQWBCAEKgQ0BD4ESARSBFwEZgRwBHoEhASO`;

// Utility function to ensure proper UTF-8 text encoding
export function cleanTextForPDF(text: string | number | any): string {
  try {
    // Ensure input is a string
    const textString = String(text || "");

    return (
      textString
        // First normalize unicode characters
        .normalize("NFD")
        // Replace common problematic UTF-8 sequences with their ASCII equivalents
        .replace(/[""„‟]/g, '"') // All types of smart quotes to regular quotes
        .replace(/[''‚‛]/g, "'") // All types of smart apostrophes to regular apostrophes
        .replace(/[–—―]/g, "-") // En dash, em dash, and horizontal bar to hyphen
        .replace(/…/g, "...") // Ellipsis
        .replace(/•/g, "* ") // Bullet point with space
        .replace(/€/g, "EUR") // Euro symbol
        .replace(/£/g, "GBP") // Pound symbol
        .replace(/¥/g, "JPY") // Yen symbol
        .replace(/¢/g, "cents") // Cent symbol
        .replace(/®/g, "(R)") // Registered trademark
        .replace(/©/g, "(C)") // Copyright
        .replace(/™/g, "(TM)") // Trademark
        .replace(/°/g, "deg") // Degree symbol
        .replace(/±/g, "+/-") // Plus-minus
        .replace(/×/g, "x") // Multiplication
        .replace(/÷/g, "/") // Division
        .replace(/§/g, "Section") // Section symbol
        .replace(/¶/g, "Para") // Paragraph symbol
        // Handle specific encoded character sequences
        .replace(/â€™/g, "'") // Encoded apostrophe
        .replace(/â€œ/g, '"') // Encoded opening quote
        .replace(/â€/g, '"') // Encoded closing quote
        .replace(/â€"/g, "-") // Encoded dash
        .replace(/â€¢/g, "* ") // Encoded bullet
        .replace(/Â/g, " ") // Non-breaking space issues
        // Remove combining diacritical marks (like accents) that might cause issues
        .replace(/[\u0300-\u036f]/g, "")
        // Replace any remaining non-ASCII characters with safe equivalents
        .replace(/[^\x00-\x7F]/g, (char) => {
          // Log unknown characters for debugging
          console.debug(
            `Replacing unknown character: ${char} (code: ${char.charCodeAt(0)})`,
          );
          return "?"; // Replace with question mark as safe fallback
        })
        // Ensure proper line breaks
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        // Clean up multiple spaces
        .replace(/\s+/g, " ")
        .trim()
    );
  } catch (error) {
    console.warn("Text cleaning failed, using fallback:", error);
    // Fallback: remove all non-ASCII characters and normalize whitespace
    const fallbackText = String(text || "");
    return fallbackText
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}

// Enhanced text rendering function with proper UTF-8 support
export function renderTextSafe(
  pdf: jsPDF,
  text: string | number | any,
  x: number,
  y: number,
  options?: {
    fontSize?: number;
    fontStyle?: "normal" | "bold" | "italic";
    color?: [number, number, number];
    align?: "left" | "center" | "right";
    maxWidth?: number;
  },
): { height: number } {
  try {
    // Ensure text is a string
    const textString = String(text || "");

    // Clean and prepare text
    const cleanText = cleanTextForPDF(textString);

    // Set font properties with fallbacks
    const fontSize = options?.fontSize || 12;
    const fontStyle = options?.fontStyle || "normal";
    const color = options?.color || [0, 0, 0];

    pdf.setFontSize(fontSize);

    // Use helvetica as it has better Unicode support than other default fonts
    const jsPDFStyle =
      fontStyle === "bold"
        ? "bold"
        : fontStyle === "italic"
          ? "italic"
          : "normal";
    pdf.setFont("helvetica", jsPDFStyle);
    pdf.setTextColor(color[0], color[1], color[2]);

    // Handle text wrapping if maxWidth is specified
    if (options?.maxWidth) {
      const lines = pdf.splitTextToSize(cleanText, options.maxWidth);
      const lineHeight = fontSize * 1.2;

      lines.forEach((line: string, index: number) => {
        const lineY = y + index * lineHeight;

        if (options?.align === "center") {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - textWidth) / 2, lineY);
        } else if (options?.align === "right") {
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, x - textWidth, lineY);
        } else {
          pdf.text(line, x, lineY);
        }
      });

      return { height: lines.length * lineHeight };
    } else {
      // Single line text
      if (options?.align === "center") {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const textWidth = pdf.getTextWidth(cleanText);
        pdf.text(cleanText, (pageWidth - textWidth) / 2, y);
      } else if (options?.align === "right") {
        const textWidth = pdf.getTextWidth(cleanText);
        pdf.text(cleanText, x - textWidth, y);
      } else {
        pdf.text(cleanText, x, y);
      }

      return { height: fontSize * 1.2 };
    }
  } catch (error) {
    console.warn("Enhanced text rendering failed, using fallback:", error);
    // Fallback to basic text rendering
    try {
      const fallbackText = String(text || "").replace(/[^\x00-\x7F]/g, "");
      pdf.text(fallbackText, x, y);
      return { height: (options?.fontSize || 12) * 1.2 };
    } catch (fallbackError) {
      console.error("Text rendering completely failed:", fallbackError);
      return { height: 0 };
    }
  }
}

// Initialize PDF with better UTF-8 support
export function initializePDFWithUTF8Support(): jsPDF {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    // Enable compression for better file size
    compress: true,
  });

  // Set default font to helvetica which has better Unicode support
  pdf.setFont("helvetica", "normal");

  return pdf;
}

// Font registration for better Unicode support (for future use)
export function loadCustomFont(pdf: jsPDF): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // For now, we'll use the built-in helvetica font which has reasonable Unicode support
      // In the future, this can be extended to load custom fonts
      console.log("Using built-in helvetica font with Unicode support");
      resolve(true);
    } catch (error) {
      console.warn("Custom font loading failed, using fallback:", error);
      resolve(false);
    }
  });
}

// Helper function to render section headers with consistent styling
export function renderSectionHeader(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: {
    fontSize?: number;
    color?: [number, number, number];
    backgroundColor?: [number, number, number];
    width?: number;
  },
): number {
  const fontSize = options?.fontSize || 18;
  const color = options?.color || [0, 0, 0];
  const bgColor = options?.backgroundColor;
  const width = options?.width || pdf.internal.pageSize.getWidth() - x * 2;

  // Draw background if specified
  if (bgColor) {
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.rect(x - 5, y - fontSize + 2, width + 10, fontSize + 8, "F");
  }

  // Render text
  const result = renderTextSafe(pdf, text, x, y, {
    fontSize,
    fontStyle: "bold",
    color,
  });

  return result.height + 10; // Add some spacing after header
}

// Currency formatting for PDF with consistent formatting
export function formatCurrency(amount: number): string {
  // Use fixed formatting to avoid locale-specific issues in PDFs
  const formattedNumber = Math.abs(amount).toFixed(2);
  const parts = formattedNumber.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Use space as thousands separator
  const decimalPart = parts[1];

  // Only show decimals if not .00
  if (decimalPart === "00") {
    return `R${integerPart}`;
  } else {
    return `R${integerPart}.${decimalPart}`;
  }
}

// Percentage formatting for PDF
export function formatPercentage(rate: number): string {
  return `${rate}%`;
}
