import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { AnomalyFlag } from '../types/IRP5';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface AnomalyDetectionCardProps {
  anomalies: AnomalyFlag[];
  className?: string;
}

export function AnomalyDetectionCard({ anomalies, className }: AnomalyDetectionCardProps) {
  const getIcon = (type: AnomalyFlag['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: AnomalyFlag['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertVariant = (type: AnomalyFlag['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  const highPriorityAnomalies = anomalies.filter(a => a.severity === 'high');
  const mediumPriorityAnomalies = anomalies.filter(a => a.severity === 'medium');
  const lowPriorityAnomalies = anomalies.filter(a => a.severity === 'low');

  if (anomalies.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Data Quality Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">No anomalies detected</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Your IRP5 data appears consistent and within normal ranges.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Data Quality Analysis
          <Badge variant="outline" className="ml-auto">
            {anomalies.length} issue{anomalies.length !== 1 ? 's' : ''} found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* High Priority Issues */}
        {highPriorityAnomalies.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              High Priority Issues ({highPriorityAnomalies.length})
            </h4>
            {highPriorityAnomalies.map((anomaly, index) => (
              <Alert key={`high-${index}`} variant={getAlertVariant(anomaly.type)}>
                <div className="flex items-start gap-3">
                  {getIcon(anomaly.type)}
                  <div className="flex-1 space-y-2">
                    <AlertDescription className="font-medium">
                      {anomaly.message}
                    </AlertDescription>
                    {anomaly.suggestion && (
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        <strong>Suggestion:</strong> {anomaly.suggestion}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Field: {anomaly.field}
                      </span>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Medium Priority Issues */}
        {mediumPriorityAnomalies.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-yellow-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Medium Priority Issues ({mediumPriorityAnomalies.length})
            </h4>
            {mediumPriorityAnomalies.map((anomaly, index) => (
              <Alert key={`medium-${index}`} variant="default">
                <div className="flex items-start gap-3">
                  {getIcon(anomaly.type)}
                  <div className="flex-1 space-y-2">
                    <AlertDescription>
                      {anomaly.message}
                    </AlertDescription>
                    {anomaly.suggestion && (
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        <strong>Suggestion:</strong> {anomaly.suggestion}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Field: {anomaly.field}
                      </span>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Low Priority Issues */}
        {lowPriorityAnomalies.length > 0 && (
          <details className="space-y-3">
            <summary className="font-medium text-blue-600 flex items-center gap-2 cursor-pointer">
              <Info className="h-4 w-4" />
              Low Priority Issues ({lowPriorityAnomalies.length}) - Click to expand
            </summary>
            <div className="space-y-3 mt-3">
              {lowPriorityAnomalies.map((anomaly, index) => (
                <Alert key={`low-${index}`} variant="default">
                  <div className="flex items-start gap-3">
                    {getIcon(anomaly.type)}
                    <div className="flex-1 space-y-2">
                      <AlertDescription>
                        {anomaly.message}
                      </AlertDescription>
                      {anomaly.suggestion && (
                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                          <strong>Suggestion:</strong> {anomaly.suggestion}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Field: {anomaly.field}
                        </span>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </details>
        )}

        {/* Summary and Action Items */}
        {anomalies.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Next Steps</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {highPriorityAnomalies.length > 0 && (
                <li>• Address high-priority issues immediately to avoid SARS penalties</li>
              )}
              {anomalies.some(a => a.code.includes('PAYE')) && (
                <li>• Consider making additional PAYE payments via eFiling eWallet</li>
              )}
              {anomalies.some(a => a.code.includes('MEDICAL')) && (
                <li>• Review your medical aid certificate and dependent information</li>
              )}
              {anomalies.length > 3 && (
                <li>• Consider professional tax review before filing your return</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 