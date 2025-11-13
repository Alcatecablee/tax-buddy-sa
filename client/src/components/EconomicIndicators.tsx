import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign, Percent, Building2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EconomicIndicators {
  inflation: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
  repoRate: {
    current: number;
    previous: number;
    lastChanged: string;
  };
  primeRate: {
    current: number;
    lastUpdated: string;
  };
  exchangeRates: {
    usdZar: number;
    eurZar: number;
    gbpZar: number;
    lastUpdated: string;
  };
}

interface EconomicIndicatorsResponse {
  success: boolean;
  data: EconomicIndicators;
  warnings?: string[];
  isFallback?: boolean;
  degraded?: boolean;
  source?: 'live' | 'fallback' | 'stale-cache';
  dataAge?: string;
  nextRefreshEta?: string;
}

export function EconomicIndicators() {
  const { data, isLoading, error } = useQuery<EconomicIndicatorsResponse>({
    queryKey: ['/api/economic/indicators'],
    refetchInterval: 3600000, // Refetch every hour
    staleTime: 3600000,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} data-testid={`skeleton-indicator-${i}`}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted animate-pulse rounded w-20" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <Card data-testid="indicator-error">
        <CardHeader>
          <CardTitle>Economic Data Unavailable</CardTitle>
          <CardDescription>
            Unable to load real-time economic indicators. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const indicators = data.data;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-success" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (current: number, previous: number): 'default' | 'destructive' | 'secondary' | 'outline' => {
    if (Math.abs(current - previous) < 0.05) return 'default';
    return current > previous ? 'destructive' : 'secondary';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-ZA', { 
        year: 'numeric', 
        month: 'short'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold" data-testid="heading-economic">Live Economic Data</h2>
        <p className="text-sm text-muted-foreground">
          Real-time indicators from the South African Reserve Bank to help with tax planning
        </p>
      </div>
      
      {/* Data Quality Warnings */}
      {(data?.degraded || data?.isFallback || data?.warnings) && (
        <Alert data-testid="alert-data-quality">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {data.source === 'fallback' ? 'Using Backup Data' : 'Limited Data Availability'}
          </AlertTitle>
          <AlertDescription className="space-y-1">
            {data.warnings?.map((warning, index) => (
              <p key={index} className="text-sm">{warning}</p>
            ))}
            {data.source === 'fallback' && (
              <p className="text-sm">
                The SARB API is currently unavailable. Displaying conservative fallback data from{' '}
                {data.dataAge ? new Date(data.dataAge).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' }) : 'September 2025'}.
              </p>
            )}
            {data.source === 'live' && data.warnings && (
              <p className="text-sm text-muted-foreground mt-2">
                Current data from SARB is being displayed, but some historical information may be limited.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Inflation Card */}
        <Card data-testid="card-inflation">
          <CardHeader className="pb-2 gap-2 flex-wrap flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Inflation Rate
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-inflation">
              {indicators.inflation.current}%
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(indicators.inflation.trend)}
              <span className="text-xs text-muted-foreground">
                from {indicators.inflation.previous}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Updated {formatDate(indicators.inflation.lastUpdated)}
            </p>
          </CardContent>
        </Card>

        {/* Repo Rate Card */}
        <Card data-testid="card-repo-rate">
          <CardHeader className="pb-2 gap-2 flex-wrap flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Repo Rate
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-repo-rate">
              {indicators.repoRate.current}%
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getTrendColor(indicators.repoRate.current, indicators.repoRate.previous)} data-testid="badge-repo-trend">
                {indicators.repoRate.current === indicators.repoRate.previous 
                  ? 'Unchanged' 
                  : indicators.repoRate.current > indicators.repoRate.previous 
                    ? `+${(indicators.repoRate.current - indicators.repoRate.previous).toFixed(2)}%`
                    : `${(indicators.repoRate.current - indicators.repoRate.previous).toFixed(2)}%`
                }
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last changed {formatDate(indicators.repoRate.lastChanged)}
            </p>
          </CardContent>
        </Card>

        {/* Prime Rate Card */}
        <Card data-testid="card-prime-rate">
          <CardHeader className="pb-2 gap-2 flex-wrap flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Prime Lending Rate
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-prime-rate">
              {indicators.primeRate.current}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Current prime rate
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Updated {formatDate(indicators.primeRate.lastUpdated)}
            </p>
          </CardContent>
        </Card>

        {/* Exchange Rates Card */}
        <Card data-testid="card-exchange-rates">
          <CardHeader className="pb-2 gap-2 flex-wrap flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Exchange Rates
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">USD/ZAR</span>
                <span className="text-sm font-semibold" data-testid="value-usd-zar">
                  R{indicators.exchangeRates.usdZar.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">EUR/ZAR</span>
                <span className="text-sm font-semibold" data-testid="value-eur-zar">
                  R{indicators.exchangeRates.eurZar.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">GBP/ZAR</span>
                <span className="text-sm font-semibold" data-testid="value-gbp-zar">
                  R{indicators.exchangeRates.gbpZar.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Updated {formatDate(indicators.exchangeRates.lastUpdated)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
