import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PiggyBank, Heart, Gift, DollarSign } from "lucide-react";
import { DeductionInputs, TaxPaidInputs } from "@/lib/taxCalculator";

interface DeductionsStepProps {
  deductions: DeductionInputs;
  taxPaid: TaxPaidInputs;
  onDeductionChange: (field: keyof DeductionInputs, value: number) => void;
  onTaxPaidChange: (field: keyof TaxPaidInputs, value: number) => void;
}

export const DeductionsStep = ({ deductions, taxPaid, onDeductionChange, onTaxPaidChange }: DeductionsStepProps) => {
  const handleDeductionChange = (field: keyof DeductionInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    onDeductionChange(field, Math.max(0, numValue));
  };

  const handleTaxPaidChange = (field: keyof TaxPaidInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    onTaxPaidChange(field, Math.max(0, numValue));
  };

  const deductionFields = [
    {
      key: 'retirementContributions' as keyof DeductionInputs,
      icon: PiggyBank,
      label: 'Retirement Contributions',
      description: 'Pension, provident, or retirement annuity contributions (max 27.5% of income)',
      placeholder: '50000'
    },
    {
      key: 'medicalAidContributions' as keyof DeductionInputs,
      icon: Heart,
      label: 'Medical Aid Contributions',
      description: 'Annual medical scheme contributions',
      placeholder: '30000'
    },
    {
      key: 'medicalExpenses' as keyof DeductionInputs,
      icon: Heart,
      label: 'Out-of-Pocket Medical Expenses',
      description: 'Medical expenses not covered by medical aid',
      placeholder: '10000'
    },
    {
      key: 'charitableDonations' as keyof DeductionInputs,
      icon: Gift,
      label: 'Charitable Donations',
      description: 'Donations to registered PBOs (max 10% of taxable income)',
      placeholder: '5000'
    }
  ];

  const taxPaidFields = [
    {
      key: 'paye' as keyof TaxPaidInputs,
      label: 'PAYE (Pay As You Earn)',
      description: 'Tax already deducted from your salary (from IRP5)',
      placeholder: '80000'
    },
    {
      key: 'provisionalTax' as keyof TaxPaidInputs,
      label: 'Provisional Tax Paid',
      description: 'Tax paid in advance if self-employed',
      placeholder: '20000'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <PiggyBank className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Deductions & Tax Paid</h2>
          <p className="text-muted-foreground">Reduce your taxable income with valid deductions</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Tax Deductions</h3>
        <div className="space-y-4">
          {deductionFields.map((field) => {
            const Icon = field.icon;
            return (
              <Card key={field.key} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor={field.key} className="text-base font-semibold">
                        {field.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{field.description}</p>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        R
                      </span>
                      <Input
                        id={field.key}
                        type="number"
                        min="0"
                        step="0.01"
                        value={deductions[field.key] || ''}
                        onChange={(e) => handleDeductionChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="pl-8 h-12"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Tax Already Paid</h3>
        <div className="space-y-4">
          {taxPaidFields.map((field) => (
            <Card key={field.key} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor={field.key} className="text-base font-semibold">
                      {field.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{field.description}</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R
                    </span>
                    <Input
                      id={field.key}
                      type="number"
                      min="0"
                      step="0.01"
                      value={taxPaid[field.key] || ''}
                      onChange={(e) => handleTaxPaidChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="pl-8 h-12"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
