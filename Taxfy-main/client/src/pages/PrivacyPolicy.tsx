import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Database, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            How we collect, use, and protect your personal information
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Taxfy ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our tax refund 
              calculation service and website.
            </p>
            <p>
              As a South African company, we comply with the Protection of Personal Information Act (POPIA) and other applicable 
              data protection laws. By using our service, you consent to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Account Information:</strong> Name, email address, phone number, and password</li>
                <li>• <strong>Profile Information:</strong> Professional details (for practitioners), firm name, and preferences</li>
                <li>• <strong>Tax Information:</strong> Income details, deductions, and other tax-related data you provide</li>
                <li>• <strong>Identity Verification:</strong> ID number or passport details when required for verification</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Document Information</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Tax Documents:</strong> IRP5 certificates, IT3(a) forms, and other uploaded tax documents</li>
                <li>• <strong>Supporting Documents:</strong> Medical aid certificates, retirement annuity statements, and other deduction documents</li>
                <li>• <strong>Metadata:</strong> File names, upload timestamps, and document processing information</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Technical Information</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
                <li>• <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                <li>• <strong>Cookies:</strong> Session cookies, preference cookies, and analytics cookies</li>
                <li>• <strong>Log Data:</strong> Server logs, error reports, and security logs</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Primary Purposes</h3>
              <ul className="space-y-2 text-sm">
                <li>• Calculate your tax refund based on provided information</li>
                <li>• Process and analyze uploaded tax documents</li>
                <li>• Provide personalized tax advice and recommendations</li>
                <li>• Generate tax reports and summaries</li>
                <li>• Maintain your account and provide customer support</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Secondary Purposes</h3>
              <ul className="space-y-2 text-sm">
                <li>• Improve our services and develop new features</li>
                <li>• Send important updates about tax law changes</li>
                <li>• Provide educational content about tax matters</li>
                <li>• Ensure platform security and prevent fraud</li>
                <li>• Comply with legal and regulatory requirements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest using AES-256</li>
              <li>• <strong>Access Controls:</strong> Strict access controls and multi-factor authentication for our team</li>
              <li>• <strong>Regular Audits:</strong> Regular security audits and penetration testing</li>
              <li>• <strong>Data Minimization:</strong> We only collect and retain data necessary for our services</li>
              <li>• <strong>Secure Infrastructure:</strong> Hosted on secure, compliant cloud infrastructure</li>
              <li>• <strong>Incident Response:</strong> Comprehensive incident response procedures</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
              <li>• <strong>Service Providers:</strong> With trusted third-party service providers who assist in our operations</li>
              <li>• <strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li>• <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li>• <strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rights Under POPIA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Under the Protection of Personal Information Act, you have the following rights:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Right to Access:</strong> Request access to your personal information we hold</li>
              <li>• <strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li>• <strong>Right to Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li>• <strong>Right to Object:</strong> Object to the processing of your personal information</li>
              <li>• <strong>Right to Portability:</strong> Request your data in a portable format</li>
              <li>• <strong>Right to Restrict Processing:</strong> Request restriction of processing in certain circumstances</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Account Information:</strong> Retained while your account is active and for 7 years after closure</li>
              <li>• <strong>Tax Documents:</strong> Retained for 5 years as required by South African tax law</li>
              <li>• <strong>Transaction Records:</strong> Retained for 5 years for audit and compliance purposes</li>
              <li>• <strong>Marketing Data:</strong> Retained until you unsubscribe or request deletion</li>
              <li>• <strong>Technical Logs:</strong> Retained for 12 months for security and troubleshooting purposes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our website</li>
              <li>• <strong>Security Cookies:</strong> Protect against fraud and unauthorized access</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings, but disabling certain cookies may affect website functionality.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="space-y-2">
              <span><strong>Email:</strong> privacy@taxfy.co.za</span>
            </div>
            <div className="space-y-2">
              <span><strong>Phone:</strong> +27670494876</span>
            </div>
            <div>
              <strong>Postal Address:</strong><br />
              Taxfy Privacy Officer<br />
              PO Box 12345<br />
              Johannesburg, 2000<br />
              South Africa
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of any material changes by posting the updated policy on our website and sending you an email notification. 
              Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 