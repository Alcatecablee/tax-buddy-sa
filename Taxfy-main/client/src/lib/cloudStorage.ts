import { createClient } from '@supabase/supabase-js';

// Supabase configuration - use import.meta.env for Vite compatibility
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.REACT_APP_SUPABASE_URL ||
                   'https://gegcqqedwmuncqdilbjx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                       import.meta.env.REACT_APP_SUPABASE_ANON_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZ2NxcWVkd211bmNxZGlsYmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NDU4MDksImV4cCI6MjA0OTQyMTgwOX0.XOqDdTz7vfGc_9R7VWg3cRd2Y0BjPt4KqsJxHY8wr0Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CloudFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadDate: Date;
  publicUrl?: string;
  metadata?: any;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class CloudStorageService {
  private static instance: CloudStorageService;
  private readonly BUCKET_NAME = 'tax-documents';

  private constructor() {}

  public static getInstance(): CloudStorageService {
    if (!CloudStorageService.instance) {
      CloudStorageService.instance = new CloudStorageService();
    }
    return CloudStorageService.instance;
  }

  /**
   * Initialize storage bucket (create if doesn't exist)
   */
  public async initializeBucket(): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return { success: false, error: listError.message };
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);

      if (!bucketExists) {
        // Create bucket with public access for file downloads
        const { data, error } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: false, // Private bucket - users can only access their own files
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          fileSizeLimit: 10485760, // 10MB limit
        });

        if (error) {
        console.error('Error creating bucket:', error);
        if (error.message.includes('Invalid API key')) {
          console.log('🔑 Supabase API key issue - cloud storage will be unavailable');
          return { success: false, error: 'Cloud storage unavailable - using local storage' };
        }
        return { success: false, error: error.message };
      }

        console.log('✅ Storage bucket created successfully');
      }

      return { success: true };
    } catch (error) {
      console.error('Error initializing bucket:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Upload a file to cloud storage
   */
  public async uploadFile(
    file: File,
    userId: string,
    metadata?: any,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ success: boolean; file?: CloudFile; error?: string }> {
    try {
      // Initialize bucket if needed
      await this.initializeBucket();

      // Generate unique file path
      const fileExtension = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            userId,
            originalName: file.name,
            uploadDate: new Date().toISOString(),
            ...metadata
          }
        });

      if (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: error.message };
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      const cloudFile: CloudFile = {
        id: data.path,
        name: fileName,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        uploadDate: new Date(),
        publicUrl: urlData.publicUrl,
        metadata
      };

      // Simulate progress for user feedback
      if (onProgress) {
        onProgress({ loaded: file.size, total: file.size, percentage: 100 });
      }

      console.log('✅ File uploaded successfully:', cloudFile.id);
      return { success: true, file: cloudFile };

    } catch (error) {
      console.error('Error in uploadFile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Download a file from cloud storage
   */
  public async downloadFile(filePath: string): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .download(filePath);

      if (error) {
        console.error('Error downloading file:', error);
        return { success: false, error: error.message };
      }

      return { success: true, blob: data };
    } catch (error) {
      console.error('Error in downloadFile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Download failed' 
      };
    }
  }

  /**
   * Delete a file from cloud storage
   */
  public async deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ File deleted successfully:', filePath);
      return { success: true };
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      };
    }
  }

  /**
   * List files for a user
   */
  public async listUserFiles(userId: string): Promise<{ success: boolean; files?: CloudFile[]; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error listing files:', error);
        return { success: false, error: error.message };
      }

      const cloudFiles: CloudFile[] = data?.map(file => ({
        id: `${userId}/${file.name}`,
        name: file.name,
        originalName: file.metadata?.originalName || file.name,
        size: file.metadata?.size || 0,
        mimeType: file.metadata?.mimetype || 'application/octet-stream',
        uploadDate: new Date(file.created_at),
        metadata: file.metadata
      })) || [];

      return { success: true, files: cloudFiles };
    } catch (error) {
      console.error('Error in listUserFiles:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'List files failed' 
      };
    }
  }

  /**
   * Get storage usage for a user
   */
  public async getUserStorageStats(userId: string): Promise<{ 
    success: boolean; 
    stats?: { totalFiles: number; totalSize: number; storageUsed: number }; 
    error?: string 
  }> {
    try {
      const { success, files, error } = await this.listUserFiles(userId);
      
      if (!success || !files) {
        return { success: false, error };
      }

      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      return {
        success: true,
        stats: {
          totalFiles,
          totalSize,
          storageUsed: totalSize
        }
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get storage stats' 
      };
    }
  }

  /**
   * Create a signed URL for temporary file access
   */
  public async createSignedUrl(filePath: string, expiresIn: number = 3600): Promise<{ 
    success: boolean; 
    signedUrl?: string; 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('Error creating signed URL:', error);
        return { success: false, error: error.message };
      }

      return { success: true, signedUrl: data.signedUrl };
    } catch (error) {
      console.error('Error in createSignedUrl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create signed URL' 
      };
    }
  }
}

export const cloudStorage = CloudStorageService.getInstance();
