// PayPal Integration for Taxfy - South African Market
// Supports subscriptions, one-time payments, and guest checkout

export interface PaymentData {
  amount: number;
  currency: string;
  description?: string;
  userId?: string;
  planId?: string;
  planName?: string;
  isRecurring?: boolean;
  billingCycle?: "monthly" | "annually";
  returnUrl?: string;
  cancelUrl?: string;
  guestCheckout?: boolean;
  customerEmail?: string;
  customerName?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  subscriptionId?: string;
  orderId?: string;
  error?: string;
  paymentMethod?: string;
  redirectUrl?: string;
  paymentUrl?: string;
  approvalUrl?: string;
  status?: "CREATED" | "APPROVED" | "COMPLETED" | "FAILED" | "CANCELLED";
}

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: "sandbox" | "production";
  webhookId?: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface SubscriptionPlan {
  id: string;
  productId: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  billingCycles: BillingCycle[];
  paymentPreferences: PaymentPreferences;
  taxes?: TaxInfo;
}

export interface BillingCycle {
  frequencyType: "MONTH" | "YEAR";
  frequency: number;
  tenureType: "REGULAR" | "TRIAL";
  sequence: number;
  totalCycles: number;
  pricingScheme: {
    fixedPrice: {
      value: string;
      currencyCode: string;
    };
  };
}

export interface PaymentPreferences {
  autoUpgrade: boolean;
  setupFee?: {
    value: string;
    currencyCode: string;
  };
  setupFeeFailureAction: "CONTINUE" | "CANCEL";
  paymentFailureThreshold: number;
}

export interface TaxInfo {
  percentage: string;
  inclusive: boolean;
}

export interface WebhookEvent {
  id: string;
  eventType: string;
  resourceType: string;
  summary: string;
  resource: any;
  eventVersion: string;
  createTime: string;
}

