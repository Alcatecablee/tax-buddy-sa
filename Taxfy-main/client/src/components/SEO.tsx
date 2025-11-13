import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  structuredData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = "maximize SARS refund, South African tax calculator, IRP5 analyzer, SARS tax refund calculator, tax return calculator South Africa, SARS eFiling helper, maximize tax refund",
  canonical,
  ogImage = "https://taxfy.co.za/og-image.jpg",
  ogType = "website",
  publishedTime,
  modifiedTime,
  author = "Taxfy",
  section,
  structuredData,
}) => {
  const siteUrl = "https://taxfy.co.za";
  const fullTitle = title.includes("Taxfy") ? title : `${title} | Taxfy`;
  const url = canonical || siteUrl;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Taxfy",
    description:
      "Get your SARS refund with our free South African tax calculator and IRP5 analyzer. Maximize your refund and check if SARS owes you money in minutes.",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Taxfy",
      url: siteUrl,
      logo: "https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800",
      sameAs: ["https://twitter.com/TaxfySA", "https://facebook.com/TaxfySA"],
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Taxfy" />
      <meta property="og:locale" content="en_ZA" />

      {/* Article specific Open Graph */}
      {ogType === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === "article" && section && (
        <meta property="article:section" content={section} />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@TaxfySA" />
      <meta name="twitter:creator" content="@TaxfySA" />

      {/* Additional Meta Tags for South African Context */}
      <meta name="geo.region" content="ZA" />
      <meta name="geo.country" content="South Africa" />
      <meta name="language" content="en-ZA" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </Helmet>
  );
};

// Helper function to create FAQ structured data
export const createFAQStructuredData = (
  faqs: Array<{ question: string; answer: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Helper function to create Article structured data
export const createArticleStructuredData = (article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: article.headline,
  description: article.description,
  image: article.image,
  author: {
    "@type": "Organization",
    name: article.author,
    url: "https://taxfy.co.za",
  },
  publisher: {
    "@type": "Organization",
    name: "Taxfy",
    logo: "https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800",
  },
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": article.url,
  },
});

// Helper function to create HowTo structured data
export const createHowToStructuredData = (howTo: {
  name: string;
  description: string;
  image: string;
  steps: Array<{ name: string; text: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: howTo.name,
  description: howTo.description,
  image: howTo.image,
  step: howTo.steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
});
