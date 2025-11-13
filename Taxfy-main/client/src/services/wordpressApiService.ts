import { z } from "zod";

// WordPress API types
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      slug: string;
      avatar_urls: Record<string, string>;
    }>;
    "wp:featuredmedia"?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
        taxonomy: string;
      }>
    >;
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WordPressPage {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  parent: number;
  menu_order: number;
  template: string;
}

export interface WordPressSearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
}

// Configuration
const WORDPRESS_BASE_URL = "https://hub.taxfy.co.za";
const WP_API_BASE = `${WORDPRESS_BASE_URL}/wp-json/wp/v2`;

// WordPress API service class
export class WordPressApiService {
  private baseUrl = WP_API_BASE;

  // Helper method to make API requests
  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `WordPress API error: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("WordPress API request failed:", error);
      throw error;
    }
  }

  // Get posts with optional filtering
  async getPosts(
    options: {
      per_page?: number;
      page?: number;
      categories?: number[];
      tags?: number[];
      search?: string;
      slug?: string;
      include_embedded?: boolean;
      status?: string;
      orderby?: string;
      order?: "asc" | "desc";
    } = {},
  ): Promise<WordPressPost[]> {
    const params: Record<string, any> = {
      per_page: options.per_page || 10,
      page: options.page || 1,
      status: options.status || "publish",
      orderby: options.orderby || "date",
      order: options.order || "desc",
    };

    if (options.categories?.length) {
      params.categories = options.categories.join(",");
    }

    if (options.tags?.length) {
      params.tags = options.tags.join(",");
    }

    if (options.search) {
      params.search = options.search;
    }

    if (options.slug) {
      params.slug = options.slug;
    }

    if (options.include_embedded) {
      params._embed = true;
    }

    return this.makeRequest<WordPressPost[]>("/posts", params);
  }

  // Get a single post by slug
  async getPostBySlug(
    slug: string,
    includeEmbedded = true,
  ): Promise<WordPressPost | null> {
    try {
      const posts = await this.getPosts({
        slug,
        include_embedded: includeEmbedded,
        per_page: 1,
      });
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      console.error("Error fetching post by slug:", error);
      return null;
    }
  }

  // Get categories
  async getCategories(
    options: {
      per_page?: number;
      hide_empty?: boolean;
      parent?: number;
    } = {},
  ): Promise<WordPressCategory[]> {
    const params = {
      per_page: options.per_page || 100,
      hide_empty: options.hide_empty !== false,
      ...(options.parent !== undefined && { parent: options.parent }),
    };

    return this.makeRequest<WordPressCategory[]>("/categories", params);
  }

  // Get tags
  async getTags(
    options: {
      per_page?: number;
      hide_empty?: boolean;
    } = {},
  ): Promise<WordPressTag[]> {
    const params = {
      per_page: options.per_page || 100,
      hide_empty: options.hide_empty !== false,
    };

    return this.makeRequest<WordPressTag[]>("/tags", params);
  }

  // Get pages
  async getPages(
    options: {
      per_page?: number;
      page?: number;
      parent?: number;
      menu_order?: string;
      status?: string;
    } = {},
  ): Promise<WordPressPage[]> {
    const params = {
      per_page: options.per_page || 100,
      page: options.page || 1,
      status: options.status || "publish",
      ...(options.parent !== undefined && { parent: options.parent }),
      ...(options.menu_order && { orderby: "menu_order", order: "asc" }),
    };

    return this.makeRequest<WordPressPage[]>("/pages", params);
  }

  // Get a single page by slug
  async getPageBySlug(slug: string): Promise<WordPressPage | null> {
    try {
      const pages = await this.getPages({ per_page: 1 });
      const page = pages.find((p) => p.slug === slug);
      return page || null;
    } catch (error) {
      console.error("Error fetching page by slug:", error);
      return null;
    }
  }

  // Search content
  async searchContent(
    query: string,
    options: {
      per_page?: number;
      type?: string[];
      subtype?: string[];
    } = {},
  ): Promise<WordPressSearchResult[]> {
    const params = {
      search: query,
      per_page: options.per_page || 20,
      ...(options.type?.length && { type: options.type.join(",") }),
      ...(options.subtype?.length && { subtype: options.subtype.join(",") }),
    };

    return this.makeRequest<WordPressSearchResult[]>("/search", params);
  }

  // Get featured posts (sticky posts)
  async getFeaturedPosts(limit = 5): Promise<WordPressPost[]> {
    return this.getPosts({
      per_page: limit,
      include_embedded: true,
      orderby: "date",
      order: "desc",
    }).then((posts) => posts.filter((post) => post.sticky));
  }

  // Get recent posts from specific categories
  async getGuidePosts(limit = 10): Promise<WordPressPost[]> {
    try {
      // Get guides category
      const categories = await this.getCategories();
      const guidesCategory = categories.find(
        (cat) =>
          cat.slug === "guides" || cat.name.toLowerCase().includes("guide"),
      );

      if (!guidesCategory) {
        return [];
      }

      return this.getPosts({
        categories: [guidesCategory.id],
        per_page: limit,
        include_embedded: true,
      });
    } catch (error) {
      console.error("Error fetching guide posts:", error);
      return [];
    }
  }

  // Get support articles
  async getSupportPosts(limit = 10): Promise<WordPressPost[]> {
    try {
      const categories = await this.getCategories();
      const supportCategory = categories.find(
        (cat) =>
          cat.slug === "support" || cat.name.toLowerCase().includes("support"),
      );

      if (!supportCategory) {
        return [];
      }

      return this.getPosts({
        categories: [supportCategory.id],
        per_page: limit,
        include_embedded: true,
      });
    } catch (error) {
      console.error("Error fetching support posts:", error);
      return [];
    }
  }

  // Get WordPress site URL helpers
  getPostUrl(post: WordPressPost): string {
    return post.link;
  }

  getCategoryUrl(category: WordPressCategory): string {
    return category.link;
  }

  getTagUrl(tag: WordPressTag): string {
    return tag.link;
  }

  // Helper to extract plain text from WordPress content
  extractPlainText(htmlContent: string, maxLength = 200): string {
    // Remove HTML tags
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    // Decode HTML entities
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = textContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    // Truncate if needed
    if (plainText.length > maxLength) {
      return plainText.substring(0, maxLength).trim() + "...";
    }

    return plainText.trim();
  }

  // Helper to get featured image URL
  getFeaturedImageUrl(
    post: WordPressPost,
    size: "thumbnail" | "medium" | "large" | "full" = "medium",
  ): string | null {
    const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
    if (!featuredMedia) return null;

    // For now, return the source URL. In a real implementation,
    // you might want to handle different image sizes
    return featuredMedia.source_url;
  }

  // Helper to get post author info
  getAuthorInfo(post: WordPressPost): { name: string; avatar?: string } | null {
    const author = post._embedded?.author?.[0];
    if (!author) return null;

    return {
      name: author.name,
      avatar: author.avatar_urls?.["96"] || author.avatar_urls?.["48"],
    };
  }

  // Helper to get post categories and tags
  getPostTerms(post: WordPressPost): {
    categories: WordPressCategory[];
    tags: WordPressTag[];
  } {
    const terms = post._embedded?.["wp:term"] || [];
    const categories: WordPressCategory[] = [];
    const tags: WordPressTag[] = [];

    terms.forEach((termGroup) => {
      termGroup.forEach((term) => {
        if (term.taxonomy === "category") {
          categories.push(term as WordPressCategory);
        } else if (term.taxonomy === "post_tag") {
          tags.push(term as WordPressTag);
        }
      });
    });

    return { categories, tags };
  }
}

// Export singleton instance
export const wordpressApi = new WordPressApiService();

// Export utility functions
export const wpUtils = {
  stripHtml: (html: string) => html.replace(/<[^>]*>/g, ""),
  formatDate: (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-ZA"),
  getExcerpt: (content: string, length = 150) => {
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > length ? text.substring(0, length) + "..." : text;
  },
  getWordPressUrl: (path: string) => `${WORDPRESS_BASE_URL}${path}`,
  getHubUrl: (path = "") => `https://hub.taxfy.co.za${path}`,
};
