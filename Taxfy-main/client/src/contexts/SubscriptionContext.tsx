import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  PricingTier,
  UserSubscription,
  FeatureFlags,
  DEFAULT_FEATURE_FLAGS,
  PRICING_CONFIG,
  PricingLimits,
  UsageMetrics,
} from "@/types/pricing";
import { User } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionContextType {
  // Current user subscription
  subscription: UserSubscription | null;

  // Current plan
  currentPlan: PricingTier;

  // Feature flags
  featureFlags: FeatureFlags;

  // Subscription status
  isSubscriptionsEnabled: boolean;

  // Current plan limits
  planLimits: PricingLimits;

  // Usage tracking
  usage: UsageMetrics;

  // Feature access checks
  canUploadIRP5: () => boolean;
  canExportCSV: () => boolean;
  canExportExcel: () => boolean;
  canAccessVault: () => boolean;
  canGetPrioritySupport: () => boolean;
  canUseAPI: () => boolean;

  // Usage tracking functions
  trackIRP5Upload: () => void;
  trackReportGeneration: () => void;
  trackAPICall: () => void;

  // Subscription management
  upgradePlan: (newPlan: PricingTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;

  // Feature flag management
  updateFeatureFlags: (flags: Partial<FeatureFlags>) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

interface SubscriptionProviderProps {
  children: ReactNode;
  initialPlan?: PricingTier;
  initialFeatureFlags?: Partial<FeatureFlags>;
}

export function SubscriptionProvider({
  children,
  initialPlan = "free",
  initialFeatureFlags = {},
}: SubscriptionProviderProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    ...DEFAULT_FEATURE_FLAGS,
    ...initialFeatureFlags,
  });

  const [user] = useState({
    id: "",
    email: "",
    name: "",
  });

  const [subscription, setSubscription] = useState<UserSubscription>({
    userId: "",
    planId: initialPlan,
    status: "active",
    startDate: new Date(),
    billingCycle: "monthly",
    autoRenew: true,
    usage: {
      irp5ProcessedThisMonth: 0,
      documentsInVault: 0,
      reportsGenerated: 0,
      apiCallsThisMonth: 0,
      lastUsed: new Date(),
      storageUsed: 0,
      clientsManaged: 0,
    },
  });

  const [usage, setUsage] = useState<UsageMetrics>(subscription.usage);

  // Get current plan limits
  const planLimits = PRICING_CONFIG[subscription.planId].limits;

  // Feature access checks
  const canUploadIRP5 = (): boolean => {
    if (!featureFlags.enableSubscriptions) return true; // Always allow when subscriptions disabled

    const limit = planLimits.irp5Uploads;
    if (limit === "unlimited") return true;
    return usage.irp5ProcessedThisMonth < limit;
  };

  const canExportCSV = (): boolean => {
    if (!featureFlags.enableSubscriptions) return true;

    const limit = planLimits.csvExports;
    if (limit === "unlimited") return true;
    return limit > 0;
  };

  const canExportExcel = (): boolean => {
    if (!featureFlags.enableSubscriptions) return true;

    const limit = planLimits.excelExports;
    if (limit === "unlimited") return true;
    return limit > 0;
  };

  const canAccessVault = (): boolean => {
    if (!featureFlags.enableSubscriptions) return true;

    const limit = planLimits.documentVault;
    if (limit === "unlimited") return true;
    return usage.documentsInVault < limit;
  };

  const canGetPrioritySupport = (): boolean => {
    if (!featureFlags.enablePrioritySupport) return false;
    return planLimits.prioritySupport;
  };

  const canUseAPI = (): boolean => {
    if (!featureFlags.enableApiAccess) return false;
    return planLimits.apiAccess;
  };

  // Usage tracking
  const trackIRP5Upload = () => {
    setUsage((prev) => ({
      ...prev,
      irp5ProcessedThisMonth: prev.irp5ProcessedThisMonth + 1,
      lastUsed: new Date(),
    }));
  };

  const trackReportGeneration = () => {
    setUsage((prev) => ({
      ...prev,
      reportsGenerated: prev.reportsGenerated + 1,
      lastUsed: new Date(),
    }));
  };

  const trackAPICall = () => {
    setUsage((prev) => ({
      ...prev,
      apiCallsThisMonth: prev.apiCallsThisMonth + 1,
      lastUsed: new Date(),
    }));
  };

  // Subscription management
  const upgradePlan = async (newPlan: PricingTier) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubscription((prev) => ({
        ...prev,
        planId: newPlan,
        status: "active",
      }));
      toast({
        title: "Plan Upgraded",
        description: `Successfully upgraded to ${newPlan} plan!`,
      });
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubscription((prev) => ({
        ...prev,
        status: "cancelled",
      }));
      toast({
        title: "Subscription Cancelled",
        description: "Subscription cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Feature flag management
  const updateFeatureFlags = (flags: Partial<FeatureFlags>) => {
    setFeatureFlags((prev) => ({ ...prev, ...flags }));
  };

  // Update subscription usage when it changes
  useEffect(() => {
    setSubscription((prev) => ({
      ...prev,
      usage,
    }));
  }, [usage]);

  const value: SubscriptionContextType = {
    subscription,
    currentPlan: subscription.planId,
    featureFlags,
    isSubscriptionsEnabled: featureFlags.enableSubscriptions,
    planLimits,
    usage,
    canUploadIRP5,
    canExportCSV,
    canExportExcel,
    canAccessVault,
    canGetPrioritySupport,
    canUseAPI,
    trackIRP5Upload,
    trackReportGeneration,
    trackAPICall,
    upgradePlan,
    cancelSubscription,
    updateFeatureFlags,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
}

// Hook for checking specific features
export function useFeatureAccess() {
  const {
    featureFlags,
    planLimits,
    canUploadIRP5,
    canExportCSV,
    canExportExcel,
  } = useSubscription();

  return {
    // Feature availability
    isPricingEnabled: featureFlags.enablePricing,
    isSubscriptionsEnabled: featureFlags.enableSubscriptions,
    isAPIEnabled: featureFlags.enableApiAccess,

    // Plan-based access
    hasUnlimitedUploads: planLimits.irp5Uploads === "unlimited",
    hasEmailSupport: planLimits.emailSupport,
    hasPrioritySupport: planLimits.prioritySupport,
    hasEncryptedBackup: planLimits.encryptedBackup,

    // Action permissions
    canUpload: canUploadIRP5(),
    canExportCSV: canExportCSV(),
    canExportExcel: canExportExcel(),
  };
}
