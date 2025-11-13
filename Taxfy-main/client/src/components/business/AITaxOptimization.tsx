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
  Brain,
  TrendingUp,
  Target,
  Zap,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  BarChart3,
  Calculator,
  FileText,
  Lightbulb,
  Award,
  RefreshCw,
  Download,
  Eye,
  ArrowRight,
} from "lucide-react";

interface TaxOptimization {
  id: string;
  category: string;
  description: string;
  potentialSaving: number;
  confidence: number;
  impact: "high" | "medium" | "low";
  status: "identified" | "applied" | "pending";
  details: string[];
  aiRecommendation: string;
}

interface OptimizationScenario {
  name: string;
  description: string;
  currentTax: number;
  optimizedTax: number;
  savings: number;
  confidence: number;
  recommendations: string[];
}

export default function AITaxOptimization() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState(0);

  // Mock AI optimization data
  const optimizations: TaxOptimization[] = [
    {
      id: "1",
      category: "Medical Aid Tax Credits",
      description:
        "Additional medical aid contributions can reduce your tax liability",
      potentialSaving: 15420,
      confidence: 94,
      impact: "high",
      status: "identified",
      details: [
        "Increase medical aid contribution by R500/month",
        "Add additional medical insurance coverage",
        "Include dependant medical aid contributions",
      ],
      aiRecommendation:
        "Based on your income level and current medical aid, increasing your contribution by R500/month would save R15,420 annually in tax.",
    },
    {
      id: "2",
      category: "Retirement Annuity Optimization",
      description:
        "Maximize retirement annuity contributions for tax efficiency",
      potentialSaving: 28750,
      confidence: 97,
      impact: "high",
      status: "identified",
      details: [
        "Increase RA contribution to 27.5% of income limit",
        "Optimize contribution timing for maximum benefit",
        "Consider additional voluntary contributions",
      ],
      aiRecommendation:
        "You can contribute an additional R4,200/month to your RA, saving R28,750 in tax while securing your retirement.",
    },
    {
      id: "3",
      category: "Travel Allowance Optimization",
      description:
        "Optimize travel allowance claims based on actual business usage",
      potentialSaving: 8950,
      confidence: 89,
      impact: "medium",
      status: "applied",
      details: [
        "Detailed logbook maintenance for business travel",
        "Accurate fuel and maintenance cost tracking",
        "Optimize private vs business usage ratio",
      ],
      aiRecommendation:
        "Maintaining detailed travel records can increase your allowable deductions by 15%, saving R8,950 annually.",
    },
    {
      id: "4",
      category: "Investment Income Structuring",
      description: "Restructure investments for optimal tax efficiency",
      potentialSaving: 12300,
      confidence: 85,
      impact: "medium",
      status: "pending",
      details: [
        "Consider tax-free savings accounts",
        "Optimize capital gains vs dividends",
        "Time investment disposals strategically",
      ],
      aiRecommendation:
        "Restructuring your investment portfolio could reduce your investment tax liability by R12,300 annually.",
    },
    {
      id: "5",
      category: "Home Office Deductions",
      description: "Maximize home office expense deductions for remote work",
      potentialSaving: 6780,
      confidence: 91,
      impact: "medium",
      status: "identified",
      details: [
        "Calculate accurate home office area percentage",
        "Include all allowable office expenses",
        "Optimize equipment depreciation claims",
      ],
      aiRecommendation:
        "Your home office setup qualifies for R6,780 in additional annual deductions based on current usage patterns.",
    },
  ];

  const scenarios: OptimizationScenario[] = [
    {
      name: "Conservative Optimization",
      description: "Low-risk optimizations with high confidence levels",
      currentTax: 145000,
      optimizedTax: 116830,
      savings: 28170,
      confidence: 96,
      recommendations: [
        "Increase medical aid contributions",
        "Optimize retirement annuity contributions",
        "Implement home office deductions",
      ],
    },
    {
      name: "Balanced Optimization",
      description: "Moderate risk with balanced savings approach",
      currentTax: 145000,
      optimizedTax: 98750,
      savings: 46250,
      confidence: 89,
      recommendations: [
        "All conservative optimizations",
        "Investment income restructuring",
        "Advanced travel allowance optimization",
        "Strategic timing of deductions",
      ],
    },
    {
      name: "Aggressive Optimization",
      description: "Maximum tax savings with advanced strategies",
      currentTax: 145000,
      optimizedTax: 72800,
      savings: 72200,
      confidence: 82,
      recommendations: [
        "All balanced optimizations",
        "Corporate structure considerations",
        "Advanced investment vehicles",
        "International tax planning strategies",
      ],
    },
  ];

  const totalSavings = optimizations.reduce(
    (sum, opt) => sum + opt.potentialSaving,
    0,
  );
  const averageConfidence =
    optimizations.reduce((sum, opt) => sum + opt.confidence, 0) /
    optimizations.length;

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  AI Tax Optimization Engine
                </CardTitle>
                <CardDescription className="text-lg">
                  Advanced AI algorithms analyze your tax situation and identify
                  optimization opportunities
                </CardDescription>
              </div>
            </div>
            <Button onClick={runAIAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-medium">AI Analysis in Progress...</span>
              </div>
              <Progress value={67} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Analyzing tax data, identifying optimization opportunities, and
                calculating potential savings...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisComplete && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Potential Savings
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R{totalSavings.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Annually through AI optimization
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  AI Confidence
                </CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {averageConfidence.toFixed(0)}%
                </div>
                <Progress value={averageConfidence} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Optimizations Found
                </CardTitle>
                <Lightbulb className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{optimizations.length}</div>
                <p className="text-xs text-muted-foreground">
                  AI-identified opportunities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Implementation Status
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    optimizations.filter((opt) => opt.status === "applied")
                      .length
                  }
                  /{optimizations.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimizations applied
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Tabs */}
          <Tabs defaultValue="opportunities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities" className="space-y-4">
              {optimizations.map((optimization) => (
                <Card key={optimization.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            optimization.impact === "high"
                              ? "bg-green-500/10"
                              : optimization.impact === "medium"
                                ? "bg-yellow-500/10"
                                : "bg-blue-500/10"
                          }`}
                        >
                          {optimization.impact === "high" && (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          )}
                          {optimization.impact === "medium" && (
                            <BarChart3 className="h-5 w-5 text-yellow-600" />
                          )}
                          {optimization.impact === "low" && (
                            <Info className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {optimization.category}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {optimization.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          R{optimization.potentialSaving.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              optimization.status === "applied"
                                ? "default"
                                : optimization.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {optimization.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {optimization.confidence}% confident
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary" />
                          AI Recommendation
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {optimization.aiRecommendation}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Implementation Steps:
                        </h4>
                        <ul className="space-y-1">
                          {optimization.details.map((detail, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={
                            optimization.status === "applied"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {optimization.status === "applied"
                            ? "Applied"
                            : "Apply Optimization"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {scenarios.map((scenario, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedScenario === index
                        ? "border-primary ring-2 ring-primary/20"
                        : ""
                    }`}
                    onClick={() => setSelectedScenario(index)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {index === 0 && (
                          <Shield className="h-5 w-5 text-green-600" />
                        )}
                        {index === 1 && (
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                        )}
                        {index === 2 && (
                          <Zap className="h-5 w-5 text-purple-600" />
                        )}
                        {scenario.name}
                      </CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Current Tax:
                          </span>
                          <span className="font-medium">
                            R{scenario.currentTax.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Optimized Tax:
                          </span>
                          <span className="font-medium text-green-600">
                            R{scenario.optimizedTax.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Annual Savings:</span>
                          <span className="font-bold text-green-600">
                            R{scenario.savings.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            AI Confidence:
                          </span>
                          <span className="text-sm font-medium">
                            {scenario.confidence}%
                          </span>
                        </div>
                        <Progress value={scenario.confidence} className="h-2" />
                      </div>

                      <Button
                        className="w-full"
                        variant={
                          selectedScenario === index ? "default" : "outline"
                        }
                        size="sm"
                      >
                        {selectedScenario === index
                          ? "Selected"
                          : "Select Scenario"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Scenario Details */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Recommended Actions for {scenarios[selectedScenario].name}
                  </CardTitle>
                  <CardDescription>
                    Implementation roadmap to achieve R
                    {scenarios[selectedScenario].savings.toLocaleString()} in
                    annual savings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scenarios[selectedScenario].recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium">{recommendation}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Implement This Scenario
                    </Button>
                    <Button variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Detailed Calculation
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      AI Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          High Confidence Findings
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Our AI identified R{totalSavings.toLocaleString()} in
                        potential annual savings with
                        {averageConfidence.toFixed(0)}% average confidence. The
                        highest impact optimizations are in retirement
                        contributions and medical aid structuring.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          Market Comparison
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Based on similar taxpayer profiles, you're currently in
                        the 75th percentile for tax efficiency. Implementing our
                        recommendations would move you to the 95th percentile.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">
                          Risk Assessment
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        All recommended optimizations comply with current SARS
                        regulations. Conservative strategies carry minimal audit
                        risk, while aggressive strategies should be reviewed
                        with a tax professional.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Optimization Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          period: "Immediate (0-30 days)",
                          saving: 15420,
                          actions: "Medical aid optimization, RA contributions",
                        },
                        {
                          period: "Short term (1-3 months)",
                          saving: 28750,
                          actions:
                            "Investment restructuring, home office setup",
                        },
                        {
                          period: "Medium term (3-6 months)",
                          saving: 46250,
                          actions: "Advanced deductions, travel optimization",
                        },
                        {
                          period: "Long term (6-12 months)",
                          saving: 72200,
                          actions:
                            "Corporate structure, international planning",
                        },
                      ].map((timeline, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg border"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                            <span className="text-xs font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{timeline.period}</div>
                            <div className="text-sm text-muted-foreground">
                              {timeline.actions}
                            </div>
                            <div className="text-lg font-bold text-green-600 mt-1">
                              R{timeline.saving.toLocaleString()} potential
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
