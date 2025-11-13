import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Chrome, Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmailConfirmation from "@/components/auth/EmailConfirmation";

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState("");
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    user,
  } = useAuth();
  const { toast } = useCustomToast();
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (error) {
        let errorMessage =
          error?.message ||
          JSON.stringify(error) ||
          "An unknown error occurred";
        let errorTitle = "Authentication Error";

        // Provide helpful error messages
        if (errorMessage.includes("Invalid login credentials")) {
          errorTitle = "Invalid Credentials";
          errorMessage =
            "The email or password is incorrect. Please check your credentials and try again.";
        } else if (errorMessage.includes("Email not confirmed")) {
          errorTitle = "Email Not Confirmed";
          errorMessage =
            "Please check your email and click the confirmation link before signing in.";

          // Show email confirmation component
          setPendingConfirmationEmail(email);
          setShowEmailConfirmation(true);
          setLoading(false);
          return;
        } else if (errorMessage.includes("Too many requests")) {
          errorTitle = "Too Many Attempts";
          errorMessage =
            "Too many sign-in attempts. Please wait a few minutes and try again.";
        } else if (
          errorMessage.includes("Invalid API key") ||
          errorMessage.includes("API key") ||
          errorMessage.includes("Authentication service unavailable")
        ) {
          errorTitle = "Configuration Error";
          errorMessage =
            "Authentication is not properly configured. Please contact support.";
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: isSignUp ? "Account Created!" : "Welcome back!",
          description: isSignUp
            ? "Please check your email to verify your account."
            : "You have been successfully signed in.",
        });

        // Clear form
        setEmail("");
        setPassword("");

        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show email confirmation screen if needed
  if (showEmailConfirmation) {
    return (
      <EmailConfirmation
        email={pendingConfirmationEmail}
        onBack={() => setShowEmailConfirmation(false)}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            {isSignUp ? "Create Account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSignUp
              ? "Create a new account to access all features"
              : "Sign in to your account to continue"}
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <img
                src="/assets/logo-ta.png"
                alt="Taxfy Logo"
                className="h-12 w-12 object-contain animate-bounce-subtle"
              />
            </div>
            <CardTitle className="text-2xl text-center">
              {isSignUp ? "Get Started" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp
                ? "Join thousands of users managing their taxes efficiently"
                : "Enter your credentials to access your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                className="text-sm"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            to="/terms-of-service"
            className="underline hover:text-foreground"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy-policy"
            className="underline hover:text-foreground"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
