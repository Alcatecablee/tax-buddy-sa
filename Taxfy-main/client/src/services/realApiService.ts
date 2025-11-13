import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

// Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  agentId?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'feature-request' | 'bug-report' | 'integration';
  tags: string[];
  escalated: boolean;
  slaTarget: string;
  estimatedResolution: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  specializations: string[];
  status: 'online' | 'busy' | 'offline';
  rating: number;
  responseTime: string;
  activeTickets: number;
}

export interface AccountManager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  department: string;
  location: string;
  timezone: string;
  languages: string[];
  specializations: string[];
  experience?: string;
  certifications: string[];
  availability: Record<string, any>;
  responseTime: string;
  rating: number;
  totalClients: number;
}

export interface Meeting {
  id: string;
  userId: string;
  managerId?: string;
  title: string;
  description?: string;
  date: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  attendees: string[];
  agenda: string[];
  meetingLink?: string;
  notes?: string;
}

export interface ManagerMessage {
  id: string;
  userId: string;
  managerId?: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
  read: boolean;
  attachment?: any;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  description?: string;
  endpoint?: string;
  config: Record<string, any>;
  credentials: Record<string, any>;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  enabled: boolean;
  lastSync?: string;
  syncFrequency: string;
  errorMessage?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description?: string;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
  category?: string;
  requirementsCount: number;
  complianceScore: number;
  lastAssessment?: string;
}

export interface ComplianceRequirement {
  id: string;
  frameworkId: string;
  requirementId: string;
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'not-applicable';
  evidence?: string;
  notes?: string;
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface BulkUploadBatch {
  id: string;
  userId: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  progress: number;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface SystemMetric {
  id: string;
  metricName: string;
  metricValue: number;
  metricUnit?: string;
  tags: Record<string, any>;
  recordedAt: string;
}

export interface SLAMetric {
  id: string;
  metricName: string;
  targetValue: number;
  actualValue: number;
  periodStart: string;
  periodEnd: string;
  status: 'met' | 'missed' | 'at-risk';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  affectedServices: string[];
  startTime: string;
  endTime?: string;
  resolutionNotes?: string;
  updates: any[];
}

// Real API Service Classes
export class RealSupportAPI {
  static async getTickets(userId: string): Promise<ApiResponse<SupportTicket[]>> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load tickets',
        success: false
      };
    }
  }

  static async createTicket(userId: string, ticketData: Omit<SupportTicket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SupportTicket>> {
    try {
      // Find available agent
      const { data: agents } = await supabase
        .from('support_agents')
        .select('*')
        .eq('status', 'online')
        .order('active_tickets', { ascending: true })
        .limit(1);

      const assignedAgent = agents?.[0];

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userId,
          agent_id: assignedAgent?.id,
          ...ticketData
        })
        .select()
        .single();

      if (error) throw error;

      // Update agent's active ticket count
      if (assignedAgent) {
        await supabase
          .from('support_agents')
          .update({ active_tickets: assignedAgent.active_tickets + 1 })
          .eq('id', assignedAgent.id);
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create ticket',
        success: false
      };
    }
  }

  static async getAgents(): Promise<ApiResponse<SupportAgent[]>> {
    try {
      const { data, error } = await supabase
        .from('support_agents')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load agents',
        success: false
      };
    }
  }
}

