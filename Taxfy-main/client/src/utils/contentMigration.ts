/**
 * Content Migration and Cross-Platform SEO Utilities
 *
 * This file manages the relationship between local React app content
 * and WordPress hub content for SEO optimization and user experience.
 */

export interface ContentMapping {
  local: string;
  wordpress: string;
  title: string;
  description: string;
  canonical: "local" | "wordpress";
  migrationStatus: "completed" | "in-progress" | "planned";
  seoStrategy: "canonical" | "redirect" | "cross-link";
}

/**
 * Master content mapping between React app and WordPress hub
 * This ensures consistent cross-linking and SEO optimization
 */
export const contentMappings: ContentMapping[] = [
  // Guides
  {
    local: "/guides/getting-started",
    wordpress: "https://hub.taxfy.co.za/guides/getting-started",
    title: "Getting Started with Tax Filing",
    description: "Complete beginner's guide to South African tax filing",
    canonical: "local",
    migrationStatus: "completed",
    seoStrategy: "cross-link",
  },
  {
    local: "/guides/freelancer-tax",
    wordpress: "https://hub.taxfy.co.za/guides/freelancer-tax",
    title: "Freelancer Tax Guide",
    description: "Tax obligations and deductions for freelancers",
    canonical: "local",
    migrationStatus: "completed",
    seoStrategy: "cross-link",
  },
  {
    local: "/guides/business-tax",
    wordpress: "https://hub.taxfy.co.za/guides/business-tax",
    title: "Business Tax Guide",
    description: "Business tax requirements and compliance",
    canonical: "local",
    migrationStatus: "completed",
    seoStrategy: "cross-link",
  },
  {
    local: "/guides/sars-efiling",
    wordpress: "https://hub.taxfy.co.za/guides/sars-efiling",
    title: "SARS eFiling Guide",
    description: "Complete guide to using SARS eFiling system",
    canonical: "local",
    migrationStatus: "completed",
    seoStrategy: "cross-link",
  },
  {
    local: "/guides/vat-paye",
    wordpress: "https://hub.taxfy.co.za/guides/vat-paye",
    title: "VAT & PAYE Guide",
    description: "Understanding VAT and PAYE requirements",
    canonical: "local",
    migrationStatus: "completed",
    seoStrategy: "cross-link",
  },

  // Support Content (WordPress-first)
  {
    local: "/support/filing-issues",
    wordpress: "https://hub.taxfy.co.za/support/filing-issues",
    title: "Common Filing Issues",
    description: "Troubleshooting common SARS filing problems",
    canonical: "wordpress",
    migrationStatus: "completed",
    seoStrategy: "redirect",
  },
  {
    local: "/support/document-upload",
    wordpress: "https://hub.taxfy.co.za/support/document-upload",
    title: "Document Upload Help",
    description: "Help with uploading documents to SARS",
    canonical: "wordpress",
    migrationStatus: "completed",
    seoStrategy: "redirect",
  },

  // Community Content (WordPress-only)
  {
    local: "/community",
    wordpress: "https://hub.taxfy.co.za/community",
    title: "Tax Community Forum",
    description: "Connect with other taxpayers and experts",
    canonical: "wordpress",
    migrationStatus: "completed",
    seoStrategy: "redirect",
  },
];

/**
 * Get content mapping by local path
 */
export function getContentMapping(localPath: string): ContentMapping | null {
  return contentMappings.find((mapping) => mapping.local === localPath) || null;
}

/**
 * Get content mapping by WordPress URL
 */
export function getContentMappingByWordPress(
  wpUrl: string,
): ContentMapping | null {
  return contentMappings.find((mapping) => mapping.wordpress === wpUrl) || null;
}

/**
 * Generate canonical URL based on content strategy
 */
export function getCanonicalUrl(localPath: string): string {
  const mapping = getContentMapping(localPath);
  if (!mapping) {
    return `https://taxfy.co.za${localPath}`;
  }

  switch (mapping.canonical) {
    case "wordpress":
      return mapping.wordpress;
    case "local":
    default:
      return `https://taxfy.co.za${localPath}`;
  }
}

/**
 * Generate cross-platform navigation suggestions
 */
export function getCrossPlatformSuggestions(currentPath: string): Array<{
  title: string;
  url: string;
  type: "local" | "wordpress";
  description: string;
}> {
  const suggestions = [];

  // If on local content, suggest WordPress alternatives
  if (currentPath.startsWith("/guides/")) {
    suggestions.push({
      title: "Enhanced Community Discussions",
      url: "https://hub.taxfy.co.za/community",
      type: "wordpress" as const,
      description: "Join discussions about this topic with other taxpayers",
    });

    suggestions.push({
      title: "Interactive Tutorials",
      url: "https://hub.taxfy.co.za/tutorials",
      type: "wordpress" as const,
      description: "Step-by-step interactive guides with screenshots",
    });
  }

  // If on blog, suggest related guides
  if (currentPath.startsWith("/blog/")) {
    suggestions.push({
      title: "Practical Guides",
      url: "/guides",
      type: "local" as const,
      description: "Actionable guides related to this topic",
    });

    suggestions.push({
      title: "Support Center",
      url: "https://hub.taxfy.co.za/support",
      type: "wordpress" as const,
      description: "Get help implementing these strategies",
    });
  }

  return suggestions;
}

