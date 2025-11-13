// Real Business API Service - Connects to actual backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Import shared types from apiService
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

// Business-specific types
export interface SupportTicket {
  id: number;
  user_id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "pending" | "resolved" | "closed";
  category:
    | "technical"
    | "billing"
    | "feature-request"
    | "integration"
    | "account"
    | "general";
  assigned_agent_id?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  tags?: string;
  // Joined fields
  email?: string;
  first_name?: string;
  last_name?: string;
  agent_name?: string;
}

export interface SupportResponse {
  id: number;
  ticket_id: number;
  author_id: string;
  author_type: "user" | "agent" | "system";
  message: string;
  attachments?: string;
  created_at: string;
  // Joined fields
  first_name?: string;
  last_name?: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  specializations: string;
  status: "online" | "busy" | "offline";
  active_tickets: number;
  rating: number;
  created_at: string;
}

export interface Integration {
  id: number;
  user_id: string;
  name: string;
  type: "erp" | "crm" | "accounting" | "hr" | "banking" | "other";
  provider: string;
  status: "active" | "inactive" | "error" | "configuring";
  config: string; // JSON string
  last_sync?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceFramework {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  type: "tax" | "data-privacy" | "financial" | "industry-specific";
  jurisdiction: string;
  compliance_score: number;
  status: "compliant" | "non-compliant" | "partial" | "pending-review";
  last_assessment?: string;
  next_review?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRequirement {
  id: number;
  framework_id: number;
  title: string;
  description?: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "compliant" | "non-compliant" | "in-progress" | "not-applicable";
  evidence?: string;
  due_date?: string;
  last_review?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  severity: "info" | "warning" | "error" | "critical";
  created_at: string;
  // Joined fields
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface BulkUploadBatch {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  total_files: number;
  processed_files: number;
  failed_files: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_summary?: string;
}

export interface BulkUploadFile {
  id: number;
  batch_id: number;
  filename: string;
  original_name: string;
  file_size: number;
  status: "pending" | "processing" | "completed" | "failed";
  error_message?: string;
  extracted_data?: string;
  created_at: string;
  processed_at?: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
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

// Business API Service Class
export class BusinessApiService {
  // Support Ticket Management
  static async createSupportTicket(ticketData: {
    title: string;
    description: string;
    priority?: "low" | "medium" | "high" | "critical";
    category: string;
    tags?: string[];
  }): Promise<ApiResponse<{ id: number; success: boolean }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/business/support/tickets`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...ticketData,
          tags: ticketData.tags?.join(",") || "",
        }),
      });

      return await handleResponse<{ id: number; success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create support ticket",
      };
    }
  }

  static async getSupportTickets(
    filters?: {
      status?: string;
      priority?: string;
      category?: string;
    },
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<SupportTicket>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await fetch(
        `${API_BASE_URL}/business/support/tickets?${params}`,
        {
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<PaginatedResponse<SupportTicket>>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch support tickets",
      };
    }
  }

  static async updateSupportTicket(
    ticketId: number,
    updates: {
      status?: string;
      priority?: string;
      assignedAgent?: string;
    },
  ): Promise<ApiResponse<SupportTicket>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/support/tickets/${ticketId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updates),
        },
      );

      return await handleResponse<SupportTicket>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update support ticket",
      };
    }
  }

  static async addTicketResponse(
    ticketId: number,
    message: string,
    authorType: "user" | "agent" | "system" = "user",
  ): Promise<ApiResponse<{ id: number; success: boolean }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/support/tickets/${ticketId}/responses`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            message,
            authorType,
          }),
        },
      );

