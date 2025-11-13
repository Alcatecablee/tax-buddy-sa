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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Users,
  Database,
  Settings,
  BarChart3,
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Crown,
  Network,
  Code,
  Mail,
  Phone,
  Calendar,
  FileText,
  Upload,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  Bell,
  Globe,
  Lock,
  Unlock,
  Play,
  Pause,
  Stop,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Activity,
  Server,
  HardDrive,
  Cpu,
  Memory,
  Wifi,
  WifiOff,
  ExternalLink,
  Copy,
  MessageSquare,
  UserCheck,
  UserX,
  Building,
  CreditCard,
  Package,
  Truck,
  Target,
  Award,
  Star,
  Flag,
  Archive,
  Folder,
  Key,
  Link,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Home,
  MapPin,
  Timer,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  Import,
  Export,
  Printer,
  Share,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";

// Comprehensive system interfaces
interface SystemMetrics {
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  activeUsers: number;
  requestsPerMinute: number;
  errorRate: number;
  responseTime: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  status: "active" | "suspended" | "pending" | "inactive";
  createdAt: Date;
  lastActive: Date;
  totalUploads: number;
  totalSpent: number;
  location: string;
  device: string;
  subscription: {
    plan: string;
    status: string;
    nextBilling: Date;
    amount: number;
  };
}

interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded";
  method: string;
  createdAt: Date;
  planName: string;
  transactionId: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  requiredPlan: string;
  usageCount: number;
  lastModified: Date;
}

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  enabled: boolean;
  rateLimited: boolean;
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
}

interface Integration {
  id: string;
  name: string;
  status: "active" | "inactive" | "error";
  lastSync: Date;
  recordsProcessed: number;
  errorCount: number;
  cost: number;
}

interface SystemSetting {
  key: string;
  value: string;
  category: string;
  description: string;
  type: "string" | "number" | "boolean" | "json";
  lastModified: Date;
}

