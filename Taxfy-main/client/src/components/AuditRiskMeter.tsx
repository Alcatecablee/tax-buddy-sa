import React from 'react';
import { Shield, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { AuditRiskResult, getTopRiskFactors, getAuditRiskExplanation } from '../lib/auditRiskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface AuditRiskMeterProps {
  riskResult: AuditRiskResult;
  className?: string;
}

export function AuditRiskMeter({ riskResult, className }: AuditRiskMeterProps) {
  const { score, level, factors, recommendations, color } = riskResult;
  
  const topRiskFactors = getTopRiskFactors(factors);
  const explanation = getAuditRiskExplanation(score);

  const getRiskIcon = () => {
    switch (level) {
      case 'Very High':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'High':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'Medium':
        return <Eye className="h-6 w-6 text-yellow-500" />;
      case 'Low':
        return <Shield className="h-6 w-6 text-green-600" />;
      default:
        return <Shield className="h-6 w-6 text-gray-500" />;
    }
  };

  const getRiskColor = () => {
    switch (level) {
      case 'Very High':
        return 'bg-red-600';
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getBadgeVariant = () => {
    switch (level) {
      case 'Very High':
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getRiskIcon()}
          Audit Risk Assessment
          <Badge variant={getBadgeVariant()} className="ml-auto">
            {level} Risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score Gauge */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 mx-auto relative">
              {/* Background circle */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(score / 100) * 314} 314`}
                  className={getRiskColor().replace('bg-', 'text-')}
                  strokeLinecap="round"
                />
              </svg>
              {/* Score text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${color}`}>{score}</div>
                  <div className="text-xs text-gray-500">/ 100</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${color}`}>
              {level} Audit Risk
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              {explanation}
            </p>
          </div>
        </div>

        {/* Risk Factors Breakdown */}
        {topRiskFactors.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Risk Factors
            </h4>
            <div className="space-y-2">
              {topRiskFactors.map((factor, index) => (
                <TooltipProvider key={factor.factor}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium">{factor.description}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={factor.score} 
                            className="w-16 h-2" 
                          />
                          <span className="text-xs font-medium text-gray-600 w-8">
                            {factor.score}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Risk contribution: {factor.score} points</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Recommendations</h4>
            <div className="space-y-2">
              {recommendations.slice(0, 5).map((recommendation, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="text-blue-600 mt-0.5">•</div>
                  <span className="text-sm text-blue-800">{recommendation}</span>
                </div>
              ))}
              {recommendations.length > 5 && (
                <details className="mt-2">
                  <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                    Show {recommendations.length - 5} more recommendations
                  </summary>
                  <div className="space-y-2 mt-2">
                    {recommendations.slice(5).map((recommendation, index) => (
                      <div 
                        key={index + 5}
                        className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="text-blue-600 mt-0.5">•</div>
                        <span className="text-sm text-blue-800">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Risk Level Guide */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Risk Level Guide</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Low (0-29): Minimal audit risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium (30-49): Some attention</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High (50-69): Likely scrutiny</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Very High (70+): High audit risk</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 