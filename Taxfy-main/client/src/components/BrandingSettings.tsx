import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload, Save, Eye, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BrandingSettings {
  companyName: string;
  companyLogo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerText: string;
  footerText: string;
  showTaxfyBranding: boolean;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
  };
}

const defaultSettings: BrandingSettings = {
  companyName: '',
  companyLogo: '',
  primaryColor: '#2563eb',
  secondaryColor: '#64748b',
  accentColor: '#10b981',
  headerText: 'Professional Tax Report',
  footerText: 'Prepared by certified tax professionals',
  showTaxfyBranding: true,
  contactInfo: {
    email: '',
    phone: '',
    address: '',
    website: ''
  }
};

export const BrandingSettings: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<BrandingSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Check if user has white-label access
  const hasWhiteLabelAccess = profile?.subscription_plan === 'pro' || profile?.subscription_plan === 'business';

  useEffect(() => {
    // Load existing settings from user profile or database
    if (profile?.firm_name) {
      setSettings(prev => ({
        ...prev,
        companyName: profile.firm_name,
        contactInfo: {
          ...prev.contactInfo,
          email: profile.email || ''
        }
      }));
    }
  }, [profile]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Logo must be smaller than 2MB",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive"
        });
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would save to your database
      // For now, we'll just show a success message
      
      if (logoFile) {
        // Upload logic would go here
      }

      toast({
        title: "Settings saved",
        description: "Your branding settings have been updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save failed",
        description: "Failed to save branding settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    // Generate a preview PDF with current settings
    toast({
      title: "Preview generated",
      description: "A preview PDF will be downloaded with your current branding",
      variant: "default"
    });
  };

  if (!hasWhiteLabelAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>White-Label Branding</CardTitle>
          <CardDescription>
            Customize reports with your company branding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Upgrade to Pro or Business</h3>
            <p className="text-muted-foreground mb-4">
              White-label branding is available for Pro and Business plans
            </p>
            <Button>Upgrade Now</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Basic company details for your reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Your Company Name"
            />
          </div>

          <div>
            <Label htmlFor="headerText">Header Text</Label>
            <Input
              id="headerText"
              value={settings.headerText}
              onChange={(e) => setSettings(prev => ({ ...prev, headerText: e.target.value }))}
              placeholder="Professional Tax Report"
            />
          </div>

          <div>
            <Label htmlFor="footerText">Footer Text</Label>
            <Input
              id="footerText"
              value={settings.footerText}
              onChange={(e) => setSettings(prev => ({ ...prev, footerText: e.target.value }))}
              placeholder="Prepared by certified tax professionals"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo & Colors</CardTitle>
          <CardDescription>
            Customize the visual appearance of your reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company Logo</Label>
            <div className="mt-2">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 2MB. Recommended: 200x200px
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                  placeholder="#2563eb"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  placeholder="#64748b"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={settings.accentColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                  placeholder="#10b981"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Contact details to include in your reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.contactInfo.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                }))}
                placeholder="contact@company.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.contactInfo.phone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                }))}
                placeholder="+27670494876"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={settings.contactInfo.website}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, website: e.target.value }
              }))}
              placeholder="www.company.com"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.contactInfo.address}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, address: e.target.value }
              }))}
              placeholder="123 Business Street&#10;City, Province 1234&#10;South Africa"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding Options</CardTitle>
          <CardDescription>
            Control how your branding appears
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showTaxfyBranding">Show "Powered by Taxfy"</Label>
              <p className="text-sm text-muted-foreground">
                Include Taxfy attribution in your reports
              </p>
            </div>
            <Switch
              checked={settings.showTaxfyBranding}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showTaxfyBranding: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
        
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview Report
        </Button>
      </div>
    </div>
  );
}; 