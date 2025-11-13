import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, TrendingDown, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EconomicIndicators {
  inflation: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  repoRate: {
    current: number;
    previous: number;
  };
  exchangeRates: {
    usdZar: number;
  };
}

interface EconomicInsightsProps {
  taxableIncome?: number;
  retirementContributions?: number;
}

export function EconomicInsights({ taxableIncome, retirementContributions }: EconomicInsightsProps) {
  const { data } = useQuery<{ success: boolean; data: EconomicIndicators }>({
    queryKey: ['/api/economic/indicators'],
    staleTime: 3600000,
  });

  if (!data?.success || !taxableIncome) {
    return null;
  }

  const indicators = data.data;
  const inflationRate = indicators.inflation.current;
  
  // Calculate inflation-adjusted recommendations
  const maxRetirementContribution = taxableIncome * 0.275; // 27.5% limit
  const currentContribution = retirementContributions || 0;
  const additionalRoom = Math.max(0, maxRetirementContribution - currentContribution);
  
  // Calculate future value impact
  const realReturnAfterInflation = additionalRoom > 0 
    ? (additionalRoom * 0.18) - (additionalRoom * (inflationRate / 100))
    : 0;

  return (
    <Card data-testid="card-economic-insights">
      <CardHeader className="gap-2 flex-wrap flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Economic Insights</CardTitle>
          <CardDescription>
            How current economic conditions affect your tax planning
          </CardDescription>
        </div>
        <Info className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Inflation Impact */}
        <Alert>
          <TrendingDown className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Inflation:</span>
                <Badge variant={indicators.inflation.trend === 'down' ? 'secondary' : 'destructive'}>
                  {inflationRate}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {inflationRate > 5 
                  ? `High inflation (${inflationRate}%) erodes purchasing power. Maximize tax-deductible retirement contributions now.`
                  : inflationRate < 3.5
                    ? `Low inflation (${inflationRate}%) means stable prices. Great time for long-term tax planning.`
                    : `Moderate inflation (${inflationRate}%) - balanced economic conditions for tax planning.`
                }
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Retirement Contribution Opportunity */}
        {additionalRoom > 1000 && (
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Tax Savings Opportunity</p>
                <p className="text-sm text-muted-foreground">
                  You can contribute an additional{' '}
                  <span className="font-semibold text-foreground">
                    R{additionalRoom.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                  </span>
                  {' '}to retirement and save approximately{' '}
                  <span className="font-semibold text-success">
                    R{(additionalRoom * 0.18).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                  </span>
                  {' '}in taxes (assuming 18% tax bracket).
                </p>
                {realReturnAfterInflation > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    After {inflationRate}% inflation, real tax benefit: R{realReturnAfterInflation.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Interest Rate Impact */}
        {indicators.repoRate.current > 7.5 && (
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Info className="h-3 w-3" />
              Repo rate at {indicators.repoRate.current}% - bond interest deductions may apply
            </p>
          </div>
        )}

        {/* Exchange Rate Info */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          USD/ZAR: R{indicators.exchangeRates.usdZar.toFixed(2)} • 
          Data updated hourly from SARB
        </div>
      </CardContent>
    </Card>
  );
}
