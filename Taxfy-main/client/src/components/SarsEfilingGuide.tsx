import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  Upload,
  Calendar,
  Shield,
  Clock,
  ChevronRight,
  Info,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface SarsEfilingGuideProps {
  refundAmount?: number;
  taxYear?: string;
}

export function SarsEfilingGuide({ refundAmount = 0, taxYear }: SarsEfilingGuideProps) {
  const currentYear = new Date().getFullYear();
  const displayTaxYear = taxYear || `${currentYear}/${(currentYear + 1).toString().slice(2)}`;
  const isRefund = refundAmount > 0;

  const steps = [
    {
      number: 1,
      title: "Download Your Tax Data",
      description: "Export your tax information using the download button above. Choose CSV format for easy viewing.",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      tips: [
        "CSV format is recommended - easy to view in Excel",
        "JSON format is for developers/advanced users",
        "Keep this file safe for your records"
      ]
    },
    {
      number: 2,
      title: "Visit SARS eFiling Portal",
      description: "Log into the official SARS eFiling website using your credentials.",
      icon: ExternalLink,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      tips: [
        "URL: www.sarsefiling.co.za",
        "Use your registered tax number and password",
        "If you forgot your password, use the 'Reset Password' link"
      ],
      action: {
        label: "Open SARS eFiling",
        url: "https://www.sarsefiling.co.za"
      }
    },
    {
      number: 3,
      title: "Start Your ITR12 Return",
      description: "Navigate to 'Returns' → 'Income Tax Return' → 'ITR12' and start a new return for the tax year.",
      icon: Upload,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      tips: [
        "Select the correct tax year: " + displayTaxYear,
        "ITR12 is for individuals (employees and businesses)",
        "You can save progress and continue later"
      ]
    },
    {
      number: 4,
      title: "Enter Your Tax Information",
      description: "Fill in each section using the data from your downloaded file. Taxfy has organized everything you need.",
      icon: CheckCircle2,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      tips: [
        "Use the exported CSV file as your reference",
        "Double-check all amounts before proceeding",
        "Upload your IRP5 certificate if requested"
      ]
    },
    {
      number: 5,
      title: "Review & Submit",
      description: "Review all information carefully, then submit your return electronically to SARS.",
      icon: Shield,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      tips: [
        "SARS will show a summary before final submission",
        "You'll receive a confirmation email from SARS",
        "Save your submission reference number"
      ]
    },
  ];

  const deadlines = [
    {
      type: "Non-provisional Taxpayers",
      date: "20 October " + currentYear,
      description: "Individuals earning only salary/wages",
      urgent: new Date() > new Date(currentYear, 9, 1), // After Oct 1
    },
    {
      type: "Provisional Taxpayers",
      date: "19 January " + (currentYear + 1),
      description: "Business owners, consultants, freelancers",
      urgent: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                SARS eFiling Guide
              </CardTitle>
              <CardDescription className="mt-2">
                Follow these steps to submit your tax return to SARS and claim your {isRefund ? "refund" : "complete your tax obligations"}
              </CardDescription>
            </div>
            <Badge variant={isRefund ? "default" : "secondary"} className="text-sm">
              Tax Year {displayTaxYear}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Important Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> SARS does not accept direct XML file uploads for individual tax returns. 
          You must manually enter your information through the eFiling portal. Taxfy has prepared all your data 
          to make this process quick and easy.
        </AlertDescription>
      </Alert>

      {/* Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Important Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {deadlines.map((deadline, index) => (
            <div
              key={index}
              className={`flex items-start justify-between p-3 rounded-lg border ${
                deadline.urgent
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                  : "border-border bg-muted/50"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{deadline.type}</p>
                  {deadline.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Coming Soon!
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{deadline.description}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${deadline.urgent ? "text-orange-600" : "text-foreground"}`}>
                  {deadline.date}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Step-by-Step Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step-by-Step Instructions</CardTitle>
          <CardDescription>
            Complete these steps to file your tax return with SARS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.number}>
              <div className="flex gap-4">
                {/* Step Number Circle */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${step.bgColor} flex items-center justify-center`}>
                  <span className={`text-lg font-bold ${step.color}`}>{step.number}</span>
                </div>

                {/* Step Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                      <h3 className="font-semibold text-base">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Tips */}
                  <div className={`${step.bgColor} rounded-lg p-3 space-y-1`}>
                    {step.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start gap-2">
                        <Lightbulb className={`w-3 h-3 mt-0.5 flex-shrink-0 ${step.color}`} />
                        <p className="text-xs text-muted-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  {step.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open(step.action.url, "_blank")}
                      data-testid={`button-efiling-step${step.number}`}
                    >
                      {step.action.label}
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Separator between steps */}
              {index < steps.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* What to Expect */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            What to Expect After Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Immediate Confirmation</p>
              <p className="text-xs text-muted-foreground">
                You'll receive an instant confirmation email from SARS with your submission reference number
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Processing Time</p>
              <p className="text-xs text-muted-foreground">
                SARS typically processes returns within 5-10 business days
              </p>
            </div>
          </div>

          {isRefund && (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Refund Payment</p>
                <p className="text-xs text-muted-foreground">
                  If approved, your refund will be paid into your registered bank account within 72 hours after assessment
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Track Your Return</p>
              <p className="text-xs text-muted-foreground">
                You can track the status of your return on SARS eFiling under "Returns" → "View Returns"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-medium mb-1">SARS Contact Centre</p>
            <p className="text-xs text-muted-foreground">
              Phone: 0800 00 7ars (0800 00 7277) | International: +27 11 602 2093
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">SARS eFiling Support</p>
            <p className="text-xs text-muted-foreground">
              Email: helpdesk@sarsefiling.co.za
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Taxfy Support</p>
            <p className="text-xs text-muted-foreground">
              For questions about your Taxfy export or calculations, contact support@taxfy.co.za
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
