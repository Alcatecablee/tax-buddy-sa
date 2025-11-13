import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

const faqData: FAQItem[] = [
  {
    id: 'do-i-need-to-file-tax-return-south-africa-2025',
    question: 'Do I need to file a tax return in South Africa 2025?',
    answer: 'You must file a tax return if your income exceeds R95,750 (under 65), R148,217 (65-74), or R165,689 (75+). You also need to file if you have multiple income sources, want to claim deductions, or SARS requests it. Even if not required, filing can help you claim refunds.',
    category: 'Filing Requirements',
    keywords: ['tax return filing', 'SARS requirements', 'tax threshold 2025']
  },
  {
    id: 'how-long-sars-refund-take-2025',
    question: 'How long does a SARS refund take in 2025?',
    answer: 'SARS typically processes tax refunds within 21 business days for complete and accurate returns. However, during peak tax season (July-September), it may take longer. Filing early and ensuring all documents are correct can speed up the process.',
    category: 'Refunds',
    keywords: ['SARS refund time', 'tax refund processing', 'refund timeline']
  },
  {
    id: 'what-documents-needed-tax-return-south-africa',
    question: 'What documents do I need for my tax return in South Africa?',
    answer: 'Essential documents include your IRP5 certificate, medical aid tax certificate, retirement annuity certificates, and bank details. You may also need IT3(a) certificates, rental income statements, and investment certificates depending on your situation.',
    category: 'Documents',
    keywords: ['tax return documents', 'IRP5 certificate', 'tax filing requirements']
  },
  {
    id: 'sars-filing-deadline-2025',
    question: 'What is the SARS filing deadline for 2025?',
    answer: 'Tax season opens on July 1, 2025. Non-provisional taxpayers typically have until October 2025, while provisional taxpayers have until January 2026. Exact dates are announced by SARS closer to the time.',
    category: 'Deadlines',
    keywords: ['SARS deadline 2025', 'tax season dates', 'filing deadline']
  },
  {
    id: 'how-check-if-sars-owes-me-money',
    question: 'How do I check if SARS owes me money?',
    answer: 'The easiest way is to analyze your IRP5 certificate. Compare your total PAYE paid against your actual tax liability. You can use Taxfy\'s free IRP5 analyzer to get instant results, or check your SARS eFiling profile for previous years.',
    category: 'Refunds',
    keywords: ['SARS refund check', 'tax refund calculator', 'IRP5 analysis']
  },
  {
    id: 'tax-optimization-south-africa-deductions',
    question: 'How can I optimize my tax and claim more deductions in South Africa?',
    answer: 'Common deductions include medical aid contributions, retirement annuity contributions (up to 27.5% of income), travel allowances, and home office expenses. Ensure you have proper documentation and consider maximizing retirement contributions for tax benefits.',
    category: 'Optimization',
    keywords: ['tax deductions', 'tax optimization', 'retirement annuity deductions']
  },
  {
    id: 'multiple-employers-tax-implications-south-africa',
    question: 'What are the tax implications of having multiple employers in South Africa?',
    answer: 'With multiple employers, you often overpay tax because each employer applies the full tax threshold. You\'ll likely be due a refund when filing your return. Ensure you get IRP5 certificates from all employers and declare all income.',
    category: 'Multiple Income',
    keywords: ['multiple employers tax', 'multiple income sources', 'tax overpayment']
  },
  {
    id: 'medical-aid-tax-benefits-south-africa',
    question: 'What medical aid tax benefits can I claim in South Africa?',
    answer: 'You can claim medical scheme fees tax credits: R347 per month for the first two beneficiaries, then R234 for additional beneficiaries. You may also claim additional medical expenses above 7.5% of taxable income (or 3 times medical scheme fees).',
    category: 'Medical',
    keywords: ['medical aid tax credit', 'medical expenses deduction', 'medical scheme fees']
  },
  {
    id: 'provisional-tax-vs-paye-south-africa',
    question: 'What\'s the difference between provisional tax and PAYE in South Africa?',
    answer: 'PAYE is tax deducted monthly from your salary by your employer. Provisional tax is paid twice yearly by self-employed individuals or those with additional income. If you earn more than R1 million or have significant non-employment income, you may need to pay provisional tax.',
    category: 'Tax Types',
    keywords: ['provisional tax', 'PAYE tax', 'self-employed tax']
  },
  {
    id: 'retirement-annuity-tax-deduction-limits-2025',
    question: 'What are the retirement annuity tax deduction limits for 2025?',
    answer: 'You can deduct up to 27.5% of your taxable income or R350,000 per year (whichever is lower) for retirement fund contributions. This includes employer pension/provident fund contributions and personal retirement annuity contributions.',
    category: 'Retirement',
    keywords: ['retirement annuity deduction', 'RA tax benefits', 'retirement fund contributions']
  },
  {
    id: 'sars-efiling-registration-process',
    question: 'How do I register for SARS eFiling?',
    answer: 'Visit the SARS eFiling website, click "Register", provide your ID number, contact details, and answer security questions. You\'ll receive a PIN via SMS. For first-time users, you may need to visit a SARS branch for verification.',
    category: 'eFiling',
    keywords: ['SARS eFiling registration', 'eFiling setup', 'SARS online registration']
  },
  {
    id: 'tax-year-dates-south-africa-2025',
    question: 'What are the tax year dates for South Africa 2025?',
    answer: 'The South African tax year for individuals runs from March 1, 2024, to February 28, 2025. When you file in July 2025, you\'re declaring income and expenses for this period. Companies follow a different tax year based on their financial year-end.',
    category: 'Tax Year',
    keywords: ['tax year dates', 'financial year South Africa', 'tax period 2025']
  }
];

