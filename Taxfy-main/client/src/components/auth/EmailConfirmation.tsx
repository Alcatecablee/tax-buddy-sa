import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface EmailConfirmationProps {
  email?: string;
  onBack?: () => void;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  email: initialEmail,
  onBack,
}) => {
  const [email, setEmail] = useState(initialEmail || "");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const { toast } = useCustomToast();

  const resendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend confirmation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResent(true);
        toast({
          title: "Email Sent!",
          description: "Please check your inbox for the confirmation link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend confirmation email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/logo-ta.png"
                alt="Taxfy Logo"
                className="h-12 w-12 object-contain animate-bounce-subtle"
              />
            </div>
            <div className="flex justify-center mb-4">
              {resent ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <Mail className="w-12 h-12 text-blue-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {resent ? "Email Sent!" : "Check Your Email"}
            </CardTitle>
            <CardDescription>
              {resent
                ? "A new confirmation email has been sent to your inbox."
                : "We've sent a confirmation link to your email address. Please click the link to verify your account."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!resent && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Didn't receive the email?</strong> Check your spam
                  folder or request a new confirmation email below.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Button
                onClick={resendConfirmation}
                disabled={loading || !email}
                className="w-full"
                variant={resent ? "outline" : "default"}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {resent ? "Send Another Email" : "Resend Confirmation Email"}
              </Button>

              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Back to Sign In
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                After clicking the confirmation link in your email, you can
                return to the{" "}
                <a href="/signin" className="underline hover:text-foreground">
                  sign in page
                </a>{" "}
                to access your account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmation;
