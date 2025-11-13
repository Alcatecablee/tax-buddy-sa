import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MessageSquare,
  Phone,
  Clock,
  CheckCircle,
  Zap,
  FileText,
  HelpCircle,
  Calculator,
} from "lucide-react";
import { Link } from "react-router-dom";
import SupportTicketSystem from "@/components/SupportTicketSystem";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Support: React.FC = () => {
  const { hasEmailSupport, hasPrioritySupport } = useSubscription();

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: hasEmailSupport()
        ? "Professional email support with guaranteed response times"
        : "Upgrade to get email support access",
      responseTime: hasEmailSupport()
        ? hasPrioritySupport()
          ? "4-24 hours"
          : "48 hours"
        : "Not available",
      available: hasEmailSupport(),
      contact: "support@taxfy.co.za",
    },
    {
      icon: MessageSquare,
      title: "Knowledge Base",
      description: "Self-service articles and guides for common questions",
      responseTime: "Instant",
      available: true,
      contact: "Browse articles below",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Direct phone support for urgent issues",
      responseTime: "Business hours",
      available: hasPrioritySupport(),
      contact: "+27 67 049 4876",
    },
  ];

  const commonTopics = [
    {
      icon: FileText,
      title: "IRP5 Upload Issues",
      description: "Problems uploading or processing your IRP5 document",
      articles: 12,
    },
    {
      icon: Calculator,
      title: "Tax Calculations",
      description: "Questions about tax calculations and refund estimates",
      articles: 8,
    },
    {
      icon: Zap,
      title: "Account & Billing",
      description: "Subscription management and billing questions",
      articles: 6,
    },
    {
      icon: HelpCircle,
      title: "General Questions",
      description: "Getting started and general usage questions",
      articles: 15,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Support & Help Center | Taxfy</title>
        <meta
          name="description"
          content="Get help with your South African tax calculations. Email support, knowledge base, and expert assistance for all your tax questions."
        />
        <meta
          name="keywords"
          content="tax support, help center, IRP5 help, South Africa tax assistance, customer support"
        />
      </Helmet>

      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
              Support & Help Center
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              We're Here to Help
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get expert assistance with your South African tax calculations,
              IRP5 processing, and account management. Our support team is ready
              to help you maximize your SARS refund.
            </p>
          </div>

          {/* Support Channels */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <Card
                  key={index}
                  className={`border border-border ${
                    channel.available
                      ? "hover:border-primary/20 transition-colors"
                      : "opacity-60"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">
                          {channel.title}
                        </CardTitle>
                      </div>
                      {channel.available ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Upgrade Required</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {channel.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          Response time:
                        </span>
                        <span className="font-medium">
                          {channel.responseTime}
                        </span>
                      </div>
                      {channel.available && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">
                            Contact:
                          </span>
                          <span className="font-medium">{channel.contact}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Support Ticket System */}
          {hasEmailSupport() ? (
            <div className="mb-12">
              <SupportTicketSystem />
            </div>
          ) : (
            <Card className="mb-12 border-primary/20">
              <CardContent className="text-center py-12">
                <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">
                  Unlock Email Support
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Get professional email support with guaranteed response times.
                  Perfect for getting help with complex tax situations and
                  technical issues.
                </p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>48-hour response guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Expert tax assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Priority ticket handling</span>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button size="lg" className="px-8">
                    <Zap className="w-5 h-5 mr-2" />
                    Upgrade to Starter Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Knowledge Base Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Popular Help Topics
              </CardTitle>
              <p className="text-muted-foreground">
                Browse our knowledge base for instant answers to common
                questions
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {commonTopics.map((topic, index) => {
                  const Icon = topic.icon;
                  return (
                    <Card
                      key={index}
                      className="border border-border hover:border-primary/20 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">
                              {topic.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {topic.description}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {topic.articles} articles
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8 bg-muted/30 border-primary/20">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monday - Friday:
                      </span>
                      <span>8:00 AM - 6:00 PM SAST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday:</span>
                      <span>9:00 AM - 2:00 PM SAST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Contact Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>support@taxfy.co.za</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+27 67 049 4876</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>
                        Average response:{" "}
                        {hasPrioritySupport() ? "4-8 hours" : "24-48 hours"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Support;
