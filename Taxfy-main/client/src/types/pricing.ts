// Pricing and subscription types for comprehensive SA business model

export type PricingTier =
  | "free"
  | "starter"
  | "pro"
  | "business"
  | "enterprise_pro"
  | "enterprise_elite"
  | "api";

export interface PricingPlan {
  id: PricingTier;
  name: string;
  price: number;
  currency: string;
  billing: "monthly" | "annually" | "per-use" | "per-document";
  category: "individual" | "business" | "api";
  popular?: boolean;
  description: string;
  features: PricingFeature[];
  limits: PricingLimits;
  cta: string;
  badge?: string;
  annualDiscount?: number; // Percentage discount for annual billing
  trialPeriodMonths?: number; // Free trial period in months
  targetMarket: string;
  businessModel: string;
}

export interface PricingFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  limit?: number | "unlimited";
  premium?: boolean;
}

export interface PricingLimits {
  irp5Uploads: number | "unlimited";
  documentVault: number | "unlimited";
  pdfReports: number | "unlimited";
  csvExports: number | "unlimited";
  excelExports: number | "unlimited";
  emailSupport: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  apiCallsPerMonth: number | "unlimited";
  whiteLabel: boolean;
  bulkProcessing: boolean;
  encryptedBackup: boolean;
  auditTrail: boolean;
  customBranding: boolean;
  dedicatedAccountManager: boolean;
  multiUserAccess: number | "unlimited";
  clientManagement: boolean;
  advancedReporting: boolean;
  dataRetention: string; // e.g., "7 years", "unlimited"
  supportLevel: "basic" | "standard" | "priority" | "premium";
}

export interface UserSubscription {
  userId: string;
  planId: PricingTier;
  status: "active" | "cancelled" | "expired" | "trial" | "pending";
  startDate: Date;
  endDate?: Date;
  trialEndDate?: Date;
  usage: UsageMetrics;
  paymentMethod?: PaymentMethod;
  billingCycle: "monthly" | "annually";
  autoRenew: boolean;
  nextBillingDate?: Date;
  subscriptionId?: string; // PayPal subscription ID
}

export interface UsageMetrics {
  irp5ProcessedThisMonth: number;
  documentsInVault: number;
  reportsGenerated: number;
  apiCallsThisMonth: number;
  lastUsed: Date;
  storageUsed: number; // in MB
  clientsManaged: number;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "guest" | "bank_transfer";
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  paypalEmail?: string;
  isDefault: boolean;
  created: Date;
}

export interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  processingFee?: number; // Percentage
  supportedCurrencies: string[];
  features: string[];
  enabled: boolean;
}

// Feature flags for conditional rendering
export interface FeatureFlags {
  enablePricing: boolean;
  enableSubscriptions: boolean;
  enableApiAccess: boolean;
  enableWhiteLabel: boolean;
  enableBulkProcessing: boolean;
  enablePrioritySupport: boolean;
  enableCustomBranding: boolean;
  enablePayPal: boolean;
  enableGuestCheckout: boolean;
  enableCardPayments: boolean;
  enableAnnualBilling: boolean;
}

// Default feature flags configuration
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enablePricing: true,
  enableSubscriptions: true,
  enableApiAccess: true,
  enableWhiteLabel: true,
  enableBulkProcessing: true,
  enablePrioritySupport: true,
  enableCustomBranding: true,
  enablePayPal: true,
  enableGuestCheckout: true,
  enableCardPayments: true,
  enableAnnualBilling: true,
};

