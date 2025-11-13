import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calculator,
  DollarSign,
  AlertCircle,
  TrendingUp,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TaxResultsEnhancedProps {
  taxData: any;
  taxResult: any;
  onOptimizationApplied?: (optimizedData: any) => void;
}

export const TaxResultsEnhanced: React.FC<TaxResultsEnhancedProps> = ({
  taxData,
  taxResult,
}) => {
  const displayValues = {
    expectedRefund: taxResult?.refundAmount || taxResult?.refundDue || 0,
    amountOwed: taxResult?.amountOwed || 0,
    isRefund: taxResult?.isRefund || false,
    taxPaid: taxData?.payeWithheld || 0,
    grossIncome: taxData?.grossRemuneration || taxData?.grossIncome || 0,
    taxableIncome: taxResult?.taxableIncome || 0,
    totalTax: taxResult?.totalTax || 0,
    effectiveRate: taxResult?.effectiveRate || 0,
    marginalRate: taxResult?.marginalRate || 0,
  };

  return (
    <div className="space-y-6" data-testid="tax-results-enhanced">
      {/* Disclaimer */}
      <Alert className="border-amber-500/50 bg-amber-500/10">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> This is an estimate only and not official SARS advice. 
          Always verify calculations with a qualified tax professional or through official SARS eFiling.
        </AlertDescription>
      </Alert>

      {/* Main Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Tax Calculation Results
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on your IRP5 data
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Primary Result */}
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            {displayValues.isRefund ? (
              <>
                <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Expected Refund</p>
                <p className="text-4xl font-bold text-green-500" data-testid="text-refund-amount">
                  {formatCurrency(displayValues.expectedRefund)}
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Amount Owed</p>
                <p className="text-4xl font-bold text-red-500" data-testid="text-amount-owed">
                  {formatCurrency(displayValues.amountOwed)}
                </p>
              </>
            )}
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Calculation Breakdown
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-card border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Gross Income</p>
                <p className="text-xl font-semibold" data-testid="text-gross-income">
                  {formatCurrency(displayValues.grossIncome)}
                </p>
              </div>

              <div className="p-4 bg-card border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Taxable Income</p>
                <p className="text-xl font-semibold" data-testid="text-taxable-income">
                  {formatCurrency(displayValues.taxableIncome)}
                </p>
              </div>

              <div className="p-4 bg-card border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Tax Due</p>
                <p className="text-xl font-semibold" data-testid="text-tax-due">
                  {formatCurrency(displayValues.totalTax)}
                </p>
              </div>

              <div className="p-4 bg-card border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">PAYE Withheld</p>
                <p className="text-xl font-semibold" data-testid="text-paye-withheld">
                  {formatCurrency(displayValues.taxPaid)}
                </p>
              </div>
            </div>
          </div>

          {/* Tax Rates */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tax Rates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Effective Tax Rate</p>
                <p className="text-xl font-semibold text-primary" data-testid="text-effective-rate">
                  {displayValues.effectiveRate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Average rate on total income
                </p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Marginal Tax Rate</p>
                <p className="text-xl font-semibold text-primary" data-testid="text-marginal-rate">
                  {displayValues.marginalRate}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Rate on next rand earned
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          {displayValues.isRefund ? (
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-sm">
                <strong>Good news!</strong> You're due a refund of {formatCurrency(displayValues.expectedRefund)}. 
                File your tax return through SARS eFiling to claim your refund.
              </AlertDescription>
            </Alert>
          ) : displayValues.amountOwed > 0 ? (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-sm">
                <strong>Action required:</strong> You owe SARS {formatCurrency(displayValues.amountOwed)}. 
                Make payment through SARS eFiling to avoid penalties and interest.
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxResultsEnhanced;
