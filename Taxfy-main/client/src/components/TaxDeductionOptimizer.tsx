import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Calculator,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Heart,
  Car,
  Building,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface TaxData {
  grossIncome: number;
  retirementContrib: number;
  medicalContrib: number;
  medicalCredits: number;
  travelAllowance: number;
}

interface DeductionSuggestion {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  currentAmount: number;
  optimizedAmount: number;
  potentialSaving: number;
  description: string;
  confidence: "high" | "medium" | "low";
  tips: string[];
}

interface TaxDeductionOptimizerProps {
  taxData: TaxData;
  currentTaxResult?: any; // Add current tax result to get actual marginal rate
  onOptimizationApplied?: (optimizedData: TaxData) => void;
}

export const TaxDeductionOptimizer: React.FC<TaxDeductionOptimizerProps> =
  React.memo(({ taxData, currentTaxResult, onOptimizationApplied }) => {
    const [suggestions, setSuggestions] = useState<DeductionSuggestion[]>([]);
    const [totalPotentialSaving, setTotalPotentialSaving] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useCustomToast();

    useEffect(() => {
      if (taxData && taxData.grossIncome > 0) {
        analyzeDeductions();
      }
    }, [taxData]);

    const analyzeDeductions = async () => {
      setIsAnalyzing(true);

      // Simulate analysis delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const analyzed = generateDeductionSuggestions(taxData);
      setSuggestions(analyzed);
      setTotalPotentialSaving(
        analyzed.reduce((sum, s) => sum + s.potentialSaving, 0),
      );
      setIsAnalyzing(false);
    };

    const generateDeductionSuggestions = (
      data: TaxData,
    ): DeductionSuggestion[] => {
      const suggestions: DeductionSuggestion[] = [];
      const maxRetirement = Math.min(data.grossIncome * 0.275, 350000);
      const maxMedical = data.grossIncome * 0.075;

      // Retirement fund optimization
      if (data.retirementContrib < maxRetirement) {
        const optimized = Math.min(
          maxRetirement,
          data.retirementContrib + 50000,
        );
        // Use actual marginal tax rate instead of fixed 26%
        const marginalRate = currentTaxResult?.marginalRate ? (currentTaxResult.marginalRate / 100) : 0.26;
        const saving = (optimized - data.retirementContrib) * marginalRate;

        suggestions.push({
          category: "Retirement Fund",
          icon: Building,
          currentAmount: data.retirementContrib,
          optimizedAmount: optimized,
          potentialSaving: saving,
          description:
            "Increase retirement fund contributions to maximize tax benefits",
          confidence: "high",
          tips: [
            "Maximum deduction: 27.5% of income or R350,000",
            "Every R1,000 contribution saves ~R260 in tax",
            "Builds long-term financial security",
          ],
        });
      }

      // Medical aid optimization - Note: Medical contributions provide TAX CREDITS, not deductions
      // Only suggest if user has very low medical aid contributions relative to income
      const recommendedMedicalAid = Math.max(data.grossIncome * 0.03, 12000); // Minimum 3% of income or R12k
      if (data.medicalContrib < recommendedMedicalAid && data.medicalContrib < 50000) {
        const optimized = Math.min(recommendedMedicalAid, data.medicalContrib + 15000);
        // Medical aid provides credits, not deductions, so benefit is lower than marginal rate
        const estimatedMedicalCreditIncrease = (optimized - data.medicalContrib) * 0.15; // Approximate credit benefit

        suggestions.push({
          category: "Medical Aid",
          icon: Heart,
          currentAmount: data.medicalContrib,
          optimizedAmount: optimized,
          potentialSaving: estimatedMedicalCreditIncrease,
          description: "Consider upgrading medical aid for better tax credits and coverage",
          confidence: "medium",
          tips: [
            "Medical scheme fees provide tax CREDITS (not deductions)",
            "Additional medical expenses above 7.5% of income may qualify",
            "Better health coverage provides financial protection",
            "Tax credits reduce tax payable rand-for-rand up to limits",
          ],
        });
      }

      // Travel allowance optimization - Note: Complex rules apply
      if (data.travelAllowance > 0 && data.travelAllowance < 50000) {
        const optimized = Math.min(50000, data.travelAllowance + 20000);
        // Travel allowance benefit depends on actual vs deemed costs - use conservative estimate
        const marginalRate = currentTaxResult?.marginalRate ? (currentTaxResult.marginalRate / 100) : 0.26;
        const saving = (optimized - data.travelAllowance) * marginalRate * 0.7; // 70% efficiency due to travel rules

        suggestions.push({
          category: "Travel Allowance",
          icon: Car,
          currentAmount: data.travelAllowance,
          optimizedAmount: optimized,
          potentialSaving: saving,
          description: "Keep detailed logbooks to maximize travel deductions",
          confidence: "medium",
          tips: [
            "Maintain accurate travel logbook (business vs private)",
            "Choose between actual costs or SARS deemed amounts",
            "Business travel portion only qualifies for deduction",
            "Consider fuel, maintenance, and depreciation costs",
          ],
        });
      }

      // Additional deductions suggestion
      if (data.grossIncome > 200000) {
        const marginalRate = currentTaxResult?.marginalRate ? (currentTaxResult.marginalRate / 100) : 0.26;
        suggestions.push({
          category: "Additional Deductions",
          icon: FileText,
          currentAmount: 0,
          optimizedAmount: 15000,
          potentialSaving: 15000 * marginalRate,
          description: "Explore additional tax-deductible expenses",
          confidence: "low",
          tips: [
            "Home office expenses for remote work",
            "Professional development and training",
            "Donations to registered charities (up to 10%)",
          ],
        });
      }

      return suggestions;
    };

    const applyOptimization = (suggestion: DeductionSuggestion) => {
      const optimizedData = { ...taxData };

      switch (suggestion.category) {
        case "Retirement Fund":
          optimizedData.retirementContrib = suggestion.optimizedAmount;
          break;
        case "Medical Aid":
          optimizedData.medicalContrib = suggestion.optimizedAmount;
          break;
        case "Travel Allowance":
          optimizedData.travelAllowance = suggestion.optimizedAmount;
          break;
      }

      onOptimizationApplied?.(optimizedData);

      toast({
        title: "Optimization Applied",
        description: `${suggestion.category} deduction updated for potential savings of ${formatCurrency(suggestion.potentialSaving)}`,
      });
    };

    const applyAllOptimizations = () => {
      let optimizedData = { ...taxData };

      suggestions.forEach((suggestion) => {
        switch (suggestion.category) {
          case "Retirement Fund":
            optimizedData.retirementContrib = suggestion.optimizedAmount;
            break;
          case "Medical Aid":
            optimizedData.medicalContrib = suggestion.optimizedAmount;
            break;
          case "Travel Allowance":
            optimizedData.travelAllowance = suggestion.optimizedAmount;
            break;
        }
      });

      onOptimizationApplied?.(optimizedData);

      toast({
        title: "All Optimizations Applied",
        description: `Potential total savings of ${formatCurrency(totalPotentialSaving)}`,
      });
    };

    if (isAnalyzing) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary animate-pulse" />
              Analyzing Tax Deductions...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={33} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Our AI is analyzing your tax situation to find optimization
                opportunities...
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tax Deduction Optimizer
            </CardTitle>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                AI-powered suggestions to maximize your tax savings
              </p>
              {totalPotentialSaving > 0 && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Potential Savings: {formatCurrency(totalPotentialSaving)}
                </Badge>
              )}
            </div>
          </CardHeader>

          {suggestions.length > 0 && (
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">
                  Found {suggestions.length} optimization opportunities
                </span>
                <Button
                  onClick={applyAllOptimizations}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Apply All
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          const savingsPercentage =
            suggestion.currentAmount > 0
              ? ((suggestion.optimizedAmount - suggestion.currentAmount) /
                  suggestion.currentAmount) *
                100
              : 100;

          return (
            <Card
              key={index}
              className="border border-border hover:border-primary/20 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {suggestion.category}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      suggestion.confidence === "high"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : suggestion.confidence === "medium"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {suggestion.confidence} confidence
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="font-semibold">
                      {formatCurrency(suggestion.currentAmount)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">Optimized</p>
                    <p className="font-semibold text-primary">
                      {formatCurrency(suggestion.optimizedAmount)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">Tax Saving</p>
                    <p className="font-semibold text-green-500">
                      {formatCurrency(suggestion.potentialSaving)}
                    </p>
                  </div>
                </div>

                {savingsPercentage > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Improvement</span>
                      <span className="text-primary">
                        +{savingsPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(savingsPercentage, 100)}
                      className="h-2"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Benefits:</p>
                  <ul className="space-y-1">
                    {suggestion.tips.map((tip, tipIndex) => (
                      <li
                        key={tipIndex}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => applyOptimization(suggestion)}
                  className="w-full"
                  variant="outline"
                >
                  Apply This Optimization
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {suggestions.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Deductions Already Optimized!
              </h3>
              <p className="text-muted-foreground">
                Your current tax deductions appear to be well-optimized. Keep up
                the good work!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  });

export default TaxDeductionOptimizer;
