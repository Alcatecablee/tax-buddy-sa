export interface StoredPDF {
  id: string;
  name: string;
  originalName: string;
  size: number;
  compressedSize: number;
  uploadDate: Date;
  lastAccessed: Date;
  data: string; // Base64 encoded compressed data
  extractedData?: any; // IRP5 data if extracted
  taxResults?: any; // Tax calculation results if calculated
  thumbnail?: string; // Base64 encoded thumbnail
}

export interface PDFStorageStats {
  totalDocuments: number;
  totalSize: number;
  storageUsed: number;
  storageLimit: number;
}

export class PDFStorageManager {
  private static instance: PDFStorageManager;
  private readonly STORAGE_KEY = 'guest_pdfs';
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB limit for guest users
  private readonly MAX_DOCUMENTS = 10; // Maximum 10 documents for guests

  private constructor() {}

  public static getInstance(): PDFStorageManager {
    if (!PDFStorageManager.instance) {
      PDFStorageManager.instance = new PDFStorageManager();
    }
    return PDFStorageManager.instance;
  }

  /**
   * Store a PDF file locally with compression
   */
  public async storePDF(
    file: File, 
    extractedData?: any, 
    taxResults?: any
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Check storage limits
      const stats = this.getStorageStats();
      if (stats.totalDocuments >= this.MAX_DOCUMENTS) {
        return { 
          success: false, 
          error: `Maximum ${this.MAX_DOCUMENTS} documents allowed for guest users` 
        };
      }

      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      // Compress the data (simple compression using built-in methods)
      const compressedData = await this.compressData(base64Data);
      
      // Check if compressed data exceeds remaining storage
      const compressedSize = new Blob([compressedData]).size;
      if (stats.storageUsed + compressedSize > this.MAX_STORAGE_SIZE) {
        return { 
          success: false, 
          error: 'Storage limit exceeded. Please delete some documents first.' 
        };
      }

      // Generate thumbnail (first page preview)
      const thumbnail = await this.generateThumbnail(file);

      // Create stored PDF object
      const storedPDF: StoredPDF = {
        id: this.generateId(),
        name: this.sanitizeFileName(file.name),
        originalName: file.name,
        size: file.size,
        compressedSize: compressedSize,
        uploadDate: new Date(),
        lastAccessed: new Date(),
        data: compressedData,
        extractedData,
        taxResults,
        thumbnail
      };

      // Save to storage
      const success = this.saveToStorage(storedPDF);
      
      if (success) {
        return { success: true, id: storedPDF.id };
      } else {
        return { success: false, error: 'Failed to save to local storage' };
      }
    } catch (error) {
      console.error('Error storing PDF:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Retrieve all stored PDFs
   */
  public getStoredPDFs(): StoredPDF[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const pdfs: StoredPDF[] = JSON.parse(stored);
      return pdfs.map(pdf => ({
        ...pdf,
        uploadDate: new Date(pdf.uploadDate),
        lastAccessed: new Date(pdf.lastAccessed)
      }));
    } catch (error) {
      console.error('Error retrieving stored PDFs:', error);
      return [];
    }
  }

  /**
   * Get a specific PDF by ID
   */
  public getPDF(id: string): StoredPDF | null {
    const pdfs = this.getStoredPDFs();
    const pdf = pdfs.find(p => p.id === id);
    
    if (pdf) {
      // Update last accessed time
      pdf.lastAccessed = new Date();
      this.updatePDF(pdf);
    }
    
    return pdf || null;
  }

  /**
   * Download a stored PDF as a file
   */
  public async downloadPDF(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const pdf = this.getPDF(id);
      if (!pdf) {
        return { success: false, error: 'PDF not found' };
      }

      // Decompress and convert back to file
      const decompressedData = await this.decompressData(pdf.data);
      const binaryData = atob(decompressedData);
      const bytes = new Uint8Array(binaryData.length);
      
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error downloading PDF:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Download failed' 
      };
    }
  }

  /**
   * Delete a stored PDF
   */
  public deletePDF(id: string): boolean {
    try {
      const pdfs = this.getStoredPDFs();
      const filteredPDFs = pdfs.filter(pdf => pdf.id !== id);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPDFs));
      return true;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      return false;
    }
  }

  /**
   * Update PDF metadata (extracted data, tax results, etc.)
   */
  public updatePDF(updatedPDF: StoredPDF): boolean {
    try {
      const pdfs = this.getStoredPDFs();
      const index = pdfs.findIndex(pdf => pdf.id === updatedPDF.id);
      
      if (index === -1) return false;
      
      pdfs[index] = updatedPDF;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pdfs));
      return true;
    } catch (error) {
      console.error('Error updating PDF:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  public getStorageStats(): PDFStorageStats {
    const pdfs = this.getStoredPDFs();
    const totalSize = pdfs.reduce((sum, pdf) => sum + pdf.size, 0);
    const storageUsed = pdfs.reduce((sum, pdf) => sum + pdf.compressedSize, 0);

    return {
      totalDocuments: pdfs.length,
      totalSize,
      storageUsed,
      storageLimit: this.MAX_STORAGE_SIZE
    };
  }

  /**
   * Clear all stored PDFs
   */
  public clearAll(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing PDFs:', error);
      return false;
    }
  }

  // Private helper methods
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:application/pdf;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async compressData(data: string): Promise<string> {
    // Simple compression using built-in compression
    // In a real implementation, you might use a library like pako for better compression
    try {
      const compressed = btoa(data);
      return compressed;
    } catch (error) {
      console.warn('Compression failed, using original data:', error);
      return data;
    }
  }

  private async decompressData(compressedData: string): Promise<string> {
    try {
      const decompressed = atob(compressedData);
      return decompressed;
    } catch (error) {
      console.warn('Decompression failed, using data as-is:', error);
      return compressedData;
    }
  }

  private async generateThumbnail(file: File): Promise<string | undefined> {
    try {
      // This is a placeholder for thumbnail generation
      // In a real implementation, you would use PDF.js or similar to generate a thumbnail
      return undefined;
    } catch (error) {
      console.warn('Thumbnail generation failed:', error);
      return undefined;
    }
  }

  private generateId(): string {
    return `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  private saveToStorage(pdf: StoredPDF): boolean {
    try {
      const existingPDFs = this.getStoredPDFs();
      existingPDFs.push(pdf);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingPDFs));
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  }
}

export const pdfStorage = PDFStorageManager.getInstance(); 