import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Calendar,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck,
  Calculator
} from 'lucide-react';
import { pdfStorage, StoredPDF, PDFStorageStats } from '@/lib/pdfStorage';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { formatBytes, formatDate } from '@/lib/utils';

export function StoredDocuments() {
  const [storedPDFs, setStoredPDFs] = useState<StoredPDF[]>([]);
  const [storageStats, setStorageStats] = useState<PDFStorageStats>({
    totalDocuments: 0,
    totalSize: 0,
    storageUsed: 0,
    storageLimit: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useCustomToast();

  const loadStoredDocuments = () => {
    setIsLoading(true);
    try {
      const pdfs = pdfStorage.getStoredPDFs();
      const stats = pdfStorage.getStorageStats();
      
      setStoredPDFs(pdfs);
      setStorageStats(stats);
    } catch (error) {
      console.error('Error loading stored documents:', error);
      toast({
        title: "Error",
        description: "Failed to load stored documents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoredDocuments();
  }, []);

  const handleDownload = async (id: string) => {
    const result = await pdfStorage.downloadPDF(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Document downloaded successfully"
      });
      loadStoredDocuments(); // Refresh to update last accessed time
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id: string) => {
    const pdf = storedPDFs.find(p => p.id === id);
    if (!pdf) return;

    if (confirm(`Are you sure you want to delete "${pdf.originalName}"? This action cannot be undone.`)) {
      const success = pdfStorage.deletePDF(id);
      if (success) {
        toast({
          title: "Success",
          description: "Document deleted successfully"
        });
        loadStoredDocuments();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive"
        });
      }
    }
  };

  const handleClearAll = () => {
    if (storedPDFs.length === 0) return;

    if (confirm(`Are you sure you want to delete all ${storedPDFs.length} documents? This action cannot be undone.`)) {
      const success = pdfStorage.clearAll();
      if (success) {
        toast({
          title: "Success",
          description: "All documents deleted successfully"
        });
        loadStoredDocuments();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete documents",
          variant: "destructive"
        });
      }
    }
  };

  const getStoragePercentage = () => {
    return Math.round((storageStats.storageUsed / storageStats.storageLimit) * 100);
  };

  const getStorageColor = () => {
    const percentage = getStoragePercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getDocumentIcon = (pdf: StoredPDF) => {
    if (pdf.taxResults) return <Calculator className="h-5 w-5 text-green-500" />;
    if (pdf.extractedData) return <FileCheck className="h-5 w-5 text-blue-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getDocumentStatus = (pdf: StoredPDF) => {
    if (pdf.taxResults) return { label: 'Calculated', variant: 'default' as const };
    if (pdf.extractedData) return { label: 'Processed', variant: 'secondary' as const };
    return { label: 'Uploaded', variant: 'outline' as const };
  };

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageStats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              of 10 maximum
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(storageStats.storageUsed)}</div>
            <p className="text-xs text-muted-foreground">
              of {formatBytes(storageStats.storageLimit)} available
            </p>
            <Progress 
              value={getStoragePercentage()} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(storageStats.totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              Original file sizes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage Warning */}
      {getStoragePercentage() >= 80 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {getStoragePercentage() >= 95 
              ? "Storage almost full! Delete some documents to free up space."
              : "Storage is getting full. Consider deleting old documents."
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Documents
              </CardTitle>
              <CardDescription>
                Your uploaded PDF documents are stored locally in your browser
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={loadStoredDocuments} 
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {storedPDFs.length > 0 && (
                <Button 
                  onClick={handleClearAll}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {storedPDFs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No documents stored</p>
              <p className="text-sm">
                Upload PDF documents to store them locally in your browser
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {storedPDFs.map((pdf) => {
                const status = getDocumentStatus(pdf);
                return (
                  <div 
                    key={pdf.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {getDocumentIcon(pdf)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{pdf.originalName}</h3>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            {formatBytes(pdf.size)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(pdf.uploadDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last accessed {formatDate(pdf.lastAccessed)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleDownload(pdf.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={() => handleDelete(pdf.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Local Storage Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Documents are stored locally in your browser and never sent to our servers</p>
          <p>• Storage limit: 50MB and maximum 10 documents for guest users</p>
          <p>• Documents will be lost if you clear your browser data</p>
          <p>• Upgrade to a paid plan for cloud storage and unlimited documents</p>
        </CardContent>
      </Card>
    </div>
  );
} 