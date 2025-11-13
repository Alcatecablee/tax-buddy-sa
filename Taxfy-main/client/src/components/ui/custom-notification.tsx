import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomNotificationProps {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  onClose: (id: string) => void;
}

export const CustomNotification: React.FC<CustomNotificationProps> = ({
  id,
  title,
  description,
  variant = 'default',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Show notification with animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    console.log("🔔 Custom notification close clicked:", id);
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Allow close animation to complete
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[9999] w-full max-w-md transform transition-all duration-300 ease-out",
        isVisible && !isClosing ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
      )}
    >
      <div
        className={cn(
          "relative flex w-full items-start justify-between space-x-4 overflow-hidden rounded-lg border-2 p-6 pr-12 shadow-2xl backdrop-blur-md min-h-[120px]",
          variant === 'default' 
            ? "border-primary/50 bg-background/98 text-foreground shadow-primary/30 ring-2 ring-primary/20"
            : "border-destructive/60 bg-destructive/15 text-destructive-foreground shadow-destructive/30 ring-2 ring-destructive/20"
        )}
      >
        <div className="flex-1 space-y-2">
          <h4 className="text-lg font-semibold leading-tight">{title}</h4>
          <p className="text-sm leading-relaxed opacity-90">{description}</p>
        </div>
        
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-foreground/80 opacity-100 transition-all hover:text-foreground hover:bg-muted/70 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary bg-background/90 border border-border/60 shadow-md hover:shadow-lg hover:scale-105"
          aria-label="Close notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

interface CustomNotificationManagerProps {
  toasts: Array<{
    id: string;
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
  }>;
  removeToast: (id: string) => void;
}

export const CustomNotificationManager: React.FC<CustomNotificationManagerProps> = ({
  toasts,
  removeToast
}) => {
  // Add null check to prevent the error
  if (!toasts || !Array.isArray(toasts)) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {toasts.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(-${index * 10}px)`,
            zIndex: 9999 - index
          }}
        >
          <CustomNotification
            {...notification}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
}; 