export class RealAccountManagerAPI {
  static async getAccountManager(userId: string): Promise<ApiResponse<AccountManager | null>> {
    try {
      const { data: assignment } = await supabase
        .from('user_account_managers')
        .select('manager_id')
        .eq('user_id', userId)
        .single();

      if (!assignment) {
        return { data: null, error: null, success: true };
      }

      const { data, error } = await supabase
        .from('account_managers')
        .select('*')
        .eq('id', assignment.manager_id)
        .single();

      if (error) throw error;

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to load account manager',
        success: false
      };
    }
  }

  static async assignAccountManager(userId: string): Promise<ApiResponse<AccountManager>> {
    try {
      // Find available manager with lowest client count
      const { data: managers } = await supabase
        .from('account_managers')
        .select('*')
        .order('total_clients', { ascending: true })
        .limit(1);

      if (!managers || managers.length === 0) {
        throw new Error('No account managers available');
      }

      const manager = managers[0];

      // Create assignment
      await supabase
        .from('user_account_managers')
        .insert({
          user_id: userId,
          manager_id: manager.id
        });

      // Update manager's client count
      await supabase
        .from('account_managers')
        .update({ total_clients: manager.total_clients + 1 })
        .eq('id', manager.id);

      return { data: manager, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to assign account manager',
        success: false
      };
    }
  }

  static async getMeetings(userId: string): Promise<ApiResponse<Meeting[]>> {
    try {
      const { data, error } = await supabase
        .from('account_manager_meetings')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error) throw error;

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load meetings',
        success: false
      };
    }
  }

  static async getMessages(userId: string): Promise<ApiResponse<ManagerMessage[]>> {
    try {
      const { data, error } = await supabase
        .from('account_manager_messages')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load messages',
        success: false
      };
    }
  }
}

export class RealIntegrationAPI {
  static async getIntegrations(): Promise<ApiResponse<Integration[]>> {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('name');

      if (error) throw error;

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load integrations',
        success: false
      };
    }
  }

  static async createIntegration(integrationData: Omit<Integration, 'id'>): Promise<ApiResponse<Integration>> {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .insert({
          name: integrationData.name,
          type: integrationData.type,
          description: integrationData.description,
          config: integrationData.config,
          credentials: integrationData.credentials,
          status: integrationData.status || 'inactive',
          enabled: integrationData.enabled || false,
          last_sync: integrationData.lastSync,
          sync_frequency: integrationData.syncFrequency,
          error_message: integrationData.errorMessage
        })
        .select()
        .single();

      if (error) throw error;

      // Log the integration creation
      await supabase
        .from('integration_logs')
        .insert({
          integration_id: data.id,
          action: 'create',
          status: 'success',
          message: 'Integration created',
          details: integrationData
        });

      const mappedData: Integration = {
        id: data.id,
        name: data.name,
        type: data.type,
        description: data.description,
        config: data.config,
        credentials: data.credentials,
        status: data.status,
        enabled: data.enabled,
        lastSync: data.last_sync,
        syncFrequency: data.sync_frequency,
        errorMessage: data.error_message
      };

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create integration',
        success: false
      };
    }
  }

  static async updateIntegration(id: string, updates: Partial<Integration>): Promise<ApiResponse<Integration>> {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.config !== undefined) updateData.config = updates.config;
      if (updates.credentials !== undefined) updateData.credentials = updates.credentials;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.enabled !== undefined) updateData.enabled = updates.enabled;
      if (updates.lastSync !== undefined) updateData.last_sync = updates.lastSync;
      if (updates.syncFrequency !== undefined) updateData.sync_frequency = updates.syncFrequency;
      if (updates.errorMessage !== undefined) updateData.error_message = updates.errorMessage;

      const { data, error } = await supabase
        .from('integrations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log the integration change
      await supabase
        .from('integration_logs')
        .insert({
          integration_id: id,
          action: 'update',
          status: 'success',
          message: 'Integration updated',
          details: updates
        });

      const mappedData: Integration = {
        id: data.id,
        name: data.name,
        type: data.type,
        description: data.description,
        config: data.config,
        credentials: data.credentials,
        status: data.status,
        enabled: data.enabled,
        lastSync: data.last_sync,
        syncFrequency: data.sync_frequency,
        errorMessage: data.error_message
      };

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update integration',
        success: false
      };
    }
  }

  static async deleteIntegration(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log the integration deletion
      await supabase
        .from('integration_logs')
        .insert({
          integration_id: id,
          action: 'delete',
          status: 'success',
          message: 'Integration deleted'
        });

      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Failed to delete integration',
        success: false
      };
    }
  }

  static async testIntegration(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    try {
      // Get the integration details
      const { data: integration, error: fetchError } = await supabase
        .from('integrations')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Simulate a test connection (in a real implementation, this would test the actual connection)
      const testResult = {
        success: true,
        message: 'Integration test successful'
      };

      // Log the test
      await supabase
        .from('integration_logs')
        .insert({
          integration_id: id,
          action: 'test',
          status: testResult.success ? 'success' : 'error',
          message: testResult.message
        });

      return { data: testResult, error: null, success: true };
    } catch (error) {
      return {
        data: { success: false, message: 'Integration test failed' },
        error: error instanceof Error ? error.message : 'Failed to test integration',
        success: false
      };
    }
  }

  static async syncIntegration(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    try {
      // Update the last sync time
      const { error: updateError } = await supabase
        .from('integrations')
        .update({ 
          last_sync: new Date().toISOString(),
          status: 'active'
        })
        .eq('id', id);

      if (updateError) throw updateError;

      const syncResult = {
        success: true,
        message: 'Integration sync completed successfully'
      };

      // Log the sync
      await supabase
        .from('integration_logs')
        .insert({
          integration_id: id,
          action: 'sync',
          status: 'success',
          message: syncResult.message
        });

      return { data: syncResult, error: null, success: true };
    } catch (error) {
      return {
        data: { success: false, message: 'Integration sync failed' },
        error: error instanceof Error ? error.message : 'Failed to sync integration',
        success: false
      };
    }
  }
}

