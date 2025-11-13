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
import { Link } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Globe,
  Brain,
  Shield,
  Zap,
  Building,
  Crown,
  Sparkles,
  BarChart3,
  Network,
  Workflow,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Calendar,
  Eye,
  Lock,
  Layers,
  Bot,
  Star,
  Activity,
  FileCheck,
  Database,
  Settings,
  Headphones,
  RefreshCw,
} from "lucide-react";

import EnterpriseValueProposition from "@/components/business/EnterpriseValueProposition";

interface RevenueStream {
  name: string;
  description: string;
  currentRevenue: number;
  projectedRevenue: number;
  growth: number;
  icon: React.ComponentType<any>;
  category: "subscription" | "services" | "partnerships" | "api";
}

interface MarketSegment {
  name: string;
  size: string;
  target: number;
  revenue: number;
  cac: number;
  ltv: number;
  description: string;
  icon: React.ComponentType<any>;
}

export default function BusinessStrategy() {
  const [activeTab, setActiveTab] = useState("overview");

  const revenueStreams: RevenueStream[] = [
    {
      name: "Individual Subscriptions",
      description: "Starter plan subscriptions for individual taxpayers",
      currentRevenue: 3200000,
      projectedRevenue: 5800000,
      growth: 81,
      icon: Users,
      category: "subscription",
    },
    {
      name: "Professional Subscriptions",
      description: "Professional plan for tax practitioners and small firms",
      currentRevenue: 18500000,
      projectedRevenue: 28500000,
      growth: 54,
      icon: Building,
      category: "subscription",
    },
    {
      name: "Enterprise Subscriptions",
      description: "Enterprise, Pro, and Elite plans for large organizations",
      currentRevenue: 12800000,
      projectedRevenue: 35200000,
      growth: 175,
      icon: Crown,
      category: "subscription",
    },
    {
      name: "API Revenue",
      description: "Usage-based API revenue from integrations",
      currentRevenue: 2100000,
      projectedRevenue: 8500000,
      growth: 305,
      icon: Network,
      category: "api",
    },
    {
      name: "Consulting Services",
      description: "Expert tax consulting at R1,500/hour",
      currentRevenue: 0,
      projectedRevenue: 15000000,
      growth: 0,
      icon: Brain,
      category: "services",
    },
    {
      name: "White-Label Licensing",
      description: "White-label platform licensing to banks and fintechs",
      currentRevenue: 0,
      projectedRevenue: 25000000,
      growth: 0,
      icon: Layers,
      category: "partnerships",
    },
    {
      name: "Compliance-as-a-Service",
      description: "Ongoing compliance monitoring for enterprises",
      currentRevenue: 0,
      projectedRevenue: 30000000,
      growth: 0,
      icon: Shield,
      category: "services",
    },
  ];

  const marketSegments: MarketSegment[] = [
    {
      name: "Individual Taxpayers",
      size: "7.2M registered",
      target: 30,
      revenue: 216000000,
      cac: 45,
      ltv: 1680,
      description: "Working professionals, contractors, and individuals",
      icon: Users,
    },
    {
      name: "Tax Practitioners",
      size: "12,500 active",
      target: 50,
      revenue: 360000000,
      cac: 680,
      ltv: 32400,
      description: "Tax consultants, accountants, and small firms",
      icon: Award,
    },
    {
      name: "Enterprise Clients",
      size: "2,800 firms",
      target: 15,
      revenue: 108000000,
      cac: 3200,
      ltv: 500000,
      description: "Large corporations and accounting firms",
      icon: Building,
    },
    {
      name: "API Developers",
      size: "450 companies",
      target: 5,
      revenue: 36000000,
      cac: 850,
      ltv: 72000,
      description: "Fintech companies and software developers",
      icon: Bot,
    },
  ];

  const totalCurrentRevenue = revenueStreams.reduce(
    (sum, stream) => sum + stream.currentRevenue,
    0,
  );
  const totalProjectedRevenue = revenueStreams.reduce(
    (sum, stream) => sum + stream.projectedRevenue,
    0,
  );
  const overallGrowth = (
    ((totalProjectedRevenue - totalCurrentRevenue) / totalCurrentRevenue) *
    100
  ).toFixed(0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-primary text-primary-foreground">
            Enhanced Business Model 2025
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            Strategic Revenue Maximization Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From R36.6M to R93.8M annual revenue through premium enterprise
            features, AI optimization, and strategic partnerships
          </p>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R{(totalCurrentRevenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">Baseline model</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Enhanced Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R{(totalProjectedRevenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Enhanced model target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                +{overallGrowth}%
              </div>
              <p className="text-xs text-muted-foreground">Year 1 growth</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Revenue</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                R
                {(
                  (totalProjectedRevenue - totalCurrentRevenue) /
                  1000000
                ).toFixed(1)}
                M
              </div>
              <p className="text-xs text-muted-foreground">
                Additional revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Business Model Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Streams</TabsTrigger>
            <TabsTrigger value="markets">Market Segments</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise Value</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth by Category</CardTitle>
                <CardDescription>
                  Projected revenue growth across different business segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <stream.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{stream.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            R{(stream.projectedRevenue / 1000000).toFixed(1)}M
                          </div>
                          {stream.growth > 0 && (
                            <div className="text-sm text-green-600">
                              +{stream.growth}%
                            </div>
                          )}
                          {stream.growth === 0 &&
                            stream.projectedRevenue > 0 && (
                              <div className="text-sm text-purple-600">New</div>
                            )}
                        </div>
                      </div>
                      <Progress
                        value={
                          (stream.projectedRevenue / totalProjectedRevenue) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Premium Positioning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Enterprise Pro (R3,499/mo)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Enterprise Elite (R6,999/mo)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      AI-powered optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Dedicated infrastructure
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Strategic Partnerships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Banking partnerships (R24M)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      ERP integrations (R37M)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      White-label licensing (R25M)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      SARS direct partnership
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Market Expansion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      SADC region (R45M Year 2)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      East Africa (R60M Year 3)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      West Africa (R120M Year 4)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Industry specialization
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {revenueStreams.map((stream, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <stream.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{stream.name}</CardTitle>
                        <Badge variant="outline">{stream.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{stream.description}</CardDescription>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Current
                        </div>
                        <div className="text-lg font-bold">
                          R{(stream.currentRevenue / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Projected
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          R{(stream.projectedRevenue / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>

                    {stream.growth > 0 && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          +{stream.growth}% growth
                        </span>
                      </div>
                    )}

                    {stream.growth === 0 && stream.projectedRevenue > 0 && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-600 font-medium">
                          New revenue stream
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketSegments.map((segment, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <segment.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {segment.name}
                        </CardTitle>
                        <CardDescription>{segment.size}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {segment.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Market Share Target
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {segment.target}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Revenue Potential
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          R{(segment.revenue / 1000000).toFixed(0)}M
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <div className="text-sm text-muted-foreground">CAC</div>
                        <div className="font-semibold">
                          R{segment.cac.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">LTV</div>
                        <div className="font-semibold">
                          R{segment.ltv.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground">
                        LTV:CAC Ratio
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {(segment.ltv / segment.cac).toFixed(0)}:1
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-6">
            <EnterpriseValueProposition />
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="space-y-8">
              {[
                {
                  quarter: "Q1 2025: Foundation Enhancement",
                  items: [
                    "Launch Enterprise Pro tier (R3,499/mo)",
                    "Implement AI tax optimization engine",
                    "Launch white-label licensing program",
                    "Begin SARS direct integration pilot",
                  ],
                  status: "in-progress",
                  revenue: "15M",
                },
                {
                  quarter: "Q2 2025: Market Expansion",
                  items: [
                    "Launch Enterprise Elite tier (R6,999/mo)",
                    "Implement Compliance-as-a-Service platform",
                    "Begin SADC expansion planning",
                    "Launch tax expert consulting services",
                  ],
                  status: "planned",
                  revenue: "35M",
                },
                {
                  quarter: "Q3 2025: Partnership Acceleration",
                  items: [
                    "Complete major banking partnerships",
                    "Launch industry specialization packages",
                    "Implement blockchain audit trail",
                    "Begin government partnerships",
                  ],
                  status: "planned",
                  revenue: "60M",
                },
                {
                  quarter: "Q4 2025: Scale & Optimize",
                  items: [
                    "Full SADC market entry",
                    "Launch customer success programs",
                    "Implement advanced analytics platform",
                    "Prepare for 2026 international expansion",
                  ],
                  status: "planned",
                  revenue: "93M",
                },
              ].map((phase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            phase.status === "in-progress"
                              ? "bg-green-500"
                              : "bg-muted-foreground"
                          }`}
                        />
                        {phase.quarter}
                      </CardTitle>
                      <Badge variant="outline">R{phase.revenue} target</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Ready to Implement This Strategy?
            </CardTitle>
            <CardDescription className="text-lg">
              Let's discuss how to transform your tax technology business with
              these enhanced revenue models
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <Link to="/pricing">
                <Button size="lg">
                  View Enhanced Pricing
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/business-dashboard">
                <Button variant="outline" size="lg">
                  <Building className="h-4 w-4 mr-2" />
                  Business Dashboard
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              See how these features translate to real business value
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
