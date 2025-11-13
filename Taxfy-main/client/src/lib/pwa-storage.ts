// Enhanced PWA Storage Manager for Offline Tax Calculations
// Maintains existing theme colors and provides robust offline functionality

interface TaxCalculationData {
  id: string;
  timestamp: number;
  grossIncome: number;
  taxPaid: number;
  retirementContrib: number;
  medicalContrib: number;
  medicalCredits: number;
  uifContrib: number;
  travelAllowance: number;
  result?: {
    taxOwed: number;
    refundDue: number;
    isRefund: boolean;
  };
  synced: boolean;
}

interface PWAStorageConfig {
  maxCalculations: number;
  maxStorageSize: number; // in MB
  retentionDays: number;
}

const DEFAULT_CONFIG: PWAStorageConfig = {
  maxCalculations: 50,
  maxStorageSize: 10, // 10MB
  retentionDays: 365, // 1 year
};

class PWAStorageManager {
  private dbName = "TaxfyOfflineDB";
  private dbVersion = 2;
  private db: IDBDatabase | null = null;
  private config: PWAStorageConfig;

  constructor(config: Partial<PWAStorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("Failed to open IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("PWA Storage initialized successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Tax calculations store
        if (!db.objectStoreNames.contains("calculations")) {
          const calculationsStore = db.createObjectStore("calculations", {
            keyPath: "id",
          });
          calculationsStore.createIndex("timestamp", "timestamp", {
            unique: false,
          });
          calculationsStore.createIndex("synced", "synced", { unique: false });
        }

        // Documents store for offline access
        if (!db.objectStoreNames.contains("documents")) {
          const documentsStore = db.createObjectStore("documents", {
            keyPath: "id",
          });
          documentsStore.createIndex("timestamp", "timestamp", {
            unique: false,
          });
        }

        // Settings store
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }

        console.log("IndexedDB schema updated");
      };
    });
  }

  async saveCalculation(
    data: Omit<TaxCalculationData, "id" | "timestamp" | "synced">,
  ): Promise<string> {
    if (!this.db) await this.init();

    const calculation: TaxCalculationData = {
      ...data,
      id: this.generateId(),
      timestamp: Date.now(),
      synced: navigator.onLine,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["calculations"], "readwrite");
      const store = transaction.objectStore("calculations");
      const request = store.add(calculation);

      request.onsuccess = () => {
        console.log("Calculation saved offline:", calculation.id);
        this.cleanup(); // Clean up old data
        resolve(calculation.id);
      };

      request.onerror = () => {
        console.error("Failed to save calculation:", request.error);
        reject(request.error);
      };
    });
  }

  async getCalculations(limit = 20): Promise<TaxCalculationData[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["calculations"], "readonly");
      const store = transaction.objectStore("calculations");
      const index = store.index("timestamp");
      const request = index.openCursor(null, "prev"); // Latest first

      const results: TaxCalculationData[] = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && count < limit) {
          results.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => {
        console.error("Failed to get calculations:", request.error);
        reject(request.error);
      };
    });
  }

  async getPendingSync(): Promise<TaxCalculationData[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["calculations"], "readonly");
      const store = transaction.objectStore("calculations");
      const index = store.index("synced");
      const request = index.getAll(false); // Get unsynced items

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("Failed to get pending sync items:", request.error);
        reject(request.error);
      };
    });
  }

  async markAsSynced(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["calculations"], "readwrite");
      const store = transaction.objectStore("calculations");
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const calculation = getRequest.result;
        if (calculation) {
          calculation.synced = true;
          const putRequest = store.put(calculation);

          putRequest.onsuccess = () => {
            console.log("Calculation marked as synced:", id);
            resolve();
          };

          putRequest.onerror = () => {
            reject(putRequest.error);
          };
        } else {
          reject(new Error("Calculation not found"));
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }

  async deleteCalculation(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["calculations"], "readwrite");
      const store = transaction.objectStore("calculations");
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log("Calculation deleted:", id);
        resolve();
      };

      request.onerror = () => {
        console.error("Failed to delete calculation:", request.error);
        reject(request.error);
      };
    });
  }

  async getStorageInfo(): Promise<{
    used: number;
    available: number;
    calculationsCount: number;
  }> {
    if (!this.db) await this.init();

    // Get storage estimate if available
    let used = 0;
    let available = this.config.maxStorageSize * 1024 * 1024; // Convert MB to bytes

    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        used = estimate.usage || 0;
        available = estimate.quota || available;
      } catch (error) {
        console.warn("Storage estimate not available:", error);
      }
    }

    // Count calculations
    const calculationsCount = await this.getCalculationsCount();

    return {
      used,
      available,
      calculationsCount,
    };
  }

  private async getCalculationsCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["calculations"], "readonly");
      const store = transaction.objectStore("calculations");
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("Failed to count calculations:", request.error);
        reject(request.error);
      };
    });
  }

  private async cleanup(): Promise<void> {
    try {
      const storageInfo = await this.getStorageInfo();

      // Clean up if we have too many calculations
      if (storageInfo.calculationsCount > this.config.maxCalculations) {
        await this.cleanupOldCalculations();
      }

      // Clean up expired calculations
      await this.cleanupExpiredCalculations();
    } catch (error) {
      console.error("Cleanup failed:", error);
    }
  }

  private async cleanupOldCalculations(): Promise<void> {
    const calculations = await this.getCalculations(1000); // Get all
    const toDelete = calculations
      .slice(this.config.maxCalculations) // Keep only max allowed
      .filter((calc) => calc.synced); // Only delete synced ones

    for (const calc of toDelete) {
      await this.deleteCalculation(calc.id);
    }

    console.log(`Cleaned up ${toDelete.length} old calculations`);
  }

  private async cleanupExpiredCalculations(): Promise<void> {
    const cutoffTime =
      Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000;
    const calculations = await this.getCalculations(1000);
    const expired = calculations.filter(
      (calc) => calc.timestamp < cutoffTime && calc.synced,
    );

    for (const calc of expired) {
      await this.deleteCalculation(calc.id);
    }

    console.log(`Cleaned up ${expired.length} expired calculations`);
  }

  private generateId(): string {
    return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async exportData(): Promise<string> {
    const calculations = await this.getCalculations(1000);
    const data = {
      version: "1.0",
      exported: new Date().toISOString(),
      calculations: calculations.map((calc) => ({
        ...calc,
        // Remove internal fields
        id: undefined,
        synced: undefined,
      })),
    };

    return JSON.stringify(data, null, 2);
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["calculations", "documents", "settings"],
        "readwrite",
      );

      Promise.all([
        this.clearObjectStore(transaction, "calculations"),
        this.clearObjectStore(transaction, "documents"),
        this.clearObjectStore(transaction, "settings"),
      ])
        .then(() => {
          console.log("All PWA data cleared");
          resolve();
        })
        .catch(reject);
    });
  }

  private clearObjectStore(
    transaction: IDBTransaction,
    storeName: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const pwaStorage = new PWAStorageManager();

// Auto-initialize
if (typeof window !== "undefined") {
  pwaStorage.init().catch(console.error);
}

export default PWAStorageManager;
