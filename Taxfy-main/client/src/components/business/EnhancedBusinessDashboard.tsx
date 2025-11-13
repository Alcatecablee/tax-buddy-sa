import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Building2,
  Shield,
  Users,
  Zap,
  Clock,
  FileCheck,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Crown,
  Star,
  Activity,
  Database,
  Globe,
  Headphones,
  MessageSquare,
  Calendar,
  TrendingUp,
  Lock,
  Eye,
  RefreshCw,
  Brain,
  Blocks,
  Network,
  CloudCog,
  Layers,
  Sparkles,
  Phone,
  Target,
  Award,
  DollarSign,
  Monitor,
  Workflow,
  PieChart,
  LineChart,
  Workflow,
  GraduationCap,
  Database,
  Crown,
} from "lucide-react";

// Import enhanced enterprise components
import AITaxOptimization from "@/components/business/AITaxOptimization";
import BlockchainAuditTrail from "@/components/business/BlockchainAuditTrail";
import RealTimeCompliance from "@/components/business/RealTimeCompliance";
import PredictiveTaxModeling from "@/components/business/PredictiveTaxModeling";
import WhiteLabelPlatform from "@/components/business/WhiteLabelPlatform";
import DedicatedInfrastructure from "@/components/business/DedicatedInfrastructure";
import EnterpriseIntegrations from "@/components/business/EnterpriseIntegrations";
import DedicatedSupport from "@/components/business/DedicatedSupport";
import CustomAITraining from "@/components/business/CustomAITraining";
import QuarterlyBusinessReviews from "@/components/business/QuarterlyBusinessReviews";
import ComplianceAsAService from "@/components/business/ComplianceAsAService";
import TaxExpertConsulting from "@/components/business/TaxExpertConsulting";
import WorkflowAutomation from "@/components/business/WorkflowAutomation";
import StaffTraining from "@/components/business/StaffTraining";
import DataMigration from "@/components/business/DataMigration";
import WhiteGloveImplementation from "@/components/business/WhiteGloveImplementation";

interface BusinessMetrics {
  totalUsers: number;
  activeUsers: number;
  securityScore: number;
  complianceScore: number;
  uptimePercentage: number;
  avgResponseTime: number;
  openTickets: number;
  integrations: number;
  monthlyProcessedDocs: number;
  aiOptimizationSavings: number;
  complianceViolations: number;
  customModels: number;
  automatedTasks: number;
  apiCalls: number;
  costSavings: number;
  consultingRevenue: number;
}

interface EnterpriseFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "available" | "premium" | "elite_only" | "coming_soon";
  tier: "pro" | "business" | "enterprise_pro" | "enterprise_elite";
  category:
    | "ai"
    | "compliance"
    | "security"
    | "integration"
    | "support"
    | "consulting";
  component?: React.ComponentType<any>;
}

