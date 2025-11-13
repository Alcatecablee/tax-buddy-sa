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
  Brain,
  Database,
  Upload,
  Download,
  Play,
  Pause,
  Settings,
  Eye,
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileText,
  Code,
  Cpu,
  Network,
  Activity,
  Award,
  Sparkles,
  Crown,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Save,
  Share,
  Trash2,
  Edit,
  Plus,
  ArrowRight,
  Layers,
  Globe,
  Lock,
} from "lucide-react";

interface TrainingDataset {
  id: string;
  name: string;
  description: string;
  type:
    | "tax_documents"
    | "historical_data"
    | "compliance_rules"
    | "business_rules"
    | "custom";
  size: number; // in MB
  recordCount: number;
  uploadDate: Date;
  lastProcessed: Date;
  status: "processing" | "ready" | "training" | "error";
  accuracy: number;
  coverage: string[];
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  type: "classification" | "prediction" | "optimization" | "validation";
  version: string;
  baseModel: string;
  trainingDatasets: string[];
  status: "training" | "ready" | "deployed" | "deprecated";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: number; // in hours
  lastTrained: Date;
  deploymentDate?: Date;
  usage: {
    requests: number;
    averageLatency: number;
    errorRate: number;
  };
}

interface TrainingJob {
  id: string;
  modelId: string;
  name: string;
  datasetIds: string[];
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  progress: number;
  startTime: Date;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  hyperparameters: Record<string, any>;
  metrics: {
    loss: number;
    accuracy: number;
    validationLoss: number;
    validationAccuracy: number;
  };
  logs: string[];
}

