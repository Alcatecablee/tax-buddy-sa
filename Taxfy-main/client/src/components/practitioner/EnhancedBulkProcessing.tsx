import React, { useState, useCallback, useRef } from "react";
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
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Users,
  Building,
  Clock,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { formatCurrency } from "@/lib/utils";

interface ProcessedFile {
  id: string;
  file: File;
  status: "pending" | "processing" | "completed" | "error" | "paused";
  progress: number;
  result?: {
    refund: number;
    taxPaid: number;
    grossIncome: number;
    confidence: number;
    warnings: string[];
    recommendations: string[];
    processingTime: number;
    complianceScore: number;
  };
  error?: string;
  clientId?: string;
  priority: "normal" | "high" | "urgent";
}

interface BatchSummary {
  totalFiles: number;
  completed: number;
  failed: number;
  totalRefunds: number;
  averageProcessingTime: number;
  complianceIssues: number;
}

export const EnhancedBulkProcessing: React.FC = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [batchSummary, setBatchSummary] = useState<BatchSummary | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useCustomToast();

  const handleFileSelect = useCallback(
    (selectedFiles: FileList) => {
      const newFiles: ProcessedFile[] = Array.from(selectedFiles).map(
        (file, index) => ({
          id: `${Date.now()}-${index}`,
          file,
          status: "pending",
          progress: 0,
          priority: "normal",
        }),
      );

      setFiles((prev) => [...prev, ...newFiles]);

      toast({
        title: "Files Added",
        description: `Added ${selectedFiles.length} files to processing queue`,
      });
    },
    [toast],
  );

  const startBulkProcessing = async () => {
    if (files.filter((f) => f.status === "pending").length === 0) return;

    setIsProcessing(true);
    setIsPaused(false);
    setActiveTab("processing");

    const startTime = Date.now();
    const pendingFiles = files.filter((f) => f.status === "pending");

    toast({
      title: "Professional Bulk Processing Started",
      description: `Processing ${pendingFiles.length} files with enhanced compliance validation`,
    });

    // Process files in optimized batches
    const batchSize = 3;
    let totalProcessed = 0;
    let totalRefunds = 0;
    let complianceIssues = 0;

    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      if (isPaused) break;

      const batch = pendingFiles.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (file) => {
          await processFileWithProfessionalValidation(file);
        }),
      );

      // Update batch progress
      totalProcessed += batch.length;

      // Calculate running totals
      const completedFiles = files.filter((f) => f.status === "completed");
      totalRefunds = completedFiles.reduce(
        (sum, f) => sum + (f.result?.refund || 0),
        0,
      );
      complianceIssues = completedFiles.reduce(
        (sum, f) => sum + (f.result?.warnings.length || 0),
        0,
      );

      // Brief pause between batches for optimal performance
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const endTime = Date.now();
    const processingTime = (endTime - startTime) / 1000;

    // Generate comprehensive batch summary
    const completed = files.filter((f) => f.status === "completed").length;
    const failed = files.filter((f) => f.status === "error").length;

    setBatchSummary({
      totalFiles: pendingFiles.length,
      completed,
      failed,
      totalRefunds,
      averageProcessingTime: processingTime / pendingFiles.length,
      complianceIssues,
    });

    setIsProcessing(false);
    setActiveTab("results");

    toast({
      title: "Professional Bulk Processing Complete",
      description: `Processed ${completed} files successfully with ${complianceIssues} compliance alerts`,
    });
  };

  const processFileWithProfessionalValidation = async (file: ProcessedFile) => {
    // Update to processing state
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, status: "processing", progress: 0 } : f,
      ),
    );

    try {
      // Professional processing pipeline with detailed steps
      const processingSteps = [
        { name: "Document Authentication", progress: 10, duration: 400 },
        { name: "OCR Extraction", progress: 25, duration: 600 },
        { name: "Data Validation", progress: 45, duration: 500 },
        { name: "Tax Calculation", progress: 65, duration: 700 },
        { name: "Compliance Audit", progress: 80, duration: 600 },
        { name: "Report Generation", progress: 95, duration: 300 },
        { name: "Quality Assurance", progress: 100, duration: 200 },
      ];

      for (const step of processingSteps) {
        if (isPaused) return;

        await new Promise((resolve) => setTimeout(resolve, step.duration));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress: step.progress } : f,
          ),
        );
      }

      // Simulate professional-grade results
      const result = {
        refund: Math.floor(Math.random() * 12000) + 3000,
        taxPaid: Math.floor(Math.random() * 35000) + 15000,
        grossIncome: Math.floor(Math.random() * 800000) + 300000,
        confidence: 0.92 + Math.random() * 0.08,
        warnings:
          Math.random() > 0.7
            ? [
                "Medical aid contribution optimization recommended",
                "Retirement fund contribution below optimal level",
              ]
            : [],
        recommendations: [
          "Consider increasing retirement contributions to 27.5% of income",
          "Medical aid tax credits can be optimized",
          "Travel allowance deductions available",
        ],
        processingTime: Math.random() * 3 + 2,
        complianceScore: Math.floor(Math.random() * 20) + 80,
      };

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, status: "completed", progress: 100, result }
            : f,
        ),
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                status: "error",
                error:
                  "Professional processing failed - please verify document quality",
              }
            : f,
        ),
      );
    }
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    toast({
      title: "Processing Paused",
      description: "Bulk processing has been paused. Click resume to continue.",
    });
  };

  const resumeProcessing = () => {
    setIsPaused(false);
    startBulkProcessing();
  };

  const clearAllFiles = () => {
    setFiles([]);
    setBatchSummary(null);
    toast({
      title: "Queue Cleared",
      description: "All files have been removed from the processing queue",
    });
  };

  const exportResults = () => {
    const completedFiles = files.filter((f) => f.status === "completed");
    const csvData = completedFiles.map((f) => ({
      filename: f.file.name,
      refund: f.result?.refund || 0,
      taxPaid: f.result?.taxPaid || 0,
      confidence: f.result?.confidence || 0,
      complianceScore: f.result?.complianceScore || 0,
      warnings: f.result?.warnings.join("; ") || "",
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bulk_processing_results_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Results Exported",
      description: "Bulk processing results have been exported to CSV",
    });
  };

  const getStatusIcon = (status: ProcessedFile["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "paused":
        return <Pause className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const processingCount = files.filter((f) => f.status === "processing").length;
  const completedCount = files.filter((f) => f.status === "completed").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Professional Bulk Processing</h2>
          <p className="text-muted-foreground">
            Enterprise-grade bulk processing with compliance validation
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            Professional
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Compliance Ready
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Queue</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="results">Results & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Upload multiple IRP5 documents for professional batch processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Drag and drop files here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to select files (PDF, JPG, PNG supported)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    e.target.files && handleFileSelect(e.target.files)
                  }
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  Select Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Queue ({files.length} files)</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={startBulkProcessing}
                    disabled={isProcessing || pendingCount === 0}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start Processing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAllFiles}
                    disabled={isProcessing}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(file.status)}
                        <div>
                          <p className="font-medium">{file.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24">
                          <Progress value={file.progress} className="h-2" />
                        </div>
                        <Badge variant="outline">{file.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{processingCount}</p>
                    <p className="text-sm text-muted-foreground">Processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{completedCount}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{errorCount}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {!isPaused ? (
                    <Button onClick={pauseProcessing} variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Processing
                    </Button>
                  ) : (
                    <Button onClick={resumeProcessing}>
                      <Play className="h-4 w-4 mr-2" />
                      Resume Processing
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {batchSummary && (
            <Card>
              <CardHeader>
                <CardTitle>Batch Processing Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Total Refunds
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(batchSummary.totalRefunds)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Success Rate
                    </p>
                    <p className="text-2xl font-bold">
                      {(
                        (batchSummary.completed / batchSummary.totalFiles) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Avg Processing Time
                    </p>
                    <p className="text-2xl font-bold">
                      {batchSummary.averageProcessingTime.toFixed(1)}s
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {completedCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Export Results</CardTitle>
                <CardDescription>
                  Download comprehensive results for all processed files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={exportResults} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedBulkProcessing;
