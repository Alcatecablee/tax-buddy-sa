import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  AlertTriangle,
  Info,
  FileText,
  Calculator,
  Upload,
  Download,
  Shield,
  Zap,
  Building,
  Heart,
  GraduationCap,
  Car,
  Home,
  Briefcase,
  CreditCard,
  Receipt,
  Banknote,
  PiggyBank
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import FeatureImage from '@/components/FeatureImage';
import ShareButtons from '@/components/ShareButtons';

const TaxReturnDocuments: React.FC = () => {
  const publishDate = '2025-05-10';
  const readTime = '12 min read';
  const category = 'Tax Documents';
  const tags = ['Tax Documents', 'IRP5', 'SARS Filing', 'Tax Return'];
  const articleUrl = 'https://taxfy.co.za/blog/tax-return-documents';
  const articleTitle = 'Complete Tax Return Documents Checklist 2025: What You Need to Submit to SARS';
  const articleDescription = 'Essential guide to all documents needed for your South African tax return. Complete checklist of IRP5, medical certificates, retirement annuity documents, and more for SARS filing.';

  return (
    <>
      <Helmet>
        <title>Complete Tax Return Documents Checklist 2025: What You Need to Submit to SARS | Taxfy</title>
        <meta name="description" content="Essential guide to all documents needed for your South African tax return. Complete checklist of IRP5, medical certificates, retirement annuity documents, and more for SARS filing." />
        <meta name="keywords" content="tax return documents South Africa, IRP5 certificate, medical aid certificate, retirement annuity certificate, SARS filing documents, tax return checklist" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Complete Tax Return Documents Checklist 2025: What You Need to Submit to SARS" />
        <meta property="og:description" content="Essential guide to all documents needed for your South African tax return. Complete checklist of IRP5, medical certificates, retirement annuity documents, and more for SARS filing." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:image" content="https://taxfy.co.za/blog/tax-documents.jpg" />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="Taxfy" />
        <meta property="article:section" content="Tax Documents" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Complete Tax Return Documents Checklist 2025: What You Need to Submit to SARS" />
        <meta name="twitter:description" content="Essential guide to all documents needed for your South African tax return. Complete checklist of IRP5, medical certificates, retirement annuity documents, and more for SARS filing." />
        <meta name="twitter:image" content="https://taxfy.co.za/blog/tax-documents.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": articleTitle,
            "description": articleDescription,
            "image": "https://taxfy.co.za/blog/tax-documents.jpg",
            "author": {
              "@type": "Organization",
              "name": "Taxfy",
              "url": "https://taxfy.co.za"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Taxfy",
              "logo": "https://taxfy.co.za/logo.png"
            },
            "datePublished": publishDate,
            "dateModified": publishDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": articleUrl
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <article className="container mx-auto max-w-4xl px-6 py-12">
          <div className="space-y-8">
            <div className="mb-8">
              <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary">{category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(publishDate).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {readTime}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Complete Tax Return Documents Checklist 2025: What You Need to Submit to SARS
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Essential guide to all documents needed for your South African tax return. Complete checklist of IRP5, medical certificates, retirement annuity documents, and more for SARS filing.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <FeatureImage 
              type="documents" 
              title="Essential Tax Documents Checklist 2025"
            />

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                  <p className="mb-4">
                    Tax season in South Africa can feel overwhelming, especially if you're not sure what documents and information you need to submit your tax return to SARS. Missing paperwork or entering the wrong numbers can delay your refund or even trigger an audit. In this guide, we'll break down everything you need to file your tax return—and show you how <strong>Taxfy</strong> can make the process faster, easier, and more accurate than ever.
                  </p>

                  <p className="mb-6">
                    Before <Link to="/blog/sars-tax-season-2025" className="text-primary hover:underline">tax season 2025 opens on July 1st</Link>, it's crucial to gather all your documents. Whether you're wondering <Link to="/blog/sars-refund-check" className="text-primary hover:underline">if SARS owes you money</Link> or just want to be prepared, having the right paperwork ready will make your filing experience smooth and stress-free.
                  </p>
                </div>

                <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick Checklist</h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                          Essential documents you'll need:
                        </p>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• IRP5/IT3(a) Certificate(s)</li>
                          <li>• Medical Aid Certificates</li>
                          <li>• Retirement Annuity Fund Certificates</li>
                          <li>• Bank Account Details</li>
                          <li>• SARS eFiling Login Details</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">The Essential SARS Tax Return Checklist</h2>
                  <p className="mb-6">
                    Before you start your SARS eFiling return, gather the following documents and information:
                  </p>

                  <h3 className="text-xl font-semibold mb-4">1. Your IRP5/IT3(a) Certificate(s)</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <FileText className="w-6 h-6 text-primary" />
                          <h4 className="font-semibold">What is it?</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          The IRP5 is a summary of your salary, tax paid (PAYE), UIF, and deductions for the year, issued by your employer.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="w-6 h-6 text-yellow-500" />
                          <h4 className="font-semibold">Why it matters</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This document contains all the key figures SARS needs to calculate your tax liability and any refund due.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Calculator className="w-6 h-6 text-green-500" />
                          <h4 className="font-semibold">Taxfy Tip</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Upload your IRP5 to <Link to="/upload" className="text-primary hover:underline">Taxfy's analyzer</Link> to instantly see if you're due a refund before filing.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <p className="mb-6">
                    <strong>Where to get it:</strong> Your employer should provide your IRP5 by the end of March. If you haven't received it, contact your HR department immediately. For detailed guidance on understanding your IRP5, check our guide on <Link to="/blog/sars-refund-check" className="text-primary hover:underline">how to check if SARS owes you money</Link>.
                  </p>

                  <h3 className="text-xl font-semibold mb-4">2. Medical Aid Certificates</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Heart className="w-6 h-6 text-red-500" />
                          <h4 className="font-semibold">What is it?</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          A statement from your medical aid showing your contributions and the number of dependants.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="w-6 h-6 text-yellow-500" />
                          <h4 className="font-semibold">Why it matters</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Medical aid contributions and credits can reduce your tax bill.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="w-6 h-6 text-green-500" />
                          <h4 className="font-semibold">How Taxfy helps</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Taxfy's smart suggestions</strong> will prompt you to claim all eligible medical credits, maximizing your refund.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">3. Retirement Annuity Fund Certificates</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <PiggyBank className="w-6 h-6 text-blue-500" />
                          <h4 className="font-semibold">What is it?</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Proof of contributions to retirement annuities (RAs) or pension funds.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="w-6 h-6 text-yellow-500" />
                          <h4 className="font-semibold">Why it matters</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          These contributions are tax-deductible up to certain limits.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="w-6 h-6 text-green-500" />
                          <h4 className="font-semibold">How Taxfy helps</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Taxfy automatically checks</strong> if you're claiming the maximum allowed and flags any missed opportunities.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">4. Proof of Other Income</h3>
                </div>

                <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-4">Examples of Other Income:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
                          <li className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            <span>Rental income (lease agreements, bank statements)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Calculator className="w-4 h-4" />
                            <span>Freelance or side gig income (invoices, payment records)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
                          <li className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>Investment income (IT3(b), IT3(c) certificates)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Receipt className="w-4 h-4" />
                            <span>Commission or bonus payments</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-orange-100/50 dark:bg-orange-900/50 rounded-lg">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <strong>Why it matters:</strong> SARS requires you to declare all sources of income.<br />
                        <strong>How Taxfy helps:</strong> <strong>Taxfy's guided wizard</strong> makes it easy to add extra income streams and ensures nothing is left out.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-xl font-semibold mb-4">5. Supporting Documents for Deductions</h3>
                  <p className="mb-3"><strong>Examples:</strong></p>
                  <ul className="mb-4 space-y-2">
                    <li>Travel logbooks (if you claim travel expenses)</li>
                    <li>Proof of donations (Section 18A certificates)</li>
                    <li>Home office expenses (utility bills, rental agreements)</li>
                  </ul>
                </div>
                
                <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Maximize Your Deductions</h4>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Why it matters:</strong> Deductions can lower your taxable income and increase your refund.<br />
                          <strong>How Taxfy helps:</strong> <strong>Taxfy's checklist</strong> reminds you of common deductions and helps you organize your paperwork.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-xl font-semibold mb-4">6. Bank Account Details</h3>
                  <p className="mb-6">
                    <strong>Why it matters:</strong> SARS pays refunds directly into your bank account. Make sure your details are up to date.<br />
                    <strong>How Taxfy helps:</strong> <strong>Taxfy's final review</strong> reminds you to double-check your banking info before you file.
                  </p>

                  <h3 className="text-xl font-semibold mb-4">7. Your SARS eFiling Login Details</h3>
                  <p className="mb-6">
                    <strong>Why it matters:</strong> You'll need to log in to <a href="https://www.sarsefiling.co.za/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SARS eFiling</a> to submit your return.<br />
                    <strong>How Taxfy helps:</strong> <strong>Taxfy prepares a summary report</strong> you can use to quickly fill in your eFiling return, saving you time and reducing errors.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">How Taxfy Simplifies Document Management</h2>
                  <p className="mb-6">
                    Instead of manually entering dozens of numbers from multiple certificates, <strong>Taxfy</strong> streamlines the entire process:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Upload className="w-6 h-6 text-primary" />
                          <h3 className="font-semibold">Smart Document Processing</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Simply upload photos or PDFs of your IRP5 and other certificates. Taxfy's AI extracts all relevant information automatically.
                        </p>
                        <Link to="/upload">
                          <Button variant="outline" size="sm">Try Upload Feature</Button>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Calculator className="w-6 h-6 text-green-500" />
                          <h3 className="font-semibold">Instant Calculations</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get immediate results showing your tax position, potential refunds, and optimization suggestions.
                        </p>
                        <Link to="/manual-entry">
                          <Button variant="outline" size="sm">Try Calculator</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-4">Ready to Simplify Your Tax Filing?</h3>
                      <p className="text-muted-foreground mb-6">
                        Upload your IRP5 and let Taxfy guide you through the entire process—fast, accurate, and completely private.
                      </p>
                      <Link to="/upload">
                        <Button size="lg" className="px-8">
                          Start Filing Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">Document Checklist for Different Taxpayer Types</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Employed Individuals (Most Common)</h3>
                  <div className="bg-muted/30 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold mb-3">✅ Essential Documents:</h4>
                    <ul className="space-y-2 mb-4">
                      <li>• IRP5 certificate from employer</li>
                      <li>• Medical aid tax certificate</li>
                      <li>• Retirement annuity certificates</li>
                      <li>• Bank account details for refund</li>
                    </ul>
                    
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> Use <Link to="/upload" className="text-primary hover:underline">Taxfy's upload tool</Link> to process all these documents at once and get instant results.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">Self-Employed/Freelancers</h3>
                  <div className="bg-muted/30 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold mb-3">✅ Additional Requirements:</h4>
                    <ul className="space-y-2">
                      <li>• IT3(a) certificates from clients</li>
                      <li>• Business income and expense records</li>
                      <li>• Provisional tax payment receipts</li>
                      <li>• VAT registration details (if applicable)</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">Multiple Income Sources</h3>
                  <div className="bg-muted/30 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold mb-3">✅ What You'll Need:</h4>
                    <ul className="space-y-2 mb-4">
                      <li>• All IRP5s from different employers</li>
                      <li>• Rental income statements</li>
                      <li>• Investment income certificates</li>
                      <li>• Foreign income documentation</li>
                    </ul>
                    
                    <p className="text-sm text-muted-foreground">
                      <strong>Complex situation?</strong> Our <Link to="/manual-entry" className="text-primary hover:underline">manual entry tool</Link> can handle multiple income sources and complex scenarios.
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">What happens if I forget a document?</h3>
                        <p className="text-muted-foreground">
                          SARS may delay your refund or request additional information. <strong>Taxfy's smart checklist</strong> helps you avoid missing anything important.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">Can I use Taxfy if I have multiple IRP5s or complex tax affairs?</h3>
                        <p className="text-muted-foreground">
                          Absolutely! <strong>Taxfy supports multiple IRP5 uploads</strong> and advanced scenarios, making it perfect for freelancers, contractors, and anyone with more than one job.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">Is my data safe with Taxfy?</h3>
                        <p className="text-muted-foreground">
                          Yes. <strong>All processing happens in your browser</strong>—your data never leaves your device.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
                  <p className="mb-6">
                    Submitting your tax return to SARS doesn't have to be stressful or complicated. With the right documents and the help of <strong>Taxfy</strong>, you can file faster, avoid mistakes, and maximize your refund.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <Card className="my-12 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to make tax season easy?</h2>
                <p className="text-muted-foreground mb-6">
                  Visit Taxfy and see how simple tax can be! Upload your documents and get expert guidance every step of the way.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/upload">
                    <Button size="lg" className="px-8">
                      Try Taxfy Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/how-to">
                    <Button variant="outline" size="lg" className="px-8">
                      Learn How It Works
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Share Section */}
            <Separator className="my-8" />
            <ShareButtons
              url={articleUrl}
              title={articleTitle}
              description={articleDescription}
              hashtags={['TaxDocuments', 'IRP5', 'SARSFiling', 'TaxReturn', 'Taxfy']}
            />

            {/* Back to Blog */}
            <div className="flex justify-center pt-8">
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1 inline" />
                Back to Blog
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default TaxReturnDocuments; 