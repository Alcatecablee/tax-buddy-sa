import React, { useState, useEffect } from "react";
import {
  Check,
  Star,
  Shield,
  Users,
  Code,
  ArrowRight,
  LogIn,
  Calculator,
  Building,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { CustomNotificationManager } from "@/components/ui/custom-notification";
import { useNavigate } from "react-router-dom";
import { PRICING_CONFIG, PricingPlan } from "@/types/pricing";
import { useAuth } from "@/contexts/AuthContext";
import { AuthButton } from "@/components/auth/AuthButton";

const Pricing: React.FC = () => {
  const { toast, toasts, removeToast } = useCustomToast();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const isSignedIn = !!user;
  const isLoaded = !loading;

  // SEO Meta tags
  useEffect(() => {
    document.title = "Taxfy Pricing - SARS Tax Calculator Plans | South Africa";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Choose the right Taxfy plan for your SARS tax needs. Free calculator, professional tools, and enterprise solutions. Transparent ZAR pricing with PayPal checkout.",
      );
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        "taxfy pricing, sars tax calculator cost, south africa tax software, irp5 processing, tax professional tools",
      );
    }

    // Open Graph tags
    const metaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    metaProperty("og:title", "Taxfy Pricing - SARS Tax Calculator Plans");
    metaProperty(
      "og:description",
      "Transparent pricing for South African tax calculations. From free basic calculator to enterprise solutions.",
    );
    metaProperty("og:type", "website");
    metaProperty("og:url", window.location.href);

    return () => {
      document.title = "Taxfy - SARS Tax Calculator";
    };
  }, []);

  // Organize plans by category
  const individualPlans = Object.values(PRICING_CONFIG).filter(
    (plan) => plan.category === "individual",
  );
  const businessPlans = Object.values(PRICING_CONFIG).filter(
    (plan) => plan.category === "business",
  );
  const apiPlans = Object.values(PRICING_CONFIG).filter(
    (plan) => plan.category === "api",
  );

  const handleUpgrade = async (plan: PricingPlan) => {
    console.log("💳 Pricing handleUpgrade called with plan:", plan);
    setProcessing(plan.id);

    try {
      if (plan.id === "free") {
        // Redirect to free calculator
        toast({
          title: "Free Calculator Access! 🎉",
          description: "Access our free tax calculator - no signup required!",
        });
        navigate("/upload");
        return;
      }

      // Check if user is signed in for paid plans
      if (!isSignedIn) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to subscribe to a premium plan.",
          variant: "default",
        });
        setProcessing(null);
        return;
      }

      if (
        plan.id === "business" ||
        plan.id === "enterprise_pro" ||
        plan.id === "enterprise_elite"
      ) {
        // Contact sales for enterprise plans
        toast({
          title: "Contact Sales",
          description: `Our sales team will contact you within 24 hours to discuss your ${plan.name} needs.`,
        });

        // You could also redirect to a contact form or open a modal
        // navigate("/contact");
        setProcessing(null);
        return;
      }

      if (plan.id === "api") {
        // Redirect to API documentation/setup
        toast({
          title: "API Access Setup",
          description: "Redirecting to API documentation and key setup...",
        });
        // navigate("/api-docs");
        setProcessing(null);
        return;
      }

      // For starter and pro plans, implement subscription logic
      if (plan.id === "starter" || plan.id === "pro") {
        toast({
          title: "Redirecting to Payment",
          description: `Setting up your ${plan.name} subscription. You'll be redirected to PayPal...`,
        });

        try {
          // Import PayPal manager dynamically
          const { EnhancedPaymentManager } = await import("@/lib/paypal");
          const paymentManager = new EnhancedPaymentManager();

          const paymentData = {
            amount: plan.price,
            currency: plan.currency,
            description: `${plan.name} Plan - Monthly Subscription`,
            userId: user?.id,
            planId: plan.id,
            planName: plan.name,
            isRecurring: true,
            billingCycle: "monthly" as const,
            customerEmail: user?.email,
            customerName: user?.user_metadata?.full_name,
          };

          const result = await paymentManager.processPayment(
            "paypal",
            paymentData,
          );

          if (result.success && result.redirectUrl) {
            // Redirect to PayPal for payment
            window.location.href = result.redirectUrl;
          } else {
            throw new Error(result.error || "Payment setup failed");
          }
        } catch (paymentError) {
          console.error("Payment setup error:", paymentError);

          let errorMessage =
            "Unable to set up payment. Please try again or contact support.";
          let errorTitle = "Payment Setup Failed";

          // Handle specific PayPal errors
          if (paymentError instanceof Error) {
            const errorMsg = paymentError.message.toLowerCase();

            if (errorMsg.includes("credentials not configured")) {
              errorTitle = "Payment System Unavailable";
              errorMessage =
                "Our payment system is temporarily unavailable. Please try again later or contact support.";
            } else if (errorMsg.includes("currency")) {
              errorTitle = "Currency Issue";
              errorMessage =
                "There's an issue with currency conversion. Please contact support for assistance.";
            } else if (
              errorMsg.includes("network") ||
              errorMsg.includes("fetch")
            ) {
              errorTitle = "Connection Error";
              errorMessage =
                "Network connection issue. Please check your internet connection and try again.";
            } else if (errorMsg.includes("validation")) {
              errorTitle = "Validation Error";
              errorMessage =
                "Payment validation failed. Please verify your details and try again.";
            }
          }

          toast({
            title: errorTitle,
            description: errorMessage,
            variant: "destructive",
          });
        }

        return;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Error",
        description:
          "There was an issue setting up your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setProcessing(null), 2000);
    }
  };

  const PlanCard = ({ plan }: { plan: PricingPlan }) => (
    <Card
      key={plan.id}
      className={`relative border border-border transition-all duration-300 hover:shadow-lg ${plan.popular ? "border-primary ring-2 ring-primary/20" : ""}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
            {plan.badge || "Most Popular"}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-6">
        <CardTitle className="text-xl font-semibold text-foreground">
          {plan.name}
        </CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold text-foreground">
            {plan.currency} {plan.price}
          </span>
          <span className="text-muted-foreground text-base">
            {plan.billing === "monthly"
              ? "/month"
              : plan.billing === "per-use"
                ? "/page"
                : plan.billing === "per-document"
                  ? "/document"
                  : ""}
          </span>
          {plan.currency === "ZAR" && plan.price > 0 && (
            <div className="mt-1">
              <span className="text-sm text-muted-foreground">
                ≈ USD ${(plan.price * 0.055).toFixed(0)}
                {plan.billing === "monthly"
                  ? "/month"
                  : plan.billing === "per-use"
                    ? "/page"
                    : plan.billing === "per-document"
                      ? "/document"
                      : ""}
              </span>
            </div>
          )}
          {plan.trialPeriodMonths && (
            <div className="mt-2">
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-600 border-green-500/20"
              >
                {plan.trialPeriodMonths}-month free trial
              </Badge>
            </div>
          )}
        </div>
        <CardDescription className="mt-3 text-muted-foreground">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{feature.name}</span>
            </li>
          ))}
        </ul>

        {/* Show sign-in button for paid plans if user not signed in */}
        {!isSignedIn && plan.id !== "free" ? (
          <div className="w-full">
            <AuthButton />
          </div>
        ) : (
          <Button
            className="w-full transition-all duration-200"
            size="lg"
            onClick={() => handleUpgrade(plan)}
            disabled={
              processing === plan.id || (plan.id === "free" && !isSignedIn)
            }
            variant={
              plan.popular
                ? "default"
                : plan.id === "free"
                  ? "secondary"
                  : "outline"
            }
            aria-label={`${plan.cta} for ${plan.name} plan - ${plan.currency} ${plan.price}${plan.billing === "monthly" ? " per month" : plan.billing === "per-use" ? " per page" : ""}`}
          >
            {processing === plan.id ? (
              <div className="flex items-center gap-2" aria-live="polite">
                <div
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                  aria-hidden="true"
                ></div>
                <span>Processing...</span>
              </div>
            ) : (
              <>
                {plan.id !== "free" && (
                  <ArrowRight className="w-4 h-4 mr-2" aria-hidden="true" />
                )}
                {plan.cta}
              </>
            )}
          </Button>
        )}

        {plan.id === "free" ? (
          <p className="text-xs text-muted-foreground text-center mt-3">
            No credit card required
          </p>
        ) : plan.id === "business" ? (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Custom pricing • Enterprise support
          </p>
        ) : plan.billing === "per-use" || plan.billing === "per-document" ? (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Pay only for what you use • No monthly commitment
          </p>
        ) : (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Cancel anytime • No long-term commitment
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Maximize Your SARS Refund with the Right Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that helps you maximize your SARS refund. Start
              free, upgrade anytime. No hidden fees.
            </p>

            {/* Speed and Currency highlights */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent rounded-full border">
                <Zap
                  className="w-5 h-5 text-primary animate-pulse"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">
                  ⚡ AI processes IRP5s in under 30 seconds
                </span>
              </div>

              <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted rounded-full border">
                <span className="text-sm font-medium">
                  💳 ZAR pricing • PayPal auto-converts to USD (≈1 ZAR = $0.055)
                </span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-12 text-center">
              <div className="flex flex-col sm:flex-row gap-8 items-center justify-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Bank-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Trusted by 10,000+ users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.8/5 rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>SARS compliant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Individual Plans */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  Individual Plans
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Perfect for individuals and tax practitioners
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {individualPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            {/* Plan Comparison Table */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">
                  Compare Individual Plans
                </h3>
                <p className="text-muted-foreground">
                  See what's included with each plan
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 font-semibold">Features</th>
                      {individualPlans.map((plan) => (
                        <th
                          key={plan.id}
                          className="text-center p-4 font-semibold"
                        >
                          {plan.name}
                          <div className="text-sm font-normal text-muted-foreground mt-1">
                            {plan.currency} {plan.price}
                            {plan.billing === "monthly" ? "/mo" : ""}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-4 font-medium">IRP5 Uploads</td>
                      <td className="p-4 text-center">2 documents</td>
                      <td className="p-4 text-center">Unlimited</td>
                      <td className="p-4 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-t border-border bg-muted/20">
                      <td className="p-4 font-medium">Tax Calculations</td>
                      <td className="p-4 text-center">
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-4 font-medium">PDF Reports</td>
                      <td className="p-4 text-center">Basic</td>
                      <td className="p-4 text-center">Unlimited</td>
                      <td className="p-4 text-center">White-label</td>
                    </tr>
                    <tr className="border-t border-border bg-muted/20">
                      <td className="p-4 font-medium">Document Storage</td>
                      <td className="p-4 text-center">5 documents</td>
                      <td className="p-4 text-center">Unlimited</td>
                      <td className="p-4 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-4 font-medium">Client Management</td>
                      <td className="p-4 text-center">-</td>
                      <td className="p-4 text-center">-</td>
                      <td className="p-4 text-center">
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-t border-border bg-muted/20">
                      <td className="p-4 font-medium">Support</td>
                      <td className="p-4 text-center">Email</td>
                      <td className="p-4 text-center">Email (48h)</td>
                      <td className="p-4 text-center">Priority (4h)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-4 font-medium">API Access</td>
                      <td className="p-4 text-center">-</td>
                      <td className="p-4 text-center">-</td>
                      <td className="p-4 text-center">1000 calls/month</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Business Plans */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building className="w-6 h-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  Enterprise Plans
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Enterprise-grade solutions for large organizations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {businessPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            {/* Enterprise Value Proposition */}
            <div className="mt-16 text-center">
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold">Why Choose Enterprise?</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold">
                      AI-Powered Optimization
                    </h4>
                    <p className="text-muted-foreground">
                      Advanced AI algorithms identify tax savings opportunities
                      worth R850,000+ annually
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold">
                      Enterprise Security
                    </h4>
                    <p className="text-muted-foreground">
                      Dedicated infrastructure, blockchain audit trails, and SOC
                      2 Type II compliance
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold">Dedicated Support</h4>
                    <p className="text-muted-foreground">
                      24/7 phone support, dedicated account manager, and
                      quarterly business reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Integration */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Code className="w-6 h-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  API Integration
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Pay-per-use API for developers and fintech applications
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-8 max-w-md mx-auto mb-16">
              {apiPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Why Choose TaxFy?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Bank-Grade Security</h3>
                <p className="text-muted-foreground">
                  Your financial data is encrypted and secure. We never store
                  sensitive information.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Trusted by Thousands</h3>
                <p className="text-muted-foreground">
                  Join thousands of South Africans who trust TaxFy with their
                  tax calculations.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Process your IRP5 in seconds, not hours. Our AI-powered engine
                  extracts data instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Common questions about Taxfy pricing and features
              </p>
            </div>

            <div className="grid gap-6 max-w-3xl mx-auto">
              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Why are prices in ZAR but payments in USD?
                </h3>
                <p className="text-muted-foreground">
                  We price in South African Rand to make costs transparent for
                  our local users. PayPal automatically converts ZAR to USD at
                  checkout using real-time exchange rates (approximately 1 ZAR =
                  $0.055 USD).
                </p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-muted-foreground">
                  Yes! All subscriptions can be cancelled anytime with no
                  cancellation fees. You'll continue to have access to your plan
                  until the end of your billing period.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  What's included in the Enterprise 3-month free trial?
                </h3>
                <p className="text-muted-foreground">
                  The Enterprise Solution includes a full 3-month free trial
                  with access to all enterprise features: unlimited users,
                  custom workflow automation, dedicated account manager, and
                  priority support.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Is my financial data secure?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely. We use bank-grade encryption, never store
                  sensitive information permanently, and are fully compliant
                  with South African data protection regulations. Your IRP5 data
                  is processed securely and deleted after processing.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can change your plan anytime. Upgrades take effect
                  immediately, while downgrades take effect at your next billing
                  cycle. You'll be charged/credited the prorated difference.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Do you offer refunds?
                </h3>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee for all paid plans. If
                  you're not satisfied, contact our support team for a full
                  refund within 30 days of your first payment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Your SARS Refund?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start with our free plan and discover how much you can save. Get
              your SARS refund today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8"
                onClick={() => {
                  toast({
                    title: "Coming Soon! 🚀",
                    description:
                      "User accounts will be available soon. For now, try our free tax calculator!",
                  });
                  navigate("/manual-entry");
                }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8"
                onClick={() => navigate("/manual-entry")}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Try Calculator
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Custom Notification Manager */}
      <CustomNotificationManager toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Pricing;