/**
 * SEO metadata generator for cross-platform content
 */
export function generateCrossPlatformMeta(localPath: string) {
  const mapping = getContentMapping(localPath);
  if (!mapping) {
    return null;
  }

  const meta = {
    canonical: getCanonicalUrl(localPath),
    alternates: [] as Array<{ href: string; title: string; type: string }>,
    structured: {
      "@context": "https://schema.org",
      "@type": "Article",
      name: mapping.title,
      description: mapping.description,
      url: `https://taxfy.co.za${localPath}`,
      sameAs: mapping.wordpress,
      publisher: {
        "@type": "Organization",
        name: "Taxfy",
        url: "https://taxfy.co.za",
      },
    },
  };

  // Add alternate version
  if (mapping.canonical === "local") {
    meta.alternates.push({
      href: mapping.wordpress,
      title: `${mapping.title} - Enhanced Version`,
      type: "text/html",
    });
  } else {
    meta.alternates.push({
      href: `https://taxfy.co.za${localPath}`,
      title: `${mapping.title} - Quick Reference`,
      type: "text/html",
    });
  }

  return meta;
}

/**
 * Generate internal linking suggestions for SEO
 */
export function getInternalLinkingSuggestions(currentPath: string): Array<{
  anchor: string;
  url: string;
  type: "local" | "wordpress";
  context: string;
}> {
  const suggestions = [];

  // Common cross-links based on content type
  if (currentPath.includes("freelancer")) {
    suggestions.push(
      {
        anchor: "business tax requirements",
        url: "/guides/business-tax",
        type: "local" as const,
        context: "When discussing business income",
      },
      {
        anchor: "home office deduction calculator",
        url: "/upload",
        type: "local" as const,
        context: "When mentioning home office expenses",
      },
      {
        anchor: "freelancer tax community",
        url: "https://hub.taxfy.co.za/community/freelancer-tax",
        type: "wordpress" as const,
        context: "For peer support and discussions",
      },
    );
  }

  if (currentPath.includes("sars-efiling")) {
    suggestions.push(
      {
        anchor: "document upload troubleshooting",
        url: "https://hub.taxfy.co.za/support/document-upload",
        type: "wordpress" as const,
        context: "When discussing technical issues",
      },
      {
        anchor: "getting started guide",
        url: "/guides/getting-started",
        type: "local" as const,
        context: "For beginners to tax filing",
      },
    );
  }

  return suggestions;
}

/**
 * Migration status checker
 */
export function getMigrationProgress(): {
  total: number;
  completed: number;
  inProgress: number;
  planned: number;
  percentage: number;
} {
  const total = contentMappings.length;
  const completed = contentMappings.filter(
    (m) => m.migrationStatus === "completed",
  ).length;
  const inProgress = contentMappings.filter(
    (m) => m.migrationStatus === "in-progress",
  ).length;
  const planned = contentMappings.filter(
    (m) => m.migrationStatus === "planned",
  ).length;

  return {
    total,
    completed,
    inProgress,
    planned,
    percentage: Math.round((completed / total) * 100),
  };
}

/**
 * Content performance analytics helper
 */
export function trackCrossPlatformNavigation(
  from: string,
  to: string,
  type: "local" | "wordpress",
) {
  // This would integrate with your analytics service
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "cross_platform_navigation", {
      event_category: "Content",
      event_label: `${from} -> ${to}`,
      custom_parameter_type: type,
    });
  }

  // Console log for development
  console.log("Cross-platform navigation:", { from, to, type });
}

/**
 * Generate sitemap entries for cross-platform content
 */
export function generateSitemapEntries(): Array<{
  url: string;
  priority: number;
  changefreq: string;
  alternates: string[];
}> {
  return contentMappings.map((mapping) => ({
    url: `https://taxfy.co.za${mapping.local}`,
    priority: mapping.canonical === "local" ? 0.8 : 0.6,
    changefreq: "weekly",
    alternates: [mapping.wordpress],
  }));
}

export default {
  contentMappings,
  getContentMapping,
  getContentMappingByWordPress,
  getCanonicalUrl,
  getCrossPlatformSuggestions,
  generateCrossPlatformMeta,
  getInternalLinkingSuggestions,
  getMigrationProgress,
  trackCrossPlatformNavigation,
  generateSitemapEntries,
};
