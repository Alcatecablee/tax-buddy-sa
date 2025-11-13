import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Globe,
  Palette,
  Shield,
  Mail,
  Bell,
  Save,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppConfiguration {
  // General Settings
  appName: string;
  appDescription: string;
  appUrl: string;
  supportEmail: string;
  timezone: string;
  currency: string;
  language: string;

  // Feature Flags
  enableRegistration: boolean;
  enableGuestAccess: boolean;
  enableSubscriptions: boolean;
  enableApiAccess: boolean;
  enableBlogComments: boolean;
  enableAnalytics: boolean;
  maintenanceMode: boolean;

  // Limits & Quotas
  maxFileSize: number;
  maxUploadsPerDay: number;
  maxApiCallsPerHour: number;
  sessionTimeout: number;

  // Security Settings
  requireEmailVerification: boolean;
  enableTwoFactor: boolean;
  passwordMinLength: number;
  sessionSecurity: "low" | "medium" | "high";

  // Email Settings
  emailFromName: string;
  emailFromAddress: string;
  enableEmailNotifications: boolean;
  enableWelcomeEmail: boolean;
  enablePasswordResetEmail: boolean;

  // UI/UX Settings
  defaultTheme: "light" | "dark" | "system";
  enableAnimations: boolean;
  compactMode: boolean;
  showBranding: boolean;

  // Payment Settings
  enablePayments: boolean;
  paymentMode: "sandbox" | "production";
  currency: string;
  taxRate: number;

  // Compliance Settings
  enableCookieConsent: boolean;
  enableDataProcessingConsent: boolean;
  dataRetentionDays: number;
  enableAuditLog: boolean;
}

interface AppSettingsProps {}