// South African Tax Professional Business Model Configuration
export const SA_PRICING_CONFIG: Record<PricingTier, PricingPlan> = {
  free: {
    id: "free",
    name: "Free Individual",
    price: 0,
    currency: "ZAR",
    billing: "monthly",
    category: "individual",
    description: "Perfect for personal tax returns and trying out Taxfy",
    targetMarket: "Individual taxpayers and students",
    businessModel: "Freemium - Lead generation for paid plans",
    features: [
      {
        id: "irp5_upload",
        name: "Upload 2 IRP5 documents",
        included: true,
        limit: 2,
      },
      {
        id: "basic_calculation",
        name: "Basic tax calculations",
        included: true,
      },
      { id: "pdf_report", name: "Basic PDF tax summary", included: true },
      { id: "sars_preview", name: "SARS eFiling preview", included: true },
      { id: "ai_validation", name: "AI document validation", included: true },
      { id: "mobile_app", name: "Mobile app access", included: true },
    ],
    limits: {
      irp5Uploads: 2,
      documentVault: 5, // Store up to 5 documents
      pdfReports: 1,
      csvExports: 0,
      excelExports: 0,
      emailSupport: true,
      prioritySupport: false,
      apiAccess: false,
      apiCallsPerMonth: 0,
      whiteLabel: false,
      bulkProcessing: false,
      encryptedBackup: false,
      auditTrail: false,
      customBranding: false,
      dedicatedAccountManager: false,
      multiUserAccess: 1,
      clientManagement: false,
      advancedReporting: false,
      dataRetention: "1 year",
      supportLevel: "basic",
    },
    cta: "Start Free",
  },

  starter: {
    id: "starter",
    name: "Starter Individual",
    price: 49, // ~$2.70 USD - affordable for SA individuals
    currency: "ZAR",
    billing: "monthly",
    category: "individual",
    popular: true,
    badge: "Most Popular",
    annualDiscount: 20, // 20% discount for annual payment
    description:
      "Complete solution for individuals with multiple income sources",
    targetMarket: "Working professionals, contractors, part-time workers",
    businessModel: "Subscription - Primary revenue driver for individuals",
    features: [
      {
        id: "unlimited_irp5",
        name: "Unlimited IRP5 uploads",
        included: true,
        limit: "unlimited",
      },
      {
        id: "multi_income",
        name: "Multiple income source support",
        included: true,
      },
      {
        id: "deduction_optimizer",
        name: "Tax deduction optimizer",
        included: true,
      },
      { id: "sars_export", name: "Direct SARS eFiling export", included: true },
      {
        id: "previous_years",
        name: "Previous tax year comparisons",
        included: true,
      },
      {
        id: "email_support",
        name: "Email support (48h response)",
        included: true,
      },
      { id: "document_storage", name: "Secure document vault", included: true },
      {
        id: "mobile_sync",
        name: "Cross-device synchronization",
        included: true,
      },
    ],
    limits: {
      irp5Uploads: "unlimited",
      documentVault: "unlimited",
      pdfReports: "unlimited",
      csvExports: "unlimited",
      excelExports: "unlimited",
      emailSupport: true,
      prioritySupport: false,
      apiAccess: false,
      apiCallsPerMonth: 0,
      whiteLabel: false,
      bulkProcessing: false,
      encryptedBackup: true,
      auditTrail: true,
      customBranding: false,
      dedicatedAccountManager: false,
      multiUserAccess: 1,
      clientManagement: false,
      advancedReporting: true,
      dataRetention: "7 years",
      supportLevel: "standard",
    },
    cta: "Choose Starter",
  },

  pro: {
    id: "pro",
    name: "Professional Practice",
    price: 899, // ~$50 USD - competitive for SA tax practitioners
    currency: "ZAR",
    billing: "monthly",
    category: "business",
    annualDiscount: 25, // 25% discount for annual payment
    description:
      "Comprehensive solution for tax practitioners and small accounting firms",
    targetMarket: "Tax practitioners, small accounting firms, bookkeepers",
    businessModel: "B2B Subscription - High-value professional market",
    features: [
      { id: "client_portal", name: "Client management portal", included: true },
      { id: "bulk_processing", name: "Bulk IRP5 processing", included: true },
      { id: "white_label", name: "White-label reports", included: true },
      {
        id: "priority_support",
        name: "Priority support (4h response)",
        included: true,
      },
      {
        id: "audit_trail",
        name: "Full audit trail & compliance",
        included: true,
      },
      {
        id: "team_collaboration",
        name: "Team collaboration tools",
        included: true,
      },
      {
        id: "custom_templates",
        name: "Custom report templates",
        included: true,
      },
      {
        id: "api_access",
        name: "Limited API access",
        included: true,
        limit: 1000,
      },
      {
        id: "advanced_analytics",
        name: "Advanced analytics dashboard",
        included: true,
      },
      {
        id: "client_communication",
        name: "Built-in client communication",
        included: true,
      },
    ],
    limits: {
      irp5Uploads: "unlimited",
      documentVault: "unlimited",
      pdfReports: "unlimited",
      csvExports: "unlimited",
      excelExports: "unlimited",
      emailSupport: true,
      prioritySupport: true,
      apiAccess: true,
      apiCallsPerMonth: 1000,
      whiteLabel: true,
      bulkProcessing: true,
      encryptedBackup: true,
      auditTrail: true,
      customBranding: true,
      dedicatedAccountManager: false,
      multiUserAccess: 5,
      clientManagement: true,
      advancedReporting: true,
      dataRetention: "unlimited",
      supportLevel: "priority",
    },
    cta: "Choose Professional",
  },

  business: {
    id: "business",
    name: "Enterprise Solution",
    price: 1799, // ~$100 USD - enterprise pricing
    currency: "ZAR",
    billing: "monthly",
    category: "business",
    annualDiscount: 30, // 30% discount for annual payment
    trialPeriodMonths: 3, // 3-month free trial
    description:
      "Complete enterprise solution for large accounting firms and corporate tax departments",
    targetMarket:
      "Large accounting firms, corporate tax departments, enterprise clients",
    businessModel: "Enterprise B2B - Premium pricing with dedicated support",
    features: [
      {
        id: "enterprise_security",
        name: "Enterprise-grade security & compliance",
        included: true,
      },
      {
        id: "dedicated_manager",
        name: "Dedicated account manager",
        included: true,
      },
      {
        id: "custom_integrations",
        name: "Custom API integrations",
        included: true,
      },
      {
        id: "sla_guarantee",
        name: "99.9% uptime SLA guarantee",
        included: true,
      },
      {
        id: "unlimited_users",
        name: "Unlimited user accounts",
        included: true,
      },
      {
        id: "advanced_permissions",
        name: "Advanced role-based permissions",
        included: true,
      },
      {
        id: "custom_workflows",
        name: "Custom workflow automation",
        included: true,
      },
      {
        id: "training_support",
        name: "Staff training & onboarding",
        included: true,
      },
      {
        id: "data_migration",
        name: "Data migration assistance",
        included: true,
      },
      { id: "white_glove", name: "White-glove implementation", included: true },
    ],
    limits: {
      irp5Uploads: "unlimited",
      documentVault: "unlimited",
      pdfReports: "unlimited",
      csvExports: "unlimited",
      excelExports: "unlimited",
      emailSupport: true,
      prioritySupport: true,
      apiAccess: true,
      apiCallsPerMonth: "unlimited",
      whiteLabel: true,
      bulkProcessing: true,
      encryptedBackup: true,
      auditTrail: true,
      customBranding: true,
      dedicatedAccountManager: true,
      multiUserAccess: "unlimited",
      clientManagement: true,
      advancedReporting: true,
      dataRetention: "unlimited",
      supportLevel: "premium",
    },
    cta: "Contact Sales",
  },

  enterprise_pro: {
    id: "enterprise_pro",
    name: "Enterprise Pro",
    price: 3499, // ~$192 USD - premium enterprise pricing
    currency: "ZAR",
    billing: "monthly",
    category: "business",
    annualDiscount: 20, // 20% discount for annual payment
    trialPeriodMonths: 3, // 3-month free trial
    description:
      "Premium enterprise solution for large accounting firms and multinational corporations",
    targetMarket:
      "Large accounting firms (50+ employees), multinational corporations",
    businessModel:
      "Premium Enterprise B2B - Dedicated infrastructure with white-glove service",
    features: [
      {
        id: "multi_tenant",
        name: "Multi-tenant architecture with custom branding",
        included: true,
      },
      {
        id: "ai_tax_optimization",
        name: "Advanced AI tax optimization recommendations",
        included: true,
      },
      {
        id: "real_time_compliance",
        name: "Real-time compliance monitoring across entities",
        included: true,
      },
      {
        id: "dedicated_infrastructure",
        name: "Dedicated cloud infrastructure (private cloud option)",
        included: true,
      },
      {
        id: "phone_support_24_7",
        name: "24/7 phone support with 2-hour SLA",
        included: true,
      },
      {
        id: "workflow_automation",
        name: "Custom workflow automation",
        included: true,
      },
      {
        id: "blockchain_audit",
        name: "Advanced audit trail with blockchain verification",
        included: true,
      },
      {
        id: "erp_integration",
        name: "Integration with major ERP systems (SAP, Oracle, Microsoft)",
        included: true,
      },
      {
        id: "advanced_security",
        name: "Enterprise-grade security controls",
        included: true,
      },
      {
        id: "custom_workflows",
        name: "Custom compliance workflow development",
        included: true,
      },
    ],
    limits: {
      irp5Uploads: "unlimited",
      documentVault: "unlimited",
      pdfReports: "unlimited",
      csvExports: "unlimited",
      excelExports: "unlimited",
      emailSupport: true,
      prioritySupport: true,
      apiAccess: true,
      apiCallsPerMonth: "unlimited",
      whiteLabel: true,
      bulkProcessing: true,
      encryptedBackup: true,
      auditTrail: true,
      customBranding: true,
      dedicatedAccountManager: true,
      multiUserAccess: "unlimited",
      clientManagement: true,
      advancedReporting: true,
      dataRetention: "unlimited",
      supportLevel: "premium",
    },
    cta: "Contact Enterprise Sales",
  },

  enterprise_elite: {
    id: "enterprise_elite",
    name: "Enterprise Elite",
    price: 6999, // ~$385 USD - ultra-premium enterprise pricing
    currency: "ZAR",
    billing: "monthly",
    category: "business",
    badge: "Premium",
    annualDiscount: 20, // 20% discount for annual payment
    trialPeriodMonths: 3, // 3-month free trial
    description:
      "Ultra-premium solution for top-tier accounting firms and government agencies",
    targetMarket:
      "Top-tier accounting firms, government agencies, large corporates (500+ employees)",
    businessModel:
      "Ultra-Premium Enterprise - White-glove service with custom development",
    features: [
      {
        id: "ai_tax_consulting",
        name: "AI-powered tax strategy consulting",
        included: true,
      },
      {
        id: "predictive_modeling",
        name: "Predictive tax liability modeling",
        included: true,
      },
      {
        id: "custom_compliance_framework",
        name: "Custom compliance framework development",
        included: true,
      },
      {
        id: "dedicated_data_center",
        name: "Dedicated data center option",
        included: true,
      },
      {
        id: "white_label_platform",
        name: "White-label platform licensing",
        included: true,
      },
      {
        id: "custom_ai_training",
        name: "Custom AI model training on company data",
        included: true,
      },
      {
        id: "executive_dashboards",
        name: "Executive reporting dashboards",
        included: true,
      },
      {
        id: "quarterly_reviews",
        name: "Quarterly business reviews with tax experts",
        included: true,
      },
      {
        id: "regulatory_change_alerts",
        name: "Real-time regulatory change alerts",
        included: true,
      },
      {
        id: "compliance_automation",
        name: "Automated filing and compliance submissions",
        included: true,
      },
    ],
    limits: {
      irp5Uploads: "unlimited",
      documentVault: "unlimited",
      pdfReports: "unlimited",
      csvExports: "unlimited",
      excelExports: "unlimited",
      emailSupport: true,
      prioritySupport: true,
      apiAccess: true,
      apiCallsPerMonth: "unlimited",
      whiteLabel: true,
      bulkProcessing: true,
      encryptedBackup: true,
      auditTrail: true,
      customBranding: true,
      dedicatedAccountManager: true,
      multiUserAccess: "unlimited",
      clientManagement: true,
      advancedReporting: true,
      dataRetention: "unlimited",
      supportLevel: "premium",
    },
    cta: "Schedule Elite Consultation",
  },

  api: {
    id: "api",
    name: "API Integration",
    price: 2, // R2 per document processed
    currency: "ZAR",
    billing: "per-document",
    category: "api",
    description:
      "Pay-per-use API for fintech apps, software developers, and system integrations",
    targetMarket:
      "Fintech companies, software developers, payroll providers, HR systems",
    businessModel: "API Revenue - Usage-based pricing for developers",
    features: [
      { id: "rest_api", name: "RESTful API access", included: true },
      {
        id: "json_response",
        name: "Structured JSON responses",
        included: true,
      },
      {
        id: "real_time",
        name: "Real-time document processing",
        included: true,
      },
      { id: "webhook_support", name: "Webhook notifications", included: true },
      { id: "sdk_support", name: "SDK for popular languages", included: true },
      {
        id: "api_documentation",
        name: "Comprehensive API documentation",
        included: true,
      },
      {
        id: "sandbox_env",
        name: "Sandbox testing environment",
        included: true,
      },
      {
        id: "technical_support",
        name: "Technical integration support",
        included: true,
      },
      { id: "rate_limiting", name: "Flexible rate limiting", included: true },
      {
        id: "usage_analytics",
        name: "Usage analytics dashboard",
        included: true,
      },
    ],
    limits: {
      irp5Uploads: "unlimited",
      documentVault: "unlimited",
      pdfReports: "unlimited",
      csvExports: "unlimited",
      excelExports: "unlimited",
      emailSupport: true,
      prioritySupport: true,
      apiAccess: true,
      apiCallsPerMonth: "unlimited",
      whiteLabel: true,
      bulkProcessing: true,
      encryptedBackup: true,
      auditTrail: true,
      customBranding: true,
      dedicatedAccountManager: false,
      multiUserAccess: "unlimited",
      clientManagement: false,
      advancedReporting: true,
      dataRetention: "unlimited",
      supportLevel: "priority",
    },
    cta: "Get API Key",
  },
};

