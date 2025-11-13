import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import UnifiedSearch from "@/components/UnifiedSearch";
import {
  WordPressGuides,
  WordPressSupport,
} from "@/components/wordpress/WordPressContent";
import {
  Search as SearchIcon,
  BookOpen,
  HelpCircle,
  FileText,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // Popular search terms for South African tax
  const popularSearches = [
    "IRP5 analysis",
    "SARS eFiling",
    "tax deductions",
    "provisional tax",
    "tax refund",
    "VAT registration",
    "PAYE calculations",
    "medical aid tax",
    "retirement annuity",
    "travel allowance",
    "home office deduction",
    "freelancer tax",
  ];

  const quickCategories = [
    {
      title: "Getting Started",
      description: "New to tax filing? Start here",
      icon: BookOpen,
      searches: ["getting started", "first time filing", "tax basics"],
    },
    {
      title: "Tax Deductions",
      description: "Maximize your deductions",
      icon: TrendingUp,
      searches: ["deductions", "allowances", "medical aid", "retirement"],
    },
    {
      title: "SARS eFiling",
      description: "Help with online filing",
      icon: FileText,
      searches: ["efiling", "online filing", "SARS registration"],
    },
    {
      title: "Support",
      description: "Get help and troubleshooting",
      icon: HelpCircle,
      searches: ["support", "help", "troubleshooting", "error"],
    },
  ];

  const handleSearchTermClick = (term: string) => {
    // Update URL to reflect search
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("q", term);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${newParams.toString()}`,
    );
  };

  return (
    <>
      <SEO
        title="Search Tax Guides & Resources | Taxfy Knowledge Hub"
        description="Search our comprehensive tax guides, SARS filing help, and support articles. Find answers to all your South African tax questions in one place."
        keywords="tax search, SARS help, tax guides, IRP5 analysis, tax deductions, filing support"
        canonical="https://taxfy.co.za/search"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-blue-500/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-6">
                <SearchIcon className="w-4 h-4 mr-2" />
                Search
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Tax Answers Instantly
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Search across our comprehensive tax guides, blog posts, and
                knowledge hub. Get instant answers to your South African tax
                questions.
              </p>
            </div>

            {/* Main Search */}
            <div className="max-w-4xl mx-auto">
              <UnifiedSearch
                autoFocus={!initialQuery}
                placeholder="Search for tax guides, deductions, SARS help..."
                onResultClick={(result) => {
                  // Analytics tracking could go here
                  console.log("Search result clicked:", result);
                }}
              />
            </div>
          </div>
        </section>

        {/* Quick Categories */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground">
                Find what you're looking for quickly with these popular
                categories
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {quickCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.title}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        {category.title}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {category.searches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearchTermClick(term)}
                            className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Searches */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Popular Searches</h2>
              <p className="text-muted-foreground">
                Common tax topics that South African taxpayers search for
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearchTermClick(term)}
                  className="px-4 py-2 bg-background hover:bg-muted border border-border rounded-full text-sm font-medium transition-colors hover:scale-105 transform"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Content from WordPress */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <WordPressGuides limit={4} />
                <div className="text-center mt-6">
                  <Button variant="outline" asChild>
                    <a
                      href="https://hub.taxfy.co.za/guides"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View All Guides
                    </a>
                  </Button>
                </div>
              </div>

              <div>
                <WordPressSupport limit={6} />
                <div className="text-center mt-6">
                  <Button variant="outline" asChild>
                    <a
                      href="https://hub.taxfy.co.za/support"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Support Center
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-blue-500/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Still Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our knowledge hub has hundreds of articles, guides, and resources
              to help you with South African tax.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a
                  href="https://hub.taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Knowledge Hub
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              <p>Need immediate help? Check out our comprehensive guides:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <Link
                  to="/guides/getting-started"
                  className="hover:text-foreground transition-colors"
                >
                  Getting Started Guide
                </Link>
                <span>•</span>
                <Link
                  to="/guides/sars-efiling"
                  className="hover:text-foreground transition-colors"
                >
                  SARS eFiling Help
                </Link>
                <span>•</span>
                <Link
                  to="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  Tax Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
