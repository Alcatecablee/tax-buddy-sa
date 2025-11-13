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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Key,
  CreditCard,
  Mail,
  Database,
  Shield,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnvironmentVariable {
  key: string;
  value: string;
  description: string;
  category: "auth" | "payments" | "email" | "database" | "api" | "security";
  required: boolean;
  sensitive: boolean;
  masked?: boolean;
}

interface EnvironmentManagerProps {}

const EnvironmentManager: React.FC<EnvironmentManagerProps> = () => {
  const { toast } = useToast();
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);
  const [loading, setLoading] = useState(false);
  const [maskedVars, setMaskedVars] = useState<Set<string>>(new Set());

  // Load environment variables from API
  useEffect(() => {
    const loadEnvironmentVars = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
        const response = await fetch(`${API_BASE_URL}/admin/environment`);

        if (response.ok) {
          const savedEnvVars = await response.json();
          const savedVarsMap = savedEnvVars.reduce((acc: any, env: any) => {
            acc[env.var_key] = env.var_value;
            return acc;
          }, {});

          // Merge saved values with default configuration
          const updatedEnvVars = defaultEnvVars.map((env) => ({
            ...env,
            value: savedVarsMap[env.key] || env.value,
          }));

          setEnvVars(updatedEnvVars);
        } else {
          // Fallback to defaults if API fails
          setEnvVars(defaultEnvVars);
        }
      } catch (error) {
        console.error("Error loading environment variables:", error);
        // Fallback to defaults if API fails
        setEnvVars(defaultEnvVars);
      }
    };

    const defaultEnvVars: EnvironmentVariable[] = [
      // Authentication
      {
        key: "VITE_CLERK_PUBLISHABLE_KEY",
        value: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "",
        description: "Clerk publishable key for user authentication",
        category: "auth",
        required: true,
        sensitive: false,
      },
      {
        key: "CLERK_SECRET_KEY",
        value: "",
        description: "Clerk secret key for server-side operations",
        category: "auth",
        required: true,
        sensitive: true,
        masked: true,
      },

      // Payment Processing
      {
        key: "PAYPAL_CLIENT_ID",
        value: "",
        description: "PayPal production client ID",
        category: "payments",
        required: true,
        sensitive: true,
        masked: true,
      },
      {
        key: "PAYPAL_CLIENT_SECRET",
        value: "",
        description: "PayPal production client secret",
        category: "payments",
        required: true,
        sensitive: true,
        masked: true,
      },
      {
        key: "PAYPAL_SANDBOX_CLIENT_ID",
        value: "",
        description: "PayPal sandbox client ID for testing",
        category: "payments",
        required: false,
        sensitive: true,
        masked: true,
      },
      {
        key: "PAYPAL_SANDBOX_CLIENT_SECRET",
        value: "",
        description: "PayPal sandbox client secret for testing",
        category: "payments",
        required: false,
        sensitive: true,
        masked: true,
      },
      {
        key: "PAYPAL_WEBHOOK_ID",
        value: "",
        description: "PayPal webhook ID for payment notifications",
        category: "payments",
        required: false,
        sensitive: false,
      },

      // Email Service
      {
        key: "RESEND_API_KEY",
        value: "",
        description: "Resend API key for sending emails",
        category: "email",
        required: true,
        sensitive: true,
        masked: true,
      },
      {
        key: "SMTP_HOST",
        value: "",
        description: "SMTP host for backup email service",
        category: "email",
        required: false,
        sensitive: false,
      },
      {
        key: "SMTP_PORT",
        value: "587",
        description: "SMTP port for email service",
        category: "email",
        required: false,
        sensitive: false,
      },
      {
        key: "SMTP_USER",
        value: "",
        description: "SMTP username for authentication",
        category: "email",
        required: false,
        sensitive: true,
        masked: true,
      },
      {
        key: "SMTP_PASS",
        value: "",
        description: "SMTP password for authentication",
        category: "email",
        required: false,
        sensitive: true,
        masked: true,
      },

      // Database
      {
        key: "DATABASE_URL",
        value: "",
        description: "Database connection string",
        category: "database",
        required: true,
        sensitive: true,
        masked: true,
      },
      {
        key: "DATABASE_POOL_SIZE",
        value: "10",
        description: "Maximum database connection pool size",
        category: "database",
        required: false,
        sensitive: false,
      },

      // API & External Services
      {
        key: "VITE_APP_URL",
        value: import.meta.env.VITE_APP_URL || "",
        description: "Application base URL",
        category: "api",
        required: true,
        sensitive: false,
      },
      {
        key: "API_RATE_LIMIT",
        value: "100",
        description: "API rate limit per minute per user",
        category: "api",
        required: false,
        sensitive: false,
      },
      {
        key: "OPENAI_API_KEY",
        value: "",
        description: "OpenAI API key for AI features",
        category: "api",
        required: false,
        sensitive: true,
        masked: true,
      },

      // Security
      {
        key: "JWT_SECRET",
        value: "",
        description: "JWT secret for token signing",
        category: "security",
        required: true,
        sensitive: true,
        masked: true,
      },
      {
        key: "ENCRYPTION_KEY",
        value: "",
        description: "Encryption key for sensitive data",
        category: "security",
        required: true,
        sensitive: true,
        masked: true,
      },
      {
        key: "WEBHOOK_SECRET",
        value: "",
        description: "Secret for webhook verification",
        category: "security",
        required: false,
        sensitive: true,
        masked: true,
      },
    ];

    // Initialize masked state for sensitive variables
    const initialMasked = new Set(
      defaultEnvVars
        .filter((env) => env.sensitive && env.masked)
        .map((env) => env.key),
    );
    setMaskedVars(initialMasked);

    // Load environment variables from API
    loadEnvironmentVars();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "auth":
        return <Shield className="w-4 h-4" />;
      case "payments":
        return <CreditCard className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "api":
        return <Key className="w-4 h-4" />;
      case "security":
        return <Shield className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "auth":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "payments":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "email":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "database":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "api":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "security":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const toggleMask = (key: string) => {
    const newMasked = new Set(maskedVars);
    if (newMasked.has(key)) {
      newMasked.delete(key);
    } else {
      newMasked.add(key);
    }
    setMaskedVars(newMasked);
  };

  const updateEnvVar = (key: string, value: string) => {
    setEnvVars((prev) =>
      prev.map((env) => (env.key === key ? { ...env, value } : env)),
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Environment variable copied successfully",
    });
  };

  const validateEnvironment = () => {
    const missingRequired = envVars.filter((env) => env.required && !env.value);

    if (missingRequired.length > 0) {
      toast({
        title: "Missing Required Variables",
        description: `${missingRequired.length} required environment variables are missing`,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Environment Valid",
      description: "All required environment variables are configured",
    });
    return true;
  };

  const saveEnvironment = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
      const userId = localStorage.getItem("currentUserId") || "demo-user";

      // Save each environment variable that has a value
      const savePromises = envVars
        .filter((env) => env.value && env.value.trim() !== "")
        .map(async (env) => {
          const response = await fetch(
            `${API_BASE_URL}/admin/environment/${env.key}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-User-ID": userId,
              },
              body: JSON.stringify({
                value: env.value,
                isSensitive: env.sensitive,
                description: env.description,
                category: env.category,
              }),
            },
          );

          if (!response.ok) {
            throw new Error(`Failed to save ${env.key}`);
          }

          return response.json();
        });

      await Promise.all(savePromises);

      toast({
        title: "Environment Saved",
        description: "Environment variables saved successfully",
      });
    } catch (error) {
      console.error("Error saving environment variables:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save environment variables",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateEnvFile = () => {
    const envContent = envVars
      .filter((env) => env.value)
      .map((env) => `${env.key}=${env.value}`)
      .join("\n");

    const blob = new Blob([envContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".env";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Environment File Generated",
      description: ".env file downloaded successfully",
    });
  };

  const groupedEnvVars = envVars.reduce(
    (acc, env) => {
      if (!acc[env.category]) {
        acc[env.category] = [];
      }
      acc[env.category].push(env);
      return acc;
    },
    {} as Record<string, EnvironmentVariable[]>,
  );

  const getStatusBadge = (env: EnvironmentVariable) => {
    if (env.required && !env.value) {
      return <Badge variant="destructive">Required</Badge>;
    }
    if (env.value) {
      return (
        <Badge
          variant="default"
          className="bg-green-500/10 text-green-500 border-green-500/20"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Configured
        </Badge>
      );
    }
    return <Badge variant="secondary">Optional</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Environment Manager</h2>
          <p className="text-muted-foreground">
            Manage all environment variables and application credentials
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={validateEnvironment}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Validate
          </Button>
          <Button variant="outline" onClick={generateEnvFile}>
            <Copy className="w-4 h-4 mr-2" />
            Export .env
          </Button>
          <Button onClick={saveEnvironment} disabled={loading}>
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          These environment variables control core application functionality.
          Changes may require a server restart to take effect.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Auth
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedEnvVars).map(([category, variables]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4">
              {variables.map((env) => (
                <Card key={env.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-md border ${getCategoryColor(env.category)}`}
                        >
                          {getCategoryIcon(env.category)}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {env.key}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {env.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(env)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(env.key)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type={
                            env.sensitive && maskedVars.has(env.key)
                              ? "password"
                              : "text"
                          }
                          value={env.value}
                          onChange={(e) =>
                            updateEnvVar(env.key, e.target.value)
                          }
                          placeholder={`Enter ${env.key.toLowerCase()}`}
                          className="font-mono text-sm"
                        />
                      </div>
                      {env.sensitive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleMask(env.key)}
                        >
                          {maskedVars.has(env.key) ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Quick Setup Links
          </CardTitle>
          <CardDescription>
            Direct links to service dashboards for easy credential retrieval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://dashboard.clerk.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="w-4 h-4 mr-2" />
                Clerk Dashboard
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://developer.paypal.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                PayPal Developer
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://resend.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend Dashboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentManager;
