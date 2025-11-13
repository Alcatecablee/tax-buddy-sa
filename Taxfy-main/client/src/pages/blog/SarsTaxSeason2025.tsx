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
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import FeatureImage from "@/components/FeatureImage";
import ShareButtons from "@/components/ShareButtons";
import ClickableTag from "@/components/ClickableTag";

const SarsTaxSeason2025: React.FC = () => {
  const publishDate = "2025-06-02";
  const readTime = "8 min read";
  const category = "Tax Season";
  const tags = ["SARS", "Tax Season", "Filing", "Deadlines"];
  const articleUrl = "https://taxfy.co.za/blog/sars-tax-season-2025";
  const articleTitle =
    "SARS Tax Season 2025: Key Dates, Thresholds, and Filing Rules for South Africa";
  const articleDescription =
    "Find out when you can submit your SARS tax return in 2025, the tax threshold, financial year dates, EMP501 deadlines, and who must file. Get all your South African tax season questions answered.";

  return (
    <>
      <Helmet>
        <title>
          SARS Tax Season 2025: Key Dates, Thresholds, and Filing Rules for
          South Africa | Taxfy
        </title>
        <meta
          name="description"
          content="Find out when you can submit your SARS tax return in 2025, the tax threshold, financial year dates, EMP501 deadlines, and who must file. Get all your South African tax season questions answered."
        />
        <meta
          name="keywords"
          content="SARS tax season 2025, South Africa tax return, tax threshold 2025, EMP501 deadline, SARS eFiling, financial year 2025"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="SARS Tax Season 2025: Key Dates, Thresholds, and Filing Rules for South Africa"
        />
        <meta
          property="og:description"
          content="Find out when you can submit your SARS tax return in 2025, the tax threshold, financial year dates, EMP501 deadlines, and who must file."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta
          property="og:image"
          content="https://taxfy.co.za/blog/tax-season-2025.jpg"
        />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="Taxfy" />
        <meta property="article:section" content="Tax Season" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="SARS Tax Season 2025: Key Dates, Thresholds, and Filing Rules for South Africa"
        />
        <meta
          name="twitter:description"
          content="Find out when you can submit your SARS tax return in 2025, the tax threshold, financial year dates, EMP501 deadlines, and who must file."
        />
        <meta
          name="twitter:image"
          content="https://taxfy.co.za/blog/tax-season-2025.jpg"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: articleTitle,
            description: articleDescription,
            image: "https://taxfy.co.za/blog/tax-season-2025.jpg",
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
                SARS Tax Season 2025: Key Dates, Thresholds, and Filing Rules
                for South Africa
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Find out when you can submit your SARS tax return in 2025, the
                tax threshold, financial year dates, EMP501 deadlines, and who
                must file. Get all your South African tax season questions
                answered.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag) => (
                  <ClickableTag key={tag} tag={tag} />
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <FeatureImage
              type="tax-season"
              title="SARS Tax Season 2025 Complete Guide"
            />

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                  <p className="mb-4">
                    Tax season in South Africa is a crucial time for millions of
                    individuals and businesses. With the 2025 SARS eFiling
                    period approaching, it's important to know the key dates,
                    understand who needs to file, and be aware of the latest tax
                    thresholds and requirements. In this comprehensive guide, we
                    answer the most common questions South Africans are asking
                    about the 2025 tax season, including when you can submit
                    your return, the financial year dates, and more.
                  </p>

                  <p className="mb-6">
                    Whether you're wondering{" "}
                    <Link
                      to="/blog/sars-refund-check"
                      className="text-primary hover:underline"
                    >
                      "How do I know if SARS owes me money?"
                    </Link>{" "}
                    or need to understand{" "}
                    <Link
                      to="/blog/tax-return-documents"
                      className="text-primary hover:underline"
                    >
                      what documents you need for your tax return
                    </Link>
                    , this guide has you covered. Plus, discover how{" "}
                    <Link to="/upload" className="text-primary hover:underline">
                      Taxfy's free IRP5 analyzer
                    </Link>{" "}
                    can help you prepare for tax season in minutes.
                  </p>
                </div>

                <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Quick Tax Season Summary
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>
                            • Auto-assessments: <strong>7-20 July 2025</strong>
                          </li>
                          <li>
                            • Tax season opens: <strong>21 July 2025</strong>
                          </li>
                          <li>
                            • Financial year:{" "}
                            <strong>1 March 2024 - 28 February 2025</strong>
                          </li>
                          <li>
                            • Tax threshold (under 65): <strong>R95,750</strong>
                          </li>
                          <li>
                            • Non-provisional deadline:{" "}
                            <strong>20 October 2025</strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    When Can I Submit My SARS Tax Return in 2025?
                  </h2>
                  <p className="mb-4">
                    The South African Revenue Service (SARS) has announced the
                    official dates for the 2025 tax season. Here's what you need
                    to know:
                  </p>

                  <ul className="mb-4 space-y-2">
                    <li>
                      <strong>Auto-assessments:</strong> 7-20 July 2025 (SARS
                      will notify eligible taxpayers via SMS/email)
                    </li>
                    <li>
                      <strong>Non-Provisional Taxpayers:</strong> 21 July - 20
                      October 2025
                    </li>
                    <li>
                      <strong>Provisional Taxpayers:</strong> 21 July 2025 - 19
                      January 2026
                    </li>
                    <li>
                      <strong>Trusts:</strong> 20 September 2025 - 19 January
                      2026
                    </li>
                  </ul>

                  <p className="mb-6">
                    This year, SARS will automatically assess many taxpayers
                    whose tax affairs are less complicated. If you receive an
                    auto-assessment notification, you don't need to file a
                    return unless you disagree with the assessment or have
                    additional income/deductions to declare.
                  </p>
                </div>

                <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                          Pro Tip
                        </h3>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Filing as soon as the season opens can help you get
                          your refund faster and avoid last-minute stress.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground">
                  <strong>Source:</strong>{" "}
                  <a
                    href="https://businesstech.co.za/news/finance/825399/these-taxpayers-dont-have-to-file-a-tax-return-in-2025/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    BusinessTech: These taxpayers don't have to file a tax
                    return in 2025
                  </a>
                </blockquote>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    When's the Earliest You Can File Taxes in 2025?
                  </h2>
                  <p className="mb-4">
                    The earliest you can file your tax return for the 2025 tax
                    year is <strong>1 July 2025</strong>, when SARS eFiling
                    officially opens. Submissions before this date are not
                    accepted. Make sure you have all your documents, including
                    your IRP5, medical aid certificates, and any other
                    supporting documents, ready by this date.
                  </p>

                  <p className="mb-6">
                    Pro tip: Use{" "}
                    <Link to="/upload" className="text-primary hover:underline">
                      Taxfy's IRP5 analyzer
                    </Link>{" "}
                    before tax season opens to check if you're due a refund and
                    prepare your information in advance. This way, you can file
                    as soon as SARS eFiling opens and get your refund faster.
                  </p>
                </div>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Calculator className="w-8 h-8 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Simplify Your Filing Process with Taxfy
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          <strong>Taxfy</strong> revolutionizes the way South
                          Africans handle their tax returns. Our intuitive
                          platform streamlines the filing process, making it
                          faster, easier, and more accurate. With Taxfy, you
                          can:
                        </p>
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>
                              Automatically parse your IRP5 form instantly
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>
                              Calculate your tax refund or liability accurately
                              within minutes
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>
                              Receive smart, AI-powered recommendations to
                              maximize your refunds
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>
                              Enjoy 100% privacy—your sensitive data never
                              leaves your browser
                            </span>
                          </li>
                        </ul>
                        <Link to="/upload">
                          <Button className="w-full sm:w-auto">
                            Try Taxfy Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    When Must EMP501 Be Submitted for 2025?
                  </h2>
                  <p className="mb-4">
                    The <strong>EMP501</strong> is a reconciliation declaration
                    that employers must submit to SARS, summarizing all
                    employees' earnings, PAYE, UIF, and SDL contributions for
                    the tax year.
                  </p>

                  <ul className="mb-4 space-y-2">
                    <li>
                      For the 2025 tax year, the{" "}
                      <strong>EMP501 submission period</strong> for employers is
                      typically in April/May for the interim period and in
                      May/June for the annual period.
                    </li>
                    <li>
                      The <strong>final EMP501 for 2025</strong> is expected to
                      be due by <strong>May or June 2025</strong> (exact dates
                      to be confirmed by SARS).
                    </li>
                  </ul>

                  <p className="mb-6">
                    Employers must ensure all IRP5s are issued to employees
                    before tax season opens, as employees need these to file
                    their returns.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    What Is the Tax Threshold for 2025 in South Africa?
                  </h2>
                  <p className="mb-4">
                    The <strong>tax threshold</strong> is the minimum amount of
                    income you must earn before you are required to pay income
                    tax or submit a tax return. For the 2024/2025 tax year, the
                    thresholds are:
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 my-6">
                    <Card className="text-center">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">Under 65 years</h3>
                        <p className="text-2xl font-bold text-primary">
                          R95,750
                        </p>
                        <p className="text-sm text-muted-foreground">
                          per year
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">65 to 74 years</h3>
                        <p className="text-2xl font-bold text-primary">
                          R148,217
                        </p>
                        <p className="text-sm text-muted-foreground">
                          per year
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">
                          75 years and older
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          R165,689
                        </p>
                        <p className="text-sm text-muted-foreground">
                          per year
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <p className="mb-6">
                    If your total income for the year is below these amounts,
                    you generally do <strong>not</strong> need to submit a tax
                    return—unless you have other sources of income (like rental,
                    freelance, or investment income) or meet other SARS
                    criteria.
                  </p>
                </div>

                <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                          Important Note
                        </h3>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          SARS may update these thresholds for the 2025/26 tax
                          year. Always check the latest on the{" "}
                          <a
                            href="https://www.sars.gov.za/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            SARS website
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    What Is the Financial Year 2025?
                  </h2>
                  <p className="mb-4">
                    The{" "}
                    <strong>
                      South African tax financial year for individuals
                    </strong>{" "}
                    runs from <strong>1 March 2024 to 28 February 2025</strong>.
                    When you file your tax return in July 2025, you are
                    declaring your income and deductions for this period.
                  </p>

                  <ul className="mb-6 space-y-2">
                    <li>
                      <strong>Start:</strong> 1 March 2024
                    </li>
                    <li>
                      <strong>End:</strong> 28 February 2025
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    How Much Must I Earn to Submit a Tax Return in South Africa?
                  </h2>
                  <p className="mb-4">
                    You must submit a tax return if your total income for the
                    year exceeds the tax threshold:
                  </p>

                  <ul className="mb-4 space-y-2">
                    <li>
                      <strong>Under 65 years:</strong> R95,750
                    </li>
                    <li>
                      <strong>65 to 74 years:</strong> R148,217
                    </li>
                    <li>
                      <strong>75 years and older:</strong> R165,689
                    </li>
                  </ul>

                  <p className="mb-4">
                    <strong>However, you must also file if:</strong>
                  </p>
                  <ul className="mb-4 space-y-2">
                    <li>You have more than one employer or income source</li>
                    <li>You earn rental, freelance, or investment income</li>
                    <li>
                      You want to claim deductions (medical, retirement, etc.)
                    </li>
                    <li>SARS requests you to file</li>
                    <li>
                      You want to check if{" "}
                      <Link
                        to="/blog/sars-refund-check"
                        className="text-primary hover:underline"
                      >
                        SARS owes you money from previous years
                      </Link>
                    </li>
                  </ul>

                  <p className="mb-4">
                    <strong>Some taxpayers do not need to file:</strong>
                    <br />
                    According to SARS and as reported by{" "}
                    <a
                      href="https://businesstech.co.za/news/finance/825399/these-taxpayers-dont-have-to-file-a-tax-return-in-2025/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      BusinessTech
                    </a>
                    , if you only earn a salary from one employer, your total
                    income is below the threshold, and you have no additional
                    allowances or deductions, you may be exempt from filing.
                  </p>

                  <p className="mb-6">
                    Not sure if you need to file? Try our{" "}
                    <Link
                      to="/manual-entry"
                      className="text-primary hover:underline"
                    >
                      free tax calculator
                    </Link>{" "}
                    to get a quick assessment of your tax situation.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Frequently Asked Questions (FAQ)
                  </h2>

                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">
                          Do I need to file if I only earn a salary?
                        </h3>
                        <p className="text-muted-foreground">
                          If your total salary is below the threshold and you
                          have no other income or deductions, you may not need
                          to file. However, filing can still be beneficial if
                          you want to claim deductions or check for refunds. Use{" "}
                          <Link
                            to="/upload"
                            className="text-primary hover:underline"
                          >
                            Taxfy's free analyzer
                          </Link>{" "}
                          to see if you're due money back.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">
                          What happens if I miss the SARS deadline?
                        </h3>
                        <p className="text-muted-foreground">
                          Late submissions can result in penalties and interest.
                          SARS charges a penalty of R250 per month or part
                          thereof for late submissions. Always file before the
                          deadline to avoid these costs.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">
                          Can I file my tax return online?
                        </h3>
                        <p className="text-muted-foreground">
                          Yes! SARS eFiling is the fastest and most convenient
                          way to file your return. You can register and submit
                          your return at{" "}
                          <a
                            href="https://www.sarsefiling.co.za/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            SARS eFiling
                          </a>
                          . For help with the process, check our{" "}
                          <Link
                            to="/how-to"
                            className="text-primary hover:underline"
                          >
                            step-by-step guide
                          </Link>
                          .
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">
                          How can I check if SARS owes me money?
                        </h3>
                        <p className="text-muted-foreground">
                          The easiest way is to analyze your IRP5 certificate.
                          Read our detailed guide on{" "}
                          <Link
                            to="/blog/sars-refund-check"
                            className="text-primary hover:underline"
                          >
                            how to check if SARS owes you money
                          </Link>{" "}
                          or use{" "}
                          <Link
                            to="/upload"
                            className="text-primary hover:underline"
                          >
                            Taxfy's instant IRP5 analyzer
                          </Link>{" "}
                          to find out in minutes.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">
                          What documents do I need for my tax return?
                        </h3>
                        <p className="text-muted-foreground">
                          You'll need your IRP5, medical aid certificates,
                          retirement annuity certificates, and bank details. For
                          a complete list, see our guide on{" "}
                          <Link
                            to="/blog/tax-return-documents"
                            className="text-primary hover:underline"
                          >
                            what documents you need to submit your tax return
                          </Link>
                          .
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <Card className="my-12 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Make your tax season simple and stress-free with Taxfy
                </h2>
                <p className="text-muted-foreground mb-6">
                  Upload your IRP5, get instant analysis, and discover if SARS
                  owes you money—all in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/upload">
                    <Button size="lg" className="px-8">
                      Try Taxfy Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/how-to">
                    <Button variant="outline" size="lg" className="px-8">
                      Learn How It Works
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Share Section */}
            <Separator className="my-8" />
            <ShareButtons
              url={articleUrl}
              title={articleTitle}
              description={articleDescription}
              hashtags={[
                "TaxSeason2025",
                "SARS",
                "SouthAfricaTax",
                "TaxFiling",
                "Taxfy",
              ]}
            />

            {/* Back to Blog */}
            <div className="flex justify-center pt-8">
              <Link
                to="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1 inline" />
                Back to Blog
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default SarsTaxSeason2025;
