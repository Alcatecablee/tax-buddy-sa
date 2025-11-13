import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  FileText,
  Calculator,
  Bell,
  Target,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import FeatureImage from "@/components/FeatureImage";
import ShareButtons from "@/components/ShareButtons";

const TaxSeasonDeadlines2025: React.FC = () => {
  const publishDate = "2025-06-06";
  const readTime = "7 min read";
  const category = "Tax Deadlines";
  const tags = ["SARS", "Deadlines", "Tax Season 2025", "Filing", "Compliance"];
  const articleUrl = "https://taxfy.co.za/blog/tax-season-deadlines-2025";
  const articleTitle =
    "SARS Tax Season Deadlines 2025: Complete Calendar for South African Taxpayers";
  const articleDescription =
    "Never miss a SARS deadline again! Complete guide to all tax season deadlines for 2025, including individual returns, provisional tax, EMP501, and penalty dates for South African taxpayers.";

  return (
    <>
      <Helmet>
        <title>
          SARS Tax Season Deadlines 2025: Complete Calendar for South African
          Taxpayers | Taxfy
        </title>
        <meta
          name="description"
          content="Never miss a SARS deadline again! Complete guide to all tax season deadlines for 2025, including individual returns, provisional tax, EMP501, and penalty dates for South African taxpayers."
        />
        <meta
          name="keywords"
          content="SARS deadlines 2025, tax season calendar, South Africa tax deadlines, provisional tax deadlines, EMP501 deadline, SARS filing dates"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="SARS Tax Season Deadlines 2025: Complete Calendar for South African Taxpayers"
        />
        <meta
          property="og:description"
          content="Never miss a SARS deadline again! Complete guide to all tax season deadlines for 2025, including individual returns, provisional tax, EMP501, and penalty dates."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta
          property="og:image"
          content="https://taxfy.co.za/blog/tax-deadlines-2025.jpg"
        />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="Taxfy" />
        <meta property="article:section" content="Tax Deadlines" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="SARS Tax Season Deadlines 2025: Complete Calendar for South African Taxpayers"
        />
        <meta
          name="twitter:description"
          content="Never miss a SARS deadline again! Complete guide to all tax season deadlines for 2025."
        />
        <meta
          name="twitter:image"
          content="https://taxfy.co.za/blog/tax-deadlines-2025.jpg"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: articleTitle,
            description: articleDescription,
            image: "https://taxfy.co.za/blog/tax-deadlines-2025.jpg",
            author: {
              "@type": "Organization",
              name: "Taxfy",
              url: "https://taxfy.co.za",
            },
            publisher: {
              "@type": "Organization",
              name: "Taxfy",
              logo: "https://taxfy.co.za/logo.png",
            },
            datePublished: publishDate,
            dateModified: publishDate,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": articleUrl,
            },
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
                SARS Tax Season Deadlines 2025: Complete Calendar for South
                African Taxpayers
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Never miss a SARS deadline again! Complete guide to all tax
                season deadlines for 2025, including individual returns,
                provisional tax, EMP501, and penalty dates for South African
                taxpayers.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <FeatureImage
              type="calendar"
              title="SARS Tax Season Deadlines 2025"
            />

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 dark:prose-invert">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                  <p className="mb-4">
                    Staying on top of SARS deadlines is crucial for South
                    African taxpayers to avoid penalties and interest charges.
                    The 2025 tax season brings several important dates that
                    every individual, business, and tax practitioner needs to
                    know. Missing these deadlines can result in significant
                    financial penalties and administrative penalties that can be
                    easily avoided with proper planning.
                  </p>

                  <p className="mb-6">
                    This comprehensive guide covers all the critical SARS
                    deadlines for 2025, from individual tax returns to
                    provisional tax payments, EMP501 submissions, and more. Use{" "}
                    <Link to="/upload" className="text-primary hover:underline">
                      Taxfy's free tax calculator
                    </Link>{" "}
                    to prepare your returns early and avoid last-minute stress.
                  </p>
                </div>

                <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                          Important Notice
                        </h3>
                        <p className="text-sm text-red-800 dark:text-red-200">
                          SARS deadlines are strictly enforced. Late submissions
                          result in administrative penalties starting from R250
                          per month or part thereof. Don't wait until the last
                          minute!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Key SARS Deadlines for 2025
                  </h2>

                  <h3 className="text-xl font-semibold mb-3">
                    Individual Tax Returns
                  </h3>
                  <div className="grid gap-4 mb-6">
                    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                            Auto-Assessments
                          </h4>
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                          <strong>Date:</strong> 7-20 July 2025
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          SARS will automatically assess eligible taxpayers and
                          send notifications via SMS/email. No action required
                          if you agree with the assessment.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-green-900 dark:text-green-100">
                            Tax Season Opens
                          </h4>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-200 mb-1">
                          <strong>Date:</strong> 21 July 2025
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Non-provisional taxpayers who were not auto-assessed
                          can start filing their tax returns.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="w-5 h-5 text-orange-600" />
                          <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                            Non-Provisional Taxpayers Deadline
                          </h4>
                        </div>
                        <p className="text-sm text-orange-800 dark:text-orange-200 mb-1">
                          <strong>Date:</strong> 20 October 2025
                        </p>
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          Final deadline for individual taxpayers (including
                          those who received auto-assessments but need to file
                          corrections).
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                            Provisional Taxpayers Deadline
                          </h4>
                        </div>
                        <p className="text-sm text-purple-800 dark:text-purple-200 mb-1">
                          <strong>Date:</strong> 19 January 2026
                        </p>
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          Extended deadline for provisional taxpayers and trusts
                          (trusts can start filing from 20 September 2025).
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    Provisional Tax Deadlines
                  </h3>
                  <div className="grid gap-4 mb-6">
                    <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Calculator className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-green-900 dark:text-green-100">
                            First Provisional Payment (2026 Tax Year)
                          </h4>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-200 mb-1">
                          <strong>Deadline:</strong> 31 August 2025
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          First provisional tax payment for the 2026 tax year
                          (March 2025 - February 2026).
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-teal-200 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-950/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-teal-600" />
                          <h4 className="font-semibold text-teal-900 dark:text-teal-100">
                            Second Provisional Payment (2026 Tax Year)
                          </h4>
                        </div>
                        <p className="text-sm text-teal-800 dark:text-teal-200 mb-1">
                          <strong>Deadline:</strong> 28 February 2026
                        </p>
                        <p className="text-sm text-teal-800 dark:text-teal-200">
                          Second and final provisional tax payment for the 2026
                          tax year.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    Employer Obligations
                  </h3>
                  <div className="grid gap-4 mb-6">
                    <Card className="border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                          <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
                            EMP501 Annual Reconciliation
                          </h4>
                        </div>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-1">
                          <strong>Deadline:</strong> 31 May 2025
                        </p>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200">
                          Employers must submit annual reconciliation for the
                          2025 tax year.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-pink-200 bg-pink-50/50 dark:border-pink-800 dark:bg-pink-950/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <ExternalLink className="w-5 h-5 text-pink-600" />
                          <h4 className="font-semibold text-pink-900 dark:text-pink-100">
                            IRP5/IT3(a) Certificates
                          </h4>
                        </div>
                        <p className="text-sm text-pink-800 dark:text-pink-200 mb-1">
                          <strong>Deadline:</strong> 31 May 2025
                        </p>
                        <p className="text-sm text-pink-800 dark:text-pink-200">
                          Employers must issue IRP5 certificates to employees by
                          this date.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Penalty Structure for Late Submissions
                  </h2>
                  <p className="mb-4">
                    SARS imposes strict penalties for late submissions.
                    Understanding these penalties can help you prioritize your
                    tax compliance:
                  </p>

                  <div className="bg-muted/50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Administrative Penalties
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>
                          <strong>Month 1:</strong> R250 penalty
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>
                          <strong>Month 2:</strong> Additional R250 (Total:
                          R500)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>
                          <strong>Month 3 onwards:</strong> R250 per month
                          (Maximum: R16,000)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                            Pro Tip
                          </h3>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Even if you don't owe any tax, you still need to
                            submit your return to avoid penalties. Use{" "}
                            <Link
                              to="/upload"
                              className="text-primary hover:underline"
                            >
                              Taxfy's free calculator
                            </Link>{" "}
                            to check if you're due a refund!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    How to Prepare for Tax Season 2025
                  </h2>
                  <p className="mb-4">
                    Don't wait until the last minute! Here's how to prepare for
                    a stress-free tax season:
                  </p>

                  <div className="grid gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary font-semibold text-sm">
                          1
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          Gather Your Documents
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Collect your IRP5, medical aid certificates,
                          retirement annuity certificates, and other relevant
                          documents. Check our{" "}
                          <Link
                            to="/blog/tax-return-documents"
                            className="text-primary hover:underline"
                          >
                            complete document checklist
                          </Link>
                          .
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary font-semibold text-sm">
                          2
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          Use Taxfy's Free Calculator
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Upload your IRP5 to{" "}
                          <Link
                            to="/upload"
                            className="text-primary hover:underline"
                          >
                            Taxfy's free tax calculator
                          </Link>{" "}
                          to get an instant estimate of your refund or tax
                          liability.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary font-semibold text-sm">
                          3
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          Register for eFiling
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Ensure your SARS eFiling profile is up to date and you
                          have your login credentials ready.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary font-semibold text-sm">
                          4
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          Set Calendar Reminders
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Add all relevant deadlines to your calendar with
                          advance reminders to avoid last-minute stress.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
                  <p className="mb-4">
                    Staying compliant with SARS deadlines doesn't have to be
                    stressful. By understanding the key dates and preparing
                    early, you can avoid penalties and ensure a smooth tax
                    season. Remember that even if you don't owe any tax, you may
                    still be required to submit a return.
                  </p>

                  <p className="mb-6">
                    Start your tax preparation today with{" "}
                    <Link to="/upload" className="text-primary hover:underline">
                      Taxfy's free tax calculator
                    </Link>
                    . Upload your IRP5 and get an instant estimate of your
                    refund in under 2 minutes. Don't wait until the deadline –
                    prepare now and file with confidence!
                  </p>

                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                          Ready to Check Your Tax Refund?
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Upload your IRP5 and get an instant calculation of
                          your potential SARS refund.
                        </p>
                        <Button asChild className="cursor-button">
                          <Link to="/upload">
                            <Calculator className="w-4 h-4 mr-2" />
                            Calculate My Refund
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Share Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Share this article
                </h3>
                <ShareButtons
                  url={articleUrl}
                  title={articleTitle}
                  description={articleDescription}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link to="/blog/sars-tax-season-2025">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous Article
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/blog">
                    <BookOpen className="w-4 h-4 mr-2" />
                    All Articles
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default TaxSeasonDeadlines2025;
