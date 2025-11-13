// Paystack SERVER-SIDE Integration for Taxfy
// SECURITY: Handles secret keys securely on server only
// Official Docs: https://paystack.com/docs/

import crypto from "crypto";

export interface PaystackConfig {
  publicKey: string;
  secretKey: string;
  environment: "test" | "live";
  webhookSecret?: string;
  currency: "ZAR" | "USD" | "GHS" | "NGN";
}

export interface PaystackInitializeData {
  email: string;
  amount: number; // Amount in ZAR (will be converted to kobo)
  currency?: string;
  reference?: string;
  channels?: string[];
  metadata?: Record<string, any>;
  callback_url?: string;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number; // Amount in kobo
    currency: string;
    channel: string;
    paid_at: string;
    customer: {
      email: string;
      customer_code: string;
    };
    authorization: {
      authorization_code: string;
      card_type: string;
      last4: string;
      bank: string;
    };
  };
}

export class PaystackServer {
  private config: PaystackConfig;
  private baseUrl = "https://api.paystack.co";

  constructor(config: PaystackConfig) {
    this.config = config;

    // Validate configuration
    if (!config.secretKey || !config.secretKey.startsWith("sk_")) {
      throw new Error("Invalid Paystack secret key. Must start with 'sk_'");
    }
  }

  /**
   * Initialize a transaction (SERVER ONLY)
   * Returns authorization URL for redirect
   */
  async initializeTransaction(
    data: PaystackInitializeData
  ): Promise<PaystackInitializeResponse> {
    try {
      // Generate unique reference if not provided
      const reference = data.reference || this.generateReference();

      // Convert ZAR to kobo (multiply by 100)
      const amountInKobo = Math.round(data.amount * 100);

      const payload = {
        email: data.email,
        amount: amountInKobo,
        currency: data.currency || this.config.currency,
        reference,
        channels: data.channels || ["card", "bank", "qr", "eft"],
        metadata: {
          ...data.metadata,
          custom_fields: [
            {
              display_name: "Payment For",
              variable_name: "payment_for",
              value: data.metadata?.description || "Tax Calculator Subscription",
            },
          ],
        },
        callback_url: data.callback_url,
      };

      console.log("🔄 Initializing Paystack transaction:", {
        reference,
        amount: data.amount,
        amountInKobo,
        currency: this.config.currency,
      });

      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        console.error("❌ Paystack initialization failed:", result);
        throw new Error(result.message || "Failed to initialize transaction");
      }

      console.log("✅ Paystack transaction initialized:", result.data.reference);

      return result;
    } catch (error) {
      console.error("❌ Paystack error:", error);
      throw error;
    }
  }

  /**
   * Verify a transaction (SERVER ONLY)
   * CRITICAL: Always verify on server before fulfilling order
   */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    try {
      console.log("🔍 Verifying Paystack transaction:", reference);

      const response = await fetch(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.status) {
        console.error("❌ Paystack verification failed:", result);
        throw new Error(result.message || "Failed to verify transaction");
      }

      // Convert amount from kobo to ZAR for logging
      const amountInZAR = result.data.amount / 100;

      console.log("✅ Transaction verified:", {
        reference: result.data.reference,
        status: result.data.status,
        amount: amountInZAR,
        currency: result.data.currency,
      });

      return result;
    } catch (error) {
      console.error("❌ Verification error:", error);
      throw error;
    }
  }

  /**
   * Verify webhook signature (SERVER ONLY)
   * CRITICAL: Always verify webhooks to prevent fraud
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      console.error("❌ No webhook secret configured");
      return false;
    }

    try {
      // Paystack uses HMAC SHA512
      const hash = crypto
        .createHmac("sha512", this.config.webhookSecret)
        .update(payload)
        .digest("hex");

      const isValid = hash === signature;

      if (isValid) {
        console.log("✅ Webhook signature verified");
      } else {
        console.error("❌ Invalid webhook signature");
      }

      return isValid;
    } catch (error) {
      console.error("❌ Webhook verification failed:", error);
      return false;
    }
  }

  /**
   * Generate unique transaction reference
   */
  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `TAXFY_${timestamp}_${random}`;
  }

  /**
   * Convert amount from ZAR to kobo
   */
  static toKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convert amount from kobo to ZAR
   */
  static fromKobo(amount: number): number {
    return amount / 100;
  }
}

/**
 * Pricing constants for South African market
 */
export const PAYSTACK_PRICING = {
  LOCAL_CARD_FEE: 0.029, // 2.9%
  INTERNATIONAL_CARD_FEE: 0.039, // 3.9%
  SETTLEMENT_DAYS: 2, // Working days
};