export default function EnhancedBusinessDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTier, setSelectedTier] = useState<
    "pro" | "business" | "enterprise_pro" | "enterprise_elite"
  >("enterprise_elite");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // State for business metrics from API
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    securityScore: 0,
    complianceScore: 0,
    uptimePercentage: 0,
    avgResponseTime: 0,
    openTickets: 0,
    integrations: 0,
    monthlyProcessedDocs: 0,
    aiOptimizationSavings: 0,
    complianceViolations: 0,
    customModels: 0,
    automatedTasks: 0,
    apiCalls: 0,
    costSavings: 0,
    consultingRevenue: 0,
  });

  // Load business metrics from API
  useEffect(() => {
    const loadBusinessMetrics = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
        const userId = localStorage.getItem("currentUserId") || "demo-user";

        const response = await fetch(`${API_BASE_URL}/business/metrics`, {
          headers: {
            "X-User-ID": userId,
          },
        });

        if (response.ok) {
          const metrics = await response.json();
          setBusinessMetrics(metrics);
        } else {
          console.error("Failed to load business metrics");
        }
      } catch (error) {
        console.error("Error loading business metrics:", error);
      }
    };

    loadBusinessMetrics();
  }, []);

  const enterpriseFeatures: EnterpriseFeature[] = [
    // AI & Optimization Features
    {
      id: "ai_tax_optimization",
      name: "AI Tax Optimization",
      description:
        "Advanced AI algorithms that analyze tax scenarios and recommend optimization strategies",
      icon: Brain,
      status: "premium",
      tier: "enterprise_pro",
      category: "ai",
      component: AITaxOptimization,
    },
    {
      id: "predictive_modeling",
      name: "Predictive Tax Modeling",
      description:
        "Machine learning models that predict tax liabilities and identify potential savings",
      icon: TrendingUp,
      status: "elite_only",
      tier: "enterprise_elite",
      category: "ai",
      component: PredictiveTaxModeling,
    },
    {
      id: "custom_ai_training",
      name: "Custom AI Model Training",
      description:
        "Train custom AI models on your proprietary tax data for unmatched accuracy",
      icon: Brain,
      status: "elite_only",
      tier: "enterprise_elite",
      category: "ai",
      component: CustomAITraining,
    },

    // Compliance & Security
    {
      id: "blockchain_audit",
      name: "Blockchain Audit Trail",
      description:
        "Immutable blockchain-verified audit trail for regulatory compliance",
      icon: Blocks,
      status: "premium",
      tier: "enterprise_pro",
      category: "compliance",
      component: BlockchainAuditTrail,
    },
    {
      id: "real_time_compliance",
      name: "Real-Time Compliance Monitoring",
      description:
        "Continuous monitoring of compliance status across all entities",
      icon: Eye,
      status: "premium",
      tier: "enterprise_pro",
      category: "compliance",
      component: RealTimeCompliance,
    },
    {
      id: "compliance_as_service",
      name: "Compliance-as-a-Service (CaaS)",
      description:
        "Comprehensive compliance management across multiple entities",
      icon: Shield,
      status: "premium",
      tier: "enterprise_pro",
      category: "compliance",
      component: ComplianceAsAService,
    },

    // Infrastructure & Security
    {
      id: "dedicated_infrastructure",
      name: "Dedicated Cloud Infrastructure",
      description:
        "Private cloud deployment with dedicated resources and enhanced security",
      icon: CloudCog,
      status: "premium",
      tier: "enterprise_pro",
      category: "security",
      component: DedicatedInfrastructure,
    },
    {
      id: "white_label_platform",
      name: "White-Label Platform",
      description:
        "Complete white-label solution with custom branding and domain",
      icon: Layers,
      status: "elite_only",
      tier: "enterprise_elite",
      category: "integration",
      component: WhiteLabelPlatform,
    },

    // Integrations & Workflow
    {
      id: "enterprise_integrations",
      name: "Enterprise System Integration",
      description:
        "Native integration with ERP, CRM, and other business systems",
      icon: Network,
      status: "premium",
      tier: "enterprise_pro",
      category: "integration",
      component: EnterpriseIntegrations,
    },

    // Support & Service
    {
      id: "dedicated_support",
      name: "24/7 Dedicated Support",
      description:
        "Round-the-clock phone support with dedicated account manager",
      icon: Phone,
      status: "premium",
      tier: "enterprise_pro",
      category: "support",
      component: DedicatedSupport,
    },
    {
      id: "quarterly_reviews",
      name: "Quarterly Business Reviews",
      description:
        "Strategic business reviews with tax experts and product specialists",
      icon: Calendar,
      status: "elite_only",
      tier: "enterprise_elite",
      category: "support",
      component: QuarterlyBusinessReviews,
    },
    {
      id: "tax_consulting",
      name: "Tax Expert Consulting",
      description:
        "Expert tax consultations at R1,500/hour with certified professionals",
      icon: Users,
      status: "premium",
      tier: "enterprise_pro",
      category: "consulting",
      component: TaxExpertConsulting,
    },
    {
      id: "workflow_automation",
      name: "Custom Workflow Automation",
      description:
        "Automate repetitive tasks and streamline your tax practice operations",
      icon: Workflow,
      status: "available",
      tier: "business",
      category: "integration",
      component: WorkflowAutomation,
    },
    {
      id: "staff_training",
      name: "Staff Training & Onboarding",
      description:
        "Comprehensive training programs and certification for your team",
      icon: GraduationCap,
      status: "available",
      tier: "business",
      category: "support",
      component: StaffTraining,
    },
    {
      id: "data_migration",
      name: "Data Migration Assistance",
      description:
        "Professional data migration services with dedicated support",
      icon: Database,
      status: "available",
      tier: "business",
      category: "integration",
      component: DataMigration,
    },
    {
      id: "white_glove_implementation",
      name: "White-Glove Implementation",
      description:
        "Dedicated implementation team for seamless platform deployment",
      icon: Crown,
      status: "premium",
      tier: "business",
      category: "support",
      component: WhiteGloveImplementation,
    },
  ];

  const getFeaturesByTier = (tier: typeof selectedTier) => {
    const tierOrder = ["pro", "business", "enterprise_pro", "enterprise_elite"];
    const selectedTierIndex = tierOrder.indexOf(tier);
    return enterpriseFeatures.filter((feature) => {
      const featureTierIndex = tierOrder.indexOf(feature.tier);
      return featureTierIndex <= selectedTierIndex;
    });
  };

  const getFeaturesByCategory = (category: string) => {
    return getFeaturesByTier(selectedTier).filter(
      (feature) => feature.category === category,
    );
  };

  const renderSelectedFeature = () => {
    if (!selectedFeature) return null;
    const feature = enterpriseFeatures.find((f) => f.id === selectedFeature);
    if (!feature?.component) return null;

    const FeatureComponent = feature.component;
    return <FeatureComponent />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Crown className="h-8 w-8 text-primary" />
              Enhanced Enterprise Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-purple-500/10 to-blue-500/10"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                All Premium Features Unlocked
              </Badge>
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-green-500/10 to-blue-500/10"
              >
                <TrendingUp className="h-3 w-3 mr-1" />R
                {businessMetrics.costSavings.toLocaleString()} Annual Savings
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Link to="/pricing">
              <Button>
                <Crown className="h-4 w-4 mr-2" />
                Manage Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* Tier Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Your Enterprise Tier</CardTitle>
            <CardDescription>
              Current plan features and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  id: "pro",
                  name: "Professional",
                  price: "R899/mo",
                  icon: Star,
                  features: 5,
                },
                {
                  id: "business",
                  name: "Enterprise",
                  price: "R1,799/mo",
                  icon: Building2,
                  features: 8,
                },
                {
                  id: "enterprise_pro",
                  name: "Enterprise Pro",
                  price: "R3,499/mo",
                  icon: Crown,
                  features: 12,
                },
                {
                  id: "enterprise_elite",
                  name: "Enterprise Elite",
                  price: "R6,999/mo",
                  icon: Sparkles,
                  features: 15,
                },
              ].map((tier) => (
                <Button
                  key={tier.id}
                  variant={selectedTier === tier.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() =>
                    setSelectedTier(tier.id as typeof selectedTier)
                  }
                >
                  <tier.icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-semibold">{tier.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {tier.price}
                    </div>
                    <div className="text-xs text-primary">
                      {tier.features} features
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AI Optimization Savings
              </CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R{businessMetrics.aiOptimizationSavings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Documents Processed
              </CardTitle>
              <FileCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessMetrics.monthlyProcessedDocs.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Compliance Score
              </CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {businessMetrics.complianceScore}%
              </div>
              <Progress
                value={businessMetrics.complianceScore}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Uptime
              </CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {businessMetrics.uptimePercentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                99.9% SLA maintained
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Custom AI Models
              </CardTitle>
              <Brain className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {businessMetrics.customModels}
              </div>
              <p className="text-xs text-muted-foreground">
                Trained models active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <Network className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(businessMetrics.apiCalls / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Consulting Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                R{businessMetrics.consultingRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Automated Tasks
              </CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessMetrics.automatedTasks}
              </div>
              <p className="text-xs text-muted-foreground">
                Workflows automated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Feature Interface */}
        {selectedFeature ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedFeature(null)}
              >
                ← Back to Dashboard
              </Button>
              <h2 className="text-2xl font-bold">
                {enterpriseFeatures.find((f) => f.id === selectedFeature)?.name}
              </h2>
            </div>
            {renderSelectedFeature()}
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai">AI Features</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFeaturesByTier(selectedTier)
                  .slice(0, 9)
                  .map((feature) => (
                    <Card
                      key={feature.id}
                      className="cursor-pointer hover:shadow-lg transition-all relative"
                      onClick={() => setSelectedFeature(feature.id)}
                    >
                      {feature.status === "premium" && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                          Premium
                        </Badge>
                      )}
                      {feature.status === "elite_only" && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-gold-500 to-yellow-500">
                          <Crown className="h-3 w-3 mr-1" />
                          Elite
                        </Badge>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <feature.icon className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg">
                            {feature.name}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                        <div className="mt-4 flex items-center justify-between">
                          <Badge variant="outline">{feature.category}</Badge>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3 mr-2" />
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI & Machine Learning Features
                  </CardTitle>
                  <CardDescription>
                    Advanced AI capabilities for tax optimization and predictive
                    analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getFeaturesByCategory("ai").map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedFeature(feature.id)}
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          {feature.status === "premium" && (
                            <Badge variant="secondary" className="mt-2">
                              {feature.tier === "enterprise_elite"
                                ? "Elite Only"
                                : "Pro+"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Compliance & Audit Features
                  </CardTitle>
                  <CardDescription>
                    Advanced compliance monitoring and audit trail capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getFeaturesByCategory("compliance").map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedFeature(feature.id)}
                      >
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <feature.icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          {feature.status === "premium" && (
                            <Badge variant="secondary" className="mt-2">
                              {feature.tier === "enterprise_elite"
                                ? "Elite Only"
                                : "Pro+"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudCog className="h-5 w-5" />
                    Infrastructure & Security
                  </CardTitle>
                  <CardDescription>
                    Enterprise-grade infrastructure and dedicated security
                    options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getFeaturesByCategory("security").map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedFeature(feature.id)}
                      >
                        <div className="p-2 rounded-lg bg-red-500/10">
                          <feature.icon className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          {feature.status === "premium" && (
                            <Badge variant="secondary" className="mt-2">
                              {feature.tier === "enterprise_elite"
                                ? "Elite Only"
                                : "Pro+"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Integrations & Workflow
                  </CardTitle>
                  <CardDescription>
                    Advanced integration capabilities and workflow automation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getFeaturesByCategory("integration").map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedFeature(feature.id)}
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          {feature.status === "premium" && (
                            <Badge variant="secondary" className="mt-2">
                              {feature.tier === "enterprise_elite"
                                ? "Elite Only"
                                : "Pro+"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Support & Consulting Services
                  </CardTitle>
                  <CardDescription>
                    Premium support and expert consulting services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ...getFeaturesByCategory("support"),
                      ...getFeaturesByCategory("consulting"),
                    ].map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedFeature(feature.id)}
                      >
                        <div className="p-2 rounded-lg bg-orange-500/10">
                          <feature.icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          {feature.status === "premium" && (
                            <Badge variant="secondary" className="mt-2">
                              {feature.tier === "enterprise_elite"
                                ? "Elite Only"
                                : "Pro+"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Quick Access CTA */}
        {!selectedFeature && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Ready to Maximize Your Tax Technology ROI?
              </CardTitle>
              <CardDescription>
                You have access to all enterprise features. Click on any feature
                above to explore its full capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={() => setSelectedFeature("ai_tax_optimization")}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Explore AI Features
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFeature("dedicated_support")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFeature("quarterly_reviews")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
