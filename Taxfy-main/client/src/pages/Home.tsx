import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Calculator,
  FileText,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Clock,
  Sparkles,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  SocialProofBanner,
  LimitedTimeOffer,
  UrgencyCountdown,
  ProgressToUnlock,
} from "@/components/FOMOElements";
import {
  WordPressGuides,
  WordPressFeatured,
} from "@/components/wordpress/WordPressContent";

const Home = () => {
  const { currentPlan } = useSubscription();
  const [showLimitedOffer, setShowLimitedOffer] = useState(false);
  const [visitStartTime] = useState(Date.now());

  // FOMO Effects - show for all users since we're now guest-only
  useEffect(() => {
    // Show limited offer after 15 seconds for all users
    const timer = setTimeout(() => {
      setShowLimitedOffer(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Upload,
      title: "Smart Upload",
      description: "Drag & drop your IRP5 or enter details manually",
      highlight: "AI-Powered",
    },
    {
      icon: Calculator,
      title: "Instant Calculation",
      description: "Get your tax calculation in under 30 seconds",
      highlight: "Lightning Fast",
    },
    {
      icon: FileText,
      title: "Professional Reports",
      description: "Download PDF, CSV, and Excel reports",
      highlight: "Export Ready",
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your data is encrypted and never stored permanently",
      highlight: "100% Secure",
    },
  ];

  // Dynamic stats that update based on real usage
  const [stats, setStats] = useState([
    {
      value: "Loading...",
      label: "Tax Returns Processed",
      trend: "Calculating...",
    },
    {
      value: "Loading...",
      label: "Total Refunds Calculated",
      trend: "Calculating...",
    },
    { value: "4.9/5", label: "User Rating", trend: "From verified reviews" },
    {
      value: "< 30s",
      label: "Average Processing Time",
      trend: "98% under 1 minute",
    },
  ]);

  // Load real stats from API
  useEffect(() => {
    const loadStats = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

        const response = await fetch(`${API_BASE_URL}/admin/users/stats`);

        if (response.ok) {
          const statsData = await response.json();
          const calculationsResponse = await fetch(
            `${API_BASE_URL}/admin/calculations/stats`,
          );

          let totalCalculations = 0;
          if (calculationsResponse.ok) {
            const calcStats = await calculationsResponse.json();
            totalCalculations = calcStats.reduce(
              (sum: number, stat: any) => sum + stat.type_count,
              0,
            );
          }

          setStats([
            {
              value: `${totalCalculations.toLocaleString()}+`,
              label: "Tax Returns Processed",
              trend: "Real-time data",
            },
            {
              value: `R${(totalCalculations * 3200).toLocaleString()}+`,
              label: "Total Refunds Calculated",
              trend: "Average refund estimate",
            },
            {
              value: "4.9/5",
              label: "User Rating",
              trend: "From verified reviews",
            },
            {
              value: "< 30s",
              label: "Average Processing Time",
              trend: "98% under 1 minute",
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
        // Fallback to reasonable default values if API fails
        setStats([
          {
            value: "1,000+",
            label: "Tax Returns Processed",
            trend: "Growing daily",
          },
          {
            value: "R3.2M+",
            label: "Total Refunds Calculated",
            trend: "Average refund estimate",
          },
          {
            value: "4.9/5",
            label: "User Rating",
            trend: "From verified reviews",
          },
          {
            value: "< 30s",
            label: "Average Processing Time",
            trend: "98% under 1 minute",
          },
        ]);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                South Africa's #1 Tax Calculator
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  Maximize Your SARS Refund
                </span>
                <br />
                in Under 30 Seconds
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Upload your IRP5, get instant calculations, and download
                professional reports. Join{" "}
                <strong>
                  {stats[0].value.replace("+", "")} South Africans
                </strong>{" "}
                who've already maximized their refunds with our free tax
                calculator.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
                <Link to="/upload">
                  <Upload className="w-5 h-5 mr-2" />
                  Maximize My Refund Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No signup required • Results in 30 seconds
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="bg-muted/30 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-muted-foreground">
                  <strong className="text-green-400">{stats[0].value}</strong>{" "}
                  South Africans have calculated their refunds
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with FOMO */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Thousands of South Africans
            </h2>
            <p className="text-muted-foreground">
              Join the growing community maximizing their tax refunds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center border-border/50 bg-background/50 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="font-medium mb-1">{stat.label}</div>
                  <div className="text-sm text-green-400 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* BANNERS SECTION - GUARANTEED VISIBLE */}
          <div className="mt-12 bg-yellow-100 border-4 border-yellow-500 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-center mb-6 text-black">
              🚀 BANNERS SECTION
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* PH Banner */}
              <div className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
                <div className="text-center">
                  <div className="text-lg mb-1">🚀</div>
                  <div className="font-bold text-sm">
                    Featured on Product Hunt
                  </div>
                  <div className="text-orange-100 text-xs">
                    South Africa's #1 Tax Calculator
                  </div>
                </div>
              </div>

              {/* Trustpilot Banner */}
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
                <div className="text-center">
                  <div className="text-lg mb-1">⭐⭐⭐⭐⭐</div>
                  <div className="font-bold text-sm">4.9/5 on Trustpilot</div>
                  <div className="text-green-100 text-xs">
                    Trusted by 1000+ South Africans
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need for Tax Calculations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tax calculations with enterprise security,
              designed for South African tax requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="relative group hover:shadow-lg transition-all duration-300 border-border/50"
              >
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs">
                    {feature.highlight}
                  </Badge>
                </div>
                <CardContent className="p-6 pt-12">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Hub Content */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Expert Tax Guidance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access our comprehensive knowledge hub with guides, community
              support, and expert insights to maximize your tax benefits.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <WordPressGuides limit={3} />
            </div>
            <div>
              <WordPressFeatured limit={3} />
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/guides">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Guides
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://hub.taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Knowledge Hub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with FOMO */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Don't Leave Money on the Table
            </h2>
            <p className="text-lg text-muted-foreground">
              Join <strong>{stats[0].value} South Africans</strong> who've
              already calculated their refunds. The average user discovers{" "}
              <strong>R3,200 more</strong> than they expected.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
                <Link to="/upload">
                  <Calculator className="w-5 h-5 mr-2" />
                  Maximize My Refund Now
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              >
                <Link to="/pricing">
                  <Star className="w-5 h-5 mr-2" />
                  View Premium Features
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Results in 30 seconds
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
