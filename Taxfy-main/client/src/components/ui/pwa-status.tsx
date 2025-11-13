import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  WifiOff,
  Download,
  CheckCircle,
  Smartphone,
  RefreshCw,
} from "lucide-react";

interface PWAStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({
  className = "",
  showDetails = false,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isInStandaloneMode = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const isInWebAppMode = (window.navigator as any).standalone === true;
      setIsInstalled(isInStandaloneMode || isInWebAppMode);
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for service worker updates
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    checkInstalled();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check for service worker updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        handleUpdateAvailable,
      );
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          handleUpdateAvailable,
        );
      }
    };
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showDetails) {
    // Compact status indicator
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-primary" />
          )}
          <span className="text-xs text-muted-foreground">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {isInstalled && (
          <Badge
            variant="outline"
            className="text-xs bg-green-500/10 text-green-500 border-green-500/20"
          >
            <Smartphone className="w-3 h-3 mr-1" />
            App
          </Badge>
        )}

        {updateAvailable && (
          <Badge
            variant="outline"
            className="text-xs bg-primary/10 text-primary border-primary/20 cursor-pointer"
            onClick={handleUpdate}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Update
          </Badge>
        )}
      </div>
    );
  }

  // Detailed status display
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">App Status</span>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20"
            >
              <Wifi className="w-3 h-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20"
            >
              <WifiOff className="w-3 h-3 mr-1" />
              Offline Mode
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          {isInstalled ? (
            <CheckCircle className="w-3 h-3 text-green-500" />
          ) : (
            <Download className="w-3 h-3 text-muted-foreground" />
          )}
          <span
            className={isInstalled ? "text-green-500" : "text-muted-foreground"}
          >
            {isInstalled ? "Installed" : "Web Version"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-green-500">Offline Ready</span>
        </div>
      </div>

      {updateAvailable && (
        <div
          className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors"
          onClick={handleUpdate}
        >
          <RefreshCw className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">
            Update Available - Click to refresh
          </span>
        </div>
      )}

      {!isOnline && (
        <div className="p-2 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            You're working offline. Changes will sync when internet returns.
          </p>
        </div>
      )}
    </div>
  );
};

export default PWAStatus;
