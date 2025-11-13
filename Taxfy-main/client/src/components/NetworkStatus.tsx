import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface NetworkStatusProps {
  className?: string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseStatus, setSupabaseStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check Supabase connectivity
    checkSupabaseConnection();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      setSupabaseStatus("checking");
      const response = await fetch(
        "https://gegcqqedwmuncqdilbjx.supabase.co/rest/v1/",
        {
          method: "HEAD",
          signal: AbortSignal.timeout(5000),
        },
      );
      setSupabaseStatus(response.ok ? "online" : "offline");
    } catch (error) {
      setSupabaseStatus("offline");
    }
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4 text-red-600" />;
    if (supabaseStatus === "checking")
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />;
    if (supabaseStatus === "online")
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertTriangle className="h-4 w-4 text-orange-600" />;
  };

  const getStatusMessage = () => {
    if (!isOnline) return "No internet connection";
    if (supabaseStatus === "checking")
      return "Checking authentication service...";
    if (supabaseStatus === "online") return "All services operational";
    return "Authentication service unavailable - offline mode available";
  };

  const getAlertVariant = () => {
    if (!isOnline || supabaseStatus === "offline") return "destructive";
    if (supabaseStatus === "checking") return "default";
    return "default";
  };

  if (isOnline && supabaseStatus === "online") {
    return null; // Don't show anything when everything is working
  }

  return (
    <Alert className={className} variant={getAlertVariant()}>
      {getStatusIcon()}
      <AlertDescription className="flex items-center justify-between">
        <span>{getStatusMessage()}</span>
        {(supabaseStatus === "offline" || !isOnline) && (
          <Button
            variant="outline"
            size="sm"
            onClick={checkSupabaseConnection}
            className="ml-2"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
