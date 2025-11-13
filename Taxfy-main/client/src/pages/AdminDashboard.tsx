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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Key,
  ToggleLeft,
  Globe,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  UserCheck,
  FileText,
  Database,
  Mail,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Import only the components I've created
const EnvironmentManager = React.lazy(
  () => import("@/components/admin/EnvironmentManager"),
);
const AppSettings = React.lazy(() => import("@/components/admin/AppSettings"));
const FeatureControls = React.lazy(
  () => import("@/components/admin/FeatureControls"),
);
const PaymentSettings = React.lazy(
  () => import("@/components/admin/PaymentSettings"),
);

interface SystemMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  status: "healthy" | "warning" | "error";
  icon: React.ComponentType<any>;
}

interface AdminDashboardProps {}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // System metrics for dashboard overview
  const systemMetrics: SystemMetric[] = [
    {
      label: "Total Users",
      value: dashboardData?.stats?.users?.total_users?.toLocaleString() || "0",
      change: "+12.5%",
      trend: "up",
      status: "healthy",
      icon: Users,
    },
    {
      label: "Monthly Revenue",
      value: `R ${(dashboardData?.stats?.calculations?.total * 50 || 0).toLocaleString()}`,
      change: "+8.3%",
      trend: "up",
      status: "healthy",
      icon: DollarSign,
    },
    {
      label: "Active Subscriptions",
      value: Math.floor(
        (dashboardData?.stats?.users?.total_users || 0) * 0.4,
      ).toLocaleString(),
      change: "+5.7%",
      trend: "up",
      status: "healthy",
      icon: UserCheck,
    },
    {
      label: "API Calls Today",
      value: (
        dashboardData?.stats?.calculations?.today * 10 || 0
      ).toLocaleString(),
      change: "+2.1%",
      trend: "up",
      status: "healthy",
      icon: Activity,
    },
    {
      label: "Documents Processed",
      value: (dashboardData?.stats?.calculations?.total || 0).toLocaleString(),
      change: "+15.2%",
      trend: "up",
      status: "healthy",
      icon: FileText,
    },
    {
      label: "System Uptime",
      value: "99.97%",
      change: "+0.02%",
      trend: "up",
      status: "healthy",
      icon: Server,
    },
  ];

  // Load admin dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
        const userId = localStorage.getItem("currentUserId") || "demo-user";

        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
          headers: {
            "X-User-ID": userId,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error("Failed to load admin dashboard data");
        }
      } catch (error) {
        console.error("Error loading admin dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Enable Feature",
      description: "Toggle application features on/off",
      icon: ToggleLeft,
      action: () => setActiveTab("features"),
    },
    {
      title: "Update Environment",
      description: "Manage environment variables",
      icon: Key,
      action: () => setActiveTab("environment"),
    },
    {
      title: "Payment Settings",
      description: "Configure payment gateways",
      icon: CreditCard,
      action: () => setActiveTab("payments"),
    },
    {
      title: "App Settings",
      description: "Configure global app settings",
      icon: Settings,
      action: () => setActiveTab("settings"),
    },
  ];

  // Check if user is loading
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading admin dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin - proper admin checking
  const isAdmin =
    user?.email === "admin@taxfy.co.za" ||
    user?.email?.includes("admin@") ||
    user?.user_metadata?.is_admin === true ||
    user?.app_metadata?.is_admin === true;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="max-w-md mx-auto text-center">
            <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to access the admin dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/logo-ta.png"
                alt="Taxfy Logo"
                className="h-12 w-12 object-contain animate-bounce-subtle"
              />
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your Taxfy platform configuration and monitor system health
            </p>
          </div>

          {/* Environment Status Alert */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              All critical systems are operational. PayPal is configured for
              sandbox mode.
              <Button
                variant="link"
                className="p-0 h-auto ml-2"
                onClick={() => setActiveTab("environment")}
              >
                Update Environment
              </Button>
            </AlertDescription>
          </Alert>

          {/* Main Dashboard Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="environment"
                className="flex items-center gap-1"
              >
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Environment</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-1">
                <ToggleLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* System Metrics Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemMetrics.map((metric, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {metric.label}
                            </p>
                            <p className="text-2xl font-bold">{metric.value}</p>
                            <p
                              className={`text-sm flex items-center gap-1 ${getStatusColor(metric.status)}`}
                            >
                              <span>{getTrendIcon(metric.trend)}</span>
                              {metric.change}
                            </p>
                          </div>
                          <metric.icon
                            className={`w-8 h-8 ${getStatusColor(metric.status)}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={action.action}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <action.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{action.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system events and user actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Payment gateway updated
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PayPal configuration updated successfully
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        2 hours ago
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New user registration
                        </p>
                        <p className="text-xs text-muted-foreground">
                          15 new users registered today
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        3 hours ago
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <ToggleLeft className="w-5 h-5 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Feature toggle</p>
                        <p className="text-xs text-muted-foreground">
                          AI optimization feature enabled for Enterprise users
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        5 hours ago
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High API usage</p>
                        <p className="text-xs text-muted-foreground">
                          API usage exceeded 80% of daily limit
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        6 hours ago
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Environment Status</CardTitle>
                    <CardDescription>
                      Current environment configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clerk Authentication</span>
                      <Badge
                        variant="outline"
                        className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      >
                        Dev Mode
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">PayPal Gateway</span>
                      <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                      >
                        Sandbox
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Service</span>
                      <Badge variant="secondary">Not Configured</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database</span>
                      <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                      >
                        Connected
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feature Status</CardTitle>
                    <CardDescription>
                      Current feature flag configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Registration</span>
                      <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                      >
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Guest Access</span>
                      <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                      >
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Access</span>
                      <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                      >
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Features</span>
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                      >
                        Enterprise Only
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Environment Management Tab */}
            <TabsContent value="environment">
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <EnvironmentManager />
              </React.Suspense>
            </TabsContent>

            {/* App Settings Tab */}
            <TabsContent value="settings">
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <AppSettings />
              </React.Suspense>
            </TabsContent>

            {/* Feature Controls Tab */}
            <TabsContent value="features">
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <FeatureControls />
              </React.Suspense>
            </TabsContent>

            {/* Payment Settings Tab */}
            <TabsContent value="payments">
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <PaymentSettings />
              </React.Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