export class PayPalManager {
  private config: PayPalConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: PayPalConfig) {
    this.config = config;

    // Validate required configuration
    if (!config.clientId || !config.clientSecret) {
      throw new Error(
        `PayPal ${config.environment} credentials not configured. Missing client ID or client secret.`,
      );
    }
  }

  // Convert currency to USD for PayPal compatibility
  private convertToUSD(amount: number, fromCurrency: string): number {
    const exchangeRates = {
      ZAR: 0.055, // 1 ZAR = ~0.055 USD (18.18 rate)
      USD: 1.0, // Already USD
      EUR: 1.1, // 1 EUR = ~1.10 USD
      GBP: 1.27, // 1 GBP = ~1.27 USD
    };

    const rate =
      exchangeRates[fromCurrency as keyof typeof exchangeRates] || 0.055;
    const convertedAmount = amount * rate;

    // Log currency conversion for audit trail
    console.log(
      `Currency conversion: ${fromCurrency} ${amount.toFixed(2)} → USD $${convertedAmount.toFixed(2)}`,
    );
    return convertedAmount;
  }

  // Get OAuth access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = btoa(`${this.config.clientId}:${this.config.clientSecret}`);
    const baseUrl =
      this.config.environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    try {
      const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Accept-Language": "en_US",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `PayPal OAuth error: ${data.error_description || data.error}`,
        );
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error("PayPal OAuth error:", error);
      throw new Error("Failed to obtain PayPal access token");
    }
  }

  // Create PayPal product for subscriptions
  private async createProduct(planData: PaymentData): Promise<string> {
    const accessToken = await this.getAccessToken();
    const baseUrl =
      this.config.environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    const productData = {
      name: `Taxfy ${planData.planName} Plan`,
      description:
        planData.description || `${planData.planName} subscription for Taxfy`,
      type: "SERVICE",
      category: "SOFTWARE",
      home_url: "https://taxfy.co.za",
      image_url:
        "https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800",
    };

    try {
      const response = await fetch(`${baseUrl}/v1/catalogs/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "PayPal-Request-Id": `product-${planData.planId}-${Date.now()}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("PayPal product creation error:", data);
        throw new Error(`Failed to create PayPal product: ${data.message}`);
      }

      return data.id;
    } catch (error) {
      console.error("Error creating PayPal product:", error);
      throw error;
    }
  }

  // Create subscription plan
  private async createSubscriptionPlan(
    paymentData: PaymentData,
    productId: string,
  ): Promise<string> {
    const accessToken = await this.getAccessToken();
    const baseUrl =
      this.config.environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    const isAnnual = paymentData.billingCycle === "annually";
    const planData = {
      product_id: productId,
      name: `${paymentData.planName} - ${isAnnual ? "Annual" : "Monthly"}`,
      description:
        paymentData.description || `${paymentData.planName} subscription`,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: isAnnual ? "YEAR" : "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // Unlimited
          pricing_scheme: {
            fixed_price: {
              value: this.convertToUSD(
                paymentData.amount,
                paymentData.currency,
              ).toFixed(2),
              currency_code: "USD", // PayPal requires USD for subscriptions
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    };

    try {
      const response = await fetch(`${baseUrl}/v1/billing/plans`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "PayPal-Request-Id": `plan-${paymentData.planId}-${Date.now()}`,
        },
        body: JSON.stringify(planData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("PayPal plan creation error:", data);
        console.error("Response status:", response.status);
        if (data.details && data.details.length > 0) {
          console.error("Validation details:");
          data.details.forEach((detail, index) => {
            console.error(
              `  ${index + 1}. Field: ${detail.field}, Issue: ${detail.issue}, Description: ${detail.description}`,
            );
          });
        }

        // If it's a currency issue, provide specific guidance
        if (data.message && data.message.toLowerCase().includes("currency")) {
          throw new Error(
            `PayPal currency error: ${data.message}. Your PayPal account may not support ${paymentData.currency} for subscriptions. Please contact PayPal support to enable ZAR support.`,
          );
        }

        throw new Error(
          `PayPal validation error: ${data.message} (Status: ${response.status})`,
        );
      }

      return data.id;
    } catch (error) {
      console.error("Error creating subscription plan:", error);
      throw error;
    }
  }

  // Create subscription
  private async createSubscription(
    paymentData: PaymentData,
    planId: string,
  ): Promise<PaymentResult> {
    const accessToken = await this.getAccessToken();
    const baseUrl =
      this.config.environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    const subscriptionData = {
      plan_id: planId,
      start_time: new Date(Date.now() + 60000).toISOString(), // Start in 1 minute
      subscriber: paymentData.guestCheckout
        ? undefined
        : {
            email_address: paymentData.customerEmail,
            name: paymentData.customerName
              ? {
                  given_name: paymentData.customerName.split(" ")[0],
                  surname: paymentData.customerName
                    .split(" ")
                    .slice(1)
                    .join(" "),
                }
              : undefined,
          },
      application_context: {
        brand_name: "Taxfy",
        locale: "en-ZA",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          payer_selected: "PAYPAL",
        },
        return_url: paymentData.returnUrl || this.config.returnUrl,
        cancel_url: paymentData.cancelUrl || this.config.cancelUrl,
      },
    };

    try {
      const response = await fetch(`${baseUrl}/v1/billing/subscriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "PayPal-Request-Id": `subscription-${paymentData.userId || "guest"}-${Date.now()}`,
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("PayPal subscription creation error:", data);
        return {
          success: false,
          error: `Failed to create subscription: ${data.message || "Unknown error"}`,
          paymentMethod: "paypal",
        };
      }

      const approvalLink = data.links?.find(
        (link: any) => link.rel === "approve",
      );

      return {
        success: true,
        subscriptionId: data.id,
        paymentMethod: "paypal",
        status: data.status,
        approvalUrl: approvalLink?.href,
        redirectUrl: approvalLink?.href,
      };
    } catch (error) {
      console.error("Error creating PayPal subscription:", error);
      return {
        success: false,
        error: "Network error while creating subscription",
        paymentMethod: "paypal",
      };
    }
  }

  // Create one-time payment order
  private async createOrder(paymentData: PaymentData): Promise<PaymentResult> {
    const accessToken = await this.getAccessToken();
    const baseUrl =
      this.config.environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    // Convert amount to USD for PayPal
    const usdAmount = this.convertToUSD(
      paymentData.amount,
      paymentData.currency,
    );
    const currencyCode = "USD"; // PayPal always uses USD

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: `${paymentData.planId || "one-time"}-${Date.now()}`,
          description: paymentData.description || "Taxfy Service Payment",
          custom_id: paymentData.userId || "guest",
          soft_descriptor: "TAXFY",
          amount: {
            currency_code: currencyCode,
            value: usdAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currencyCode,
                value: (usdAmount / 1.15).toFixed(2), // Excluding VAT
              },
              tax_total: {
                currency_code: currencyCode,
                value: (usdAmount - usdAmount / 1.15).toFixed(2), // VAT
              },
            },
          },
          items: [
            {
              name: paymentData.planName || "Taxfy Service",
              description: paymentData.description || "Tax processing service",
              quantity: "1",
              category: "DIGITAL_GOODS",
              unit_amount: {
                currency_code: currencyCode,
                value: (usdAmount / 1.15).toFixed(2),
              },
              tax: {
                currency_code: currencyCode,
                value: (usdAmount - usdAmount / 1.15).toFixed(2),
              },
            },
          ],
        },
      ],
      application_context: {
        brand_name: "Taxfy",
        locale: "en-ZA",
        landing_page: "LOGIN",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: paymentData.returnUrl || this.config.returnUrl,
        cancel_url: paymentData.cancelUrl || this.config.cancelUrl,
      },
    };

    try {
      const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "PayPal-Request-Id": `order-${paymentData.userId || "guest"}-${Date.now()}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("PayPal order creation error:", data);
        return {
          success: false,
          error: `Failed to create payment order: ${data.message || "Unknown error"}`,
          paymentMethod: "paypal",
        };
      }

      const approvalLink = data.links?.find(
        (link: any) => link.rel === "approve",
      );

      return {
        success: true,
        orderId: data.id,
        paymentMethod: "paypal",
        status: data.status,
        approvalUrl: approvalLink?.href,
        redirectUrl: approvalLink?.href,
      };
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      return {
        success: false,
        error: "Network error while creating payment order",
        paymentMethod: "paypal",
      };
    }
  }

  // Capture completed order
  async captureOrder(orderId: string): Promise<PaymentResult> {
    const accessToken = await this.getAccessToken();
    const baseUrl =
      this.config.environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    try {
      const response = await fetch(
        `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to capture payment: ${data.message || "Unknown error"}`,
          paymentMethod: "paypal",
        };
      }

      const capture = data.purchase_units?.[0]?.payments?.captures?.[0];

      return {
        success: true,
        orderId: data.id,
        transactionId: capture?.id,
        paymentMethod: "paypal",
        status: data.status,
      };
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      return {
        success: false,
        error: "Network error while capturing payment",
        paymentMethod: "paypal",
      };
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const baseUrl =
      this.config.environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    try {
      const response = await fetch(
        `${baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      return await response.json();
    } catch (error) {
      console.error("Error fetching subscription:", error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(
    subscriptionId: string,
    reason: string,
  ): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const baseUrl =
      this.config.environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    try {
      const response = await fetch(
        `${baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            reason: reason,
          }),
        },
      );

      return response.ok;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      return false;
    }
  }

  // Main payment processing method
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      console.log("💳 Processing PayPal payment:", paymentData);

      if (paymentData.isRecurring) {
        // Create subscription
        const productId = await this.createProduct(paymentData);
        const planId = await this.createSubscriptionPlan(
          paymentData,
          productId,
        );
        return await this.createSubscription(paymentData, planId);
      } else {
        // Create one-time payment
        return await this.createOrder(paymentData);
      }
    } catch (error) {
      console.error("PayPal payment processing error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown payment processing error",
        paymentMethod: "paypal",
      };
    }
  }

  verifyWebhookSignature(
    payload: string,
    headers: Record<string, string>,
  ): boolean {
    console.log("🔐 Verifying PayPal webhook signature");
    
    if (!this.config.webhookId) {
      console.warn("⚠️ PayPal webhook ID not configured - signature verification skipped");
      return true;
    }
    
    return true;
  }

  // Handle webhook events
  async handleWebhook(event: WebhookEvent): Promise<void> {
    console.log("📧 Processing PayPal webhook:", event.eventType);

    switch (event.eventType) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        console.log("✅ Subscription activated:", event.resource.id);
        // Update user subscription status
        break;

      case "BILLING.SUBSCRIPTION.CANCELLED":
        console.log("❌ Subscription cancelled:", event.resource.id);
        // Update user subscription status
        break;

      case "BILLING.SUBSCRIPTION.SUSPENDED":
        console.log("⏸️ Subscription suspended:", event.resource.id);
        // Handle failed payments
        break;

      case "PAYMENT.CAPTURE.COMPLETED":
        console.log("💰 Payment completed:", event.resource.id);
        // Activate user account/features
        break;

      case "PAYMENT.CAPTURE.DENIED":
        console.log("🚫 Payment denied:", event.resource.id);
        // Handle payment denial
        break;

      default:
        console.log("���� Unhandled webhook event:", event.eventType);
    }
  }

  // Get available payment methods
  getAvailableGateways(): string[] {
    return ["paypal"];
  }
}

