import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Upload, 
  Calculator, 
  FileText, 
  Users, 
  Shield, 
  Settings,
  Play,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Complete guide to using Taxfy for your South African tax calculations
          </p>
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create Account</h3>
                <p className="text-sm text-muted-foreground">Sign up for a free account to get started</p>
                <Link to="/register" className="mt-2 inline-block">
                  <Button size="sm" variant="outline">Sign Up</Button>
                </Link>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Upload Documents</h3>
                <p className="text-sm text-muted-foreground">Upload your IRP5 or use manual entry</p>
                <Link to="/upload" className="mt-2 inline-block">
                  <Button size="sm" variant="outline">Upload</Button>
                </Link>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Results</h3>
                <p className="text-sm text-muted-foreground">View your calculated tax refund instantly</p>
                <Link to="/dashboard" className="mt-2 inline-block">
                  <Button size="sm" variant="outline">Dashboard</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2 text-sm">
                  <a href="#getting-started" className="block text-muted-foreground hover:text-foreground">Getting Started</a>
                  <a href="#uploading-documents" className="block text-muted-foreground hover:text-foreground">Uploading Documents</a>
                  <a href="#manual-calculator" className="block text-muted-foreground hover:text-foreground">Manual Calculator</a>
                  <a href="#understanding-results" className="block text-muted-foreground hover:text-foreground">Understanding Results</a>
                  <a href="#account-management" className="block text-muted-foreground hover:text-foreground">Account Management</a>
                  <a href="#subscription-plans" className="block text-muted-foreground hover:text-foreground">Subscription Plans</a>
                  <a href="#troubleshooting" className="block text-muted-foreground hover:text-foreground">Troubleshooting</a>
                  <a href="#api-access" className="block text-muted-foreground hover:text-foreground">API Access</a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            <section id="getting-started">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Account Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <Badge variant="default" className="mb-2">Individual</Badge>
                        <p className="text-sm">For personal tax calculations and refund estimates</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <Badge variant="secondary" className="mb-2">Practitioner</Badge>
                        <p className="text-sm">For tax professionals managing multiple clients</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <Badge variant="destructive" className="mb-2">Admin</Badge>
                        <p className="text-sm">System administration and user management</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">System Requirements</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                      <li>• Stable internet connection</li>
                      <li>• JavaScript enabled</li>
                      <li>• Cookies enabled for authentication</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Supported Documents</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>IRP5:</strong> Certificate of remuneration paid</li>
                      <li>• <strong>IT3(a):</strong> Certificate of interest paid</li>
                      <li>• <strong>Medical Aid Certificates:</strong> For medical deductions</li>
                      <li>• <strong>Retirement Annuity Statements:</strong> For RA contributions</li>
                      <li>• <strong>PDF, JPG, PNG formats</strong> up to 10MB per file</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Uploading Documents */}
            <section id="uploading-documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Uploading Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Step-by-Step Process</h3>
                    <ol className="space-y-3 text-sm list-decimal list-inside">
                      <li>Navigate to the <Link to="/upload" className="text-primary hover:underline">Upload Documents</Link> page</li>
                      <li>Click "Choose Files" or drag and drop your documents</li>
                      <li>Select your tax documents (IRP5, IT3(a), etc.)</li>
                      <li>Wait for the upload and processing to complete</li>
                      <li>Review the extracted information for accuracy</li>
                      <li>Click "Calculate Tax Refund" to see your results</li>
                    </ol>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Document Quality Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Best Practices
                        </h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Use high-resolution scans or photos</li>
                          <li>• Ensure all text is clearly readable</li>
                          <li>• Include all pages of multi-page documents</li>
                          <li>• Use good lighting when photographing</li>
                          <li>• Keep documents flat and straight</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Avoid These Issues
                        </h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Blurry or low-quality images</li>
                          <li>• Partial or cropped documents</li>
                          <li>• Documents with shadows or glare</li>
                          <li>• Rotated or upside-down images</li>
                          <li>• Files larger than 10MB</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Processing Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium">Processing</p>
                          <p className="text-sm text-muted-foreground">Document is being analyzed</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Complete</p>
                          <p className="text-sm text-muted-foreground">Information extracted successfully</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Error</p>
                          <p className="text-sm text-muted-foreground">Unable to process document</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Manual Calculator */}
            <section id="manual-calculator">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Manual Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">When to Use Manual Entry</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• When you don't have digital copies of your documents</li>
                      <li>• For quick estimates without uploading files</li>
                      <li>• When document processing fails or is inaccurate</li>
                      <li>• For complex scenarios requiring manual adjustments</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Required Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Income Details</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Gross annual salary</li>
                          <li>• Bonus payments</li>
                          <li>• Commission income</li>
                          <li>• Other taxable income</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Deductions</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• PAYE tax paid</li>
                          <li>• UIF contributions</li>
                          <li>• Medical aid contributions</li>
                          <li>• Retirement annuity contributions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tax Year Selection</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-800 dark:text-blue-200">Tax Year Information</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            South African tax year runs from 1 March to 28/29 February. Select the correct tax year 
                            for your calculation to ensure accurate tax rates and thresholds are applied.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Understanding Results */}
            <section id="understanding-results">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Understanding Your Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Result Components</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Taxable Income</h4>
                        <p className="text-sm text-muted-foreground">
                          Your total income minus allowable deductions, used to calculate tax liability
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Tax Liability</h4>
                        <p className="text-sm text-muted-foreground">
                          The total amount of tax you owe based on current tax brackets
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Tax Paid (PAYE)</h4>
                        <p className="text-sm text-muted-foreground">
                          The amount of tax already deducted from your salary during the year
                        </p>
                      </div>
                      <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                        <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">Refund/Amount Due</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          If positive: refund due to you. If negative: additional tax owed to SARS
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Common Deductions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Medical Aid</h4>
                        <p className="text-sm text-muted-foreground">
                          Monthly contributions to registered medical schemes
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Retirement Annuity</h4>
                        <p className="text-sm text-muted-foreground">
                          Contributions to approved retirement annuity funds
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Travel Allowance</h4>
                        <p className="text-sm text-muted-foreground">
                          Business-related travel expenses and allowances
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Donations</h4>
                        <p className="text-sm text-muted-foreground">
                          Donations to approved public benefit organizations
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Account Management */}
            <section id="account-management">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Profile Settings</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Update personal information and contact details</li>
                      <li>• Change password and security settings</li>
                      <li>• Manage notification preferences</li>
                      <li>• Set up two-factor authentication (coming soon)</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Data Management</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• View and download your calculation history</li>
                      <li>• Export reports in PDF format</li>
                      <li>• Delete old calculations and documents</li>
                      <li>• Request data export or account deletion</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Security Features</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• End-to-end encryption for all data</li>
                      <li>• Secure document storage with automatic deletion</li>
                      <li>• Session management and automatic logout</li>
                      <li>• Regular security audits and updates</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Subscription Plans */}
            <section id="subscription-plans">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Subscription Plans
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border rounded-lg p-4">
                      <Badge variant="outline" className="mb-2">Free</Badge>
                      <h4 className="font-medium mb-2">Basic Features</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• 3 calculations per month</li>
                        <li>• Basic document upload</li>
                        <li>• Standard support</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4 border-primary">
                      <Badge className="mb-2">Pro</Badge>
                      <h4 className="font-medium mb-2">Enhanced Features</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Unlimited calculations</li>
                        <li>• Document vault storage</li>
                        <li>• Priority support</li>
                        <li>• Advanced reporting</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <Badge variant="secondary" className="mb-2">Practitioner</Badge>
                      <h4 className="font-medium mb-2">Professional Features</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Client management</li>
                        <li>• Bulk processing</li>
                        <li>• White-label options</li>
                        <li>• API access</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Troubleshooting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Common Issues</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Document Upload Fails</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Check file size (max 10MB)</li>
                          <li>• Ensure file format is supported (PDF, JPG, PNG)</li>
                          <li>• Try refreshing the page and uploading again</li>
                          <li>• Check your internet connection</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Calculation Seems Incorrect</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Verify all input information is accurate</li>
                          <li>• Check that the correct tax year is selected</li>
                          <li>• Review extracted document data for errors</li>
                          <li>• Consider using manual entry for complex scenarios</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Login Issues</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Check your email and password</li>
                          <li>• Try resetting your password</li>
                          <li>• Clear browser cache and cookies</li>
                          <li>• Disable browser extensions temporarily</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Getting Help</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Support Channels</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Email: support@taxfy.co.za</li>
                          <li>• Phone: +27670494876</li>
                          <li>• Live chat (Pro subscribers)</li>
                          <li>• FAQ section</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Response Times</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Free: 48-72 hours</li>
                          <li>• Pro: 24 hours</li>
                          <li>• Practitioner: 12 hours</li>
                          <li>• Critical issues: 4 hours</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* API Access */}
            <section id="api-access">
              <Card>
                <CardHeader>
                  <CardTitle>API Access</CardTitle>
                  <Badge variant="secondary" className="ml-2">Practitioner Plan</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    API access is available for Practitioner plan subscribers to integrate Taxfy's 
                    calculation engine into their own applications and workflows.
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm">
                      <strong>Coming Soon:</strong> Comprehensive API documentation and developer tools 
                      will be available in the next release. Contact us for early access.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 