import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Palette, 
  Download, 
  Eye, 
  Upload, 
  Settings, 
  FileText, 
  Image as ImageIcon,
  Crown,
  Sparkles,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BrandingSettings {
  companyName: string;
  companyLogo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  headerText: string;
  footerText: string;
  showTaxfyBranding: boolean;
  reportTemplate: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  features: string[];
}

export function WhiteLabelReports() {
  const { profile, canAccessFeature } = useAuth();
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    companyName: profile?.firm_name || '',
    companyLogo: '',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#10b981',
    fontFamily: 'Inter',
    headerText: 'Professional Tax Report',
    footerText: 'Prepared by certified tax professionals',
    showTaxfyBranding: true,
    reportTemplate: 'professional',
    contactInfo: {
      email: profile?.email || '',
      phone: '',
      address: '',
      website: ''
    }
  });

  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, modern design perfect for client presentations',
      preview: '/api/placeholder/400/300',
      features: ['Executive Summary', 'Detailed Breakdown', 'Recommendations', 'Charts & Graphs']
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Formal corporate style with comprehensive analysis',
      preview: '/api/placeholder/400/300',
      features: ['Cover Page', 'Table of Contents', 'Detailed Analysis', 'Appendices']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, clean layout focusing on key information',
      preview: '/api/placeholder/400/300',
      features: ['Key Metrics', 'Summary Tables', 'Clean Typography', 'Compact Layout']
    },
    {
      id: 'detailed',
      name: 'Detailed',
      description: 'Comprehensive report with extensive documentation',
      preview: '/api/placeholder/400/300',
      features: ['Full Documentation', 'Supporting Evidence', 'Calculations', 'References']
    }
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Roboto', label: 'Roboto (Clean)' },
    { value: 'Open Sans', label: 'Open Sans (Friendly)' },
    { value: 'Lato', label: 'Lato (Professional)' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro (Corporate)' }
  ];

  const updateBrandingSetting = (key: keyof BrandingSettings, value: any) => {
    setBrandingSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateContactInfo = (key: keyof BrandingSettings['contactInfo'], value: string) => {
    setBrandingSettings(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [key]: value
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateBrandingSetting('companyLogo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveBrandingSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, save to backend
      console.log('Saving branding settings:', brandingSettings);
    } catch (error) {
      console.error('Failed to save branding settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateSampleReport = () => {
    // In real app, this would generate a sample report with current branding
    console.log('Generating sample report with branding:', brandingSettings);
  };

  if (!canAccessFeature('white_label')) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            White-Label Reports - Pro Feature
          </CardTitle>
          <CardDescription>
            Custom branded reports are available with Pro plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Create professional, branded tax reports with your company logo, colors, and styling.
          </p>
          <Button>Upgrade to Pro</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">White-Label Reports</h2>
          <p className="text-muted-foreground">
            Customize your tax reports with your brand identity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button onClick={generateSampleReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Sample
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={brandingSettings.companyName}
                    onChange={(e) => updateBrandingSetting('companyName', e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-logo">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    {brandingSettings.companyLogo && (
                      <img 
                        src={brandingSettings.companyLogo} 
                        alt="Company Logo" 
                        className="h-16 w-16 object-contain border rounded"
                      />
                    )}
                    <div>
                      <Input
                        id="company-logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('company-logo')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 2MB. Recommended: 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header-text">Report Header Text</Label>
                  <Input
                    id="header-text"
                    value={brandingSettings.headerText}
                    onChange={(e) => updateBrandingSetting('headerText', e.target.value)}
                    placeholder="Professional Tax Report"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footer-text">Report Footer Text</Label>
                  <Textarea
                    id="footer-text"
                    value={brandingSettings.footerText}
                    onChange={(e) => updateBrandingSetting('footerText', e.target.value)}
                    placeholder="Prepared by certified tax professionals"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  This information will appear on your reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={brandingSettings.contactInfo.email}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
                    placeholder="contact@yourfirm.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    value={brandingSettings.contactInfo.phone}
                    onChange={(e) => updateContactInfo('phone', e.target.value)}
                    placeholder="+27670494876"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-address">Address</Label>
                  <Textarea
                    id="contact-address"
                    value={brandingSettings.contactInfo.address}
                    onChange={(e) => updateContactInfo('address', e.target.value)}
                    placeholder="123 Business Street, Johannesburg, 2000"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-website">Website</Label>
                  <Input
                    id="contact-website"
                    value={brandingSettings.contactInfo.website}
                    onChange={(e) => updateContactInfo('website', e.target.value)}
                    placeholder="https://yourfirm.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Color Scheme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Scheme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={brandingSettings.primaryColor}
                        onChange={(e) => updateBrandingSetting('primaryColor', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={brandingSettings.primaryColor}
                        onChange={(e) => updateBrandingSetting('primaryColor', e.target.value)}
                        placeholder="#2563eb"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={brandingSettings.secondaryColor}
                        onChange={(e) => updateBrandingSetting('secondaryColor', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={brandingSettings.secondaryColor}
                        onChange={(e) => updateBrandingSetting('secondaryColor', e.target.value)}
                        placeholder="#64748b"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={brandingSettings.accentColor}
                        onChange={(e) => updateBrandingSetting('accentColor', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={brandingSettings.accentColor}
                        onChange={(e) => updateBrandingSetting('accentColor', e.target.value)}
                        placeholder="#10b981"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography & Options */}
            <Card>
              <CardHeader>
                <CardTitle>Typography & Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select 
                    value={brandingSettings.fontFamily} 
                    onValueChange={(value) => updateBrandingSetting('fontFamily', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Taxfy Branding</Label>
                    <p className="text-sm text-muted-foreground">
                      Include "Powered by Taxfy" in footer
                    </p>
                  </div>
                  <Switch
                    checked={brandingSettings.showTaxfyBranding}
                    onCheckedChange={(checked) => updateBrandingSetting('showTaxfyBranding', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveBrandingSettings} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Branding Settings
            </Button>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Choose a template that best fits your professional needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all ${
                      brandingSettings.reportTemplate === template.id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => updateBrandingSetting('reportTemplate', template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {brandingSettings.reportTemplate === template.id && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {template.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                Preview how your branded reports will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 bg-card text-foreground min-h-[600px]">
                {/* Mock Report Preview */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-4">
                      {brandingSettings.companyLogo && (
                        <img 
                          src={brandingSettings.companyLogo} 
                          alt="Company Logo" 
                          className="h-12 w-12 object-contain"
                        />
                      )}
                      <div>
                        <h1 className="text-2xl font-bold" style={{ color: brandingSettings.primaryColor }}>
                          {brandingSettings.companyName || 'Your Company Name'}
                        </h1>
                        <p className="text-sm text-muted-foreground">{brandingSettings.headerText}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Report Date: {new Date().toLocaleDateString()}</p>
                      <p>Tax Year: 2024</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: brandingSettings.primaryColor }}>
                      Tax Calculation Summary
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-border rounded" style={{ borderColor: brandingSettings.secondaryColor }}>
                        <h3 className="font-medium">Total Income</h3>
                        <p className="text-2xl font-bold" style={{ color: brandingSettings.accentColor }}>
                          R 450,000
                        </p>
                      </div>
                      <div className="p-4 border border-border rounded" style={{ borderColor: brandingSettings.secondaryColor }}>
                        <h3 className="font-medium">Tax Payable</h3>
                        <p className="text-2xl font-bold" style={{ color: brandingSettings.primaryColor }}>
                          R 85,500
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Deductions</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Medical Aid Contributions</span>
                          <span>R 24,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Retirement Annuity</span>
                          <span>R 36,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Travel Allowance</span>
                          <span>R 15,000</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border pt-4 mt-8">
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-muted-foreground">
                        <p>{brandingSettings.footerText}</p>
                        <div className="mt-2 space-y-1">
                          {brandingSettings.contactInfo.email && (
                            <p>Email: {brandingSettings.contactInfo.email}</p>
                          )}
                          {brandingSettings.contactInfo.phone && (
                            <p>Phone: {brandingSettings.contactInfo.phone}</p>
                          )}
                          {brandingSettings.contactInfo.website && (
                            <p>Web: {brandingSettings.contactInfo.website}</p>
                          )}
                        </div>
                      </div>
                      {brandingSettings.showTaxfyBranding && (
                        <div className="text-xs text-muted-foreground/60">
                          Powered by Taxfy
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 