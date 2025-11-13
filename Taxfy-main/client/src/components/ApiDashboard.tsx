import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code, 
  Key, 
  Activity, 
  BarChart3, 
  Copy, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Shield,
  Zap,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  permissions: string[];
  callsThisMonth: number;
  limit: number | "unlimited";
  status: 'active' | 'inactive' | 'revoked';
}

interface ApiUsage {
  endpoint: string;
  calls: number;
  errors: number;
  avgResponseTime: number;
  lastCall: string;
}

interface ApiDashboardProps {
  className?: string;
  enabled?: boolean;
  monthlyLimit?: number | "unlimited";
}

export function ApiDashboard({ 
  className, 
  enabled = false,
  monthlyLimit = 1000 
}: ApiDashboardProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<ApiUsage[]>([]);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const availablePermissions = [
    'tax:calculate',
    'irp5:process',
    'reports:generate',
    'clients:read',
    'clients:write',
    'documents:upload',
    'documents:read'
  ];

  // Sample API keys for demonstration
  useEffect(() => {
    if (enabled) {
      const sampleKeys: ApiKey[] = [
        {
          id: '1',
          name: 'Production API',
          key: 'tx_live_sk_1a2b3c4d5e6f7g8h9i0j',
          created: '2024-01-15',
          lastUsed: '2024-03-15',
          permissions: ['tax:calculate', 'irp5:process', 'reports:generate'],
          callsThisMonth: 847,
          limit: 1000,
          status: 'active'
        },
        {
          id: '2',
          name: 'Development Testing',
          key: 'tx_test_sk_0j9i8h7g6f5e4d3c2b1a',
          created: '2024-02-01',
          lastUsed: '2024-03-10',
          permissions: ['tax:calculate', 'documents:read'],
          callsThisMonth: 234,
          limit: 500,
          status: 'active'
        }
      ];

      const sampleUsage: ApiUsage[] = [
        {
          endpoint: '/api/v1/tax/calculate',
          calls: 1205,
          errors: 12,
          avgResponseTime: 145,
          lastCall: '2024-03-15T10:30:00Z'
        },
        {
          endpoint: '/api/v1/irp5/process',
          calls: 863,
          errors: 5,
          avgResponseTime: 2340,
          lastCall: '2024-03-15T09:45:00Z'
        },
        {
          endpoint: '/api/v1/reports/generate',
          calls: 421,
          errors: 8,
          avgResponseTime: 890,
          lastCall: '2024-03-14T16:20:00Z'
        }
      ];

      setApiKeys(sampleKeys);
      setUsage(sampleUsage);
    }
  }, [enabled]);

  const totalCalls = apiKeys.reduce((sum, key) => sum + key.callsThisMonth, 0);
  const totalLimit = monthlyLimit === "unlimited" ? "unlimited" : monthlyLimit;

  const createApiKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `tx_live_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      permissions: selectedPermissions,
      callsThisMonth: 0,
      limit: monthlyLimit === "unlimited" ? "unlimited" : Math.floor(monthlyLimit / 2),
      status: 'active'
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setSelectedPermissions([]);
    setShowCreateKey(false);
  };

  const revokeKey = (keyId: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? { ...key, status: 'revoked' as const } : key
      ));
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '••••••••••••••••••••' + key.substring(key.length - 4);
  };

  if (!enabled) {
    return (
      <Card className={cn("border-yellow-200 bg-yellow-50/50", className)}>
        <CardContent className="p-6 text-center">
          <Code className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">API Access Not Available</h3>
          <p className="text-muted-foreground mb-4">
            API access is available in Professional and Enterprise plans.
          </p>
          <Button variant="outline">
            Upgrade to Professional
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your API keys and monitor usage
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Professional Feature
          </Badge>
          <Button onClick={() => setShowCreateKey(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create API Key
          </Button>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
                <p className="text-2xl font-bold">{totalCalls.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                {totalLimit === "unlimited" 
                  ? "Unlimited calls" 
                  : `${totalCalls}/${totalLimit} this month`
                }
              </div>
              {totalLimit !== "unlimited" && (
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="bg-primary h-1 rounded-full"
                    style={{ width: `${Math.min((totalCalls / (totalLimit as number)) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Keys</p>
                <p className="text-2xl font-bold text-green-600">
                  {apiKeys.filter(k => k.status === 'active').length}
                </p>
              </div>
              <Key className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(usage.reduce((sum, u) => sum + u.avgResponseTime, 0) / usage.length)}ms
                </p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {((usage.reduce((sum, u) => sum + u.errors, 0) / usage.reduce((sum, u) => sum + u.calls, 0)) * 100).toFixed(1)}%
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{key.name}</h4>
                    <Badge className={cn(
                      key.status === 'active' ? 'bg-green-100 text-green-800' :
                      key.status === 'revoked' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {key.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 font-mono bg-muted px-2 py-1 rounded">
                      <span>
                        {visibleKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-1 h-auto"
                      >
                        {visibleKeys.has(key.id) ? 
                          <EyeOff className="w-3 h-3" /> : 
                          <Eye className="w-3 h-3" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(key.key)}
                        className="p-1 h-auto"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Created: {new Date(key.created).toLocaleDateString()}</span>
                    {key.lastUsed && (
                      <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                    )}
                    <span>
                      Calls: {key.callsThisMonth}
                      {key.limit !== "unlimited" && `/${key.limit}`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {key.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {key.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeKey(key.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {apiKeys.length === 0 && (
              <div className="text-center py-8">
                <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first API key to start using the Taxfy API
                </p>
                <Button onClick={() => setShowCreateKey(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Endpoint Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usage.map((endpoint) => (
              <div key={endpoint.endpoint} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium font-mono">{endpoint.endpoint}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      <span>{endpoint.calls.toLocaleString()} calls</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{endpoint.errors} errors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{endpoint.avgResponseTime}ms avg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RefreshCw className="w-4 h-4" />
                      <span>Last: {new Date(endpoint.lastCall).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {((1 - endpoint.errors / endpoint.calls) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create API Key Modal */}
      {showCreateKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Create New API Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API"
                />
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <label key={permission} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, permission]);
                          } else {
                            setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
                          }
                        }}
                      />
                      <span className="text-sm font-mono">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createApiKey} disabled={!newKeyName.trim()}>
                  Create Key
                </Button>
                <Button variant="outline" onClick={() => setShowCreateKey(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Documentation Link */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">API Documentation</h3>
              <p className="text-muted-foreground mb-4">
                Learn how to integrate Taxfy's powerful tax calculation API into your applications.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
                <Button variant="outline">
                  <Code className="w-4 h-4 mr-2" />
                  Code Examples
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}