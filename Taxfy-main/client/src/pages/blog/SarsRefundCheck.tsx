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
  Share2, 
  CheckCircle,
  AlertTriangle,
  Info,
  FileText,
  Calculator,
  Upload,
  Download,
  Shield,
  Zap,
  DollarSign
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import FeatureImage from '@/components/FeatureImage';
import ShareButtons from '@/components/ShareButtons';

const SarsRefundCheck: React.FC = () => {
  const publishDate = '2025-05-15';
  const readTime = '6 min read';
  const category = 'Tax Refunds';
  const tags = ['SARS', 'Refunds', 'IRP5', 'Taxfy'];
  const articleUrl = 'https://taxfy.co.za/blog/sars-refund-check';
  const articleTitle = 'How Do I Know if SARS Owes Me Money? Step-by-Step Guide for South Africans';
  const articleDescription = 'Wondering if SARS owes you a tax refund? Learn how to check your refund status and use Taxfy\'s step-by-step platform to find out in minutes. Fast, private, and accurate.';

  return (
    <>
      <Helmet>
        <title>Check if SARS Owes You Money in under 120 seconds | Taxfy</title>
        <meta name="description" content="Wondering if SARS owes you a tax refund? Learn how to check your refund status and use Taxfy's step-by-step platform to find out in minutes. Fast, private, and accurate." />
        <meta name="keywords" content="SARS refund check, tax refund South Africa, IRP5 analysis, SARS owes me money, tax calculator, Taxfy" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Check if SARS Owes You Money in under 120 seconds" />
        <meta property="og:description" content="Wondering if SARS owes you a tax refund? Learn how to check your refund status and use Taxfy's step-by-step platform to find out in minutes." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:image" content="https://taxfy.co.za/blog/sars-refund.jpg" />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="Taxfy" />
        <meta property="article:section" content="Tax Refunds" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Check if SARS Owes You Money in under 120 seconds" />
        <meta name="twitter:description" content="Wondering if SARS owes you a tax refund? Learn how to check your refund status and use Taxfy's step-by-step platform to find out in minutes." />
        <meta name="twitter:image" content="https://taxfy.co.za/blog/sars-refund.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": articleTitle,
            "description": articleDescription,
            "image": "https://taxfy.co.za/blog/sars-refund.jpg",
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
        {/* Breadcrumb */}
        <div className="border-b border-border/40 bg-muted/30">
          <div className="container mx-auto max-w-4xl px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-foreground">SARS Refund Check</span>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <article className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
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
                  How Do I Know if SARS Owes Me Money? Step-by-Step Guide for South Africans
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  Wondering if SARS owes you a tax refund? Learn how to check your refund status and use Taxfy's step-by-step platform to find out in minutes. Fast, private, and accurate.
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
                type="refund-check" 
                title="Discover if SARS Owes You Money"
              />

              {/* Article Content */}
              <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                    <p className="mb-4">
                      Every year, millions of South Africans wonder: <strong>"How do I know if SARS owes me money?"</strong> If you've paid too much tax during the year, you could be due a refund. But how do you check, and how can you be sure? In this guide, we'll explain how tax refunds work, what to look for on your IRP5, and how to use the Taxfy platform to instantly see if you're owed money by SARS.
                    </p>

                    <p className="mb-6">
                      With <Link to="/blog/sars-tax-season-2025" className="text-primary hover:underline">tax season 2025 approaching</Link>, it's the perfect time to check your tax position. Whether you need to understand <Link to="/blog/tax-return-documents" className="text-primary hover:underline">what documents you need for filing</Link> or want to get ahead of the game, this guide will help you determine if you're due a refund.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">What Is a SARS Tax Refund?</h2>
                    <p className="mb-4">
                      A <strong>SARS tax refund</strong> happens when you've paid more tax (PAYE) during the year than you actually owe, based on your total income and allowable deductions. This can happen if:
                    </p>
                    
                    <ul className="mb-4 space-y-2">
                      <li>Your employer deducted too much PAYE</li>
                      <li>You had allowable deductions (medical, retirement, etc.) not factored in</li>
                      <li>You changed jobs or had multiple employers</li>
                      <li>You made provisional tax payments that exceeded your final liability</li>
                    </ul>

                    <p className="mb-6">
                      If SARS owes you money, you'll get a refund paid directly into your bank account after your return is processed.
                    </p>
                  </div>

                  <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Good News!</h3>
                          <p className="text-sm text-green-800 dark:text-green-200">
                            Most South Africans who file tax returns receive refunds. The average refund is between R2,000 - R8,000.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">How to Check if SARS Owes You Money: Step-by-Step with Taxfy</h2>
                    <p className="mb-6">
                      <strong>Taxfy</strong> is a free, privacy-focused web app that helps you analyze your IRP5, calculate your tax position, and see if you're due a refund—in just a few minutes. Unlike other tax services, Taxfy processes everything in your browser, so your sensitive financial information never leaves your device.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">Step 1: Upload Your IRP5 to Taxfy</h3>
                    <p className="mb-3">
                      Start by visiting <Link to="/upload" className="text-primary hover:underline">Taxfy's IRP5 upload page</Link>. You can either:
                    </p>
                    <ul className="mb-4 space-y-2">
                      <li><strong>Upload a photo or scan</strong> of your IRP5 certificate</li>
                      <li><strong>Upload a PDF</strong> of your IRP5 from your employer</li>
                      <li>Or use our <Link to="/manual-entry" className="text-primary hover:underline">manual entry tool</Link> if you prefer to type in the numbers yourself</li>
                    </ul>

                    <p className="mb-6">
                      Taxfy's AI-powered system will automatically extract all the relevant information from your IRP5, including your total earnings, PAYE paid, UIF contributions, and any deductions.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">Step 2: Review Your Tax Calculation</h3>
                    <p className="mb-3">
                      Once your IRP5 is processed, Taxfy will show you:
                    </p>
                    <ul className="mb-6 space-y-2">
                      <li><strong>Your total taxable income</strong> for the year</li>
                      <li><strong>Total PAYE paid</strong> (tax deducted by your employer)</li>
                      <li><strong>Your actual tax liability</strong> based on current SARS tax tables</li>
                      <li><strong>Whether you're due a refund or owe additional tax</strong></li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3">Step 3: Get Your Results Instantly</h3>
                    <p className="mb-6">
                      Taxfy will clearly show you if SARS owes you money and approximately how much. The platform also provides helpful tips on maximizing your refund and preparing for <Link to="/blog/sars-tax-season-2025" className="text-primary hover:underline">the upcoming tax season</Link>.
                    </p>
                  </div>

                  <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Privacy Tip</h3>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            All processing happens in your browser—your data never leaves your device.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">What to Do If SARS Owes You Money</h2>
                    <p className="mb-4">
                      If Taxfy shows that you're due a refund, here's what you need to do:
                    </p>

                    <ol className="mb-6 space-y-2">
                      <li><strong>Gather all required documents</strong> - Check our guide on <Link to="/blog/tax-return-documents" className="text-primary hover:underline">what documents you need for your tax return</Link></li>
                      <li><strong>Wait for tax season to open</strong> - <Link to="/blog/sars-tax-season-2025" className="text-primary hover:underline">Tax season 2025 opens on July 1st</Link></li>
                      <li><strong>File your return via SARS eFiling</strong> - Use our <Link to="/how-to" className="text-primary hover:underline">step-by-step filing guide</Link></li>
                      <li><strong>Wait for your refund</strong> - SARS typically processes refunds within 21 business days</li>
                    </ol>
                  </div>

                  <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Key Insight</h3>
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <strong>If the result is positive, SARS owes you money!</strong><br />
                            If negative, you may owe SARS.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <p className="mb-6">
                      Taxfy also shows your <strong>effective tax rate</strong>, <strong>marginal tax rate</strong>, and any anomalies or suggestions.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">Step 4: Download Your Tax Report (Optional)</h3>
                    <div className="flex items-start gap-4 mb-6 p-6 bg-muted/30 rounded-lg">
                      <Download className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-2">Click <strong>"Download Report"</strong> to get a professional PDF summary.</p>
                        <p className="text-sm text-muted-foreground">Use this report for your records or to help with SARS eFiling.</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3">Step 5: File Your Return with SARS</h3>
                    <ul className="mb-6 space-y-2">
                      <li>Use the figures from Taxfy to complete your SARS eFiling return.</li>
                      <li>If you're due a refund, SARS will pay it into your bank account after processing.</li>
                    </ul>
                  </div>

                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4">Ready to Check if SARS Owes You Money?</h3>
                        <p className="text-muted-foreground mb-6">
                          Upload your IRP5 and get instant answers with Taxfy's free tax calculator.
                        </p>
                        <Link to="/upload">
                          <Button size="lg" className="px-8">
                            Check My Refund Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Separator />

                  <div>
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">How long does it take to get my refund from SARS?</h3>
                          <p className="text-muted-foreground">
                            If you file early and your return is straightforward, refunds are often paid within a few days to a few weeks after assessment.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">What if Taxfy says I owe SARS money?</h3>
                          <p className="text-muted-foreground">
                            Taxfy will show you exactly why, and offer suggestions to reduce your tax bill if possible.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">Can I use Taxfy for multiple IRP5s or complex returns?</h3>
                          <p className="text-muted-foreground">
                            Yes! Taxfy supports multiple IRP5 uploads and advanced scenarios.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
                    <p className="mb-6">
                      If you want to know <strong>"Does SARS owe me money?"</strong>, Taxfy is the fastest, easiest, and most private way to find out. Upload your IRP5, get instant answers, and file with confidence.
                    </p>

                    <h2 className="text-2xl font-bold mb-4">Common Reasons Why SARS Might Owe You Money</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-3">Overpaid PAYE</h3>
                          <p className="text-sm text-muted-foreground">
                            Your employer deducted more tax than you actually owe, especially common if you changed jobs during the year or had varying income.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-3">Medical Aid Contributions</h3>
                          <p className="text-sm text-muted-foreground">
                            You can claim back a portion of your medical aid contributions as tax credits, which often results in refunds.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-3">Retirement Annuity Contributions</h3>
                          <p className="text-sm text-muted-foreground">
                            Contributions to retirement annuities are tax-deductible and can significantly reduce your tax liability.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-3">Multiple Employers</h3>
                          <p className="text-sm text-muted-foreground">
                            If you had multiple employers, you might have been taxed incorrectly, often resulting in overpayment.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Share Section */}
      <ShareButtons
        url="https://taxfy.co.za/blog/sars-refund-check"
        title="How to Check if SARS Owes You Money: Complete 2025 Guide"
        description="Discover if SARS owes you a tax refund with our step-by-step guide. Learn how to check your refund status, calculate potential refunds, and claim what's rightfully yours."
        hashtags={['SARSRefund', 'TaxRefund', 'SouthAfricaTax', 'IRP5', 'Taxfy']}
      />

      <div className="flex justify-center pt-8">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1 inline" />
          Back to Blog
        </Link>
      </div>
    </>
  );
};

export default SarsRefundCheck; 