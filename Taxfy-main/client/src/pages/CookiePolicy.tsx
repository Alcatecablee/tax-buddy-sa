import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cookie, Settings, Shield, Eye, Mail, Phone } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Cookie Policy</h1>
          <p className="text-lg text-muted-foreground">
            How we use cookies and similar technologies
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Cookies are small text files that are stored on your device when you visit our website. They help us 
              provide you with a better experience by remembering your preferences, keeping you logged in, and 
              helping us understand how you use our service.
            </p>
            <p>
              This Cookie Policy explains what cookies we use, why we use them, and how you can control them. 
              By using our website, you consent to our use of cookies as described in this policy.
            </p>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Types of Cookies We Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">Essential Cookies</h3>
              <p className="text-sm mb-3">
                These cookies are necessary for our website to function properly and cannot be disabled.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Authentication:</strong> Keep you logged in to your account</li>
                <li>• <strong>Security:</strong> Protect against cross-site request forgery (CSRF) attacks</li>
                <li>• <strong>Session Management:</strong> Maintain your session state across pages</li>
                <li>• <strong>Load Balancing:</strong> Ensure optimal server performance</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">Functional Cookies</h3>
              <p className="text-sm mb-3">
                These cookies enhance your experience by remembering your preferences and settings.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Theme Preferences:</strong> Remember your dark/light mode preference</li>
                <li>• <strong>Language Settings:</strong> Store your preferred language</li>
                <li>• <strong>Form Data:</strong> Remember information you've entered in forms</li>
                <li>• <strong>Dashboard Layout:</strong> Save your dashboard customizations</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">Analytics Cookies</h3>
              <p className="text-sm mb-3">
                These cookies help us understand how visitors use our website so we can improve it.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Usage Statistics:</strong> Track which pages are visited most often</li>
                <li>• <strong>Performance Monitoring:</strong> Identify slow-loading pages or features</li>
                <li>• <strong>Error Tracking:</strong> Help us identify and fix technical issues</li>
                <li>• <strong>User Journey:</strong> Understand how users navigate through our site</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">Marketing Cookies</h3>
              <p className="text-sm mb-3">
                These cookies are used to deliver relevant advertisements and track campaign effectiveness.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Advertising:</strong> Show you relevant ads on other websites</li>
                <li>• <strong>Campaign Tracking:</strong> Measure the effectiveness of our marketing campaigns</li>
                <li>• <strong>Social Media:</strong> Enable sharing on social media platforms</li>
                <li>• <strong>Retargeting:</strong> Show you ads for features you've shown interest in</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Specific Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Specific Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Cookie Name</th>
                    <th className="text-left p-2">Purpose</th>
                    <th className="text-left p-2">Duration</th>
                    <th className="text-left p-2">Type</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="p-2 font-mono">taxfy_session</td>
                    <td className="p-2">Maintains your login session</td>
                    <td className="p-2">Session</td>
                    <td className="p-2">Essential</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono">csrf_token</td>
                    <td className="p-2">Security protection</td>
                    <td className="p-2">Session</td>
                    <td className="p-2">Essential</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono">theme_preference</td>
                    <td className="p-2">Remembers dark/light mode</td>
                    <td className="p-2">1 year</td>
                    <td className="p-2">Functional</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono">_ga</td>
                    <td className="p-2">Google Analytics tracking</td>
                    <td className="p-2">2 years</td>
                    <td className="p-2">Analytics</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono">_gid</td>
                    <td className="p-2">Google Analytics session</td>
                    <td className="p-2">24 hours</td>
                    <td className="p-2">Analytics</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono">marketing_consent</td>
                    <td className="p-2">Tracks marketing preferences</td>
                    <td className="p-2">1 year</td>
                    <td className="p-2">Marketing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use some third-party services that may set their own cookies. These services include:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Google Analytics</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We use Google Analytics to understand how visitors use our website.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Purpose: Website analytics and performance monitoring</li>
                  <li>• Data collected: Page views, session duration, user interactions</li>
                  <li>• Privacy policy: <a href="https://policies.google.com/privacy" className="text-primary hover:underline">Google Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Supabase</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Our authentication and database provider may set cookies for security and functionality.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Purpose: Authentication and secure data storage</li>
                  <li>• Data collected: Authentication tokens, session information</li>
                  <li>• Privacy policy: <a href="https://supabase.com/privacy" className="text-primary hover:underline">Supabase Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Processors</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Payment processing services may set cookies during checkout.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Purpose: Secure payment processing and fraud prevention</li>
                  <li>• Data collected: Payment information, transaction details</li>
                  <li>• Providers: Stripe, PayFast (see their respective privacy policies)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Managing Your Cookie Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Browser Settings</h3>
              <p className="text-sm mb-3">
                You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li>• <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li>• <strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li>• <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Cookie Consent</h3>
              <p className="text-sm mb-3">
                When you first visit our website, you'll see a cookie consent banner. You can:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Accept all cookies for the full website experience</li>
                <li>• Customize your preferences to choose which types of cookies to allow</li>
                <li>• Reject non-essential cookies (some features may not work properly)</li>
                <li>• Change your preferences at any time through the cookie settings in your account</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Opt-Out Options</h3>
              <p className="text-sm mb-3">
                You can opt out of specific tracking services:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                <li>• <strong>Advertising:</strong> <a href="http://www.youronlinechoices.com/" className="text-primary hover:underline">Your Online Choices</a></li>
                <li>• <strong>Do Not Track:</strong> Enable "Do Not Track" in your browser settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Impact of Disabling Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Impact of Disabling Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              While you can disable cookies, doing so may affect your experience on our website:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Essential Cookies:</strong> Disabling these will prevent you from logging in and using core features</li>
              <li>• <strong>Functional Cookies:</strong> You'll need to reset preferences each time you visit</li>
              <li>• <strong>Analytics Cookies:</strong> We won't be able to improve our service based on usage data</li>
              <li>• <strong>Marketing Cookies:</strong> You may see less relevant advertisements</li>
            </ul>
            <p className="text-sm mt-4">
              We recommend allowing at least essential and functional cookies for the best experience.
            </p>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. 
              When we make changes, we will:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Update the "Last updated" date at the top of this policy</li>
              <li>• Notify you through our website or email if the changes are significant</li>
              <li>• Request your consent again if required by law</li>
            </ul>
            <p className="text-sm mt-4">
              We encourage you to review this policy periodically to stay informed about how we use cookies.
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
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="space-y-2">
              <span><strong>Email:</strong> privacy@taxfy.co.za</span>
            </div>
            <div className="space-y-2">
              <span><strong>Phone:</strong> +27670494876</span>
            </div>
            <div>
              <strong>Postal Address:</strong><br />
              Taxfy (Pty) Ltd<br />
              Privacy Team<br />
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