const categories = ['All', 'Filing Requirements', 'Refunds', 'Documents', 'Deadlines', 'Optimization', 'Medical', 'eFiling'];

export const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Create structured data for FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>

      <section className="py-16 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need to Know About South African Tax
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get answers to the most common questions about SARS filing, tax refunds, and deductions. 
              Can't find what you're looking for? <Link to="/upload" className="text-primary hover:underline">Try our free tax analyzer</Link>.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isOpen = openItems.includes(faq.id);
              return (
                <Card key={faq.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-6 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-6 border-t border-border/40">
                        <p className="text-muted-foreground leading-relaxed mt-4">
                          {faq.answer}
                        </p>
                        
                        {/* Add relevant internal links based on FAQ content */}
                        {faq.id === 'how-check-if-sars-owes-me-money' && (
                          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                            <p className="text-sm font-medium mb-2">Related Resources:</p>
                            <div className="flex flex-wrap gap-2">
                              <Link to="/upload">
                                <Button variant="outline" size="sm">Try IRP5 Analyzer</Button>
                              </Link>
                              <Link to="/blog/sars-refund-check">
                                <Button variant="outline" size="sm">Read Full Guide</Button>
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {faq.id === 'what-documents-needed-tax-return-south-africa' && (
                          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                            <p className="text-sm font-medium mb-2">Related Resources:</p>
                            <div className="flex flex-wrap gap-2">
                              <Link to="/blog/tax-return-documents">
                                <Button variant="outline" size="sm">Complete Document Guide</Button>
                              </Link>
                              <Link to="/how-to">
                                <Button variant="outline" size="sm">Filing Instructions</Button>
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {faq.category === 'Filing Requirements' && (
                          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                            <p className="text-sm font-medium mb-2">Related Resources:</p>
                            <div className="flex flex-wrap gap-2">
                              <Link to="/blog/sars-tax-season-2025">
                                <Button variant="outline" size="sm">Tax Season 2025 Guide</Button>
                              </Link>
                              <Link to="/manual-entry">
                                <Button variant="outline" size="sm">Check Your Tax Position</Button>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No FAQs found matching your search.</p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <Card className="mt-12 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Get instant answers by analyzing your IRP5 with our free tax calculator.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload">
                  <Button size="lg" className="px-8">
                    Analyze Your IRP5 Free
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="px-8">
                    Read Our Tax Blog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}; 