import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { CustomNotificationManager } from "@/components/ui/custom-notification";
import { calculateTaxFromIRP5 } from "@/lib/enhancedTaxCalculator";
import { IRP5Data } from "@/types/IRP5";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import TaxDeductionOptimizer from "@/components/TaxDeductionOptimizer";
import TaxYearComparison from "@/components/TaxYearComparison";
import {
  FileText,
  Calculator,
  CheckCircle,
  Info,
  ArrowRight,
  Upload,
  Zap,
  DollarSign,
  Building,
  Heart,
  Shield,
  Car,
  HelpCircle,
  Sparkles,
  Calendar,
} from "lucide-react";

interface TaxFormData {
  taxYear: string;
  grossIncome: number;
  taxPaid: number;
  retirementContrib: number;
  medicalContrib: number;
  medicalCredits: number;
  uifContrib: number;
  travelAllowance: number;
}

const ManualEntry: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast, toasts, removeToast } = useCustomToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [formData, setFormData] = useState<TaxFormData>({
    taxYear: "2024",
    grossIncome: 0,
    taxPaid: 0,
    retirementContrib: 0,
    medicalContrib: 0,
    medicalCredits: 0,
    uifContrib: 0,
    travelAllowance: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data from navigation state if available
  useEffect(() => {
    const initialData = location.state?.initialData;
    if (initialData) {
      setFormData({
        taxYear: initialData.taxYear || "2024",
        grossIncome: initialData.grossIncome || 0,
        taxPaid: initialData.taxPaid || 0,
        retirementContrib: initialData.retirementContrib || 0,
        medicalContrib: initialData.medicalContrib || 0,
        medicalCredits: initialData.medicalCredits || 0,
        uifContrib: initialData.uifContrib || 0,
        travelAllowance: initialData.travelAllowance || 0,
      });

      // Show a toast to indicate data was pre-populated
      toast({
        title: "Data Pre-populated!",
        description:
          "Your extracted data has been loaded. You can review and edit as needed.",
      });
    }
  }, [location.state, toast]);

  const formatNumber = (value: string): string => {
    if (!value) return "";
    const num = value.replace(/[^\d]/g, "");
    if (num === "") return "";
    return Number(num).toLocaleString();
  };

  const parseNumber = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^\d]/g, "")) || 0;
  };

  const handleInputChange = (field: keyof TaxFormData, value: string) => {
    if (field === "taxYear") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      const numericValue = parseNumber(value);
      setFormData((prev) => ({ ...prev, [field]: numericValue }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.taxYear) {
        newErrors.taxYear = "Tax year is required";
      }
      if (formData.grossIncome <= 0) {
        newErrors.grossIncome = "Gross income must be greater than 0";
      }
      if (formData.taxPaid < 0) {
        newErrors.taxPaid = "Tax paid cannot be negative";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    try {
      // Convert form data to IRP5Data format
      const irp5Data: IRP5Data = {
        grossRemuneration: formData.grossIncome,
        payeWithheld: formData.taxPaid,
        uifContrib: formData.uifContrib,
        retirementFund: formData.retirementContrib,
        medicalScheme: formData.medicalContrib,
        medicalCredits: formData.medicalCredits,
        travelAllowance: formData.travelAllowance,
        totalTax: 0, // Will be calculated
        taxYear: formData.taxYear,
        source: 'manual_entry'
      };
      
      // Calculate tax using enhanced calculator with refund calculation
      const taxResult = calculateTaxFromIRP5(irp5Data);

      // Save to database for authenticated users
      if (user && !user.id.startsWith('offline-')) {
        try {
          await apiService.createTaxCalculation({
            user_id: user.id,
            calculation_type: 'MANUAL_ENTRY',
            input_data: formData,
            result_data: taxResult,
          });
          console.log("💾 Manual tax calculation saved to database");
        } catch (dbError) {
          console.warn("Failed to save manual calculation to database:", dbError);
        }
      }

      // Navigate to results with the calculated data
      navigate("/upload", {
        state: {
          extractedData: {
            ...formData,
            taxResult,
            processingDate: new Date().toISOString(),
            confidence: 1.0, // Manual entry has 100% confidence
          },
          uploadStep: "complete",
          isManualEntry: true,
        },
      });

      toast({
        title: "🎉 Calculation complete!",
        description: "Your tax calculation has been completed successfully.",
      });
    } catch (error) {
      console.error("Error calculating tax:", error);
      toast({
        title: "Calculation Error",
        description:
          "There was an error calculating your tax. Please check your values.",
        variant: "destructive",
      });
    }
  };

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      description: "Income and tax paid",
    },
    {
      number: 2,
      title: "Deductions",
      description: "Optional deductions and contributions",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
            <FileText className="h-4 w-4 mr-2 text-primary" />
            Manual Tax Data Entry
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Enter Your Tax Information
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Don't have a digital IRP5? No problem! Enter your tax information
            manually and get accurate refund calculations.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                <div className="ml-3 text-left">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-6 ${
                      currentStep > step.number ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          {/* AI Upload Encouragement */}
          <div className="mb-6 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>💡 Did you know?</strong> Our AI can process your IRP5
                  in under 30 seconds, saving you hours of manual data entry!
                  <Link
                    to="/upload"
                    className="underline ml-2 hover:text-blue-600 transition-colors"
                  >
                    Try AI Upload Instead →
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 1 ? (
                  <>
                    <DollarSign className="w-5 h-5" />
                    Basic Tax Information
                  </>
                ) : (
                  <>
                    <Building className="w-5 h-5" />
                    Deductions & Contributions
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {currentStep === 1
                  ? "Enter your basic income and tax information from your IRP5"
                  : "Add any deductions or contributions to reduce your taxable income"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  {/* Tax Year */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="taxYear"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Tax Year
                    </Label>
                    <Input
                      id="taxYear"
                      value={formData.taxYear}
                      onChange={(e) =>
                        handleInputChange("taxYear", e.target.value)
                      }
                      placeholder="e.g., 2024"
                      className={errors.taxYear ? "border-red-500" : ""}
                    />
                    {errors.taxYear && (
                      <p className="text-sm text-red-500">{errors.taxYear}</p>
                    )}
                  </div>

                  {/* Gross Income */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="grossIncome"
                      className="flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Gross Annual Income
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        R
                      </span>
                      <Input
                        id="grossIncome"
                        value={
                          formData.grossIncome
                            ? formatNumber(formData.grossIncome.toString())
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange("grossIncome", e.target.value)
                        }
                        placeholder="0"
                        className={`pl-8 ${errors.grossIncome ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.grossIncome && (
                      <p className="text-sm text-red-500">
                        {errors.grossIncome}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Your total salary before any deductions (IRP5 Code: 3601)
                    </p>
                  </div>

                  {/* Tax Paid */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="taxPaid"
                      className="flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      PAYE Tax Already Paid
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        R
                      </span>
                      <Input
                        id="taxPaid"
                        value={
                          formData.taxPaid
                            ? formatNumber(formData.taxPaid.toString())
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange("taxPaid", e.target.value)
                        }
                        placeholder="0"
                        className={`pl-8 ${errors.taxPaid ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.taxPaid && (
                      <p className="text-sm text-red-500">{errors.taxPaid}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Tax deducted from your salary throughout the year (IRP5
                      Code: 3810)
                    </p>
                  </div>

                  {/* Info Alert */}
                  <Alert className="border-blue-500/20 bg-blue-500/10">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-blue-700 dark:text-blue-300">
                      <strong>Where to find this information:</strong> Look for
                      these codes on your IRP5 certificate:
                      <br />• Code 3601: Gross Remuneration
                      <br />• Code 3810: PAYE Tax Withheld
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Retirement Contributions */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="retirementContrib"
                        className="flex items-center gap-2"
                      >
                        <Building className="w-4 h-4" />
                        Retirement Fund Contributions
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          R
                        </span>
                        <Input
                          id="retirementContrib"
                          value={
                            formData.retirementContrib
                              ? formatNumber(
                                  formData.retirementContrib.toString(),
                                )
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "retirementContrib",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pension fund, provident fund, or RA contributions
                      </p>
                    </div>

                    {/* Medical Aid Contributions */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="medicalContrib"
                        className="flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Medical Aid Contributions
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          R
                        </span>
                        <Input
                          id="medicalContrib"
                          value={
                            formData.medicalContrib
                              ? formatNumber(formData.medicalContrib.toString())
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange("medicalContrib", e.target.value)
                          }
                          placeholder="0"
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Medical scheme contributions for you and dependents
                      </p>
                    </div>

                    {/* Medical Tax Credits */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="medicalCredits"
                        className="flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Medical Tax Credits
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          R
                        </span>
                        <Input
                          id="medicalCredits"
                          value={
                            formData.medicalCredits
                              ? formatNumber(formData.medicalCredits.toString())
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange("medicalCredits", e.target.value)
                          }
                          placeholder="0"
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Additional medical expenses and credits
                      </p>
                    </div>

                    {/* UIF Contributions */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="uifContrib"
                        className="flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        UIF Contributions
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          R
                        </span>
                        <Input
                          id="uifContrib"
                          value={
                            formData.uifContrib
                              ? formatNumber(formData.uifContrib.toString())
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange("uifContrib", e.target.value)
                          }
                          placeholder="0"
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Unemployment Insurance Fund contributions
                      </p>
                    </div>
                  </div>

                  {/* Travel Allowance */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="travelAllowance"
                      className="flex items-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      Travel Allowance
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        R
                      </span>
                      <Input
                        id="travelAllowance"
                        value={
                          formData.travelAllowance
                            ? formatNumber(formData.travelAllowance.toString())
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange("travelAllowance", e.target.value)
                        }
                        placeholder="0"
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Travel allowance received from your employer
                    </p>
                  </div>

                  {/* Help Alert */}
                  <Alert className="border-green-500/20 bg-green-500/10">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      <strong>Pro Tip:</strong> These deductions can
                      significantly reduce your taxable income and increase your
                      refund. Only include amounts that were actually deducted
                      from your salary or that you contributed yourself.
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <div>
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate("/upload")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload IRP5 Instead
                  </Button>

                  {currentStep < steps.length ? (
                    <Button onClick={handleNext}>
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate My Refund
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Common IRP5 Codes</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">3601:</span>
                      <span>Gross Remuneration</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">4102:</span>
                      <span>PAYE Tax Withheld</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">4005:</span>
                      <span>Retirement Fund Contributions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">3810:</span>
                      <span>Medical Aid Contributions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">4150:</span>
                      <span>Medical Tax Credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">3605:</span>
                      <span>UIF Contributions</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Tips for Accuracy</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Double-check all amounts from your IRP5</li>
                    <li>• Include all income sources for the tax year</li>
                    <li>• Only include deductions actually made</li>
                    <li>• Keep your IRP5 certificate for reference</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Notification Manager */}
      <CustomNotificationManager toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ManualEntry;
