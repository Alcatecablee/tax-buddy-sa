import { EconomicIndicators } from '@/components/EconomicIndicators';
import { TaxPlanningTips } from '@/components/TaxPlanningTips';

export default function EconomicDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Tax Intelligence Dashboard</h1>
        <p className="text-muted-foreground">
          Make smarter tax decisions with real-time economic data from the South African Reserve Bank
        </p>
      </div>

      <EconomicIndicators />
      
      <TaxPlanningTips />
      
      <div className="text-center text-sm text-muted-foreground pt-8">
        <p>
          Economic data is updated hourly from the{' '}
          <a 
            href="https://www.resbank.co.za" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover-elevate"
            data-testid="link-sarb"
          >
            South African Reserve Bank
          </a>
        </p>
        <p className="mt-2">
          Want historical data and advanced insights?{' '}
          <span className="text-primary font-medium">Upgrade to Premium</span>
        </p>
      </div>
    </div>
  );
}