// Payment method configurations
export const PAYMENT_OPTIONS: Record<string, PaymentOption> = {
  paypal: {
    id: "paypal",
    name: "PayPal",
    description: "Pay securely with your PayPal account",
    icon: "paypal-logo",
    processingFee: 3.4, // PayPal's standard fee
    supportedCurrencies: ["ZAR", "USD", "EUR", "GBP"],
    features: [
      "Instant payment processing",
      "Buyer protection",
      "No card details required",
      "International payments",
      "Recurring subscriptions",
    ],
    enabled: true,
  },

  card: {
    id: "card",
    name: "Credit/Debit Card",
    description: "Pay with Visa, Mastercard, or American Express",
    icon: "credit-card",
    processingFee: 2.9,
    supportedCurrencies: ["ZAR", "USD"],
    features: [
      "Secure card processing",
      "Save card for future payments",
      "Support for all major cards",
      "PCI DSS compliant",
      "Instant authorization",
    ],
    enabled: true,
  },

  guest: {
    id: "guest",
    name: "Guest Checkout",
    description: "Pay without creating an account",
    icon: "user-check",
    processingFee: 2.9,
    supportedCurrencies: ["ZAR", "USD"],
    features: [
      "No account required",
      "Quick checkout process",
      "Email receipt",
      "Secure one-time payment",
      "Mobile optimized",
    ],
    enabled: true,
  },

  bank_transfer: {
    id: "bank_transfer",
    name: "EFT/Bank Transfer",
    description: "Direct bank transfer (South African banks)",
    icon: "building-2",
    processingFee: 0,
    supportedCurrencies: ["ZAR"],
    features: [
      "No processing fees",
      "All SA banks supported",
      "Secure bank-to-bank transfer",
      "Manual verification required",
      "2-3 business day processing",
    ],
    enabled: true,
  },
};

// Business model metrics and KPIs
export interface BusinessMetrics {
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  churnRate: number;
  conversionRate: {
    freeToStarter: number;
    starterToPro: number;
    proToBusiness: number;
  };
  apiUsage: {
    documentsProcessed: number;
    revenue: number;
    avgRevenuePerCall: number;
  };
  marketSegments: {
    individual: number;
    professional: number;
    enterprise: number;
    api: number;
  };
}

// Legacy configuration for backward compatibility
export const PRICING_CONFIG = SA_PRICING_CONFIG;

export default SA_PRICING_CONFIG;
