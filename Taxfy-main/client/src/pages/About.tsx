import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Shield, 
  Users, 
  Target, 
  Award, 
  TrendingUp,
  CheckCircle,
  Heart,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  Camera,
  FileText,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { SEO } from '@/components/SEO';

const About = () => {
  const features = [
    {
      icon: Camera,
      title: 'Effortless IRP5 Upload & OCR Extraction',
      description: 'Snap a photo or drag-and-drop your IRP5 PDF. Our OCR engine reads every SARS code and amount automatically.'
    },
    {
      icon: BookOpen,
      title: 'Clear, Plain-English Dashboard',
      description: 'See exactly how we calculate your taxable income and apply rebates. Understand each line item in simple terms.'
    },
    {
      icon: Calculator,
      title: 'Accurate Tax & Refund Calculation',
      description: 'We apply the official SARS 2025/26 brackets, rebates, and credits automatically. See your exact refund or amount owed.'
    },
    {
      icon: AlertCircle,
      title: 'Filing Guidance & Reminders',
      description: 'Download pre-filled SARS eFiling forms with one click. Never miss important deadlines with our reminder system.'
    }
  ];

  const benefits = [
    "You'll Never Feel Lost in Numbers Again",
    "Stay Ahead of SARS",
    "Built for Real People",
    "Always Up to Date"
  ];

  const missionPoints = [
    {
      title: 'Make Tax Filing Accessible',
      description: 'Everyone deserves a straightforward, stress-free way to file taxes, regardless of background or comfort with numbers.'
    },
    {
      title: 'Demystify Tax Jargon',
      description: 'Translate every SARS code and line item into plain English, so you always know exactly what each amount means.'
    },
    {
      title: 'Ensure Accuracy and Confidence',
      description: 'Pull the latest SARS brackets and rebate rules into our engine, so your calculations are always up to date.'
    },
    {
      title: 'Prevent Costly Mistakes',
      description: 'Real-time validation flags any missing information, so you can correct it before submission.'
    }
  ];

  // Structured data for About page
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Taxfy",
    "description": "Learn about Taxfy's mission to make South African tax filing simple, accessible, and stress-free for everyone.",
    "url": "https://taxfy.co.za/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "Taxfy",
      "description": "The smarter, simpler way to file your South African taxes",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Johannesburg",
        "addressCountry": "ZA"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+27670494876",
        "email": "support@taxfy.co.za",
        "contactType": "customer service"
      }
    }
  };

  return (
    <>
      <SEO
        title="About Taxfy | Making South African Tax Filing Simple and Accessible"
        description="Learn about Taxfy's mission to simplify South African tax filing. Discover how we're making tax season stress-free for everyone."
        keywords="Taxfy, South African tax filing, IRP5 upload, SARS eFiling, tax calculator, tax refund, tax simplification"
        canonical="https://taxfy.co.za/about"
        structuredData={aboutStructuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-blue-500/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto max-w-6xl text-center relative">
            <Badge variant="secondary" className="mb-6">
              <Heart className="w-4 h-4 mr-2" />
              About Taxfy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to 
              <span className="text-primary"> Taxfy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              The smarter, simpler way to file your South African taxes. We built Taxfy because tax season 
              doesn't have to be stressful, confusing, or intimidating.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8" asChild>
                <a href="/upload">
                  <Calculator className="w-4 h-4 mr-2" />
                  Try Taxfy Now
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <a href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Founder Story Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  Our Story
                </Badge>
                <h2 className="text-3xl font-bold mb-6">
                  Born from Real-World Experience
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Taxfy was founded because we've all been there—staring at IRP5 forms, 
                    squinting at lines of codes (3601, 4005, 4102) and wondering, 
                    "What does any of this even mean?"
                  </p>
                  <p>
                    For many South Africans, numbers aren't their strong suit, and "tax jargon" feels like a foreign language. 
                    Too many people end up owing SARS simply because they didn't understand which deductions they could claim. 
                    The surprise bills—and the anxiety that comes with them—were a wake-up call: there had to be a better way.
                  </p>
                  <p>
                    That experience sparked an idea: <strong className="text-foreground">What if filing your taxes felt as easy as ordering takeout?</strong> 
                    No more manual number-crunching, no more buried paperwork, and no more fear of missing deadlines. 
                    Instead, users could simply upload—or even take a photo of—their IRP5, and Taxfy would handle the rest.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl p-8">
                  <div className="bg-background rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calculator className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Our Foundation</h3>
                        <p className="text-sm text-muted-foreground">Built on Real Experience</p>
                      </div>
                    </div>
                    <blockquote className="text-muted-foreground italic">
                      "Too many people end up owing SARS simply because they don't understand tax deductions. 
                      We built Taxfy to eliminate that uncertainty and give everyone confidence in their tax filing."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Making Tax Filing Work for Everyone</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We believe that everyone—regardless of background or comfort with numbers—deserves a straightforward, 
                stress-free way to file taxes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {missionPoints.map((point, index) => (
                <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 text-primary">{point.title}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Zap className="w-4 h-4 mr-2" />
                What We Do
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Simplifying Every Step of Tax Filing</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From IRP5 upload to final submission, Taxfy handles the complexity so you don't have to.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Taxfy Matters Section */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Star className="w-4 h-4 mr-2" />
                Why Taxfy Matters
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Built for Real People</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We know that tax isn't everyone's passion—so we designed Taxfy to handle the heavy lifting. 
                All you need is a photo of your IRP5.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">{benefit}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Globe className="w-4 h-4 mr-2" />
                Our Vision
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                More Than a Tax-Filer
              </h2>
              <div className="max-w-4xl mx-auto space-y-4 text-lg text-muted-foreground">
                <p>
                  Taxfy is more than a tax-filer; it's an educational companion. We want you to feel empowered, 
                  not overwhelmed, during tax season.
                </p>
                <p>
                  By democratizing the process—breaking down barriers, eliminating jargon, and automating calculations—we 
                  believe everyone in South Africa can file correctly, claim every deduction they deserve, and gain peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-blue-500/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Whether you're a first-time filer, a freelancer juggling multiple income streams, or simply someone who 
              hates tax season, Taxfy is here to help. Upload your IRP5 today, see exactly how SARS arrives at your 
              final numbers, and file with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="px-8" asChild>
                <a href="/upload">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Your IRP5
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <a href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </a>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xl font-semibold text-primary mb-4">
                Taxfy: Simplify Your Taxes, Empower Your Finances.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-sm mt-8">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>support@taxfy.co.za</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+27670494876</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Johannesburg, South Africa</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About; 