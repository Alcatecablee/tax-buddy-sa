import React from 'react';
import { X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AiFeedbackCardProps {
  field: string;
  status: 'good' | 'warning' | 'error';
  message: string;
  confidence: number;
  suggestions?: string[];
  onDismiss: () => void;
}

const AiFeedbackCard: React.FC<AiFeedbackCardProps> = ({
  field,
  status,
  message,
  confidence,
  suggestions,
  onDismiss
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'good':
        return 'border-green-500/30 bg-green-500/10 text-green-300';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
      case 'error':
        return 'border-red-500/30 bg-red-500/10 text-red-300';
      default:
        return 'border-border/50 bg-muted/20 text-muted-foreground';
    }
  };

  const getConfidenceColor = () => {
    if (confidence >= 85) return 'bg-green-500/20 text-green-300';
    if (confidence >= 70) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-red-500/20 text-red-300';
  };

  return (
    <Card className={`${getStatusStyles()} border animate-fade-in mt-2`}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Brain className="w-3 h-3" />
              <span className="text-xs font-medium">AI Analysis</span>
              {confidence > 0 && (
                <Badge className={`text-xs ${getConfidenceColor()}`}>
                  {confidence}%
                </Badge>
              )}
            </div>
            
            <div className="text-sm font-medium mb-1">
              {message}
            </div>
            
            {suggestions && suggestions.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-medium mb-1">Suggestions:</div>
                <ul className="text-xs space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 ml-2 hover:bg-black/10"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="mt-2 pt-2 border-t border-current/20">
          <button
            onClick={onDismiss}
            className="text-xs underline hover:no-underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiFeedbackCard;
