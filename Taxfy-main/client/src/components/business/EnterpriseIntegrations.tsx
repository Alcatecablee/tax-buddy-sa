import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Network,
  Building,
  Users,
  Database,
  Code,
  Settings,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Link as LinkIcon,
  Key,
  Shield,
  Globe,
  BarChart3,
  FileText,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Truck,
  Package,
  Archive,
  Target,
  Award,
  Crown,
  Sparkles,
  Search,
  Filter,
  Copy,
  ExternalLink,
  MessageSquare,
  Workflow,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category:
    | "erp"
    | "crm"
    | "accounting"
    | "hr"
    | "banking"
    | "payment"
    | "communication"
    | "custom";
  vendor: string;
  description: string;
  status: "active" | "pending" | "inactive" | "error";
  setupDate: Date;
  lastSync: Date;
  syncFrequency: string;
  recordsSync: number;
  apiVersion: string;
  authMethod: "oauth" | "api_key" | "certificate" | "webhook";
  endpoints: string[];
  features: string[];
  businessValue: string;
  monthlyUsage: {
    apiCalls: number;
    dataTransfer: number;
    cost: number;
  };
}

interface DataFlow {
  id: string;
  name: string;
  source: string;
  destination: string;
  dataType: string;
  direction: "inbound" | "outbound" | "bidirectional";
  schedule: string;
  status: "running" | "paused" | "error";
  lastRun: Date;
  recordsProcessed: number;
  transformations: string[];
}

interface CustomWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: "active" | "inactive";
  executionCount: number;
  lastExecution: Date;
  successRate: number;
}

