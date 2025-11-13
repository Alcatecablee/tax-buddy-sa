import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Download,
  Play,
  Pause,
  RefreshCw,
  Users,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'paused';
  totalFiles: number;
  processedFiles: number;
  successfulFiles: number;
  errorFiles: number;
  startTime?: Date;
  endTime?: Date;
  estimatedTimeRemaining?: number;
  errors: Array<{
    fileName: string;
    error: string;
  }>;
}

interface BulkProcessingProps {
  className?: string;
  enabled?: boolean;
  maxConcurrentJobs?: number;
}

export function BulkProcessing({ 
  className, 
  enabled = false,
  maxConcurrentJobs = 3 
}: BulkProcessingProps) {
  const [jobs, setJobs] = useState<BulkJob[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!enabled) {
      alert('Bulk processing is not available in your current plan. Please upgrade to Professional or higher.');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type === 'application/pdf' || 
        file.type.startsWith('image/')
      );
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, [enabled]);

  const handleFileSelect = () => {
    if (!enabled) {
      alert('Bulk processing is not available in your current plan. Please upgrade to Professional or higher.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setSelectedFiles(prev => [...prev, ...Array.from(files)]);
      }
    };
    input.click();
  };

  const startBulkProcessing = () => {
    if (selectedFiles.length === 0) return;

    const newJob: BulkJob = {
      id: `job-${Date.now()}`,
      name: `Bulk Processing ${new Date().toLocaleDateString()}`,
      status: 'processing',
      totalFiles: selectedFiles.length,
      processedFiles: 0,
      successfulFiles: 0,
      errorFiles: 0,
      startTime: new Date(),
      errors: []
    };

    setJobs(prev => [newJob, ...prev]);
    setIsProcessing(true);
    setSelectedFiles([]);

    // Simulate processing
    simulateProcessing(newJob.id);
  };

  const simulateProcessing = (jobId: string) => {
    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.id !== jobId) return job;
        
        if (job.processedFiles < job.totalFiles) {
          const nextProcessed = job.processedFiles + 1;
          const success = Math.random() > 0.1; // 90% success rate
          
          return {
            ...job,
            processedFiles: nextProcessed,
            successfulFiles: success ? job.successfulFiles + 1 : job.successfulFiles,
            errorFiles: success ? job.errorFiles : job.errorFiles + 1,
            errors: success ? job.errors : [
              ...job.errors,
              {
                fileName: `document_${nextProcessed}.pdf`,
                error: 'Unable to extract text from document'
              }
            ]
          };
        } else {
          // Job completed
          clearInterval(interval);
          setIsProcessing(false);
          return {
            ...job,
            status: 'completed',
            endTime: new Date()
          };
        }
      }));
    }, 1000);
  };

  const pauseJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'paused' } : job
    ));
  };

  const resumeJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'processing' } : job
    ));
    simulateProcessing(jobId);
  };

  const getStatusIcon = (status: BulkJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: BulkJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateProgress = (job: BulkJob) => {
    return job.totalFiles > 0 ? (job.processedFiles / job.totalFiles) * 100 : 0;
  };

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const duration = Math.floor((endTime.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (!enabled) {
    return (
      <Card className={cn("border-yellow-200 bg-yellow-50/50", className)}>
        <CardContent className="p-6 text-center">
          <Users className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Bulk Processing Not Available</h3>
          <p className="text-muted-foreground mb-4">
            Bulk processing is available in Professional and Enterprise plans.
          </p>
          <Button variant="outline">
            Upgrade to Professional
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Processing</h2>
          <p className="text-muted-foreground">
            Process multiple IRP5 documents simultaneously
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Professional Feature
        </Badge>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-muted-foreground mb-4">
              Supports PDF, JPG, PNG files. Maximum 100 files per batch.
            </p>
            <Button onClick={handleFileSelect} variant="outline">
              Select Files
            </Button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {selectedFiles.length} files selected
                </span>
                <Button
                  onClick={() => setSelectedFiles([])}
                  variant="ghost"
                  size="sm"
                >
                  Clear All
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-xs p-2 bg-muted rounded border">
                    <div className="truncate font-medium">{file.name}</div>
                    <div className="text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button 
                  onClick={startBulkProcessing}
                  disabled={isProcessing}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Bulk Processing
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Jobs */}
      {jobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Processing Jobs</h3>
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <CardTitle className="text-base">{job.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {job.processedFiles} of {job.totalFiles} files processed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    {job.status === 'processing' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => pauseJob(job.id)}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    {job.status === 'paused' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resumeJob(job.id)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(calculateProgress(job))}%</span>
                    </div>
                    <Progress value={calculateProgress(job)} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{job.successfulFiles} successful</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>{job.errorFiles} errors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {job.startTime && formatDuration(job.startTime, job.endTime)}
                      </span>
                    </div>
                  </div>

                  {job.errors.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        Processing Errors
                      </h4>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {job.errors.map((error, index) => (
                          <div key={index} className="text-xs p-2 bg-red-50 rounded border">
                            <div className="font-medium">{error.fileName}</div>
                            <div className="text-red-600">{error.error}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.status === 'completed' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download Results
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {jobs.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Processing Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {jobs.reduce((sum, job) => sum + job.totalFiles, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {jobs.reduce((sum, job) => sum + job.successfulFiles, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {jobs.reduce((sum, job) => sum + job.errorFiles, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {jobs.filter(job => job.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}