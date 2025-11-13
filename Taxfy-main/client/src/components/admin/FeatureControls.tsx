import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  ToggleLeft,
  Users,
  Crown,
  Building,
  Shield,
  Save,
  RefreshCw,
  Info,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  category: "core" | "premium" | "enterprise" | "experimental";
  enabled: boolean;
  requiresSubscription?: boolean;
  minSubscriptionTier?:
    | "free"
    | "starter"
    | "professional"
    | "enterprise"
    | "enterprise_pro"
    | "enterprise_elite";
  userLimit?: number;
  rolloutPercentage?: number;
  dependencies?: string[];
  environments?: ("development" | "staging" | "production")[];
}

interface FeatureControlsProps {}

const FeatureControls: React.FC<FeatureControlsProps> = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const defaultFeatures: FeatureFlag[] = [
      // Core Features
      {
        key: "user_registration",
        name: "User Registration",
        description: "Allow new users to create accounts",
        category: "core",
        enabled: true,
        environments: ["development", "staging", "production"],
      },
      {
        key: "guest_access",
        name: "Guest Access",
        description:
          "Allow guest users to use basic features without registration",
        category: "core",
        enabled: true,
        rolloutPercentage: 100,
      },
      {
        key: "pdf_upload",
        name: "PDF Upload",
        description: "Allow users to upload PDF documents for processing",
        category: "core",
        enabled: true,
      },
      {
        key: "manual_entry",
        name: "Manual Entry",
        description: "Allow manual entry of tax information",
        category: "core",
        enabled: true,
      },
      {
        key: "basic_calculations",
        name: "Basic Tax Calculations",
        description: "Perform basic tax calculations and generate reports",
        category: "core",
        enabled: true,
      },

      // Premium Features
      {
        key: "advanced_calculations",
        name: "Advanced Tax Calculations",
        description: "Advanced tax optimization and scenario planning",
        category: "premium",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "professional",
      },
      {
        key: "bulk_upload",
        name: "Bulk Upload",
        description: "Upload and process multiple documents at once",
        category: "premium",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "professional",
      },
      {
        key: "api_access",
        name: "API Access",
        description: "Access to REST API for integrations",
        category: "premium",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "professional",
      },
      {
        key: "priority_support",
        name: "Priority Support",
        description: "Enhanced support with faster response times",
        category: "premium",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "professional",
      },
      {
        key: "audit_trail",
        name: "Audit Trail",
        description: "Detailed audit logs and compliance tracking",
        category: "premium",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "professional",
      },

      // Enterprise Features
      {
        key: "white_label",
        name: "White Label",
        description: "Custom branding and white-label solutions",
        category: "enterprise",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "enterprise",
      },
      {
        key: "ai_optimization",
        name: "AI Tax Optimization",
        description: "AI-powered tax optimization recommendations",
        category: "enterprise",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "enterprise_pro",
      },
      {
        key: "blockchain_audit",
        name: "Blockchain Audit Trail",
        description: "Immutable blockchain-based audit trail",
        category: "enterprise",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "enterprise_pro",
      },
      {
        key: "real_time_compliance",
        name: "Real-time Compliance Monitoring",
        description: "Continuous compliance monitoring and alerts",
        category: "enterprise",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "enterprise_pro",
      },
      {
        key: "predictive_modeling",
        name: "Predictive Tax Modeling",
        description: "Machine learning models for tax prediction",
        category: "enterprise",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "enterprise_elite",
      },
      {
        key: "dedicated_infrastructure",
        name: "Dedicated Infrastructure",
        description: "Private cloud deployment with dedicated resources",
        category: "enterprise",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "enterprise_elite",
      },
      {
        key: "custom_ai_training",
        name: "Custom AI Training",
        description: "Train custom AI models on proprietary data",
        category: "enterprise",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "enterprise_elite",
      },
      {
        key: "quarterly_business_reviews",
        name: "Quarterly Business Reviews",
        description: "Strategic business reviews with tax experts",
        category: "enterprise",
        enabled: true,
        requiresSubscription: true,
        minSubscriptionTier: "enterprise_elite",
      },

      // Experimental Features
      {
        key: "ai_chat_assistant",
        name: "AI Chat Assistant",
        description: "AI-powered chat assistant for tax guidance",
        category: "experimental",
        enabled: false,
        rolloutPercentage: 10,
        dependencies: ["ai_optimization"],
      },
      {
        key: "voice_input",
        name: "Voice Input",
        description: "Voice-to-text input for tax information",
        category: "experimental",
        enabled: false,
        rolloutPercentage: 5,
      },
      {
        key: "ocr_enhancement",
        name: "Enhanced OCR",
        description: "Improved OCR with AI-powered text recognition",
        category: "experimental",
        enabled: false,
        rolloutPercentage: 25,
      },
      {
        key: "mobile_app",
        name: "Mobile App Features",
        description: "Progressive Web App features for mobile devices",
        category: "experimental",
        enabled: false,
        rolloutPercentage: 50,
      },
    ];

    setFeatures(defaultFeatures);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core":
        return <Shield className="w-4 h-4" />;
      case "premium":
        return <Crown className="w-4 h-4" />;
      case "enterprise":
        return <Building className="w-4 h-4" />;
      case "experimental":
        return <Settings className="w-4 h-4" />;
      default:
        return <ToggleLeft className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "premium":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "enterprise":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "experimental":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const toggleFeature = (key: string) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.key === key
          ? { ...feature, enabled: !feature.enabled }
          : feature,
      ),
    );
    setHasChanges(true);
  };

  const updateRolloutPercentage = (key: string, percentage: number) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.key === key
          ? { ...feature, rolloutPercentage: percentage }
          : feature,
      ),
    );
    setHasChanges(true);
  };

  const saveFeatures = async () => {
    setLoading(true);
    try {
      // In a real application, this would save to a backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Features Updated",
        description: "Feature flags have been saved successfully",
      });

      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save feature flags",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFeatureStatus = (feature: FeatureFlag) => {
    if (!feature.enabled) {
      return <Badge variant="secondary">Disabled</Badge>;
    }

    if (feature.rolloutPercentage && feature.rolloutPercentage < 100) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
        >
          {feature.rolloutPercentage}% Rollout
        </Badge>
      );
    }

    return (
      <Badge
        variant="default"
        className="bg-green-500/10 text-green-600 border-green-500/20"
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        Enabled
      </Badge>
    );
  };

  const getDependencyStatus = (feature: FeatureFlag) => {
    if (!feature.dependencies || feature.dependencies.length === 0) {
      return null;
    }

    const dependencyStatus = feature.dependencies.map((dep) => {
      const dependentFeature = features.find((f) => f.key === dep);
      return {
        key: dep,
        enabled: dependentFeature?.enabled || false,
        name: dependentFeature?.name || dep,
      };
    });

    const allEnabled = dependencyStatus.every((dep) => dep.enabled);

    return (
      <div className="mt-2">
        <p className="text-xs text-muted-foreground mb-1">Dependencies:</p>
        <div className="flex flex-wrap gap-1">
          {dependencyStatus.map((dep) => (
            <Badge
              key={dep.key}
              variant={dep.enabled ? "default" : "destructive"}
              className="text-xs"
            >
              {dep.name}
            </Badge>
          ))}
        </div>
        {!allEnabled && (
          <p className="text-xs text-red-500 mt-1">
            Some dependencies are disabled
          </p>
        )}
      </div>
    );
  };

  const groupedFeatures = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    },
    {} as Record<string, FeatureFlag[]>,
  );

  const enabledCount = features.filter((f) => f.enabled).length;
  const totalCount = features.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Feature Controls</h2>
          <p className="text-muted-foreground">
            Manage application features and access controls
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {enabledCount} of {totalCount} features enabled
          </div>
          <Button onClick={saveFeatures} disabled={loading || !hasChanges}>
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Feature updates will be applied
            immediately after saving.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Core Features</p>
                <p className="text-xs text-muted-foreground">
                  {groupedFeatures.core?.filter((f) => f.enabled).length || 0}{" "}
                  enabled
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Premium Features</p>
                <p className="text-xs text-muted-foreground">
                  {groupedFeatures.premium?.filter((f) => f.enabled).length ||
                    0}{" "}
                  enabled
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Enterprise Features</p>
                <p className="text-xs text-muted-foreground">
                  {groupedFeatures.enterprise?.filter((f) => f.enabled)
                    .length || 0}{" "}
                  enabled
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Experimental</p>
                <p className="text-xs text-muted-foreground">
                  {groupedFeatures.experimental?.filter((f) => f.enabled)
                    .length || 0}{" "}
                  enabled
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="core" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Core
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Premium
          </TabsTrigger>
          <TabsTrigger value="enterprise" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Enterprise
          </TabsTrigger>
          <TabsTrigger value="experimental" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Experimental
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4">
              {categoryFeatures.map((feature) => (
                <Card key={feature.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-md border ${getCategoryColor(feature.category)}`}
                        >
                          {getCategoryIcon(feature.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-medium">
                              {feature.name}
                            </CardTitle>
                            {feature.requiresSubscription && (
                              <Badge variant="outline" className="text-xs">
                                {feature.minSubscriptionTier}+
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-xs">
                            {feature.description}
                          </CardDescription>
                          {getDependencyStatus(feature)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getFeatureStatus(feature)}
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.key)}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  {feature.enabled &&
                    feature.rolloutPercentage !== undefined && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm">
                              Rollout Percentage
                            </Label>
                            <span className="text-sm text-muted-foreground">
                              {feature.rolloutPercentage}%
                            </span>
                          </div>
                          <Input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={feature.rolloutPercentage}
                            onChange={(e) =>
                              updateRolloutPercentage(
                                feature.key,
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            Feature will be available to{" "}
                            {feature.rolloutPercentage}% of users
                          </p>
                        </div>
                      </CardContent>
                    )}

                  {feature.environments && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Label className="text-sm">Environments</Label>
                        <div className="flex flex-wrap gap-1">
                          {feature.environments.map((env) => (
                            <Badge
                              key={env}
                              variant="outline"
                              className="text-xs"
                            >
                              {env}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeatureControls;
