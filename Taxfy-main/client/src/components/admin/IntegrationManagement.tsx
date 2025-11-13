import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Plug, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Globe,
  Database,
  Cloud,
  Zap,
  Shield,
  Activity,
  Link,
  ExternalLink,
  Copy,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { RealIntegrationAPI, Integration } from '@/services/realApiService';

export function IntegrationManagement() {
  const { user } = useAuth();
  const { toast } = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'api' as Integration['type'],
    description: '',
    endpoint: '',
    apiKey: '',
    config: {}
  });

  // Load data on component mount
  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const response = await RealIntegrationAPI.getIntegrations();
      
      if (response.success) {
        setIntegrations(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to load integrations',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to load integrations',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async () => {
    if (!newIntegration.name || !newIntegration.type) {
      toast({
        title: "Error",
        description: 'Please fill in all required fields',
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await RealIntegrationAPI.createIntegration({
        name: newIntegration.name,
        type: newIntegration.type,
        description: newIntegration.description,
        endpoint: newIntegration.endpoint,
        credentials: { apiKey: newIntegration.apiKey },
        config: newIntegration.config,
        enabled: true,
        syncFrequency: 'daily',
        status: 'inactive'
      });

      if (response.success && response.data) {
        setIntegrations(prev => [response.data!, ...prev]);
        setNewIntegration({
          name: '',
          type: 'api',
          description: '',
          endpoint: '',
          apiKey: '',
          config: {}
        });
        toast({
          title: "Success",
          description: 'Integration created successfully',
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to create integration',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to create integration:', error);
      toast({
        title: "Error",
        description: 'Failed to create integration',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateIntegration = async (integration: Integration) => {
    setLoading(true);
    try {
      const response = await RealIntegrationAPI.updateIntegration(integration.id, {
        name: integration.name,
        description: integration.description,
        endpoint: integration.endpoint,
        credentials: { apiKey: integration.credentials?.apiKey || '' },
        config: integration.config,
        enabled: integration.enabled
      });

      if (response.success && response.data) {
        setIntegrations(prev => prev.map(i => i.id === integration.id ? response.data! : i));
        setSelectedIntegration(response.data);
        setIsEditing(false);
        toast({
          title: "Success",
          description: 'Integration updated successfully',
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to update integration',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to update integration:', error);
      toast({
        title: "Error",
        description: 'Failed to update integration',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteIntegration = async (integrationId: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return;

    setLoading(true);
    try {
      const response = await RealIntegrationAPI.deleteIntegration(integrationId);

      if (response.success) {
        setIntegrations(prev => prev.filter(i => i.id !== integrationId));
        if (selectedIntegration?.id === integrationId) {
          setSelectedIntegration(null);
        }
        toast({
          title: "Success",
          description: 'Integration deleted successfully',
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to delete integration',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to delete integration:', error);
      toast({
        title: "Error",
        description: 'Failed to delete integration',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (integrationId: string) => {
    setLoading(true);
    try {
      const response = await RealIntegrationAPI.testIntegration(integrationId);

      if (response.success) {
        toast({
          title: "Success",
          description: 'Integration test successful',
          variant: "default"
        });
        // Refresh integrations to get updated status
        await loadIntegrations();
      } else {
        toast({
          title: "Error",
          description: response.error || 'Integration test failed',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to test integration:', error);
      toast({
        title: "Error",
        description: 'Failed to test integration',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const syncIntegration = async (integrationId: string) => {
    setLoading(true);
    try {
      const response = await RealIntegrationAPI.syncIntegration(integrationId);

      if (response.success) {
        toast({
          title: "Success",
          description: 'Integration sync completed',
          variant: "default"
        });
        // Refresh integrations to get updated sync status
        await loadIntegrations();
      } else {
        toast({
          title: "Error",
          description: response.error || 'Integration sync failed',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to sync integration:', error);
      toast({
        title: "Error",
        description: 'Failed to sync integration',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleApiKeyVisibility = (integrationId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Success",
      description: 'Copied to clipboard',
      variant: "default"
    });
  };

  // ... existing code ...
} 