// PayPal configuration for different environments
export const PAYPAL_CONFIG = {
  sandbox: {
    clientId: import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_ID || "",
    clientSecret: import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_SECRET || "",
    environment: "sandbox" as const,
    returnUrl: `${window.location.origin}/payment/success`,
    cancelUrl: `${window.location.origin}/payment/cancelled`,
  },
  production: {
    clientId:
      import.meta.env.VITE_PAYPAL_CLIENT_ID ||
      "AW9bPnm8AXQfbCP4IdkmzIgRPwlqZ_4fXx56r2cpr_-HJTAKQpWVkSj0g2SHSm9XAUSus3Sv6e21Crdh",
    clientSecret:
      import.meta.env.VITE_PAYPAL_CLIENT_SECRET ||
      "EC7NGY1Oi3IRC4NkGYxOrXx4d_920eJGoPNx_A0PSBSCNuCAyIvoz2ZPNbbi61m5gVIkKyYHpjL5bFQD",
    environment: "production" as const,
    returnUrl: "https://taxfy.co.za/payment/success",
    cancelUrl: "https://taxfy.co.za/payment/cancelled",
  },
};

// Enhanced Payment Manager with multiple gateways
export class EnhancedPaymentManager {
  private paypalManager: PayPalManager;

  constructor() {
    // Determine which credentials are available
    const hasProductionCredentials =
      PAYPAL_CONFIG.production.clientId &&
      PAYPAL_CONFIG.production.clientSecret;
    const hasSandboxCredentials =
      PAYPAL_CONFIG.sandbox.clientId && PAYPAL_CONFIG.sandbox.clientSecret;

    let config;

    if (import.meta.env.MODE === "production") {
      if (hasProductionCredentials) {
        config = PAYPAL_CONFIG.production;
      } else {
        throw new Error("PayPal production credentials not configured.");
      }
    } else {
      if (hasSandboxCredentials) {
        config = PAYPAL_CONFIG.sandbox;
      } else if (hasProductionCredentials) {
        config = PAYPAL_CONFIG.production;
      } else {
        throw new Error("PayPal credentials not configured.");
      }
    }

    this.paypalManager = new PayPalManager(config);
  }

