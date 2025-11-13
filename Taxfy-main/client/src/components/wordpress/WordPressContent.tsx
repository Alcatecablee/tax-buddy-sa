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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  ExternalLink,
  ArrowRight,
  BookOpen,
  HelpCircle,
  User,
  Eye,
  Bookmark,
} from "lucide-react";
import {
  wordpressApi,
  wpUtils,
  type WordPressPost,
} from "@/services/wordpressApiService";

interface WordPressContentProps {
  category?: string;
  limit?: number;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategories?: boolean;
  showFeaturedImage?: boolean;
  layout?: "grid" | "list" | "compact";
  title?: string;
  description?: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaUrl?: string;
}

export const WordPressContent: React.FC<WordPressContentProps> = ({
  category = "",
  limit = 6,
  showExcerpt = true,
  showAuthor = false,
  showDate = true,
  showCategories = true,
  showFeaturedImage = false,
  layout = "grid",
  title = "Latest from Our Knowledge Hub",
  description = "Expert tax guidance and resources from our WordPress hub.",
  showCTA = true,
  ctaText = "View All Articles",
  ctaUrl = "https://hub.taxfy.co.za",
}) => {
  const [posts, setPosts] = React.useState<WordPressPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedPosts: WordPressPost[];

        if (category === "guides") {
          fetchedPosts = await wordpressApi.getGuidePosts(limit);
        } else if (category === "support") {
          fetchedPosts = await wordpressApi.getSupportPosts(limit);
        } else if (category === "featured") {
          fetchedPosts = await wordpressApi.getFeaturedPosts(limit);
        } else {
          fetchedPosts = await wordpressApi.getPosts({
            per_page: limit,
            include_embedded: true,
          });
        }

        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching WordPress posts:", err);
        setError("Failed to load content from knowledge hub");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, limit]);

  if (loading) {
    return <WordPressContentSkeleton layout={layout} limit={limit} />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to Load Content</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" asChild>
          <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Knowledge Hub
          </a>
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Content Available</h3>
        <p className="text-muted-foreground mb-4">
          No articles found in this category yet.
        </p>
        <Button variant="outline" asChild>
          <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Explore Knowledge Hub
          </a>
        </Button>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <div className={getLayoutClasses(layout)}>
        {posts.map((post) => (
          <WordPressPostCard
            key={post.id}
            post={post}
            showExcerpt={showExcerpt}
            showAuthor={showAuthor}
            showDate={showDate}
            showCategories={showCategories}
            showFeaturedImage={showFeaturedImage}
            layout={layout}
          />
        ))}
      </div>

      {showCTA && (
        <div className="text-center mt-8">
          <Button asChild>
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              {ctaText}
            </a>
          </Button>
        </div>
      )}
    </section>
  );
};

interface WordPressPostCardProps {
  post: WordPressPost;
  showExcerpt: boolean;
  showAuthor: boolean;
  showDate: boolean;
  showCategories: boolean;
  showFeaturedImage: boolean;
  layout: "grid" | "list" | "compact";
}

const WordPressPostCard: React.FC<WordPressPostCardProps> = ({
  post,
  showExcerpt,
  showAuthor,
  showDate,
  showCategories,
  showFeaturedImage,
  layout,
}) => {
  const postUrl = wpUtils.getWordPressUrl(
    post.link.replace("https://hub.taxfy.co.za", ""),
  );
  const excerpt = showExcerpt
    ? wpUtils.getExcerpt(post.excerpt.rendered, 120)
    : "";
  const author = showAuthor ? wordpressApi.getAuthorInfo(post) : null;
  const { categories } = wordpressApi.getPostTerms(post);
  const featuredImage = showFeaturedImage
    ? wordpressApi.getFeaturedImageUrl(post)
    : null;
  const publishDate = new Date(post.date);

  if (layout === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {showCategories && categories.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {categories[0].name}
              </Badge>
            )}
            {showDate && (
              <span className="text-xs text-muted-foreground">
                {wpUtils.formatDate(post.date)}
              </span>
            )}
          </div>
          <h3 className="font-semibold hover:text-primary transition-colors">
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </h3>
          {excerpt && (
            <p className="text-sm text-muted-foreground mt-1">{excerpt}</p>
          )}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <a href={postUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
      {featuredImage && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={featuredImage}
            alt={post.title.rendered}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          {showCategories && categories.length > 0 && (
            <Badge variant="outline">{categories[0].name}</Badge>
          )}
          {showDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {wpUtils.formatDate(post.date)}
            </div>
          )}
        </div>

        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </CardTitle>

        {excerpt && (
          <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showAuthor && author && (
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-1" />
                {author.name}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            asChild
          >
            <a href={postUrl} target="_blank" rel="noopener noreferrer">
              Read More
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const WordPressContentSkeleton: React.FC<{ layout: string; limit: number }> = ({
  layout,
  limit,
}) => {
  const skeletonCards = Array.from({ length: Math.min(limit, 6) }, (_, i) => (
    <Card key={i} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <section className="py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className={getLayoutClasses(layout)}>{skeletonCards}</div>
    </section>
  );
};

const getLayoutClasses = (layout: string): string => {
  switch (layout) {
    case "list":
      return "space-y-4";
    case "compact":
      return "space-y-2";
    case "grid":
    default:
      return "grid md:grid-cols-2 lg:grid-cols-3 gap-6";
  }
};

// Export additional WordPress components
export const WordPressGuides: React.FC<{ limit?: number }> = ({
  limit = 6,
}) => (
  <WordPressContent
    category="guides"
    limit={limit}
    title="Tax Guides & Resources"
    description="Comprehensive guides to help you navigate South African tax requirements."
    ctaText="View All Guides"
    ctaUrl="https://hub.taxfy.co.za/guides"
  />
);

export const WordPressSupport: React.FC<{ limit?: number }> = ({
  limit = 4,
}) => (
  <WordPressContent
    category="support"
    limit={limit}
    layout="compact"
    title="Support Articles"
    description="Get help with common questions and technical issues."
    ctaText="Visit Support Center"
    ctaUrl="https://hub.taxfy.co.za/support"
    showExcerpt={false}
  />
);

export const WordPressFeatured: React.FC<{ limit?: number }> = ({
  limit = 3,
}) => (
  <WordPressContent
    category="featured"
    limit={limit}
    title="Featured Content"
    description="Don't miss these important updates and insights."
    showFeaturedImage={true}
    ctaText="Explore More"
    ctaUrl="https://hub.taxfy.co.za"
  />
);
