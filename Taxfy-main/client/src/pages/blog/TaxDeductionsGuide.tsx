import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FeatureImage } from '@/components/FeatureImage';
import { ShareButtons } from '@/components/ShareButtons';
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
  PiggyBank,
  Receipt,
  Heart,
  Home,
  GraduationCap,
  Car,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const TaxDeductionsGuide: React.FC = () => {
  const publishDate = '2025-05-28';
  const readTime = '12 min read';
  const category = 'Tax Deductions';
  const tags = ['Tax Deductions', 'SARS', 'Medical Aid', 'Retirement Annuity', 'Tax Savings'];

  return (
    <>
      <Helmet>
        <title>Complete Guide to Tax Deductions in South Africa 2025 | Maximize Your SARS Refund | Taxfy</title>
        <meta name="description" content="Discover all tax deductions available to South African taxpayers in 2025. Learn about medical aid, retirement annuity, travel allowances, and more to maximize your SARS refund." />
        <meta name="keywords" content="South Africa tax deductions 2025, medical aid tax deduction, retirement annuity deduction, travel allowance deduction, SARS tax deductions, tax savings South Africa" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Complete Guide to Tax Deductions in South Africa 2025 | Maximize Your SARS Refund" />
        <meta property="og:description" content="Discover all tax deductions available to South African taxpayers in 2025. Learn about medical aid, retirement annuity, travel allowances, and more to maximize your SARS refund." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://taxfy.co.za/blog/tax-deductions-guide" />
        <meta property="og:image" content="https://taxfy.co.za/blog/tax-deductions.jpg" />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="Taxfy" />
        <meta property="article:section" content="Tax Deductions" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Complete Guide to Tax Deductions in South Africa 2025 | Maximize Your SARS Refund" />
        <meta name="twitter:description" content="Discover all tax deductions available to South African taxpayers in 2025. Learn about medical aid, retirement annuity, travel allowances, and more." />
        <meta name="twitter:image" content="https://taxfy.co.za/blog/tax-deductions.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "Complete Guide to Tax Deductions in South Africa 2025 | Maximize Your SARS Refund",
            "description": "Discover all tax deductions available to South African taxpayers in 2025. Learn about medical aid, retirement annuity, travel allowances, and more to maximize your SARS refund.",
            "image": "https://taxfy.co.za/blog/tax-deductions.jpg",
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
              "@id": "https://taxfy.co.za/blog/tax-deductions-guide"
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
              <span className="text-foreground">Tax Deductions Guide</span>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <article className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
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
                Complete Guide to Tax Deductions in South Africa 2025 | Maximize Your SARS Refund
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Discover all tax deductions available to South African taxpayers in 2025. Learn about medical aid, retirement annuity, travel allowances, and more to maximize your SARS refund and reduce your tax liability.
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
            <FeatureImage type="deductions" title="Tax Deductions Guide 2025" />

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                  <p className="mb-4">
                    Tax deductions are one of the most effective ways to reduce your taxable income and increase your potential SARS refund. Many South African taxpayers miss out on thousands of rands in legitimate deductions simply because they don't know what's available or how to claim them properly. In this comprehensive guide, we'll cover all the major tax deductions available in 2025, how to claim them, and how <strong>Taxfy</strong> can help you identify and maximize these savings.
                  </p>

                  <p className="mb-6">
                    With <Link to="/blog/sars-tax-season-2025" className="text-primary hover:underline">tax season 2025 approaching on July 1st</Link>, now is the perfect time to understand your deduction options. Whether you're wondering <Link to="/blog/sars-refund-check" className="text-primary hover:underline">if SARS owes you money</Link> or want to ensure you have all the right <Link to="/blog/tax-return-documents" className="text-primary hover:underline">documents for filing</Link>, understanding deductions is crucial for maximizing your refund.
                  </p>
                </div>

                <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Potential Savings</h3>
                        <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                          The average South African taxpayer can save R3,000 - R15,000 annually through proper tax deductions:
                        </p>
                        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                          <li>• Medical aid contributions: Up to R2,500+ per year</li>
                          <li>• Retirement annuity: Up to R5,000+ per year</li>
                          <li>• Travel allowances: Up to R3,000+ per year</li>
                          <li>• Other deductions: Up to R2,000+ per year</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Major Tax Deductions Available in South Africa 2025</h2>
                  <p className="mb-6">
                    Here are the most significant tax deductions available to South African taxpayers, along with how to claim them and maximize your savings:
                  </p>

                  <h3 className="text-xl font-semibold mb-4">1. Medical Aid Contributions & Medical Expenses</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Heart className="w-6 h-6 text-blue-600" />
                          <h4 className="font-semibold">Medical Aid Contributions</h4>
                        </div>
                        <ul className="text-sm space-y-2">
                          <li>• <strong>Tax credit:</strong> R347 per month for main member</li>
                          <li>• <strong>First dependant:</strong> R347 per month</li>
                          <li>• <strong>Additional dependants:</strong> R234 per month each</li>
                          <li>• <strong>65+ years:</strong> R231 additional per month</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Receipt className="w-6 h-6 text-blue-600" />
                          <h4 className="font-semibold">Medical Expenses</h4>
                        </div>
                        <ul className="text-sm space-y-2">
                          <li>• Out-of-pocket medical expenses</li>
                          <li>• Qualifying medical expenses above 7.5% of taxable income</li>
                          <li>• Chronic medication and treatments</li>
                          <li>• Disability-related expenses</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">2. Retirement Annuity Fund Contributions</h3>
                  <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50 mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <PiggyBank className="w-6 h-6 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">Retirement Annuity Deduction</h4>
                          <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                            You can deduct up to <strong>27.5% of your taxable income</strong> or <strong>R350,000 per year</strong> (whichever is lower) for retirement annuity contributions.
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">Example Savings:</p>
                              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                                <li>• R500,000 income: Save up to R37,125</li>
                                <li>• R300,000 income: Save up to R22,275</li>
                                <li>• R200,000 income: Save up to R14,850</li>
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">Requirements:</p>
                              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                                <li>• Must be a registered RA fund</li>
                                <li>• Contributions must be verified</li>
                                <li>• Cannot exceed annual limits</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <h3 className="text-xl font-semibold mb-4">3. Travel Allowance Deductions</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Car className="w-6 h-6 text-purple-600" />
                          <h4 className="font-semibold">Business Travel</h4>
                        </div>
                        <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
                          <li>• Actual business kilometers</li>
                          <li>• R3.98 per km (2025 rate)</li>
                          <li>• Must keep logbook</li>
                          <li>• Client visits, meetings</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Home className="w-6 h-6 text-purple-600" />
                          <h4 className="font-semibold">Home Office</h4>
                        </div>
                        <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
                          <li>• Portion of home expenses</li>
                          <li>• Electricity, rates, insurance</li>
                          <li>• Must be used exclusively</li>
                          <li>• Calculate by floor area</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Briefcase className="w-6 h-6 text-purple-600" />
                          <h4 className="font-semibold">Work Equipment</h4>
                        </div>
                        <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
                          <li>• Tools and equipment</li>
                          <li>• Protective clothing</li>
                          <li>• Computer equipment</li>
                          <li>• Professional subscriptions</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">4. Education and Training Deductions</h3>
                  <Card className="border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/50 mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-6 h-6 text-indigo-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3">Study and Training Expenses</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">Deductible Expenses:</p>
                              <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
                                <li>• Course fees and tuition</li>
                                <li>• Textbooks and materials</li>
                                <li>• Professional development</li>
                                <li>• Skills training programs</li>
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">Requirements:</p>
                              <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
                                <li>• Must be work-related</li>
                                <li>• Improve job performance</li>
                                <li>• Not reimbursed by employer</li>
                                <li>• Keep all receipts</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <h3 className="text-xl font-semibold mb-4">5. Additional Deductions and Credits</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/50">
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-3">Donation Deductions</h4>
                        <ul className="text-sm space-y-2">
                          <li>• Up to 10% of taxable income</li>
                          <li>• Registered PBO organizations</li>
                          <li>• Section 18A certificates required</li>
                          <li>• Religious, educational, charitable</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/50">
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-3">Other Deductions</h4>
                        <ul className="text-sm space-y-2">
                          <li>• Legal expenses (income-related)</li>
                          <li>• Union and professional fees</li>
                          <li>• Investment management fees</li>
                          <li>• Wear and tear allowances</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">How to Claim Your Tax Deductions</h2>
                  <p className="mb-6">
                    Claiming tax deductions correctly is crucial for maximizing your refund. Here's how to ensure you get all the deductions you're entitled to:
                  </p>

                  <div className="space-y-6">
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <FileText className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h4 className="font-semibold mb-3">Step 1: Gather Documentation</h4>
                            <ul className="text-sm space-y-1">
                              <li>• Medical aid certificates</li>
                              <li>• Retirement annuity certificates</li>
                              <li>• Travel logbooks and receipts</li>
                              <li>• Education and training receipts</li>
                              <li>• Donation certificates (Section 18A)</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <Calculator className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h4 className="font-semibold mb-3">Step 2: Calculate Your Deductions</h4>
                            <p className="text-sm mb-3">
                              Use <Link to="/upload" className="text-primary hover:underline">Taxfy's free tax calculator</Link> to:
                            </p>
                            <ul className="text-sm space-y-1">
                              <li>• Automatically identify potential deductions</li>
                              <li>• Calculate maximum allowable amounts</li>
                              <li>• Estimate your potential refund</li>
                              <li>• Ensure accuracy before filing</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <Upload className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h4 className="font-semibold mb-3">Step 3: File Your Return</h4>
                            <p className="text-sm mb-3">
                              When <Link to="/blog/sars-tax-season-2025" className="text-primary hover:underline">tax season opens on July 1st</Link>:
                            </p>
                            <ul className="text-sm space-y-1">
                              <li>• Log into SARS eFiling</li>
                              <li>• Complete all relevant sections</li>
                              <li>• Enter deduction amounts accurately</li>
                              <li>• Submit supporting documents if requested</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Important Reminders</h3>
                        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                          <li>• Keep all receipts and certificates for 5 years</li>
                          <li>• Only claim legitimate, work-related expenses</li>
                          <li>• Don't double-claim expenses already reimbursed</li>
                          <li>• SARS may request supporting documentation</li>
                          <li>• Incorrect claims can result in penalties</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-4">How Taxfy Helps Maximize Your Deductions</h2>
                  <p className="mb-6">
                    <strong>Taxfy</strong> is designed to help South African taxpayers identify and maximize their tax deductions automatically. Our free platform analyzes your tax information and ensures you don't miss any potential savings.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="w-6 h-6 text-primary" />
                          <h4 className="font-semibold">Automatic Detection</h4>
                        </div>
                        <ul className="text-sm space-y-2">
                          <li>• Scans your IRP5 for deduction opportunities</li>
                          <li>• Identifies medical aid and RA contributions</li>
                          <li>• Calculates optimal deduction amounts</li>
                          <li>• Flags potential missed deductions</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Shield className="w-6 h-6 text-primary" />
                          <h4 className="font-semibold">Privacy & Security</h4>
                        </div>
                        <ul className="text-sm space-y-2">
                          <li>• All processing happens in your browser</li>
                          <li>• No data stored on external servers</li>
                          <li>• Complete privacy and security</li>
                          <li>• Free to use, no hidden costs</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Link to="/upload">
                      <Button size="lg" className="px-8">
                        <Calculator className="w-4 h-4 mr-2" />
                        Try Taxfy's Free Tax Calculator
                      </Button>
                    </Link>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
                  <p className="mb-4">
                    Tax deductions are a powerful tool for reducing your tax liability and maximizing your SARS refund. By understanding what deductions are available and how to claim them properly, you can potentially save thousands of rands each year. The key is to keep good records, understand the requirements, and ensure you're claiming all legitimate deductions.
                  </p>

                  <p className="mb-6">
                    With <Link to="/blog/sars-tax-season-2025" className="text-primary hover:underline">tax season 2025 approaching</Link>, now is the perfect time to review your deduction opportunities and gather the necessary documentation. Use <Link to="/upload" className="text-primary hover:underline">Taxfy's free platform</Link> to analyze your tax position and ensure you're maximizing your potential refund.
                  </p>

                  <p className="mb-6">
                    Remember to also check if <Link to="/blog/sars-refund-check" className="text-primary hover:underline">SARS owes you money from previous years</Link> and ensure you have all the right <Link to="/blog/tax-return-documents" className="text-primary hover:underline">documents ready for filing</Link>. Proper preparation and understanding of deductions can make a significant difference to your financial position.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <Separator className="my-12" />
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">
                      <Link to="/blog/sars-tax-season-2025" className="text-primary hover:underline">
                        SARS Tax Season 2025 Guide
                      </Link>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Complete guide to tax season 2025 dates, deadlines, and requirements.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">
                      <Link to="/blog/sars-refund-check" className="text-primary hover:underline">
                        Check if SARS Owes You Money
                      </Link>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Learn how to check your refund status and calculate potential refunds.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">
                      <Link to="/blog/tax-return-documents" className="text-primary hover:underline">
                        Tax Return Documents Checklist
                      </Link>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Essential documents you need to submit your SARS tax return.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Maximize Your Tax Deductions?</h3>
              <p className="text-muted-foreground mb-6">
                Use Taxfy's free tax calculator to identify all your potential deductions and estimate your refund.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload">
                  <Button size="lg" className="px-8">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate My Deductions
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="px-8">
                    <FileText className="w-4 h-4 mr-2" />
                    Read More Tax Guides
                  </Button>
                </Link>
              </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons 
              url="https://taxfy.co.za/blog/tax-deductions-guide"
              title="Complete Guide to Tax Deductions in South Africa 2025 | Maximize Your SARS Refund"
              description="Discover all tax deductions available to South African taxpayers in 2025. Learn about medical aid, retirement annuity, travel allowances, and more to maximize your SARS refund."
              hashtags={['TaxDeductions', 'SARS', 'SouthAfricaTax', 'TaxSavings', 'Taxfy']}
            />
          </div>
        </article>
      </div>
    </>
  );
};

export default TaxDeductionsGuide; 