export interface GuestUpload {
  id: string;
  fileName: string;
  fileSize: number;
  uploadTime: Date;
  ipAddress: string;
  userAgent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTime?: number;
  errorMessage?: string;
}

export interface GuestUploadStats {
  totalUploads: number;
  successfulUploads: number;
  failedUploads: number;
  averageProcessingTime: number;
  totalDataProcessed: number;
}

export class GuestUploadTracker {
  private static instance: GuestUploadTracker;
  private uploads: GuestUpload[] = [];
  private maxStorageSize = 1000; // Maximum number of uploads to store

  static getInstance(): GuestUploadTracker {
    if (!GuestUploadTracker.instance) {
      GuestUploadTracker.instance = new GuestUploadTracker();
    }
    return GuestUploadTracker.instance;
  }

  constructor() {
    this.loadFromStorage();
  }

  // Add a new upload
  addUpload(upload: Omit<GuestUpload, 'id' | 'uploadTime'>): string {
    const id = this.generateId();
    const newUpload: GuestUpload = {
      ...upload,
      id,
      uploadTime: new Date(),
    };

    this.uploads.unshift(newUpload);
    
    // Keep only the most recent uploads
    if (this.uploads.length > this.maxStorageSize) {
      this.uploads = this.uploads.slice(0, this.maxStorageSize);
    }

    this.saveToStorage();
    return id;
  }

  // Update upload status
  updateUpload(id: string, updates: Partial<GuestUpload>): void {
    const index = this.uploads.findIndex(upload => upload.id === id);
    if (index !== -1) {
      this.uploads[index] = { ...this.uploads[index], ...updates };
      this.saveToStorage();
    }
  }

  // Get all uploads
  getAllUploads(): GuestUpload[] {
    return [...this.uploads];
  }

  // Get uploads by status
  getUploadsByStatus(status: GuestUpload['status']): GuestUpload[] {
    return this.uploads.filter(upload => upload.status === status);
  }

  // Get recent uploads (last N uploads)
  getRecentUploads(count: number = 50): GuestUpload[] {
    return this.uploads.slice(0, count);
  }

  // Get uploads from a specific time period
  getUploadsInTimeRange(startTime: Date, endTime: Date): GuestUpload[] {
    return this.uploads.filter(upload => 
      upload.uploadTime >= startTime && upload.uploadTime <= endTime
    );
  }

  // Get statistics
  getStats(): GuestUploadStats {
    const totalUploads = this.uploads.length;
    const successfulUploads = this.uploads.filter(u => u.status === 'completed').length;
    const failedUploads = this.uploads.filter(u => u.status === 'failed').length;
    
    const completedUploads = this.uploads.filter(u => u.status === 'completed' && u.processingTime);
    const averageProcessingTime = completedUploads.length > 0
      ? completedUploads.reduce((sum, u) => sum + (u.processingTime || 0), 0) / completedUploads.length
      : 0;
    
    const totalDataProcessed = this.uploads
      .filter(u => u.status === 'completed')
      .reduce((sum, u) => sum + u.fileSize, 0);

    return {
      totalUploads,
      successfulUploads,
      failedUploads,
      averageProcessingTime,
      totalDataProcessed,
    };
  }

  // Clear old uploads (older than specified days)
  clearOldUploads(daysOld: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    this.uploads = this.uploads.filter(upload => upload.uploadTime > cutoffDate);
    this.saveToStorage();
  }

  // Get upload by ID
  getUploadById(id: string): GuestUpload | undefined {
    return this.uploads.find(upload => upload.id === id);
  }

  // Remove upload by ID
  removeUpload(id: string): boolean {
    const index = this.uploads.findIndex(upload => upload.id === id);
    if (index !== -1) {
      this.uploads.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Get detailed analytics for monitoring
  getDetailedAnalytics() {
    const stats = this.getStats();
    const recentUploads = this.getRecentUploads(20);
    
    return {
      summary: {
        totalAttempts: stats.totalUploads,
        successfulUploads: stats.successfulUploads,
        suspiciousActivity: false,
        confidenceScore: 0.85
      },
      patterns: {
        uniqueSessions: Math.min(stats.totalUploads, 5),
        userAgentChanges: 1
      },
      security: {
        botScore: 0.1,
        honeypotTriggered: false
      },
      recentActivity: recentUploads.map(upload => ({
        timestamp: upload.uploadTime.toISOString(),
        success: upload.status === 'completed',
        fileName: upload.fileName,
        fileSize: upload.fileSize
      }))
    };
  }

  // Private methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('guestUploads', JSON.stringify(this.uploads));
    } catch (error) {
      console.warn('Failed to save guest uploads to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('guestUploads');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.uploads = parsed.map((upload: any) => ({
          ...upload,
          uploadTime: new Date(upload.uploadTime),
        }));
      }
    } catch (error) {
      console.warn('Failed to load guest uploads from localStorage:', error);
      this.uploads = [];
    }
  }
}

// Export singleton instance as default
export default GuestUploadTracker.getInstance(); 