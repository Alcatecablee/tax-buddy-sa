import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MailX, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    
    try {
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from our mailing list.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'There was an error processing your request. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('There was an error connecting to our servers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Unsubscribe - Taxfy</title>
        <meta name="description" content="Unsubscribe from Taxfy email communications. We respect your privacy and make it easy to opt out." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <MailX className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold">Unsubscribe</h1>
            <p className="text-lg text-muted-foreground">
              We're sorry to see you go! Manage your email preferences below.
            </p>
          </div>

          {/* Unsubscribe Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Unsubscribe from Our Mailing List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Enter your email address below to unsubscribe from all marketing communications from Taxfy. 
                You will no longer receive updates about tax tips, product updates, or promotional offers.
              </p>

              {status === 'success' && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {status === 'error' && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading || status === 'success'}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading || status === 'success'}
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Unsubscribe'}
                </Button>
              </form>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Please note:</strong> This will only unsubscribe you from marketing emails. 
                  You may still receive important service-related notifications if you have an active account.
                </p>
                <p>
                  If you're having trouble with this form, you can also email us directly at{' '}
                  <a href="mailto:support@taxfy.co.za" className="text-primary hover:underline">
                    support@taxfy.co.za
                  </a>{' '}
                  with "Unsubscribe" in the subject line.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Not Ready to Leave?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Before you go, consider these alternatives:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium">Reduce Email Frequency</h4>
                    <p className="text-sm text-muted-foreground">
                      Contact us to receive only essential tax season updates instead of all marketing emails.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium">Tax Season Only</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive emails only during tax season (February to July) when you need them most.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium">Educational Content Only</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep receiving valuable tax tips and guides without promotional content.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button variant="outline" asChild>
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">Return to Homepage</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Why We Send Emails */}
          <Card>
            <CardHeader>
              <CardTitle>Why We Send Emails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We believe in keeping you informed about changes that could affect your taxes:
              </p>
              
              <ul className="space-y-2 text-sm">
                <li>• <strong>Tax Law Updates:</strong> Important changes from SARS that affect your returns</li>
                <li>• <strong>Deadline Reminders:</strong> Never miss important tax submission deadlines</li>
                <li>• <strong>Feature Updates:</strong> New tools and improvements to help you save more</li>
                <li>• <strong>Educational Content:</strong> Tips to maximize your refunds and stay compliant</li>
                <li>• <strong>Security Alerts:</strong> Important notifications about your account security</li>
              </ul>
              
              <p className="text-sm text-muted-foreground">
                We respect your inbox and typically send no more than 2-3 emails per month, 
                with increased frequency only during tax season when the information is most valuable.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 