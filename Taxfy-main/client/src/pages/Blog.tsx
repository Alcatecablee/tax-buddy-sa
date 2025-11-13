import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  FileText,
  Calculator,
  Filter,
  Tag,
  X,
  ExternalLink,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { blogPosts, categories, type BlogPost } from "@/data/blogPosts";
import { WordPressFeatured } from "@/components/wordpress/WordPressContent";

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  // Initialize filters from URL params
  React.useEffect(() => {
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");

    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory((prev) =>
        prev !== categoryParam ? categoryParam : prev,
      );
    } else {
      setSelectedCategory((prev) => (prev !== "All" ? "All" : prev));
    }

    if (tagParam) {
      setSelectedTags((prev) =>
        prev.length !== 1 || prev[0] !== tagParam ? [tagParam] : prev,
      );
    } else {
      setSelectedTags((prev) => (prev.length !== 0 ? [] : prev));
    }
  }, [searchParams.get("category"), searchParams.get("tag")]);

  // Get all unique tags from blog posts
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    blogPosts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);

  // Filter posts based on category and tags
  const filteredPosts = React.useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag)),
      );
    }

    return filtered;
  }, [selectedCategory, selectedTags]);

  const featuredPosts = blogPosts.filter((post) => post.featured).slice(0, 6);

  // Handle tag selection
  const handleTagClick = React.useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      // Update URL in a separate effect to avoid setState during render
      setTimeout(() => {
        const newParams = new URLSearchParams(window.location.search);
        if (newTags.length > 0) {
          newParams.set("tag", newTags[0]); // For simplicity, show first tag in URL
        } else {
          newParams.delete("tag");
        }
        const newUrl = `${window.location.pathname}?${newParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }, 0);

      return newTags;
    });
  }, []);

  // Handle category selection
  const handleCategoryClick = React.useCallback((category: string) => {
    setSelectedCategory(category);

    // Update URL in a separate effect to avoid setState during render
    setTimeout(() => {
      const newParams = new URLSearchParams(window.location.search);
      if (category !== "All") {
        newParams.set("category", category);
      } else {
        newParams.delete("category");
      }
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }, 0);
  }, []);

  // Clear all filters
  const clearFilters = React.useCallback(() => {
    setSelectedCategory("All");
    setSelectedTags([]);

    // Clear URL params
    setTimeout(() => {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }, 0);
  }, []);

  // Structured data for blog page
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Taxfy Tax Blog",
    description:
      "Expert insights on South African tax, SARS filing, tax refunds, and tax optimization strategies.",
    url: "https://taxfy.co.za/blog",
    publisher: {
      "@type": "Organization",
      name: "Taxfy",
      url: "https://taxfy.co.za",
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://taxfy.co.za/blog/${post.slug}`,
      datePublished: post.publishDate,
      author: {
        "@type": "Organization",
        name: "Taxfy",
      },
      publisher: {
        "@type": "Organization",
        name: "Taxfy",
      },
      keywords: post.tags.join(", "),
    })),
  };

  return (
    <>
      <SEO
        title="South African Tax Blog | SARS Filing Tips, Tax Refunds & Deductions | Taxfy"
        description="Expert insights on South African tax, SARS filing, tax refunds, and deductions. Get the latest updates on tax season 2025, IRP5 analysis, and tax optimization strategies."
        keywords="South African tax blog, SARS filing tips, tax refund guide, tax deductions South Africa, IRP5 analysis, tax season 2025, SARS eFiling help"
        canonical="https://taxfy.co.za/blog"
        structuredData={blogStructuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-blue-500/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-6">
                <BookOpen className="w-4 h-4 mr-2" />
                Tax Blog
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Maximize Your SARS Refund with Expert Tax Insights
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Expert insights on SARS filing, tax refunds, deductions, and
                everything you need to know to maximize your SARS refund. Stay
                updated with the latest tax season 2025 information and current
                tax trends.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload">
                  <Button size="lg" className="px-8">
                    <Calculator className="w-4 h-4 mr-2" />
                    Try Free Tax Calculator
                  </Button>
                </Link>
                <Link to="/blog/mid-year-tax-planning-2025">
                  <Button variant="outline" size="lg" className="px-8">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Latest Tax Strategies
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-6 border-b border-border/40">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-4 mb-6">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Filter Articles</h2>
              {(selectedCategory !== "All" || selectedTags.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {["All", ...categories].map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryClick(category)}
                    className="transition-all"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tag Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== "All" || selectedTags.length > 0) && (
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Filter className="w-4 h-4" />
                  Active Filters:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== "All" && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {selectedCategory}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleCategoryClick("All")}
                      />
                    </Badge>
                  )}
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      Tag: {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleTagClick(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results Summary */}
        <section className="py-4 px-6 bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPosts.length} of {blogPosts.length} articles
                {(selectedCategory !== "All" || selectedTags.length > 0) && (
                  <span className="ml-1">
                    ({selectedCategory !== "All" && `in ${selectedCategory}`}
                    {selectedCategory !== "All" &&
                      selectedTags.length > 0 &&
                      ", "}
                    {selectedTags.length > 0 &&
                      `tagged: ${selectedTags.join(", ")}`}
                    )
                  </span>
                )}
              </p>
              <div className="text-xs text-muted-foreground">
                Latest updates from South African tax experts
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content from Knowledge Hub */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <WordPressFeatured limit={3} />
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Stay ahead with the latest tax insights, SARS updates, and
                strategies for South African taxpayers in 2025.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishDate).toLocaleDateString(
                          "en-ZA",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {selectedCategory === "All" && selectedTags.length === 0
                  ? "All Articles"
                  : selectedCategory !== "All" && selectedTags.length === 0
                    ? `${selectedCategory} Articles`
                    : selectedCategory === "All" && selectedTags.length > 0
                      ? `Articles tagged: ${selectedTags.join(", ")}`
                      : `${selectedCategory} articles tagged: ${selectedTags.join(", ")}`}
              </h2>
              <p className="text-muted-foreground">
                {selectedCategory === "All" && selectedTags.length === 0
                  ? "Browse all our South African tax guides and insights."
                  : `Filtered articles based on your selection.`}
              </p>
            </div>

            <div className="grid gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <div className="grid md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="outline">{post.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.publishDate).toLocaleDateString(
                            "en-ZA",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-muted-foreground mb-4">
                        {post.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              selectedTags.includes(tag)
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs cursor-pointer hover:scale-105 transition-all"
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <Link to={`/blog/${post.slug}`}>
                        <Button className="group-hover:scale-105 transition-transform">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground mb-6">
                  No articles found for your current filters.
                </p>
                <Button onClick={clearFilters}>View All Articles</Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-blue-500/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Ahead with the Latest Tax Insights
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get expert strategies to maximize your SARS refund, plus the
              latest tax updates and compliance tips for South African
              taxpayers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button size="lg" className="px-8">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Your Refund
                </Button>
              </Link>
              <a
                href="https://hub.taxfy.co.za"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="px-8">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Knowledge Hub
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
