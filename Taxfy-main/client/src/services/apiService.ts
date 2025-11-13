// Real API Service - No Mock Data
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  subscription_tier?: string;
  subscription_status?: string;
  company_name?: string;
  created_at?: string;
  last_login?: string;
  is_admin?: boolean;
}

// Tax calculation types
export interface TaxCalculation {
  id: number;
  user_id: string;
  calculation_type: string;
  input_data: any;
  result_data: any;
  created_at: string;
  updated_at: string;
}

// Document upload types
export interface DocumentUpload {
  id: number;
  user_id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  processing_status: string;
  extracted_data?: any;
  created_at: string;
}

// Activity types
export interface UserActivity {
  id: number;
  user_id: string;
  activity_type: string;
  description: string;
  metadata?: any;
  created_at: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  // In production, this would get the Clerk JWT token
  // For now, we'll use a simple user ID header
  const userId = localStorage.getItem("currentUserId") || "demo-user";
  return {
    "Content-Type": "application/json",
    "X-User-ID": userId,
  };
};

// Helper function to handle API responses
const handleResponse = async <T>(
  response: Response,
): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// User Management API
export class UserManagementAPI {
  static async createUser(userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    subscriptionTier?: string;
    companyName?: string;
  }): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      return await handleResponse<User>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create user",
      };
    }
  }

  static async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<User>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user",
      };
    }
  }

  static async updateUserLogin(
    userId: string,
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/login`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      return await handleResponse<{ success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update login",
      };
    }
  }

  static async getAllUsers(
    page = 1,
    limit = 50,
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`,
        {
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<PaginatedResponse<User>>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      };
    }
  }

  static async getUserStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/stats`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<any>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch user stats",
      };
    }
  }
}

// Tax Calculation API
export class TaxCalculationAPI {
  static async saveCalculation(calculationData: {
    calculationType: string;
    inputData: any;
    resultData: any;
  }): Promise<ApiResponse<{ id: number; success: boolean }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/calculations`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(calculationData),
      });

      return await handleResponse<{ id: number; success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to save calculation",
      };
    }
  }

  static async getUserCalculations(
    userId: string,
  ): Promise<ApiResponse<TaxCalculation[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/calculations/${userId}`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<TaxCalculation[]>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch calculations",
      };
    }
  }

  static async getCalculationStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/calculations/stats`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<any>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch calculation stats",
      };
    }
  }
}

// Document Upload API
export class DocumentUploadAPI {
  static async uploadDocument(file: File): Promise<
    ApiResponse<{
      id: number;
      filename: string;
      originalName: string;
      size: number;
      success: boolean;
    }>
  > {
    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: "POST",
        headers: {
          "X-User-ID": localStorage.getItem("currentUserId") || "demo-user",
        },
        body: formData,
      });

      return await handleResponse<{
        id: number;
        filename: string;
        originalName: string;
        size: number;
        success: boolean;
      }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload document",
      };
    }
  }

  static async getUserDocuments(
    userId: string,
  ): Promise<ApiResponse<DocumentUpload[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${userId}`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<DocumentUpload[]>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch documents",
      };
    }
  }
}

// User Dashboard API
export class UserDashboardAPI {
  static async getDashboardData(userId: string): Promise<
    ApiResponse<{
      totalCalculations: number;
      totalUploads: number;
      recentCalculations: TaxCalculation[];
      recentUploads: DocumentUpload[];
      recentActivity: UserActivity[];
    }>
  > {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/user/${userId}`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<{
        totalCalculations: number;
        totalUploads: number;
        recentCalculations: TaxCalculation[];
        recentUploads: DocumentUpload[];
        recentActivity: UserActivity[];
      }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      };
    }
  }
}

// Admin Dashboard API
export class AdminDashboardAPI {
  static async getAdminDashboard(): Promise<
    ApiResponse<{
      stats: {
        users: any;
        calculations: any;
        documents: any;
      };
      recent: {
        calculations: any[];
        uploads: any[];
        activity: any[];
      };
      users: User[];
    }>
  > {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<{
        stats: {
          users: any;
          calculations: any;
          documents: any;
        };
        recent: {
          calculations: any[];
          uploads: any[];
          activity: any[];
        };
        users: User[];
      }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch admin dashboard",
      };
    }
  }
}

// Activity API
export class ActivityAPI {
  static async getUserActivity(
    userId: string,
    limit = 20,
  ): Promise<ApiResponse<UserActivity[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/activity/${userId}?limit=${limit}`,
        {
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<UserActivity[]>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch activity",
      };
    }
  }

  static async logActivity(activityData: {
    activityType: string;
    description: string;
    metadata?: any;
  }): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/activity`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(activityData),
      });

      return await handleResponse<{ success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to log activity",
      };
    }
  }
}

// System Health API
export class SystemHealthAPI {
  static async getHealthCheck(): Promise<
    ApiResponse<{
      status: string;
      timestamp: string;
      database: string;
    }>
  > {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);

      return await handleResponse<{
        status: string;
        timestamp: string;
        database: string;
      }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check system health",
      };
    }
  }
}

// Utility function to set current user (for demo purposes)
export const setCurrentUser = (userId: string) => {
  localStorage.setItem("currentUserId", userId);
};

// Utility function to get current user
export const getCurrentUser = (): string | null => {
  return localStorage.getItem("currentUserId");
};

// Export default API object for backward compatibility
export default {
  UserManagementAPI,
  TaxCalculationAPI,
  DocumentUploadAPI,
  UserDashboardAPI,
  AdminDashboardAPI,
  ActivityAPI,
  SystemHealthAPI,
};
