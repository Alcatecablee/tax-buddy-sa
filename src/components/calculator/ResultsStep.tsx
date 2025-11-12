import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { TaxCalculationResult, formatCurrency, formatPercentage } from "@/lib/taxCalculator";
import { Separator } from "@/components/ui/separator";

interface ResultsStepProps {
  result: TaxCalculationResult;
}

export const ResultsStep = ({ result }: ResultsStepProps) => {
  const isRefund = result.refundAmount > 0;
  const isOwing = result.refundAmount < 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isRefund ? 'bg-success/10' : isOwing ? 'bg-destructive/10' : 'bg-muted'
        }`}>
          {isRefund ? (
            <CheckCircle className="w-6 h-6 text-success" />
          ) : isOwing ? (
            <AlertCircle className="w-6 h-6 text-destructive" />
          ) : (
            <CheckCircle className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Tax Calculation Results</h2>
          <p className="text-muted-foreground">Based on 2024/2025 SARS tax brackets and regulations</p>
        </div>
      </div>

      {/* Main Result Card */}
      <Card className={`p-8 ${
        isRefund ? 'bg-success-light border-success' : 
        isOwing ? 'bg-destructive/5 border-destructive/30' : 
        'bg-muted'
      }`}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-lg font-medium">
            {isRefund && <TrendingUp className="w-5 h-5 text-success" />}
            {isOwing && <TrendingDown className="w-5 h-5 text-destructive" />}
            <span className={isRefund ? 'text-success' : isOwing ? 'text-destructive' : 'text-foreground'}>
              {isRefund ? 'Tax Refund Expected' : isOwing ? 'Additional Tax Owed' : 'Tax Liability Settled'}
            </span>
          </div>
          <div className={`text-5xl font-bold ${
            isRefund ? 'text-success' : isOwing ? 'text-destructive' : 'text-foreground'
          }`}>
            {formatCurrency(Math.abs(result.refundAmount))}
          </div>
          <p className="text-muted-foreground">
            {isRefund 
              ? 'You overpaid your taxes and should receive a refund from SARS'
              : isOwing 
              ? 'You need to pay additional tax to SARS'
              : 'Your tax payments match your tax liability'}
          </p>
        </div>
      </Card>

      {/* Income Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Income Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Income</span>
            <span className="font-semibold text-foreground">{formatCurrency(result.totalIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Deductions</span>
            <span className="font-semibold text-destructive">-{formatCurrency(result.totalDeductions)}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold text-foreground">Taxable Income</span>
            <span className="font-bold text-primary">{formatCurrency(result.taxableIncome)}</span>
          </div>
        </div>
      </Card>

      {/* Tax Calculation */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Tax Calculation</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tax Before Rebates</span>
            <span className="font-semibold text-foreground">{formatCurrency(result.taxBeforeRebates)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tax Rebates</span>
            <span className="font-semibold text-success">-{formatCurrency(result.totalRebates)}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Tax Owed</span>
            <span className="font-bold text-primary">{formatCurrency(result.taxAfterRebates)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tax Already Paid (PAYE + Provisional)</span>
            <span className="font-semibold text-accent">-{formatCurrency(result.totalTaxPaid)}</span>
          </div>
          <Separator className="border-t-2" />
          <div className="flex justify-between items-center text-lg pt-2">
            <span className="font-semibold text-foreground">
              {isRefund ? 'Refund Amount' : isOwing ? 'Amount Owing' : 'Balance'}
            </span>
            <span className={`font-bold text-2xl ${
              isRefund ? 'text-success' : isOwing ? 'text-destructive' : 'text-foreground'
            }`}>
              {formatCurrency(Math.abs(result.refundAmount))}
            </span>
          </div>
        </div>
      </Card>

      {/* Effective Tax Rate */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Tax Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Effective Tax Rate</span>
              <span className="font-bold text-primary">{formatPercentage(result.effectiveTaxRate)}</span>
            </div>
            <Progress value={result.effectiveTaxRate} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              This is the actual percentage of your total income that goes to tax
            </p>
          </div>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="p-6 bg-accent-light border-accent/20">
        <h3 className="text-lg font-semibold text-foreground mb-3">Important Notes</h3>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>This is an estimate based on 2024/2025 tax year rates. Your actual assessment may differ.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Ensure all income sources and deductions are accurately reported to SARS.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Keep all supporting documents (IRP5, medical aid certificates, receipts) for at least 5 years.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Refunds typically take 72 hours to 21 business days to process once your return is assessed.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
