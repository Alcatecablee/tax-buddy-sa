import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Calculator,
  FileText,
  Search,
  RefreshCw,
} from "lucide-react";
import { TaxfyLogo } from "@/components/ui/taxfy-logo";

const NotFound = () => {
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          window.location.replace("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [location.pathname]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <Card className="glass border-border/50 overflow-hidden">
          <CardHeader className="text-center pb-6">
            {/* 404 Animation */}
            <div className="flex justify-center mb-6">
              <div className="text-8xl font-bold text-primary animate-pulse">
                404
              </div>
            </div>

            <CardTitle className="text-3xl font-bold mb-4 text-foreground">
              Oops! Page Not Found
            </CardTitle>

            <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for seems to have wandered off into the
              tax code wilderness. Don't worry, we'll help you find your way
              back!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-card/30 border-border/50 hover:bg-card/50 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/assets/logo-ta.png"
                      alt="Taxfy Logo"
                      className="h-12 w-12 object-contain animate-bounce-subtle"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">Calculate Tax</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your IRP5 and get instant tax calculations
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link to="/upload">Start Calculating</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50 hover:bg-card/50 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                    <FileText className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Manual Entry</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter your tax information manually
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link to="/manual-entry">Enter Manually</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Error Details */}
            <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    What happened?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You tried to access:{" "}
                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                      {location.pathname}
                    </code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This page doesn't exist or may have been moved. Try one of
                    the options above or return to the homepage.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="border-border/50 hover:bg-muted/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.reload()}
                className="border-border/50 hover:bg-muted/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Auto-redirect notice */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-primary">
                  Redirecting to home in {countdown} seconds
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taxfy Branding */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Calculator className="w-5 h-5" />
            <span className="font-semibold">Taxfy</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            South African Tax Calculator & Assistant
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
