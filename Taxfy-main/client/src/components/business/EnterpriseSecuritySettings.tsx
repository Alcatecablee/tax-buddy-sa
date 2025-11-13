import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  Users,
  FileText,
  Clock,
  Globe,
  Database,
  Save,
  RefreshCw
} from 'lucide-react';
import { useCustomToast } from '@/hooks/use-custom-toast';

interface SecuritySettings {
  id?: string;
  user_id: string;
  sso_enabled: boolean;
  sso_provider: string;
  sso_domain: string;
  two_factor_required: boolean;
  session_timeout: number;
  ip_whitelist: string[];
  audit_logging: boolean;
  data_encryption: boolean;
  backup_frequency: string;
  compliance_mode: boolean;
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
    expiry_days: number;
  };
  access_controls: {
    role_based_access: boolean;
    department_isolation: boolean;
    data_classification: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  user_id: 'demo-user',
  sso_enabled: false,
  sso_provider: '',
  sso_domain: '',
  two_factor_required: true,
  session_timeout: 480,
  ip_whitelist: [],
  audit_logging: true,
  data_encryption: true,
  backup_frequency: 'daily',
  compliance_mode: true,
  password_policy: {
    min_length: 12,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_symbols: true,
    expiry_days: 90
  },
  access_controls: {
    role_based_access: true,
    department_isolation: true,
    data_classification: true
  }
};

export function EnterpriseSecuritySettings() {
  const { toast } = useCustomToast();
  const [settings, setSettings] = useState<SecuritySettings>(DEFAULT_SECURITY_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState('');

  const saveSecuritySettings = async () => {
    setSaving(true);
    try {
      // Simulate saving to local storage or mock API
      localStorage.setItem('enterprise_security_settings', JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "Your enterprise security settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save security settings:', error);
      toast({
        title: "Error",
        description: "Failed to save security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addIpAddress = () => {
    if (newIpAddress.trim()) {
      updateSetting('ip_whitelist', [...settings.ip_whitelist, newIpAddress.trim()]);
      setNewIpAddress('');
    }
  };

  const removeIpAddress = (ip: string) => {
    updateSetting('ip_whitelist', settings.ip_whitelist.filter(item => item !== ip));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Security Settings</h1>
          <p className="text-muted-foreground">
            Configure advanced security settings for your organization
          </p>
        </div>
        <Button onClick={saveSecuritySettings} disabled={saving}>
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="authentication" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="audit">Audit & Compliance</TabsTrigger>
          <TabsTrigger value="data">Data Protection</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Single Sign-On (SSO)
              </CardTitle>
              <CardDescription>
                Configure SSO integration for seamless authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sso-enabled">Enable SSO</Label>
                <Switch
                  checked={settings.sso_enabled}
                  onCheckedChange={(checked) => updateSetting('sso_enabled', checked)}
                />
              </div>
              
              {settings.sso_enabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sso-provider">SSO Provider</Label>
                    <Select value={settings.sso_provider} onValueChange={(value) => updateSetting('sso_provider', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select SSO provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="azure">Azure AD</SelectItem>
                        <SelectItem value="google">Google Workspace</SelectItem>
                        <SelectItem value="okta">Okta</SelectItem>
                        <SelectItem value="saml">Generic SAML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="sso-domain">SSO Domain</Label>
                    <Input
                      id="sso-domain"
                      value={settings.sso_domain}
                      onChange={(e) => updateSetting('sso_domain', e.target.value)}
                      placeholder="company.com"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Require 2FA for all users in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="2fa-required">Require 2FA for all users</Label>
                <Switch
                  checked={settings.two_factor_required}
                  onCheckedChange={(checked) => updateSetting('two_factor_required', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                IP Whitelist
              </CardTitle>
              <CardDescription>
                Restrict access to specific IP addresses or ranges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newIpAddress}
                  onChange={(e) => setNewIpAddress(e.target.value)}
                  placeholder="192.168.1.0/24 or 203.0.113.1"
                />
                <Button onClick={addIpAddress} variant="outline">
                  Add IP
                </Button>
              </div>
              
              <div className="space-y-2">
                {settings.ip_whitelist.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-mono text-sm">{ip}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIpAddress(ip)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {settings.ip_whitelist.length === 0 && (
                  <p className="text-sm text-muted-foreground">No IP restrictions configured</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Access Controls
              </CardTitle>
              <CardDescription>
                Configure role-based access and department isolation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="rbac">Role-based Access Control</Label>
                <Switch
                  checked={settings.access_controls.role_based_access}
                  onCheckedChange={(checked) => updateSetting('access_controls.role_based_access', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="dept-isolation">Department Isolation</Label>
                <Switch
                  checked={settings.access_controls.department_isolation}
                  onCheckedChange={(checked) => updateSetting('access_controls.department_isolation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="data-classification">Data Classification</Label>
                <Switch
                  checked={settings.access_controls.data_classification}
                  onCheckedChange={(checked) => updateSetting('access_controls.data_classification', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Audit Logging
              </CardTitle>
              <CardDescription>
                Track all user activities and system changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="audit-logging">Enable Audit Logging</Label>
                <Switch
                  checked={settings.audit_logging}
                  onCheckedChange={(checked) => updateSetting('audit_logging', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="compliance-mode">Compliance Mode</Label>
                <Switch
                  checked={settings.compliance_mode}
                  onCheckedChange={(checked) => updateSetting('compliance_mode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Protection
              </CardTitle>
              <CardDescription>
                Configure encryption and backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="data-encryption">Data Encryption</Label>
                <Switch
                  checked={settings.data_encryption}
                  onCheckedChange={(checked) => updateSetting('data_encryption', checked)}
                />
              </div>
              
              <div>
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select value={settings.backup_frequency} onValueChange={(value) => updateSetting('backup_frequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EnterpriseSecuritySettings; 