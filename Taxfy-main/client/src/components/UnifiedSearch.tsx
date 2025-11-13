import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ExternalLink,
  FileText,
  BookOpen,
  HelpCircle,
  Calendar,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import {
  wordpressApi,
  wpUtils,
  type WordPressSearchResult,
  type WordPressPost,
} from "@/services/wordpressApiService";
import { blogPosts } from "@/data/blogPosts";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "local-blog" | "local-guide" | "wordpress-post" | "wordpress-page";
  category?: string;
  date?: string;
  source: "local" | "wordpress";
  external?: boolean;
}

interface UnifiedSearchProps {
  placeholder?: string;
  showFilters?: boolean;
  maxResults?: number;
  categories?: string[];
  autoFocus?: boolean;
  onResultClick?: (result: SearchResult) => void;
}

export const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
  placeholder = "Search guides, blog posts, and support articles...",
  showFilters = true,
  maxResults = 20,
  categories = [],
  autoFocus = false,
  onResultClick,
}) => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedSources, setSelectedSources] = React.useState<string[]>([
    "local",
    "wordpress",
  ]);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  // Debounced search
  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, selectedSources, selectedTypes]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setHasSearched(true);
    const allResults: SearchResult[] = [];

    try {
      // Search local content
      if (selectedSources.includes("local")) {
        const localResults = searchLocalContent(searchQuery);
        allResults.push(...localResults);
      }

      // Search WordPress content
      if (selectedSources.includes("wordpress")) {
        try {
          const wpResults = await searchWordPressContent(searchQuery);
          allResults.push(...wpResults);
        } catch (error) {
          console.error("WordPress search failed:", error);
        }
      }

      // Filter by type if specified
      let filteredResults = allResults;
      if (selectedTypes.length > 0) {
        filteredResults = allResults.filter((result) =>
          selectedTypes.includes(result.type),
        );
      }

      // Sort by relevance (simple scoring)
      filteredResults.sort((a, b) => {
        const aScore = getRelevanceScore(a, searchQuery);
        const bScore = getRelevanceScore(b, searchQuery);
        return bScore - aScore;
      });

      setResults(filteredResults.slice(0, maxResults));
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const searchLocalContent = (searchQuery: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const lowerQuery = searchQuery.toLowerCase();

    // Search blog posts
    blogPosts.forEach((post) => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const descMatch = post.description.toLowerCase().includes(lowerQuery);
      const tagsMatch = post.tags.some((tag) =>
        tag.toLowerCase().includes(lowerQuery),
      );

      if (titleMatch || descMatch || tagsMatch) {
        results.push({
          id: `local-blog-${post.id}`,
          title: post.title,
          description: post.description,
          url: `/blog/${post.slug}`,
          type: "local-blog",
          category: post.category,
          date: post.publishDate,
          source: "local",
        });
      }
    });

    // Search local guides (if you have them in a data structure)
    const localGuides = [
      {
        slug: "getting-started",
        title: "Getting Started with Tax Filing",
        description: "Complete guide to filing your taxes in South Africa",
      },
      {
        slug: "freelancer-tax",
        title: "Freelancer Tax Guide",
        description: "Tax obligations and deductions for freelancers",
      },
      {
        slug: "business-tax",
        title: "Business Tax Guide",
        description: "Business tax requirements and compliance",
      },
      {
        slug: "sars-efiling",
        title: "SARS eFiling Guide",
        description: "How to use SARS eFiling system",
      },
      {
        slug: "vat-paye",
        title: "VAT & PAYE Guide",
        description: "Understanding VAT and PAYE requirements",
      },
    ];

    localGuides.forEach((guide) => {
      const titleMatch = guide.title.toLowerCase().includes(lowerQuery);
      const descMatch = guide.description.toLowerCase().includes(lowerQuery);

      if (titleMatch || descMatch) {
        results.push({
          id: `local-guide-${guide.slug}`,
          title: guide.title,
          description: guide.description,
          url: `/guides/${guide.slug}`,
          type: "local-guide",
          category: "Guides",
          source: "local",
        });
      }
    });

    return results;
  };

  const searchWordPressContent = async (
    searchQuery: string,
  ): Promise<SearchResult[]> => {
    try {
      const wpSearchResults = await wordpressApi.searchContent(searchQuery, {
        per_page: 10,
        type: ["post", "page"],
      });

      const results: SearchResult[] = [];

      for (const wpResult of wpSearchResults) {
        // Get the full post/page data for better information
        try {
          let fullContent: WordPressPost | null = null;

          if (wpResult.subtype === "post") {
            const posts = await wordpressApi.getPosts({
              include_embedded: true,
              per_page: 1,
            });
            fullContent = posts.find((p) => p.id === wpResult.id) || null;
          }

          results.push({
            id: `wp-${wpResult.type}-${wpResult.id}`,
            title: wpResult.title,
            description: fullContent
              ? wpUtils.getExcerpt(fullContent.excerpt.rendered, 120)
              : "View this article on our knowledge hub",
            url: wpResult.url,
            type:
              wpResult.subtype === "post" ? "wordpress-post" : "wordpress-page",
            category: fullContent
              ? wordpressApi.getPostTerms(fullContent).categories[0]?.name
              : undefined,
            date: fullContent?.date,
            source: "wordpress",
            external: true,
          });
        } catch (error) {
          console.error("Error fetching full WordPress content:", error);
          // Fallback to basic search result
          results.push({
            id: `wp-${wpResult.type}-${wpResult.id}`,
            title: wpResult.title,
            description: "View this article on our knowledge hub",
            url: wpResult.url,
            type:
              wpResult.subtype === "post" ? "wordpress-post" : "wordpress-page",
            source: "wordpress",
            external: true,
          });
        }
      }

      return results;
    } catch (error) {
      console.error("WordPress search error:", error);
      return [];
    }
  };

  const getRelevanceScore = (result: SearchResult, query: string): number => {
    const lowerQuery = query.toLowerCase();
    const lowerTitle = result.title.toLowerCase();
    const lowerDesc = result.description.toLowerCase();

    let score = 0;

    // Title matches are weighted more heavily
    if (lowerTitle.includes(lowerQuery)) score += 10;
    if (lowerTitle.startsWith(lowerQuery)) score += 5;

    // Description matches
    if (lowerDesc.includes(lowerQuery)) score += 3;

    // Exact matches get bonus points
    if (lowerTitle === lowerQuery) score += 20;

    // Local content gets slight preference for internal navigation
    if (result.source === "local") score += 1;

    return score;
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
  };

  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source],
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearFilters = () => {
    setSelectedSources(["local", "wordpress"]);
    setSelectedTypes([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "local-blog":
      case "wordpress-post":
        return <FileText className="w-4 h-4" />;
      case "local-guide":
        return <BookOpen className="w-4 h-4" />;
      case "wordpress-page":
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "local-blog":
        return "Blog Post";
      case "local-guide":
        return "Guide";
      case "wordpress-post":
        return "Hub Article";
      case "wordpress-page":
        return "Hub Page";
      default:
        return "Article";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 py-3 text-lg"
          autoFocus={autoFocus}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-4 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Search Sources:</span>
            <div className="flex gap-2">
              <Badge
                variant={
                  selectedSources.includes("local") ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleSource("local")}
              >
                Local Content
              </Badge>
              <Badge
                variant={
                  selectedSources.includes("wordpress") ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleSource("wordpress")}
              >
                Knowledge Hub
              </Badge>
            </div>
            {(selectedSources.length !== 2 || selectedTypes.length > 0) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>

          {selectedTypes.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Filtered by:</span>
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary" className="gap-1">
                  {getTypeLabel(type)}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleType(type)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {results.length} result{results.length !== 1 ? "s" : ""} for "
              {query}"
            </h3>
          </div>

          {results.map((result, index) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(result.type)}
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(result.type)}
                  </Badge>
                  {result.category && (
                    <Badge variant="secondary" className="text-xs">
                      {result.category}
                    </Badge>
                  )}
                  {result.source === "wordpress" && (
                    <Badge variant="default" className="text-xs">
                      Knowledge Hub
                    </Badge>
                  )}
                  {result.date && (
                    <div className="flex items-center text-xs text-muted-foreground ml-auto">
                      <Calendar className="w-3 h-3 mr-1" />
                      {wpUtils.formatDate(result.date)}
                    </div>
                  )}
                </div>

                <CardTitle className="text-lg hover:text-primary transition-colors">
                  {result.external ? (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleResultClick(result)}
                      className="flex items-center gap-1"
                    >
                      {result.title}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      to={result.url}
                      onClick={() => handleResultClick(result)}
                    >
                      {result.title}
                    </Link>
                  )}
                </CardTitle>

                <CardDescription className="line-clamp-2">
                  {result.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {result.source === "local"
                      ? "Taxfy.co.za"
                      : "hub.taxfy.co.za"}
                  </span>

                  {result.external ? (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleResultClick(result)}
                      >
                        Visit Hub
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        to={result.url}
                        onClick={() => handleResultClick(result)}
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && hasSearched && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any content matching "{query}". Try adjusting your
            search terms or exploring our knowledge hub.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/blog">Browse Blog</Link>
            </Button>
            <Button asChild>
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
      )}
    </div>
  );
};

export default UnifiedSearch;