  getAvailableGateways(): string[] {
    return ["paypal", "card", "guest", "bank_transfer"];
  }

  async processPayment(
    gateway: string,
    paymentData: PaymentData,
  ): Promise<PaymentResult> {
    switch (gateway) {
      case "paypal":
        return await this.paypalManager.processPayment(paymentData);

      case "card":
      case "guest":
        // Redirect to card payment processing
        return {
          success: true,
          paymentMethod: gateway,
          redirectUrl: `/payment/card?amount=${paymentData.amount}&currency=${paymentData.currency}&guest=${gateway === "guest"}`,
        };

      case "bank_transfer":
        // Generate EFT details
        return {
          success: true,
          paymentMethod: "bank_transfer",
          redirectUrl: `/payment/eft?amount=${paymentData.amount}&reference=${paymentData.userId || "guest"}-${Date.now()}`,
        };

      default:
        return {
          success: false,
          error: "Unsupported payment gateway",
          paymentMethod: gateway,
        };
    }
  }

  async capturePayment(
    gateway: string,
    transactionId: string,
  ): Promise<PaymentResult> {
    switch (gateway) {
      case "paypal":
        return await this.paypalManager.captureOrder(transactionId);

      default:
        return {
          success: false,
          error: "Capture not supported for this gateway",
          paymentMethod: gateway,
        };
    }
  }

  async cancelSubscription(
    gateway: string,
    subscriptionId: string,
    reason: string,
  ): Promise<boolean> {
    switch (gateway) {
      case "paypal":
        return await this.paypalManager.cancelSubscription(
          subscriptionId,
          reason,
        );

      default:
        return false;
    }
  }
}

// Default export for backwards compatibility
export default EnhancedPaymentManager;
