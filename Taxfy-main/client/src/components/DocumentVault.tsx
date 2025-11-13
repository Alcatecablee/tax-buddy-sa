import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { cloudStorage, type CloudFile } from '@/lib/cloudStorage';
import { pdfStorage, type StoredPDF } from '@/lib/pdfStorage';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Upload,
  Cloud,
  HardDrive,
  Calendar,
  File,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentVaultProps {
  onDocumentSelect?: (document: CloudFile | StoredPDF) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ onDocumentSelect }) => {
  const { user } = useAuth();
  const { toast } = useCustomToast();
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [localFiles, setLocalFiles] = useState<StoredPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cloudStats, setCloudStats] = useState<{ totalFiles: number; totalSize: number; storageUsed: number } | null>(null);

  const isAuthenticatedUser = user && !user.id.startsWith('offline-');

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      if (isAuthenticatedUser) {
        // Load cloud storage documents
        const cloudResult = await cloudStorage.listUserFiles(user.id);
        if (cloudResult.success && cloudResult.files) {
          setCloudFiles(cloudResult.files);
        }

        // Get cloud storage stats
        const statsResult = await cloudStorage.getUserStorageStats(user.id);
        if (statsResult.success && statsResult.stats) {
          setCloudStats(statsResult.stats);
        }
      }

      // Always load local storage (for fallback or guest users)
      const localDocs = pdfStorage.getStoredPDFs();
      setLocalFiles(localDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Document list updated'
    });
  };

  const downloadCloudFile = async (file: CloudFile) => {
    try {
      const result = await cloudStorage.downloadFile(file.id);
      if (result.success && result.blob) {
        const url = URL.createObjectURL(result.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: 'Downloaded',
          description: `${file.originalName} downloaded successfully`
        });
      } else {
        toast({
          title: 'Download Failed',
          description: result.error || 'Failed to download file',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file',
        variant: 'destructive'
      });
    }
  };

  const downloadLocalFile = async (file: StoredPDF) => {
    const result = await pdfStorage.downloadPDF(file.id);
    if (result.success) {
      toast({
        title: 'Downloaded',
        description: `${file.originalName} downloaded successfully`
      });
    } else {
      toast({
        title: 'Download Failed',
        description: result.error || 'Failed to download file',
        variant: 'destructive'
      });
    }
  };

  const deleteCloudFile = async (file: CloudFile) => {
    if (!confirm(`Are you sure you want to delete ${file.originalName}?`)) return;

    try {
      const result = await cloudStorage.deleteFile(file.id);
      if (result.success) {
        setCloudFiles(prev => prev.filter(f => f.id !== file.id));
        toast({
          title: 'Deleted',
          description: `${file.originalName} deleted successfully`
        });
        // Refresh stats
        if (isAuthenticatedUser) {
          const statsResult = await cloudStorage.getUserStorageStats(user.id);
          if (statsResult.success && statsResult.stats) {
            setCloudStats(statsResult.stats);
          }
        }
      } else {
        toast({
          title: 'Delete Failed',
          description: result.error || 'Failed to delete file',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive'
      });
    }
  };

  const deleteLocalFile = (file: StoredPDF) => {
    if (!confirm(`Are you sure you want to delete ${file.originalName}?`)) return;

    const success = pdfStorage.deletePDF(file.id);
    if (success) {
      setLocalFiles(prev => prev.filter(f => f.id !== file.id));
      toast({
        title: 'Deleted',
        description: `${file.originalName} deleted successfully`
      });
    } else {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete file',
        variant: 'destructive'
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageUsagePercentage = (): number => {
    if (!cloudStats) return 0;
    const limit = 100 * 1024 * 1024; // 100MB limit for demo
    return Math.round((cloudStats.storageUsed / limit) * 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading documents...
        </CardContent>
      </Card>
    );
  }

  const totalDocuments = cloudFiles.length + localFiles.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Vault</h2>
          <p className="text-muted-foreground">
            Manage your uploaded tax documents
          </p>
        </div>
        <Button onClick={refreshDocuments} disabled={refreshing} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Storage Stats */}
      {(isAuthenticatedUser && cloudStats) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Cloud Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span>{formatFileSize(cloudStats.storageUsed)} / 100 MB</span>
              </div>
              <Progress value={getStorageUsagePercentage()} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">{cloudStats.totalFiles}</span> files
                </div>
                <div>
                  <span className="font-medium text-foreground">{formatFileSize(cloudStats.totalSize)}</span> total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {totalDocuments === 0 && (
        <Card>
          <CardContent className="text-center p-8">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first IRP5 document to get started
            </p>
            <Button asChild>
              <a href="/upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cloud Files */}
      {isAuthenticatedUser && cloudFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Cloud Storage ({cloudFiles.length})
            </CardTitle>
            <CardDescription>
              Documents stored securely in the cloud
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cloudFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{file.originalName}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <File className="w-3 h-3 mr-1" />
                          {formatFileSize(file.size)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(file.uploadDate, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      <Cloud className="w-3 h-3 mr-1" />
                      Cloud
                    </Badge>
                    {onDocumentSelect && (
                      <Button size="sm" variant="outline" onClick={() => onDocumentSelect(file)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => downloadCloudFile(file)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteCloudFile(file)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Local Files */}
      {localFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Local Storage ({localFiles.length})
            </CardTitle>
            <CardDescription>
              Documents stored locally in your browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {localFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-medium">{file.originalName}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <File className="w-3 h-3 mr-1" />
                          {formatFileSize(file.size)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(file.uploadDate, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      <HardDrive className="w-3 h-3 mr-1" />
                      Local
                    </Badge>
                    {onDocumentSelect && (
                      <Button size="sm" variant="outline" onClick={() => onDocumentSelect(file)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => downloadLocalFile(file)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteLocalFile(file)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Tips */}
      <Alert>
        <Cloud className="h-4 w-4" />
        <AlertDescription>
          {isAuthenticatedUser ? (
            <>
              <strong>Cloud Storage:</strong> Your documents are securely stored in the cloud and accessible from any device. 
              Local storage is used as a backup when cloud storage is unavailable.
            </>
          ) : (
            <>
              <strong>Local Storage:</strong> Your documents are stored locally in your browser. 
              Sign in to enable cloud storage and access your documents from any device.
            </>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DocumentVault;
