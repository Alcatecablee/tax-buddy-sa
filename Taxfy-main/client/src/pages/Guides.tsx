import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import {
  ContentBridge,
  CrossPlatformSEO,
} from "@/components/wordpress/ContentBridge";
import { WordPressGuides } from "@/components/wordpress/WordPressContent";
import {
  BookOpen,
  Clock,
  ExternalLink,
  ArrowRight,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  Calculator,
  DollarSign,
} from "lucide-react";

// Local guide data that mirrors WordPress content
const localGuides = {
  "getting-started": {
    title: "Getting Started with Tax Filing in South Africa",
    description:
      "Complete beginner's guide to filing your taxes with SARS, understanding requirements, and maximizing your refund.",
    content: `
# Getting Started with Tax Filing in South Africa

## Who Needs to File a Tax Return?

In South Africa, you need to file a tax return if you:
- Earn more than R500,000 per year
- Have income from multiple sources
- Are self-employed or a freelancer
- Want to claim deductions or rebates
- Received a directive from SARS

## Key Tax Dates for 2024/2025

- **Tax Year**: 1 March 2024 to 28 February 2025
- **Filing Season**: 1 July 2025 to 31 October 2025 (individuals)
- **Provisional Tax**: 31 August 2024 and 28 February 2025

## Essential Documents You'll Need

### Employment Income (IRP5)
- IRP5 certificate from your employer
- Medical aid certificates
- Retirement annuity certificates

### Other Income
- Bank statements showing interest earned
- Dividend certificates
- Rental income statements
- Freelance/business income records

## Step-by-Step Filing Process

### 1. Register for SARS eFiling
Visit [www.sarsefiling.co.za](https://www.sarsefiling.co.za) and create your profile.

### 2. Gather Your Documents
Collect all necessary tax documents and certificates.

### 3. Complete Your Return
Use our [free tax calculator](/upload) to analyze your IRP5 and identify deductions.

### 4. Submit and Track
Submit your return online and track the status of your refund.

## Common Deductions for Beginners

- **Medical expenses** above medical aid contributions
- **Retirement annuity** contributions (up to 27.5% of income)
- **Travel allowance** if you use your own car for work
- **Home office expenses** if you work from home

## Next Steps

Ready to start? Use our free tools:
- [Upload your IRP5](/upload) for instant analysis
- [Manual entry tool](/manual-entry) for self-employed individuals
- [Browse our blog](/blog) for more tax tips

Need more detailed guidance? Visit our [Knowledge Hub](https://hub.taxfy.co.za/guides/getting-started) for comprehensive tutorials and community support.
    `,
    readTime: "8 min read",
    difficulty: "Beginner",
    hubUrl: "https://hub.taxfy.co.za/guides/getting-started",
    related: ["sars-efiling", "freelancer-tax", "tax-deductions"],
    keywords: ["tax filing", "SARS", "beginner", "IRP5", "tax return"],
  },
  "freelancer-tax": {
    title: "Complete Freelancer Tax Guide for South Africa",
    description:
      "Everything freelancers and contractors need to know about tax obligations, deductions, and provisional tax in South Africa.",
    content: `
# Complete Freelancer Tax Guide for South Africa

## Are You a Freelancer for Tax Purposes?

You're considered a freelancer if you:
- Work independently for multiple clients
- Don't have a permanent employment contract
- Issue invoices for your services
- Control how, when, and where you work

## Key Tax Obligations

### Income Tax
- All freelance income must be declared
- No PAYE deducted automatically
- You're responsible for calculating and paying tax

### Provisional Tax
If you expect to owe more than R1,000 in tax, you must register for provisional tax and make payments:
- **First payment**: 31 August (half-year estimate)
- **Second payment**: Last day of February (full-year estimate)

### VAT Registration
Register for VAT if your annual turnover exceeds R1 million.

## Essential Deductions for Freelancers

### Home Office Expenses
Calculate the percentage of your home used exclusively for work:
- Rent/bond payments (proportional)
- Electricity and water
- Internet and phone
- Office supplies and equipment

### Business Equipment
- Computers and software
- Camera equipment
- Professional tools
- Office furniture

### Professional Development
- Course fees and training
- Professional memberships
- Industry conferences
- Business books and subscriptions

### Travel and Transport
- Client visits
- Business-related travel
- Vehicle expenses (actual costs or prescribed rates)

## Record Keeping Requirements

Keep detailed records for 5 years:
- All invoices issued
- Business expense receipts
- Bank statements
- Contracts and agreements
- Mileage logs

## Tax Planning Tips

### Quarterly Reviews
Review your income and expenses quarterly to:
- Estimate provisional tax payments
- Identify additional deductible expenses
- Plan major purchases for tax efficiency

### Retirement Planning
Consider contributing to a retirement annuity:
- Deduct up to 27.5% of income
- Maximum R350,000 per year
- Reduces current tax liability

## Common Mistakes to Avoid

1. **Not keeping receipts** for business expenses
2. **Missing provisional tax deadlines** (penalties apply)
3. **Mixing personal and business expenses**
4. **Not claiming legitimate deductions**
5. **Inadequate record keeping**

## Tools for Freelancers

- [Manual entry calculator](/manual-entry) for income estimation
- [Blog articles](/blog) on freelancer tax strategies
- [Knowledge Hub](https://hub.taxfy.co.za/guides/freelancer-tax) for detailed tutorials

Need personalized advice? Visit our [Knowledge Hub](https://hub.taxfy.co.za/support) for expert guidance and community discussions.
    `,
    readTime: "12 min read",
    difficulty: "Intermediate",
    hubUrl: "https://hub.taxfy.co.za/guides/freelancer-tax",
    related: ["business-tax", "provisional-tax", "home-office-deduction"],
    keywords: [
      "freelancer tax",
      "self-employed",
      "provisional tax",
      "deductions",
      "home office",
    ],
  },
  "sars-efiling": {
    title: "SARS eFiling Complete Guide",
    description:
      "Master the SARS eFiling system with our comprehensive guide covering registration, navigation, and troubleshooting.",
    content: `
# SARS eFiling Complete Guide

## What is SARS eFiling?

SARS eFiling is the online platform for submitting tax returns, managing your tax affairs, and communicating with SARS electronically.

## Getting Started

### Registration Requirements
- Valid South African ID number or passport
- Contact details (email and phone)
- Banking details for refunds

### Registration Process
1. Visit [www.sarsefiling.co.za](https://www.sarsefiling.co.za)
2. Click "Register" and complete the form
3. Verify your email address
4. Answer security questions
5. Create your profile

## Navigating the eFiling Platform

### Dashboard Overview
- **Work List**: Outstanding items requiring attention
- **Returns**: View and manage your tax returns
- **Correspondence**: Messages from SARS
- **Payment History**: Track payments and refunds

### Key Sections

#### Returns
- Submit annual tax returns
- View previous returns
- Track return status

#### Statements of Account
- View your tax account balance
- Download statements
- Check payment history

#### PAYE Employer Reconciliation
For employers:
- Submit monthly EMP201 returns
- Annual reconciliation (EMP501)
- Certificate requests

## Filing Your Tax Return

### Before You Start
- Gather all tax documents
- Have your IRP5 certificates ready
- Collect medical aid certificates
- Prepare supporting documents

### Step-by-Step Process

#### 1. Access Your Return
- Log into eFiling
- Click on "Returns"
- Select "Submit Return"

#### 2. Complete Personal Details
- Verify contact information
- Update banking details
- Confirm personal circumstances

#### 3. Enter Income Information
- Employment income (from IRP5)
- Interest and dividends
- Business/professional income
- Rental income

#### 4. Claim Deductions
- Medical expenses
- Retirement contributions
- Travel allowances
- Home office expenses

#### 5. Review and Submit
- Check all information
- Submit electronically
- Print or save assessment

## Common eFiling Issues and Solutions

### Login Problems
- **Forgotten password**: Use password reset
- **Account locked**: Wait 24 hours or contact SARS
- **Security questions**: Answer exactly as registered

### Technical Issues
- **Page not loading**: Clear browser cache
- **Session timeout**: Save work regularly
- **Browser compatibility**: Use latest Chrome or Firefox

### Data Capture Errors
- **Invalid ID numbers**: Check format carefully
- **Calculation errors**: SARS auto-calculates most fields
- **Missing certificates**: Upload supporting documents

## Mobile eFiling App

Download the SARS MobiApp for:
- Quick balance checks
- Payment status
- Basic return submission
- Document uploads

## Tips for Successful eFiling

### Security Best Practices
- Never share login credentials
- Log out completely when finished
- Use secure internet connections
- Keep security questions confidential

### Efficient Filing
- File early in the season
- Keep documents organized
- Double-check all entries
- Save copies of everything

## Getting Help

### SARS Support Channels
- **eFiling helpdesk**: 0800 00 7277
- **Email support**: Available through eFiling
- **Branch visits**: Make appointments online

### Additional Resources
- [Knowledge Hub eFiling Guide](https://hub.taxfy.co.za/guides/sars-efiling)
- [eFiling video tutorials](https://hub.taxfy.co.za/tutorials)
- [Community support forum](https://hub.taxfy.co.za/community)

Ready to start? Use our [tax calculator](/upload) to prepare your information before filing!
    `,
    readTime: "15 min read",
    difficulty: "Beginner",
    hubUrl: "https://hub.taxfy.co.za/guides/sars-efiling",
    related: ["getting-started", "document-upload", "technical-support"],
    keywords: [
      "SARS eFiling",
      "online filing",
      "tax return",
      "registration",
      "troubleshooting",
    ],
  },
};

