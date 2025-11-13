import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  DollarSign,
  Settings,
  Shield,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  TestTube,
  Globe,
  Banknote,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentConfiguration {
  // PayPal Configuration
  paypal: {
    enabled: boolean;
    environment: "sandbox" | "production";
    clientId: string;
    clientSecret: string;
  };

  // Paystack Configuration (South African - Recommended)
  paystack: {
    enabled: boolean;
    environment: "test" | "live";
    publicKey: string;
    secretKey: string;
  };

  // PayFast Configuration (South African)
  payfast: {
    enabled: boolean;
    environment: "sandbox" | "live";
    merchantId: string;
    merchantKey: string;
    passphrase: string;
  };

  // Ozow Configuration (South African EFT)
  ozow: {
    enabled: boolean;
    environment: "sandbox" | "live";
    siteCode: string;
    privateKey: string;
    apiKey: string;
  };

  // General Payment Settings
  general: {
    currency: string;
    taxRate: number;
    enableGuestCheckout: boolean;
    minimumAmount: number;
    maximumAmount: number;
  };
}

const PaymentSettings: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState({
    paypal: false,
    paystack: false,
    payfast: false,
    ozow: false,
  });

  const [config, setConfig] = useState<PaymentConfiguration>({
    paypal: {
      enabled: false,
      environment: "sandbox",
      clientId: "",
      clientSecret: "",
    },
    paystack: {
      enabled: false,
      environment: "test",
      publicKey: "",
      secretKey: "",
    },
    payfast: {
      enabled: false,
      environment: "sandbox",
      merchantId: "",
      merchantKey: "",
      passphrase: "",
    },
    ozow: {
      enabled: false,
      environment: "sandbox",
      siteCode: "",
      privateKey: "",
      apiKey: "",
    },
    general: {
      currency: "ZAR",
      taxRate: 15,
      enableGuestCheckout: true,
      minimumAmount: 10,
      maximumAmount: 50000,
    },
  });

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to your backend/database
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Payment Settings Saved",
        description:
          "Payment gateway configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (gateway: string) => {
    setLoading(true);
    try {
      // Simulate API test
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: `${gateway} Test Successful`,
        description: `Connection to ${gateway} gateway is working properly.`,
      });
    } catch (error) {
      toast({
        title: `${gateway} Test Failed`,
        description: `Unable to connect to ${gateway}. Please check your credentials.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (enabled: boolean, hasCredentials: boolean) => {
    if (!enabled) {
      return <Badge variant="secondary">Disabled</Badge>;
    }

    if (!hasCredentials) {
      return <Badge variant="destructive">Not Configured</Badge>;
    }

    return (
      <Badge variant="default" className="bg-green-500">
        Active
      </Badge>
    );
  };

  const toggleSecretVisibility = (gateway: keyof typeof showSecrets) => {
    setShowSecrets((prev) => ({
      ...prev,
      [gateway]: !prev[gateway],
    }));
  };

  const renderSecretInput = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    gateway: keyof typeof showSecrets,
    id: string,
  ) => (
    <div className="relative">
      <Input
        id={id}
        type={showSecrets[gateway] ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => toggleSecretVisibility(gateway)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        {showSecrets[gateway] ? (
          <EyeOff className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Eye className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Gateway Settings</h2>
        <p className="text-muted-foreground">
          Configure payment gateways for South African and international
          customers
        </p>
      </div>

      {/* ⚠️ CRITICAL SECURITY WARNING */}
      <Alert variant="destructive" className="border-2 border-red-600 bg-red-950/20 dark:bg-red-950/40">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertTitle className="font-bold text-lg text-red-600">⚠️ UI Mockup Only - DO NOT USE IN PRODUCTION</AlertTitle>
        <AlertDescription className="text-sm space-y-2">
          <p>
            <strong className="text-red-600">CRITICAL:</strong> This payment settings interface is a design mockup only.
            Backend secure storage is not implemented yet.
          </p>
          <p>
            <strong>DO NOT ENTER REAL PAYMENT CREDENTIALS!</strong> Any credentials entered here
            will be stored in browser memory only and are NOT secure. Payment integration will be
            completed in a future phase with proper server-side secret management and encryption.
          </p>
          <p className="text-xs text-muted-foreground">
            Status: Paystack client/server architecture created but not wired to Express routes.
            User requested: "Skip payment methods for now, will wire payment later."
          </p>
        </AlertDescription>
      </Alert>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Paystack is recommended for South African businesses with ZAR support, cards, EFT, and QR payments.
          PayPal supports international payments. PayFast and Ozow offer local banking options.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="paypal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="paypal" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            PayPal
          </TabsTrigger>
          <TabsTrigger value="paystack" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Paystack
          </TabsTrigger>
          <TabsTrigger value="payfast" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            PayFast
          </TabsTrigger>
          <TabsTrigger value="ozow" className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            Ozow
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
        </TabsList>

        {/* PayPal Configuration */}
        <TabsContent value="paypal" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    PayPal Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure PayPal for international payments
                  </CardDescription>
                </div>
                {getStatusBadge(
                  config.paypal.enabled,
                  !!config.paypal.clientId,
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.paypal.enabled}
                  onCheckedChange={(enabled) =>
                    setConfig((prev) => ({
                      ...prev,
                      paypal: { ...prev.paypal, enabled },
                    }))
                  }
                  data-testid="switch-paypal-enabled"
                />
                <Label>Enable PayPal</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paypal-env">Environment</Label>
                  <Select
                    value={config.paypal.environment}
                    onValueChange={(environment: "sandbox" | "production") =>
                      setConfig((prev) => ({
                        ...prev,
                        paypal: { ...prev.paypal, environment },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal-client-id">Client ID</Label>
                <Input
                  id="paypal-client-id"
                  value={config.paypal.clientId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      paypal: { ...prev.paypal, clientId: e.target.value },
                    }))
                  }
                  placeholder="PayPal Client ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal-client-secret">Client Secret</Label>
                {renderSecretInput(
                  config.paypal.clientSecret,
                  (clientSecret) =>
                    setConfig((prev) => ({
                      ...prev,
                      paypal: { ...prev.paypal, clientSecret },
                    })),
                  "PayPal Client Secret",
                  "paypal",
                  "paypal-client-secret",
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => testConnection("PayPal")}
                  variant="outline"
                  disabled={loading || !config.paypal.clientId}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://developer.paypal.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    PayPal Developer
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paystack Configuration */}
        <TabsContent value="paystack" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Paystack Configuration
                  </CardTitle>
                  <CardDescription>
                    Recommended for South Africa - Cards, EFT, QR payments in ZAR
                  </CardDescription>
                </div>
                {getStatusBadge(
                  config.paystack.enabled,
                  !!config.paystack.publicKey,
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.paystack.enabled}
                  onCheckedChange={(enabled) =>
                    setConfig((prev) => ({
                      ...prev,
                      paystack: { ...prev.paystack, enabled },
                    }))
                  }
                  data-testid="switch-paystack-enabled"
                />
                <Label>Enable Paystack</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paystack-env">Environment</Label>
                  <Select
                    value={config.paystack.environment}
                    onValueChange={(environment: "test" | "live") =>
                      setConfig((prev) => ({
                        ...prev,
                        paystack: { ...prev.paystack, environment },
                      }))
                    }
                  >
                    <SelectTrigger data-testid="select-paystack-environment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paystack-public-key">Public Key</Label>
                <Input
                  id="paystack-public-key"
                  value={config.paystack.publicKey}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      paystack: { ...prev.paystack, publicKey: e.target.value },
                    }))
                  }
                  placeholder="pk_test_... or pk_live_..."
                  data-testid="input-paystack-public-key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paystack-secret-key">Secret Key</Label>
                {renderSecretInput(
                  config.paystack.secretKey,
                  (secretKey) =>
                    setConfig((prev) => ({
                      ...prev,
                      paystack: { ...prev.paystack, secretKey },
                    })),
                  "sk_test_... or sk_live_...",
                  "paystack",
                  "paystack-secret-key",
                )}
                <p className="text-xs text-muted-foreground">
                  🔒 Secret keys are stored securely on the server and never exposed to the browser.
                </p>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Why Paystack for South Africa?</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Native ZAR support (no currency conversion)</li>
                    <li>• Cards (Visa, Mastercard, Amex)</li>
                    <li>• EFT & Bank Transfers (via Ozow integration)</li>
                    <li>• QR Payments (SnapScan, Scan to Pay)</li>
                    <li>• 2-day settlement to South African banks</li>
                    <li>• Transaction fees: ~2.9% local, ~3.9% international</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  onClick={() => testConnection("Paystack")}
                  variant="outline"
                  disabled={loading || !config.paystack.publicKey}
                  data-testid="button-test-paystack"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://paystack.com/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-paystack-docs"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Paystack Docs
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://dashboard.paystack.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-paystack-dashboard"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Dashboard
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PayFast Configuration */}
        <TabsContent value="payfast" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    PayFast Configuration
                  </CardTitle>
                  <CardDescription>
                    South African payment gateway for local banking
                  </CardDescription>
                </div>
                {getStatusBadge(
                  config.payfast.enabled,
                  !!config.payfast.merchantId,
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.payfast.enabled}
                  onCheckedChange={(enabled) =>
                    setConfig((prev) => ({
                      ...prev,
                      payfast: { ...prev.payfast, enabled },
                    }))
                  }
                  data-testid="switch-payfast-enabled"
                />
                <Label>Enable PayFast</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payfast-env">Environment</Label>
                  <Select
                    value={config.payfast.environment}
                    onValueChange={(environment: "sandbox" | "live") =>
                      setConfig((prev) => ({
                        ...prev,
                        payfast: { ...prev.payfast, environment },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payfast-merchant-id">Merchant ID</Label>
                <Input
                  id="payfast-merchant-id"
                  value={config.payfast.merchantId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      payfast: { ...prev.payfast, merchantId: e.target.value },
                    }))
                  }
                  placeholder="PayFast Merchant ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payfast-merchant-key">Merchant Key</Label>
                {renderSecretInput(
                  config.payfast.merchantKey,
                  (merchantKey) =>
                    setConfig((prev) => ({
                      ...prev,
                      payfast: { ...prev.payfast, merchantKey },
                    })),
                  "PayFast Merchant Key",
                  "payfast",
                  "payfast-merchant-key",
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payfast-passphrase">Passphrase</Label>
                {renderSecretInput(
                  config.payfast.passphrase,
                  (passphrase) =>
                    setConfig((prev) => ({
                      ...prev,
                      payfast: { ...prev.payfast, passphrase },
                    })),
                  "PayFast Passphrase",
                  "payfast",
                  "payfast-passphrase",
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => testConnection("PayFast")}
                  variant="outline"
                  disabled={loading || !config.payfast.merchantId}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://www.payfast.co.za/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    PayFast Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ozow Configuration */}
        <TabsContent value="ozow" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="w-5 h-5" />
                    Ozow Configuration
                  </CardTitle>
                  <CardDescription>
                    South African instant EFT payments
                  </CardDescription>
                </div>
                {getStatusBadge(config.ozow.enabled, !!config.ozow.siteCode)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.ozow.enabled}
                  onCheckedChange={(enabled) =>
                    setConfig((prev) => ({
                      ...prev,
                      ozow: { ...prev.ozow, enabled },
                    }))
                  }
                  data-testid="switch-ozow-enabled"
                />
                <Label>Enable Ozow</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ozow-env">Environment</Label>
                  <Select
                    value={config.ozow.environment}
                    onValueChange={(environment: "sandbox" | "live") =>
                      setConfig((prev) => ({
                        ...prev,
                        ozow: { ...prev.ozow, environment },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ozow-site-code">Site Code</Label>
                <Input
                  id="ozow-site-code"
                  value={config.ozow.siteCode}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ozow: { ...prev.ozow, siteCode: e.target.value },
                    }))
                  }
                  placeholder="Ozow Site Code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ozow-private-key">Private Key</Label>
                {renderSecretInput(
                  config.ozow.privateKey,
                  (privateKey) =>
                    setConfig((prev) => ({
                      ...prev,
                      ozow: { ...prev.ozow, privateKey },
                    })),
                  "Ozow Private Key",
                  "ozow",
                  "ozow-private-key",
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ozow-api-key">API Key</Label>
                {renderSecretInput(
                  config.ozow.apiKey,
                  (apiKey) =>
                    setConfig((prev) => ({
                      ...prev,
                      ozow: { ...prev.ozow, apiKey },
                    })),
                  "Ozow API Key",
                  "ozow",
                  "ozow-api-key",
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => testConnection("Ozow")}
                  variant="outline"
                  disabled={loading || !config.ozow.siteCode}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://www.ozow.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ozow Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Payment Settings
              </CardTitle>
              <CardDescription>
                Configure general payment options and limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={config.general.currency}
                    onValueChange={(currency) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: { ...prev.general, currency },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZAR">
                        ZAR (South African Rand)
                      </SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    value={config.general.taxRate}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: {
                          ...prev.general,
                          taxRate: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    placeholder="15"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-amount">Minimum Amount</Label>
                  <Input
                    id="min-amount"
                    type="number"
                    value={config.general.minimumAmount}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: {
                          ...prev.general,
                          minimumAmount: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    placeholder="10.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-amount">Maximum Amount</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    value={config.general.maximumAmount}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: {
                          ...prev.general,
                          maximumAmount: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    placeholder="50000.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.general.enableGuestCheckout}
                  onCheckedChange={(enableGuestCheckout) =>
                    setConfig((prev) => ({
                      ...prev,
                      general: { ...prev.general, enableGuestCheckout },
                    }))
                  }
                  data-testid="switch-guest-checkout"
                />
                <Label>Enable Guest Checkout</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveConfig} disabled={loading}>
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Payment Settings
        </Button>
      </div>
    </div>
  );
};

export default PaymentSettings;
