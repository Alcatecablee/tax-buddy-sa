import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  getCurrentTaxYear,
  getTaxYearInfo,
  formatTaxYear,
} from "@/lib/taxYearUtils";

interface TaxYearData {
  taxYear: string;
  grossIncome: number;
  taxPaid: number;
  refundDue: number;
  retirementContrib: number;
  medicalContrib: number;
  effectiveTaxRate: number;
}

interface ComparisonMetric {
  label: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "same";
  icon: React.ComponentType<{ className?: string }>;
}

interface TaxYearComparisonProps {
  currentYearData: TaxYearData;
  className?: string;
}

export const TaxYearComparison: React.FC<TaxYearComparisonProps> = React.memo(
  ({ currentYearData, className = "" }) => {
    const [previousYearData, setPreviousYearData] =
      useState<TaxYearData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [comparisonMetrics, setComparisonMetrics] = useState<
      ComparisonMetric[]
    >([]);

    useEffect(() => {
      loadPreviousYearData();
    }, [currentYearData]);

    const loadPreviousYearData = async () => {
      setIsLoading(true);

      // In a real app, this would fetch from your API/database
      // For now, we'll simulate with localStorage or generate sample data
      try {
        const storedData = localStorage.getItem("previousTaxYearData");
        let previousData: TaxYearData;

        if (storedData) {
          previousData = JSON.parse(storedData);
        } else {
          // Generate realistic previous year data for demonstration
          const currentYear = parseInt(currentYearData.taxYear);
          previousData = {
            taxYear: (currentYear - 1).toString(),
            grossIncome: currentYearData.grossIncome * 0.92, // 8% less income
            taxPaid: currentYearData.taxPaid * 0.88, // 12% less tax paid
            refundDue: currentYearData.refundDue * 0.75, // Smaller refund
            retirementContrib: currentYearData.retirementContrib * 0.85,
            medicalContrib: currentYearData.medicalContrib * 0.9,
            effectiveTaxRate: currentYearData.effectiveTaxRate + 0.02, // 2% higher rate
          };
        }

        setPreviousYearData(previousData);
        generateComparisons(currentYearData, previousData);
      } catch (error) {
        console.error("Error loading previous year data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const generateComparisons = (
      current: TaxYearData,
      previous: TaxYearData,
    ) => {
      const metrics: ComparisonMetric[] = [
        {
          label: "Gross Income",
          current: current.grossIncome,
          previous: previous.grossIncome,
          change: current.grossIncome - previous.grossIncome,
          changePercent:
            ((current.grossIncome - previous.grossIncome) /
              previous.grossIncome) *
            100,
          trend:
            current.grossIncome > previous.grossIncome
              ? "up"
              : current.grossIncome < previous.grossIncome
                ? "down"
                : "same",
          icon: DollarSign,
        },
        {
          label: "Tax Paid (PAYE)",
          current: current.taxPaid,
          previous: previous.taxPaid,
          change: current.taxPaid - previous.taxPaid,
          changePercent:
            ((current.taxPaid - previous.taxPaid) / previous.taxPaid) * 100,
          trend:
            current.taxPaid > previous.taxPaid
              ? "up"
              : current.taxPaid < previous.taxPaid
                ? "down"
                : "same",
          icon: FileText,
        },
        {
          label: "Tax Refund",
          current: current.refundDue,
          previous: previous.refundDue,
          change: current.refundDue - previous.refundDue,
          changePercent:
            previous.refundDue > 0
              ? ((current.refundDue - previous.refundDue) /
                  previous.refundDue) *
                100
              : 0,
          trend:
            current.refundDue > previous.refundDue
              ? "up"
              : current.refundDue < previous.refundDue
                ? "down"
                : "same",
          icon: TrendingUp,
        },
        {
          label: "Retirement Contributions",
          current: current.retirementContrib,
          previous: previous.retirementContrib,
          change: current.retirementContrib - previous.retirementContrib,
          changePercent:
            previous.retirementContrib > 0
              ? ((current.retirementContrib - previous.retirementContrib) /
                  previous.retirementContrib) *
                100
              : 0,
          trend:
            current.retirementContrib > previous.retirementContrib
              ? "up"
              : current.retirementContrib < previous.retirementContrib
                ? "down"
                : "same",
          icon: BarChart3,
        },
      ];

      setComparisonMetrics(metrics);
    };

    const getTrendIcon = (trend: "up" | "down" | "same") => {
      switch (trend) {
        case "up":
          return <ArrowUpRight className="w-4 h-4 text-green-500" />;
        case "down":
          return <ArrowDownRight className="w-4 h-4 text-red-500" />;
        default:
          return <Minus className="w-4 h-4 text-muted-foreground" />;
      }
    };

    const getTrendColor = (
      trend: "up" | "down" | "same",
      isPositive?: boolean,
    ) => {
      if (trend === "same") return "text-muted-foreground";

      // For refunds and income, up is good. For tax paid, down is good.
      const isGoodTrend = isPositive ? trend === "up" : trend === "down";
      return isGoodTrend ? "text-green-500" : "text-red-500";
    };

    if (isLoading) {
      return (
        <Card className={className}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary animate-pulse" />
              Loading Previous Year Comparison...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted/30 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!previousYearData) {
      return (
        <Card className={className}>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Previous Year Data
            </h3>
            <p className="text-muted-foreground">
              Upload your previous year's IRP5 to see year-over-year
              comparisons.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Tax Year Comparison
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {formatTaxYear(currentYearData.taxYear)} vs{" "}
                {formatTaxYear(previousYearData.taxYear)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList
                className="grid w-full grid-cols-2"
                role="tablist"
                aria-label="Tax year comparison views"
              >
                <TabsTrigger
                  value="overview"
                  role="tab"
                  aria-controls="overview-panel"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="detailed"
                  role="tab"
                  aria-controls="detailed-panel"
                >
                  Detailed Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparisonMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    const isPositiveMetric = [
                      "Gross Income",
                      "Tax Refund",
                      "Retirement Contributions",
                    ].includes(metric.label);

                    return (
                      <Card
                        key={index}
                        className="border border-border hover:border-primary/20 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">
                                {metric.label}
                              </span>
                            </div>
                            {getTrendIcon(metric.trend)}
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {formatTaxYear(currentYearData.taxYear)}
                                </p>
                                <p className="font-semibold">
                                  {formatCurrency(metric.current)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  {formatTaxYear(previousYearData.taxYear)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatCurrency(metric.previous)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span
                                className={`text-sm font-medium ${getTrendColor(metric.trend, isPositiveMetric)}`}
                              >
                                {metric.change >= 0 ? "+" : ""}
                                {formatCurrency(metric.change)}
                              </span>
                              <span
                                className={`text-xs ${getTrendColor(metric.trend, isPositiveMetric)}`}
                              >
                                {metric.changePercent >= 0 ? "+" : ""}
                                {metric.changePercent.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="bg-muted/30 border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Key Insights</h4>
                    <div className="space-y-2 text-sm">
                      {comparisonMetrics.map((metric, index) => {
                        if (Math.abs(metric.changePercent) < 5) return null;

                        const isPositiveMetric = [
                          "Gross Income",
                          "Tax Refund",
                          "Retirement Contributions",
                        ].includes(metric.label);
                        const isGoodChange = isPositiveMetric
                          ? metric.change > 0
                          : metric.change < 0;

                        return (
                          <div key={index} className="flex items-center gap-2">
                            {isGoodChange ? (
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            ) : (
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                            <span className="text-muted-foreground">
                              Your {metric.label.toLowerCase()}{" "}
                              {metric.change > 0 ? "increased" : "decreased"} by{" "}
                              <span className="font-medium">
                                {Math.abs(metric.changePercent).toFixed(1)}%
                              </span>{" "}
                              compared to last year
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {formatTaxYear(currentYearData.taxYear)} Tax Year
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Gross Income:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(currentYearData.grossIncome)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Paid:</span>
                        <span className="font-semibold">
                          {formatCurrency(currentYearData.taxPaid)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Refund Due:
                        </span>
                        <span className="font-semibold text-green-500">
                          {formatCurrency(currentYearData.refundDue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Retirement Contrib:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(currentYearData.retirementContrib)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Effective Tax Rate:
                        </span>
                        <span className="font-semibold">
                          {(currentYearData.effectiveTaxRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {formatTaxYear(previousYearData.taxYear)} Tax Year
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Gross Income:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(previousYearData.grossIncome)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Paid:</span>
                        <span className="font-semibold">
                          {formatCurrency(previousYearData.taxPaid)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Refund Due:
                        </span>
                        <span className="font-semibold text-green-500">
                          {formatCurrency(previousYearData.refundDue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Retirement Contrib:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(previousYearData.retirementContrib)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Effective Tax Rate:
                        </span>
                        <span className="font-semibold">
                          {(previousYearData.effectiveTaxRate * 100).toFixed(1)}
                          %
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Progress Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p>
                        Based on your year-over-year comparison, your financial
                        situation has{" "}
                        {comparisonMetrics[0].change > 0
                          ? "improved"
                          : "declined"}{" "}
                        since last year.
                        {comparisonMetrics[0].change > 0 &&
                          " Your income has increased, which is excellent progress."}
                        {comparisonMetrics[2].change > 0 &&
                          " Additionally, your tax refund has increased compared to last year."}
                      </p>

                      {comparisonMetrics[3].change > 0 && (
                        <p>
                          You've also increased your retirement contributions,
                          which is a smart financial move that will benefit you
                          in the long term while reducing your current tax
                          liability.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  },
);

export default TaxYearComparison;