const AppSettings: React.FC<AppSettingsProps> = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<AppConfiguration>({
    // General Settings
    appName: "Taxfy",
    appDescription: "South African Tax Calculator and Processing Platform",
    appUrl: "https://taxfy.co.za",
    supportEmail: "support@taxfy.co.za",
    timezone: "Africa/Johannesburg",
    currency: "ZAR",
    language: "en",

    // Feature Flags
    enableRegistration: true,
    enableGuestAccess: true,
    enableSubscriptions: true,
    enableApiAccess: true,
    enableBlogComments: false,
    enableAnalytics: true,
    maintenanceMode: false,

    // Limits & Quotas
    maxFileSize: 10, // MB
    maxUploadsPerDay: 50,
    maxApiCallsPerHour: 1000,
    sessionTimeout: 30, // minutes

    // Security Settings
    requireEmailVerification: true,
    enableTwoFactor: false,
    passwordMinLength: 8,
    sessionSecurity: "medium",

    // Email Settings
    emailFromName: "Taxfy Support",
    emailFromAddress: "noreply@taxfy.co.za",
    enableEmailNotifications: true,
    enableWelcomeEmail: true,
    enablePasswordResetEmail: true,

    // UI/UX Settings
    defaultTheme: "dark",
    enableAnimations: true,
    compactMode: false,
    showBranding: true,

    // Payment Settings
    enablePayments: true,
    paymentMode: "sandbox",
    taxRate: 15, // VAT rate

    // Compliance Settings
    enableCookieConsent: true,
    enableDataProcessingConsent: true,
    dataRetentionDays: 365,
    enableAuditLog: true,
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = (key: keyof AppConfiguration, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveConfiguration = async () => {
    setLoading(true);
    try {
      // In a real application, this would save to a backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate applying configuration
      console.log("Applying configuration:", config);

      toast({
        title: "Configuration Saved",
        description: "Application settings have been updated successfully",
      });

      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save application configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
      appName: "Taxfy",
      appDescription: "South African Tax Calculator and Processing Platform",
      appUrl: "https://taxfy.co.za",
      supportEmail: "support@taxfy.co.za",
      timezone: "Africa/Johannesburg",
      currency: "ZAR",
      language: "en",
      enableRegistration: true,
      enableGuestAccess: true,
      enableSubscriptions: true,
      enableApiAccess: true,
      enableBlogComments: false,
      enableAnalytics: true,
      maintenanceMode: false,
      maxFileSize: 10,
      maxUploadsPerDay: 50,
      maxApiCallsPerHour: 1000,
      sessionTimeout: 30,
      requireEmailVerification: true,
      enableTwoFactor: false,
      passwordMinLength: 8,
      sessionSecurity: "medium",
      emailFromName: "Taxfy Support",
      emailFromAddress: "noreply@taxfy.co.za",
      enableEmailNotifications: true,
      enableWelcomeEmail: true,
      enablePasswordResetEmail: true,
      defaultTheme: "dark",
      enableAnimations: true,
      compactMode: false,
      showBranding: true,
      enablePayments: true,
      paymentMode: "sandbox",
      taxRate: 15,
      enableCookieConsent: true,
      enableDataProcessingConsent: true,
      dataRetentionDays: 365,
      enableAuditLog: true,
    });
    setHasChanges(true);

    toast({
      title: "Settings Reset",
      description: "Configuration has been reset to default values",
    });
  };

  const exportConfiguration = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taxfy-config.json";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: "Configuration file downloaded successfully",
    });
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        setConfig(importedConfig);
        setHasChanges(true);

        toast({
          title: "Configuration Imported",
          description: "Configuration has been imported successfully",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid configuration file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Application Settings</h2>
          <p className="text-muted-foreground">
            Configure global application behavior and features
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={exportConfiguration}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <label>
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={importConfiguration}
              className="hidden"
            />
          </label>
          <Button onClick={saveConfiguration} disabled={loading || !hasChanges}>
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Make sure to save your configuration
            before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      {config.maintenanceMode && (
        <Alert className="border-orange-500/20 bg-orange-500/10">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            Maintenance mode is enabled. The application will show a maintenance
            page to users.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="ui">UI/UX</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic application information and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    value={config.appName}
                    onChange={(e) => updateConfig("appName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appUrl">Application URL</Label>
                  <Input
                    id="appUrl"
                    value={config.appUrl}
                    onChange={(e) => updateConfig("appUrl", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appDescription">Description</Label>
                <Textarea
                  id="appDescription"
                  value={config.appDescription}
                  onChange={(e) =>
                    updateConfig("appDescription", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={config.timezone}
                    onValueChange={(value) => updateConfig("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Johannesburg">
                        Africa/Johannesburg
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={config.currency}
                    onValueChange={(value) => updateConfig("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZAR">
                        ZAR (South African Rand)
                      </SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={config.language}
                    onValueChange={(value) => updateConfig("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="af">Afrikaans</SelectItem>
                      <SelectItem value="zu">Zulu</SelectItem>
                      <SelectItem value="xh">Xhosa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={config.supportEmail}
                  onChange={(e) => updateConfig("supportEmail", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Limits</CardTitle>
              <CardDescription>
                Configure usage limits and quotas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={config.maxFileSize}
                    onChange={(e) =>
                      updateConfig("maxFileSize", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUploadsPerDay">Max Uploads Per Day</Label>
                  <Input
                    id="maxUploadsPerDay"
                    type="number"
                    value={config.maxUploadsPerDay}
                    onChange={(e) =>
                      updateConfig("maxUploadsPerDay", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxApiCallsPerHour">
                    Max API Calls Per Hour
                  </Label>
                  <Input
                    id="maxApiCallsPerHour"
                    type="number"
                    value={config.maxApiCallsPerHour}
                    onChange={(e) =>
                      updateConfig(
                        "maxApiCallsPerHour",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.sessionTimeout}
                    onChange={(e) =>
                      updateConfig("sessionTimeout", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable application features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new user signups
                    </p>
                  </div>
                  <Switch
                    checked={config.enableRegistration}
                    onCheckedChange={(checked) =>
                      updateConfig("enableRegistration", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Guest Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow guest users without registration
                    </p>
                  </div>
                  <Switch
                    checked={config.enableGuestAccess}
                    onCheckedChange={(checked) =>
                      updateConfig("enableGuestAccess", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Subscriptions</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable subscription billing
                    </p>
                  </div>
                  <Switch
                    checked={config.enableSubscriptions}
                    onCheckedChange={(checked) =>
                      updateConfig("enableSubscriptions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable REST API endpoints
                    </p>
                  </div>
                  <Switch
                    checked={config.enableApiAccess}
                    onCheckedChange={(checked) =>
                      updateConfig("enableApiAccess", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Blog Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow comments on blog posts
                    </p>
                  </div>
                  <Switch
                    checked={config.enableBlogComments}
                    onCheckedChange={(checked) =>
                      updateConfig("enableBlogComments", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable usage analytics
                    </p>
                  </div>
                  <Switch
                    checked={config.enableAnalytics}
                    onCheckedChange={(checked) =>
                      updateConfig("enableAnalytics", checked)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-500/5 border-orange-500/20">
                <div className="space-y-0.5">
                  <Label className="text-orange-700 dark:text-orange-300">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Put the application in maintenance mode
                  </p>
                </div>
                <Switch
                  checked={config.maintenanceMode}
                  onCheckedChange={(checked) =>
                    updateConfig("maintenanceMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure authentication and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch
                    checked={config.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      updateConfig("requireEmailVerification", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA for all users
                    </p>
                  </div>
                  <Switch
                    checked={config.enableTwoFactor}
                    onCheckedChange={(checked) =>
                      updateConfig("enableTwoFactor", checked)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">
                    Minimum Password Length
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={config.passwordMinLength}
                    onChange={(e) =>
                      updateConfig(
                        "passwordMinLength",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionSecurity">
                    Session Security Level
                  </Label>
                  <Select
                    value={config.sessionSecurity}
                    onValueChange={(value) =>
                      updateConfig("sessionSecurity", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Basic)</SelectItem>
                      <SelectItem value="medium">
                        Medium (Recommended)
                      </SelectItem>
                      <SelectItem value="high">High (Strict)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure email settings and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailFromName">From Name</Label>
                  <Input
                    id="emailFromName"
                    value={config.emailFromName}
                    onChange={(e) =>
                      updateConfig("emailFromName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailFromAddress">From Address</Label>
                  <Input
                    id="emailFromAddress"
                    type="email"
                    value={config.emailFromAddress}
                    onChange={(e) =>
                      updateConfig("emailFromAddress", e.target.value)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable email notifications
                      </p>
                    </div>
                    <Switch
                      checked={config.enableEmailNotifications}
                      onCheckedChange={(checked) =>
                        updateConfig("enableEmailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Welcome Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Send welcome email to new users
                      </p>
                    </div>
                    <Switch
                      checked={config.enableWelcomeEmail}
                      onCheckedChange={(checked) =>
                        updateConfig("enableWelcomeEmail", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password Reset Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Send password reset emails
                      </p>
                    </div>
                    <Switch
                      checked={config.enablePasswordResetEmail}
                      onCheckedChange={(checked) =>
                        updateConfig("enablePasswordResetEmail", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                UI/UX Settings
              </CardTitle>
              <CardDescription>
                Configure the user interface and experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultTheme">Default Theme</Label>
                  <Select
                    value={config.defaultTheme}
                    onValueChange={(value) =>
                      updateConfig("defaultTheme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable UI animations
                      </p>
                    </div>
                    <Switch
                      checked={config.enableAnimations}
                      onCheckedChange={(checked) =>
                        updateConfig("enableAnimations", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use compact UI layout
                      </p>
                    </div>
                    <Switch
                      checked={config.compactMode}
                      onCheckedChange={(checked) =>
                        updateConfig("compactMode", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Branding</Label>
                      <p className="text-sm text-muted-foreground">
                        Display Taxfy branding
                      </p>
                    </div>
                    <Switch
                      checked={config.showBranding}
                      onCheckedChange={(checked) =>
                        updateConfig("showBranding", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure payment processing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Payments</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow payment processing
                  </p>
                </div>
                <Switch
                  checked={config.enablePayments}
                  onCheckedChange={(checked) =>
                    updateConfig("enablePayments", checked)
                  }
                />
              </div>

              {config.enablePayments && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Select
                      value={config.paymentMode}
                      onValueChange={(value) =>
                        updateConfig("paymentMode", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">
                          Sandbox (Testing)
                        </SelectItem>
                        <SelectItem value="production">
                          Production (Live)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      value={config.taxRate}
                      onChange={(e) =>
                        updateConfig("taxRate", parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Legal</CardTitle>
              <CardDescription>
                Configure compliance and data protection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cookie Consent</Label>
                    <p className="text-sm text-muted-foreground">
                      Show cookie consent banner
                    </p>
                  </div>
                  <Switch
                    checked={config.enableCookieConsent}
                    onCheckedChange={(checked) =>
                      updateConfig("enableCookieConsent", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Processing Consent</Label>
                    <p className="text-sm text-muted-foreground">
                      Require explicit data processing consent
                    </p>
                  </div>
                  <Switch
                    checked={config.enableDataProcessingConsent}
                    onCheckedChange={(checked) =>
                      updateConfig("enableDataProcessingConsent", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Log</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable system audit logging
                    </p>
                  </div>
                  <Switch
                    checked={config.enableAuditLog}
                    onCheckedChange={(checked) =>
                      updateConfig("enableAuditLog", checked)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRetentionDays">
                  Data Retention Period (days)
                </Label>
                <Input
                  id="dataRetentionDays"
                  type="number"
                  min="30"
                  max="2555" // 7 years
                  value={config.dataRetentionDays}
                  onChange={(e) =>
                    updateConfig("dataRetentionDays", parseInt(e.target.value))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  How long to retain user data (minimum 30 days, maximum 7
                  years)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppSettings;
