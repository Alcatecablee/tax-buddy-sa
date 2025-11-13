import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function TaxPlanningTips() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: string[] }>({
    queryKey: ['/api/economic/tips'],
    refetchInterval: 21600000, // Refetch every 6 hours
    staleTime: 21600000,
  });

  if (isLoading) {
    return (
      <Card data-testid="tips-loading">
        <CardHeader className="gap-2 flex-wrap flex-row items-center justify-between">
          <div>
            <CardTitle>Smart Tax Tips</CardTitle>
            <CardDescription>
              Personalized recommendations based on current economic conditions
            </CardDescription>
          </div>
          <Lightbulb className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success) {
    return (
      <Card data-testid="tips-error">
        <CardHeader className="gap-2 flex-wrap flex-row items-center justify-between">
          <div>
            <CardTitle>Smart Tax Tips</CardTitle>
            <CardDescription>Temporarily unavailable</CardDescription>
          </div>
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
      </Card>
    );
  }

  const tips = data.data;

  return (
    <Card data-testid="card-tax-tips">
      <CardHeader className="gap-2 flex-wrap flex-row items-center justify-between">
        <div>
          <CardTitle>Smart Tax Tips</CardTitle>
          <CardDescription>
            Personalized recommendations based on current economic conditions
          </CardDescription>
        </div>
        <Lightbulb className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.length === 0 ? (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              No specific tips available right now. Check back later for personalized advice!
            </AlertDescription>
          </Alert>
        ) : (
          tips.map((tip, index) => (
            <Alert key={index} data-testid={`tip-${index}`}>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {tip}
              </AlertDescription>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );
}
