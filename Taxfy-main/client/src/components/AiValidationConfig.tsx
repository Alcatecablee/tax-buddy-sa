import React from 'react';
import { Brain, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ValidationResult } from '@/hooks/useAiValidation';

interface AiValidationConfigProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  activeChecks: number;
  validationResults: Record<string, ValidationResult>;
  loadingFields: Set<string>;
}

const AiValidationConfig: React.FC<AiValidationConfigProps> = ({
  enabled,
  onToggle,
  activeChecks,
  validationResults,
  loadingFields
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const fieldLabels = {
    grossSalary: 'Salary',
    payeWithheld: 'PAYE',
    retirementContribution: 'Retirement',
    medicalAidContribution: 'Medical Aid',
    medicalCredits: 'Med Credits',
    uifContribution: 'UIF',
    travelAllowance: 'Travel'
  };

  return (
    <Card className="border-border bg-card/50 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-purple-800 flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            AI Validation
            <Badge className={`ml-2 ${enabled ? 'bg-green-500/20 text-green-400' : 'bg-secondary text-secondary-foreground'}`}>
              {enabled ? 'ON' : 'OFF'}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(!enabled)}
            className="text-purple-600 hover:text-purple-800"
          >
            {enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {enabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-purple-600 font-medium">Threshold:</span>
            <span className="ml-1 text-purple-800">R1,000+</span>
          </div>
          <div>
            <span className="text-purple-600 font-medium">Delay:</span>
            <span className="ml-1 text-purple-800">2 seconds</span>
          </div>
        </div>

        {enabled && (
          <>
            {activeChecks > 0 && (
              <div className="bg-card rounded-lg p-2 border border-border animate-fade-in">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                  <span className="text-xs text-purple-700">
                    AI analyzing {activeChecks} field{activeChecks !== 1 ? 's' : ''}...
                  </span>
                </div>
              </div>
            )}

            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="text-xs font-medium text-purple-600 mb-2">Field Status:</div>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(fieldLabels).map(([field, label]) => {
                  const isLoading = loadingFields.has(field);
                  const result = validationResults[field];
                  const status = result?.status || 'none';
                  
                  return (
                    <div key={field} className="flex items-center space-x-1">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-600"></div>
                      ) : (
                        <span className="text-xs">{getStatusIcon(status)}</span>
                      )}
                      <span className="text-xs text-gray-600 truncate">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!enabled && (
          <div className="text-xs text-gray-600 italic">
            AI validation is disabled. Enable to get real-time field analysis.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiValidationConfig;
