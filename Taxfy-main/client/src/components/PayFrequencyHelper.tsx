import React, { useState } from 'react';
import { Calculator, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PayFrequencyHelperProps {
  onApply: (annualAmount: number) => void;
}

const PayFrequencyHelper: React.FC<PayFrequencyHelperProps> = ({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState<string>('monthly');
  const [amount, setAmount] = useState<string>('');

  const frequencies = {
    monthly: { label: 'Monthly', multiplier: 12 },
    biweekly: { label: 'Bi-weekly', multiplier: 26 },
    weekly: { label: 'Weekly', multiplier: 52 },
    daily: { label: 'Daily', multiplier: 260 }
  };

  const calculateAnnual = () => {
    const numAmount = parseFloat(amount.replace(/,/g, '')) || 0;
    return numAmount * frequencies[frequency as keyof typeof frequencies].multiplier;
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/,/g, '');
    if (isNaN(Number(num))) return value;
    return Number(num).toLocaleString();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setAmount(formatted);
  };

  const handleApply = () => {
    const annual = calculateAnnual();
    onApply(annual);
    setAmount('');
    setIsOpen(false);
  };

  const annualAmount = calculateAnnual();

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 transition-all duration-200 hover:scale-105"
      >
        <Calculator className="w-4 h-4 mr-1" />
        Pay Calculator
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-12 left-0 z-[9999] w-80 shadow-lg animate-fade-in bg-background border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pay Frequency Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Pay Frequency</label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-[10000]">
                  {Object.entries(frequencies).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {frequencies[frequency as keyof typeof frequencies].label} Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R</span>
                <Input
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="pl-8 bg-background border-border"
                />
              </div>
            </div>

            {amount && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 animate-fade-in backdrop-blur-sm">
                <div className="text-xs text-blue-300 mb-1">Annual Salary</div>
                <div className="text-lg font-bold text-blue-200">
                  R{annualAmount.toLocaleString()}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={handleApply}
                disabled={!amount}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Use This
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PayFrequencyHelper;
