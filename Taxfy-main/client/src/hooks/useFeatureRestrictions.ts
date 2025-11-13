import { useState, useCallback } from "react";
import {
  useSubscription,
  useFeatureAccess,
} from "@/contexts/SubscriptionContext";
import { PricingTier } from "@/types/pricing";

interface FeatureRestriction {
  requiredPlan: PricingTier;
}

interface UpgradePromptState {
  show: boolean;
  feature: string;
  requiredPlan: PricingTier;
}

export function useFeatureRestrictions() {
  const FEATURE_RESTRICTIONS: Record<string, FeatureRestriction> = {
    "csv-export": {
      requiredPlan: "starter",
    },
    "excel-export": {
      requiredPlan: "starter",
    },
    "bulk-upload": {
      requiredPlan: "pro",
    },
    "api-access": {
      requiredPlan: "pro",
    },
    "white-label": {
      requiredPlan: "pro",
    },
    "priority-support": {
      requiredPlan: "pro",
    },
  };

  const [upgradePrompt, setUpgradePrompt] = useState<UpgradePromptState>({
    show: false,
    feature: "",
    requiredPlan: "starter",
  });

  const { trackIRP5Upload, trackReportGeneration } = useSubscription();
  const { canUpload, canExportCSV, canExportExcel, isSubscriptionsEnabled } =
    useFeatureAccess();

  const checkUploadAccess = (): boolean => {
    if (!isSubscriptionsEnabled) return true;

    if (!canUpload) {
      setUpgradePrompt({
        show: true,
        feature: "Unlimited IRP5 Uploads",
        requiredPlan: "starter",
      });
      return false;
    }

    // Track successful upload
    trackIRP5Upload();
    return true;
  };

  const checkExportAccess = (
    format: "pdf" | "csv" | "excel" | "sars-efiling",
  ): boolean => {
    if (!isSubscriptionsEnabled) return true;

    if (format === "csv" && !canExportCSV) {
      setUpgradePrompt({
        show: true,
        feature: "CSV Export - Included in Starter Individual",
        requiredPlan: "starter",
      });
      return false;
    }

    if (format === "excel" && !canExportExcel) {
      setUpgradePrompt({
        show: true,
        feature: "Excel Export - Included in Starter Individual",
        requiredPlan: "starter",
      });
      return false;
    }

    if (format === "sars-efiling" && !canExportCSV) {
      setUpgradePrompt({
        show: true,
        feature: "Direct SARS eFiling Export - Included in Starter Individual",
        requiredPlan: "starter",
      });
      return false;
    }

    // Track successful export
    trackReportGeneration();
    return true;
  };

  const closeUpgradePrompt = () => {
    setUpgradePrompt({ show: false, feature: "", requiredPlan: "starter" });
  };

  const checkFeatureAccess = useCallback((feature: string): boolean => {
    const restriction = FEATURE_RESTRICTIONS[feature];
    if (!restriction) return true;

    // Since authentication is removed, all features are now accessible
    return true;
  }, []);

  const requestFeatureAccess = useCallback((feature: string) => {
    const restriction = FEATURE_RESTRICTIONS[feature];
    if (!restriction) return;

    // Since authentication is removed, no upgrade prompts needed
    // All features are accessible
  }, []);

  const hideUpgradePrompt = useCallback(() => {
    setUpgradePrompt({ show: false, feature: "", requiredPlan: "starter" });
  }, []);

  return {
    upgradePrompt,
    checkUploadAccess,
    checkExportAccess,
    closeUpgradePrompt,
    isSubscriptionsEnabled,
    canUpload,
    canExportCSV,
    canExportExcel,
    checkFeatureAccess,
    requestFeatureAccess,
    hideUpgradePrompt,
  };
}
