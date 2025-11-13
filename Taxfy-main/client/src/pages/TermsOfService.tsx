import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Scale, FileText, AlertTriangle, Shield, Mail, Phone } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Legal terms and conditions for using Taxfy
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and Taxfy (Pty) Ltd 
              ("Company," "we," "our," or "us") regarding your use of our tax refund calculation service and website.
            </p>
            <p>
              By accessing or using our service, you agree to be bound by these Terms and our Privacy Policy. 
              If you do not agree to these Terms, you may not access or use our service.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200">Important Notice</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Taxfy provides tax calculation tools and information. We are not a registered tax practitioner or 
                    accounting firm. For complex tax matters, please consult a qualified tax professional.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Taxfy provides an online platform for calculating South African tax refunds based on information you provide. 
              Our services include:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Tax Calculation Tools:</strong> Automated calculation of potential tax refunds</li>
              <li>• <strong>Document Processing:</strong> Analysis of uploaded tax documents (IRP5, IT3(a), etc.)</li>
              <li>• <strong>Tax Guidance:</strong> General information about South African tax laws and deductions</li>
              <li>• <strong>Report Generation:</strong> Creation of tax calculation reports and summaries</li>
              <li>• <strong>Account Management:</strong> Secure storage of your tax information and calculation history</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Account Security</h3>
              <ul className="space-y-2 text-sm">
                <li>• Maintain the confidentiality of your account credentials</li>
                <li>• Notify us immediately of any unauthorized access to your account</li>
                <li>• Use strong passwords and enable two-factor authentication when available</li>
                <li>• Log out of your account when using shared or public computers</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Information Accuracy</h3>
              <ul className="space-y-2 text-sm">
                <li>• Provide accurate and complete information for tax calculations</li>
                <li>• Verify all uploaded documents are legitimate and belong to you</li>
                <li>• Update your information promptly when circumstances change</li>
                <li>• Review all calculations and reports for accuracy before relying on them</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Prohibited Uses</h3>
              <ul className="space-y-2 text-sm">
                <li>• Using the service for fraudulent or illegal purposes</li>
                <li>• Uploading documents that do not belong to you</li>
                <li>• Attempting to circumvent security measures or access restrictions</li>
                <li>• Sharing your account with unauthorized persons</li>
                <li>• Using automated tools to scrape or extract data from our platform</li>
                <li>• Reverse engineering or attempting to copy our software</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Disclaimers and Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Tax Advice Disclaimer</h3>
              <p className="text-sm">
                Taxfy is not a registered tax practitioner, accounting firm, or financial advisor. Our service provides 
                general tax calculation tools and information based on publicly available tax laws and regulations. 
                We do not provide personalized tax advice, and our calculations should not be considered as such.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Accuracy Disclaimer</h3>
              <p className="text-sm">
                While we strive to provide accurate calculations based on current South African tax laws, we cannot 
                guarantee the accuracy, completeness, or timeliness of our calculations. Tax laws are complex and 
                subject to change. You are responsible for verifying all calculations and consulting with qualified 
                professionals when necessary.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Service Availability</h3>
              <p className="text-sm">
                We aim to provide continuous service availability but cannot guarantee uninterrupted access. 
                Our service may be temporarily unavailable due to maintenance, updates, or technical issues. 
                We are not liable for any losses resulting from service interruptions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Our Rights</h3>
              <p className="text-sm">
                All content, features, and functionality of our service, including but not limited to text, graphics, 
                logos, software, and algorithms, are owned by Taxfy and protected by South African and international 
                copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
              <p className="text-sm">
                You retain ownership of all personal information and documents you upload to our service. 
                By using our service, you grant us a limited license to process your information solely for 
                the purpose of providing our tax calculation services.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">License to Use</h3>
              <p className="text-sm">
                We grant you a limited, non-exclusive, non-transferable license to access and use our service 
                for personal or business purposes in accordance with these Terms. This license does not include 
                the right to resell, redistribute, or create derivative works.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Payment and Subscription Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Subscription Plans</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Free Plan:</strong> Limited features with basic tax calculations</li>
                <li>• <strong>Pro Plan:</strong> Enhanced features including document vault and priority support</li>
                <li>• <strong>Practitioner Plan:</strong> Professional features for tax practitioners and firms</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Terms</h3>
              <ul className="space-y-2 text-sm">
                <li>• Subscription fees are billed in advance on a monthly or annual basis</li>
                <li>• All fees are in US Dollars (USD) and exclude applicable taxes</li>
                <li>• Payment is due immediately upon subscription or renewal</li>
                <li>• We accept major credit cards and electronic fund transfers</li>
                <li>• Failed payments may result in service suspension</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Refund Policy</h3>
              <ul className="space-y-2 text-sm">
                <li>• Monthly subscriptions: 7-day money-back guarantee for first-time subscribers</li>
                <li>• Annual subscriptions: 30-day money-back guarantee for first-time subscribers</li>
                <li>• Refunds are processed within 5-10 business days</li>
                <li>• No refunds for partial months or after the guarantee period</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy and Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. Our collection, use, and protection of your personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• We comply with the Protection of Personal Information Act (POPIA)</li>
              <li>• Your data is encrypted and stored securely</li>
              <li>• We do not sell or share your personal information with third parties</li>
              <li>• You have rights to access, correct, and delete your personal information</li>
              <li>• We retain your data only as long as necessary for our services</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TAXFY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Loss of profits, revenue, or business opportunities</li>
              <li>• Loss of data or information</li>
              <li>• Tax penalties or interest charges</li>
              <li>• Costs of substitute services</li>
              <li>• Any other commercial damages or losses</li>
            </ul>
            <p className="text-sm mt-4">
              Our total liability for any claims arising from or related to these Terms or our service shall not 
              exceed the amount you paid to us in the twelve (12) months preceding the claim.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Termination by You</h3>
              <p className="text-sm">
                You may terminate your account at any time by contacting us or using the account deletion feature 
                in your profile settings. Upon termination, your access to the service will cease immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Termination by Us</h3>
              <p className="text-sm">
                We may terminate or suspend your account immediately if you violate these Terms, engage in 
                fraudulent activity, or for any other reason at our sole discretion. We will provide notice 
                when reasonably possible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Effect of Termination</h3>
              <ul className="space-y-2 text-sm">
                <li>• Your right to access and use the service will cease immediately</li>
                <li>• We may delete your account and data in accordance with our data retention policy</li>
                <li>• You remain liable for any outstanding fees or charges</li>
                <li>• Provisions regarding intellectual property, disclaimers, and limitations of liability survive termination</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Governing Law and Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms are governed by the laws of the Republic of South Africa. Any disputes arising from 
              or relating to these Terms or our service shall be resolved through the following process:
            </p>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li><strong>Informal Resolution:</strong> We encourage you to contact us first to resolve any disputes informally</li>
              <li><strong>Mediation:</strong> If informal resolution fails, disputes may be submitted to mediation</li>
              <li><strong>Arbitration:</strong> Unresolved disputes shall be settled by binding arbitration in Johannesburg</li>
              <li><strong>Court Jurisdiction:</strong> The courts of Johannesburg, South Africa have exclusive jurisdiction</li>
            </ol>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update these Terms from time to time to reflect changes in our service, legal requirements, 
              or business practices. We will notify you of material changes by:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Posting the updated Terms on our website</li>
              <li>• Sending you an email notification</li>
              <li>• Displaying a notice in your account dashboard</li>
            </ul>
            <p className="text-sm mt-4">
              Your continued use of our service after the effective date of any changes constitutes acceptance 
              of the updated Terms. If you do not agree to the changes, you must stop using our service.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have questions about these Terms or need to contact us for any reason, please use the following information:
            </p>
            <div className="space-y-2">
              <span><strong>Email:</strong> legal@taxfy.co.za</span>
            </div>
            <div className="space-y-2">
              <span><strong>Phone:</strong> +27670494876</span>
            </div>
            <div>
              <strong>Postal Address:</strong><br />
              Taxfy (Pty) Ltd<br />
              Legal Department<br />
              PO Box 12345<br />
              Johannesburg, 2000<br />
              South Africa
            </div>
            <div>
              <strong>Company Registration:</strong> 2024/123456/07<br />
              <strong>VAT Number:</strong> 4123456789
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 