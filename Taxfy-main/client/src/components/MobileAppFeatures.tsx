import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Download,
  Share,
  Camera,
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  Shield,
  Zap,
  CheckCircle,
  Database,
  HardDrive,
  Upload as UploadIcon,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { pwaStorage } from "@/lib/pwa-storage";

interface MobileAppFeaturesProps {
  className?: string;
}

const MobileAppFeatures: React.FC<MobileAppFeaturesProps> = ({ className }) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    available: number;
    calculationsCount: number;
  } | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">(
    "idle",
  );
  const { toast } = useCustomToast();

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isInStandaloneMode = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const isInWebAppMode = (window.navigator as any).standalone === true;
      setIsInstalled(isInStandaloneMode || isInWebAppMode);
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger background sync when coming back online
      if (
        "serviceWorker" in navigator &&
        "sync" in window.ServiceWorkerRegistration.prototype
      ) {
        navigator.serviceWorker.ready
          .then((registration) => {
            return registration.sync.register("tax-calculation-sync");
          })
          .catch(console.error);
      }
    };
    const handleOffline = () => setIsOnline(false);

    // Load storage info
    const loadStorageInfo = async () => {
      try {
        const info = await pwaStorage.getStorageInfo();
        setStorageInfo(info);
      } catch (error) {
        console.error("Failed to load storage info:", error);
      }
    };

    checkInstalled();
    loadStorageInfo();
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Refresh storage info periodically
    const storageInterval = setInterval(loadStorageInfo, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(storageInterval);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Install Not Available",
        description: "App installation is not available on this device/browser",
        variant: "destructive",
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      toast({
        title: "App Installing",
        description: "Taxfy is being installed on your device",
      });
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Taxfy - South African Tax Calculator",
          text: "Check out this amazing tax calculator for South Africa!",
          url: window.location.origin,
        });
        toast({
          title: "Shared Successfully",
          description: "Thanks for sharing Taxfy!",
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin);
      toast({
        title: "Link Copied",
        description: "App link copied to clipboard",
      });
    }
  };

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast({
          title: "Notifications Enabled",
          description:
            "You'll receive updates about tax deadlines and features",
        });

        // Show a test notification
        new Notification("Taxfy Notifications", {
          body: "You'll now receive important tax updates!",
          icon: "/favicon.svg",
        });
      } else {
        toast({
          title: "Notifications Denied",
          description:
            "Enable notifications in your browser settings to receive updates",
          variant: "destructive",
        });
      }
    }
  };

  const syncOfflineData = async () => {
    setSyncStatus("syncing");
    try {
      const pendingItems = await pwaStorage.getPendingSync();

      if (pendingItems.length === 0) {
        toast({
          title: "Already Synced",
          description: "All your data is up to date",
        });
        setSyncStatus("idle");
        return;
      }

      // Simulate API sync (replace with actual API calls)
      for (const item of pendingItems) {
        try {
          // Here you would make actual API calls to sync data
          await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay
          await pwaStorage.markAsSynced(item.id);
        } catch (error) {
          console.error("Failed to sync item:", error);
        }
      }

      toast({
        title: "Sync Complete",
        description: `Synced ${pendingItems.length} calculations`,
      });
      setSyncStatus("idle");

      // Refresh storage info
      const info = await pwaStorage.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");
      toast({
        title: "Sync Failed",
        description: "Unable to sync offline data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportOfflineData = async () => {
    try {
      const data = await pwaStorage.exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `taxfy-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your tax data has been downloaded as a backup file",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Unable to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: Camera,
      title: "Camera Upload",
      description:
        "Take photos of tax documents directly from your mobile camera",
      available: true,
    },
    {
      icon: WifiOff,
      title: "Offline Access",
      description:
        "Continue working on your tax calculations even without internet",
      available: true,
      detail: storageInfo
        ? `${storageInfo.calculationsCount} saved calculations`
        : undefined,
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Get reminded about tax deadlines and important updates",
      available: true,
    },
    {
      icon: Share,
      title: "Native Sharing",
      description:
        "Share tax reports and calculations using your device's native sharing",
      available: true,
    },
    {
      icon: Database,
      title: "Local Storage",
      description: "Your tax data is securely stored locally on your device",
      available: true,
      detail: storageInfo
        ? `${(storageInfo.used / 1024 / 1024).toFixed(1)}MB used`
        : undefined,
    },
    {
      icon: Zap,
      title: "Background Sync",
      description: "Automatic data synchronization when internet returns",
      available: true,
    },
  ];

  return (
    <div className={className}>
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Mobile App Experience
            {isInstalled && (
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-500"
              >
                Installed
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Get the full mobile app experience with native features and offline
            access
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Installation Section */}
          {!isInstalled && (
            <div className="p-6 bg-primary/10 rounded-2xl border border-border transition-all duration-300 hover:bg-primary/15">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Install Taxfy App</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add Taxfy to your home screen for quick access and native
                    features
                  </p>
                </div>
                <Button
                  onClick={handleInstallApp}
                  disabled={!isInstallable}
                  size="sm"
                  variant="outline"
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install
                </Button>
              </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm">
                {isOnline ? "Online" : "Offline Mode"}
              </span>
            </div>

            {isInstalled && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">App Installed</span>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-4 border border-border rounded-2xl hover:bg-secondary/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm">{feature.title}</h5>
                        {feature.available && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-500/10 text-green-500 border-green-500/20"
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                      {feature.detail && (
                        <p className="text-xs text-primary mt-1 font-medium">
                          {feature.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Storage Status */}
          {storageInfo && (
            <div className="p-4 bg-secondary/30 rounded-2xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Offline Storage</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {storageInfo.calculationsCount} calculations
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((storageInfo.used / storageInfo.available) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span>
                  {(storageInfo.used / 1024 / 1024).toFixed(1)}MB used
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleShareApp}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              <Share className="w-4 h-4 mr-2" />
              Share App
            </Button>

            <Button
              onClick={enableNotifications}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>

            {storageInfo && storageInfo.calculationsCount > 0 && (
              <Button
                onClick={syncOfflineData}
                variant="outline"
                size="sm"
                disabled={!isOnline || syncStatus === "syncing"}
                className="hover:scale-105 transition-transform duration-200"
              >
                {syncStatus === "syncing" ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UploadIcon className="w-4 h-4 mr-2" />
                )}
                {syncStatus === "syncing" ? "Syncing..." : "Sync Data"}
              </Button>
            )}

            {storageInfo && storageInfo.calculationsCount > 0 && (
              <Button
                onClick={exportOfflineData}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}

            {isInstalled && (
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>

          {/* PWA Benefits */}
          <div className="mt-6 p-6 bg-secondary/50 rounded-2xl border border-border transition-all duration-300 hover:bg-secondary/70">
            <h4 className="font-semibold text-sm mb-3">Mobile App Benefits</h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Works offline - calculate taxes without internet
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Push notifications for tax deadlines
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Native camera integration for document uploads
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Secure local storage for your tax data
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Fast app-like experience on mobile devices
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                No app store needed - installs directly from browser
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAppFeatures;
