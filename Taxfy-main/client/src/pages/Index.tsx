import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Upload, Calculator, FileCheck, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { SEO, createHowToStructuredData } from "@/components/SEO";

export default function Index() {
  const howToSchema = createHowToStructuredData({
    name: "How to Calculate Your SARS Tax Refund",
    description: "Learn how to calculate your South African tax refund in 3 simple steps using Taxfy's free SARS-compliant calculator.",
    image: "https://taxfy.co.za/og-image.jpg",
    steps: [
      {
        name: "Upload Your IRP5 Certificate",
        text: "Upload your IRP5 tax certificate from your employer. Our system securely extracts all necessary tax information including your income, PAYE, and deductions."
      },
      {
        name: "Instant Tax Calculation",
        text: "Our SARS-compliant calculator processes your tax data using the latest 2025/26 tax tables and rebates to accurately calculate your refund amount."
      },
      {
        name: "Get Your Refund Results",
        text: "Receive a detailed breakdown of your tax refund, including explanations and a downloadable report you can use for your SARS eFiling submission."
      }
    ]
  });

  return (
    <>
      <SEO
        title="South African Tax Refund Calculator | Calculate Your SARS Refund Instantly - Taxfy"
        description="Calculate your South African tax refund in minutes with Taxfy. Upload your IRP5 certificate, get instant SARS-compliant tax calculations, and discover how much you're owed. Free, secure, and accurate tax refund calculator for South Africa."
        keywords="South African tax calculator, SARS tax refund calculator, IRP5 tax calculator, calculate tax refund South Africa, SARS refund, tax return calculator, South Africa income tax calculator, how to calculate tax refund, SARS eFiling calculator, tax refund estimator"
        canonical="https://taxfy.co.za"
        structuredData={howToSchema}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  Maximize Your SARS Refund
                </h1>

                <p className="text-2xl md:text-3xl text-muted-foreground">
                  Upload your IRP5. Get your refund in minutes.
                </p>
              </div>

              {/* Single Call-to-Action */}
              <div className="pt-8">
                <Button
                  asChild
                  size="lg"
                  className="text-xl px-12 py-8 h-auto rounded-full hover:scale-105 transition-all duration-200"
                  data-testid="button-calculate"
                >
                  <Link to="/upload">
                    Calculate My Refund
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-muted-foreground pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Private & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>SARS-Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border/40">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How to Calculate Your Tax Refund in 3 Simple Steps
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">1. Upload Your IRP5</h3>
                <p className="text-muted-foreground">
                  Upload your IRP5 tax certificate from your employer. Our system securely extracts all necessary tax information including your income, PAYE, and deductions.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">2. Instant Calculation</h3>
                <p className="text-muted-foreground">
                  Our SARS-compliant calculator processes your tax data using the latest 2025/26 tax tables and rebates to accurately calculate your refund amount.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">3. Get Your Results</h3>
                <p className="text-muted-foreground">
                  Receive a detailed breakdown of your tax refund, including explanations and a downloadable report you can use for your SARS eFiling submission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border/40">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Use Taxfy for Your South African Tax Refund?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 rounded-lg border border-border/40 bg-muted/20">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">SARS-Compliant & Accurate</h3>
                </div>
                <p className="text-muted-foreground">
                  Our tax calculator uses official SARS tax tables, rebates, and thresholds for the 2025/26 tax year. Get accurate refund calculations you can trust when filing with SARS eFiling.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border border-border/40 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Save Time & Money</h3>
                </div>
                <p className="text-muted-foreground">
                  No more manual calculations or expensive tax consultants. Calculate your income tax refund instantly and know exactly what to expect from SARS - completely free.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border border-border/40 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Easy to Understand</h3>
                </div>
                <p className="text-muted-foreground">
                  Complex tax jargon translated into plain English. See exactly how your refund was calculated with clear breakdowns of income, deductions, and PAYE credits.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border border-border/40 bg-muted/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">100% Free & Secure</h3>
                </div>
                <p className="text-muted-foreground">
                  Your tax information is encrypted and never shared. Use our South African tax refund calculator as many times as you need - always free, no hidden costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border/40">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Calculate Your SARS Tax Refund?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of South Africans who trust Taxfy for accurate tax refund calculations
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-6 h-auto rounded-full hover:scale-105 transition-all duration-200"
              data-testid="button-calculate-bottom"
            >
              <Link to="/upload">
                Calculate My Refund Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
