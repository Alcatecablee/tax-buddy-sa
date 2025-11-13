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
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  TrendingUp,
  FileCheck,
  Users,
  Globe,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search,
  Activity,
  Target,
  BarChart3,
  Zap,
  Lock,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  ExternalLink,
} from "lucide-react";

interface ComplianceRule {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "compliant" | "warning" | "violation" | "monitoring";
  lastChecked: Date;
  nextCheck: Date;
  automatedResponse: boolean;
  regulatoryBody: string;
  ruleDetails: {
    requirement: string;
    penalty: string;
    remediation: string[];
  };
}

interface ComplianceAlert {
  id: string;
  timestamp: Date;
  type: "violation" | "warning" | "info" | "resolved";
  rule: string;
  entity: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "acknowledged" | "resolved";
  assignedTo?: string;
  dueDate?: Date;
  actions: string[];
}

interface RegulationUpdate {
  id: string;
  date: Date;
  title: string;
  body: string;
  impact: "high" | "medium" | "low";
  affectedRules: string[];
  implementationDeadline: Date;
  status: "pending" | "implemented" | "reviewing";
}

export default function RealTimeCompliance() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock compliance data
  const complianceRules: ComplianceRule[] = [
    {
      id: "rule_001",
      name: "SARS Tax Calculation Accuracy",
      category: "Tax Compliance",
      description:
        "All tax calculations must comply with current SARS regulations",
      severity: "critical",
      status: "compliant",
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      automatedResponse: true,
      regulatoryBody: "SARS",
      ruleDetails: {
        requirement:
          "Tax calculations must be accurate to within 0.01% of SARS requirements",
        penalty: "Penalties up to R50,000 for incorrect submissions",
        remediation: [
          "Update calculation algorithms",
          "Implement additional validation checks",
          "Review tax rate tables",
        ],
      },
    },
    {
      id: "rule_002",
      name: "POPIA Data Processing",
      category: "Data Privacy",
      description:
        "Personal information processing must comply with POPIA requirements",
      severity: "critical",
      status: "compliant",
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      automatedResponse: true,
      regulatoryBody: "Information Regulator",
      ruleDetails: {
        requirement: "Lawful basis required for all personal data processing",
        penalty: "Fines up to R10 million or 10% of annual turnover",
        remediation: [
          "Review consent mechanisms",
          "Update privacy policies",
          "Implement data minimization",
        ],
      },
    },
    {
      id: "rule_003",
      name: "Financial Records Retention",
      category: "Record Keeping",
      description: "Financial records must be retained for required periods",
      severity: "high",
      status: "warning",
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      automatedResponse: false,
      regulatoryBody: "SARS",
      ruleDetails: {
        requirement:
          "Records must be retained for 5 years from date of assessment",
        penalty: "Administrative penalties and audit complications",
        remediation: [
          "Implement automated retention policies",
          "Review current record storage",
          "Set up retention reminders",
        ],
      },
    },
    {
      id: "rule_004",
      name: "Cross-Border Data Transfer",
      category: "Data Privacy",
      description: "International data transfers must have adequate safeguards",
      severity: "medium",
      status: "monitoring",
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      automatedResponse: true,
      regulatoryBody: "Information Regulator",
      ruleDetails: {
        requirement: "Adequate safeguards required for international transfers",
        penalty: "Suspension of data processing operations",
        remediation: [
          "Implement data transfer agreements",
          "Review international processing",
          "Update security measures",
        ],
      },
    },
  ];

  const complianceAlerts: ComplianceAlert[] = [
    {
      id: "alert_001",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "warning",
      rule: "Financial Records Retention",
      entity: "Document Storage System",
      description: "Some financial records approaching retention deadline",
      severity: "medium",
      status: "active",
      assignedTo: "compliance@taxfy.co.za",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      actions: [
        "Review affected records",
        "Extend retention if required",
        "Archive or dispose as appropriate",
      ],
    },
    {
      id: "alert_002",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "info",
      rule: "SARS Tax Calculation Accuracy",
      entity: "Tax Engine",
      description:
        "Successfully processed 1,247 tax calculations with 100% accuracy",
      severity: "low",
      status: "resolved",
      actions: ["Continue monitoring"],
    },
    {
      id: "alert_003",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: "resolved",
      rule: "POPIA Data Processing",
      entity: "User Registration System",
      description:
        "Privacy policy updated to comply with latest POPIA guidelines",
      severity: "medium",
      status: "resolved",
      actions: ["Monitor implementation", "Update staff training"],
    },
  ];

  const regulationUpdates: RegulationUpdate[] = [
    {
      id: "update_001",
      date: new Date("2024-12-15"),
      title: "SARS Auto-Assessment Updates for 2025 Tax Season",
      body: "New auto-assessment criteria and thresholds for individual taxpayers",
      impact: "high",
      affectedRules: ["rule_001"],
      implementationDeadline: new Date("2025-02-28"),
      status: "implementing",
    },
    {
      id: "update_002",
      date: new Date("2024-12-10"),
      title: "Enhanced POPIA Enforcement Guidelines",
      body: "Updated enforcement procedures and penalty structures",
      impact: "medium",
      affectedRules: ["rule_002", "rule_004"],
      implementationDeadline: new Date("2025-01-31"),
      status: "reviewing",
    },
  ];

  const complianceScore = complianceRules.reduce((score, rule) => {
    if (rule.status === "compliant") return score + 25;
    if (rule.status === "warning") return score + 15;
    if (rule.status === "monitoring") return score + 20;
    return score;
  }, 0);

  const activeAlertsCount = complianceAlerts.filter(
    (alert) => alert.status === "active",
  ).length;

  // Simulate real-time updates
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        setActiveAlerts(Math.floor(Math.random() * 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-green-500/20 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Real-Time Compliance Monitoring
                </CardTitle>
                <CardDescription className="text-lg">
                  Continuous monitoring of regulatory compliance across all
                  operations
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity
                  className={`h-4 w-4 ${isMonitoring ? "text-green-600 animate-pulse" : "text-red-600"}`}
                />
                {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
              </div>
              <Button
                variant="outline"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? "Pause" : "Resume"}
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Status Banner */}
      {activeAlertsCount > 0 && (
        <Alert className="border-yellow-500/20 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {activeAlertsCount} active compliance alert
              {activeAlertsCount !== 1 ? "s" : ""} require attention
            </span>
            <Button size="sm" variant="outline">
              View Alerts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {complianceScore}%
            </div>
            <Progress value={complianceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Excellent compliance status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlertsCount}</div>
            <p className="text-xs text-muted-foreground">
              {complianceAlerts.length} total alerts this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rules Monitored
            </CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRules.length}</div>
            <p className="text-xs text-muted-foreground">
              Across{" "}
              {[...new Set(complianceRules.map((r) => r.category))].length}{" "}
              categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
            <RefreshCw
              className={`h-4 w-4 text-green-600 ${isMonitoring ? "animate-spin" : ""}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastUpdate.toLocaleTimeString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time monitoring
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Compliance Rules</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="updates">Regulatory Updates</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search compliance rules..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Category
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Rule Settings
            </Button>
          </div>

          {complianceRules.map((rule) => (
            <Card key={rule.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        rule.status === "compliant"
                          ? "bg-green-500/10"
                          : rule.status === "warning"
                            ? "bg-yellow-500/10"
                            : rule.status === "violation"
                              ? "bg-red-500/10"
                              : "bg-blue-500/10"
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
                      {rule.status === "monitoring" && (
                        <Eye className="h-5 w-5 text-blue-600" />
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
                          {rule.regulatoryBody}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last checked: {rule.lastChecked.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Next check: {rule.nextCheck.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 mb-2">
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
                      <Badge
                        variant={
                          rule.status === "compliant" ? "outline" : "secondary"
                        }
                      >
                        {rule.status}
                      </Badge>
                    </div>
                    {rule.automatedResponse && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Zap className="h-3 w-3" />
                        Auto-remediation enabled
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Requirement:</h4>
                    <p className="text-sm text-muted-foreground">
                      {rule.ruleDetails.requirement}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Potential Penalty:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {rule.ruleDetails.penalty}
                    </p>
                  </div>
                </div>

                {rule.status !== "compliant" && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Remediation Actions:
                    </h4>
                    <ul className="space-y-1">
                      {rule.ruleDetails.remediation.map((action, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Check Now
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-2" />
                    Configure
                  </Button>
                  {rule.status !== "compliant" && (
                    <Button size="sm">Fix Issues</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {complianceAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`relative ${
                alert.type === "violation"
                  ? "border-red-500/20"
                  : alert.type === "warning"
                    ? "border-yellow-500/20"
                    : alert.type === "resolved"
                      ? "border-green-500/20"
                      : "border-blue-500/20"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        alert.type === "violation"
                          ? "bg-red-500/10"
                          : alert.type === "warning"
                            ? "bg-yellow-500/10"
                            : alert.type === "resolved"
                              ? "bg-green-500/10"
                              : "bg-blue-500/10"
                      }`}
                    >
                      {alert.type === "violation" && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      {alert.type === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      {alert.type === "resolved" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {alert.type === "info" && (
                        <Info className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{alert.rule}</CardTitle>
                      <CardDescription className="mt-1">
                        {alert.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {alert.entity}
                        </span>
                        {alert.assignedTo && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Assigned to: {alert.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 mb-2">
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
                      <Badge
                        variant={
                          alert.status === "active"
                            ? "destructive"
                            : alert.status === "resolved"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {alert.status}
                      </Badge>
                    </div>
                    {alert.dueDate && (
                      <div className="text-xs text-muted-foreground">
                        Due: {alert.dueDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Required Actions:
                  </h4>
                  <ul className="space-y-1 mb-4">
                    {alert.actions.map((action, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  {alert.status === "active" && (
                    <>
                      <Button size="sm">Acknowledge</Button>
                      <Button size="sm" variant="outline">
                        Assign
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Related Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          {regulationUpdates.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{update.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {update.body}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Published: {update.date.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Deadline:{" "}
                        {update.implementationDeadline.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 mb-2">
                      <Badge
                        variant={
                          update.impact === "high"
                            ? "destructive"
                            : update.impact === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {update.impact} impact
                      </Badge>
                      <Badge variant="outline">{update.status}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Affected Compliance Rules:
                    </h4>
                    <div className="flex gap-2">
                      {update.affectedRules.map((ruleId, index) => {
                        const rule = complianceRules.find(
                          (r) => r.id === ruleId,
                        );
                        return (
                          <Badge key={index} variant="outline">
                            {rule?.name || ruleId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">Review Changes</Button>
                    <Button size="sm" variant="outline">
                      Implementation Plan
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      View Official Notice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trends</CardTitle>
                <CardDescription>Compliance score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { period: "Last 7 days", score: 96, trend: "up" },
                    { period: "Last 30 days", score: 94, trend: "up" },
                    { period: "Last 90 days", score: 92, trend: "stable" },
                    { period: "Last year", score: 89, trend: "up" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.period}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.score}%</span>
                        {item.trend === "up" && (
                          <ArrowUp className="h-3 w-3 text-green-600" />
                        )}
                        {item.trend === "down" && (
                          <ArrowDown className="h-3 w-3 text-red-600" />
                        )}
                        {item.trend === "stable" && (
                          <Minus className="h-3 w-3 text-gray-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Statistics</CardTitle>
                <CardDescription>
                  Alert volume and resolution times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total alerts this month:
                    </span>
                    <span className="font-medium">
                      {complianceAlerts.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Average resolution time:
                    </span>
                    <span className="font-medium">2.3 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Critical alerts:
                    </span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Auto-resolved:
                    </span>
                    <span className="font-medium">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Generate and download compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <FileCheck className="h-6 w-6" />
                  <span>Monthly Compliance Report</span>
                  <span className="text-xs text-muted-foreground">
                    PDF • 2.3 MB
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Audit Trail Export</span>
                  <span className="text-xs text-muted-foreground">
                    CSV • 1.1 MB
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Award className="h-6 w-6" />
                  <span>Regulatory Summary</span>
                  <span className="text-xs text-muted-foreground">
                    PDF • 0.8 MB
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
