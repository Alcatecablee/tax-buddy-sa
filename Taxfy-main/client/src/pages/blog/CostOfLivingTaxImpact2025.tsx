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
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Home,
  Calculator,
  AlertTriangle,
  PiggyBank,
  Target,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Lightbulb,
  Calendar,
  Clock,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function CostOfLivingTaxImpact2025() {
  const publishDate = "2025-06-04";
  const readTime = "15 min read";
  const category = "Economic Impact";
  const tags = [
    "Cost of Living",
    "Tax Refund Strategy",
    "Household Affordability",
    "Inflation Impact",
    "SARS Refund",
    "Tax Planning 2025",
  ];
  const articleUrl = "https://taxfy.co.za/blog/cost-of-living-tax-impact-2025";
  const articleTitle =
    "Cost of Living Crisis 2025: How Rising Prices Impact Your Tax Refund Strategy";
  const articleDescription =
    "Discover how South Africa's rising cost of living affects your tax planning and learn strategies to maximize your SARS refund during tough economic times.";

  const costStatistics = [
    {
      category: "Food Basket",
      current: "R5,466.59",
      increase: "+2.6% YoY",
      impact: "High",
      icon: ShoppingCart,
    },
    {
      category: "Household Hygiene",
      current: "R1,029.52",
      increase: "+0.6% YoY",
      impact: "Medium",
      icon: Home,
    },
    {
      category: "Child Nutrition",
      current: "R979.66",
      increase: "+2.6% YoY",
      impact: "High",
      icon: Target,
    },
    {
      category: "Minimum Wage Gap",
      current: "45% underspend",
      increase: "Worsening",
      impact: "Critical",
      icon: AlertTriangle,
    },
  ];

  const taxStrategies = [
    {
      title: "Maximize Medical Deductions",
      description:
        "With healthcare costs rising, ensure you claim all medical expenses",
      savings: "Up to R4,000",
      difficulty: "Easy",
    },
    {
      title: "Retirement Contributions",
      description: "Increase RA contributions to reduce taxable income",
      savings: "Up to R3,500",
      difficulty: "Medium",
    },
    {
      title: "Section 18A Donations",
      description: "Support charities while reducing your tax liability",
      savings: "Up to R1,800",
      difficulty: "Easy",
    },
    {
      title: "Home Office Deductions",
      description: "Claim work-from-home expenses if applicable",
      savings: "Up to R2,500",
      difficulty: "Medium",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Cost of Living Crisis 2025: How Rising Prices Impact Your Tax Refund
          Strategy | Taxfy
        </title>
        <meta
          name="description"
          content="Discover how South Africa's rising cost of living affects your tax planning and learn strategies to maximize your SARS refund during tough economic times."
        />
        <meta
          name="keywords"
          content="cost of living South Africa, tax refund strategy, household affordability, inflation impact, SARS refund, tax planning 2025"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Cost of Living Crisis 2025: How Rising Prices Impact Your Tax Refund Strategy"
        />
        <meta
          property="og:description"
          content="Discover how South Africa's rising cost of living affects your tax planning and learn strategies to maximize your SARS refund during tough economic times."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta
          property="og:image"
          content="https://taxfy.co.za/images/cost-of-living-tax-impact-2025.jpg"
        />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="Taxfy" />
        <meta property="article:section" content="Economic Impact" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Cost of Living Crisis 2025: How Rising Prices Impact Your Tax Refund Strategy"
        />
        <meta
          name="twitter:description"
          content="Discover how South Africa's rising cost of living affects your tax planning and learn strategies to maximize your SARS refund during tough economic times."
        />
        <meta
          name="twitter:image"
          content="https://taxfy.co.za/images/cost-of-living-tax-impact-2025.jpg"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: articleTitle,
            description: articleDescription,
            image:
              "https://taxfy.co.za/images/cost-of-living-tax-impact-2025.jpg",
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
              "cost of living South Africa, tax refund strategy, household affordability, inflation impact, SARS refund, tax planning 2025",
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
                Cost of Living Crisis 2025: How Rising Prices Impact Your Tax
                Refund Strategy
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                As household costs soar in South Africa, your SARS tax refund
                becomes more crucial than ever. Learn how to maximize it during
                these challenging economic times.
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
                {/* Economic Alert */}
                <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                          Economic Alert
                        </h3>
                        <p className="text-sm text-red-800 dark:text-red-200">
                          The average South African household food basket now
                          costs R5,466.59 per month, with workers' families
                          underspending on food by 45% due to rising costs.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    The Reality of Rising Costs in South Africa
                  </h2>
                  <p className="mb-4">
                    June 2025 brings sobering news for South African households.
                    According to the latest Household Affordability Index, the
                    cost of basic living continues to outpace wage growth,
                    making every rand count more than ever before.
                  </p>

                  <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50 mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                            May 2025 Cost of Living Snapshot
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold">
                                Average Household Food Basket:
                              </p>
                              <p className="text-2xl font-bold text-orange-600">
                                R5,466.59
                              </p>
                              <p className="text-sm text-muted-foreground">
                                +2.6% from May 2024
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold">
                                National Minimum Wage (monthly):
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                R4,836.72
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Supporting average family of 4
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Breaking Down the Cost Crisis
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {costStatistics.map((stat, index) => (
                      <Card
                        key={index}
                        className={`${
                          stat.impact === "Critical"
                            ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50"
                            : stat.impact === "High"
                              ? "border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50"
                              : "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50"
                        }`}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <stat.icon
                              className={`w-5 h-5 mr-3 ${
                                stat.impact === "Critical"
                                  ? "text-red-600"
                                  : stat.impact === "High"
                                    ? "text-orange-600"
                                    : "text-yellow-600"
                              }`}
                            />
                            {stat.category}
                            <Badge
                              variant={
                                stat.impact === "Critical"
                                  ? "destructive"
                                  : stat.impact === "High"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="ml-2"
                            >
                              {stat.impact}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold mb-1">
                            {stat.current}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stat.increase}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* The Tax Refund Solution */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Why Your Tax Refund Matters More Than Ever
                  </h2>
                  <p className="mb-4">
                    With the average SARS refund being R4,200, this money can
                    provide crucial relief for struggling households. For many
                    families, it represents nearly a month's worth of groceries
                    or essential household expenses.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                      <CardHeader>
                        <CardTitle className="text-green-700 dark:text-green-300">
                          Food Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          A R4,200 refund covers 77% of a monthly food basket
                          for a family of four.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                      <CardHeader>
                        <CardTitle className="text-blue-700 dark:text-blue-300">
                          Emergency Fund
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Build a financial buffer against unexpected expenses
                          and economic shocks.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
                      <CardHeader>
                        <CardTitle className="text-purple-700 dark:text-purple-300">
                          Debt Relief
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Pay down high-interest debt to reduce monthly
                          financial pressure.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Maximizing Your Refund Strategies */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Smart Tax Strategies for Tough Times
                  </h2>
                  <p className="mb-4">
                    During economic hardship, every deduction counts. Here are
                    proven strategies to maximize your SARS refund:
                  </p>

                  <div className="space-y-6 mb-6">
                    {taxStrategies.map((strategy, index) => (
                      <Card key={index} className="border-l-4 border-blue-500">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{strategy.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {strategy.difficulty}
                              </Badge>
                              <Badge variant="secondary">
                                {strategy.savings}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {strategy.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Practical Tips Section */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Practical Money-Saving Tips While Waiting for Your Refund
                  </h2>
                  <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50 mb-6">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
                            Immediate Actions
                          </h3>
                          <ul className="space-y-2">
                            <li>• Review and cancel unused subscriptions</li>
                            <li>• Switch to generic brands for groceries</li>
                            <li>• Use loyalty programs and coupons</li>
                            <li>• Plan meals to reduce food waste</li>
                            <li>• Consider carpooling to save on fuel</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <PiggyBank className="w-5 h-5 mr-2 text-green-600" />
                            Long-term Planning
                          </h3>
                          <ul className="space-y-2">
                            <li>• Build an emergency fund gradually</li>
                            <li>• Invest in energy-efficient appliances</li>
                            <li>• Consider growing your own vegetables</li>
                            <li>• Explore additional income streams</li>
                            <li>• Review insurance policies for savings</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Regional Cost Variations */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Cost of Living by Region
                  </h2>
                  <p className="mb-4">
                    Understanding regional cost differences can help you make
                    informed decisions about where to live and work:
                  </p>

                  <Card className="border-gray-200 dark:border-gray-800 mb-6">
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-3 font-semibold">
                                City
                              </th>
                              <th className="text-left p-3 font-semibold">
                                Food Basket Cost
                              </th>
                              <th className="text-left p-3 font-semibold">
                                Monthly Change
                              </th>
                              <th className="text-left p-3 font-semibold">
                                Annual Change
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/50">
                              <td className="p-3">Springbok</td>
                              <td className="p-3 font-semibold">R5,879.94</td>
                              <td className="p-3 text-green-600">-0.5%</td>
                              <td className="p-3 text-red-600">+5.4%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="p-3">Johannesburg</td>
                              <td className="p-3 font-semibold">R5,610.46</td>
                              <td className="p-3 text-red-600">+0.9%</td>
                              <td className="p-3 text-red-600">+0.3%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="p-3">Cape Town</td>
                              <td className="p-3 font-semibold">R5,429.18</td>
                              <td className="p-3 text-red-600">+2.1%</td>
                              <td className="p-3 text-red-600">+5.8%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="p-3">Durban</td>
                              <td className="p-3 font-semibold">R5,427.87</td>
                              <td className="p-3 text-green-600">+0.0%</td>
                              <td className="p-3 text-red-600">+1.6%</td>
                            </tr>
                            <tr>
                              <td className="p-3">Pietermaritzburg</td>
                              <td className="p-3 font-semibold">R5,050.80</td>
                              <td className="p-3 text-red-600">+0.1%</td>
                              <td className="p-3 text-red-600">+1.1%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Child Support and Family Impact */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    The Child Support Crisis
                  </h2>
                  <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50 mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                            Critical Gap
                          </h3>
                          <p className="text-sm text-red-800 dark:text-red-200">
                            The Child Support Grant of R560 is 43% below the
                            cost to feed a child a basic nutritious diet
                            (R979.66).
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="mb-4">
                    For families with children, the gap between support and
                    actual costs is widening. This makes tax refunds even more
                    critical for child welfare and nutrition.
                  </p>

                  <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50 mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">
                        Tax Benefits for Families
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          • <strong>Medical scheme fees tax credit:</strong> Up
                          to R347 per child per month
                        </li>
                        <li>
                          • <strong>Additional medical expenses:</strong> Claim
                          amounts above 7.5% of taxable income
                        </li>
                        <li>
                          • <strong>Childcare expenses:</strong> Limited
                          deductions for working parents
                        </li>
                        <li>
                          • <strong>Education expenses:</strong> Some school
                          fees may be deductible
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Plan */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Your 30-Day Action Plan
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="text-green-700 dark:text-green-300">
                          Week 1-2: Assess
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Calculate current monthly expenses</li>
                          <li>• Gather all tax documents</li>
                          <li>• Use Taxfy's refund calculator</li>
                          <li>• Identify potential deductions</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 dark:border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-blue-700 dark:text-blue-300">
                          Week 3: Optimize
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Make additional RA contributions</li>
                          <li>• Organize medical expense receipts</li>
                          <li>• Consider charitable donations</li>
                          <li>• Review work-from-home expenses</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 dark:border-purple-800">
                      <CardHeader>
                        <CardTitle className="text-purple-700 dark:text-purple-300">
                          Week 4: Execute
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• File your tax return early</li>
                          <li>• Plan refund allocation</li>
                          <li>• Set up emergency fund</li>
                          <li>• Monitor refund status</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Call to Action */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                      Don't Let Rising Costs Overwhelm You
                    </h2>
                    <p className="text-lg mb-6 text-muted-foreground">
                      Your tax refund can provide crucial financial relief.
                      Start maximizing it today with Taxfy's free tools and
                      expert guidance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/upload">
                        <Button size="lg" className="px-8">
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate My Refund
                        </Button>
                      </Link>
                      <Link to="/blog/tax-deductions-guide">
                        <Button size="lg" variant="outline" className="px-8">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Deduction Guide
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
                  <CardTitle>Tax Season 2025 Preparation</CardTitle>
                  <CardDescription>
                    Complete preparation checklist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/blog/tax-season-preparation-2025">
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maximize Tax Deductions</CardTitle>
                  <CardDescription>Complete deductions guide</CardDescription>
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
                  <CardTitle>SARS Tax Season 2025</CardTitle>
                  <CardDescription>Key dates and requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/blog/sars-tax-season-2025">
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
