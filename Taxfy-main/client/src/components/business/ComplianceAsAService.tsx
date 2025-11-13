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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Building,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Users,
  FileText,
  BarChart3,
  Globe,
  Award,
  Target,
  Activity,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share,
  Zap,
  Lock,
  Database,
  Network,
  Monitor,
  Crown,
  Sparkles,
  Info,
  ExternalLink,
} from "lucide-react";

interface ComplianceEntity {
  id: string;
  name: string;
  type:
    | "subsidiary"
    | "division"
    | "branch"
    | "holding_company"
    | "partnership";
  country: string;
  industry: string;
  employees: number;
  revenue: number;
  taxId: string;
  status: "compliant" | "warning" | "violation" | "pending_review";
  lastAudit: Date;
  nextAudit: Date;
  complianceScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  regulations: string[];
  contactPerson: string;
}

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  regulation: string;
  jurisdiction: string;
  category:
    | "tax"
    | "financial"
    | "data_privacy"
    | "employment"
    | "environmental"
    | "industry_specific";
  severity: "low" | "medium" | "high" | "critical";
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annually";
  automatedCheck: boolean;
  lastChecked: Date;
  nextCheck: Date;
  threshold: number;
  currentValue: number;
  status: "compliant" | "warning" | "violation";
}

interface ComplianceAlert {
  id: string;
  entityId: string;
  ruleId: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "acknowledged" | "resolved" | "false_positive";
  detectedAt: Date;
  dueDate: Date;
  assignedTo: string;
  remediationSteps: string[];
  estimatedCost: number;
  potentialPenalty: number;
}

interface ComplianceReport {
  id: string;
  name: string;
  type: "monthly" | "quarterly" | "annual" | "ad_hoc";
  entities: string[];
  generatedAt: Date;
  status: "generating" | "ready" | "sent" | "archived";
  format: "pdf" | "excel" | "dashboard";
  recipients: string[];
  summary: {
    totalEntities: number;
    compliantEntities: number;
    activeViolations: number;
    criticalIssues: number;
    overallScore: number;
  };
}

