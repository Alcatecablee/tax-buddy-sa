import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  X,
  Smartphone,
  CheckCircle,
  Zap,
  Shield,
  WifiOff,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  onInstall,
  onDismiss,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useCustomToast();

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isInStandaloneMode = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const isInWebAppMode = (window.navigator as any).standalone === true;
      const isInstalled = isInStandaloneMode || isInWebAppMode;
      setIsInstalled(isInstalled);

      // Don't show prompt if already installed
      if (isInstalled) {
        setShowPrompt(false);
        return;
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after a short delay if user seems engaged
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      }, 10000); // 10 seconds delay
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      toast({
        title: "App Installed! 🎉",
        description: "Taxfy has been added to your home screen",
      });
    };

    checkInstalled();
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled, toast]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Install Not Available",
        description: "App installation is not available on this device/browser",
        variant: "destructive",
      });
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        toast({
          title: "Installing...",
          description: "Taxfy is being installed on your device",
        });
        onInstall?.();
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error("Install failed:", error);
      toast({
        title: "Install Failed",
        description: "Unable to install the app. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();

    // Don't show again for 24 hours
    localStorage.setItem(
      "pwa-install-dismissed",
      (Date.now() + 24 * 60 * 60 * 1000).toString(),
    );
  };

  // Check if previously dismissed and still within cooldown
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed && Date.now() < parseInt(dismissed)) {
      setShowPrompt(false);
    }
  }, []);

  if (!showPrompt || isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:bottom-6 md:right-6 md:max-w-sm">
      <Card className="border border-border bg-background/95 backdrop-blur-lg shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Install Taxfy</h3>
                <Badge
                  variant="secondary"
                  className="mt-1 bg-primary/10 text-primary"
                >
                  Free & Fast
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Add Taxfy to your home screen for instant access and offline
            features.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Works offline</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-3 h-3 text-primary" />
              <span>Lightning fast</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3 text-primary" />
              <span>Secure & private</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <WifiOff className="w-3 h-3 text-primary" />
              <span>No app store needed</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="flex-1 h-9 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="h-9 px-3 text-sm"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
