import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plug, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Code, 
  Database, 
  Globe, 
  Key,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Download,
  Upload,
  TestTube,
  Zap,
  Building,
  CreditCard,
  Users,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  ShoppingCart,
  Shield,
  Activity,
  Link
} from 'lucide-react';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useAuth } from '@/contexts/AuthContext';
import { IntegrationAPI, Integration } from '@/services/businessApiService';

interface IntegrationEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  authentication: {
    type: 'none' | 'basic' | 'bearer' | 'oauth' | 'api-key';
    credentials: Record<string, string>;
  };
  enabled: boolean;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  lastTriggered?: string;
  deliveryAttempts: number;
  successRate: number;
}

interface DataMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
}

const AVAILABLE_INTEGRATIONS: Partial<Integration>[] = [
  {
    name: 'QuickBooks Online',
    category: 'accounting',
    provider: 'Intuit',
    description: 'Sync tax data with QuickBooks for seamless accounting',
    features: ['Auto-sync transactions', 'Tax category mapping', 'Real-time updates'],
    version: '1.0.0',
    autoSync: true,
    syncFrequency: 'daily'
  },
  {
    name: 'Xero',
    category: 'accounting',
    provider: 'Xero',
    description: 'Connect with Xero accounting software',
    features: ['Bank reconciliation', 'Invoice sync', 'Expense tracking'],
    version: '1.0.0',
    autoSync: true,
    syncFrequency: 'daily'
  },
  {
    name: 'Salesforce',
    category: 'crm',
    provider: 'Salesforce',
    description: 'Integrate customer data and tax information',
    features: ['Customer sync', 'Lead tracking', 'Tax compliance alerts'],
    version: '1.0.0',
    autoSync: true,
    syncFrequency: 'daily'
  },
  {
    name: 'SAP ERP',
    category: 'erp',
    provider: 'SAP',
    description: 'Enterprise resource planning integration',
    features: ['Financial data sync', 'Multi-entity support', 'Advanced reporting'],
    version: '1.0.0',
    autoSync: true,
    syncFrequency: 'daily'
  },
  {
    name: 'Stripe',
    category: 'payroll',
    provider: 'Stripe',
    description: 'Payment processing and tax calculation',
    features: ['Payment sync', 'Tax calculation', 'Revenue tracking'],
    version: '1.0.0',
    autoSync: true,
    syncFrequency: 'daily'
  },
  {
    name: 'Custom API',
    category: 'other',
    provider: 'Custom',
    description: 'Build your own integration with our API',
    features: ['Full API access', 'Custom webhooks', 'Flexible data mapping'],
    version: '1.0.0',
    autoSync: false,
    syncFrequency: 'manual'
  }
];