// Guide listing component
export const GuidesList: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="South African Tax Guides | Complete SARS Filing & Tax Help | Taxfy"
        description="Comprehensive tax guides for South African taxpayers. Learn about SARS filing, deductions, freelancer tax, and maximize your tax refund with expert guidance."
        keywords="South African tax guides, SARS filing guide, freelancer tax, tax deductions, IRP5 help, tax return guide"
        canonical="https://taxfy.co.za/guides"
      />

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-blue-500/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Tax Guides
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Master South African Tax
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Comprehensive guides to help you navigate SARS filing, understand
              deductions, and maximize your tax refund. From beginners to
              advanced users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/upload">
                  <Calculator className="w-4 h-4 mr-2" />
                  Try Free Tax Calculator
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://hub.taxfy.co.za/guides"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Knowledge Hub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Local Guides */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Essential Tax Guides</h2>
            <p className="text-muted-foreground">
              Start with these fundamental guides to understand South African
              tax requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.entries(localGuides).map(([slug, guide]) => (
              <Card
                key={slug}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        guide.difficulty === "Beginner"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {guide.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {guide.readTime}
                    </div>
                  </div>
                  <CardTitle className="hover:text-primary transition-colors">
                    <Link to={`/guides/${slug}`}>{guide.title}</Link>
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {guide.keywords.slice(0, 2).map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="outline"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/guides/${slug}`}>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          Read
                        </Button>
                      </Link>
                      <a
                        href={guide.hubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Hub
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WordPress Hub Guides */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <WordPressGuides limit={6} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Use Our Guides?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our tax guides are designed by South African tax experts to help
              you navigate the complexities of SARS filing and tax optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Verified</h3>
              <p className="text-muted-foreground">
                All guides reviewed by qualified tax professionals and updated
                for current SARS requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Maximize Refunds</h3>
              <p className="text-muted-foreground">
                Learn strategies to claim all eligible deductions and optimize
                your tax position.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-muted-foreground">
                Join our knowledge hub community for discussions, Q&A, and peer
                support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-blue-500/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your Tax?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start with our free tax calculator or explore our comprehensive
            knowledge hub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/upload">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Your Refund
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://hub.taxfy.co.za"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Explore Knowledge Hub
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Individual guide component
export const GuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? localGuides[slug as keyof typeof localGuides] : null;

  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The guide you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/guides">
              <ArrowRight className="w-4 h-4 mr-2" />
              Browse All Guides
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CrossPlatformSEO
        localPath={`/guides/${slug}`}
        hubPath={guide.hubUrl}
        title={guide.title}
        description={guide.description}
      />

      <SEO
        title={`${guide.title} | Taxfy Tax Guides`}
        description={guide.description}
        keywords={guide.keywords.join(", ")}
        canonical={`https://taxfy.co.za/guides/${slug}`}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-6 py-16">
          {/* Guide Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                to="/guides"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Guides
              </Link>
              <span className="text-muted-foreground">→</span>
              <span className="text-sm">{guide.title}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Badge
                variant={
                  guide.difficulty === "Beginner" ? "default" : "secondary"
                }
              >
                {guide.difficulty}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {guide.readTime}
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
            <p className="text-xl text-muted-foreground">{guide.description}</p>
          </div>

          {/* Guide Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div
              dangerouslySetInnerHTML={{
                __html: guide.content.replace(/\n/g, "<br>"),
              }}
            />
          </div>

          {/* Content Bridge */}
          <ContentBridge
            currentPage={slug}
            relatedTopics={guide.related}
            showCanonicalNote={true}
          />
        </div>
      </div>
    </>
  );
};

export default GuidesList;