export default function CustomAITraining() {
  const [activeTraining, setActiveTraining] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Mock data
  const trainingDatasets: TrainingDataset[] = [
    {
      id: "dataset_001",
      name: "Company Tax Documents",
      description:
        "Historical tax documents and IRP5 forms from the past 5 years",
      type: "tax_documents",
      size: 245.7,
      recordCount: 15420,
      uploadDate: new Date("2024-12-01"),
      lastProcessed: new Date("2024-12-20T09:30:00"),
      status: "ready",
      accuracy: 97.8,
      coverage: [
        "IRP5 Forms",
        "IT14 Returns",
        "PAYE Certificates",
        "Medical Aid Certificates",
      ],
    },
    {
      id: "dataset_002",
      name: "Industry Compliance Rules",
      description: "South African tax regulations and compliance requirements",
      type: "compliance_rules",
      size: 128.3,
      recordCount: 8950,
      uploadDate: new Date("2024-11-15"),
      lastProcessed: new Date("2024-12-19T14:20:00"),
      status: "ready",
      accuracy: 99.2,
      coverage: [
        "SARS Regulations",
        "POPIA Requirements",
        "Industry Standards",
        "Best Practices",
      ],
    },
    {
      id: "dataset_003",
      name: "Custom Business Rules",
      description: "Company-specific tax rules and calculation methodologies",
      type: "business_rules",
      size: 67.8,
      recordCount: 3450,
      uploadDate: new Date("2024-12-10"),
      lastProcessed: new Date("2024-12-20T08:45:00"),
      status: "training",
      accuracy: 94.5,
      coverage: [
        "Internal Policies",
        "Calculation Rules",
        "Approval Workflows",
        "Exception Handling",
      ],
    },
    {
      id: "dataset_004",
      name: "Historical Performance Data",
      description: "Past tax calculations and optimization results",
      type: "historical_data",
      size: 189.4,
      recordCount: 12750,
      uploadDate: new Date("2024-10-20"),
      lastProcessed: new Date("2024-12-18T16:30:00"),
      status: "ready",
      accuracy: 96.3,
      coverage: [
        "Tax Calculations",
        "Optimization Results",
        "Error Patterns",
        "Performance Metrics",
      ],
    },
  ];

  const aiModels: AIModel[] = [
    {
      id: "model_001",
      name: "Custom Tax Classification Model",
      description:
        "Trained specifically on your company's tax document patterns",
      type: "classification",
      version: "v2.1",
      baseModel: "TaxFy-Base-v3",
      trainingDatasets: ["dataset_001", "dataset_002"],
      status: "deployed",
      accuracy: 98.7,
      precision: 97.9,
      recall: 98.4,
      f1Score: 98.1,
      trainingTime: 6.5,
      lastTrained: new Date("2024-12-18"),
      deploymentDate: new Date("2024-12-19"),
      usage: {
        requests: 25420,
        averageLatency: 125,
        errorRate: 0.003,
      },
    },
    {
      id: "model_002",
      name: "Predictive Tax Optimization Model",
      description:
        "Predicts optimal tax strategies based on your business patterns",
      type: "prediction",
      version: "v1.3",
      baseModel: "TaxFy-Predict-v2",
      trainingDatasets: ["dataset_003", "dataset_004"],
      status: "training",
      accuracy: 94.2,
      precision: 93.8,
      recall: 94.6,
      f1Score: 94.2,
      trainingTime: 12.3,
      lastTrained: new Date("2024-12-20"),
      usage: {
        requests: 0,
        averageLatency: 0,
        errorRate: 0,
      },
    },
    {
      id: "model_003",
      name: "Compliance Validation Model",
      description:
        "Validates tax calculations against your specific compliance requirements",
      type: "validation",
      version: "v1.0",
      baseModel: "TaxFy-Validate-v1",
      trainingDatasets: ["dataset_002", "dataset_003"],
      status: "ready",
      accuracy: 99.1,
      precision: 98.9,
      recall: 99.3,
      f1Score: 99.1,
      trainingTime: 8.7,
      lastTrained: new Date("2024-12-15"),
      usage: {
        requests: 8950,
        averageLatency: 89,
        errorRate: 0.001,
      },
    },
  ];

  const trainingJobs: TrainingJob[] = [
    {
      id: "job_001",
      modelId: "model_002",
      name: "Predictive Model Retraining",
      datasetIds: ["dataset_003", "dataset_004"],
      status: "running",
      progress: 73,
      startTime: new Date("2024-12-20T08:00:00"),
      estimatedCompletion: new Date("2024-12-20T14:30:00"),
      hyperparameters: {
        learning_rate: 0.001,
        batch_size: 32,
        epochs: 100,
        dropout: 0.2,
      },
      metrics: {
        loss: 0.045,
        accuracy: 94.2,
        validationLoss: 0.052,
        validationAccuracy: 93.8,
      },
      logs: [
        "Starting training job at 08:00:00",
        "Loading datasets: dataset_003, dataset_004",
        "Preprocessing 16,200 records",
        "Epoch 73/100 - Loss: 0.045, Accuracy: 94.2%",
        "Validation - Loss: 0.052, Accuracy: 93.8%",
      ],
    },
  ];

  const startTraining = () => {
    setActiveTraining(true);
    setTrainingProgress(0);
  };

  const stopTraining = () => {
    setActiveTraining(false);
  };

  // Simulate training progress
  useEffect(() => {
    if (activeTraining) {
      const interval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 100) {
            setActiveTraining(false);
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTraining]);

  const totalDatasets = trainingDatasets.length;
  const readyDatasets = trainingDatasets.filter(
    (d) => d.status === "ready",
  ).length;
  const totalModels = aiModels.length;
  const deployedModels = aiModels.filter((m) => m.status === "deployed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Custom AI Training Platform
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Enterprise Elite
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  Train custom AI models on your proprietary tax data for
                  unmatched accuracy
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity
                  className={`h-4 w-4 ${activeTraining ? "text-purple-600 animate-pulse" : "text-green-600"}`}
                />
                {activeTraining ? "Training Active" : "System Ready"}
              </div>
              <Button onClick={startTraining} disabled={activeTraining}>
                {activeTraining ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Training
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Training Status */}
      {activeTraining && (
        <Alert className="border-purple-500/20 bg-purple-500/10">
          <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium">
                AI model training in progress...
              </span>
              <div className="text-sm text-muted-foreground mt-1">
                Training custom tax optimization model on your proprietary data
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={trainingProgress} className="w-32" />
              <span className="text-sm font-medium">
                {trainingProgress.toFixed(0)}%
              </span>
              <Button size="sm" variant="outline" onClick={stopTraining}>
                <Pause className="h-3 w-3 mr-2" />
                Stop
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Training Datasets
            </CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readyDatasets}/{totalDatasets}
            </div>
            <p className="text-xs text-muted-foreground">Ready for training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Models</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deployedModels}/{totalModels}
            </div>
            <p className="text-xs text-muted-foreground">Deployed models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Model Accuracy
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(
                aiModels.reduce((sum, model) => sum + model.accuracy, 0) /
                aiModels.length
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Training Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aiModels
                .reduce((sum, model) => sum + model.trainingTime, 0)
                .toFixed(0)}
              h
            </div>
            <p className="text-xs text-muted-foreground">Total compute time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Training Tabs */}
      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="datasets">Training Datasets</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="training">Training Jobs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Training Datasets</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Dataset
            </Button>
          </div>

          {trainingDatasets.map((dataset) => (
            <Card
              key={dataset.id}
              className={`cursor-pointer transition-all ${
                selectedDataset === dataset.id
                  ? "border-purple-500 ring-2 ring-purple-500/20"
                  : ""
              }`}
              onClick={() => setSelectedDataset(dataset.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        dataset.type === "tax_documents"
                          ? "bg-blue-500/10"
                          : dataset.type === "compliance_rules"
                            ? "bg-green-500/10"
                            : dataset.type === "business_rules"
                              ? "bg-purple-500/10"
                              : "bg-orange-500/10"
                      }`}
                    >
                      {dataset.type === "tax_documents" && (
                        <FileText className="h-5 w-5 text-blue-600" />
                      )}
                      {dataset.type === "compliance_rules" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {dataset.type === "business_rules" && (
                        <Settings className="h-5 w-5 text-purple-600" />
                      )}
                      {dataset.type === "historical_data" && (
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{dataset.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {dataset.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {dataset.recordCount.toLocaleString()} records
                        </span>
                        <span className="flex items-center gap-1">
                          <Upload className="h-3 w-3" />
                          {dataset.size} MB
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {dataset.lastProcessed.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        dataset.status === "ready"
                          ? "outline"
                          : dataset.status === "training"
                            ? "secondary"
                            : dataset.status === "processing"
                              ? "secondary"
                              : "destructive"
                      }
                    >
                      {dataset.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {dataset.accuracy}% accuracy
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Data Coverage:</h4>
                  <div className="flex gap-2">
                    {dataset.coverage.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Quality Score:
                    </span>
                    <Progress value={dataset.accuracy} className="w-20 h-2" />
                    <span className="text-sm font-medium">
                      {dataset.accuracy}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-2" />
                      Configure
                    </Button>
                    {dataset.status === "ready" && (
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-2" />
                        Train Model
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Custom AI Models</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Clone Model
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Model
            </Button>
          </div>

          {aiModels.map((model) => (
            <Card key={model.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        model.type === "classification"
                          ? "bg-blue-500/10"
                          : model.type === "prediction"
                            ? "bg-green-500/10"
                            : model.type === "optimization"
                              ? "bg-purple-500/10"
                              : "bg-orange-500/10"
                      }`}
                    >
                      {model.type === "classification" && (
                        <Layers className="h-5 w-5 text-blue-600" />
                      )}
                      {model.type === "prediction" && (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      )}
                      {model.type === "optimization" && (
                        <Target className="h-5 w-5 text-purple-600" />
                      )}
                      {model.type === "validation" && (
                        <CheckCircle className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {model.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          {model.version}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {model.baseModel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {model.trainingTime}h training
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        model.status === "deployed"
                          ? "outline"
                          : model.status === "ready"
                            ? "secondary"
                            : model.status === "training"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {model.status}
                    </Badge>
                    {model.deploymentDate && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Deployed: {model.deploymentDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold text-green-600">
                      {model.accuracy}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Accuracy
                    </div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold text-blue-600">
                      {model.precision}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Precision
                    </div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold text-purple-600">
                      {model.recall}%
                    </div>
                    <div className="text-xs text-muted-foreground">Recall</div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold text-orange-600">
                      {model.f1Score}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      F1 Score
                    </div>
                  </div>
                </div>

                {model.status === "deployed" && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 rounded border">
                      <div className="text-lg font-bold">
                        {model.usage.requests.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Requests
                      </div>
                    </div>
                    <div className="p-2 rounded border">
                      <div className="text-lg font-bold">
                        {model.usage.averageLatency}ms
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg Latency
                      </div>
                    </div>
                    <div className="p-2 rounded border">
                      <div className="text-lg font-bold text-green-600">
                        {(model.usage.errorRate * 100).toFixed(3)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Error Rate
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Training datasets: {model.trainingDatasets.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-3 w-3 mr-2" />
                      Analytics
                    </Button>
                    {model.status === "ready" && (
                      <Button size="sm">
                        <Zap className="h-3 w-3 mr-2" />
                        Deploy
                      </Button>
                    )}
                    {model.status === "deployed" && (
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Retrain
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Active Training Jobs</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Queue
            </Button>
          </div>

          {trainingJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{job.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Training datasets: {job.datasetIds.join(", ")}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Started: {job.startTime.toLocaleString()}
                      </span>
                      {job.estimatedCompletion && (
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          ETA: {job.estimatedCompletion.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        job.status === "running"
                          ? "secondary"
                          : job.status === "completed"
                            ? "outline"
                            : job.status === "failed"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {job.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {job.progress}% complete
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Training Progress</span>
                    <span>{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-2 rounded border">
                    <div className="text-sm font-bold">
                      {job.metrics.loss.toFixed(3)}
                    </div>
                    <div className="text-xs text-muted-foreground">Loss</div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-sm font-bold text-green-600">
                      {job.metrics.accuracy}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Accuracy
                    </div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-sm font-bold">
                      {job.metrics.validationLoss.toFixed(3)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Val Loss
                    </div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-sm font-bold text-blue-600">
                      {job.metrics.validationAccuracy}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Val Accuracy
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Recent Logs:</h4>
                  <div className="bg-muted p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
                    {job.logs.slice(-5).map((log, index) => (
                      <div key={index}>{log}</div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {job.status === "running" && (
                    <Button size="sm" variant="outline">
                      <Pause className="h-3 w-3 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-2" />
                    View Logs
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-2" />
                    Export Metrics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiModels.map((model) => (
                    <div key={model.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {model.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {model.accuracy}%
                        </span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      metric: "Average Training Time",
                      value: "8.5 hours",
                      trend: "down",
                    },
                    {
                      metric: "Data Processing Speed",
                      value: "2.3K records/min",
                      trend: "up",
                    },
                    {
                      metric: "Model Accuracy Improvement",
                      value: "+12.5%",
                      trend: "up",
                    },
                    {
                      metric: "Resource Utilization",
                      value: "87%",
                      trend: "stable",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.value}</span>
                        {item.trend === "up" && (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        )}
                        {item.trend === "down" && (
                          <TrendingUp className="h-3 w-3 text-red-600 transform rotate-180" />
                        )}
                        {item.trend === "stable" && <div className="h-3 w-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom AI Benefits</CardTitle>
              <CardDescription>
                Performance improvements from custom AI training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-lg">+15.3%</div>
                  <div className="text-sm text-muted-foreground">
                    Accuracy Improvement
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    vs. Base Models
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-lg">-67%</div>
                  <div className="text-sm text-muted-foreground">
                    Processing Time
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Faster than generic models
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10">
                  <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-lg">99.8%</div>
                  <div className="text-sm text-muted-foreground">
                    Business Rule Compliance
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Perfect alignment
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
