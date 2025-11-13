import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calculator,
  TrendingUp,
  DollarSign,
  Shield,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function TaxSeasonPreparation2025() {
  const publishDate = "2025-06-04";
  const readTime = "12 min read";
  const category = "Tax Preparation";
  const tags = [
    "Tax Season 2025",
    "SARS Filing",
    "Tax Preparation",
    "Tax Refund",
    "IRP5",
    "Tax Documents",
  ];
  const articleUrl = "https://taxfy.co.za/blog/tax-season-preparation-2025";
  const articleTitle =
    "Tax Season 2025 Preparation: Essential Checklist for Maximum SARS Refund";
  const articleDescription =
    "Complete guide to preparing for South African tax season 2025. Learn what documents you need, key deadlines, and strategies to maximize your SARS refund.";

  const preparationSteps = [
    {
      title: "Gather Your Tax Documents",
      description:
        "Collect all necessary documents including IRP5, medical aid certificates, and receipts",
      icon: FileText,
      urgent: true,
    },
    {
      title: "Register for SARS eFiling",
      description: "Ensure your eFiling profile is active and up-to-date",
      icon: Shield,
      urgent: true,
    },
    {
      title: "Review Your Tax Position",
      description: "Use Taxfy's free calculator to estimate your refund",
      icon: Calculator,
      urgent: false,
    },
    {
      title: "Plan Your Deductions",
      description: "Maximize legitimate deductions to increase your refund",
      icon: DollarSign,
      urgent: false,
    },
  ];

  const keyDates = [
    {
      date: "1 July 2025",
      event: "Tax season opens for individuals",
      status: "upcoming",
    },
    {
      date: "31 October 2025",
      event: "Filing deadline for individuals",
      status: "deadline",
    },
    {
      date: "31 January 2026",
      event: "Final deadline with penalties",
      status: "critical",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Tax Season 2025 Preparation: Essential Checklist for Maximum SARS
          Refund | Taxfy
        </title>
        <meta
          name="description"
          content="Complete guide to preparing for South African tax season 2025. Learn what documents you need, key deadlines, and strategies to maximize your SARS refund."
        />
        <meta
          name="keywords"
          content="tax season 2025, SARS filing, tax preparation, tax refund, South Africa tax, IRP5, tax documents, eFiling"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Tax Season 2025 Preparation: Essential Checklist for Maximum SARS Refund"
        />
        <meta
          property="og:description"
          content="Complete guide to preparing for South African tax season 2025. Learn what documents you need, key deadlines, and strategies to maximize your SARS refund."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta
          property="og:image"
          content="https://taxfy.co.za/images/tax-season-2025-preparation.jpg"
        />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="Taxfy" />
        <meta property="article:section" content="Tax Preparation" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Tax Season 2025 Preparation: Essential Checklist for Maximum SARS Refund"
        />
        <meta
          name="twitter:description"
          content="Complete guide to preparing for South African tax season 2025. Learn what documents you need, key deadlines, and strategies to maximize your SARS refund."
        />
        <meta
          name="twitter:image"
          content="https://taxfy.co.za/images/tax-season-2025-preparation.jpg"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: articleTitle,
            description: articleDescription,
            image: "https://taxfy.co.za/images/tax-season-2025-preparation.jpg",
            author: {
              "@type": "Organization",
              name: "Taxfy",
            },
            publisher: {
              "@type": "Organization",
              name: "Taxfy",
              logo: {
                "@type": "ImageObject",
                url: "https://taxfy.co.za/logo.png",
              },
            },
            datePublished: publishDate,
            dateModified: publishDate,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": articleUrl,
            },
            keywords:
              "tax season 2025, SARS filing, tax preparation, tax refund, South Africa tax, IRP5, tax documents",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <article className="container mx-auto max-w-4xl px-6 py-12">
          <div className="space-y-8">
            <div className="mb-8">
              <Link
                to="/blog"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending Now
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(publishDate).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {readTime}
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Tax Season 2025 Preparation: Essential Checklist for Maximum
                SARS Refund
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Get ready for South African tax season 2025 with our
                comprehensive preparation guide. Maximize your SARS refund and
                avoid last-minute stress with this complete checklist.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 dark:prose-invert">
              <div className="space-y-6">
                {/* Alert for trending topic */}
                <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                          Trending Alert
                        </h3>
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          "South Africa Tax Season" searches have increased by
                          1000% in the past 24 hours. Don't get caught
                          unprepared - start your tax preparation now!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Why Start Preparing Now?
                  </h2>
                  <p className="mb-4">
                    With tax season 2025 approaching fast, South Africans are
                    already searching for guidance on how to prepare. The
                    earlier you start, the better positioned you'll be to
                    maximize your SARS refund and avoid the stress of
                    last-minute filing.
                  </p>

                  <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50 mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Average SARS Refund Statistics
                          </h3>
                          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>
                              • Average refund amount: <strong>R4,200</strong>
                            </li>
                            <li>• 68% of taxpayers receive refunds</li>
                            <li>
                              • Early filers receive refunds 2-3 weeks faster
                            </li>
                            <li>
                              • Proper preparation can increase refunds by up to
                              15%
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Dates Section */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Important Tax Season 2025 Dates
                  </h2>
                  <div className="grid gap-4 mb-6">
                    {keyDates.map((item, index) => (
                      <Card
                        key={index}
                        className={`${
                          item.status === "critical"
                            ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50"
                            : item.status === "deadline"
                              ? "border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50"
                              : "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{item.event}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.date}
                              </p>
                            </div>
                            <Calendar
                              className={`w-5 h-5 ${
                                item.status === "critical"
                                  ? "text-red-600"
                                  : item.status === "deadline"
                                    ? "text-orange-600"
                                    : "text-green-600"
                              }`}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Preparation Steps */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Your Tax Preparation Checklist
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {preparationSteps.map((step, index) => (
                      <Card
                        key={index}
                        className={`${step.urgent ? "border-red-200 dark:border-red-800" : "border-gray-200 dark:border-gray-800"}`}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <step.icon
                              className={`w-5 h-5 mr-3 ${step.urgent ? "text-red-600" : "text-blue-600"}`}
                            />
                            {step.title}
                            {step.urgent && (
                              <Badge variant="destructive" className="ml-2">
                                Urgent
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Document Checklist */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Essential Documents You'll Need
                  </h2>
                  <Card className="border-gray-200 dark:border-gray-800 mb-6">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Employment Documents
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              IRP5 Certificate from employer
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              IT3(a) certificates for additional income
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Payslips for verification
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Deduction Documents
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Medical aid certificates
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Retirement annuity certificates
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Section 18A donation receipts
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tips for Maximum Refund */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    5 Tips to Maximize Your SARS Refund
                  </h2>
                  <div className="space-y-6 mb-6">
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-semibold mb-2">
                        1. Don't Miss Any Deductions
                      </h3>
                      <p>
                        Review all possible deductions including medical
                        expenses, retirement contributions, and donations to
                        Section 18A organizations.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-semibold mb-2">
                        2. File Early
                      </h3>
                      <p>
                        Early filers not only get their refunds faster but also
                        avoid the rush and potential system delays.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-semibold mb-2">
                        3. Use Professional Tools
                      </h3>
                      <p>
                        Tools like Taxfy's calculator can help identify missed
                        deductions and ensure accuracy.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-semibold mb-2">
                        4. Keep Detailed Records
                      </h3>
                      <p>
                        Maintain organized records of all tax-related documents
                        throughout the year.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-semibold mb-2">
                        5. Double-Check Everything
                      </h3>
                      <p>
                        Review your return carefully before submission to avoid
                        delays or queries from SARS.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Common Mistakes to Avoid */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Common Tax Season Mistakes to Avoid
                  </h2>
                  <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50 mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                            Warning
                          </h3>
                          <p className="text-sm text-red-800 dark:text-red-200">
                            These mistakes could delay your refund or result in
                            penalties from SARS.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader>
                        <CardTitle className="text-red-600">
                          ❌ Don't Do This
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>• Filing without all required documents</li>
                          <li>• Claiming false deductions</li>
                          <li>• Missing the filing deadline</li>
                          <li>• Not keeping supporting documents</li>
                          <li>• Ignoring SARS correspondence</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="text-green-600">
                          ✅ Do This Instead
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>• Gather all documents before starting</li>
                          <li>• Only claim legitimate deductions</li>
                          <li>• File well before the deadline</li>
                          <li>• Keep records for 5 years</li>
                          <li>• Respond promptly to SARS queries</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Call to Action */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                      Ready to Start Your Tax Preparation?
                    </h2>
                    <p className="text-lg mb-6 text-muted-foreground">
                      Don't wait until the last minute. Use Taxfy's free tools
                      to get started today and maximize your SARS refund.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/upload">
                        <Button size="lg" className="px-8">
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate My Refund
                        </Button>
                      </Link>
                      <Link to="/blog/sars-efiling-guide">
                        <Button size="lg" variant="outline" className="px-8">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          eFiling Guide
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SARS eFiling Guide 2025</CardTitle>
                  <CardDescription>
                    Step-by-step guide to filing online
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/blog/sars-efiling-guide">
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Deductions Guide</CardTitle>
                  <CardDescription>
                    Maximize your deductions legally
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/blog/tax-deductions-guide">
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Check SARS Refund Status</CardTitle>
                  <CardDescription>Track your refund progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/blog/sars-refund-check">
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
