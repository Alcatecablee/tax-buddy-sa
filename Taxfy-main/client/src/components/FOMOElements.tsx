import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Zap, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Crown,
  Timer,
  Flame,
  Star,
  Lock,
  ArrowRight,
  Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface UsageWarningProps {
  current: number;
  limit: number;
  feature: string;
  onUpgrade?: () => void;
}

export const UsageWarning: React.FC<UsageWarningProps> = ({ 
  current, 
  limit, 
  feature, 
  onUpgrade 
}) => {
  const percentage = (current / limit) * 100;
  const remaining = limit - current;
  
  const getWarningLevel = () => {
    if (percentage >= 100) return 'critical';
    if (percentage >= 80) return 'warning';
    if (percentage >= 60) return 'caution';
    return 'normal';
  };

  const warningLevel = getWarningLevel();
  
  const getColors = () => {
    switch (warningLevel) {
      case 'critical':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          progress: 'bg-orange-500'
        };
      case 'caution':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          progress: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-400',
          progress: 'bg-green-500'
        };
    }
  };

  const colors = getColors();

  if (warningLevel === 'normal') return null;

  return (
    <Alert className={`${colors.bg} ${colors.border} mb-4`}>
      <AlertTriangle className={`h-4 w-4 ${colors.text}`} />
      <AlertDescription>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${colors.text}`}>
              {warningLevel === 'critical' 
                ? `You've reached your ${feature} limit!` 
                : `Only ${remaining} ${feature} remaining this month`
              }
            </span>
            <Badge variant="outline" className={`${colors.text} border-current`}>
              {current}/{limit}
            </Badge>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-2"
            style={{ 
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          
          {warningLevel === 'critical' ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Upgrade now to continue using {feature.toLowerCase()}
              </span>
              <Button size="sm" onClick={onUpgrade} className="ml-auto">
                <Crown className="w-3 h-3 mr-1" />
                Upgrade
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Don't get locked out—upgrade for unlimited access
              </span>
              <Button size="sm" variant="outline" onClick={onUpgrade}>
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

interface LimitedTimeOfferProps {
  title: string;
  description: string;
  discount: string;
  expiresIn: number; // hours
  onClaim?: () => void;
}

export const LimitedTimeOffer: React.FC<LimitedTimeOfferProps> = ({
  title,
  description,
  discount,
  expiresIn,
  onClaim
}) => {
  const [timeLeft, setTimeLeft] = useState(expiresIn * 3600); // Convert hours to seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  if (timeLeft <= 0) return null;

  return (
    <Card className="border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 sticky top-4 z-10">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              <Badge variant="destructive" className="animate-bounce">
                Limited Time
              </Badge>
              <div className="flex items-center gap-1 text-orange-400">
                <Timer className="w-4 h-4" />
                <span className="font-mono text-sm font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-orange-400 mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-orange-400">{discount}</div>
              <Button onClick={onClaim} className="bg-orange-500 hover:bg-orange-600">
                <Zap className="w-4 h-4 mr-2" />
                Claim Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface SocialProofBannerProps {
  userCount: number;
  recentActivity?: string;
  className?: string;
}

export const SocialProofBanner: React.FC<SocialProofBannerProps> = ({
  userCount,
  recentActivity = "calculated their tax refunds",
  className = ""
}) => {
  const [animatedCount, setAnimatedCount] = useState(userCount - 50);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedCount(prev => {
        if (prev >= userCount) return userCount;
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [userCount]);

  return (
    <div className={`bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/20 ${className}`}>
      <div className="flex items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-400" />
          <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-400 font-mono">
              {animatedCount.toLocaleString()}+
            </span>
            <span className="text-sm text-muted-foreground">
              South Africans have {recentActivity} this month
            </span>
          </div>
          <p className="text-xs text-green-400 mt-1">
            🔥 Join the thousands maximizing their refunds!
          </p>
        </div>
      </div>
    </div>
  );
};

interface FeatureTeaseProps {
  feature: string;
  description: string;
  requiredPlan: string;
  onUpgrade?: () => void;
  className?: string;
}

export const FeatureTease: React.FC<FeatureTeaseProps> = ({
  feature,
  description,
  requiredPlan,
  onUpgrade,
  className = ""
}) => {
  return (
    <div className={`relative group cursor-pointer ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300" />
      <Card className="relative border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">{feature}</span>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              {requiredPlan}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="w-full group-hover:scale-105 transition-transform duration-200"
          >
            <Crown className="w-3 h-3 mr-2" />
            Unlock Feature
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

interface UrgencyCountdownProps {
  message: string;
  timeLeft: number; // seconds
  onExpire?: () => void;
  variant?: 'warning' | 'danger' | 'info';
  ctaText?: string;
  onCtaClick?: () => void;
}

export const UrgencyCountdown: React.FC<UrgencyCountdownProps> = ({
  message,
  timeLeft: initialTime,
  onExpire,
  variant = 'warning',
  ctaText,
  onCtaClick
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (timeLeft <= 0) return null;

  return (
    <Alert className={getVariantStyles()}>
      <Clock className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <span>{message}</span>
            {ctaText && onCtaClick && (
              <div className="mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onCtaClick}
                  className="bg-background/50 hover:bg-background/80 border-current"
                >
                  <Save className="w-3 h-3 mr-2" />
                  {ctaText}
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Timer className="w-4 h-4" />
            <span className="font-mono font-bold text-lg">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

interface ProgressToUnlockProps {
  currentStep: number;
  totalSteps: number;
  nextFeature: string;
  onComplete?: () => void;
}

export const ProgressToUnlock: React.FC<ProgressToUnlockProps> = ({
  currentStep,
  totalSteps,
  nextFeature,
  onComplete
}) => {
  const percentage = (currentStep / totalSteps) * 100;
  const isComplete = currentStep >= totalSteps;

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-purple-500/5">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Progress to unlock {nextFeature}</span>
            <Badge variant="outline" className="text-primary border-primary">
              {currentStep}/{totalSteps}
            </Badge>
          </div>
          
          <Progress value={percentage} className="h-3" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isComplete 
                ? `🎉 Ready to unlock ${nextFeature}!` 
                : `${totalSteps - currentStep} steps remaining`
              }
            </span>
            {isComplete && (
              <Button size="sm" onClick={onComplete}>
                <Star className="w-3 h-3 mr-1" />
                Unlock Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 