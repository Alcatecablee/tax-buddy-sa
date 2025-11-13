import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Layers,
  Palette,
  Globe,
  Settings,
  Download,
  Upload,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  Shield,
  Users,
  BarChart3,
  Crown,
  Sparkles,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  Link as LinkIcon,
  Copy,
  Save,
  RefreshCw,
  ExternalLink,
  Package,
  Target,
  Award,
  Star,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react";

interface WhiteLabelConfig {
  branding: {
    companyName: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    font: string;
    favicon: string;
  };
  domain: {
    customDomain: string;
    subdomain: string;
    sslEnabled: boolean;
    cdnEnabled: boolean;
  };
  features: {
    taxCalculation: boolean;
    documentUpload: boolean;
    reporting: boolean;
    apiAccess: boolean;
    mobileApp: boolean;
    customWorkflows: boolean;
  };
  customization: {
    loginPage: string;
    dashboard: string;
    emailTemplates: string;
    mobileTheme: string;
  };
}

interface WhiteLabelPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  setupFee: number;
  features: string[];
  customizations: string[];
  support: string;
  sla: string;
  apiCalls: number | "unlimited";
  users: number | "unlimited";
}

interface PreviewDevice {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  width: number;
  height: number;
}

export default function WhiteLabelPlatform() {
  const [selectedPackage, setSelectedPackage] = useState("enterprise");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [isDeploying, setIsDeploying] = useState(false);

  // Mock white-label configuration
  const whiteLabelConfig: WhiteLabelConfig = {
    branding: {
      companyName: "Premier Financial Solutions",
      logo: "/api/placeholder/200/60",
      primaryColor: "#1E40AF",
      secondaryColor: "#3B82F6",
      accentColor: "#10B981",
      font: "Inter",
      favicon: "/api/placeholder/32/32",
    },
    domain: {
      customDomain: "tax.premierfinancial.com",
      subdomain: "premier-financial",
      sslEnabled: true,
      cdnEnabled: true,
    },
    features: {
      taxCalculation: true,
      documentUpload: true,
      reporting: true,
      apiAccess: true,
      mobileApp: true,
      customWorkflows: true,
    },
    customization: {
      loginPage: "custom",
      dashboard: "custom",
      emailTemplates: "custom",
      mobileTheme: "custom",
    },
  };

  const packages: WhiteLabelPackage[] = [
    {
      id: "starter",
      name: "White-Label Starter",
      description: "Basic white-label solution for small to medium businesses",
      price: 15000,
      setupFee: 50000,
      features: [
        "Custom branding and logo",
        "Subdomain hosting",
        "Basic tax calculation engine",
        "Standard reporting",
        "Email support",
      ],
      customizations: [
        "Logo and color scheme",
        "Basic theme customization",
        "Standard email templates",
      ],
      support: "Email support (48h response)",
      sla: "99.5% uptime",
      apiCalls: 10000,
      users: 100,
    },
    {
      id: "professional",
      name: "White-Label Professional",
      description: "Advanced white-label solution with enhanced features",
      price: 25000,
      setupFee: 75000,
      features: [
        "Full custom branding",
        "Custom domain hosting",
        "Advanced tax calculation",
        "Custom reporting dashboard",
        "Priority support",
        "Mobile app branding",
      ],
      customizations: [
        "Complete UI customization",
        "Custom workflows",
        "Branded email templates",
        "Mobile app themes",
      ],
      support: "Priority support (24h response)",
      sla: "99.9% uptime",
      apiCalls: 50000,
      users: 500,
    },
    {
      id: "enterprise",
      name: "White-Label Enterprise",
      description: "Complete white-label platform with full customization",
      price: 50000,
      setupFee: 150000,
      features: [
        "Complete platform ownership",
        "Dedicated infrastructure",
        "Custom feature development",
        "Advanced analytics",
        "Dedicated support team",
        "White-glove implementation",
      ],
      customizations: [
        "Full platform customization",
        "Custom integrations",
        "Bespoke features",
        "Custom API endpoints",
      ],
      support: "Dedicated support team (4h response)",
      sla: "99.99% uptime",
      apiCalls: "unlimited",
      users: "unlimited",
    },
  ];

  const previewDevices: PreviewDevice[] = [
    { id: "desktop", name: "Desktop", icon: Monitor, width: 1200, height: 800 },
    { id: "tablet", name: "Tablet", icon: Tablet, width: 768, height: 1024 },
    { id: "mobile", name: "Mobile", icon: Smartphone, width: 375, height: 667 },
  ];

  const deployPlatform = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  White-Label Platform
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    Enterprise Elite
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  Complete white-label tax platform with full customization and
                  branding
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Live Preview
              </Button>
              <Button onClick={deployPlatform} disabled={isDeploying}>
                {isDeploying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Deploy Platform
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Deployment Status */}
      {isDeploying && (
        <Alert className="border-blue-500/20 bg-blue-500/10">
          <Zap className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium">
                Platform deployment in progress...
              </span>
              <div className="text-sm text-muted-foreground mt-1">
                Setting up infrastructure, applying customizations, and
                configuring domain
              </div>
            </div>
            <Progress value={65} className="w-32" />
          </AlertDescription>
        </Alert>
      )}

      {/* Package Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your White-Label Package</CardTitle>
          <CardDescription>
            Select the package that best fits your business needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    {pkg.id === "enterprise" && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      R{pkg.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per month
                    </div>
                    <div className="text-xs text-muted-foreground">
                      + R{pkg.setupFee.toLocaleString()} setup fee
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="text-xs flex items-center gap-2"
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {pkg.features.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{pkg.features.length - 3} more features
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">API Calls:</span>
                      <div className="font-medium">
                        {pkg.apiCalls === "unlimited"
                          ? "Unlimited"
                          : pkg.apiCalls.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Users:</span>
                      <div className="font-medium">
                        {pkg.users === "unlimited"
                          ? "Unlimited"
                          : pkg.users.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={selectedPackage === pkg.id ? "default" : "outline"}
                    size="sm"
                  >
                    {selectedPackage === pkg.id ? "Selected" : "Select Package"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="domain">Domain & Hosting</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Brand Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input
                    type="text"
                    value={whiteLabelConfig.branding.companyName}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{
                          backgroundColor:
                            whiteLabelConfig.branding.primaryColor,
                        }}
                      />
                      <input
                        type="color"
                        value={whiteLabelConfig.branding.primaryColor}
                        className="w-full h-8 border rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{
                          backgroundColor:
                            whiteLabelConfig.branding.secondaryColor,
                        }}
                      />
                      <input
                        type="color"
                        value={whiteLabelConfig.branding.secondaryColor}
                        className="w-full h-8 border rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{
                          backgroundColor:
                            whiteLabelConfig.branding.accentColor,
                        }}
                      />
                      <input
                        type="color"
                        value={whiteLabelConfig.branding.accentColor}
                        className="w-full h-8 border rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Family</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="inter">Inter</option>
                    <option value="roboto">Roboto</option>
                    <option value="opensans">Open Sans</option>
                    <option value="poppins">Poppins</option>
                    <option value="montserrat">Montserrat</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Logo Upload</label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Drop your logo here or click to upload
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      SVG, PNG, or JPG (max 2MB)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor:
                        whiteLabelConfig.branding.primaryColor + "10",
                      borderColor:
                        whiteLabelConfig.branding.primaryColor + "30",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                        <Building
                          className="h-5 w-5"
                          style={{
                            color: whiteLabelConfig.branding.primaryColor,
                          }}
                        />
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{
                          color: whiteLabelConfig.branding.primaryColor,
                        }}
                      >
                        {whiteLabelConfig.branding.companyName}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      style={{
                        backgroundColor: whiteLabelConfig.branding.primaryColor,
                      }}
                    >
                      Calculate Tax
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Color Palette</h4>
                    <div className="flex gap-2">
                      <div
                        className="w-12 h-12 rounded border flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor:
                            whiteLabelConfig.branding.primaryColor,
                        }}
                      >
                        Primary
                      </div>
                      <div
                        className="w-12 h-12 rounded border flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor:
                            whiteLabelConfig.branding.secondaryColor,
                        }}
                      >
                        Secondary
                      </div>
                      <div
                        className="w-12 h-12 rounded border flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor:
                            whiteLabelConfig.branding.accentColor,
                        }}
                      >
                        Accent
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Domain Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Domain</label>
                  <input
                    type="text"
                    value={whiteLabelConfig.domain.customDomain}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="tax.yourcompany.com"
                  />
                  <div className="text-xs text-muted-foreground">
                    Point your domain to our servers using the provided DNS
                    settings
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Subdomain (Fallback)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={whiteLabelConfig.domain.subdomain}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      .taxfy.app
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SSL Certificate</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Enabled</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      CDN Acceleration
                    </span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Enabled</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">DDoS Protection</span>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>DNS Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <div className="font-medium mb-2">Required DNS Records:</div>
                  <div className="space-y-2 font-mono text-xs bg-muted p-3 rounded">
                    <div className="flex justify-between">
                      <span>Type</span>
                      <span>Name</span>
                      <span>Value</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span>CNAME</span>
                      <span>tax</span>
                      <span>proxy.taxfy.app</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TXT</span>
                      <span>_taxfy</span>
                      <span>verification=abc123</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy DNS Records
                </Button>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Domain Status
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">
                      Pending Verification
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "taxCalculation",
                    label: "Tax Calculation Engine",
                    icon: Calculator,
                  },
                  {
                    key: "documentUpload",
                    label: "Document Upload & OCR",
                    icon: Upload,
                  },
                  {
                    key: "reporting",
                    label: "Advanced Reporting",
                    icon: BarChart3,
                  },
                  { key: "apiAccess", label: "API Access", icon: Code },
                  {
                    key: "mobileApp",
                    label: "Mobile Application",
                    icon: Smartphone,
                  },
                  {
                    key: "customWorkflows",
                    label: "Custom Workflows",
                    icon: Settings,
                  },
                ].map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{feature.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Enabled</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customization Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Custom Login Page", status: "configured" },
                  { label: "Branded Dashboard", status: "configured" },
                  { label: "Email Templates", status: "configured" },
                  { label: "Mobile App Theme", status: "pending" },
                  { label: "Custom Workflows", status: "configured" },
                  { label: "API Endpoints", status: "available" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{item.label}</span>
                    <Badge
                      variant={
                        item.status === "configured"
                          ? "outline"
                          : item.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Capabilities</CardTitle>
              <CardDescription>
                Available integrations for your white-label platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "SARS eFiling", status: "active", icon: Globe },
                  { name: "Banking APIs", status: "available", icon: Building },
                  {
                    name: "Payment Gateways",
                    status: "active",
                    icon: DollarSign,
                  },
                  { name: "CRM Systems", status: "available", icon: Users },
                  {
                    name: "Accounting Software",
                    status: "active",
                    icon: BarChart3,
                  },
                  { name: "Email Providers", status: "active", icon: Mail },
                ].map((integration, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border text-center"
                  >
                    <integration.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium text-sm">
                      {integration.name}
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {integration.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Live Platform Preview
                <div className="flex gap-2">
                  {previewDevices.map((device) => (
                    <Button
                      key={device.id}
                      variant={
                        previewDevice === device.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setPreviewDevice(device.id)}
                    >
                      <device.icon className="h-4 w-4 mr-2" />
                      {device.name}
                    </Button>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-8 rounded-lg">
                <div
                  className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
                  style={{
                    width:
                      previewDevices.find((d) => d.id === previewDevice)
                        ?.width || 1200,
                    height:
                      previewDevices.find((d) => d.id === previewDevice)
                        ?.height || 800,
                    maxWidth: "100%",
                    transform: "scale(0.8)",
                    transformOrigin: "top center",
                  }}
                >
                  {/* Mock Platform Interface */}
                  <div
                    className="p-4 border-b"
                    style={{
                      backgroundColor: whiteLabelConfig.branding.primaryColor,
                    }}
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Building className="h-6 w-6" />
                        <span className="font-bold">
                          {whiteLabelConfig.branding.companyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">Dashboard</span>
                        <span className="text-sm">Reports</span>
                        <span className="text-sm">Settings</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">
                      Tax Calculation Dashboard
                    </h1>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">
                          Total Processed
                        </div>
                        <div className="text-2xl font-bold">1,247</div>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">
                          Active Users
                        </div>
                        <div className="text-2xl font-bold">89</div>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">
                          This Month
                        </div>
                        <div className="text-2xl font-bold">R2.4M</div>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      style={{
                        backgroundColor: whiteLabelConfig.branding.primaryColor,
                      }}
                    >
                      Upload Tax Document
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <Button variant="outline">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile Preview
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Platform Usage
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  Active users this month
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    +15.3% from last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue Generated
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">R847K</div>
                <p className="text-xs text-muted-foreground">
                  Revenue this month
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    +23.1% from last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Platform Uptime
                </CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">99.97%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
                <Progress value={99.97} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Share Details</CardTitle>
              <CardDescription>
                Your earnings from the white-label platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    service: "Tax Calculations",
                    volume: 15420,
                    rate: "R12.50",
                    revenue: 192750,
                  },
                  {
                    service: "Document Processing",
                    volume: 8950,
                    rate: "R8.00",
                    revenue: 71600,
                  },
                  {
                    service: "API Calls",
                    volume: 125000,
                    rate: "R0.15",
                    revenue: 18750,
                  },
                  {
                    service: "Premium Features",
                    volume: 450,
                    rate: "R45.00",
                    revenue: 20250,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.service}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.volume.toLocaleString()} units @ {item.rate} each
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      R{item.revenue.toLocaleString()}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Total Monthly Revenue:</span>
                  <span className="text-green-600">R303,350</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Management</CardTitle>
          <CardDescription>
            Manage your white-label platform deployment and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Changes
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
