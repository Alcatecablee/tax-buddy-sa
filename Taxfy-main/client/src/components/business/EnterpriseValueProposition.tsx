import React, { useState } from "react";
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
import {
  Brain,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  BarChart3,
  Globe,
  Lock,
  Workflow,
  Phone,
  Crown,
  Star,
  Building2,
  Layers,
  Network,
  Database,
  CloudCog,
  Bot,
  Eye,
  Blocks,
  Calendar,
  Headphones,
  RefreshCw,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

interface ROIMetric {
  category: string;
  description: string;
  value: string;
  icon: React.ComponentType<any>;
  tier: "pro" | "enterprise_pro" | "enterprise_elite";
}

interface BusinessCase {
  title: string;
  description: string;
  benefits: string[];
  roi: string;
  timeToValue: string;
  icon: React.ComponentType<any>;
}

export default function EnterpriseValueProposition() {
  const [selectedROITier, setSelectedROITier] = useState<
    "pro" | "enterprise_pro" | "enterprise_elite"
  >("enterprise_pro");

  const roiMetrics: ROIMetric[] = [
    {
      category: "Time Savings",
      description: "Reduce tax processing time by 85%",
      value: "340 hours/month saved",
      icon: Clock,
      tier: "pro",
    },
    {
      category: "Cost Reduction",
      description: "Lower operational costs through automation",
      value: "R450,000 annually",
      icon: DollarSign,
      tier: "pro",
    },
    {
      category: "Accuracy Improvement",
      description: "AI-powered validation reduces errors",
      value: "99.7% accuracy rate",
      icon: Target,
      tier: "pro",
    },
    {
      category: "AI Tax Optimization",
      description: "Advanced AI identifies additional savings",
      value: "R850,000 additional refunds",
      icon: Brain,
      tier: "enterprise_pro",
    },
    {
      category: "Compliance Automation",
      description: "Automated compliance monitoring",
      value: "95% reduction in violations",
      icon: Shield,
      tier: "enterprise_pro",
    },
    {
      category: "Scale Efficiency",
      description: "Process unlimited documents instantly",
      value: "10,000+ docs/hour",
      icon: Zap,
      tier: "enterprise_pro",
    },
    {
      category: "Predictive Analytics",
      description: "AI predicts tax liabilities and opportunities",
      value: "R1.2M additional savings",
      icon: TrendingUp,
      tier: "enterprise_elite",
    },
    {
      category: "Custom Frameworks",
      description: "Tailored compliance for your industry",
      value: "100% regulatory compliance",
      icon: Award,
      tier: "enterprise_elite",
    },
    {
      category: "White-Label Revenue",
      description: "Generate revenue from white-label licensing",
      value: "R2.4M new revenue stream",
      icon: Crown,
      tier: "enterprise_elite",
    },
  ];

  const businessCases: BusinessCase[] = [
    {
      title: "Large Accounting Firm",
      description:
        "Process 50,000+ tax returns annually with 95% efficiency improvement",
      benefits: [
        "Reduce processing time from 2 hours to 10 minutes per return",
        "Increase accuracy from 92% to 99.7%",
        "Scale operations without hiring additional staff",
        "Generate R5M additional revenue through efficiency gains",
      ],
      roi: "485% ROI in Year 1",
      timeToValue: "30 days",
      icon: Building2,
    },
    {
      title: "Multinational Corporation",
      description: "Streamline global tax compliance across 15 countries",
      benefits: [
        "Centralized tax management across all entities",
        "Real-time compliance monitoring",
        "Automated regulatory change management",
        "Reduce compliance costs by 70%",
      ],
      roi: "320% ROI in Year 1",
      timeToValue: "60 days",
      icon: Globe,
    },
    {
      title: "Government Agency",
      description: "Process citizen tax returns with enterprise-grade security",
      benefits: [
        "Handle millions of tax returns efficiently",
        "Blockchain-verified audit trails",
        "SOC 2 Type II compliance",
        "Reduce processing costs by 60%",
      ],
      roi: "275% ROI in Year 1",
      timeToValue: "90 days",
      icon: Shield,
    },
  ];

  const getMetricsByTier = (tier: typeof selectedROITier) => {
    const tierOrder = ["pro", "enterprise_pro", "enterprise_elite"];
    const selectedTierIndex = tierOrder.indexOf(tier);
    return roiMetrics.filter((metric) => {
      const metricTierIndex = tierOrder.indexOf(metric.tier);
      return metricTierIndex <= selectedTierIndex;
    });
  };

  const calculateTotalROI = (tier: typeof selectedROITier) => {
    const costs = {
      pro: 899 * 12, // R10,788 annually
      enterprise_pro: 3499 * 12, // R41,988 annually
      enterprise_elite: 6999 * 12, // R83,988 annually
    };

    const savings = {
      pro: 450000, // Base savings
      enterprise_pro: 450000 + 850000, // Base + AI optimization
      enterprise_elite: 450000 + 850000 + 1200000 + 2400000, // All savings
    };

    const cost = costs[tier];
    const saving = savings[tier];
    const roi = (((saving - cost) / cost) * 100).toFixed(0);

    return { cost, saving, roi };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Enterprise Value Proposition
        </Badge>
        <h2 className="text-3xl font-bold">
          Transform Your Tax Operations with Enterprise AI
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          See how our enterprise-grade platform delivers measurable ROI through
          advanced AI, automation, and dedicated infrastructure.
        </p>
      </div>

      {/* ROI Calculator */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            ROI Calculator by Tier
          </CardTitle>
          <CardDescription>
            Select your enterprise tier to see potential return on investment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tier Selection */}
          <div className="flex gap-4 justify-center">
            {[
              { id: "pro", name: "Professional", price: "R899/mo", icon: Star },
              {
                id: "enterprise_pro",
                name: "Enterprise Pro",
                price: "R3,499/mo",
                icon: Crown,
              },
              {
                id: "enterprise_elite",
                name: "Enterprise Elite",
                price: "R6,999/mo",
                icon: Sparkles,
              },
            ].map((tier) => (
              <Button
                key={tier.id}
                variant={selectedROITier === tier.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() =>
                  setSelectedROITier(tier.id as typeof selectedROITier)
                }
              >
                <tier.icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-semibold">{tier.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {tier.price}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* ROI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const { cost, saving, roi } = calculateTotalROI(selectedROITier);
              return (
                <>
                  <div className="text-center p-4 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-red-600">
                      R{cost.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Annual Investment
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-green-600">
                      R{saving.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Annual Savings
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-primary">
                      {roi}% ROI
                    </div>
                    <div className="text-sm text-muted-foreground">
                      First Year Return
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* ROI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getMetricsByTier(selectedROITier).map((metric, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg border bg-background"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <metric.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{metric.category}</div>
                  <div className="text-lg font-bold text-green-600">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Cases */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">
          Real-World Business Cases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessCases.map((businessCase, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <businessCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {businessCase.title}
                    </CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{businessCase.roi}</Badge>
                      <Badge variant="outline">
                        {businessCase.timeToValue}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{businessCase.description}</CardDescription>
                <div className="space-y-2">
                  {businessCase.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Feature Comparison</CardTitle>
          <CardDescription>
            Compare features across our enterprise tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Professional</th>
                  <th className="text-center p-4">Enterprise Pro</th>
                  <th className="text-center p-4">Enterprise Elite</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "AI Tax Optimization",
                    pro: false,
                    enterprisePro: true,
                    enterpriseElite: true,
                  },
                  {
                    feature: "Blockchain Audit Trail",
                    pro: false,
                    enterprisePro: true,
                    enterpriseElite: true,
                  },
                  {
                    feature: "Dedicated Infrastructure",
                    pro: false,
                    enterprisePro: true,
                    enterpriseElite: true,
                  },
                  {
                    feature: "24/7 Phone Support",
                    pro: false,
                    enterprisePro: true,
                    enterpriseElite: true,
                  },
                  {
                    feature: "Predictive Tax Modeling",
                    pro: false,
                    enterprisePro: false,
                    enterpriseElite: true,
                  },
                  {
                    feature: "White-Label Platform",
                    pro: false,
                    enterprisePro: false,
                    enterpriseElite: true,
                  },
                  {
                    feature: "Custom AI Training",
                    pro: false,
                    enterprisePro: false,
                    enterpriseElite: true,
                  },
                  {
                    feature: "Quarterly Business Reviews",
                    pro: false,
                    enterprisePro: false,
                    enterpriseElite: true,
                  },
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="text-center p-4">
                      {row.pro ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <div className="h-5 w-5 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row.enterprisePro ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <div className="h-5 w-5 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row.enterpriseElite ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <div className="h-5 w-5 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Implementation Timeline
          </CardTitle>
          <CardDescription>
            From setup to full value realization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                phase: "Week 1-2: Setup & Configuration",
                description:
                  "Initial setup, data migration, and basic configuration",
                icon: Settings,
                deliverables: [
                  "Account setup",
                  "User onboarding",
                  "Basic integration",
                ],
              },
              {
                phase: "Week 3-4: Integration & Training",
                description:
                  "ERP integration, custom workflows, and team training",
                icon: Network,
                deliverables: [
                  "ERP integration",
                  "Workflow setup",
                  "Team training",
                ],
              },
              {
                phase: "Week 5-8: Advanced Features",
                description:
                  "AI optimization, compliance frameworks, and automation",
                icon: Brain,
                deliverables: [
                  "AI setup",
                  "Compliance rules",
                  "Automation workflows",
                ],
              },
              {
                phase: "Week 9-12: Optimization & Scale",
                description:
                  "Performance tuning, advanced analytics, and full deployment",
                icon: TrendingUp,
                deliverables: [
                  "Performance optimization",
                  "Analytics setup",
                  "Full deployment",
                ],
              },
            ].map((phase, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <phase.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{phase.phase}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {phase.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {phase.deliverables.map((deliverable, deliverableIndex) => (
                      <Badge
                        key={deliverableIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Ready to Transform Your Tax Operations?
          </CardTitle>
          <CardDescription className="text-lg">
            Join leading enterprises who have already transformed their tax
            operations with our AI platform
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Button size="lg">
              Schedule Enterprise Demo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              <Phone className="h-4 w-4 mr-2" />
              Talk to Sales
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Get a personalized ROI assessment and implementation plan for your
            organization
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
