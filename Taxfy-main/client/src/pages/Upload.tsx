import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Upload as UploadIcon,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Edit3,
  X,
  Loader2,
  Eye,
  Download,
  Zap,
  AlertTriangle,
  Calculator,
  Save,
  Info,
  Lock,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { CustomNotificationManager } from "@/components/ui/custom-notification";
import { Badge } from "@/components/ui/badge";
import {
  processPDF,
  validatePDFFile,
  IRP5Data,
  ProcessingProgress,
} from "@/lib/pdfProcessor";
import { calculateTaxFromIRP5, EnhancedTaxResult } from "@/lib/enhancedTaxCalculator";
import {
  usePerformanceMonitor,
  useOperationTimer,
} from "@/hooks/usePerformanceMonitor";
import { useAiValidation } from "@/hooks/useAiValidation";
import TaxResults from "@/components/TaxResults";
import TaxResultsEnhanced from "@/components/TaxResultsEnhanced";
import { SarsEfilingPreview } from "@/components/SarsEfilingPreview";
import MobileAppFeatures from "@/components/MobileAppFeatures";
import {
  EnhancedPDFGenerator,
  type ComprehensiveReportData,
  type AuditStep,
  type TaxRecommendation,
  type ComplianceCheck,
} from "@/lib/enhancedPdfGenerator";
import { Input } from "@/components/ui/input";
import { pdfStorage } from "@/lib/pdfStorage";
import { cloudStorage } from "@/lib/cloudStorage";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { AuthButton } from "@/components/auth/AuthButton";

type UploadStep = "upload" | "processing" | "complete" | "error" | "results";

// Utility function to scroll to top smoothly
const scrollToTop = () => {
  // Temporarily disable smooth scrolling for instant scroll
  const originalScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";

  // Scroll to top instantly
  window.scrollTo(0, 0);

  // Restore smooth scrolling after a brief delay
  setTimeout(() => {
    document.documentElement.style.scrollBehavior =
      originalScrollBehavior || "smooth";
  }, 100);
};