export default function SuperAdminDashboard() {
  const { toast } = useCustomToast();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Mock comprehensive data
  const [systemMetrics] = useState<SystemMetrics>({
    uptime: 99.97,
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    diskUsage: 34.1,
    networkIn: 125.4,
    networkOut: 89.2,
    activeUsers: 1247,
    requestsPerMinute: 3456,
    errorRate: 0.02,
    responseTime: 145,
  });

  const [users] = useState<User[]>([
    {
      id: "user_001",
      email: "john.doe@company.co.za",
      name: "John Doe",
      plan: "Enterprise Pro",
      status: "active",
      createdAt: new Date("2024-01-15"),
      lastActive: new Date("2024-12-20T10:30:00"),
      totalUploads: 450,
      totalSpent: 41988,
      location: "Johannesburg, SA",
      device: "Desktop",
      subscription: {
        plan: "Enterprise Pro",
        status: "active",
        nextBilling: new Date("2025-01-15"),
        amount: 3499,
      },
    },
    {
      id: "user_002",
      email: "sarah.smith@taxfirm.co.za",
      name: "Sarah Smith",
      plan: "Professional Practice",
      status: "active",
      createdAt: new Date("2024-03-10"),
      lastActive: new Date("2024-12-20T09:15:00"),
      totalUploads: 1250,
      totalSpent: 10788,
      location: "Cape Town, SA",
      device: "Mobile",
      subscription: {
        plan: "Professional Practice",
        status: "active",
        nextBilling: new Date("2025-01-10"),
        amount: 899,
      },
    },
    {
      id: "user_003",
      email: "mike.wilson@example.com",
      name: "Mike Wilson",
      plan: "Starter Individual",
      status: "suspended",
      createdAt: new Date("2024-06-20"),
      lastActive: new Date("2024-12-18T14:22:00"),
      totalUploads: 45,
      totalSpent: 588,
      location: "Durban, SA",
      device: "Tablet",
      subscription: {
        plan: "Starter Individual",
        status: "past_due",
        nextBilling: new Date("2024-12-25"),
        amount: 49,
      },
    },
  ]);

  const [payments] = useState<Payment[]>([
    {
      id: "pay_001",
      userId: "user_001",
      amount: 3499,
      currency: "ZAR",
      status: "completed",
      method: "PayPal",
      createdAt: new Date("2024-12-01"),
      planName: "Enterprise Pro",
      transactionId: "TXN_123456789",
    },
    {
      id: "pay_002",
      userId: "user_002",
      amount: 899,
      currency: "ZAR",
      status: "completed",
      method: "Credit Card",
      createdAt: new Date("2024-12-10"),
      planName: "Professional Practice",
      transactionId: "TXN_987654321",
    },
    {
      id: "pay_003",
      userId: "user_003",
      amount: 49,
      currency: "ZAR",
      status: "failed",
      method: "PayPal",
      createdAt: new Date("2024-12-20"),
      planName: "Starter Individual",
      transactionId: "TXN_456789123",
    },
  ]);

  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "feature_001",
      name: "AI Tax Optimization",
      description: "Advanced AI-powered tax optimization recommendations",
      enabled: true,
      category: "AI/ML",
      requiredPlan: "Enterprise Pro",
      usageCount: 1250,
      lastModified: new Date("2024-12-15"),
    },
    {
      id: "feature_002",
      name: "Bulk IRP5 Processing",
      description: "Process multiple IRP5 documents simultaneously",
      enabled: true,
      category: "Processing",
      requiredPlan: "Professional",
      usageCount: 890,
      lastModified: new Date("2024-12-10"),
    },
    {
      id: "feature_003",
      name: "WhatsApp Integration",
      description: "Send tax reports via WhatsApp",
      enabled: false,
      category: "Communication",
      requiredPlan: "Starter",
      usageCount: 0,
      lastModified: new Date("2024-12-01"),
    },
    {
      id: "feature_004",
      name: "Blockchain Audit Trail",
      description: "Immutable audit trail using blockchain technology",
      enabled: true,
      category: "Security",
      requiredPlan: "Enterprise Pro",
      usageCount: 456,
      lastModified: new Date("2024-11-28"),
    },
  ]);

  const [apiEndpoints] = useState<ApiEndpoint[]>([
    {
      path: "/api/v1/calculate",
      method: "POST",
      description: "Calculate tax from IRP5 data",
      enabled: true,
      rateLimited: true,
      requestCount: 125000,
      errorCount: 45,
      avgResponseTime: 245,
    },
    {
      path: "/api/v1/upload",
      method: "POST",
      description: "Upload IRP5 document for processing",
      enabled: true,
      rateLimited: true,
      requestCount: 89000,
      errorCount: 12,
      avgResponseTime: 1850,
    },
    {
      path: "/api/v1/reports",
      method: "GET",
      description: "Generate tax reports",
      enabled: true,
      rateLimited: false,
      requestCount: 67000,
      errorCount: 8,
      avgResponseTime: 120,
    },
    {
      path: "/api/v1/admin",
      method: "ALL",
      description: "Admin management endpoints",
      enabled: true,
      rateLimited: true,
      requestCount: 1250,
      errorCount: 2,
      avgResponseTime: 89,
    },
  ]);

  const [integrations] = useState<Integration[]>([
    {
      id: "int_001",
      name: "SAP Business One",
      status: "active",
      lastSync: new Date("2024-12-20T10:30:00"),
      recordsProcessed: 15420,
      errorCount: 2,
      cost: 8500,
    },
    {
      id: "int_002",
      name: "Microsoft Dynamics 365",
      status: "active",
      lastSync: new Date("2024-12-20T10:00:00"),
      recordsProcessed: 28500,
      errorCount: 0,
      cost: 12500,
    },
    {
      id: "int_003",
      name: "QuickBooks Enterprise",
      status: "active",
      lastSync: new Date("2024-12-20T11:15:00"),
      recordsProcessed: 12750,
      errorCount: 1,
      cost: 3800,
    },
    {
      id: "int_004",
      name: "Standard Bank API",
      status: "error",
      lastSync: new Date("2024-12-19T15:20:00"),
      recordsProcessed: 0,
      errorCount: 15,
      cost: 4200,
    },
  ]);

  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([
    {
      key: "maintenance_mode",
      value: "false",
      category: "System",
      description: "Enable maintenance mode to disable user access",
      type: "boolean",
      lastModified: new Date("2024-12-15"),
    },
    {
      key: "max_upload_size",
      value: "10485760",
      category: "File Upload",
      description: "Maximum file upload size in bytes (10MB)",
      type: "number",
      lastModified: new Date("2024-12-10"),
    },
    {
      key: "api_rate_limit",
      value: "1000",
      category: "API",
      description: "API rate limit per hour per user",
      type: "number",
      lastModified: new Date("2024-12-05"),
    },
    {
      key: "email_notifications",
      value: "true",
      category: "Notifications",
      description: "Enable email notifications system-wide",
      type: "boolean",
      lastModified: new Date("2024-12-01"),
    },
    {
      key: "payment_methods",
      value: '["paypal", "credit_card", "eft"]',
      category: "Payments",
      description: "Enabled payment methods",
      type: "json",
      lastModified: new Date("2024-11-28"),
    },
  ]);

  const toggleFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled, lastModified: new Date() }
          : feature,
      ),
    );
    toast({
      title: "Feature Updated",
      description: "Feature status has been updated successfully.",
    });
  };

  const updateSystemSetting = (key: string, value: string) => {
    setSystemSettings((prev) =>
      prev.map((setting) =>
        setting.key === key
          ? { ...setting, value, lastModified: new Date() }
          : setting,
      ),
    );
    toast({
      title: "Setting Updated",
      description: `System setting ${key} has been updated.`,
    });
  };

  const suspendUser = (userId: string) => {
    toast({
      title: "User Suspended",
      description: "User account has been suspended successfully.",
      variant: "destructive",
    });
  };

  const refundPayment = (paymentId: string) => {
    toast({
      title: "Refund Processed",
      description: "Payment refund has been initiated.",
    });
  };

  const restartService = (serviceName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Service Restarted",
        description: `${serviceName} has been restarted successfully.`,
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8 text-destructive" />
                Super Admin Dashboard
                <Badge variant="destructive">FULL CONTROL</Badge>
              </h1>
              <p className="text-muted-foreground mt-1">
                Complete system administration and monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  System Online
                </span>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts (3)
              </Button>
              <Button variant="destructive" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Stop
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Alert */}
      <div className="container mx-auto px-6 py-4">
        <Alert className="border-primary/20 bg-primary/10">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong>All systems operational</strong> -
              {systemMetrics.activeUsers} active users,
              {systemMetrics.requestsPerMinute} req/min,
              {systemMetrics.uptime}% uptime
            </span>
            <div className="flex gap-2">
              <Badge variant="outline">CPU: {systemMetrics.cpuUsage}%</Badge>
              <Badge variant="outline">RAM: {systemMetrics.memoryUsage}%</Badge>
              <Badge variant="outline">
                Errors: {systemMetrics.errorRate}%
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API Control</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemMetrics.activeUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R2.4M</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +24% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    System Load
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemMetrics.cpuUsage}%
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Error Rate
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemMetrics.errorRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingDown className="h-3 w-3 inline mr-1 text-primary" />
                    -0.01% from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* System Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time system metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>{systemMetrics.cpuUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.cpuUsage} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{systemMetrics.memoryUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.memoryUsage} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span>{systemMetrics.diskUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.diskUsage} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-2 rounded border">
                      <div className="text-lg font-bold">
                        {systemMetrics.requestsPerMinute}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Requests/min
                      </div>
                    </div>
                    <div className="p-2 rounded border">
                      <div className="text-lg font-bold">
                        {systemMetrics.responseTime}ms
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg Response
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        time: "2 min ago",
                        action: "New Enterprise user registered",
                        type: "success",
                      },
                      {
                        time: "5 min ago",
                        action: "Payment failed for user_003",
                        type: "error",
                      },
                      {
                        time: "8 min ago",
                        action: "API rate limit reached for client",
                        type: "warning",
                      },
                      {
                        time: "12 min ago",
                        action: "SAP integration sync completed",
                        type: "success",
                      },
                      {
                        time: "15 min ago",
                        action: "Bulk upload processed: 145 files",
                        type: "info",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === "success"
                              ? "bg-primary"
                              : activity.type === "error"
                                ? "bg-destructive"
                                : activity.type === "warning"
                                  ? "bg-muted-foreground"
                                  : "bg-primary"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="text-sm">{activity.action}</div>
                          <div className="text-xs text-muted-foreground">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <RefreshCw className="h-6 w-6 mb-2" />
                    Restart Services
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Database className="h-6 w-6 mb-2" />
                    Backup Database
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Bell className="h-6 w-6 mb-2" />
                    Send Broadcast
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage all user accounts and subscriptions
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "outline"
                                : user.status === "suspended"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastActive.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          R{user.totalSpent.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.location}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => suspendUser(user.id)}
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Management</CardTitle>
                    <CardDescription>
                      Monitor all payments and transactions
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync PayPal
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">
                          {payment.transactionId}
                        </TableCell>
                        <TableCell>
                          {users.find((u) => u.id === payment.userId)?.name ||
                            "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.planName}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "completed"
                                ? "outline"
                                : payment.status === "failed"
                                  ? "destructive"
                                  : payment.status === "refunded"
                                    ? "secondary"
                                    : "secondary"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payment.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            {payment.status === "completed" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => refundPayment(payment.id)}
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Feature Control</CardTitle>
                    <CardDescription>
                      Enable/disable features across the platform
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Feature
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {features.map((feature) => (
                    <Card key={feature.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{feature.name}</h3>
                            <Badge variant="outline">{feature.category}</Badge>
                            <Badge variant="secondary">
                              {feature.requiredPlan}+
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>
                              Usage: {feature.usageCount.toLocaleString()}
                            </span>
                            <span>
                              Modified:{" "}
                              {feature.lastModified.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Control Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Management</CardTitle>
                <CardDescription>
                  Monitor and control all API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requests</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead>Avg Response</TableHead>
                      <TableHead>Rate Limited</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiEndpoints.map((endpoint, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">
                          {endpoint.path}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{endpoint.method}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={endpoint.enabled ? "outline" : "secondary"}
                          >
                            {endpoint.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {endpoint.requestCount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {endpoint.errorCount > 0 ? (
                            <span className="text-destructive">
                              {endpoint.errorCount}
                            </span>
                          ) : (
                            <span className="text-primary">0</span>
                          )}
                        </TableCell>
                        <TableCell>{endpoint.avgResponseTime}ms</TableCell>
                        <TableCell>
                          {endpoint.rateLimited ? (
                            <Badge variant="secondary">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Enterprise Integrations</CardTitle>
                    <CardDescription>
                      Monitor ERP and business system integrations
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {integrations.map((integration) => (
                    <Card key={integration.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{integration.name}</h3>
                            <Badge
                              variant={
                                integration.status === "active"
                                  ? "outline"
                                  : integration.status === "error"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {integration.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                            <span>
                              Last sync: {integration.lastSync.toLocaleString()}
                            </span>
                            <span>
                              Records:{" "}
                              {integration.recordsProcessed.toLocaleString()}
                            </span>
                            <span>Errors: {integration.errorCount}</span>
                            <span>
                              Cost: R{integration.cost.toLocaleString()}/month
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => restartService(integration.name)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            {/* System Services */}
            <Card>
              <CardHeader>
                <CardTitle>System Services</CardTitle>
                <CardDescription>
                  Monitor and control system services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Web Server",
                      status: "running",
                      cpu: 15.2,
                      memory: 24.8,
                    },
                    {
                      name: "Database",
                      status: "running",
                      cpu: 8.7,
                      memory: 45.1,
                    },
                    {
                      name: "Redis Cache",
                      status: "running",
                      cpu: 2.1,
                      memory: 12.3,
                    },
                    {
                      name: "File Storage",
                      status: "running",
                      cpu: 1.8,
                      memory: 8.9,
                    },
                    {
                      name: "Background Jobs",
                      status: "running",
                      cpu: 5.4,
                      memory: 18.7,
                    },
                    {
                      name: "API Gateway",
                      status: "running",
                      cpu: 12.6,
                      memory: 22.1,
                    },
                  ].map((service, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{service.name}</h3>
                        <Badge variant="outline">{service.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>CPU:</span>
                          <span>{service.cpu}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span>{service.memory}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Logs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Logs</CardTitle>
                    <CardDescription>
                      Real-time system logs and errors
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm bg-secondary text-foreground p-4 rounded-lg max-h-64 overflow-y-auto border">
                  <div>
                    [2024-12-20 11:30:15] INFO: User authentication successful
                    for user_001
                  </div>
                  <div>
                    [2024-12-20 11:30:10] INFO: API request processed
                    /api/v1/calculate - 245ms
                  </div>
                  <div>
                    [2024-12-20 11:30:05]{" "}
                    <span className="text-destructive">ERROR</span>: Payment
                    processing failed for payment_003 - PayPal timeout
                  </div>
                  <div>
                    [2024-12-20 11:30:00] INFO: SAP integration sync completed -
                    15,420 records processed
                  </div>
                  <div>
                    [2024-12-20 11:29:55]{" "}
                    <span className="text-muted-foreground">WARN</span>: High
                    CPU usage detected on web-server-02 - 89%
                  </div>
                  <div>
                    [2024-12-20 11:29:50] INFO: User registration completed for
                    user_456
                  </div>
                  <div>
                    [2024-12-20 11:29:45] INFO: Scheduled backup completed
                    successfully - 2.4GB
                  </div>
                  <div>
                    [2024-12-20 11:29:40]{" "}
                    <span className="text-destructive">ERROR</span>: Database
                    connection timeout - retrying in 30s
                  </div>
                  <div>
                    [2024-12-20 11:29:35] INFO: Feature flag updated:
                    ai_optimization = true
                  </div>
                  <div>
                    [2024-12-20 11:29:30] INFO: Bulk upload processed - 145
                    files, 12 errors
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                      Configure system-wide settings and parameters
                    </CardDescription>
                  </div>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save All Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {systemSettings.map((setting) => (
                    <div
                      key={setting.key}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label className="text-base font-medium">
                              {setting.key}
                            </Label>
                            <Badge variant="outline">{setting.category}</Badge>
                            <Badge variant="secondary">{setting.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {setting.description}
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            Last modified:{" "}
                            {setting.lastModified.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="w-64">
                          {setting.type === "boolean" ? (
                            <Switch
                              checked={setting.value === "true"}
                              onCheckedChange={(checked) =>
                                updateSystemSetting(
                                  setting.key,
                                  checked.toString(),
                                )
                              }
                            />
                          ) : setting.type === "json" ? (
                            <Textarea
                              value={setting.value}
                              onChange={(e) =>
                                updateSystemSetting(setting.key, e.target.value)
                              }
                              className="font-mono text-xs"
                              rows={3}
                            />
                          ) : (
                            <Input
                              value={setting.value}
                              onChange={(e) =>
                                updateSystemSetting(setting.key, e.target.value)
                              }
                              type={
                                setting.type === "number" ? "number" : "text"
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
