import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Scale, FileText, Shield, Mail, Phone } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Disclaimer</h1>
          <p className="text-lg text-muted-foreground">
            Important legal disclaimers and limitations
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Important Notice */}
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-700 dark:text-yellow-300">
              <strong>Taxfy is not a registered tax practitioner, accounting firm, or financial advisor.</strong> 
              We provide general tax calculation tools and information based on publicly available South African tax laws. 
              Our service should not be considered as professional tax advice.
            </p>
            <p className="text-yellow-700 dark:text-yellow-300">
              For complex tax matters, personalized advice, or official tax submissions, please consult with a 
              qualified tax professional or registered tax practitioner.
            </p>
          </CardContent>
        </Card>

        {/* General Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              General Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The information, tools, and services provided by Taxfy are for general informational and educational 
              purposes only. While we strive to provide accurate and up-to-date information, we make no representations 
              or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, 
              or availability of the information, products, services, or related graphics contained on our website.
            </p>
            <p>
              Any reliance you place on such information is therefore strictly at your own risk. In no event will we 
              be liable for any loss or damage including without limitation, indirect or consequential loss or damage, 
              or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection 
              with, the use of our website or services.
            </p>
          </CardContent>
        </Card>

        {/* Tax Calculation Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tax Calculation Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Accuracy of Calculations</h3>
              <ul className="space-y-2 text-sm">
                <li>• Our tax calculations are estimates based on the information you provide</li>
                <li>• Calculations are based on current South African tax laws and rates as we understand them</li>
                <li>• Tax laws are complex and subject to interpretation and change</li>
                <li>• Individual circumstances may affect the accuracy of calculations</li>
                <li>• We cannot guarantee that our calculations will match official SARS assessments</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Limitations</h3>
              <ul className="space-y-2 text-sm">
                <li>• Our tools may not account for all possible deductions or tax scenarios</li>
                <li>• Complex tax situations may require professional assessment</li>
                <li>• We do not provide advice on tax planning or optimization strategies</li>
                <li>• Our service does not constitute preparation of official tax returns</li>
                <li>• We are not responsible for any tax penalties or interest charges</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">User Responsibility</h3>
              <ul className="space-y-2 text-sm">
                <li>• You are responsible for the accuracy of information you provide</li>
                <li>• You should verify all calculations independently</li>
                <li>• You must ensure compliance with all applicable tax laws</li>
                <li>• You should consult a tax professional for complex matters</li>
                <li>• You are responsible for filing accurate tax returns with SARS</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Professional Advice Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Advice Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>No Professional Relationship:</strong> The use of our website and services does not create 
              a professional relationship between you and Taxfy. We are not acting as your tax advisor, accountant, 
              or legal counsel.
            </p>
            <p>
              <strong>Not Personalized Advice:</strong> The information and calculations provided are general in 
              nature and not tailored to your specific financial situation, tax position, or individual circumstances.
            </p>
            <p>
              <strong>Seek Professional Advice:</strong> You should always consult with qualified professionals 
              regarding your specific tax situation, especially for:
            </p>
            <ul className="space-y-2 text-sm mt-4">
              <li>• Complex tax scenarios involving multiple income sources</li>
              <li>• Business tax matters and company structures</li>
              <li>• International tax implications</li>
              <li>• Tax disputes or audits</li>
              <li>• Estate planning and tax implications</li>
              <li>• Investment and capital gains tax matters</li>
            </ul>
          </CardContent>
        </Card>

        {/* Technology Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Technology and Service Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Service Availability</h3>
              <ul className="space-y-2 text-sm">
                <li>• We strive to maintain continuous service availability</li>
                <li>• Services may be temporarily unavailable due to maintenance or technical issues</li>
                <li>• We do not guarantee uninterrupted access to our services</li>
                <li>• System downtime may affect your ability to access your data</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Data Security</h3>
              <ul className="space-y-2 text-sm">
                <li>• We implement security measures to protect your data</li>
                <li>• No system is completely secure from all threats</li>
                <li>• You are responsible for maintaining the security of your account</li>
                <li>• We recommend using strong passwords and secure internet connections</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Third-Party Services</h3>
              <ul className="space-y-2 text-sm">
                <li>• We may use third-party services for various functions</li>
                <li>• We are not responsible for the performance of third-party services</li>
                <li>• Third-party services have their own terms and privacy policies</li>
                <li>• Service interruptions may be beyond our control</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Legal Compliance Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle>Legal Compliance Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>SARS Compliance:</strong> While our calculations are based on South African Revenue Service (SARS) 
              tax laws and regulations, we are not affiliated with or endorsed by SARS. Our service does not constitute 
              official tax advice or submissions to SARS.
            </p>
            <p>
              <strong>Regulatory Changes:</strong> Tax laws and regulations change frequently. We endeavor to keep our 
              information current, but there may be delays in updating our systems to reflect the latest changes. 
              You should verify current tax laws and rates independently.
            </p>
            <p>
              <strong>Jurisdiction:</strong> Our service is designed for South African tax law. If you are subject to 
              tax laws in other jurisdictions, our calculations may not be applicable to your situation.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TAXFY, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, 
              AND SUPPLIERS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Any direct, indirect, incidental, special, or consequential damages</li>
              <li>• Loss of profits, revenue, data, or business opportunities</li>
              <li>• Tax penalties, interest charges, or additional assessments</li>
              <li>• Errors or omissions in calculations or information</li>
              <li>• Service interruptions or technical failures</li>
              <li>• Actions taken based on information from our service</li>
              <li>• Third-party actions or services</li>
            </ul>
            <p className="text-sm mt-4">
              Our total liability for any claims shall not exceed the amount you paid for our services 
              in the twelve (12) months preceding the claim.
            </p>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card>
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You agree to indemnify, defend, and hold harmless Taxfy and its officers, directors, employees, 
              agents, and suppliers from and against any claims, liabilities, damages, judgments, awards, 
              losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or 
              relating to:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Your use of our services</li>
              <li>• Your violation of these terms or applicable laws</li>
              <li>• Your tax filings or submissions to SARS</li>
              <li>• Any inaccurate information you provide</li>
              <li>• Any third-party claims related to your use of our services</li>
            </ul>
          </CardContent>
        </Card>

        {/* Updates and Changes */}
        <Card>
          <CardHeader>
            <CardTitle>Updates and Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to update this disclaimer at any time without prior notice. Changes will be 
              effective immediately upon posting on our website. Your continued use of our services after any 
              changes constitutes acceptance of the updated disclaimer.
            </p>
            <p>
              We recommend reviewing this disclaimer periodically to stay informed of any changes that may 
              affect your use of our services.
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
              If you have questions about this disclaimer or our services, please contact us:
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 