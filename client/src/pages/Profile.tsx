import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, AlertCircle, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please enter an email address');
      setLoading(false);
      return;
    }

    if (email === user?.email) {
      setError('This is already your current email address');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email: email,
    });

    if (error) {
      if (error.message?.includes('reauthenticate') || error.message?.includes('AuthRetryable')) {
        setError('For security, please sign out and sign back in before changing your email address.');
      } else {
        setError(error.message || 'Failed to update email. Please try again.');
      }
      setLoading(false);
      return;
    }
    
    setSuccess('Confirmation email sent to your new address! Please check your inbox and confirm the change. After confirming, sign out and sign back in to see the updated email.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            data-testid="button-back"
            onClick={() => setLocation('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Account Information</h2>
                <p className="text-sm text-muted-foreground">Update your email address</p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-600 dark:text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-email">Current Email</Label>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground" data-testid="text-current-email">
                    {user?.email}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">New Email Address</Label>
                <Input
                  id="email"
                  data-testid="input-email"
                  type="email"
                  placeholder="Enter new email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  You'll receive a confirmation email at your new address
                </p>
              </div>

              <Button
                type="submit"
                data-testid="button-update-email"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Email'}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">User ID</h2>
                <p className="text-sm text-muted-foreground">Your unique identifier</p>
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm text-muted-foreground break-all" data-testid="text-user-id">
                {user?.id}
              </code>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
