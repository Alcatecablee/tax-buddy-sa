import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  Calculator, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Play, 
  Pause, 
  RotateCcw,
  Eye,
  Edit3,
  Share2,
  HelpCircle,
  ArrowRight,
  Clock,
  Star,
  Zap,
  Shield,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const HowTo = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      id: 1,
      title: "Upload Your IRP5",
      icon: Upload,
      time: "30 seconds",
      difficulty: "Easy",
      description: "Start by uploading your official SARS IRP5 PDF document",
      details: [
        "Click the 'Upload Your IRP5' button on the homepage",
        "Select your IRP5 PDF file from your device",
        "Wait for the file to upload and process",
        "Our AI will automatically extract key information"
      ],
      tips: [
        "Ensure your PDF is clear and readable",
        "Both digital and scanned PDFs work",
        "File size should be under 10MB",
        "Make sure all pages are included"
      ],
      troubleshooting: [
        "If upload fails, check your internet connection",
        "Try refreshing the page and uploading again",
        "Ensure the file is a valid PDF format",
        "Contact support if issues persist"
      ],
      speedTip: "💡 Speed Tip: Our AI can process your IRP5 in under 30 seconds, saving you hours of manual data entry!"
    },
    {
      id: 2,
      title: "Review Extracted Data",
      icon: Eye,
      time: "2-3 minutes",
      difficulty: "Easy",
      description: "Verify the automatically extracted information from your IRP5",
      details: [
        "Review all extracted fields for accuracy",
        "Check salary, tax withheld, and deductions",
        "Look for any highlighted warnings or errors",
        "Use the IRP5 guide popover for help finding fields"
      ],
      tips: [
        "Compare with your physical IRP5 document",
        "Pay special attention to large amounts",
        "Use the field guides if you're unsure",
        "Don't worry about small discrepancies initially"
      ],
      troubleshooting: [
        "If data looks incorrect, use manual editing",
        "Check if your IRP5 has multiple pages",
        "Some fields may be zero if not applicable",
        "Use 'Edit Data' to make corrections"
      ]
    },
    {
      id: 3,
      title: "Edit Data (Optional)",
      icon: Edit3,
      time: "1-5 minutes",
      difficulty: "Medium",
      description: "Make corrections or add missing information",
      details: [
        "Click 'Edit Values' for quick inline editing",
        "Or click 'Edit Data' for full manual entry",
        "Update any incorrect amounts",
        "Add missing deductions or allowances"
      ],
      tips: [
        "Use the inline editing for small corrections",
        "Switch to manual entry for major changes",
        "Refer to your IRP5 codes for accuracy",
        "Save changes before proceeding"
      ],
      troubleshooting: [
        "If inline editing isn't working, try manual entry",
        "Ensure all amounts are positive numbers",
        "Check that required fields are filled",
        "Use the format R 123,456.00 for currency"
      ]
    },
    {
      id: 4,
      title: "Calculate Tax Position",
      icon: Calculator,
      time: "Instant",
      difficulty: "Easy",
      description: "Get your tax calculation results instantly",
      details: [
        "Click 'Calculate My Refund' button",
        "View your tax liability or refund amount",
        "See detailed breakdown of calculations",
        "Understand your effective tax rate"
      ],
      tips: [
        "Green amounts mean you get a refund",
        "Red amounts mean you owe SARS money",
        "Check the calculation breakdown for details",
        "Compare with previous years if available"
      ],
      troubleshooting: [
        "If you see 'RNaN', check your input data",
        "Ensure all required fields have valid numbers",
        "Try refreshing and recalculating",
        "Contact support for calculation errors"
      ]
    },
    {
      id: 5,
      title: "Download Reports",
      icon: Download,
      time: "30 seconds",
      difficulty: "Easy",
      description: "Export professional reports for your records",
      details: [
        "Choose from PDF, CSV, or Excel formats",
        "Download detailed tax calculation reports",
        "Share results with your accountant",
        "Keep records for future reference"
      ],
      tips: [
        "PDF reports are best for sharing",
        "CSV/Excel for further analysis",
        "Save multiple copies for backup",
        "Include calculation date in filename"
      ],
      troubleshooting: [
        "If download fails, try a different format",
        "Check your browser's download settings",
        "Ensure popup blockers aren't interfering",
        "Try right-click 'Save As' if needed"
      ]
    }
  ];

  const faqs = [
    {
      question: "What file formats are supported?",
      answer: "We support PDF files only. Both digital PDFs and scanned documents work well with our OCR technology."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use bank-level encryption and never store your personal information permanently. All data is processed securely and deleted after your session."
    },
    {
      question: "What if the extracted data is wrong?",
      answer: "You can easily edit any extracted data using our inline editing feature or switch to manual entry mode for complete control."
    },
    {
      question: "Can I use this for multiple tax years?",
      answer: "Yes! You can upload IRP5s from different tax years. Just make sure to specify the correct tax year for each calculation."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account required! You can use Taxfy immediately without any registration. However, creating an account allows you to save your calculations."
    },
    {
      question: "What if I don't have an IRP5?",
      answer: "You can use our manual entry option to input your tax information directly, even without an IRP5 document."
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get results in seconds, not hours"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is encrypted and protected"
    },
    {
      icon: Users,
      title: "Accountant Ready",
      description: "Professional reports your accountant will love"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Complete Guide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How to Get Your SARS Refund
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Master your South African tax calculations with our comprehensive step-by-step guide. 
              Learn how to get your SARS refund from upload to download.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/upload">
                  <Upload className="w-5 h-5 mr-2" />
                  Start Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' })}>
                <Play className="w-5 h-5 mr-2" />
                Watch Guide
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="steps" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="steps" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="steps" className="text-base">
                <FileText className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </TabsTrigger>
              <TabsTrigger value="tips" className="text-base">
                <Star className="w-4 h-4 mr-2" />
                Pro Tips
              </TabsTrigger>
              <TabsTrigger value="faq" className="text-base">
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="steps" className="space-y-12">
              {/* Progress Indicator */}
              <div className="flex justify-center mb-12">
                <div className="flex items-center space-x-4 bg-card/50 rounded-full p-2 border border-border/50">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = activeStep === step.id;
                    const isCompleted = activeStep > step.id;
                    
                    return (
                      <div key={step.id} className="flex items-center">
                        <button
                          onClick={() => setActiveStep(step.id)}
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                            ${isActive 
                              ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                              : isCompleted 
                                ? 'bg-green-500 text-white' 
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }
                          `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </button>
                        {index < steps.length - 1 && (
                          <div className={`
                            w-8 h-0.5 mx-2 transition-colors duration-300
                            ${isCompleted ? 'bg-green-500' : 'bg-border'}
                          `} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Content */}
              {steps.map((step) => {
                const Icon = step.icon;
                if (step.id !== activeStep) return null;

                return (
                  <Card key={step.id} className="max-w-4xl mx-auto border-border/50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-green-500/10 border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <Icon className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl mb-2">
                              Step {step.id}: {step.title}
                            </CardTitle>
                            <CardDescription className="text-base">
                              {step.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.time}
                          </Badge>
                          <div>
                            <Badge className={
                              step.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                              step.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }>
                              {step.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-8">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Instructions */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold mb-4 flex items-center">
                              <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                              What to Do
                            </h4>
                            <ul className="space-y-3">
                              {step.details.map((detail, index) => (
                                <li key={index} className="flex items-start">
                                  <ArrowRight className="w-4 h-4 mr-3 mt-0.5 text-primary flex-shrink-0" />
                                  <span className="text-muted-foreground">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-semibold mb-4 flex items-center">
                              <Star className="w-5 h-5 mr-2 text-yellow-500" />
                              Pro Tips
                            </h4>
                            <ul className="space-y-3">
                              {step.tips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                  <Info className="w-4 h-4 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                  <span className="text-muted-foreground">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Speed Tip for Upload Step */}
                          {step.speedTip && (
                            <>
                              <Separator />
                              <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap className="w-5 h-5 text-green-500" />
                                  <span className="font-semibold text-green-600">Speed Advantage</span>
                                </div>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                  {step.speedTip}
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Troubleshooting */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold mb-4 flex items-center">
                              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                              Troubleshooting
                            </h4>
                            <ul className="space-y-3">
                              {step.troubleshooting.map((issue, index) => (
                                <li key={index} className="flex items-start">
                                  <RotateCcw className="w-4 h-4 mr-3 mt-0.5 text-orange-500 flex-shrink-0" />
                                  <span className="text-muted-foreground">{issue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action Buttons */}
                          <Card className="bg-muted/20 border-border/50">
                            <CardContent className="p-6">
                              <h5 className="font-semibold mb-4">Ready to try this step?</h5>
                              <div className="flex flex-col gap-3">
                                <Button asChild className="w-full">
                                  <Link to={step.id === 1 ? "/upload" : step.id === 3 ? "/manual-entry" : "/upload"}>
                                    <Icon className="w-4 h-4 mr-2" />
                                    {step.id === 1 ? "Upload IRP5" : 
                                     step.id === 3 ? "Try Manual Entry" : 
                                     "Start Process"}
                                  </Link>
                                </Button>
                                {step.id < steps.length && (
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setActiveStep(step.id + 1)}
                                    className="w-full"
                                  >
                                    Next Step
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Navigation */}
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                  disabled={activeStep === steps.length}
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Pro Tips & Best Practices</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get the most out of Taxfy with these expert tips and tricks
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="w-5 h-5 mr-2 text-blue-500" />
                      Upload Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Use high-quality scans</p>
                          <p className="text-sm text-muted-foreground">Clear, well-lit scans improve data extraction accuracy</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Include all pages</p>
                          <p className="text-sm text-muted-foreground">Make sure your PDF contains all IRP5 pages</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Check file size</p>
                          <p className="text-sm text-muted-foreground">Keep files under 10MB for faster processing</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-green-500" />
                      Review Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Double-check large amounts</p>
                          <p className="text-sm text-muted-foreground">Verify salary and tax amounts match your IRP5</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Use field guides</p>
                          <p className="text-sm text-muted-foreground">Click the guide icons for help finding IRP5 fields</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Look for warnings</p>
                          <p className="text-sm text-muted-foreground">Pay attention to highlighted fields that need attention</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2 text-purple-500" />
                      Calculation Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Understand the colors</p>
                          <p className="text-sm text-muted-foreground">Green = refund, Red = amount owed to SARS</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Review the breakdown</p>
                          <p className="text-sm text-muted-foreground">Check detailed calculations to understand your tax position</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Try different scenarios</p>
                          <p className="text-sm text-muted-foreground">Edit values to see how changes affect your tax</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Share2 className="w-5 h-5 mr-2 text-orange-500" />
                      Sharing Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Download PDF reports</p>
                          <p className="text-sm text-muted-foreground">Best format for sharing with accountants</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Use CSV for analysis</p>
                          <p className="text-sm text-muted-foreground">Import into Excel for further calculations</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Keep records</p>
                          <p className="text-sm text-muted-foreground">Save reports for future tax planning</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Find answers to common questions about using Taxfy
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start">
                        <HelpCircle className="w-5 h-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground ml-8">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Support */}
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-green-500/10 border-border/50">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
                  <p className="text-muted-foreground mb-6">
                    Our support team is here to help you get the most out of Taxfy
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button asChild>
                      <Link to="/upload">
                        <Upload className="w-4 h-4 mr-2" />
                        Try Taxfy Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-green-500/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Master Your Tax Calculations?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Put your new knowledge to work and start calculating your tax position today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/upload" onClick={scrollToTop}>
                <Upload className="w-5 h-5 mr-2" />
                Start Calculating
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/manual-entry" onClick={scrollToTop}>
                <Edit3 className="w-5 h-5 mr-2" />
                Manual Entry
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowTo; 