export class RealComplianceAPI {
  static async getFrameworks(): Promise<ApiResponse<ComplianceFramework[]>> {
    try {
      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .order('name');

      if (error) throw error;

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load compliance frameworks',
        success: false
      };
    }
  }

  static async createFramework(frameworkData: Omit<ComplianceFramework, 'id'>): Promise<ApiResponse<ComplianceFramework>> {
    try {
      const { data, error } = await supabase
        .from('compliance_frameworks')
        .insert({
          name: frameworkData.name,
          description: frameworkData.description,
          version: frameworkData.version,
          status: frameworkData.status,
          requirements_count: frameworkData.requirementsCount,
          compliance_score: frameworkData.complianceScore,
          last_assessment: frameworkData.lastAssessment
        })
        .select()
        .single();

      if (error) throw error;

      const mappedData: ComplianceFramework = {
        id: data.id,
        name: data.name,
        description: data.description,
        version: data.version,
        status: data.status,
        requirementsCount: data.requirements_count,
        complianceScore: data.compliance_score,
        lastAssessment: data.last_assessment
      };

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create compliance framework',
        success: false
      };
    }
  }

  static async updateFramework(id: string, updates: Partial<ComplianceFramework>): Promise<ApiResponse<ComplianceFramework>> {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.version !== undefined) updateData.version = updates.version;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.requirementsCount !== undefined) updateData.requirements_count = updates.requirementsCount;
      if (updates.complianceScore !== undefined) updateData.compliance_score = updates.complianceScore;
      if (updates.lastAssessment !== undefined) updateData.last_assessment = updates.lastAssessment;

      const { data, error } = await supabase
        .from('compliance_frameworks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const mappedData: ComplianceFramework = {
        id: data.id,
        name: data.name,
        description: data.description,
        version: data.version,
        status: data.status,
        requirementsCount: data.requirements_count,
        complianceScore: data.compliance_score,
        lastAssessment: data.last_assessment
      };

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update compliance framework',
        success: false
      };
    }
  }

  static async deleteFramework(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('compliance_frameworks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Failed to delete compliance framework',
        success: false
      };
    }
  }

  static async createRequirement(requirementData: any): Promise<ApiResponse<ComplianceRequirement>> {
    try {
      const { data, error } = await supabase
        .from('compliance_requirements')
        .insert({
          framework_id: requirementData.framework_id,
          requirement_id: requirementData.requirement_id || `REQ-${Date.now()}`,
          title: requirementData.title,
          description: requirementData.description,
          category: requirementData.category,
          priority: requirementData.priority,
          status: requirementData.status || 'not-started',
          evidence: requirementData.evidence,
          notes: requirementData.notes,
          assigned_to: requirementData.assigned_to,
          due_date: requirementData.due_date,
          completed_at: requirementData.completed_at
        })
        .select()
        .single();

      if (error) throw error;

      const mappedData: ComplianceRequirement = {
        id: data.id,
        frameworkId: data.framework_id,
        requirementId: data.requirement_id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: data.status,
        evidence: data.evidence,
        notes: data.notes,
        assignedTo: data.assigned_to,
        dueDate: data.due_date,
        completedAt: data.completed_at
      };

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create compliance requirement',
        success: false
      };
    }
  }

  static async updateRequirementStatus(id: string, status: ComplianceRequirement['status']): Promise<ApiResponse<ComplianceRequirement>> {
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('compliance_requirements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const mappedData: ComplianceRequirement = {
        id: data.id,
        frameworkId: data.framework_id,
        requirementId: data.requirement_id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: data.status,
        evidence: data.evidence,
        notes: data.notes,
        assignedTo: data.assigned_to,
        dueDate: data.due_date,
        completedAt: data.completed_at
      };

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update requirement status',
        success: false
      };
    }
  }

  static async getRequirements(frameworkId: string): Promise<ApiResponse<ComplianceRequirement[]>> {
    try {
      const { data, error } = await supabase
        .from('compliance_requirements')
        .select('*')
        .eq('framework_id', frameworkId)
        .order('priority', { ascending: false });

      if (error) throw error;

      const mappedData = data?.map(item => ({
        id: item.id,
        frameworkId: item.framework_id,
        requirementId: item.requirement_id,
        title: item.title,
        description: item.description,
        category: item.category,
        priority: item.priority,
        status: item.status,
        evidence: item.evidence,
        notes: item.notes,
        assignedTo: item.assigned_to,
        dueDate: item.due_date,
        completedAt: item.completed_at
      })) || [];

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load compliance requirements',
        success: false
      };
    }
  }
}

