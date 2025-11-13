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
import {
  Workflow,
  Play,
  Pause,
  Settings,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Mail,
  RefreshCw,
  Zap,
  Target,
  TrendingUp,
  Edit3,
  Trash2,
  Copy,
  Send,
  Shield,
  Star,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface WorkflowStep {
  id: string;
  name: string;
  type: "trigger" | "condition" | "action";
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  trigger: string;
  steps: WorkflowStep[];
  executionCount: number;
  lastExecuted?: Date;
  created: Date;
  category: "tax-processing" | "client-management" | "compliance" | "reporting";
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  popularity: number;
}

export default function WorkflowAutomation() {
  const [activeTab, setActiveTab] = useState("workflows");
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const { toast } = useCustomToast();

  // Mock workflow data
  useEffect(() => {
    const mockWorkflows: AutomationWorkflow[] = [
      {
        id: "wf-1",
        name: "Auto-Process IRP5 Documents",
        description:
          "Automatically process uploaded IRP5 documents and generate reports",
        status: "active",
        trigger: "Document Upload",
        steps: [
          {
            id: "s1",
            name: "Validate Document",
            type: "condition",
            description: "Check document quality",
            config: {},
            position: { x: 0, y: 0 },
          },
          {
            id: "s2",
            name: "Extract Data",
            type: "action",
            description: "OCR processing",
            config: {},
            position: { x: 100, y: 0 },
          },
          {
            id: "s3",
            name: "Generate Report",
            type: "action",
            description: "Create tax report",
            config: {},
            position: { x: 200, y: 0 },
          },
          {
            id: "s4",
            name: "Send Email",
            type: "action",
            description: "Notify client",
            config: {},
            position: { x: 300, y: 0 },
          },
        ],
        executionCount: 1247,
        lastExecuted: new Date("2025-01-01T10:30:00"),
        created: new Date("2024-12-01"),
        category: "tax-processing",
      },
      {
        id: "wf-2",
        name: "Client Onboarding Sequence",
        description: "Automated client welcome and document collection",
        status: "active",
        trigger: "New Client Registration",
        steps: [
          {
            id: "s1",
            name: "Send Welcome Email",
            type: "action",
            description: "Welcome message",
            config: {},
            position: { x: 0, y: 0 },
          },
          {
            id: "s2",
            name: "Create Document Folder",
            type: "action",
            description: "Setup vault",
            config: {},
            position: { x: 100, y: 0 },
          },
          {
            id: "s3",
            name: "Schedule Follow-up",
            type: "action",
            description: "Book consultation",
            config: {},
            position: { x: 200, y: 0 },
          },
        ],
        executionCount: 89,
        lastExecuted: new Date("2025-01-01T14:15:00"),
        created: new Date("2024-11-15"),
        category: "client-management",
      },
      {
        id: "wf-3",
        name: "Compliance Deadline Alerts",
        description: "Monitor and alert for tax compliance deadlines",
        status: "active",
        trigger: "Daily Schedule",
        steps: [
          {
            id: "s1",
            name: "Check Deadlines",
            type: "condition",
            description: "Scan upcoming dates",
            config: {},
            position: { x: 0, y: 0 },
          },
          {
            id: "s2",
            name: "Generate Alerts",
            type: "action",
            description: "Create notifications",
            config: {},
            position: { x: 100, y: 0 },
          },
          {
            id: "s3",
            name: "Send Reminders",
            type: "action",
            description: "Notify clients",
            config: {},
            position: { x: 200, y: 0 },
          },
        ],
        executionCount: 365,
        lastExecuted: new Date("2025-01-01T09:00:00"),
        created: new Date("2024-10-01"),
        category: "compliance",
      },
    ];
    setWorkflows(mockWorkflows);
  }, []);

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: "tpl-1",
      name: "Tax Return Processing Pipeline",
      description:
        "Complete automation for tax return processing from upload to delivery",
      category: "Tax Processing",
      popularity: 95,
      steps: [
        {
          id: "s1",
          name: "Document Validation",
          type: "condition",
          description: "Validate uploaded documents",
          config: {},
          position: { x: 0, y: 0 },
        },
        {
          id: "s2",
          name: "Data Extraction",
          type: "action",
          description: "Extract tax data",
          config: {},
          position: { x: 100, y: 0 },
        },
        {
          id: "s3",
          name: "Calculate Tax",
          type: "action",
          description: "Perform calculations",
          config: {},
          position: { x: 200, y: 0 },
        },
        {
          id: "s4",
          name: "Generate Reports",
          type: "action",
          description: "Create client reports",
          config: {},
          position: { x: 300, y: 0 },
        },
        {
          id: "s5",
          name: "Client Notification",
          type: "action",
          description: "Send completion email",
          config: {},
          position: { x: 400, y: 0 },
        },
      ],
    },
    {
      id: "tpl-2",
      name: "Client Communication Automation",
      description: "Automated client updates and communication workflows",
      category: "Client Management",
      popularity: 87,
      steps: [
        {
          id: "s1",
          name: "Trigger Event",
          type: "trigger",
          description: "Client interaction trigger",
          config: {},
          position: { x: 0, y: 0 },
        },
        {
          id: "s2",
          name: "Update CRM",
          type: "action",
          description: "Log interaction",
          config: {},
          position: { x: 100, y: 0 },
        },
        {
          id: "s3",
          name: "Send Follow-up",
          type: "action",
          description: "Automated follow-up",
          config: {},
          position: { x: 200, y: 0 },
        },
      ],
    },
    {
      id: "tpl-3",
      name: "Compliance Monitoring",
      description: "Automated compliance checking and reporting workflows",
      category: "Compliance",
      popularity: 92,
      steps: [
        {
          id: "s1",
          name: "Schedule Check",
          type: "trigger",
          description: "Periodic compliance check",
          config: {},
          position: { x: 0, y: 0 },
        },
        {
          id: "s2",
          name: "Scan Documents",
          type: "action",
          description: "Review compliance status",
          config: {},
          position: { x: 100, y: 0 },
        },
        {
          id: "s3",
          name: "Generate Report",
          type: "action",
          description: "Compliance report",
          config: {},
          position: { x: 200, y: 0 },
        },
        {
          id: "s4",
          name: "Alert if Issues",
          type: "condition",
          description: "Flag non-compliance",
          config: {},
          position: { x: 300, y: 0 },
        },
      ],
    },
  ];

  const handleCreateWorkflow = () => {
    setIsCreating(true);
    toast({
      title: "Workflow Builder",
      description: "Opening workflow designer...",
    });
  };

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === workflowId
          ? { ...wf, status: wf.status === "active" ? "paused" : "active" }
          : wf,
      ),
    );

    const workflow = workflows.find((wf) => wf.id === workflowId);
    toast({
      title: `Workflow ${workflow?.status === "active" ? "Paused" : "Activated"}`,
      description: `"${workflow?.name}" is now ${workflow?.status === "active" ? "paused" : "active"}`,
    });
  };

  const handleUseTemplate = (template: WorkflowTemplate) => {
    toast({
      title: "Template Applied",
      description: `Created new workflow from "${template.name}" template`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tax-processing":
        return FileText;
      case "client-management":
        return Users;
      case "compliance":
        return Shield;
      case "reporting":
        return BarChart3;
      default:
        return Workflow;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Workflow className="w-6 h-6 text-primary" />
                Workflow Automation
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  Enterprise
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg">
                Automate repetitive tasks and streamline your tax practice
                operations
              </CardDescription>
            </div>
            <Button onClick={handleCreateWorkflow} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Workflow
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {workflows.filter((w) => w.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Workflows
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {workflows
                    .reduce((sum, w) => sum + w.executionCount, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Executions
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">97.3%</div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">2.4hrs</div>
                <div className="text-sm text-muted-foreground">
                  Time Saved/Day
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid gap-6">
            {workflows.map((workflow) => {
              const CategoryIcon = getCategoryIcon(workflow.category);
              return (
                <Card
                  key={workflow.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">
                              {workflow.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getStatusColor(workflow.status)}
                            >
                              {workflow.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            {workflow.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              {workflow.executionCount.toLocaleString()}{" "}
                              executions
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Last run:{" "}
                              {workflow.lastExecuted?.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Trigger: {workflow.trigger}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleWorkflow(workflow.id)}
                        >
                          {workflow.status === "active" ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Workflow Steps Visualization */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-medium text-sm">Workflow Steps:</h4>
                        <Badge variant="secondary" className="text-xs">
                          {workflow.steps.length} steps
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {workflow.steps.map((step, index) => (
                          <React.Fragment key={step.id}>
                            <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border min-w-max">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  step.type === "trigger"
                                    ? "bg-green-500"
                                    : step.type === "condition"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                }`}
                              />
                              <span className="text-sm font-medium">
                                {step.name}
                              </span>
                            </div>
                            {index < workflow.steps.length - 1 && (
                              <div className="w-6 h-0.5 bg-border" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {template.popularity}%
                      </span>
                    </div>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      {template.steps.length} steps included
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.steps.slice(0, 3).map((step) => (
                        <Badge
                          key={step.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {step.name}
                        </Badge>
                      ))}
                      {template.steps.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.steps.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Analytics</CardTitle>
                <CardDescription>
                  Workflow performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Executions</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Average</span>
                    <span className="font-semibold">1,689</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-semibold text-green-600">97.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Execution Time</span>
                    <span className="font-semibold">4.2s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Savings</CardTitle>
                <CardDescription>
                  Productivity improvements from automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hours Saved Today</span>
                    <span className="font-semibold text-green-600">2.4hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hours Saved This Week</span>
                    <span className="font-semibold text-green-600">
                      16.8hrs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hours Saved This Month</span>
                    <span className="font-semibold text-green-600">
                      72.1hrs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estimated Cost Savings</span>
                    <span className="font-semibold text-green-600">
                      R14,420
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
