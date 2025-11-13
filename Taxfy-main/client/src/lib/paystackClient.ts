// Paystack CLIENT-SIDE Integration for Taxfy
// SECURITY: Only uses PUBLIC KEY - no secret keys exposed to browser
// Official Docs: https://paystack.com/docs/

export interface PaystackPopupPaymentData {
  email: string;
  amount: number; // Amount in ZAR (will be converted to kobo)
  currency?: string;
  reference?: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

/**
 * Paystack Popup Integration (Client-Side ONLY)
 * Uses PUBLIC KEY only - safe for browser
 */
export class PaystackPopup {
  private publicKey: string;
  private currency: string;

  constructor(publicKey: string, currency: string = "ZAR") {
    this.publicKey = publicKey;
    this.currency = currency;

    if (!publicKey.startsWith("pk_")) {
      console.warn("⚠️  Paystack public key should start with 'pk_'");
    }
  }

  /**
   * Open Paystack inline popup
   * Requires Paystack inline JS: https://js.paystack.co/v1/inline.js
   * SECURITY: Only uses public key, safe for client-side
   */
  async openPayment(data: PaystackPopupPaymentData): Promise<void> {
    try {
      // Check if Paystack script is loaded
      if (!(window as any).PaystackPop) {
        throw new Error(
          "Paystack payment library not loaded. Call loadPaystackScript() first."
        );
      }

      const reference = data.reference || this.generateReference();
      const amountInKobo = Math.round(data.amount * 100);

      const handler = (window as any).PaystackPop.setup({
        key: this.publicKey, // PUBLIC KEY ONLY - safe for browser
        email: data.email,
        amount: amountInKobo,
        currency: data.currency || this.currency,
        ref: reference,
        metadata: data.metadata,
        callback: (response: any) => {
          console.log("✅ Paystack payment successful:", response.reference);
          data.onSuccess(response.reference);
        },
        onClose: () => {
          console.log("⚠️  Payment popup closed");
          if (data.onCancel) {
            data.onCancel();
          }
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("❌ Paystack popup error:", error);
      throw error;
    }
  }

  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `TAXFY_${timestamp}_${random}`;
  }
}

/**
 * Load Paystack inline script
 * Call this once in your app initialization
 */
export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Paystack script loaded");
      resolve();
    };
    script.onerror = () => {
      console.error("❌ Failed to load Paystack script");
      reject(new Error("Failed to load Paystack payment library"));
    };

    document.body.appendChild(script);
  });
}

/**
 * Helper: Format amount for display
 */
export function formatZAR(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

/**
 * Convert ZAR to kobo (for display purposes only)
 * Server handles actual conversion
 */
export function toKobo(amount: number): number {
  return Math.round(amount * 100);
}