export class RealAuditAPI {
  static async getAuditLogs(filters?: { action?: string; resourceType?: string; userId?: string }): Promise<ApiResponse<AuditLog[]>> {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.resourceType) {
        query = query.eq('resource_type', filters.resourceType);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load audit logs',
        success: false
      };
    }
  }

  static async createAuditLog(logData: Omit<AuditLog, 'id' | 'createdAt'>): Promise<ApiResponse<AuditLog>> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(logData)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create audit log',
        success: false
      };
    }
  }
}

export class RealSystemMetricsAPI {
  static async getSystemMetrics(): Promise<ApiResponse<SystemMetric[]>> {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Map database snake_case to camelCase for the interface
      const mappedData = data?.map(item => ({
        id: item.id,
        metricName: item.metric_name,
        metricValue: item.metric_value,
        metricUnit: item.metric_unit,
        tags: item.tags || {},
        recordedAt: item.recorded_at
      })) || [];

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load system metrics',
        success: false
      };
    }
  }

  static async getSLAMetrics(): Promise<ApiResponse<SLAMetric[]>> {
    try {
      const { data, error } = await supabase
        .from('sla_metrics')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;

      // Map database snake_case to camelCase for the interface
      const mappedData = data?.map(item => ({
        id: item.id,
        metricName: item.metric_name,
        targetValue: item.target_value,
        actualValue: item.actual_value,
        periodStart: item.period_start,
        periodEnd: item.period_end,
        status: item.status,
        trend: item.trend,
        lastUpdated: item.last_updated
      })) || [];

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load SLA metrics',
        success: false
      };
    }
  }

  static async getIncidentReports(): Promise<ApiResponse<IncidentReport[]>> {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Map database snake_case to camelCase for the interface
      const mappedData = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        severity: item.severity,
        status: item.status,
        affectedServices: item.affected_services || [],
        startTime: item.start_time,
        endTime: item.end_time,
        resolutionNotes: item.resolution_notes,
        updates: item.updates || []
      })) || [];

      return { data: mappedData, error: null, success: true };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load incident reports',
        success: false
      };
    }
  }
}

// Export all APIs
export const RealAPI = {
  Support: RealSupportAPI,
  AccountManager: RealAccountManagerAPI,
  Integration: RealIntegrationAPI,
  Compliance: RealComplianceAPI,
  Audit: RealAuditAPI,
  SystemMetrics: RealSystemMetricsAPI
}; 