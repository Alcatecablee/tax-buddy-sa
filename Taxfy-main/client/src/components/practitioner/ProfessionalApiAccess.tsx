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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Key,
  Copy,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Activity,
  BarChart3,
  Clock,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Code,
  Book,
  Download,
  Upload,
  Settings,
  Users,
  Building,
  Crown,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { formatCurrency } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: "sandbox" | "production";
  permissions: string[];
  rateLimit: {
    requests: number;
    window: "minute" | "hour" | "day";
    current: number;
    reset: Date;
  };
  usage: {
    requestsToday: number;
    requestsThisMonth: number;
    lastUsed: Date;
  };
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  expiresAt?: Date;
  ipWhitelist: string[];
}

interface ApiUsageStats {
  totalRequests: number;
  successfulRequests: number;
  errorRequests: number;
  averageResponseTime: number;
  topEndpoints: { endpoint: string; count: number }[];
  dailyUsage: { date: string; requests: number }[];
}

interface RateLimitPlan {
  id: string;
  name: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
  description: string;
  price: number;
}

export const ProfessionalApiAccess: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usageStats, setUsageStats] = useState<ApiUsageStats | null>(null);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<
    "sandbox" | "production"
  >("sandbox");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const { toast } = useCustomToast();

  useEffect(() => {
    loadApiData();
  }, []);

  const loadApiData = () => {
    // Mock data for professional API access
    const mockApiKeys: ApiKey[] = [
      {
        id: "key-1",
        name: "Production API",
        key: "pk_live_abcd1234567890",
        environment: "production",
        permissions: [
          "document.process",
          "calculation.create",
          "report.generate",
        ],
        rateLimit: {
          requests: 1000,
          window: "hour",
          current: 245,
          reset: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        },
        usage: {
          requestsToday: 1250,
          requestsThisMonth: 15670,
          lastUsed: new Date("2024-01-20T14:30:00"),
        },
        status: "active",
        createdAt: new Date("2024-01-01"),
        ipWhitelist: ["196.254.100.0/24", "41.185.24.0/24"],
      },
      {
        id: "key-2",
        name: "Development Testing",
        key: "pk_test_xyz9876543210",
        environment: "sandbox",
        permissions: ["document.process", "calculation.create"],
        rateLimit: {
          requests: 100,
          window: "hour",
          current: 23,
          reset: new Date(Date.now() + 37 * 60 * 1000),
        },
        usage: {
          requestsToday: 89,
          requestsThisMonth: 2340,
          lastUsed: new Date("2024-01-20T10:15:00"),
        },
        status: "active",
        createdAt: new Date("2024-01-05"),
        ipWhitelist: [],
      },
    ];

    const mockUsageStats: ApiUsageStats = {
      totalRequests: 18010,
      successfulRequests: 17234,
      errorRequests: 776,
      averageResponseTime: 245,
      topEndpoints: [
        { endpoint: "/api/documents/process", count: 8945 },
        { endpoint: "/api/calculations/create", count: 5230 },
        { endpoint: "/api/reports/generate", count: 2134 },
        { endpoint: "/api/clients/create", count: 1701 },
      ],
      dailyUsage: [
        { date: "2024-01-14", requests: 1205 },
        { date: "2024-01-15", requests: 1456 },
        { date: "2024-01-16", requests: 1678 },
        { date: "2024-01-17", requests: 1123 },
        { date: "2024-01-18", requests: 1890 },
        { date: "2024-01-19", requests: 1567 },
        { date: "2024-01-20", requests: 1250 },
      ],
    };

    setApiKeys(mockApiKeys);
    setUsageStats(mockUsageStats);
  };

  const rateLimitPlans: RateLimitPlan[] = [
    {
      id: "professional",
      name: "Professional",
      requestsPerMinute: 50,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      burstLimit: 100,
      description: "Perfect for small to medium tax practices",
      price: 0, // Included in Professional Practice plan
    },
    {
      id: "enterprise",
      name: "Enterprise",
      requestsPerMinute: 200,
      requestsPerHour: 5000,
      requestsPerDay: 50000,
      burstLimit: 500,
      description: "High-volume processing for large practices",
      price: 299,
    },
    {
      id: "unlimited",
      name: "Unlimited",
      requestsPerMinute: 1000,
      requestsPerHour: 25000,
      requestsPerDay: 250000,
      burstLimit: 2000,
      description: "No limits for enterprise clients",
      price: 899,
    },
  ];

  const availablePermissions = [
    {
      id: "document.process",
      name: "Process Documents",
      description: "Upload and process tax documents",
    },
    {
      id: "calculation.create",
      name: "Tax Calculations",
      description: "Perform tax calculations and analysis",
    },
    {
      id: "report.generate",
      name: "Generate Reports",
      description: "Create and download tax reports",
    },
    {
      id: "client.manage",
      name: "Client Management",
      description: "Create and manage client records",
    },
    {
      id: "compliance.check",
      name: "Compliance Checks",
      description: "Run compliance and audit checks",
    },
    {
      id: "analytics.view",
      name: "View Analytics",
      description: "Access usage analytics and insights",
    },
  ];

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Key Name Required",
        description: "Please provide a name for your API key",
        variant: "destructive",
      });
      return;
    }

    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `pk_${newKeyEnvironment === "production" ? "live" : "test"}_${Math.random().toString(36).substring(2, 15)}`,
      environment: newKeyEnvironment,
      permissions: selectedPermissions,
      rateLimit: {
        requests: newKeyEnvironment === "production" ? 1000 : 100,
        window: "hour",
        current: 0,
        reset: new Date(Date.now() + 60 * 60 * 1000),
      },
      usage: {
        requestsToday: 0,
        requestsThisMonth: 0,
        lastUsed: new Date(),
      },
      status: "active",
      createdAt: new Date(),
      ipWhitelist: [],
    };

    setApiKeys((prev) => [...prev, newKey]);
    setShowCreateKey(false);
    setNewKeyName("");
    setSelectedPermissions([]);

    toast({
      title: "API Key Created",
      description: "Your new API key has been generated successfully",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "API key has been copied to your clipboard",
    });
  };

  const regenerateKey = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === keyId
          ? {
              ...key,
              key: `pk_${key.environment === "production" ? "live" : "test"}_${Math.random().toString(36).substring(2, 15)}`,
              usage: {
                requestsToday: 0,
                requestsThisMonth: 0,
                lastUsed: new Date(),
              },
            }
          : key,
      ),
    );

    toast({
      title: "API Key Regenerated",
      description:
        "Your API key has been regenerated. Update your applications with the new key.",
    });
  };

  const deleteKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId));

    toast({
      title: "API Key Deleted",
      description: "The API key has been permanently deleted",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId);
  };

  const getRateLimitUsagePercentage = (key: ApiKey) => {
    return Math.round((key.rateLimit.current / key.rateLimit.requests) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Professional API Access</h2>
          <p className="text-muted-foreground">
            Integrate TaxFy's tax processing capabilities into your applications
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Professional
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Enterprise Grade
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{apiKeys.length}</p>
                    <p className="text-sm text-muted-foreground">Active Keys</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {usageStats?.totalRequests.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Requests
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {usageStats?.averageResponseTime}ms
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg Response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {usageStats
                        ? Math.round(
                            (usageStats.successfulRequests /
                              usageStats.totalRequests) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Success Rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rate Limit Plans</CardTitle>
                <CardDescription>
                  Choose the right plan for your API usage needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rateLimitPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{plan.name}</h4>
                        <Badge
                          variant={
                            plan.id === "professional" ? "default" : "outline"
                          }
                        >
                          {plan.price === 0
                            ? "Included"
                            : `ZAR ${plan.price}/month`}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {plan.description}
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Per minute:
                          </span>
                          <span className="font-medium ml-2">
                            {plan.requestsPerMinute}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Per hour:
                          </span>
                          <span className="font-medium ml-2">
                            {plan.requestsPerHour}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Per day:
                          </span>
                          <span className="font-medium ml-2">
                            {plan.requestsPerDay}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Burst limit:
                          </span>
                          <span className="font-medium ml-2">
                            {plan.burstLimit}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Create an API Key</h4>
                      <p className="text-sm text-muted-foreground">
                        Generate a new API key with the required permissions
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Configure Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add your API key to request headers for authentication
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Make Your First Request</h4>
                      <p className="text-sm text-muted-foreground">
                        Start processing documents with our REST API
                      </p>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Book className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your API keys and permissions
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateKey(true)}>
                  <Key className="h-4 w-4 mr-2" />
                  Create New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <Card key={apiKey.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{apiKey.name}</h4>
                            <Badge
                              variant="outline"
                              className={getStatusColor(apiKey.status)}
                            >
                              {apiKey.status}
                            </Badge>
                            <Badge variant="outline">
                              {apiKey.environment}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created {apiKey.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKey === apiKey.id ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => regenerateKey(apiKey.id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteKey(apiKey.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            API Key
                          </Label>
                          <div className="font-mono text-sm bg-muted p-2 rounded">
                            {showKey === apiKey.id
                              ? apiKey.key
                              : `${apiKey.key.substring(0, 12)}${"*".repeat(20)}`}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Rate Limit Usage
                            </Label>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{apiKey.rateLimit.current}</span>
                                <span>
                                  {apiKey.rateLimit.requests} per{" "}
                                  {apiKey.rateLimit.window}
                                </span>
                              </div>
                              <Progress
                                value={getRateLimitUsagePercentage(apiKey)}
                                className="h-2"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Usage Today
                            </Label>
                            <p className="text-sm font-medium">
                              {apiKey.usage.requestsToday.toLocaleString()}{" "}
                              requests
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Last Used
                            </Label>
                            <p className="text-sm">
                              {apiKey.usage.lastUsed.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Permissions
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {apiKey.permissions.map((permission) => (
                              <Badge
                                key={permission}
                                variant="secondary"
                                className="text-xs"
                              >
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {showCreateKey && (
            <Card>
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="Enter a descriptive name for this key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Environment</Label>
                  <Select
                    value={newKeyEnvironment}
                    onValueChange={(value: "sandbox" | "production") =>
                      setNewKeyEnvironment(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                      <SelectItem value="production">
                        Production (Live)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Permissions</Label>
                  <div className="space-y-2 mt-2">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions((prev) => [
                                ...prev,
                                permission.id,
                              ]);
                            } else {
                              setSelectedPermissions((prev) =>
                                prev.filter((p) => p !== permission.id),
                              );
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={permission.id} className="text-sm">
                          <span className="font-medium">{permission.name}</span>
                          <span className="text-muted-foreground ml-2">
                            - {permission.description}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateApiKey}>Create API Key</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateKey(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Analytics</CardTitle>
              <CardDescription>
                Monitor your API usage and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Top Endpoints</h4>
                    <div className="space-y-2">
                      {usageStats?.topEndpoints.map((endpoint, index) => (
                        <div
                          key={endpoint.endpoint}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-mono">
                            {endpoint.endpoint}
                          </span>
                          <Badge variant="outline">
                            {endpoint.count.toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Recent Usage</h4>
                    <div className="space-y-2">
                      {usageStats?.dailyUsage.slice(-5).map((day) => (
                        <div
                          key={day.date}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">
                            {new Date(day.date).toLocaleDateString()}
                          </span>
                          <span className="text-sm font-medium">
                            {day.requests.toLocaleString()} requests
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Complete guide to integrating with TaxFy's professional API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Code className="h-6 w-6 text-primary" />
                        <h4 className="font-semibold">Getting Started</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn the basics of authentication and making your first
                        API call
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Upload className="h-6 w-6 text-primary" />
                        <h4 className="font-semibold">Document Processing</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload and process tax documents programmatically
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Endpoints
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <h4 className="font-semibold">Tax Calculations</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Perform complex tax calculations and optimizations
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Examples
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Download className="h-6 w-6 text-primary" />
                        <h4 className="font-semibold">Report Generation</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Generate professional tax reports and summaries
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Reference
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Sample API Call</h4>
                  <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                    {`curl -X POST "https://api.taxfy.co.za/v1/documents/process" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "document=@irp5.pdf" \\
  -F "type=irp5"`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure your API access preferences and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Webhook Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive webhooks for API events and status updates
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict API access to specific IP addresses
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limit Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when approaching rate limits
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed usage tracking and analytics
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Security Settings</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Default Key Expiration</Label>
                    <Select defaultValue="never">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="never">Never expire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Require HTTPS</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Enforce HTTPS for all API requests
                    </p>
                    <Switch defaultChecked disabled />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalApiAccess;
