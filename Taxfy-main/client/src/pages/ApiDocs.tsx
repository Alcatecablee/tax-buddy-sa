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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Crown,
  Zap,
  Key,
  Database,
  Shield,
  FileText,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ApiDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const exampleCode = {
    curl: `curl -X POST https://api.taxfy.co.za/v1/calculate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "grossIncome": 500000,
    "retirementContrib": 27500,
    "medicalContrib": 12000,
    "taxYear": "2024"
  }'`,
    javascript: `const response = await fetch('https://api.taxfy.co.za/v1/calculate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    grossIncome: 500000,
    retirementContrib: 27500,
    medicalContrib: 12000,
    taxYear: '2024'
  })
});

const result = await response.json();`,
    python: `import requests

url = "https://api.taxfy.co.za/v1/calculate"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "grossIncome": 500000,
    "retirementContrib": 27500,
    "medicalContrib": 12000,
    "taxYear": "2024"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()`,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">Pro Feature - API Access Required</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/pricing">
              <Button>
                <Crown className="h-4 w-4 mr-2" />
                Get Professional Practice Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* API Access Promotion */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Unlock API Access
            </CardTitle>
            <CardDescription>
              Integrate tax calculations directly into your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-background">
                <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold">RESTful API</h4>
                <p className="text-sm text-muted-foreground">
                  Simple HTTP endpoints for tax calculations
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <Key className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold">Secure Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  API keys with rate limiting and monitoring
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold">Real-time Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Fast, accurate tax calculations on demand
                </p>
              </div>
            </div>

            <div className="bg-background p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-3">Professional API Features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Tax calculation endpoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Bulk document processing API</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">
                    Professional rate limiting & monitoring
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">
                    Webhook notifications & real-time updates
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">
                    Client management API endpoints
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">
                    Professional developer support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">
                    Sandbox & production environments
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">
                    Advanced analytics & usage insights
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-primary/10">
              <div>
                <span className="text-lg font-bold">ZAR 899</span>
                <span className="text-sm text-muted-foreground">/month</span>
                <p className="text-xs text-muted-foreground">
                  Professional Practice plan includes API access
                </p>
              </div>
              <Link to="/pricing">
                <Button size="lg">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Professional Practice
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation Preview */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Overview</CardTitle>
                <CardDescription>
                  Integrate tax calculations into your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Base URL</h4>
                    <code className="text-sm bg-muted p-2 rounded block">
                      https://api.taxfy.co.za/v1
                    </code>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Response Format</h4>
                    <code className="text-sm bg-muted p-2 rounded block">
                      JSON
                    </code>
                  </div>
                </div>

                <div className="p-4 border rounded-lg opacity-50">
                  <h4 className="font-semibold mb-2">
                    Rate Limits - Professional Practice Plan
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• 1,000 requests per hour (included)</li>
                    <li>• 25,000 requests per month</li>
                    <li>• Burst limit: 50 requests per minute</li>
                    <li>• Enterprise plans: Up to 250,000 requests/month</li>
                  </ul>
                  <Badge variant="outline" className="mt-2">
                    Professional Practice Plan Required
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  Secure your API requests with authentication tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg opacity-50">
                  <h4 className="font-semibold mb-2">API Key Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Include your API key in the Authorization header:
                  </p>
                  <code className="text-sm bg-muted p-3 rounded block">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                  <Badge variant="outline" className="mt-2">
                    Professional Practice Plan Required
                  </Badge>
                </div>

                <div className="p-4 border rounded-lg opacity-50">
                  <h4 className="font-semibold mb-2">Getting Your API Key</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>
                      Upgrade to Professional Practice plan (ZAR 899/month)
                    </li>
                    <li>Navigate to API settings in your dashboard</li>
                    <li>Generate a new API key with granular permissions</li>
                    <li>Configure rate limits and IP whitelisting</li>
                    <li>Copy and securely store your key</li>
                  </ol>
                  <Badge variant="outline" className="mt-2">
                    Professional Practice Plan Required
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Endpoints</CardTitle>
                <CardDescription>
                  RESTful endpoints for tax calculations and document processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 opacity-50">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm">/v1/calculate</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Calculate tax liability and refunds with professional
                      optimization
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm">
                        /v1/bulk/process-documents
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload and process multiple IRP5 documents in batches
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm">/v1/clients</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create and manage client records through API
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">
                        /v1/clients/{"{"}
                        {"}"}id{"}"}/calculations
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Retrieve all calculations for a specific client
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm">/v1/reports/generate</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generate white-label reports with custom branding
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/v1/analytics/usage</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Access professional usage analytics and insights
                    </p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Badge variant="outline">
                    Professional Practice Plan Required for API Access
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>
                  Sample code for integrating with the Taxfy API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">cURL</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(exampleCode.curl, "curl")
                        }
                        disabled
                      >
                        {copiedCode === "curl" ? (
                          "Copied!"
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto opacity-50">
                      <code>{exampleCode.curl}</code>
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">JavaScript</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(exampleCode.javascript, "js")
                        }
                        disabled
                      >
                        {copiedCode === "js" ? (
                          "Copied!"
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto opacity-50">
                      <code>{exampleCode.javascript}</code>
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Python</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(exampleCode.python, "python")
                        }
                        disabled
                      >
                        {copiedCode === "python" ? (
                          "Copied!"
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto opacity-50">
                      <code>{exampleCode.python}</code>
                    </pre>
                  </div>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-muted-foreground mb-4">
                    Get full access to Professional API documentation, live
                    examples, and dedicated support
                  </p>
                  <Link to="/pricing">
                    <Button>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Professional Practice Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
