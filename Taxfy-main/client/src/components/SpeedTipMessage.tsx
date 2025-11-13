import React from 'react';
import { Zap, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SpeedTipVariant = 
  | 'subtle'      // Light background, small text - for headers/navigation
  | 'prominent'   // Bold background, larger text - for main content areas
  | 'processing'  // Animated, attention-grabbing - for loading states
  | 'error'       // Muted, encouraging - for error states
  | 'success'     // Celebration style - for completion states
  | 'inline'      // Minimal, text-only - for inline content
  | 'badge';      // Compact badge style - for hero sections

interface SpeedTipMessageProps {
  variant?: SpeedTipVariant;
  className?: string;
  showIcon?: boolean;
  customMessage?: string;
}

const SpeedTipMessage: React.FC<SpeedTipMessageProps> = ({
  variant = 'subtle',
  className,
  showIcon = true,
  customMessage
}) => {
  const baseMessage = "Our AI processes IRP5s in under 30 seconds, saving you hours of manual data entry!";
  const message = customMessage || baseMessage;

  const getVariantStyles = () => {
    switch (variant) {
      case 'subtle':
        return {
          container: "flex items-center gap-3 p-4 bg-primary/10 rounded-2xl border border-primary/20",
          icon: "text-2xl",
          text: "text-sm text-primary",
          prefix: "Pro Tip:"
        };
      
      case 'prominent':
        return {
          container: "text-center p-6 bg-yellow-500/10 rounded-2xl border border-yellow-500/20",
          icon: "text-4xl mb-2",
          text: "text-sm text-yellow-600",
          prefix: "Lightning Fast Processing",
          showTitle: true
        };
      
      case 'processing':
        return {
          container: "text-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20",
          icon: "text-4xl mb-2",
          text: "text-sm text-green-600",
          prefix: "Speed Advantage",
          showTitle: true
        };
      
      case 'error':
        return {
          container: "text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20",
          icon: "w-4 h-4",
          text: "text-xs text-blue-600",
          prefix: "Remember:"
        };
      
      case 'success':
        return {
          container: "text-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20",
          icon: "text-4xl mb-2",
          text: "text-sm text-green-600",
          prefix: "Success!"
        };
      
      case 'inline':
        return {
          container: "flex items-center gap-2",
          icon: "w-4 h-4 text-yellow-500",
          text: "text-sm text-yellow-600 font-medium",
          prefix: ""
        };
      
      case 'badge':
        return {
          container: "inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20",
          icon: "text-xl",
          text: "text-sm text-primary",
          prefix: "⚡"
        };
      
      default:
        return {
          container: "flex items-center gap-3 p-4 bg-muted/20 rounded-lg border border-border",
          icon: "w-5 h-5 text-muted-foreground",
          text: "text-sm text-muted-foreground",
          prefix: "Tip:"
        };
    }
  };

  const styles = getVariantStyles();

  const getIcon = () => {
    switch (variant) {
      case 'error':
        return <Info className={styles.icon} />;
      case 'success':
        return <CheckCircle className={styles.icon} />;
      default:
        return <Zap className={styles.icon} />;
    }
  };

  return (
    <div className={cn(styles.container, className)}>
      {showIcon && getIcon()}
      <div className={variant === 'prominent' || variant === 'processing' ? "flex-1" : ""}>
        {styles.showTitle && (
          <div className="flex items-center justify-center gap-2 mb-2">
            {!showIcon && getIcon()}
            <span className="font-semibold text-current">{styles.prefix}</span>
          </div>
        )}
        <p className={styles.text}>
          {!styles.showTitle && styles.prefix && (
            <strong>{styles.prefix} </strong>
          )}
          {message}
        </p>
      </div>
    </div>
  );
};

export default SpeedTipMessage; 