export default function CustomIntegrations() {
  const { user } = useAuth();
  const { toast } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; responseTime: number }>>({});
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    description: '',
    category: 'accounting' as Integration['category'],
    provider: '',
    config: {},
    syncFrequency: 'daily' as Integration['syncFrequency'],
    autoSync: true,
    baseUrl: '',
    apiKey: ''
  });
  const [connectingIntegration, setConnectingIntegration] = useState<string | null>(null);
  const [disconnectingIntegration, setDisconnectingIntegration] = useState<string | null>(null);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [syncingIntegration, setSyncingIntegration] = useState<string | null>(null);
  const [creatingCustom, setCreatingCustom] = useState(false);
  const [customIntegration, setCustomIntegration] = useState({
    name: '',
    description: '',
    category: 'accounting' as const,
    provider: 'Custom',
    version: '1.0.0',
    features: [] as string[],
    config: {}
  });

  // Load integrations on component mount
  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const response = await IntegrationAPI.getUserIntegrations(user?.id || 'user-id');
      if (response.success) {
        setIntegrations(response.data || []);
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to load integrations',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load integrations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectIntegration = async (integrationTemplate: any) => {
    try {
      setConnectingIntegration(integrationTemplate.id);
      const response = await IntegrationAPI.createIntegration('user-id', {
        name: integrationTemplate.name,
        description: integrationTemplate.description,
        category: integrationTemplate.category,
        provider: integrationTemplate.provider,
        version: integrationTemplate.version,
        features: integrationTemplate.features,
        status: 'inactive',
        autoSync: integrationTemplate.autoSync,
        syncFrequency: 'manual',
        config: {}
      });
      
      if (response.success) {
        toast({
          title: 'Success',
          description: `${integrationTemplate.name} integration created successfully`,
          variant: 'default'
        });
        await loadIntegrations();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create integration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect integration',
        variant: 'destructive'
      });
    } finally {
      setConnectingIntegration(null);
    }
  };

  const handleDisconnectIntegration = async (integration: Integration) => {
    try {
      setDisconnectingIntegration(integration.id);
      const response = await IntegrationAPI.deleteIntegration('user-id', integration.id);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Integration disconnected successfully',
          variant: 'default'
        });
        await loadIntegrations();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to disconnect integration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect integration',
        variant: 'destructive'
      });
    } finally {
      setDisconnectingIntegration(null);
    }
  };

  const testIntegration = async (integrationId: string) => {
    setLoading(true);
    try {
      // Simulate test connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const integration = integrations.find(i => i.id === integrationId);
      if (integration) {
        const updatedIntegration = { ...integration, status: 'active' as Integration['status'] };
        
        if (user?.id) {
          const response = await IntegrationAPI.updateIntegration(user.id, integrationId, { status: 'active' });
          
          if (response.success) {
            setIntegrations(prev => prev.map(i => i.id === integrationId ? updatedIntegration : i));
            toast({
              title: 'Success',
              description: 'Integration test successful',
              variant: 'default'
            });
          } else {
            toast({
              title: 'Error',
              description: response.error || 'Integration test failed',
              variant: 'destructive'
            });
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Integration test failed',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const syncIntegration = async (integrationId: string) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await IntegrationAPI.syncIntegration(user.id, integrationId);
      
      if (response.success) {
        // Update the integration with new sync time
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, lastSync: new Date().toISOString() }
            : integration
        ));
        
        if (selectedIntegration?.id === integrationId) {
          setSelectedIntegration(prev => prev ? { ...prev, lastSync: new Date().toISOString() } : null);
        }
        
        toast({
          title: 'Success',
          description: 'Integration synced successfully',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to sync integration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync integration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateIntegrationConfig = async (integrationId: string, config: Record<string, any>) => {
    if (!user?.id) return;
    
    try {
      const response = await IntegrationAPI.updateIntegration(user.id, integrationId, { config });
      
      if (response.success && response.data) {
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId ? response.data! : integration
        ));
        
        if (selectedIntegration?.id === integrationId) {
          setSelectedIntegration(response.data);
        }
        
        toast({
          title: 'Success',
          description: 'Integration configuration updated',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update configuration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update integration config',
        variant: 'destructive'
      });
    }
  };

  const createCustomIntegration = async () => {
    if (!user?.id || !newIntegration.name || !newIntegration.description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const integrationData: Omit<Integration, 'id' | 'setupDate' | 'userId'> = {
        name: newIntegration.name,
        description: newIntegration.description,
        category: newIntegration.category,
        status: 'pending',
        provider: newIntegration.provider || 'Custom',
        version: '1.0.0',
        config: newIntegration.config,
        features: ['Custom API', 'Webhooks', 'Data Mapping'],
        syncFrequency: newIntegration.syncFrequency,
        autoSync: newIntegration.autoSync
      };

      const response = await IntegrationAPI.createIntegration(user.id, integrationData);
      
      if (response.success && response.data) {
        setIntegrations(prev => [...prev, response.data!]);
        setNewIntegration({
          name: '',
          description: '',
          category: 'accounting',
          provider: '',
          config: {},
          syncFrequency: 'daily',
          autoSync: true,
          baseUrl: '',
          apiKey: ''
        });
        toast({
          title: 'Success',
          description: 'Custom integration created successfully',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create custom integration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create custom integration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Integration['category']) => {
    switch (category) {
      case 'accounting': return <BarChart3 className="h-4 w-4" />;
      case 'crm': return <Users className="h-4 w-4" />;
      case 'erp': return <Building className="h-4 w-4" />;
      case 'payroll': return <CreditCard className="h-4 w-4" />;
      case 'banking': return <CreditCard className="h-4 w-4" />;
      case 'other': return <Code className="h-4 w-4" />;
      default: return <Plug className="h-4 w-4" />;
    }
  };

  const handleTestIntegration = async (integration: Integration) => {
    try {
      setTestingIntegration(integration.id);
      const response = await IntegrationAPI.testIntegration('user-id', integration.id);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Integration test successful',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Integration test failed',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Integration test failed',
        variant: 'destructive'
      });
    } finally {
      setTestingIntegration(null);
    }
  };

  const handleSyncIntegration = async (integration: Integration) => {
    try {
      setSyncingIntegration(integration.id);
      const response = await IntegrationAPI.syncIntegration('user-id', integration.id);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Integration synced successfully',
          variant: 'default'
        });
        await loadIntegrations();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to sync integration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync integration',
        variant: 'destructive'
      });
    } finally {
      setSyncingIntegration(null);
    }
  };

  const handleUpdateConfiguration = async (integrationId: string, config: any) => {
    try {
      const response = await IntegrationAPI.updateIntegration('user-id', integrationId, { config });
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Integration configuration updated',
          variant: 'default'
        });
        await loadIntegrations();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update configuration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update configuration',
        variant: 'destructive'
      });
    }
  };

  const handleCreateCustomIntegration = async () => {
    if (!customIntegration.name || !customIntegration.description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setCreatingCustom(true);
      const response = await IntegrationAPI.createIntegration('user-id', {
        name: customIntegration.name,
        description: customIntegration.description,
        category: 'accounting',
        provider: customIntegration.provider,
        version: customIntegration.version,
        features: customIntegration.features || [],
        status: 'inactive',
        autoSync: false,
        syncFrequency: 'manual',
        config: customIntegration.config
      });
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Custom integration created successfully',
          variant: 'default'
        });
        setCustomIntegration({ name: '', description: '', category: 'accounting', provider: 'Custom', version: '1.0.0', features: [], config: {} });
        await loadIntegrations();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create custom integration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create custom integration',
        variant: 'destructive'
      });
    } finally {
      setCreatingCustom(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Plug className="h-6 w-6 text-primary" />
            Custom Integrations
          </h2>
          <p className="text-muted-foreground">
            Connect your business systems and automate data flow
          </p>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-800">
          Business Plan Exclusive
        </Badge>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="custom">Custom API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {/* Active Integrations */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(integration.category)}</span>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {integration.provider}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>

                  {integration.lastSync && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last sync: {new Date(integration.lastSync).toLocaleString()}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{integration.features.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {integration.status === 'active' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => syncIntegration(integration.id)}
                          disabled={loading}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => testIntegration(integration.id)}
                          disabled={loading}
                        >
                          <TestTube className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedIntegration(integration)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>

                  {testResults[integration.id] && (
                    <div className={`p-2 rounded text-xs ${
                      testResults[integration.id].success 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <div className="flex items-center gap-1">
                        {testResults[integration.id].success ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        Test {testResults[integration.id].success ? 'passed' : 'failed'} 
                        ({testResults[integration.id].responseTime}ms)
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {integrations.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Plug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Integrations Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your first integration to start automating your workflow
                </p>
                <Button onClick={() => {
                  const availableTab = document.querySelector('[value="available"]') as HTMLElement;
                  availableTab?.click();
                }}>
                  Browse Available Integrations
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Available Integrations */}
        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_INTEGRATIONS.map((integration, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(integration.category)}</span>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.provider}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {integration.features?.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleConnectIntegration(integration)}
                    disabled={loading || integrations.some(int => int.name === integration.name)}
                  >
                    {integrations.some(int => int.name === integration.name) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Connected
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom API */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Create Custom Integration
              </CardTitle>
              <CardDescription>
                Build a custom integration using our API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Integration Name</Label>
                  <Input
                    placeholder="My Custom Integration"
                    value={newIntegration.name}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Input
                    placeholder="Your Company"
                    value={newIntegration.provider}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, provider: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what this integration does..."
                  value={newIntegration.description}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base URL</Label>
                  <Input
                    placeholder="https://api.yourcompany.com"
                    value={newIntegration.baseUrl}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, baseUrl: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="relative">
                    <Input
                      type={showSecrets.newApiKey ? 'text' : 'password'}
                      placeholder="Your API key"
                      value={newIntegration.apiKey}
                      onChange={(e) => setNewIntegration(prev => ({ ...prev, apiKey: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => toggleSecret('newApiKey')}
                    >
                      {showSecrets.newApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sync Frequency</Label>
                <Select
                  value={newIntegration.syncFrequency}
                  onValueChange={(value) => setNewIntegration(prev => ({ ...prev, syncFrequency: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={createCustomIntegration} disabled={loading} className="w-full">
                {loading ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Integration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download API Docs
                </Button>
                <Button variant="outline" className="justify-start">
                  <Code className="h-4 w-4 mr-2" />
                  View Code Examples
                </Button>
                <Button variant="outline" className="justify-start">
                  <TestTube className="h-4 w-4 mr-2" />
                  API Testing Tool
                </Button>
                <Button variant="outline" className="justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  Generate API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-4">
          {integrations.filter(int => int.config?.webhooks?.length).map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(integration.category)}</span>
                  {integration.name} Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integration.config?.webhooks?.map((webhook: any) => (
                    <div key={webhook.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{webhook.name}</h4>
                          <p className="text-sm text-muted-foreground">{webhook.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={webhook.enabled ? "default" : "secondary"}>
                            {webhook.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                          <Switch
                            checked={webhook.enabled}
                            onCheckedChange={(checked) => {
                              // Update webhook status
                              setIntegrations(prev => 
                                prev.map(int => 
                                  int.id === integration.id 
                                    ? {
                                        ...int,
                                        config: {
                                          ...int.config,
                                          webhooks: int.config?.webhooks?.map(wh => 
                                            wh.id === webhook.id ? { ...wh, enabled: checked } : wh
                                          )
                                        }
                                      }
                                    : int
                                )
                              );
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-muted-foreground">Events</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {webhook.events.map((event, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Success Rate</Label>
                          <p className="font-medium">{webhook.successRate}%</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Deliveries</Label>
                          <p className="font-medium">{webhook.deliveryAttempts}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Last Triggered</Label>
                          <p className="font-medium">
                            {webhook.lastTriggered 
                              ? new Date(webhook.lastTriggered).toLocaleString()
                              : 'Never'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <TestTube className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Logs
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {!integrations.some(int => int.config?.webhooks?.length) && (
            <Card>
              <CardContent className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Webhooks Configured</h3>
                <p className="text-muted-foreground mb-4">
                  Set up webhooks to receive real-time notifications from your integrations
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Webhook
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Integration Configuration Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span>{getCategoryIcon(selectedIntegration.category)}</span>
                  Configure {selectedIntegration.name}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedIntegration(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuration options would go here */}
              <div className="space-y-4">
                <div>
                  <Label>Sync Frequency</Label>
                  <Select value={selectedIntegration.syncFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedIntegration.status === 'active' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => testIntegration(selectedIntegration.id)}
                      disabled={loading}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => syncIntegration(selectedIntegration.id)}
                      disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        handleDisconnectIntegration(selectedIntegration);
                        setSelectedIntegration(null);
                      }}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 