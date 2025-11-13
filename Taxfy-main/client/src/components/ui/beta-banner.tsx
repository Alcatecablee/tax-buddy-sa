import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Heart, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BetaBannerProps {
  className?: string;
  variant?: 'top' | 'floating' | 'corner';
  dismissible?: boolean;
  animated?: boolean;
}

export function BetaBanner({ 
  className, 
  variant = 'top',
  dismissible = true,
  animated = true 
}: BetaBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (variant === 'corner') {
    return (
      <div className={cn(
        "fixed top-4 right-4 z-50",
        animated && "animate-bounce",
        className
      )}>
        <Badge className="bg-primary text-primary-foreground px-3 py-2 rounded-full shadow-lg border-0 text-sm font-semibold">
          <Sparkles className="w-4 h-4 mr-1" />
          BETA
          <Heart className="w-3 h-3 ml-1 fill-white" />
        </Badge>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
        className
      )}>
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border px-4 py-2 flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-2",
            animated && "animate-pulse"
          )}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-primary">
              BETA VERSION
            </span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </div>
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto ml-2"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default 'top' variant
  return (
    <div className={cn(
      "bg-primary text-primary-foreground relative overflow-hidden border-b",
      className
    )}>
      {/* Animated background elements */}
      {animated && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
        </div>
      )}
      
      <div className="relative px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className={cn("w-5 h-5", animated && "animate-spin")} />
            <span className="font-bold text-lg tracking-wide">BETA</span>
            <Zap className={cn("w-4 h-4", animated && "animate-pulse")} />
          </div>
          
          <div className="hidden sm:block">
            <span className="text-sm font-medium">
              You're using the beta version! Help us improve by sharing feedback
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 fill-white animate-pulse" />
            <span className="text-xs font-medium hidden md:inline">Made with love</span>
          </div>
          
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto text-white hover:bg-white/20 ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Mobile version */}
        <div className="sm:hidden text-center mt-1">
          <span className="text-xs">
            Beta version - Share your feedback!
          </span>
        </div>
      </div>
    </div>
  );
}

// Alternative cute variants
export function CuteBetaBadge({ className }: { className?: string }) {
  return (
    <Badge className={cn(
      "bg-primary text-primary-foreground border-0 px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-shadow",
      className
    )}>
      <span className="mr-1">✨</span>
      BETA
      <span className="ml-1">💜</span>
    </Badge>
  );
}

export function FloatingBetaHeart({ className }: { className?: string }) {
  return (
    <div className={cn(
      "fixed top-6 right-6 z-50 animate-bounce",
      className
    )}>
      <div className="relative">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <Heart className="w-6 h-6 text-white fill-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 shadow-md">
          <span className="text-xs font-bold text-primary">β</span>
        </div>
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
      </div>
    </div>
  );
}

export function BetaRibbon({ className }: { className?: string }) {
  return (
    <div className={cn("fixed top-0 right-0 z-50", className)}>
      <div className="relative">
        <div className="bg-primary text-primary-foreground px-8 py-2 transform rotate-45 translate-x-6 translate-y-4 shadow-lg">
          <div className="flex items-center gap-1 -rotate-45">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-bold">BETA</span>
            <Star className="w-3 h-3 fill-white" />
          </div>
        </div>
      </div>
    </div>
  );
}