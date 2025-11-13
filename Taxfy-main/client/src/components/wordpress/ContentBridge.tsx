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
import {
  ExternalLink,
  ArrowRight,
  BookOpen,
  FileText,
  Info,
  Link2,
  Bookmark,
  HelpCircle,
} from "lucide-react";

interface ContentBridgeProps {
  currentPage?: string;
  relatedTopics?: string[];
  showCanonicalNote?: boolean;
}

// SEO cross-linking component for content bridge pages
export const ContentBridge: React.FC<ContentBridgeProps> = ({
  currentPage = "",
  relatedTopics = [],
  showCanonicalNote = true,
}) => {
  // Map of related content between React app and WordPress hub
  const contentMap = {
    "getting-started": {
      title: "Getting Started with Tax Filing",
      description: "Complete guide to filing your taxes in South Africa",
      local: "/guides/getting-started",
      wordpress: "https://hub.taxfy.co.za/guides/getting-started",
      related: ["sars-efiling", "freelancer-tax", "tax-deductions"],
    },
    "freelancer-tax": {
      title: "Freelancer Tax Guide",
      description:
        "Tax obligations and deductions for freelancers and contractors",
      local: "/guides/freelancer-tax",
      wordpress: "https://hub.taxfy.co.za/guides/freelancer-tax",
      related: ["business-tax", "tax-deductions", "provisional-tax"],
    },
    "business-tax": {
      title: "Business Tax Guide",
      description: "Business tax requirements and compliance in South Africa",
      local: "/guides/business-tax",
      wordpress: "https://hub.taxfy.co.za/guides/business-tax",
      related: ["vat-paye", "freelancer-tax", "company-tax"],
    },
    "sars-efiling": {
      title: "SARS eFiling Guide",
      description: "Complete guide to using the SARS eFiling system",
      local: "/guides/sars-efiling",
      wordpress: "https://hub.taxfy.co.za/guides/sars-efiling",
      related: ["getting-started", "tax-returns", "document-upload"],
    },
    "vat-paye": {
      title: "VAT & PAYE Guide",
      description: "Understanding VAT and PAYE requirements for businesses",
      local: "/guides/vat-paye",
      wordpress: "https://hub.taxfy.co.za/guides/vat-paye",
      related: ["business-tax", "payroll", "compliance"],
    },
  };

  const hubSections = [
    {
      title: "Comprehensive Guides",
      description: "In-depth guides covering all aspects of South African tax",
      url: "https://hub.taxfy.co.za/guides",
      icon: BookOpen,
      topics: ["Tax Filing", "Business Tax", "Deductions", "Compliance"],
    },
    {
      title: "Support Center",
      description: "Get help with technical issues and common questions",
      url: "https://hub.taxfy.co.za/support",
      icon: HelpCircle,
      topics: [
        "Filing Issues",
        "Document Upload",
        "Account Help",
        "Technical Support",
      ],
    },
    {
      title: "Community Forum",
      description: "Connect with other taxpayers and tax professionals",
      url: "https://hub.taxfy.co.za/community",
      icon: Info,
      topics: ["Discussions", "Q&A", "Expert Advice", "Tips & Tricks"],
    },
    {
      title: "Tax Glossary",
      description: "Understand tax terminology and definitions",
      url: "https://hub.taxfy.co.za/glossary",
      icon: Bookmark,
      topics: ["Tax Terms", "Definitions", "Acronyms", "Explanations"],
    },
  ];

  const currentContent = contentMap[currentPage as keyof typeof contentMap];

  return (
    <div className="space-y-8">
      {/* Canonical/SEO Notice */}
      {showCanonicalNote && (
        <Alert>
          <Link2 className="h-4 w-4" />
          <AlertDescription>
            This content is part of our integrated knowledge system. For the
            most comprehensive and up-to-date information, visit our{" "}
            <a
              href="https://hub.taxfy.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              Knowledge Hub
            </a>
            .
          </AlertDescription>
        </Alert>
      )}

      {/* Current Page Cross-Links */}
      {currentContent && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Enhanced Content Available
            </CardTitle>
            <CardDescription>
              This guide is also available with additional features and
              community discussions on our Knowledge Hub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{currentContent.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentContent.description}
                </p>
              </div>
              <Button asChild>
                <a
                  href={currentContent.wordpress}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Hub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Hub Sections */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Explore Our Knowledge Hub</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {hubSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.title}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {section.topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="secondary"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" asChild>
                      <a
                        href={section.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Explore {section.title}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Related Content Links */}
      {relatedTopics.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Related Topics</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTopics.map((topic) => {
              const content = contentMap[topic as keyof typeof contentMap];
              if (!content) return null;

              return (
                <Card key={topic} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{content.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {content.description}
                    </p>
                    <div className="flex gap-2">
                      <Link to={content.local}>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          Guide
                        </Button>
                      </Link>
                      <a
                        href={content.wordpress}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Hub
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Need More Help?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our Knowledge Hub has hundreds of articles, interactive guides,
            community discussions, and expert support to help you with every
            aspect of South African tax.
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
              <Link to="/search">
                <BookOpen className="w-4 h-4 mr-2" />
                Search All Content
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for SEO meta tags and canonical linking
export const CrossPlatformSEO: React.FC<{
  localPath: string;
  hubPath: string;
  title: string;
  description: string;
}> = ({ localPath, hubPath, title, description }) => {
  React.useEffect(() => {
    // Add canonical link to WordPress hub version if it's more comprehensive
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (!existingCanonical) {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = `https://taxfy.co.za${localPath}`;
      document.head.appendChild(canonical);
    }

    // Add alternate link to WordPress hub
    const alternateLink = document.createElement("link");
    alternateLink.rel = "alternate";
    alternateLink.href = hubPath;
    alternateLink.title = `${title} - Enhanced Version`;
    document.head.appendChild(alternateLink);

    // Add structured data for cross-platform content
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: description,
      url: `https://taxfy.co.za${localPath}`,
      sameAs: hubPath,
      publisher: {
        "@type": "Organization",
        name: "Taxfy",
        url: "https://taxfy.co.za",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://taxfy.co.za${localPath}`,
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const canonical = document.querySelector('link[rel="canonical"]');
      const alternate = document.querySelector(`link[href="${hubPath}"]`);
      const structuredScript = document.querySelector(
        'script[type="application/ld+json"]',
      );

      if (canonical) canonical.remove();
      if (alternate) alternate.remove();
      if (structuredScript) structuredScript.remove();
    };
  }, [localPath, hubPath, title, description]);

  return null;
};

export default ContentBridge;
