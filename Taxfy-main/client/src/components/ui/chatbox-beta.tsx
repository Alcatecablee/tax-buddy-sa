import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Sparkles, 
  Heart,
  Send,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatboxBetaProps {
  className?: string;
}

export function ChatboxBeta({ className }: ChatboxBetaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  // Auto-show the chatbox after a few seconds for first-time users
  useEffect(() => {
    const hasSeenBeta = localStorage.getItem('taxfy-beta-seen');
    if (!hasSeenBeta) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasNewMessage(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);
    localStorage.setItem('taxfy-beta-seen', 'true');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  if (!isOpen && !isMinimized) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={handleOpen}
          className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 relative"
        >
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Card className="w-72 shadow-lg border-primary/20">
          <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-sm">Taxfy Beta</div>
                <div className="text-xs opacity-80">We're here to help!</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="p-1 h-auto text-primary-foreground hover:bg-primary-foreground/20"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1 h-auto text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card className="w-80 h-96 shadow-xl border-primary/20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                Taxfy Beta
                <Badge className="bg-primary-foreground/20 text-primary-foreground text-xs px-2 py-0.5">
                  <Sparkles className="w-3 h-3 mr-1" />
                  BETA
                </Badge>
              </div>
              <div className="text-xs opacity-80">Always here to help</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimize}
              className="p-1 h-auto text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-auto text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-muted/20">
          {/* Welcome Message */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm max-w-[85%]">
              <div className="text-sm">
                <div className="font-medium text-primary mb-1">Welcome to Taxfy Beta! 🎉</div>
                <div className="text-muted-foreground">
                  You're using our beta version! We're constantly improving and would love your feedback.
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlight */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm max-w-[85%]">
              <div className="text-sm text-muted-foreground">
                <div className="mb-2">✨ <strong>What's new in Beta:</strong></div>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• Enhanced tax calculations</li>
                  <li>• Improved document processing</li>
                  <li>• Better user experience</li>
                  <li>• Real-time validation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feedback Request */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm max-w-[85%]">
              <div className="text-sm text-muted-foreground">
                Found a bug or have suggestions? Click the contact button in the navigation to share your feedback!
              </div>
            </div>
          </div>
        </div>

        {/* Future Chat Input Area */}
        <div className="p-4 border-t bg-muted/10">
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
              Chat feature coming soon...
            </div>
            <Button size="sm" disabled className="p-2">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Real chat support coming in the next update!
          </div>
        </div>
      </Card>
    </div>
  );
}