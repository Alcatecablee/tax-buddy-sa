import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Suggestion {
  id: string;
  type: 'uif' | 'retirement';
  title: string;
  amount: number;
  confidence: 'high' | 'medium' | 'low';
  description: string;
  field: string;
}

interface SmartSuggestionsProps {
  grossSalary: number;
  onApplySuggestion: (field: string, amount: number) => void;
  appliedSuggestions: string[];
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  grossSalary,
  onApplySuggestion,
  appliedSuggestions
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (grossSalary > 0) {
      const newSuggestions = generateSuggestions(grossSalary);
      setSuggestions(newSuggestions);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [grossSalary]);

  const generateSuggestions = (salary: number): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    // UIF Suggestion (1% of salary, capped at R185.04 monthly = R2,220.48 annually)
    const uifRate = 0.01;
    const uifCap = 2220.48;
    const uifAmount = Math.min(salary * uifRate, uifCap);
    
    suggestions.push({
      id: 'uif-standard',
      type: 'uif',
      title: 'UIF Contribution',
      amount: Math.round(uifAmount),
      confidence: 'high',
      description: `1% of gross salary (${uifAmount > uifCap * 0.9 ? 'capped' : 'standard rate'})`,
      field: 'uifContribution'
    });

    // Retirement Suggestions
    const maxRetirement = Math.min(salary * 0.275, 350000); // 27.5% capped at R350,000
    const conservativeRetirement = Math.min(salary * 0.15, 300000); // 15% conservative

    suggestions.push({
      id: 'retirement-max',
      type: 'retirement',
      title: 'Maximum Retirement (27.5%)',
      amount: Math.round(maxRetirement),
      confidence: 'medium',
      description: `Optimize tax benefits with ${maxRetirement >= 350000 ? 'capped' : 'full'} deduction`,
      field: 'retirementContribution'
    });

    suggestions.push({
      id: 'retirement-conservative',
      type: 'retirement',
      title: 'Conservative Retirement (15%)',
      amount: Math.round(conservativeRetirement),
      confidence: 'medium',
      description: 'Balanced approach for retirement savings',
      field: 'retirementContribution'
    });

    return suggestions;
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'uif': return <Shield className="w-4 h-4" />;
      case 'retirement': return <TrendingUp className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const handleApply = (suggestion: Suggestion) => {
    onApplySuggestion(suggestion.field, suggestion.amount);
  };

  const filteredSuggestions = suggestions.filter(s => !appliedSuggestions.includes(s.id));

  if (!isVisible || filteredSuggestions.length === 0) return null;

  return (
    <Card className="border-blue-500/30 bg-blue-500/10 animate-fade-in backdrop-blur-sm">
      <CardHeader className="pb-3 bg-blue-500/5 border-b border-blue-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-blue-300 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            Smart Suggestions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 bg-background/30">
        {filteredSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-background/50 rounded-lg p-3 border border-border/50 transition-all duration-200 hover:shadow-md hover:bg-background/70"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getIcon(suggestion.type)}
                  <span className="font-medium text-foreground">{suggestion.title}</span>
                  <Badge className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                    {suggestion.confidence} confidence
                  </Badge>
                </div>
                <div className="text-lg font-bold text-foreground mb-1">
                  R{suggestion.amount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">{suggestion.description}</div>
              </div>
              <Button
                size="sm"
                onClick={() => handleApply(suggestion)}
                className="ml-3 bg-blue-600 hover:bg-blue-700"
              >
                Apply
              </Button>
            </div>
          </div>
        ))}
        
        {filteredSuggestions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
          >
            Hide Suggestions
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
