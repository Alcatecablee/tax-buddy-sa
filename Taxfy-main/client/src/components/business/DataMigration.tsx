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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  Settings,
  Shield,
  Zap,
  RefreshCw,
  Play,
  Pause,
  Calendar,
  Target,
  BarChart3,
  ArrowRight,
  Plus,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface MigrationProject {
  id: string;
  name: string;
  source: string;
  status: "planning" | "in-progress" | "completed" | "failed" | "paused";
  progress: number;
  recordsTotal: number;
  recordsMigrated: number;
  startDate: Date;
  estimatedCompletion?: Date;
  completedDate?: Date;
  priority: "low" | "medium" | "high" | "critical";
  assignedTo: string;
  dataTypes: string[];
  issues: number;
}

interface DataSource {
  id: string;
  name: string;
  type: "csv" | "excel" | "database" | "api" | "other";
  format: string;
  size: string;
  records: number;
  status: "connected" | "disconnected" | "error";
  lastSync?: Date;
}

interface MigrationStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  issues?: string[];
}

export default function DataMigration() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<MigrationProject[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useCustomToast();

  // Mock data
  useEffect(() => {
    const mockProjects: MigrationProject[] = [
      {
        id: "proj-1",
        name: "Legacy CRM Migration",
        source: "SageOne Database",
        status: "in-progress",
        progress: 67,
        recordsTotal: 15420,
        recordsMigrated: 10331,
        startDate: new Date("2024-12-15"),
        estimatedCompletion: new Date("2025-01-10"),
        priority: "high",
        assignedTo: "Sarah Mitchell",
        dataTypes: ["Clients", "Tax Returns", "Documents", "Communications"],
        issues: 3,
      },
      {
        id: "proj-2",
        name: "Excel Spreadsheet Consolidation",
        source: "Multiple Excel Files",
        status: "completed",
        progress: 100,
        recordsTotal: 8750,
        recordsMigrated: 8750,
        startDate: new Date("2024-11-20"),
        completedDate: new Date("2024-12-05"),
        priority: "medium",
        assignedTo: "David Chen",
        dataTypes: ["Client Data", "Financial Records"],
        issues: 0,
      },
      {
        id: "proj-3",
        name: "QuickBooks Integration",
        source: "QuickBooks Enterprise",
        status: "planning",
        progress: 0,
        recordsTotal: 25000,
        recordsMigrated: 0,
        startDate: new Date("2025-01-15"),
        estimatedCompletion: new Date("2025-02-15"),
        priority: "critical",
        assignedTo: "Alex Johnson",
        dataTypes: ["Accounting Data", "Client Records", "Tax Documents"],
        issues: 0,
      },
    ];

    const mockDataSources: DataSource[] = [
      {
        id: "src-1",
        name: "SageOne Database",
        type: "database",
        format: "SQL Server",
        size: "2.3 GB",
        records: 15420,
        status: "connected",
        lastSync: new Date("2025-01-01T10:30:00"),
      },
      {
        id: "src-2",
        name: "Client Spreadsheets",
        type: "excel",
        format: "XLSX",
        size: "45 MB",
        records: 8750,
        status: "connected",
        lastSync: new Date("2024-12-05T14:20:00"),
      },
      {
        id: "src-3",
        name: "QuickBooks API",
        type: "api",
        format: "REST API",
        size: "~5.2 GB",
        records: 25000,
        status: "disconnected",
      },
      {
        id: "src-4",
        name: "Legacy CSV Files",
        type: "csv",
        format: "CSV",
        size: "120 MB",
        records: 3200,
        status: "error",
      },
    ];

    setProjects(mockProjects);
    setDataSources(mockDataSources);
  }, []);

  const migrationSteps: MigrationStep[] = [
    {
      id: "step-1",
      name: "Data Source Analysis",
      description: "Analyze source data structure and quality",
      status: "completed",
      startTime: new Date("2024-12-15T09:00:00"),
      endTime: new Date("2024-12-15T11:30:00"),
      duration: 150,
    },
    {
      id: "step-2",
      name: "Schema Mapping",
      description: "Map source fields to Taxfy data model",
      status: "completed",
      startTime: new Date("2024-12-15T13:00:00"),
      endTime: new Date("2024-12-15T16:00:00"),
      duration: 180,
    },
    {
      id: "step-3",
      name: "Data Validation",
      description: "Validate data integrity and completeness",
      status: "in-progress",
      startTime: new Date("2024-12-20T09:00:00"),
    },
    {
      id: "step-4",
      name: "Migration Execution",
      description: "Migrate data to Taxfy platform",
      status: "pending",
    },
    {
      id: "step-5",
      name: "Quality Assurance",
      description: "Verify migrated data accuracy",
      status: "pending",
    },
    {
      id: "step-6",
      name: "Go-Live Preparation",
      description: "Prepare for production deployment",
      status: "pending",
    },
  ];

  const handleStartProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, status: "in-progress" as const }
          : project,
      ),
    );

    toast({
      title: "Migration Started",
      description: "Data migration project has been initiated",
    });
  };

  const handlePauseProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, status: "paused" as const }
          : project,
      ),
    );

    toast({
      title: "Migration Paused",
      description: "Data migration project has been paused",
    });
  };

  const handleCreateProject = () => {
    setIsCreating(true);
    toast({
      title: "New Migration Project",
      description: "Opening migration project wizard...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "planning":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "paused":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "connected":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "disconnected":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "error":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "database":
        return Database;
      case "excel":
        return FileText;
      case "csv":
        return FileText;
      case "api":
        return Zap;
      default:
        return FileText;
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
                <Database className="w-6 h-6 text-primary" />
                Data Migration Center
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Enterprise
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg">
                Seamlessly migrate your existing data to the Taxfy platform
              </CardDescription>
            </div>
            <Button onClick={handleCreateProject} className="gap-2">
              <Plus className="w-4 h-4" />
              New Migration
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
                  {projects.filter((p) => p.status === "in-progress").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Projects
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {projects
                    .reduce((sum, p) => sum + p.recordsMigrated, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Records Migrated
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {dataSources.filter((s) => s.status === "connected").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Data Sources
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">98.7%</div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Migration Projects</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="timeline">Migration Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {project.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getStatusColor(project.status)}
                        >
                          {project.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(project.priority)}
                        >
                          {project.priority}
                        </Badge>
                        {project.issues > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-600"
                          >
                            {project.issues} issues
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        Source: {project.source}
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Progress:
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={project.progress}
                              className="flex-1"
                            />
                            <span className="font-medium">
                              {project.progress}%
                            </span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Records:
                          </span>
                          <div className="font-medium">
                            {project.recordsMigrated.toLocaleString()} /{" "}
                            {project.recordsTotal.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Assigned to:
                          </span>
                          <div className="font-medium">
                            {project.assignedTo}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.dataTypes.map((type) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Started: {project.startDate.toLocaleDateString()}
                        </span>
                        {project.estimatedCompletion && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ETA:{" "}
                            {project.estimatedCompletion.toLocaleDateString()}
                          </span>
                        )}
                        {project.completedDate && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed:{" "}
                            {project.completedDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {project.status === "planning" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartProject(project.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      )}
                      {project.status === "in-progress" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePauseProject(project.id)}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.map((source) => {
              const TypeIcon = getTypeIcon(source.type);
              return (
                <Card
                  key={source.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {source.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={getStatusColor(source.status)}
                          >
                            {source.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <div className="font-medium">{source.format}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <div className="font-medium">{source.size}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Records:
                          </span>
                          <div className="font-medium">
                            {source.records.toLocaleString()}
                          </div>
                        </div>
                        {source.lastSync && (
                          <div>
                            <span className="text-muted-foreground">
                              Last Sync:
                            </span>
                            <div className="font-medium text-xs">
                              {source.lastSync.toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Add Data Source Card */}
            <Card className="border-dashed border-2 hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Add Data Source</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect a new data source for migration
                </p>
                <Button variant="outline">Connect Source</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Migration Timeline: Legacy CRM Migration</CardTitle>
              <CardDescription>
                Detailed timeline of migration steps and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {migrationSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-green-500 text-white"
                            : step.status === "in-progress"
                              ? "bg-blue-500 text-white"
                              : step.status === "failed"
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : step.status === "in-progress" ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : step.status === "failed" ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      {index < migrationSteps.length - 1 && (
                        <div className="w-0.5 h-12 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{step.name}</h4>
                        <Badge
                          variant="outline"
                          className={getStatusColor(step.status)}
                        >
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {step.startTime && (
                          <span>
                            Started: {step.startTime.toLocaleString()}
                          </span>
                        )}
                        {step.endTime && (
                          <span>
                            Completed: {step.endTime.toLocaleString()}
                          </span>
                        )}
                        {step.duration && (
                          <span>Duration: {step.duration} minutes</span>
                        )}
                      </div>
                      {step.issues && step.issues.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-red-600 mb-1">
                            Issues:
                          </div>
                          <ul className="text-xs text-red-600 list-disc list-inside">
                            {step.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