const Upload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStep, setUploadStep] = useState<UploadStep>("upload");
  const [progress, setProgress] = useState<ProcessingProgress>({
    stage: "loading",
    progress: 0,
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<IRP5Data | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // New state for tax calculation
  const [isCalculating, setIsCalculating] = useState(false);
  const [taxResults, setTaxResults] = useState<EnhancedTaxResult | null>(
    null,
  );

  const { trackInteraction } = usePerformanceMonitor("Upload");
  const pdfProcessingTimer = useOperationTimer("PDF Processing");
  const { toast, toasts, removeToast } = useCustomToast();
  const { logPerformanceSummary } = usePerformanceMonitor("Upload");

  // Authentication and subscription hooks
  const { user, loading: authLoading } = useAuth();
  const { canUploadIRP5, usage, planLimits } = useSubscription();

  const [isEditingData, setIsEditingData] = useState(false);
  const [editedValues, setEditedValues] = useState<Partial<IRP5Data>>({});

  // Handle incoming state from ManualEntry navigation
  useEffect(() => {
    if (location.state) {
      const {
        extractedData,
        uploadStep: incomingStep,
        isManualEntry,
      } = location.state as any;

      if (isManualEntry && extractedData && incomingStep === "complete") {
        console.log("📥 Received manual entry data:", extractedData);

        // Set the extracted data and tax results from manual entry
        setExtractedData({
          grossRemuneration: extractedData.grossIncome || 0,
          payeWithheld: extractedData.taxPaid || 0,
          retirementFund: extractedData.retirementContrib || 0,
          medicalScheme: extractedData.medicalContrib || 0,
          medicalCredits: extractedData.medicalCredits || 0,
          uifContrib: extractedData.uifContrib || 0,
          travelAllowance: extractedData.travelAllowance || 0,
          taxYear: extractedData.taxYear || "2024",
          totalTax: extractedData.totalTax || 0,
          source: "manual_entry",
          uploadedAt: new Date().toISOString(),
          confidence: extractedData.confidence || 1.0,
        });

        // Set the tax results if they exist
        if (extractedData.taxResult) {
          setTaxResults(extractedData.taxResult);
          setUploadStep("results");
        } else {
          setUploadStep("complete");
        }

        // Clear the navigation state to prevent re-triggering
        navigate(location.pathname, { replace: true });

        // Scroll to top
        scrollToTop();
      }
    }
  }, [location.state, navigate, location.pathname]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const selectedFile = e.target.files[0];
        processFile(selectedFile);
      }
    },
    [],
  );

  const processFile = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile);

      const validation = validatePDFFile(selectedFile);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      setUploadStep("processing");
      setProgress({
        stage: "converting",
        progress: 0,
        message: "Initializing...",
      });

      // Scroll to top when starting processing
      scrollToTop();

      try {
        const result = await processPDF(
          selectedFile,
          (progressUpdate: ProcessingProgress) => {
            setProgress(progressUpdate);
          },
        );

        if (result.success && result.data) {
          setExtractedData(result.data);
          setConfidence(result.data.confidence || 0);
          setUploadStep("complete");

          // Store PDF in cloud storage for authenticated users, local for guests
          try {
            if (user && !user.id.startsWith('offline-')) {
              // Authenticated user - use cloud storage and database
              const cloudResult = await cloudStorage.uploadFile(
                selectedFile,
                user.id,
                {
                  extractedData: result.data,
                  processingDate: new Date().toISOString(),
                  taxYear: result.data.taxYear
                }
              );

              if (cloudResult.success) {
                // Save upload record to database
                try {
                  await apiService.createDocumentUpload({
                    user_id: user.id,
                    filename: cloudResult.file?.name || selectedFile.name,
                    original_name: selectedFile.name,
                    file_size: selectedFile.size,
                    mime_type: selectedFile.type,
                    upload_path: cloudResult.file?.id || selectedFile.name,
                  });
                } catch (dbError) {
                  console.warn("Failed to save upload to database:", dbError);
                }

                toast({
                  title: "Success! ☁️",
                  description: "Your IRP5 has been processed and saved to cloud storage.",
                });
              } else {
                // Fallback to local storage
                console.warn("Cloud storage failed, using local:", cloudResult.error);
                const localResult = await pdfStorage.storePDF(selectedFile, result.data);

                // Try to save local upload to database
                try {
                  await apiService.createDocumentUpload({
                    user_id: user.id,
                    filename: selectedFile.name,
                    original_name: selectedFile.name,
                    file_size: selectedFile.size,
                    mime_type: selectedFile.type,
                    upload_path: `local://${selectedFile.name}`,
                  });
                } catch (dbError) {
                  console.warn("Failed to save local upload to database:", dbError);
                }

                toast({
                  title: "Processed successfully",
                  description: `PDF processed and saved locally (cloud unavailable)`,
                });
              }
            } else {
              // Guest user - use local storage only
              const storageResult = await pdfStorage.storePDF(
                selectedFile,
                result.data,
              );
              if (storageResult.success) {
                toast({
                  title: "Success!",
                  description: "Your IRP5 has been processed and saved locally.",
                });
              } else {
                toast({
                  title: "Processed successfully",
                  description: `PDF processed but not saved: ${storageResult.error}`,
                });
              }
            }
          } catch (storageError) {
            console.warn("Failed to store PDF:", storageError);
            toast({
              title: "Success!",
              description: "Your IRP5 has been processed successfully.",
            });
          }

          trackInteraction("pdf_processed_successfully");
        } else {
          throw new Error(result.error || "Failed to process PDF");
        }
      } catch (error: any) {
        console.error("PDF processing error:", error);

        const errorMessage = error.message || "Failed to process the PDF file";

        // Provide more helpful error messages based on error type
        let userMessage = errorMessage;
        let suggestions = "";

        if (errorMessage.includes("password")) {
          userMessage = "PDF is password protected";
          suggestions = "Please provide an unprotected PDF file.";
        } else if (
          errorMessage.includes("corrupted") ||
          errorMessage.includes("invalid")
        ) {
          userMessage = "PDF file appears to be corrupted";
          suggestions =
            "Please try a different PDF file or re-download the original.";
        } else if (errorMessage.includes("timeout")) {
          userMessage = "PDF processing timed out";
          suggestions =
            "The file may be too large or complex. Try a simpler PDF.";
        } else if (
          errorMessage.includes("canvas") ||
          errorMessage.includes("image")
        ) {
          userMessage = "Unable to process PDF images";
          suggestions =
            "Please try a text-based PDF instead of a scanned image.";
        } else if (
          errorMessage.includes("unsupported features") ||
          errorMessage.includes("BaseExceptionClosure")
        ) {
          userMessage = "PDF contains unsupported features";
          suggestions =
            "This PDF may be complex or encrypted. Try converting it to a simpler format, or use manual entry below.";
        } else if (errorMessage.includes("manual entry")) {
          userMessage = "Unable to process PDF automatically";
          suggestions =
            "No worries! You can enter your tax information manually using the form below.";
        } else {
          suggestions =
            "Please check your file and try again, or use manual entry below if the problem persists.";
        }

        setErrorMessage(`${userMessage}. ${suggestions}`);
        setUploadStep("error");

        toast({
          title: "Processing failed",
          description: `${userMessage}. ${suggestions}`,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        pdfProcessingTimer.stop();
      }
    },
    [toast, trackInteraction, pdfProcessingTimer],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile],
  );

  const handleViewResults = () => {
    const endTracking = trackInteraction("view-results");
    setUploadStep("results");

    // Scroll to top when viewing results
    scrollToTop();

    endTracking();
  };

  const handleCalculate = async () => {
    if (!extractedData) {
      toast({
        title: "No Data Available",
        description: "Please upload and process a document first.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    // Scroll to top when starting calculation
    scrollToTop();

    try {
      console.log(
        "🧮 Starting tax calculation with extracted data:",
        extractedData,
      );

      // Validate and sanitize input data with better error messages
      const grossIncome = Number(extractedData.grossRemuneration) || 0;
      const retirementContrib = Number(extractedData.retirementFund) || 0;
      const medicalContrib = Number(extractedData.medicalScheme) || 0;
      const payeWithheld = Number(extractedData.payeWithheld) || 0;
      const uifContrib = Number(extractedData.uifContrib) || 0;
      const medicalCredits = Number(extractedData.medicalCredits) || 0;

      console.log("📊 Sanitized calculation inputs:", {
        grossIncome,
        retirementContrib,
        medicalContrib,
        payeWithheld,
        uifContrib,
        medicalCredits,
      });

      // Enhanced validation with specific error messages
      if (grossIncome <= 0) {
        throw new Error(
          "Gross income must be greater than zero. Please check your IRP5 document.",
        );
      }

      if (
        isNaN(grossIncome) ||
        isNaN(retirementContrib) ||
        isNaN(medicalContrib) ||
        isNaN(payeWithheld)
      ) {
        throw new Error(
          "Invalid numeric data detected in your document. Please try uploading again or use manual entry.",
        );
      }

      if (grossIncome > 10000000) {
        throw new Error(
          "Gross income seems unusually high. Please verify your document or use manual entry.",
        );
      }

      // Calculate tax using enhanced formula with refund calculation
      console.log("🔄 Calling calculateTaxFromIRP5 function...");
      const taxResult = calculateTaxFromIRP5(extractedData);

      console.log("✅ Tax calculation completed:", taxResult);

      // Validate tax result
      if (!taxResult || typeof taxResult.totalTax !== "number") {
        throw new Error(
          "Tax calculation failed to produce valid results. Please try again.",
        );
      }

      setTaxResults(taxResult);
      setUploadStep("results");

      // Save tax calculation to database for authenticated users
      if (user && !user.id.startsWith('offline-')) {
        try {
          await apiService.createTaxCalculation({
            user_id: user.id,
            calculation_type: 'IRP5_UPLOAD',
            input_data: {
              grossIncome: extractedData.grossRemuneration,
              payeWithheld: extractedData.payeWithheld,
              retirementFund: extractedData.retirementFund,
              medicalScheme: extractedData.medicalScheme,
              medicalCredits: extractedData.medicalCredits,
              uifContrib: extractedData.uifContrib,
              travelAllowance: extractedData.travelAllowance,
              taxYear: extractedData.taxYear,
            },
            result_data: taxResult,
          });
          console.log("💾 Tax calculation saved to database");
        } catch (dbError) {
          console.warn("Failed to save tax calculation to database:", dbError);
        }
      }

      // Update stored PDF with tax results if file was uploaded
      if (file) {
        try {
          const storedPDFs = pdfStorage.getStoredPDFs();
          const matchingPDF = storedPDFs.find(
            (pdf) =>
              pdf.originalName === file.name &&
              Math.abs(pdf.size - file.size) < 1000, // Allow small size differences
          );

          if (matchingPDF) {
            matchingPDF.taxResults = taxResult;
            pdfStorage.updatePDF(matchingPDF);
            console.log("💾 Updated stored PDF with tax results");
          }
        } catch (storageError) {
          console.warn(
            "Failed to update stored PDF with tax results:",
            storageError,
          );
        }
      }

      // Scroll to top when results are ready
      scrollToTop();

      // Calculate refund/owing for the success message
      const refundAmount = payeWithheld - taxResult.totalTax;
      const isRefund = refundAmount > 0;
      const absoluteAmount = Math.abs(refundAmount);

      toast({
        title: "Calculation Complete! 🎉",
        description: isRefund
          ? `Great news! You're due a refund of R${absoluteAmount.toLocaleString()}`
          : `You owe R${absoluteAmount.toLocaleString()} in additional tax`,
        variant: "default",
      });

      console.log("🎯 Tax calculation process completed successfully");
    } catch (error) {
      console.error("❌ Tax calculation error:", error);

      // Enhanced error handling with specific messages
      let errorMessage =
        "There was an error calculating your tax. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Calculation Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Track error for debugging
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "tax_calculation_error", {
          error_message: errorMessage,
          extracted_data: JSON.stringify(extractedData),
        });
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const handleStartOver = () => {
    const endTracking = trackInteraction("start-over");
    setUploadStep("upload");
    setFile(null);
    setProgress({
      stage: "loading",
      progress: 0,
      message: "",
    });
    setExtractedData(null);
    setTaxResults(null);
    setIsCalculating(false);

    // Scroll to top when starting over
    scrollToTop();

    endTracking();
  };

  const handleEditData = (editedData: any) => {
    // Navigate to manual entry with pre-populated data
    navigate("/manual-entry", {
      state: {
        initialData: {
          taxYear: extractedData?.taxYear || "2024",
          grossIncome:
            editedData.grossIncome || extractedData?.grossRemuneration || 0,
          taxPaid: editedData.taxPaid || extractedData?.payeWithheld || 0,
          retirementContrib:
            editedData.retirementContrib || extractedData?.retirementFund || 0,
          medicalContrib:
            editedData.medicalContrib || extractedData?.medicalScheme || 0,
          medicalCredits:
            editedData.medicalCredits || extractedData?.medicalCredits || 0,
          uifContrib: editedData.uifContrib || extractedData?.uifContrib || 0,
          travelAllowance:
            editedData.travelAllowance || extractedData?.travelAllowance || 0,
        },
      },
    });

    toast({
      title: "Redirected to Manual Entry",
      description: "Your data has been pre-populated for further editing.",
    });
  };

  const handleToggleEdit = () => {
    if (!isEditingData && extractedData) {
      // Initialize edited values with current extracted data
      setEditedValues({
        grossRemuneration: extractedData.grossRemuneration,
        payeWithheld: extractedData.payeWithheld,
        uifContrib: extractedData.uifContrib,
        retirementFund: extractedData.retirementFund,
        medicalScheme: extractedData.medicalScheme,
        travelAllowance: extractedData.travelAllowance,
      });
    }
    setIsEditingData(!isEditingData);
  };

  const handleFieldChange = (field: keyof IRP5Data, value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, "")) || 0;
    setEditedValues((prev) => ({
      ...prev,
      [field]: numericValue,
    }));
  };

  const handleSaveChanges = () => {
    if (extractedData && editedValues) {
      // Update extracted data with edited values
      const updatedData = {
        ...extractedData,
        ...editedValues,
      };
      setExtractedData(updatedData);
      setIsEditingData(false);
      setEditedValues({});

      toast({
        title: "Changes Saved",
        description: "Your data has been updated successfully.",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingData(false);
    setEditedValues({});
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/[^\d.]/g, "")) || 0;
  };

  const handleDownloadReport = async (format: "pdf" | "csv" | "excel") => {
    if (!extractedData) {
      toast({
        title: "No data available",
        description: "Please process a document first",
        variant: "destructive",
      });
      return;
    }

    // Validate and sanitize input data for tax calculation
    const grossIncome = Number(extractedData.grossRemuneration) || 0;
    const retirementContrib = Number(extractedData.retirementFund) || 0;
    const medicalContrib = Number(extractedData.medicalScheme) || 0;
    const payeWithheld = Number(extractedData.payeWithheld) || 0;
    const uifContrib = Number(extractedData.uifContrib) || 0; // Keep for display purposes
    const medicalCredits = Number(extractedData.medicalCredits) || 0;

    // Ensure all values are valid numbers
    if (
      isNaN(grossIncome) ||
      isNaN(retirementContrib) ||
      isNaN(medicalContrib) ||
      isNaN(payeWithheld)
    ) {
      toast({
        title: "Invalid Data",
        description:
          "Some financial data appears to be invalid. Please check your document.",
        variant: "destructive",
      });
      return;
    }

    // Use enhanced tax calculation with refund calculation
    const taxResult = calculateTaxFromIRP5(extractedData);

    const refundAmount = taxResult.isRefund ? taxResult.refundAmount : 0;
    const isRefund = taxResult.isRefund;

    const reportData = {
      // Personal Information
      documentName: file?.name || "IRP5_Document",
      processingDate: new Date().toLocaleDateString("en-ZA"),
      processingTime: new Date().toLocaleTimeString("en-ZA"),

      // Financial Data (using validated values)
      grossRemuneration: grossIncome,
      payeWithheld: payeWithheld,
      uifContrib: Number(extractedData.uifContrib) || 0,
      retirementFund: retirementContrib,
      medicalScheme: medicalContrib,
      medicalCredits: medicalCredits,
      travelAllowance: Number(extractedData.travelAllowance) || 0,

      // Tax Calculations
      taxableIncome: taxResult.taxableIncome,
      incomeTax: taxResult.incomeTax,
      primaryRebate: taxResult.primaryRebate,
      totalTaxDue: taxResult.totalTax,

      // Final Result
      refundOrOwing: refundAmount,
      isRefund: isRefund,
      absoluteAmount: Math.abs(refundAmount),
    };

    try {
      switch (format) {
        case "pdf":
          await generatePDFReport(reportData);
          break;
        case "csv":
          generateCSVReport(reportData);
          break;
        case "excel":
          generateExcelReport(reportData);
          break;
      }

      toast({
        title: `${format.toUpperCase()} Downloaded!`,
        description: `Your tax report has been downloaded as ${format.toUpperCase()}`,
        variant: "default",
      });
    } catch (error) {
      console.error(`Error generating ${format} report:`, error);

      if (format === "pdf") {
        // For PDF failures, provide specific guidance
        toast({
          title: "PDF Generation Failed",
          description:
            "PDF generation failed. You can try downloading as HTML format instead using the download options above.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Download failed",
          description: `Failed to generate ${format.toUpperCase()} report. Please try again.`,
          variant: "destructive",
        });
      }
    }
  };

  const generatePDFReport = async (data: any) => {
    try {
      console.log("🚀 Starting comprehensive PDF report generation...");

      // Create comprehensive report data with CORRECT property names
      const input = {
        grossIncome: data.grossRemuneration,
        retirementContrib: data.retirementFund || 0, // Fixed: was retirementFunding
        medicalContrib: data.medicalScheme || 0, // Fixed: was medicalAidContributions
        medicalCredits: data.medicalCredits || 0,
        uifContrib: data.uifContrib || 0, // Fixed: was uifContributions
        age: 35, // Default age
      };

      console.log("📊 Input data for tax calculation:", input);

      // Validate input data before calling calculateTax
      if (!input.grossIncome || input.grossIncome <= 0) {
        throw new Error("Invalid gross income value");
      }

      if (
        isNaN(input.grossIncome) ||
        isNaN(input.retirementContrib) ||
        isNaN(input.medicalContrib) ||
        isNaN(input.medicalCredits)
      ) {
        throw new Error("Invalid numeric values in tax calculation input");
      }

      const result = calculateTaxFromIRP5(data);

      // Generate audit steps
      const auditSteps: AuditStep[] = [
        {
          step: 1,
          title: "Gross Remuneration",
          calculation: `R${input.grossIncome.toLocaleString()}`,
          result: input.grossIncome,
          formula: "Total income from employment (Code 3601)",
          sarsReference: "IRP5 Code 3601 - Gross Remuneration",
          verified: true,
          notes: "This is your total salary before any deductions",
        },
        {
          step: 2,
          title: "Retirement Fund Deduction",
          calculation: `R${input.retirementContrib.toLocaleString()}`,
          result: input.retirementContrib,
          formula: "Retirement fund contributions (max 27.5% of gross income)",
          sarsReference: "Section 11F - Retirement Fund Contributions",
          verified: true,
        },
        {
          step: 3,
          title: "Taxable Income",
          calculation: `R${input.grossIncome.toLocaleString()} - R${input.retirementContrib.toLocaleString()}`,
          result: result.taxableIncome,
          formula: "Gross Income - Allowable Deductions",
          sarsReference: "Income Tax Act Section 1",
          verified: true,
        },
        {
          step: 4,
          title: "Final Tax Liability",
          calculation: `Tax calculated using progressive brackets`,
          result: result.totalTax,
          formula: "Progressive tax calculation with rebates",
          sarsReference: "Income Tax Act - Tax Tables 2025/26",
          verified: true,
        },
      ];

      // Generate recommendations
      const recommendations: TaxRecommendation[] = [];
      const maxRetirement = Math.min(input.grossIncome * 0.275, 350000);
      if (input.retirementContrib < maxRetirement) {
        const additionalContrib = maxRetirement - input.retirementContrib;
        const potentialSaving = additionalContrib * (result.marginalRate / 100);

        recommendations.push({
          id: "retirement-optimization",
          category: "investment",
          title: "Maximize Retirement Fund Contributions",
          description: `You can contribute an additional R${additionalContrib.toLocaleString()} to your retirement fund.`,
          potentialSaving: potentialSaving,
          priority: "high",
          actionRequired: "Increase retirement fund contributions",
          deadline: "Before end of tax year",
        });
      }

      // Generate compliance checks
      const complianceChecks: ComplianceCheck[] = [
        {
          requirement: "Income Declaration Completeness",
          status: "compliant",
          description: "All required income sources have been declared",
          reference: "Income Tax Act Section 3",
        },
        {
          requirement: "Retirement Fund Contribution Limits",
          status:
            input.retirementContrib <= maxRetirement ? "compliant" : "warning",
          description: "Retirement contributions are within allowable limits",
          reference: "Section 11F",
        },
      ];

      const comprehensiveData: ComprehensiveReportData = {
        documentName: file?.name || "Tax Document",
        processingDate: new Date().toLocaleDateString(),
        processingTime: new Date().toLocaleTimeString(),
        taxYear: "2025/26",
        input,
        result,
        payeWithheld,
        refundOrOwing,
        isRefund: refundOrOwing > 0,
        auditSteps,
        recommendations,
        complianceChecks,
      };

      console.log("📊 Comprehensive data prepared:", comprehensiveData);

      // Generate the PDF using enhanced generator
      await EnhancedPDFGenerator.generateComprehensiveReport(comprehensiveData);

      console.log("✅ PDF report generated successfully!");
    } catch (error) {
      console.error("❌ PDF generation failed:", error);

      // Provide specific error message to user
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      toast({
        title: "PDF Generation Failed",
        description: `Could not generate PDF report: ${errorMessage}. Please try again or contact support.`,
        variant: "destructive",
      });

      // Don't fallback to HTML automatically - let user decide
      throw error;
    }
  };

  const generateHTMLReport = (data: any) => {
    // Fallback HTML generation (existing code as backup)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Refund Report - Taxfy</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
          .result-box { background: ${data.isRefund ? "#dcfce7" : "#fee2e2"}; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
          .amount { font-size: 36px; font-weight: bold; color: ${data.isRefund ? "#16a34a" : "#dc2626"}; }
          .status { font-size: 18px; margin-top: 10px; }
          .section { margin: 30px 0; }
          .section h3 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .label { font-weight: 500; }
          .value { font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">���� Taxfy Tax Report</div>
          <p>Generated on ${data.processingDate} at ${data.processingTime}</p>
        </div>

        <div class="result-box">
          <div class="amount">R${data.absoluteAmount.toLocaleString()}</div>
          <div class="status">${data.isRefund ? "REFUND DUE" : "AMOUNT OWED"}</div>
        </div>

        <div class="section">
          <h3>📊 Income Information</h3>
          <div class="data-row"><span class="label">Gross Remuneration:</span><span class="value">R${data.grossRemuneration.toLocaleString()}</span></div>
          <div class="data-row"><span class="label">Retirement Fund Contributions:</span><span class="value">R${data.retirementFund.toLocaleString()}</span></div>
          <div class="data-row"><span class="label">UIF Contributions:</span><span class="value">R${data.uifContrib.toLocaleString()}</span></div>
          <div class="data-row"><span class="label">Medical Scheme Contributions:</span><span class="value">R${data.medicalScheme.toLocaleString()}</span></div>
          <div class="data-row"><span class="label">Travel Allowance:</span><span class="value">R${data.travelAllowance.toLocaleString()}</span></div>
        </div>

        <div class="section">
          <h3>🧮 Tax Calculations</h3>
          <div class="data-row"><span class="label">Taxable Income:</span><span class="value">R${data.taxableIncome.toLocaleString()}</span></div>
          <div class="data-row"><span class="label">Income Tax:</span><span class="value">R${data.incomeTax.toLocaleString()}</span></div>
          <div class="data-row"><span class="label">Primary Rebate:</span><span class="value">-R${data.primaryRebate.toLocaleString()}</span></div>
          <div class="data-row"><span class="label">Total Tax Due:</span><span class="value">R${data.totalTaxDue.toLocaleString()}</span></div>
          <div class="data-row"><span class="label">PAYE Withheld:</span><span class="value">R${data.payeWithheld.toLocaleString()}</span></div>
        </div>

        <div class="footer">
          <p>This report was generated by Taxfy - Your trusted tax refund calculator</p>
          <p>⚠️ This is an estimate. Please consult with SARS or a tax professional for official calculations.</p>
        </div>
      </body>
      </html>
    `;

    // Create and download HTML
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Taxfy_Tax_Report_${data.processingDate.replace(/\//g, "-")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSVReport = (data: any) => {
    // Helper function to properly escape CSV values
    const escapeCSVValue = (value: string | number): string => {
      const str = String(value);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (
        str.includes(",") ||
        str.includes('"') ||
        str.includes("\n") ||
        str.includes("\r")
      ) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Format currency consistently without locale-specific separators that break CSV
    const formatCurrencyForCSV = (amount: number): string => {
      return `R${amount.toFixed(2)}`;
    };

    const csvRows = [
      ["Taxfy Tax Report"],
      ["Generated on", `${data.processingDate} ${data.processingTime}`],
      ["Document", escapeCSVValue(data.documentName || "Tax Document")],
      [""],
      ["RESULT"],
      ["Status", data.isRefund ? "REFUND DUE" : "AMOUNT OWED"],
      ["Amount", formatCurrencyForCSV(data.absoluteAmount)],
      [""],
      ["INCOME INFORMATION"],
      ["Gross Remuneration", formatCurrencyForCSV(data.grossRemuneration)],
      [
        "Retirement Fund Contributions",
        formatCurrencyForCSV(data.retirementFund),
      ],
      ["UIF Contributions", formatCurrencyForCSV(data.uifContrib)],
      [
        "Medical Scheme Contributions",
        formatCurrencyForCSV(data.medicalScheme),
      ],
      ["Medical Credits", formatCurrencyForCSV(data.medicalCredits || 0)],
      ["Travel Allowance", formatCurrencyForCSV(data.travelAllowance)],
      [""],
      ["TAX CALCULATIONS"],
      ["Taxable Income", formatCurrencyForCSV(data.taxableIncome)],
      ["Income Tax", formatCurrencyForCSV(data.incomeTax)],
      ["Primary Rebate", formatCurrencyForCSV(data.primaryRebate)],
      ["Total Tax Due", formatCurrencyForCSV(data.totalTaxDue)],
      ["PAYE Withheld", formatCurrencyForCSV(data.payeWithheld)],
      [
        "Final Result",
        `${data.isRefund ? "REFUND" : "OWING"}: ${formatCurrencyForCSV(data.absoluteAmount)}`,
      ],
    ];

    // Properly format CSV with escaped values
    const csvContent = csvRows
      .map((row) => row.map((cell) => escapeCSVValue(cell)).join(","))
      .join("\r\n");

    // Add UTF-8 BOM for proper encoding support
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Taxfy_Tax_Report_${data.processingDate.replace(/\//g, "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExcelReport = (data: any) => {
    // Format currency for Excel (no locale formatting to avoid Excel parsing issues)
    const formatCurrencyForExcel = (amount: number): string => {
      return amount.toFixed(2);
    };

    // Create proper Excel XML format
    const excelXML = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
<Title>Taxfy Tax Report</Title>
<Author>Taxfy</Author>
<Created>${new Date().toISOString()}</Created>
</DocumentProperties>
<Styles>
<Style ss:ID="Header">
<Font ss:Bold="1" ss:Size="14"/>
</Style>
<Style ss:ID="Currency">
<NumberFormat ss:Format="R#,##0.00"/>
</Style>
<Style ss:ID="Section">
<Font ss:Bold="1" ss:Size="12"/>
<Interior ss:Color="#E6F3FF" ss:Pattern="Solid"/>
</Style>
</Styles>
<Worksheet ss:Name="Tax Report">
<Table>
<Row><Cell ss:StyleID="Header"><Data ss:Type="String">Taxfy Tax Report</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Generated on: ${data.processingDate} ${data.processingTime}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Document: ${data.documentName || "Tax Document"}</Data></Cell></Row>
<Row></Row>
<Row><Cell ss:StyleID="Section"><Data ss:Type="String">RESULT</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Status</Data></Cell><Cell><Data ss:Type="String">${data.isRefund ? "REFUND DUE" : "AMOUNT OWED"}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Amount</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.absoluteAmount)}</Data></Cell></Row>
<Row></Row>
<Row><Cell ss:StyleID="Section"><Data ss:Type="String">INCOME INFORMATION</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Gross Remuneration</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.grossRemuneration)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Retirement Fund Contributions</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.retirementFund)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">UIF Contributions</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.uifContrib)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Medical Scheme Contributions</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.medicalScheme)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Medical Credits</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.medicalCredits || 0)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Travel Allowance</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.travelAllowance)}</Data></Cell></Row>
<Row></Row>
<Row><Cell ss:StyleID="Section"><Data ss:Type="String">TAX CALCULATIONS</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Taxable Income</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.taxableIncome)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Income Tax</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.incomeTax)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Primary Rebate</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.primaryRebate)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Total Tax Due</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.totalTaxDue)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">PAYE Withheld</Data></Cell><Cell ss:StyleID="Currency"><Data ss:Type="Number">${formatCurrencyForExcel(data.payeWithheld)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">Final Result</Data></Cell><Cell><Data ss:Type="String">${data.isRefund ? "REFUND" : "OWING"}: R${formatCurrencyForExcel(data.absoluteAmount)}</Data></Cell></Row>
</Table>
</Worksheet>
</Workbook>`;

    const blob = new Blob([excelXML], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Taxfy_Tax_Report_${data.processingDate.replace(/\//g, "-")}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStepStatus = (step: number) => {
    const currentStepNumber =
      uploadStep === "upload"
        ? 1
        : uploadStep === "processing"
          ? 2
          : uploadStep === "complete"
            ? 3
            : 1;

    if (step < currentStepNumber) return "complete";
    if (step === currentStepNumber) return "current";
    return "pending";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-primary";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return "High confidence";
    if (confidence >= 60) return "Medium confidence";
    return "Low confidence";
  };

  // Authentication Check - Require login to upload
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center p-8">
            <CardHeader>
              <div className="mx-auto w-24 h-24 rounded-2xl flex items-center justify-center mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800"
                  alt="Taxfy Logo"
                  className="w-20 h-20 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardTitle className="text-2xl mb-2">Sign In Required</CardTitle>
              <CardDescription className="text-base">
                You need to sign in to upload and analyze your IRP5 documents.
                Create a free account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">
                  With a free account you get:
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload 2 IRP5 documents</li>
                  <li>• Basic tax calculations</li>
                  <li>• PDF tax summary</li>
                  <li>• SARS eFiling preview</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <AuthButton />
                <Button variant="outline" asChild>
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Upload limit check for authenticated users
  if (user && !canUploadIRP5()) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center p-8">
            <CardHeader>
              <div className="mx-auto w-24 h-24 rounded-2xl flex items-center justify-center mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800"
                  alt="Taxfy Logo"
                  className="w-20 h-20 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardTitle className="text-2xl mb-2">
                Upload Limit Reached
              </CardTitle>
              <CardDescription className="text-base">
                You've used {usage.irp5ProcessedThisMonth} of{" "}
                {planLimits.irp5Uploads} uploads this month. Upgrade your plan
                to upload more documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Upgrade benefits:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unlimited uploads</li>
                  <li>• Advanced reporting</li>
                  <li>• Priority support</li>
                  <li>• Export to Excel/CSV</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/pricing">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show results page */}
      {uploadStep === "results" && (
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <nav className="glass border-b border-border/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartOver}
                  className="hover:bg-muted rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Start Over</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <TaxResultsEnhanced
              taxData={extractedData || {}}
              taxResult={taxResults || {}}
              onOptimizationApplied={(optimizedData) => {
                // Create updated IRP5Data with optimized values
                const optimizedIRP5Data = {
                  ...extractedData!,
                  retirementFund: optimizedData.retirementContrib,
                  medicalScheme: optimizedData.medicalContrib,
                  travelAllowance: optimizedData.travelAllowance,
                  grossRemuneration: optimizedData.grossIncome,
                };

                // Update extracted data
                setExtractedData(optimizedIRP5Data);

                // Recalculate tax with optimized data using enhanced calculator
                const newTaxResult = calculateTaxFromIRP5(optimizedIRP5Data);

                setTaxResults(newTaxResult);
              }}
            />

            {/* SARS eFiling Preview */}
            {taxResults && extractedData && (
              <div role="region" aria-labelledby="sars-preview-title">
                <SarsEfilingPreview
                  taxData={{
                    grossRemuneration: extractedData.grossRemuneration || 0,
                    payeWithheld: extractedData.payeWithheld || 0,
                    taxableIncome: taxResults.taxableIncome || 0,
                    incomeTax: taxResults.incomeTax || 0,
                    totalTaxDue: taxResults.totalTax || 0,
                    refundDue: taxResults.refundAmount || 0,
                    isRefund: taxResults.isRefund,
                    retirementFund: extractedData.retirementFund || 0,
                    medicalScheme: extractedData.medicalScheme || 0,
                    medicalCredits: extractedData.medicalCredits || 0,
                    uifContrib: extractedData.uifContrib || 0,
                    travelAllowance: extractedData.travelAllowance || 0,
                  }}
                />
              </div>
            )}

            {/* Mobile App Features */}
            <div role="region" aria-labelledby="mobile-features-title">
              <MobileAppFeatures />
            </div>
          </div>
        </div>
      )}

      {/* Main upload flow */}
      {uploadStep !== "results" && (
        <div className="min-h-screen bg-background">
          {/* Enhanced Navigation */}
          <nav className="glass border-b border-border/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-muted rounded-xl transition-all duration-200"
                >
                  <Link to="/" className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Back to Home</span>
                    <span className="sm:hidden">Back</span>
                  </Link>
                </Button>

                {/* Step indicator in nav for mobile */}
                <div className="flex items-center space-x-2 sm:hidden">
                  <Badge variant="outline" className="rounded-full glass">
                    Step{" "}
                    {uploadStep === "upload"
                      ? "1"
                      : uploadStep === "processing"
                        ? "2"
                        : "3"}{" "}
                    of 3
                  </Badge>
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Enhanced Progress Indicator */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center justify-center space-x-6 sm:space-x-10 mb-8">
                {[1, 2, 3].map((step) => {
                  const status = getStepStatus(step);
                  return (
                    <div key={step} className="flex items-center">
                      <div
                        className={`
                        w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-sm sm:text-base font-semibold
                        transition-all duration-500 ease-out transform
                        ${
                          status === "complete"
                            ? "bg-green-500 text-white scale-110 shadow-lg"
                            : status === "current"
                              ? "bg-primary text-white scale-110 shadow-lg ring-4 ring-primary/20"
                              : "bg-muted text-muted-foreground scale-100"
                        }
                      `}
                      >
                        {status === "complete" ? (
                          <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                        ) : (
                          step
                        )}
                      </div>
                      {step < 3 && (
                        <div className="w-16 sm:w-20 h-1 bg-muted rounded-full mx-4">
                          <div
                            className={`
                            h-full rounded-full transition-all duration-500
                            ${status === "complete" ? "w-full bg-green-500" : "w-0 bg-transparent"}
                        `}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step labels */}
              <div className="flex justify-center space-x-6 sm:space-x-10">
                <div className="text-center">
                  <p className="text-sm font-medium">Upload</p>
                  <p className="text-xs text-muted-foreground">
                    Select your IRP5
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Process</p>
                  <p className="text-xs text-muted-foreground">Extract data</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Complete</p>
                  <p className="text-xs text-muted-foreground">
                    Review & calculate
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Step */}
            {uploadStep === "upload" && (
              <Card className="glass border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                    <img
                      src="/assets/logo-ta.png"
                      alt="Taxfy Logo"
                      className="w-16 h-16 object-contain animate-bounce-subtle"
                    />
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl">
                    Upload Your IRP5
                  </CardTitle>
                  <CardDescription className="text-base">
                    Drag and drop your PDF file or click to browse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`
                      relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300
                        ${
                          isDragOver
                            ? "border-primary bg-primary/5 scale-105"
                            : "border-border/50 hover:border-primary/30 hover:bg-muted/20"
                        }
                      `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="space-y-4">
                      <div className="mx-auto w-20 h-20 bg-muted rounded-2xl flex items-center justify-center">
                        <FileText className="w-10 h-10 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="text-lg font-medium mb-2">
                          {isDragOver
                            ? "Drop your file here"
                            : "Choose your IRP5 PDF file"}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Supports PDF files up to 10MB
                        </p>

                        <Button
                          size="lg"
                          className="rounded-xl"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadIcon className="w-5 h-5 mr-2" />
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Don't have your IRP5 PDF?
                    </p>
                    <Button variant="outline" asChild className="rounded-xl">
                      <Link to="/manual-entry">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Enter Data Manually
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Step */}
            {uploadStep === "processing" && (
              <Card className="glass">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                  <CardTitle className="text-2xl">
                    Processing Your IRP5
                  </CardTitle>
                  <CardDescription>
                    We're extracting your tax information from the PDF
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{progress.message}</span>
                      <span className="text-muted-foreground">
                        {Math.round(progress.progress)}%
                      </span>
                    </div>
                    <Progress
                      value={progress.progress}
                      className="h-3 rounded-full"
                    />
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>This usually takes 10-30 seconds</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Complete Step */}
            {uploadStep === "complete" && extractedData && (
              <div className="space-y-6">
                <Card className="glass border-green-500/20 bg-green-50/80 dark:bg-green-950/20">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                      Processing Complete!
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-300">
                      We've successfully extracted your tax information
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Extracted Information
                        </CardTitle>
                        <CardDescription>
                          Review the information we found in your IRP5
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${getConfidenceColor(confidence * 100)} text-white border-0`}
                        >
                          {getConfidenceText(confidence * 100)}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleToggleEdit}
                          className="rounded-xl"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          {isEditingData ? "Cancel" : "Edit"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Gross Remuneration
                          </label>
                          {isEditingData ? (
                            <Input
                              type="text"
                              value={`R${formatNumber(editedValues.grossRemuneration || extractedData.grossRemuneration)}`}
                              onChange={(e) =>
                                handleFieldChange(
                                  "grossRemuneration",
                                  e.target.value,
                                )
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              R{formatNumber(extractedData.grossRemuneration)}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            PAYE Withheld
                          </label>
                          {isEditingData ? (
                            <Input
                              type="text"
                              value={`R${formatNumber(editedValues.payeWithheld || extractedData.payeWithheld)}`}
                              onChange={(e) =>
                                handleFieldChange(
                                  "payeWithheld",
                                  e.target.value,
                                )
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              R{formatNumber(extractedData.payeWithheld)}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            UIF Contributions
                          </label>
                          {isEditingData ? (
                            <Input
                              type="text"
                              value={`R${formatNumber(editedValues.uifContrib || extractedData.uifContrib || 0)}`}
                              onChange={(e) =>
                                handleFieldChange("uifContrib", e.target.value)
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              R{formatNumber(extractedData.uifContrib || 0)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Retirement Fund Contributions
                          </label>
                          {isEditingData ? (
                            <Input
                              type="text"
                              value={`R${formatNumber(editedValues.retirementFund || extractedData.retirementFund || 0)}`}
                              onChange={(e) =>
                                handleFieldChange(
                                  "retirementFund",
                                  e.target.value,
                                )
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              R{formatNumber(extractedData.retirementFund || 0)}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Medical Scheme Contributions
                          </label>
                          {isEditingData ? (
                            <Input
                              type="text"
                              value={`R${formatNumber(editedValues.medicalScheme || extractedData.medicalScheme || 0)}`}
                              onChange={(e) =>
                                handleFieldChange(
                                  "medicalScheme",
                                  e.target.value,
                                )
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              R{formatNumber(extractedData.medicalScheme || 0)}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Travel Allowance
                          </label>
                          {isEditingData ? (
                            <Input
                              type="text"
                              value={`R${formatNumber(editedValues.travelAllowance || extractedData.travelAllowance || 0)}`}
                              onChange={(e) =>
                                handleFieldChange(
                                  "travelAllowance",
                                  e.target.value,
                                )
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              R
                              {formatNumber(extractedData.travelAllowance || 0)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {isEditingData && (
                      <div className="flex gap-2 mt-6 pt-6 border-t">
                        <Button
                          onClick={handleSaveChanges}
                          className="rounded-xl"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="rounded-xl"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    size="lg"
                    className="flex-1 rounded-xl h-14"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate My Tax
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleStartOver}
                    size="lg"
                    className="rounded-xl h-14"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Start Over
                  </Button>
                </div>
              </div>
            )}

            {/* Error Step */}
            {uploadStep === "error" && (
              <Card className="glass border-red-200 bg-red-50/50">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <CardTitle className="text-2xl text-red-700">
                    Processing Failed
                  </CardTitle>
                  <CardDescription>
                    We couldn't process your PDF file
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-red-100 rounded-xl border border-red-200">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleStartOver}
                      size="lg"
                      className="flex-1 rounded-xl"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Try Again
                    </Button>

                    <Button
                      variant="outline"
                      asChild
                      size="lg"
                      className="flex-1 rounded-xl"
                    >
                      <Link to="/manual-entry">
                        <Edit3 className="w-5 h-5 mr-2" />
                        Manual Entry
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Custom Notifications */}
      <CustomNotificationManager toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Upload;
