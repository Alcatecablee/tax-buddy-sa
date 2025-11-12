import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DollarSign, Briefcase, Home, TrendingUp } from "lucide-react";
import { IncomeInputs } from "@/lib/taxCalculator";

interface IncomeStepProps {
  income: IncomeInputs;
  onIncomeChange: (field: keyof IncomeInputs, value: number) => void;
}

export const IncomeStep = ({ income, onIncomeChange }: IncomeStepProps) => {
  const handleChange = (field: keyof IncomeInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    onIncomeChange(field, Math.max(0, numValue));
  };

  const totalIncome = income.salary + income.freelance + income.rental + income.investment;

  const incomeFields = [
    {
      key: 'salary' as keyof IncomeInputs,
      icon: Briefcase,
      label: 'Salary/Wages (IRP5)',
      description: 'Your employment income from IRP5 certificate',
      placeholder: '450000'
    },
    {
      key: 'freelance' as keyof IncomeInputs,
      icon: DollarSign,
      label: 'Freelance/Business Income',
      description: 'Income from self-employment or business activities',
      placeholder: '120000'
    },
    {
      key: 'rental' as keyof IncomeInputs,
      icon: Home,
      label: 'Rental Income',
      description: 'Income from property rentals',
      placeholder: '60000'
    },
    {
      key: 'investment' as keyof IncomeInputs,
      icon: TrendingUp,
      label: 'Investment Income',
      description: 'Dividends, interest, and capital gains',
      placeholder: '30000'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Income Sources</h2>
          <p className="text-muted-foreground">Enter all your income for the 2024/2025 tax year</p>
        </div>
      </div>

      <div className="space-y-4">
        {incomeFields.map((field) => {
          const Icon = field.icon;
          return (
            <Card key={field.key} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon className="w-5 h-5 text-success" />
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
                      value={income[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="pl-8 h-12 text-lg"
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-success-light border-success/20">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-foreground">Total Annual Income</span>
          <span className="text-2xl font-bold text-success">
            R {totalIncome.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </Card>
    </div>
  );
};
