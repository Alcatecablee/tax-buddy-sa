import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import ClickableTag from "@/components/ClickableTag";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  slug: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
}

interface RelatedPostsProps {
  currentPost: {
    tags: string[];
    category: string;
    slug: string;
  };
  allPosts: BlogPost[];
  maxPosts?: number;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPost,
  allPosts,
  maxPosts = 3,
}) => {
  // Find related posts based on shared tags and category
  const relatedPosts = React.useMemo(() => {
    const scored = allPosts
      .filter((post) => post.slug !== currentPost.slug)
      .map((post) => {
        let score = 0;

        // Same category gets high score
        if (post.category === currentPost.category) {
          score += 3;
        }

        // Shared tags get points
        const sharedTags = post.tags.filter((tag) =>
          currentPost.tags.includes(tag),
        ).length;
        score += sharedTags * 2;

        return { post, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPosts)
      .map((item) => item.post);

    return scored;
  }, [currentPost, allPosts, maxPosts]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border/40">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Related Articles</h2>
        <p className="text-muted-foreground">
          More insights on similar topics to help with your tax planning.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card
            key={post.id}
            className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 2).map((tag) => (
                  <ClickableTag
                    key={tag}
                    tag={tag}
                    variant="secondary"
                    size="sm"
                  />
                ))}
                {post.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(post.publishDate).toLocaleDateString("en-ZA", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-2 text-xs"
                  >
                    Read More
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