      return await handleResponse<{ id: number; success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to add ticket response",
      };
    }
  }

  static async getTicketResponses(
    ticketId: number,
  ): Promise<ApiResponse<SupportResponse[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/support/tickets/${ticketId}/responses`,
        {
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<SupportResponse[]>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch ticket responses",
      };
    }
  }

  static async getSupportAgents(): Promise<ApiResponse<SupportAgent[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/business/support/agents`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<SupportAgent[]>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch support agents",
      };
    }
  }

  // Integration Management
  static async getIntegrations(): Promise<ApiResponse<Integration[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/business/integrations`, {
        headers: getAuthHeaders(),
      });

      return await handleResponse<Integration[]>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch integrations",
      };
    }
  }

  static async createIntegration(integrationData: {
    name: string;
    type: string;
    provider: string;
    config: Record<string, any>;
  }): Promise<ApiResponse<{ id: number; success: boolean }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/business/integrations`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...integrationData,
          config: JSON.stringify(integrationData.config),
        }),
      });

      return await handleResponse<{ id: number; success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create integration",
      };
    }
  }

  static async updateIntegration(
    integrationId: number,
    updates: {
      status?: string;
      config?: Record<string, any>;
      errorMessage?: string;
    },
  ): Promise<ApiResponse<Integration>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/integrations/${integrationId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...updates,
            config: updates.config ? JSON.stringify(updates.config) : undefined,
          }),
        },
      );

      return await handleResponse<Integration>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update integration",
      };
    }
  }

  static async deleteIntegration(
    integrationId: number,
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/integrations/${integrationId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<{ success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete integration",
      };
    }
  }

  static async testIntegration(
    integrationId: number,
  ): Promise<ApiResponse<{ success: boolean; status: string }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/integrations/${integrationId}/test`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<{ success: boolean; status: string }>(
        response,
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to test integration",
      };
    }
  }

  static async syncIntegration(
    integrationId: number,
  ): Promise<ApiResponse<{ success: boolean; status: string }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/integrations/${integrationId}/sync`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<{ success: boolean; status: string }>(
        response,
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to sync integration",
      };
    }
  }

  // Compliance Management
  static async getComplianceFrameworks(): Promise<
    ApiResponse<ComplianceFramework[]>
  > {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/compliance/frameworks`,
        {
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<ComplianceFramework[]>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch compliance frameworks",
      };
    }
  }

  static async createComplianceFramework(frameworkData: {
    name: string;
    description?: string;
    type: string;
    jurisdiction: string;
  }): Promise<ApiResponse<{ id: number; success: boolean }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/compliance/frameworks`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(frameworkData),
        },
      );

      return await handleResponse<{ id: number; success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create compliance framework",
      };
    }
  }

  // Audit Logs
  static async getAuditLogs(
    filters?: {
      userId?: string;
      action?: string;
      resource?: string;
      severity?: string;
    },
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await fetch(
        `${API_BASE_URL}/business/audit-logs?${params}`,
        {
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<PaginatedResponse<AuditLog>>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch audit logs",
      };
    }
  }

  static async createAuditLog(logData: {
    action: string;
    resource: string;
    resourceId?: string;
    details?: string;
    severity?: "info" | "warning" | "error" | "critical";
  }): Promise<ApiResponse<{ id: number; success: boolean }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/business/audit-logs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(logData),
      });

      return await handleResponse<{ id: number; success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create audit log",
      };
    }
  }

  // Bulk Upload Management
  static async getBulkUploadBatches(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<BulkUploadBatch>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${API_BASE_URL}/business/bulk-upload/batches?${params}`,
        {
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<PaginatedResponse<BulkUploadBatch>>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch bulk upload batches",
      };
    }
  }

  static async createBulkUploadBatch(batchData: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<{ id: number; success: boolean }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/bulk-upload/batches`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(batchData),
        },
      );

      return await handleResponse<{ id: number; success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create bulk upload batch",
      };
    }
  }

  static async uploadBulkFiles(
    batchId: number,
    files: FileList,
  ): Promise<ApiResponse<{ uploadedFiles: number; success: boolean }>> {
    try {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const response = await fetch(
        `${API_BASE_URL}/business/bulk-upload/batches/${batchId}/files`,
        {
          method: "POST",
          headers: {
            "X-User-ID": localStorage.getItem("currentUserId") || "demo-user",
          },
          body: formData,
        },
      );

      return await handleResponse<{ uploadedFiles: number; success: boolean }>(
        response,
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload bulk files",
      };
    }
  }

  static async processBulkUploadBatch(
    batchId: number,
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/business/bulk-upload/batches/${batchId}/process`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );

      return await handleResponse<{ success: boolean }>(response);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process bulk upload batch",
      };
    }
  }
}

// Default export
export default BusinessApiService;
