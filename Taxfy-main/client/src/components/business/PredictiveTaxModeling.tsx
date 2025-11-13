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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Brain,
  Target,
  BarChart3,
  DollarSign,
  Calendar,
  Settings,
  Download,
  Play,
  Pause,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Eye,
  Calculator,
  LineChart,
  PieChart,
  Zap,
  Globe,
  Award,
  Clock,
  Users,
  Building,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Info,
  Filter,
  Search,
} from "lucide-react";

interface TaxScenario {
  id: string;
  name: string;
  description: string;
  probability: number;
  timeframe: string;
  projectedTax: number;
  currentTax: number;
  difference: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
}

interface PredictiveInsight {
  id: string;
  category: string;
  insight: string;
  impact: "positive" | "negative" | "neutral";
  confidence: number;
  timeframe: string;
  financialImpact: number;
  actionRequired: boolean;
  priority: "high" | "medium" | "low";
}

interface ModelingParameter {
  id: string;
  name: string;
  category: string;
  currentValue: number | string;
  projectedValue: number | string;
  impact: number;
  source: "historical" | "external" | "regulatory" | "market";
  lastUpdated: Date;
  trend: "increasing" | "decreasing" | "stable";
}

export default function PredictiveTaxModeling() {
  const [isRunningModel, setIsRunningModel] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("12_months");
  const [modelAccuracy, setModelAccuracy] = useState(94.2);

  // Mock predictive data
  const taxScenarios: TaxScenario[] = [
    {
      id: "scenario_001",
      name: "Conservative Growth Scenario",
      description:
        "Based on current economic trends and conservative growth assumptions",
      probability: 68,
      timeframe: "12 months",
      projectedTax: 142500,
      currentTax: 135000,
      difference: 7500,
      confidence: 92,
      factors: [
        "GDP growth of 2.1%",
        "Inflation rate at 5.2%",
        "Current income growth trends",
        "Historical tax bracket changes",
      ],
      recommendations: [
        "Increase retirement contributions by R1,200/month",
        "Consider medical aid optimization",
        "Review investment portfolio allocation",
      ],
      riskLevel: "low",
    },
    {
      id: "scenario_002",
      name: "Economic Downturn Scenario",
      description:
        "Modeling potential economic challenges and their tax implications",
      probability: 23,
      timeframe: "12 months",
      projectedTax: 118750,
      currentTax: 135000,
      difference: -16250,
      confidence: 87,
      factors: [
        "Economic recession probability",
        "Potential income reduction",
        "Government stimulus measures",
        "Tax relief programs",
      ],
      recommendations: [
        "Maintain current retirement contributions",
        "Build emergency tax reserve",
        "Monitor for tax relief opportunities",
      ],
      riskLevel: "medium",
    },
    {
      id: "scenario_003",
      name: "High Growth Scenario",
      description:
        "Optimistic growth scenario with increased earning potential",
      probability: 45,
      timeframe: "12 months",
      projectedTax: 168900,
      currentTax: 135000,
      difference: 33900,
      confidence: 78,
      factors: [
        "Strong economic growth (4.5%)",
        "Salary increases above inflation",
        "Investment portfolio gains",
        "Bonus income projections",
      ],
      recommendations: [
        "Maximize retirement annuity contributions",
        "Consider tax-efficient investment structures",
        "Explore income smoothing strategies",
      ],
      riskLevel: "medium",
    },
    {
      id: "scenario_004",
      name: "Regulatory Change Scenario",
      description: "Impact of potential tax law changes and new regulations",
      probability: 34,
      timeframe: "24 months",
      projectedTax: 158600,
      currentTax: 135000,
      difference: 23600,
      confidence: 71,
      factors: [
        "Proposed tax bracket adjustments",
        "New wealth tax considerations",
        "Digital tax implementations",
        "Carbon tax expansions",
      ],
      recommendations: [
        "Prepare for higher tax rates",
        "Review compliance requirements",
        "Consider restructuring strategies",
      ],
      riskLevel: "high",
    },
  ];

  const predictiveInsights: PredictiveInsight[] = [
    {
      id: "insight_001",
      category: "Tax Optimization",
      insight:
        "AI models predict 15% additional savings through strategic timing of deductions",
      impact: "positive",
      confidence: 89,
      timeframe: "6 months",
      financialImpact: 18500,
      actionRequired: true,
      priority: "high",
    },
    {
      id: "insight_002",
      category: "Regulatory Risk",
      insight:
        "High probability of capital gains tax rate increase in next 18 months",
      impact: "negative",
      confidence: 76,
      timeframe: "18 months",
      financialImpact: -12300,
      actionRequired: true,
      priority: "medium",
    },
    {
      id: "insight_003",
      category: "Market Trends",
      insight:
        "Investment income optimization could yield 8% tax efficiency improvement",
      impact: "positive",
      confidence: 82,
      timeframe: "12 months",
      financialImpact: 9750,
      actionRequired: false,
      priority: "medium",
    },
    {
      id: "insight_004",
      category: "Compliance",
      insight:
        "New reporting requirements will affect 23% of current processes",
      impact: "neutral",
      confidence: 94,
      timeframe: "9 months",
      financialImpact: 0,
      actionRequired: true,
      priority: "high",
    },
  ];

  const modelingParameters: ModelingParameter[] = [
    {
      id: "param_001",
      name: "GDP Growth Rate",
      category: "Economic Indicators",
      currentValue: "2.1%",
      projectedValue: "2.8%",
      impact: 15,
      source: "external",
      lastUpdated: new Date(),
      trend: "increasing",
    },
    {
      id: "param_002",
      name: "Inflation Rate",
      category: "Economic Indicators",
      currentValue: "5.2%",
      projectedValue: "4.9%",
      impact: 12,
      source: "external",
      lastUpdated: new Date(),
      trend: "decreasing",
    },
    {
      id: "param_003",
      name: "Average Income Growth",
      category: "Income Factors",
      currentValue: "6.5%",
      projectedValue: "7.2%",
      impact: 28,
      source: "historical",
      lastUpdated: new Date(),
      trend: "increasing",
    },
    {
      id: "param_004",
      name: "Tax Bracket Threshold",
      category: "Regulatory",
      currentValue: "R500,000",
      projectedValue: "R520,000",
      impact: 22,
      source: "regulatory",
      lastUpdated: new Date(),
      trend: "increasing",
    },
    {
      id: "param_005",
      name: "Investment Returns",
      category: "Market Factors",
      currentValue: "8.3%",
      projectedValue: "9.1%",
      impact: 18,
      source: "market",
      lastUpdated: new Date(),
      trend: "increasing",
    },
  ];

  const runPredictiveModel = () => {
    setIsRunningModel(true);
    setTimeout(() => {
      setIsRunningModel(false);
      setModelAccuracy(94.2 + Math.random() * 2);
    }, 5000);
  };

  const mostLikelyScenario = taxScenarios.reduce((max, scenario) =>
    scenario.probability > max.probability ? scenario : max,
  );

  const totalPositiveImpact = predictiveInsights
    .filter((insight) => insight.impact === "positive")
    .reduce((sum, insight) => sum + insight.financialImpact, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Predictive Tax Modeling
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Enterprise Elite
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  AI-powered predictive analytics for strategic tax planning and
                  forecasting
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Model Accuracy: {modelAccuracy.toFixed(1)}%
              </div>
              <Button onClick={runPredictiveModel} disabled={isRunningModel}>
                {isRunningModel ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Model...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Prediction
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Model Status */}
      {isRunningModel && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
                <span className="font-medium">
                  AI Predictive Model Running...
                </span>
              </div>
              <Progress value={75} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Analyzing historical data, economic indicators, and regulatory
                trends...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Likely Scenario
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostLikelyScenario.probability}%
            </div>
            <p className="text-xs text-muted-foreground">
              {mostLikelyScenario.name}
            </p>
            <div className="mt-2">
              <Badge
                variant={
                  mostLikelyScenario.riskLevel === "low"
                    ? "outline"
                    : "secondary"
                }
              >
                {mostLikelyScenario.riskLevel} risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projected Tax Impact
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                mostLikelyScenario.difference >= 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {mostLikelyScenario.difference >= 0 ? "+" : ""}R
              {mostLikelyScenario.difference.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              vs current tax liability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Optimization Potential
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R{totalPositiveImpact.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {predictiveInsights.filter((i) => i.impact === "positive").length}{" "}
              opportunities identified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Model Confidence
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mostLikelyScenario.confidence}%
            </div>
            <Progress value={mostLikelyScenario.confidence} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenarios">Tax Scenarios</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="parameters">Model Parameters</TabsTrigger>
          <TabsTrigger value="reports">Forecasting Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Time Horizon:</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="6_months">6 Months</option>
                <option value="12_months">12 Months</option>
                <option value="24_months">24 Months</option>
                <option value="36_months">36 Months</option>
              </select>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Model Settings
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Scenarios
            </Button>
          </div>

          {taxScenarios.map((scenario) => (
            <Card key={scenario.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        scenario.riskLevel === "low"
                          ? "bg-green-500/10"
                          : scenario.riskLevel === "medium"
                            ? "bg-yellow-500/10"
                            : "bg-red-500/10"
                      }`}
                    >
                      {scenario.riskLevel === "low" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {scenario.riskLevel === "medium" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      {scenario.riskLevel === "high" && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {scenario.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {scenario.probability}%
                    </div>
                    <Badge variant="outline">{scenario.timeframe}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Current Tax Liability
                    </div>
                    <div className="text-xl font-bold">
                      R{scenario.currentTax.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Projected Tax Liability
                    </div>
                    <div className="text-xl font-bold">
                      R{scenario.projectedTax.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Difference
                    </div>
                    <div
                      className={`text-xl font-bold flex items-center gap-1 ${
                        scenario.difference >= 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {scenario.difference >= 0 ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      {scenario.difference >= 0 ? "+" : ""}R
                      {scenario.difference.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Factors:</h4>
                    <ul className="space-y-1">
                      {scenario.factors.map((factor, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <Info className="h-3 w-3 text-blue-600" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      AI Recommendations:
                    </h4>
                    <ul className="space-y-1">
                      {scenario.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <Lightbulb className="h-3 w-3 text-yellow-600" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Model Confidence:
                    </span>
                    <span className="font-medium">{scenario.confidence}%</span>
                    <Progress
                      value={scenario.confidence}
                      className="w-20 h-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calculator className="h-3 w-3 mr-2" />
                      Run Simulation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search insights..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Category
            </Button>
          </div>

          {predictiveInsights.map((insight) => (
            <Card
              key={insight.id}
              className={`relative ${
                insight.priority === "high"
                  ? "border-red-500/20"
                  : insight.priority === "medium"
                    ? "border-yellow-500/20"
                    : "border-green-500/20"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        insight.impact === "positive"
                          ? "bg-green-500/10"
                          : insight.impact === "negative"
                            ? "bg-red-500/10"
                            : "bg-blue-500/10"
                      }`}
                    >
                      {insight.impact === "positive" && (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      )}
                      {insight.impact === "negative" && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      {insight.impact === "neutral" && (
                        <Info className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{insight.category}</Badge>
                        <Badge
                          variant={
                            insight.priority === "high"
                              ? "destructive"
                              : insight.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {insight.priority} priority
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {insight.insight}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="text-right">
                    {insight.financialImpact !== 0 && (
                      <div
                        className={`text-xl font-bold ${
                          insight.financialImpact > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {insight.financialImpact > 0 ? "+" : ""}R
                        {insight.financialImpact.toLocaleString()}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {insight.timeframe}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Confidence:
                      </span>
                      <span className="font-medium">{insight.confidence}%</span>
                      <Progress
                        value={insight.confidence}
                        className="w-16 h-2"
                      />
                    </div>
                    {insight.actionRequired && (
                      <Badge variant="secondary">Action Required</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      View Analysis
                    </Button>
                    {insight.actionRequired && (
                      <Button size="sm">Take Action</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Parameters & Data Sources</CardTitle>
              <CardDescription>
                Variables and data sources used in predictive modeling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelingParameters.map((param) => (
                  <div
                    key={param.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{param.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {param.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Current
                        </div>
                        <div className="font-medium">{param.currentValue}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Projected
                        </div>
                        <div className="font-medium">
                          {param.projectedValue}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Impact
                        </div>
                        <div className="font-medium">{param.impact}%</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{param.source}</Badge>
                        {param.trend === "increasing" && (
                          <ArrowUp className="h-3 w-3 text-green-600" />
                        )}
                        {param.trend === "decreasing" && (
                          <ArrowDown className="h-3 w-3 text-red-600" />
                        )}
                        {param.trend === "stable" && (
                          <div className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Source Reliability</CardTitle>
              <CardDescription>
                Reliability and freshness of data sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    source: "Historical Data",
                    reliability: 96,
                    lastUpdate: "2 hours ago",
                  },
                  {
                    source: "Economic Indicators",
                    reliability: 89,
                    lastUpdate: "4 hours ago",
                  },
                  {
                    source: "Regulatory Updates",
                    reliability: 94,
                    lastUpdate: "1 day ago",
                  },
                  {
                    source: "Market Data",
                    reliability: 91,
                    lastUpdate: "1 hour ago",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg border"
                  >
                    <div className="font-medium">{item.source}</div>
                    <div className="text-2xl font-bold text-green-600 my-2">
                      {item.reliability}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.lastUpdate}
                    </div>
                    <Progress value={item.reliability} className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Trend Analysis Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive trend analysis with 24-month projections
                </p>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Scenario Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Side-by-side comparison of all predictive scenarios
                </p>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Comparison
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  High-level executive summary with key insights
                </p>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Create Summary
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historical Model Performance</CardTitle>
              <CardDescription>
                Track record of predictive accuracy over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    period: "Q4 2024",
                    prediction: "R142,500",
                    actual: "R144,200",
                    accuracy: 98.8,
                  },
                  {
                    period: "Q3 2024",
                    prediction: "R138,900",
                    actual: "R135,600",
                    accuracy: 97.6,
                  },
                  {
                    period: "Q2 2024",
                    prediction: "R131,200",
                    actual: "R128,900",
                    accuracy: 98.2,
                  },
                  {
                    period: "Q1 2024",
                    prediction: "R145,800",
                    actual: "R142,100",
                    accuracy: 97.4,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{item.period}</span>
                      <span className="text-sm text-muted-foreground">
                        Predicted: {item.prediction} | Actual: {item.actual}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-600">
                        {item.accuracy}%
                      </span>
                      <Progress value={item.accuracy} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