export default function EnterpriseIntegrations() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDeploying, setIsDeploying] = useState(false);

  // Mock integration data
  const integrations: Integration[] = [
    {
      id: "int_001",
      name: "SAP Business One",
      category: "erp",
      vendor: "SAP",
      description:
        "Complete ERP integration for financial data, employee records, and tax calculations",
      status: "active",
      setupDate: new Date("2024-10-15"),
      lastSync: new Date("2024-12-20T10:30:00"),
      syncFrequency: "Real-time",
      recordsSync: 15420,
      apiVersion: "v3.2",
      authMethod: "oauth",
      endpoints: ["/financials", "/employees", "/payroll", "/reporting"],
      features: [
        "Real-time financial data sync",
        "Employee payroll integration",
        "Automated tax calculations",
        "Custom reporting dashboards",
      ],
      businessValue:
        "Eliminates manual data entry, reduces errors by 95%, saves 40 hours/month",
      monthlyUsage: {
        apiCalls: 125000,
        dataTransfer: 2.4,
        cost: 8500,
      },
    },
    {
      id: "int_002",
      name: "Salesforce CRM",
      category: "crm",
      vendor: "Salesforce",
      description:
        "CRM integration for client management and tax service delivery tracking",
      status: "active",
      setupDate: new Date("2024-09-20"),
      lastSync: new Date("2024-12-20T09:45:00"),
      syncFrequency: "Every 15 minutes",
      recordsSync: 8950,
      apiVersion: "v55.0",
      authMethod: "oauth",
      endpoints: ["/accounts", "/contacts", "/opportunities", "/cases"],
      features: [
        "Client onboarding automation",
        "Tax service tracking",
        "Compliance deadline management",
        "Revenue forecasting",
      ],
      businessValue:
        "Improves client retention by 25%, increases cross-sell by 35%",
      monthlyUsage: {
        apiCalls: 89000,
        dataTransfer: 1.8,
        cost: 5200,
      },
    },
    {
      id: "int_003",
      name: "QuickBooks Enterprise",
      category: "accounting",
      vendor: "Intuit",
      description:
        "Accounting system integration for comprehensive financial management",
      status: "active",
      setupDate: new Date("2024-11-01"),
      lastSync: new Date("2024-12-20T11:15:00"),
      syncFrequency: "Hourly",
      recordsSync: 12750,
      apiVersion: "v3",
      authMethod: "oauth",
      endpoints: ["/items", "/customers", "/vendors", "/reports"],
      features: [
        "Chart of accounts sync",
        "Transaction categorization",
        "Financial reporting",
        "Tax preparation data",
      ],
      businessValue:
        "Reduces month-end close time by 60%, improves accuracy to 99.5%",
      monthlyUsage: {
        apiCalls: 65000,
        dataTransfer: 1.2,
        cost: 3800,
      },
    },
    {
      id: "int_004",
      name: "Microsoft Dynamics 365",
      category: "erp",
      vendor: "Microsoft",
      description:
        "Enterprise resource planning for large-scale business operations",
      status: "active",
      setupDate: new Date("2024-08-10"),
      lastSync: new Date("2024-12-20T10:00:00"),
      syncFrequency: "Real-time",
      recordsSync: 28500,
      apiVersion: "v9.2",
      authMethod: "certificate",
      endpoints: ["/finance", "/operations", "/hr", "/supply-chain"],
      features: [
        "Multi-entity consolidation",
        "Advanced financial reporting",
        "Supply chain tax calculations",
        "Global compliance management",
      ],
      businessValue: "Supports 50+ entities, reduces compliance costs by 45%",
      monthlyUsage: {
        apiCalls: 185000,
        dataTransfer: 4.2,
        cost: 12500,
      },
    },
    {
      id: "int_005",
      name: "Workday HCM",
      category: "hr",
      vendor: "Workday",
      description:
        "Human capital management for payroll and employee tax calculations",
      status: "active",
      setupDate: new Date("2024-07-25"),
      lastSync: new Date("2024-12-20T08:30:00"),
      syncFrequency: "Daily",
      recordsSync: 5650,
      apiVersion: "v35.2",
      authMethod: "oauth",
      endpoints: ["/workers", "/payroll", "/benefits", "/time-tracking"],
      features: [
        "Payroll tax calculations",
        "Benefits administration",
        "Compliance reporting",
        "Employee self-service",
      ],
      businessValue:
        "Automates 90% of payroll tax processes, ensures 100% compliance",
      monthlyUsage: {
        apiCalls: 45000,
        dataTransfer: 0.8,
        cost: 2800,
      },
    },
    {
      id: "int_006",
      name: "Standard Bank API",
      category: "banking",
      vendor: "Standard Bank",
      description:
        "Banking integration for transaction categorization and reconciliation",
      status: "active",
      setupDate: new Date("2024-12-01"),
      lastSync: new Date("2024-12-20T11:30:00"),
      syncFrequency: "Real-time",
      recordsSync: 18750,
      apiVersion: "v2.1",
      authMethod: "api_key",
      endpoints: ["/accounts", "/transactions", "/statements"],
      features: [
        "Transaction categorization",
        "Bank reconciliation",
        "Expense tracking",
        "Tax document generation",
      ],
      businessValue:
        "Reduces reconciliation time by 80%, improves accuracy to 99.8%",
      monthlyUsage: {
        apiCalls: 95000,
        dataTransfer: 1.5,
        cost: 4200,
      },
    },
  ];

  const dataFlows: DataFlow[] = [
    {
      id: "flow_001",
      name: "SAP to Tax Engine",
      source: "SAP Business One",
      destination: "Taxfy Tax Engine",
      dataType: "Employee Payroll Data",
      direction: "inbound",
      schedule: "Real-time",
      status: "running",
      lastRun: new Date("2024-12-20T10:30:00"),
      recordsProcessed: 2450,
      transformations: [
        "Currency conversion",
        "Data validation",
        "Tax code mapping",
      ],
    },
    {
      id: "flow_002",
      name: "Tax Results to QuickBooks",
      source: "Taxfy Tax Engine",
      destination: "QuickBooks Enterprise",
      dataType: "Tax Calculations",
      direction: "outbound",
      schedule: "Hourly",
      status: "running",
      lastRun: new Date("2024-12-20T11:00:00"),
      recordsProcessed: 850,
      transformations: [
        "Format conversion",
        "Account mapping",
        "Journal entry creation",
      ],
    },
    {
      id: "flow_003",
      name: "Banking Transactions Sync",
      source: "Standard Bank API",
      destination: "Multiple Systems",
      dataType: "Transaction Data",
      direction: "bidirectional",
      schedule: "Real-time",
      status: "running",
      lastRun: new Date("2024-12-20T11:25:00"),
      recordsProcessed: 1250,
      transformations: [
        "Transaction categorization",
        "Duplicate detection",
        "Tax classification",
      ],
    },
  ];

  const customWorkflows: CustomWorkflow[] = [
    {
      id: "wf_001",
      name: "Monthly Tax Compliance Report",
      description:
        "Automated generation of monthly compliance reports from multiple systems",
      trigger: "Last day of month",
      actions: [
        "Collect data from all integrated systems",
        "Generate compliance calculations",
        "Create executive summary report",
        "Email to stakeholders",
      ],
      status: "active",
      executionCount: 12,
      lastExecution: new Date("2024-11-30"),
      successRate: 100,
    },
    {
      id: "wf_002",
      name: "New Employee Tax Setup",
      description: "Automatic tax setup for new employees across all systems",
      trigger: "New employee in Workday",
      actions: [
        "Create tax profile in Taxfy",
        "Setup payroll deductions",
        "Configure benefit allocations",
        "Send welcome package",
      ],
      status: "active",
      executionCount: 45,
      lastExecution: new Date("2024-12-18"),
      successRate: 97.8,
    },
    {
      id: "wf_003",
      name: "Compliance Alert System",
      description:
        "Monitor for compliance issues across all integrated systems",
      trigger: "Real-time monitoring",
      actions: [
        "Check compliance thresholds",
        "Identify potential violations",
        "Alert compliance team",
        "Generate remediation plan",
      ],
      status: "active",
      executionCount: 1250,
      lastExecution: new Date("2024-12-20T11:30:00"),
      successRate: 99.2,
    },
  ];

  const categories = [
    { id: "all", name: "All Integrations", count: integrations.length },
    {
      id: "erp",
      name: "ERP Systems",
      count: integrations.filter((i) => i.category === "erp").length,
    },
    {
      id: "crm",
      name: "CRM Systems",
      count: integrations.filter((i) => i.category === "crm").length,
    },
    {
      id: "accounting",
      name: "Accounting",
      count: integrations.filter((i) => i.category === "accounting").length,
    },
    {
      id: "hr",
      name: "HR Systems",
      count: integrations.filter((i) => i.category === "hr").length,
    },
    {
      id: "banking",
      name: "Banking",
      count: integrations.filter((i) => i.category === "banking").length,
    },
  ];

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter((i) => i.category === selectedCategory);

  const totalMonthlyCost = integrations.reduce(
    (sum, int) => sum + int.monthlyUsage.cost,
    0,
  );
  const totalApiCalls = integrations.reduce(
    (sum, int) => sum + int.monthlyUsage.apiCalls,
    0,
  );
  const activeIntegrations = integrations.filter(
    (i) => i.status === "active",
  ).length;

  const deployIntegration = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Network className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Enterprise Integrations
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    Pro & Elite
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  Custom integrations with ERP, CRM, and business systems for
                  seamless data flow
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Code className="h-4 w-4 mr-2" />
                API Documentation
              </Button>
              <Button onClick={deployIntegration} disabled={isDeploying}>
                {isDeploying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    New Integration
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Deployment Status */}
      {isDeploying && (
        <Alert className="border-purple-500/20 bg-purple-500/10">
          <Zap className="h-4 w-4 text-purple-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium">Deploying new integration...</span>
              <div className="text-sm text-muted-foreground mt-1">
                Setting up OAuth connection, configuring data mapping, and
                testing endpoints
              </div>
            </div>
            <Progress value={70} className="w-32" />
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Integrations
            </CardTitle>
            <Network className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIntegrations}</div>
            <p className="text-xs text-muted-foreground">
              {integrations.length} total configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly API Calls
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalApiCalls / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              Across all integrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Integration Costs
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{totalMonthlyCost.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly operational cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data Processed
            </CardTitle>
            <Database className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                integrations.reduce((sum, int) => sum + int.recordsSync, 0) /
                1000
              ).toFixed(0)}
              K
            </div>
            <p className="text-xs text-muted-foreground">Records this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Active Integrations</TabsTrigger>
          <TabsTrigger value="dataflows">Data Flows</TabsTrigger>
          <TabsTrigger value="workflows">Custom Workflows</TabsTrigger>
          <TabsTrigger value="marketplace">Integration Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
            <div className="flex-1" />
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        integration.category === "erp"
                          ? "bg-blue-500/10"
                          : integration.category === "crm"
                            ? "bg-green-500/10"
                            : integration.category === "accounting"
                              ? "bg-purple-500/10"
                              : integration.category === "hr"
                                ? "bg-orange-500/10"
                                : integration.category === "banking"
                                  ? "bg-red-500/10"
                                  : "bg-gray-500/10"
                      }`}
                    >
                      {integration.category === "erp" && (
                        <Building className="h-5 w-5 text-blue-600" />
                      )}
                      {integration.category === "crm" && (
                        <Users className="h-5 w-5 text-green-600" />
                      )}
                      {integration.category === "accounting" && (
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                      )}
                      {integration.category === "hr" && (
                        <Users className="h-5 w-5 text-orange-600" />
                      )}
                      {integration.category === "banking" && (
                        <DollarSign className="h-5 w-5 text-red-600" />
                      )}
                      {integration.category === "custom" && (
                        <Code className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {integration.name}
                        <Badge variant="outline">{integration.vendor}</Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {integration.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last sync: {integration.lastSync.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {integration.recordsSync.toLocaleString()} records
                        </span>
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          {integration.syncFrequency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        integration.status === "active"
                          ? "outline"
                          : integration.status === "pending"
                            ? "secondary"
                            : integration.status === "error"
                              ? "destructive"
                              : "secondary"
                      }
                    >
                      {integration.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      API v{integration.apiVersion}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {integration.features
                        .slice(0, 3)
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm flex items-center gap-2"
                          >
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      {integration.features.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{integration.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Business Value:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {integration.businessValue}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold">
                      {(integration.monthlyUsage.apiCalls / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      API Calls/Month
                    </div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold">
                      {integration.monthlyUsage.dataTransfer}GB
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Data Transfer
                    </div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold">
                      R{integration.monthlyUsage.cost.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Monthly Cost
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{integration.authMethod}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {integration.endpoints.length} endpoints
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-2" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-3 w-3 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dataflows" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Data Flow Management</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Workflow className="h-4 w-4 mr-2" />
              Create New Flow
            </Button>
          </div>

          {dataFlows.map((flow) => (
            <Card key={flow.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        flow.direction === "inbound"
                          ? "bg-green-500/10"
                          : flow.direction === "outbound"
                            ? "bg-blue-500/10"
                            : "bg-purple-500/10"
                      }`}
                    >
                      {flow.direction === "inbound" && (
                        <Download className="h-5 w-5 text-green-600" />
                      )}
                      {flow.direction === "outbound" && (
                        <Upload className="h-5 w-5 text-blue-600" />
                      )}
                      {flow.direction === "bidirectional" && (
                        <RefreshCw className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {flow.source} → {flow.destination} | {flow.dataType}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {flow.schedule}
                        </span>
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {flow.recordsProcessed.toLocaleString()} records
                        </span>
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          Last run: {flow.lastRun.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        flow.status === "running"
                          ? "outline"
                          : flow.status === "paused"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {flow.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Data Transformations:
                    </h4>
                    <div className="flex gap-2">
                      {flow.transformations.map((transform, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {transform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {flow.status === "running" ? (
                        <>
                          <Pause className="h-3 w-3 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      View Logs
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Custom Automation Workflows</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          {customWorkflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {workflow.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Trigger: {workflow.trigger}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {workflow.executionCount} executions
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {workflow.successRate}% success rate
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        workflow.status === "active" ? "outline" : "secondary"
                      }
                    >
                      {workflow.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      Last: {workflow.lastExecution.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Workflow Actions:
                    </h4>
                    <ol className="space-y-1">
                      {workflow.actions.map((action, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          {action}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Success Rate:
                      </span>
                      <Progress
                        value={workflow.successRate}
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">
                        {workflow.successRate}%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-2" />
                        View History
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-2" />
                        Edit Workflow
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
              <CardDescription>
                Pre-built integrations ready to deploy for your enterprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Oracle NetSuite",
                    category: "ERP",
                    description:
                      "Complete ERP integration for large enterprises",
                    cost: "R15,000/month",
                    setup: "R50,000",
                  },
                  {
                    name: "HubSpot CRM",
                    category: "CRM",
                    description: "Marketing and sales automation platform",
                    cost: "R8,500/month",
                    setup: "R25,000",
                  },
                  {
                    name: "Sage Pastel",
                    category: "Accounting",
                    description: "Popular South African accounting system",
                    cost: "R5,200/month",
                    setup: "R15,000",
                  },
                  {
                    name: "BambooHR",
                    category: "HR",
                    description: "Human resources management system",
                    cost: "R6,800/month",
                    setup: "R20,000",
                  },
                  {
                    name: "FNB API Gateway",
                    category: "Banking",
                    description: "First National Bank integration",
                    cost: "R4,500/month",
                    setup: "R12,000",
                  },
                  {
                    name: "PayFast",
                    category: "Payment",
                    description: "South African payment processor",
                    cost: "R3,200/month",
                    setup: "R8,000",
                  },
                ].map((integration, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {integration.name}
                      </CardTitle>
                      <Badge variant="outline">{integration.category}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Monthly cost:</span>
                          <span className="font-medium">
                            {integration.cost}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Setup fee:</span>
                          <span className="font-medium">
                            {integration.setup}
                          </span>
                        </div>
                      </div>
                      <Button className="w-full" size="sm">
                        <Zap className="h-3 w-3 mr-2" />
                        Deploy Integration
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Integration Services</CardTitle>
              <CardDescription>
                Need a custom integration? Our team can build it for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">What we can integrate:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Legacy ERP systems
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Custom databases
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Proprietary software
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Third-party APIs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Industry-specific systems
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Custom Integration Packages:</h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded border">
                      <div className="font-medium">
                        Basic Custom Integration
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Simple API connections
                      </div>
                      <div className="text-lg font-bold mt-1">R75,000</div>
                    </div>
                    <div className="p-3 rounded border">
                      <div className="font-medium">Advanced Integration</div>
                      <div className="text-sm text-muted-foreground">
                        Complex workflows & transformations
                      </div>
                      <div className="text-lg font-bold mt-1">R150,000</div>
                    </div>
                    <div className="p-3 rounded border">
                      <div className="font-medium">Enterprise Solution</div>
                      <div className="text-sm text-muted-foreground">
                        Full custom development
                      </div>
                      <div className="text-lg font-bold mt-1">R300,000+</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Quote
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
