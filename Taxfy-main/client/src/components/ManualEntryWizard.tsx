import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, FileText, Brain, Eye, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PayFrequencyHelper from "./PayFrequencyHelper";
import SmartSuggestions from "./SmartSuggestions";
import AiValidationConfig from "./AiValidationConfig";
import AiFeedbackCard from "./AiFeedbackCard";
import PdfGuidePopover from "./PdfGuidePopover";
import { useAiValidation } from "@/hooks/useAiValidation";

interface FormData {
  taxYear: string;
  grossSalary: string;
  payeWithheld: string;
  retirementContribution: string;
  medicalAidContribution: string;
  medicalCredits: string;
  uifContribution: string;
  travelAllowance: string;
}

interface IRP5Data {
  grossRemuneration: number;
  payeWithheld: number;
  uifContrib: number;
  retirementFund: number;
  medicalScheme: number;
  travelAllowance: number;
  medicalCredits: number;
  taxYear: string;
}

interface ManualEntryWizardProps {
  initialData?: Partial<Record<keyof FormData, string | number>>;
  enableAiValidation?: boolean;
  onDataSubmit?: (data: IRP5Data) => void;
}

const ManualEntryWizard: React.FC<ManualEntryWizardProps> = ({
  initialData = {},
  enableAiValidation = false,
  onDataSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    taxYear: "2024",
    grossSalary: "",
    payeWithheld: "",
    retirementContribution: "",
    medicalAidContribution: "",
    medicalCredits: "",
    uifContribution: "",
    travelAllowance: "",
  });

  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [aiValidationEnabled, setAiValidationEnabled] =
    useState(enableAiValidation);
  const [validationResultsState, setValidationResultsState] = useState<{
    isValid: boolean;
    confidence: number;
    suggestions: string[];
    warnings: string[];
  } | null>(null);

  const {
    requestValidation,
    validationResults,
    loadingFields,
    activeChecks,
    dismissValidation,
    cleanup,
  } = useAiValidation(aiValidationEnabled);

  const formatNumber = (value: string): string => {
    if (!value) return "";
    const num = value.replace(/[^\d]/g, ""); // Remove all non-digits
    if (num === "") return "";
    return Number(num).toLocaleString();
  };

  const parseNumber = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^\d]/g, "")) || 0;
  };

  const getFormContext = useCallback(
    (data: FormData): Record<string, number> => {
      return {
        grossSalary: parseNumber(data.grossSalary),
        payeWithheld: parseNumber(data.payeWithheld),
        retirementContribution: parseNumber(data.retirementContribution),
        medicalAidContribution: parseNumber(data.medicalAidContribution),
        medicalCredits: parseNumber(data.medicalCredits),
        uifContribution: parseNumber(data.uifContribution),
        travelAllowance: parseNumber(data.travelAllowance),
      };
    },
    [],
  );

  // Initialize form data with initial data
  useEffect(() => {
    if (initialData) {
      const mergedData = { ...formData };

      Object.entries(initialData).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "0"
        ) {
          const formattedValue =
            typeof value === "number" ? value.toString() : String(value || "");
          mergedData[key as keyof FormData] = formattedValue;
        }
      });

      setFormData(mergedData);

      if (enableAiValidation) {
        setTimeout(() => {
          handleValidateData();
        }, 1000);
      }
    }
  }, [initialData, enableAiValidation]);

  // AI Validation Effect - separate from initialization
  useEffect(() => {
    if (!aiValidationEnabled) return;

    const timeoutId = setTimeout(() => {
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value &&
          [
            "grossSalary",
            "payeWithheld",
            "retirementContribution",
            "medicalAidContribution",
            "medicalCredits",
            "uifContribution",
            "travelAllowance",
          ].includes(key)
        ) {
          const numValue = parseNumber(value);
          if (numValue >= 1000) {
            requestValidation(key, numValue, getFormContext(formData));
          }
        }
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [aiValidationEnabled]);

  const getFieldBorderClass = (field: string): string => {
    if (!aiValidationEnabled) return "";

    const isLoading = loadingFields.has(field);
    const result = validationResults[field];

    if (isLoading) return "border-purple-300";
    if (!result) return "";

    switch (result.status) {
      case "good":
        return "border-green-300";
      case "warning":
        return "border-yellow-300";
      case "error":
        return "border-red-300";
      default:
        return "";
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const formattedValue = [
      "grossSalary",
      "payeWithheld",
      "retirementContribution",
      "medicalAidContribution",
      "medicalCredits",
      "uifContribution",
      "travelAllowance",
    ].includes(field)
      ? formatNumber(value)
      : value;

    const newFormData = {
      ...formData,
      [field]: formattedValue,
    };

    setFormData(newFormData);

    // Trigger AI validation for currency fields
    if (
      aiValidationEnabled &&
      [
        "grossSalary",
        "payeWithheld",
        "retirementContribution",
        "medicalAidContribution",
        "medicalCredits",
        "uifContribution",
        "travelAllowance",
      ].includes(field)
    ) {
      const numValue = parseNumber(formattedValue);
      requestValidation(field, numValue, getFormContext(newFormData));
    }
  };

  const handlePayFrequencyApply = (annualAmount: number) => {
    handleInputChange("grossSalary", annualAmount.toString());
  };

  const handleSuggestionApply = (field: string, amount: number) => {
    handleInputChange(field as keyof FormData, amount.toString());

    // Mark suggestion as applied
    const suggestionId =
      field === "uifContribution"
        ? "uif-standard"
        : amount > parseNumber(formData.grossSalary) * 0.2
          ? "retirement-max"
          : "retirement-conservative";
    setAppliedSuggestions((prev) => [...prev, suggestionId]);
  };

  const handleValidateData = async () => {
    setIsValidating(true);

    try {
      // Simulate AI validation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setValidationResultsState({
        isValid: true,
        confidence: 0.92,
        suggestions: [
          "All required fields are properly filled",
          "Tax amounts appear consistent with income level",
          "Retirement contributions are within expected range",
        ],
        warnings: [],
      });
    } catch (error) {
      setValidationResultsState({
        isValid: false,
        confidence: 0.45,
        suggestions: [],
        warnings: ["Validation failed. Please review your entries."],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleCalculateRefund = () => {
    const numericData: IRP5Data = {
      grossRemuneration: parseFloat(formData.grossSalary) || 0,
      payeWithheld: parseFloat(formData.payeWithheld) || 0,
      retirementFund: parseFloat(formData.retirementContribution) || 0,
      medicalScheme: parseFloat(formData.medicalAidContribution) || 0,
      uifContrib: parseFloat(formData.uifContribution) || 0,
      travelAllowance: parseFloat(formData.travelAllowance) || 0,
      medicalCredits: parseFloat(formData.medicalCredits) || 0,
      taxYear: formData.taxYear,
    };

    // Scroll to top before submitting data
    scrollToTop();

    onDataSubmit?.(numericData);
  };

  const isFormValid = () => {
    return (
      parseNumber(formData.grossSalary) > 0 &&
      parseNumber(formData.payeWithheld) >= 0
    );
  };

  const hasPrefilledData = Object.keys(initialData).length > 0;
  const grossSalaryNum = parseNumber(formData.grossSalary);

  // Utility function to scroll to top smoothly
  const scrollToTop = () => {
    // Temporarily disable smooth scrolling for instant scroll
    const originalScrollBehavior =
      document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    // Scroll to top instantly
    window.scrollTo(0, 0);

    // Restore smooth scrolling after a brief delay
    setTimeout(() => {
      document.documentElement.style.scrollBehavior =
        originalScrollBehavior || "smooth";
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Pre-filled Data Banner */}
      {hasPrefilledData && (
        <Alert className="border-green-500/20 bg-green-500/10 backdrop-blur-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            <strong>Smart handoff detected!</strong> We've pre-filled your form
            with extracted data:
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(initialData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <span className="font-medium">
                    R{formatNumber(value?.toString() || "0")}
                  </span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* AI Validation Config */}
      {enableAiValidation && (
        <AiValidationConfig
          enabled={aiValidationEnabled}
          onToggle={setAiValidationEnabled}
          activeChecks={activeChecks}
          validationResults={validationResults}
          loadingFields={loadingFields}
        />
      )}

      <Card className="glass border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-muted/20 border-b border-border/50">
          <div className="flex justify-center mb-3">
            <img
              src="/assets/logo-ta.png"
              alt="Taxfy Logo"
              className="h-8 w-8 object-contain animate-bounce-subtle"
            />
          </div>
          <CardTitle className="flex items-center justify-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Manual Tax Data Entry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 bg-background/50">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxYear" className="flex items-center">
                Tax Year
                <PdfGuidePopover field="taxYear" />
              </Label>
              <Select
                value={formData.taxYear}
                onValueChange={(value) => handleInputChange("taxYear", value)}
              >
                <SelectTrigger className="bg-background/50 border-border/50 focus:bg-background">
                  <SelectValue placeholder="Select tax year" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border/50">
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grossSalary" className="flex items-center">
                Total Annual Salary
                <PayFrequencyHelper onApply={handlePayFrequencyApply} />
                <PdfGuidePopover field="grossSalary" />
                {aiValidationEnabled && validationResults.grossSalary && (
                  <span className="ml-2 text-xs text-gray-500">
                    AI {validationResults.grossSalary.confidence}%
                  </span>
                )}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R
                </span>
                <Input
                  id="grossSalary"
                  value={formData.grossSalary}
                  onChange={(e) =>
                    handleInputChange("grossSalary", e.target.value)
                  }
                  placeholder="0"
                  className={`pl-8 bg-background/50 border-border/50 focus:bg-background ${getFieldBorderClass("grossSalary")}`}
                />
                {loadingFields.has("grossSalary") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {validationResults.grossSalary && (
                <AiFeedbackCard
                  field="grossSalary"
                  status={validationResults.grossSalary.status}
                  message={validationResults.grossSalary.message}
                  confidence={validationResults.grossSalary.confidence}
                  suggestions={validationResults.grossSalary.suggestions}
                  onDismiss={() => dismissValidation("grossSalary")}
                />
              )}
            </div>
          </div>

          {/* Smart Suggestions */}
          {grossSalaryNum > 0 && (
            <SmartSuggestions
              grossSalary={grossSalaryNum}
              onApplySuggestion={handleSuggestionApply}
              appliedSuggestions={appliedSuggestions}
            />
          )}

          {/* Tax Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payeWithheld" className="flex items-center">
                PAYE Tax Withheld
                <PdfGuidePopover field="payeWithheld" />
                {aiValidationEnabled && validationResults.payeWithheld && (
                  <span className="ml-2 text-xs text-gray-500">
                    AI {validationResults.payeWithheld.confidence}%
                  </span>
                )}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R
                </span>
                <Input
                  id="payeWithheld"
                  value={formData.payeWithheld}
                  onChange={(e) =>
                    handleInputChange("payeWithheld", e.target.value)
                  }
                  placeholder="0"
                  className={`pl-8 bg-background/50 border-border/50 focus:bg-background ${getFieldBorderClass("payeWithheld")}`}
                />
                {loadingFields.has("payeWithheld") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {validationResults.payeWithheld && (
                <AiFeedbackCard
                  field="payeWithheld"
                  status={validationResults.payeWithheld.status}
                  message={validationResults.payeWithheld.message}
                  confidence={validationResults.payeWithheld.confidence}
                  suggestions={validationResults.payeWithheld.suggestions}
                  onDismiss={() => dismissValidation("payeWithheld")}
                />
              )}
            </div>

            <div>
              <Label htmlFor="uifContribution" className="flex items-center">
                UIF Contribution
                <PdfGuidePopover field="uifContribution" />
                {aiValidationEnabled && validationResults.uifContribution && (
                  <span className="ml-2 text-xs text-gray-500">
                    AI {validationResults.uifContribution.confidence}%
                  </span>
                )}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R
                </span>
                <Input
                  id="uifContribution"
                  value={formData.uifContribution}
                  onChange={(e) =>
                    handleInputChange("uifContribution", e.target.value)
                  }
                  placeholder="0"
                  className={`pl-8 bg-background/50 border-border/50 focus:bg-background ${getFieldBorderClass("uifContribution")}`}
                />
                {loadingFields.has("uifContribution") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {validationResults.uifContribution && (
                <AiFeedbackCard
                  field="uifContribution"
                  status={validationResults.uifContribution.status}
                  message={validationResults.uifContribution.message}
                  confidence={validationResults.uifContribution.confidence}
                  suggestions={validationResults.uifContribution.suggestions}
                  onDismiss={() => dismissValidation("uifContribution")}
                />
              )}
            </div>

            <div>
              <Label
                htmlFor="retirementContribution"
                className="flex items-center"
              >
                Retirement Fund Contribution
                <PdfGuidePopover field="retirementContribution" />
                {aiValidationEnabled &&
                  validationResults.retirementContribution && (
                    <span className="ml-2 text-xs text-gray-500">
                      AI {validationResults.retirementContribution.confidence}%
                    </span>
                  )}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R
                </span>
                <Input
                  id="retirementContribution"
                  value={formData.retirementContribution}
                  onChange={(e) =>
                    handleInputChange("retirementContribution", e.target.value)
                  }
                  placeholder="0"
                  className={`pl-8 bg-background/50 border-border/50 focus:bg-background ${getFieldBorderClass("retirementContribution")}`}
                />
                {loadingFields.has("retirementContribution") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {validationResults.retirementContribution && (
                <AiFeedbackCard
                  field="retirementContribution"
                  status={validationResults.retirementContribution.status}
                  message={validationResults.retirementContribution.message}
                  confidence={
                    validationResults.retirementContribution.confidence
                  }
                  suggestions={
                    validationResults.retirementContribution.suggestions
                  }
                  onDismiss={() => dismissValidation("retirementContribution")}
                />
              )}
            </div>

            <div>
              <Label
                htmlFor="medicalAidContribution"
                className="flex items-center"
              >
                Medical Aid Contribution
                <PdfGuidePopover field="medicalAidContribution" />
                {aiValidationEnabled &&
                  validationResults.medicalAidContribution && (
                    <span className="ml-2 text-xs text-gray-500">
                      AI {validationResults.medicalAidContribution.confidence}%
                    </span>
                  )}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R
                </span>
                <Input
                  id="medicalAidContribution"
                  value={formData.medicalAidContribution}
                  onChange={(e) =>
                    handleInputChange("medicalAidContribution", e.target.value)
                  }
                  placeholder="0"
                  className={`pl-8 bg-background/50 border-border/50 focus:bg-background ${getFieldBorderClass("medicalAidContribution")}`}
                />
                {loadingFields.has("medicalAidContribution") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {validationResults.medicalAidContribution && (
                <AiFeedbackCard
                  field="medicalAidContribution"
                  status={validationResults.medicalAidContribution.status}
                  message={validationResults.medicalAidContribution.message}
                  confidence={
                    validationResults.medicalAidContribution.confidence
                  }
                  suggestions={
                    validationResults.medicalAidContribution.suggestions
                  }
                  onDismiss={() => dismissValidation("medicalAidContribution")}
                />
              )}
            </div>

            <div>
              <Label htmlFor="medicalCredits" className="flex items-center">
                Medical Scheme Tax Credits
                <PdfGuidePopover field="medicalCredits" />
                {aiValidationEnabled && validationResults.medicalCredits && (
                  <span className="ml-2 text-xs text-gray-500">
                    AI {validationResults.medicalCredits.confidence}%
                  </span>
                )}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R
                </span>
                <Input
                  id="medicalCredits"
                  value={formData.medicalCredits}
                  onChange={(e) =>
                    handleInputChange("medicalCredits", e.target.value)
                  }
                  placeholder="0"
                  className={`pl-8 bg-background/50 border-border/50 focus:bg-background ${getFieldBorderClass("medicalCredits")}`}
                />
                {loadingFields.has("medicalCredits") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {validationResults.medicalCredits && (
                <AiFeedbackCard
                  field="medicalCredits"
                  status={validationResults.medicalCredits.status}
                  message={validationResults.medicalCredits.message}
                  confidence={validationResults.medicalCredits.confidence}
                  suggestions={validationResults.medicalCredits.suggestions}
                  onDismiss={() => dismissValidation("medicalCredits")}
                />
              )}
            </div>

            <div>
              <Label htmlFor="travelAllowance" className="flex items-center">
                Travel Allowance
                <PdfGuidePopover field="travelAllowance" />
                {aiValidationEnabled && validationResults.travelAllowance && (
                  <span className="ml-2 text-xs text-gray-500">
                    AI {validationResults.travelAllowance.confidence}%
                  </span>
                )}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R
                </span>
                <Input
                  id="travelAllowance"
                  value={formData.travelAllowance}
                  onChange={(e) =>
                    handleInputChange("travelAllowance", e.target.value)
                  }
                  placeholder="0"
                  className={`pl-8 bg-background/50 border-border/50 focus:bg-background ${getFieldBorderClass("travelAllowance")}`}
                />
                {loadingFields.has("travelAllowance") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {validationResults.travelAllowance && (
                <AiFeedbackCard
                  field="travelAllowance"
                  status={validationResults.travelAllowance.status}
                  message={validationResults.travelAllowance.message}
                  confidence={validationResults.travelAllowance.confidence}
                  suggestions={validationResults.travelAllowance.suggestions}
                  onDismiss={() => dismissValidation("travelAllowance")}
                />
              )}
            </div>
          </div>

          {/* Data Preview */}
          {showPreview && (
            <Card className="border-border/50 bg-muted/20 backdrop-blur-sm">
              <CardHeader className="pb-3 bg-muted/10 border-b border-border/50">
                <CardTitle className="text-sm">Data Summary</CardTitle>
              </CardHeader>
              <CardContent className="bg-background/30">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(formData).map(
                    ([key, value]) =>
                      value && (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize text-muted-foreground">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="font-medium text-foreground">
                            {[
                              "grossSalary",
                              "payeWithheld",
                              "retirementContribution",
                              "medicalAidContribution",
                              "medicalCredits",
                              "uifContribution",
                              "travelAllowance",
                            ].includes(key)
                              ? `R${value}`
                              : value}
                          </span>
                        </div>
                      ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleValidateData}
              disabled={isValidating}
              variant="outline"
              className="flex-1 min-w-[200px]"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isValidating ? "Validating..." : "Validate My Numbers"}
            </Button>

            <Button
              onClick={() => {
                setShowPreview(!showPreview);
                scrollToTop();
              }}
              variant="outline"
              className="flex-1 min-w-[200px]"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Hide Summary" : "Show Summary"}
            </Button>

            <Button
              onClick={handleCalculateRefund}
              disabled={!isFormValid()}
              className="flex-1 min-w-[200px] bg-primary hover:bg-primary/90"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate My Refund
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualEntryWizard;
