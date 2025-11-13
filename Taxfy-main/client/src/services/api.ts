// Determine API base URL with better fallback logic
const getApiBaseUrl = () => {
  // Check if we have an explicit API URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // For production deployments, try to use the current domain
  if (import.meta.env.PROD) {
    return `${window.location.origin}/api`;
  }

  // For development, default to /api (proxied by vite)
  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

// Production API configuration
if (import.meta.env.DEV) {
  console.log("API Configuration:", {
    API_BASE_URL,
    mode: import.meta.env.MODE,
  });
}

// Types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  last_login?: string;
  is_admin: boolean;
}

export interface TaxCalculation {
  id: number;
  user_id: string;
  calculation_type: string;
  input_data: any;
  result_data: any;
  created_at: string;
}

export interface DocumentUpload {
  id: number;
  user_id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  upload_path: string;
  created_at: string;
}

export interface UserActivity {
  id: number;
  user_id: string;
  activity_type: string;
  description?: string;
  metadata?: any;
  created_at: string;
}

export interface DashboardStats {
  totalCalculations: number;
  totalUploads: number;
  recentCalculations: TaxCalculation[];
  recentUploads: DocumentUpload[];
  recentActivity: UserActivity[];
}

export interface TaxReport {
  id: number;
  user_id: string;
  report_type: string;
  tax_year: number;
  status: "generated" | "pending" | "error";
  file_path?: string;
  report_data?: any;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  dataRetention: number;
  autoBackup: boolean;
  twoFactorAuth: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  taxNumber?: string;
  employerName?: string;
}

// API Service
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage += ` (${errorData.error})`;
          }
        } catch (e) {
          // Ignore JSON parsing errors for error responses
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Log errors for debugging but not excessive details in production
      if (import.meta.env.DEV) {
        console.error(`API Request Failed:`, {
          url,
          method: options.method || "GET",
          error: error instanceof Error ? error.message : String(error),
        });
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${error}`);
    }
  }

  // User operations
  async createUser(userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUserLogin(userId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/users/${userId}/login`, {
      method: "PUT",
    });
  }

  // Dashboard operations
  async getUserDashboard(userId: string): Promise<DashboardStats> {
    return this.request<DashboardStats>(`/users/${userId}/dashboard`);
  }

  // Tax calculation operations
  async createTaxCalculation(data: {
    user_id: string;
    calculation_type: string;
    input_data: any;
    result_data: any;
  }): Promise<TaxCalculation> {
    return this.request<TaxCalculation>("/tax-calculations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUserTaxCalculations(
    userId: string,
    limit = 10,
  ): Promise<TaxCalculation[]> {
    return this.request<TaxCalculation[]>(
      `/users/${userId}/tax-calculations?limit=${limit}`,
    );
  }

  // Document upload operations
  async createDocumentUpload(data: {
    user_id: string;
    filename: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    upload_path: string;
  }): Promise<DocumentUpload> {
    return this.request<DocumentUpload>("/document-uploads", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUserDocumentUploads(
    userId: string,
    limit = 10,
  ): Promise<DocumentUpload[]> {
    return this.request<DocumentUpload[]>(
      `/users/${userId}/document-uploads?limit=${limit}`,
    );
  }

  // User activity operations
  async getUserActivities(userId: string, limit = 10): Promise<UserActivity[]> {
    return this.request<UserActivity[]>(
      `/users/${userId}/activities?limit=${limit}`,
    );
  }

  // Reports operations
  async getUserReports(userId: string): Promise<TaxReport[]> {
    return this.request<TaxReport[]>(`/users/${userId}/reports`);
  }

  async generateReport(
    userId: string,
    reportType: string,
    taxYear: number,
  ): Promise<TaxReport> {
    return this.request<TaxReport>("/reports/generate", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        report_type: reportType,
        tax_year: taxYear,
      }),
    });
  }

  async downloadReport(reportId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/reports/${reportId}/download`,
    );
    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${reportId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // User settings operations
  async getUserSettings(
    userId: string,
  ): Promise<{ settings: UserSettings; profile: UserProfile }> {
    return this.request<{ settings: UserSettings; profile: UserProfile }>(
      `/users/${userId}/settings`,
    );
  }

  async updateUserSettings(
    userId: string,
    settings: UserSettings,
  ): Promise<void> {
    return this.request<void>(`/users/${userId}/settings`, {
      method: "PUT",
      body: JSON.stringify({ settings }),
    });
  }

  async updateUserProfile(userId: string, profile: UserProfile): Promise<void> {
    return this.request<void>(`/users/${userId}/profile`, {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    return this.request<void>(`/users/${userId}/password`, {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async exportUserData(userId: string): Promise<void> {
    return this.request<void>(`/users/${userId}/export`, {
      method: "POST",
    });
  }

  async deleteUserAccount(userId: string): Promise<void> {
    return this.request<void>(`/users/${userId}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>("/health");
  }
}

export const apiService = new ApiService();