export default function ComplianceAsAService() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [monitoringActive, setMonitoringActive] = useState(true);
  const [alertsCount, setAlertsCount] = useState(3);

  // Mock data
  const complianceEntities: ComplianceEntity[] = [
    {
      id: "entity_001",
      name: "ABC Holdings (Pty) Ltd",
      type: "holding_company",
      country: "South Africa",
      industry: "Financial Services",
      employees: 850,
      revenue: 125000000,
      taxId: "1234567890",
      status: "compliant",
      lastAudit: new Date("2024-11-15"),
      nextAudit: new Date("2025-02-15"),
      complianceScore: 96.5,
      riskLevel: "low",
      regulations: [
        "SARS",
        "POPIA",
        "Financial Intelligence Centre Act",
        "Companies Act",
      ],
      contactPerson: "John Smith - Group CFO",
    },
    {
      id: "entity_002",
      name: "ABC Insurance Ltd",
      type: "subsidiary",
      country: "South Africa",
      industry: "Insurance",
      employees: 320,
      revenue: 45000000,
      taxId: "2345678901",
      status: "warning",
      lastAudit: new Date("2024-10-20"),
      nextAudit: new Date("2025-01-20"),
      complianceScore: 88.2,
      riskLevel: "medium",
      regulations: ["SARS", "POPIA", "Insurance Act", "FSP Act"],
      contactPerson: "Jane Doe - Compliance Manager",
    },
    {
      id: "entity_003",
      name: "ABC Investments (Namibia)",
      type: "branch",
      country: "Namibia",
      industry: "Investment Management",
      employees: 120,
      revenue: 18000000,
      taxId: "3456789012",
      status: "compliant",
      lastAudit: new Date("2024-12-01"),
      nextAudit: new Date("2025-03-01"),
      complianceScore: 94.1,
      riskLevel: "low",
      regulations: [
        "Namibian Revenue Service",
        "Data Protection Act",
        "Investment Funds Act",
      ],
      contactPerson: "Mike Wilson - Regional Manager",
    },
  ];

  const complianceRules: ComplianceRule[] = [
    {
      id: "rule_001",
      name: "SARS Monthly Returns Filing",
      description:
        "Monthly VAT and PAYE returns must be filed by the 7th of each month",
      regulation: "South African Revenue Service",
      jurisdiction: "South Africa",
      category: "tax",
      severity: "high",
      frequency: "monthly",
      automatedCheck: true,
      lastChecked: new Date("2024-12-20T08:00:00"),
      nextCheck: new Date("2025-01-07T08:00:00"),
      threshold: 7, // days into month
      currentValue: 3,
      status: "compliant",
    },
    {
      id: "rule_002",
      name: "POPIA Data Processing Consent",
      description:
        "All personal data processing must have valid consent documentation",
      regulation: "Protection of Personal Information Act",
      jurisdiction: "South Africa",
      category: "data_privacy",
      severity: "critical",
      frequency: "daily",
      automatedCheck: true,
      lastChecked: new Date("2024-12-20T10:30:00"),
      nextCheck: new Date("2024-12-21T10:30:00"),
      threshold: 100, // percentage compliance
      currentValue: 94.5,
      status: "warning",
    },
    {
      id: "rule_003",
      name: "Financial Reporting Standards",
      description:
        "Quarterly financial reports must comply with IFRS standards",
      regulation: "International Financial Reporting Standards",
      jurisdiction: "Global",
      category: "financial",
      severity: "high",
      frequency: "quarterly",
      automatedCheck: false,
      lastChecked: new Date("2024-12-01"),
      nextCheck: new Date("2025-01-01"),
      threshold: 100,
      currentValue: 98.2,
      status: "compliant",
    },
  ];

  const complianceAlerts: ComplianceAlert[] = [
    {
      id: "alert_001",
      entityId: "entity_002",
      ruleId: "rule_002",
      title: "POPIA Compliance Gap Detected",
      description:
        "Data processing consent documentation is below required threshold for ABC Insurance Ltd",
      severity: "high",
      status: "active",
      detectedAt: new Date("2024-12-20T09:15:00"),
      dueDate: new Date("2024-12-22T17:00:00"),
      assignedTo: "Jane Doe - Compliance Manager",
      remediationSteps: [
        "Review current consent management processes",
        "Update consent forms to meet POPIA requirements",
        "Implement automated consent tracking system",
        "Train staff on new procedures",
      ],
      estimatedCost: 45000,
      potentialPenalty: 250000,
    },
    {
      id: "alert_002",
      entityId: "entity_001",
      ruleId: "rule_001",
      title: "Upcoming Tax Filing Deadline",
      description: "January 2025 VAT return due in 3 days for ABC Holdings",
      severity: "medium",
      status: "acknowledged",
      detectedAt: new Date("2024-12-20T08:00:00"),
      dueDate: new Date("2025-01-07T23:59:00"),
      assignedTo: "John Smith - Group CFO",
      remediationSteps: [
        "Gather December transaction data",
        "Calculate VAT liability",
        "Prepare and submit return via eFiling",
      ],
      estimatedCost: 2500,
      potentialPenalty: 15000,
    },
  ];

  const complianceReports: ComplianceReport[] = [
    {
      id: "report_001",
      name: "December 2024 Compliance Report",
      type: "monthly",
      entities: ["entity_001", "entity_002", "entity_003"],
      generatedAt: new Date("2024-12-01"),
      status: "ready",
      format: "pdf",
      recipients: [
        "ceo@company.com",
        "cfo@company.com",
        "compliance@company.com",
      ],
      summary: {
        totalEntities: 3,
        compliantEntities: 2,
        activeViolations: 1,
        criticalIssues: 0,
        overallScore: 92.9,
      },
    },
  ];

  // Simulate real-time monitoring
  useEffect(() => {
    if (monitoringActive) {
      const interval = setInterval(() => {
        setAlertsCount((prev) => prev + Math.floor(Math.random() * 2));
      }, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [monitoringActive]);

  const filteredEntities =
    selectedEntity === "all"
      ? complianceEntities
      : complianceEntities.filter((e) => e.id === selectedEntity);

  const overallComplianceScore =
    complianceEntities.reduce(
      (sum, entity) => sum + entity.complianceScore,
      0,
    ) / complianceEntities.length;
  const activeViolations = complianceAlerts.filter(
    (alert) => alert.status === "active" && alert.severity === "high",
  ).length;
  const criticalIssues = complianceAlerts.filter(
    (alert) => alert.status === "active" && alert.severity === "critical",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-red-500/20 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-500/10">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Compliance-as-a-Service (CaaS)
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Enterprise Solution
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  Automated compliance monitoring and management across all your
                  entities
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity
                  className={`h-4 w-4 ${monitoringActive ? "text-green-600 animate-pulse" : "text-red-600"}`}
                />
                {monitoringActive ? "Monitoring Active" : "Monitoring Paused"}
              </div>
              <Button
                variant="outline"
                onClick={() => setMonitoringActive(!monitoringActive)}
              >
                {monitoringActive ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Entity
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Alerts Banner */}
      {activeViolations > 0 && (
        <Alert className="border-orange-500/20 bg-orange-500/10">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <span className="font-medium">
                {activeViolations} compliance violation
                {activeViolations !== 1 ? "s" : ""} require immediate attention
              </span>
              {criticalIssues > 0 && (
                <span className="text-red-600 ml-2">
                  ({criticalIssues} critical)
                </span>
              )}
            </span>
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3 mr-2" />
              View All Alerts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Compliance
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overallComplianceScore.toFixed(1)}%
            </div>
            <Progress value={overallComplianceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Across {complianceEntities.length} entities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceAlerts.filter((a) => a.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {criticalIssues} critical, {activeViolations} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monitored Entities
            </CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceEntities.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                complianceEntities.filter((e) => e.status === "compliant")
                  .length
              }{" "}
              compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Rules
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRules.length}</div>
            <p className="text-xs text-muted-foreground">
              {complianceRules.filter((r) => r.automatedCheck).length} automated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Compliance Tabs */}
      <Tabs defaultValue="entities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="rules">Compliance Rules</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter by Entity:</label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Entities</option>
                {complianceEntities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1" />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {filteredEntities.map((entity) => (
            <Card key={entity.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        entity.status === "compliant"
                          ? "bg-green-500/10"
                          : entity.status === "warning"
                            ? "bg-yellow-500/10"
                            : entity.status === "violation"
                              ? "bg-red-500/10"
                              : "bg-gray-500/10"
                      }`}
                    >
                      {entity.status === "compliant" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {entity.status === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      {entity.status === "violation" && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      {entity.status === "pending_review" && (
                        <Clock className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{entity.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {entity.type.replace("_", " ")} • {entity.country} •{" "}
                        {entity.industry}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {entity.employees} employees
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />R
                          {(entity.revenue / 1000000).toFixed(0)}M revenue
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Next audit: {entity.nextAudit.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {entity.complianceScore}%
                    </div>
                    <Badge
                      variant={
                        entity.riskLevel === "low"
                          ? "outline"
                          : entity.riskLevel === "medium"
                            ? "secondary"
                            : entity.riskLevel === "high"
                              ? "destructive"
                              : "destructive"
                      }
                    >
                      {entity.riskLevel} risk
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Applicable Regulations:
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {entity.regulations.map((regulation, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {regulation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Contact Information:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {entity.contactPerson}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Tax ID: {entity.taxId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Compliance Score:
                    </span>
                    <Progress
                      value={entity.complianceScore}
                      className="w-20 h-2"
                    />
                    <span className="text-sm font-medium">
                      {entity.complianceScore}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-3 w-3 mr-2" />
                      Compliance Report
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

        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">
              Compliance Rules & Monitoring
            </h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Rules
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>

          {complianceRules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        rule.status === "compliant"
                          ? "bg-green-500/10"
                          : rule.status === "warning"
                            ? "bg-yellow-500/10"
                            : "bg-red-500/10"
                      }`}
                    >
                      {rule.status === "compliant" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {rule.status === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      {rule.status === "violation" && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {rule.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {rule.jurisdiction}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rule.frequency} checks
                        </span>
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          Last: {rule.lastChecked.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        rule.severity === "critical"
                          ? "destructive"
                          : rule.severity === "high"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {rule.severity}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {rule.category.replace("_", " ")}
                    </div>
                    {rule.automatedCheck && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <Zap className="h-3 w-3" />
                        Automated
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Regulation
                    </div>
                    <div className="font-medium text-sm">{rule.regulation}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Current Value
                    </div>
                    <div className="font-medium text-sm">
                      {rule.currentValue}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Threshold
                    </div>
                    <div className="font-medium text-sm">{rule.threshold}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Compliance Level</span>
                    <span>
                      {((rule.currentValue / rule.threshold) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={(rule.currentValue / rule.threshold) * 100}
                    className="h-2"
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit Rule
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Check Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Active Compliance Alerts</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Configure Notifications
            </Button>
          </div>

          {complianceAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`border-l-4 ${
                alert.severity === "critical"
                  ? "border-l-red-500"
                  : alert.severity === "high"
                    ? "border-l-orange-500"
                    : alert.severity === "medium"
                      ? "border-l-yellow-500"
                      : "border-l-blue-500"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {alert.title}
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : alert.severity === "high"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {alert.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Detected: {alert.detectedAt.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Due: {alert.dueDate.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {alert.assignedTo}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      alert.status === "active"
                        ? "destructive"
                        : alert.status === "acknowledged"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {alert.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Remediation Steps:
                    </h4>
                    <ol className="space-y-1">
                      {alert.remediationSteps.map((step, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded border">
                      <div className="text-sm text-muted-foreground">
                        Estimated Remediation Cost
                      </div>
                      <div className="text-lg font-bold">
                        R{alert.estimatedCost.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded border bg-red-500/10">
                      <div className="text-sm text-muted-foreground">
                        Potential Penalty
                      </div>
                      <div className="text-lg font-bold text-red-600">
                        R{alert.potentialPenalty.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {alert.status === "active" && (
                    <Button size="sm">
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Acknowledge
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-2" />
                    View Entity
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-3 w-3 mr-2" />
                    Notify Team
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-3 w-3 mr-2" />
                    Escalate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Compliance Reports</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Report Settings
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Monthly Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 rounded border">
                    <div className="text-2xl font-bold text-green-600">
                      92.9%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average Compliance
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    <Download className="h-3 w-3 mr-2" />
                    Download December Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quarterly Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 rounded border">
                    <div className="text-2xl font-bold text-blue-600">Q4</div>
                    <div className="text-sm text-muted-foreground">
                      2024 Analysis
                    </div>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">
                    <Calendar className="h-3 w-3 mr-2" />
                    Schedule for Jan 15
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 rounded border">
                    <div className="text-2xl font-bold text-purple-600">
                      2024
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Annual Review
                    </div>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">
                    <TrendingUp className="h-3 w-3 mr-2" />
                    Generate Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 rounded border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {report.type} • {report.entities.length} entities •{" "}
                          {report.generatedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Real-time Monitoring Dashboard
              </CardTitle>
              <CardDescription>
                Live compliance monitoring across all entities and regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-lg">Live</div>
                  <div className="text-sm text-muted-foreground">
                    Monitoring Status
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-lg">24/7</div>
                  <div className="text-sm text-muted-foreground">Coverage</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10">
                  <Database className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-lg">45</div>
                  <div className="text-sm text-muted-foreground">
                    Data Sources
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-500/10">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-bold text-lg">&lt;5min</div>
                  <div className="text-sm text-muted-foreground">
                    Alert Response
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Real-time Monitoring</span>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alert Notifications</span>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">Enabled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Automated Remediation</span>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-600">Partial</span>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Settings className="h-3 w-3 mr-2" />
                  Configure Monitoring
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    metric: "Data Processing Speed",
                    value: "2.3K/min",
                    status: "good",
                  },
                  {
                    metric: "Alert Response Time",
                    value: "3.2 seconds",
                    status: "good",
                  },
                  {
                    metric: "System Uptime",
                    value: "99.97%",
                    status: "excellent",
                  },
                  {
                    metric: "Rule Execution Success",
                    value: "99.8%",
                    status: "excellent",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.value}</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === "excellent"
                            ? "bg-green-600"
                            : item.status === "good"
                              ? "bg-blue-600"
                              : "bg-yellow-600"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
