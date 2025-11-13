import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Download,
  Share2,
  RotateCcw,
  Calculator,
  PieChart,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  UserPlus,
  Lock,
  Crown,
  FileSpreadsheet,
  Shield,
  Loader2,
  Upload,
  BarChart3,
  Zap,
  Star,
  Mail,
  Printer,
  Eye,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Percent,
  Calendar,
  Building,
  User,
  CreditCard,
  Clock,
  Target,
  Award,
  Briefcase,
  Home,
  Car,
  Heart,
  GraduationCap,
  Banknote,
  Receipt,
  FileCheck,
  Lightbulb,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  TaxCalculationResult,
  calculateTax,
  type TaxCalculationInput,
} from "@/lib/taxCalculator";
import { Link } from "react-router-dom";
import {
  UsageWarning,
  LimitedTimeOffer,
  SocialProofBanner,
  UrgencyCountdown,
  FeatureTease,
} from "./FOMOElements";
import { CalculationAudit } from "@/components/CalculationAudit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomNotificationManager } from "@/components/ui/custom-notification";
import { IRP5Data, TaxBracket, DeductionCategory } from "@/types/tax";
import { generatePDFReport } from "@/lib/pdfGenerator";
import { SarsEfilingExporter } from "@/lib/sarsEfilingExporter";
import { useFeatureRestrictions } from "@/hooks/useFeatureRestrictions";
import { formatCurrency } from "@/lib/utils";
import { SarsEfilingPreview } from "./SarsEfilingPreview";
import { SarsEfilingGuide } from "./SarsEfilingGuide";

interface TaxResultsProps {
  data: {
    grossIncome: number;
    taxPaid: number;
    retirementContrib?: number;
    medicalContrib?: number;
    medicalCredits?: number;
    uifContrib?: number;
    travelAllowance?: number;
    taxResult: TaxCalculationResult;
    processingDate?: string;
    confidence?: number;
    // Add missing properties for compatibility
    grossRemuneration?: number;
    payeWithheld?: number;
    retirementFund?: number;
    medicalScheme?: number;
    taxYear?: string;
  };
  isLoading?: boolean;
  onReset?: () => void;
  onDownloadReport?: (format: "pdf" | "csv" | "excel") => void;
  onEditData?: (editedData: any) => void;
  showComparison?: boolean;
  comparisonData?: any;
}

// Celebration Animation Component
const CelebrationAnimation: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      rotation: number;
      delay: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    if (isActive) {
      // Generate confetti particles that fall from top
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random horizontal position
        y: -10, // Start above the screen
        rotation: Math.random() * 360,
        delay: Math.random() * 3, // Stagger the start times
        duration: 3 + Math.random() * 2, // Random fall duration between 3-5 seconds
      }));
      setParticles(newParticles);

      // Clear particles after animation completes
      const timer = setTimeout(() => setParticles([]), 8000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Falling confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `fallDown ${particle.duration}s linear ${particle.delay}s forwards`,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full"></div>
        </div>
      ))}

      {/* Falling party poppers and emojis */}
      <div
        className="absolute text-3xl"
        style={{
          left: "10%",
          animation: "fallDown 4s linear 0.5s forwards",
          top: "-50px",
        }}
      >
        🎊
      </div>
      <div
        className="absolute text-3xl"
        style={{
          left: "20%",
          animation: "fallDown 5s linear 1s forwards",
          top: "-50px",
        }}
      >
        🎉
      </div>
      <div
        className="absolute text-2xl"
        style={{
          left: "70%",
          animation: "fallDown 4.5s linear 1.5s forwards",
          top: "-50px",
        }}
      >
        🎊
      </div>
      <div
        className="absolute text-3xl"
        style={{
          left: "80%",
          animation: "fallDown 3.5s linear 0.8s forwards",
          top: "-50px",
        }}
      >
        🎉
      </div>
      <div
        className="absolute text-2xl"
        style={{
          left: "50%",
          animation: "fallDown 4.2s linear 2s forwards",
          top: "-50px",
        }}
      >
        🎊
      </div>

      {/* Falling money emojis */}
      <div
        className="absolute text-2xl"
        style={{
          left: "30%",
          animation: "fallDown 4.8s linear 1.2s forwards",
          top: "-50px",
        }}
      >
        💰
      </div>
      <div
        className="absolute text-2xl"
        style={{
          left: "60%",
          animation: "fallDown 3.8s linear 1.8s forwards",
          top: "-50px",
        }}
      >
        💸
      </div>
      <div
        className="absolute text-2xl"
        style={{
          left: "40%",
          animation: "fallDown 4.3s linear 2.2s forwards",
          top: "-50px",
        }}
      >
        💰
      </div>

      {/* Falling sparkles */}
      <div
        className="absolute text-xl"
        style={{
          left: "15%",
          animation: "fallDown 5.2s linear 2.5s forwards",
          top: "-50px",
        }}
      >
        ✨
      </div>
      <div
        className="absolute text-xl"
        style={{
          left: "85%",
          animation: "fallDown 4.7s linear 3s forwards",
          top: "-50px",
        }}
      >
        ✨
      </div>
    </div>
  );
};

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

const TaxResults: React.FC<TaxResultsProps> = ({
  data,
  isLoading = false,
  onReset,
  onDownloadReport,
  onEditData,
  showComparison = false,
  comparisonData,
}) => {
  const { subscription, usage } = useSubscription();
  const { toast, toasts, removeToast } = useCustomToast();
  const { checkExportAccess } = useFeatureRestrictions();

  // Remove authentication-related code
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editedData, setEditedData] = useState(data);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { trackInteraction, logPerformanceSummary } =
    usePerformanceMonitor("TaxResults");

  // FOMO state
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [viewStartTime] = useState(Date.now());
  const [hasTriggeredSignupPrompt, setHasTriggeredSignupPrompt] =
    useState(false);

  // Missing state variables
  const [recalculatedResult, setRecalculatedResult] =
    useState<TaxCalculationResult | null>(null);
  const [animationStage, setAnimationStage] = useState(0);

  // Missing functions
  const trackReportGeneration = () => {
    trackInteraction("report_generated");
  };

  // Initialize edited data when component mounts or data changes
  useEffect(() => {
    if (data) {
      setEditedData({
        ...data,
        // Ensure all required fields are present
        grossRemuneration: data.grossRemuneration || 0,
        payeWithheld: data.payeWithheld || 0,
        uifContrib: data.uifContrib || 0,
        retirementFund: data.retirementFund || 0,
        medicalScheme: data.medicalScheme || 0,
        travelAllowance: data.travelAllowance || 0,
        medicalCredits: data.medicalCredits || 0,
        taxYear: data.taxYear || new Date().getFullYear().toString(),
      });
    }
  }, [data]);

  // FOMO Effects - show save prompt for all users since we're guest-only now
  useEffect(() => {
    // Show save prompt after 10 seconds
    const timer = setTimeout(() => {
      setShowSavePrompt(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleEditChange = (field: string, value: string) => {
    const numericValue = parseNumber(value);
    setEditedData((prev) => ({
      ...prev,
      [field]: numericValue,
    }));
  };

  const handleSaveChanges = () => {
    try {
      // Recalculate tax with new values - FIXED TO INCLUDE UIF ✅
      const newTaxResult = calculateTax({
        grossIncome: editedData.grossIncome,
        retirementContrib: editedData.retirementContrib || 0,
        medicalContrib: editedData.medicalContrib || 0,
        medicalCredits: editedData.medicalCredits || 0,
        uifContrib: editedData.uifContrib || 0, // CRITICAL FIX: Include UIF for proper taxable income calculation
        age: 35, // Default age
      });

      setRecalculatedResult(newTaxResult);
      setShowEditModal(false);

      toast({
        title: "Changes saved!",
        description: "Tax calculation has been updated with your changes.",
      });

      // Scroll to top to show updated results
      scrollToTop();
    } catch (error) {
      console.error("Error recalculating tax:", error);
      toast({
        title: "Calculation Error",
        description:
          "There was an error recalculating your tax. Please check your values.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    if (data) {
      setEditedData({
        ...data,
        // Ensure all required fields are present
        grossRemuneration: data.grossRemuneration || 0,
        payeWithheld: data.payeWithheld || 0,
        uifContrib: data.uifContrib || 0,
        retirementFund: data.retirementFund || 0,
        medicalScheme: data.medicalScheme || 0,
        travelAllowance: data.travelAllowance || 0,
        medicalCredits: data.medicalCredits || 0,
        taxYear: data.taxYear || new Date().getFullYear().toString(),
      });
    }
    setShowEditModal(false);
  };

  const handleManualEntry = () => {
    const manualData: IRP5Data = {
      grossRemuneration: data.grossRemuneration || data.grossIncome || 0,
      payeWithheld: data.payeWithheld || data.taxPaid || 0,
      uifContrib: data.uifContrib || 0,
      retirementFund: data.retirementFund || data.retirementContrib || 0,
      medicalScheme: data.medicalScheme || data.medicalContrib || 0,
      travelAllowance: data.travelAllowance || 0,
      medicalCredits: data.medicalCredits || 0,
      taxYear: data.taxYear || new Date().getFullYear().toString(),
      totalTax: data.taxPaid || 0,
      source: "manual_entry",
      uploadedAt: new Date().toISOString(),
    };

    // Navigate to manual entry with pre-filled data
    window.location.href = `/manual-entry?prefill=${encodeURIComponent(JSON.stringify(manualData))}`;
  };

  const handleEditData = () => {
    const editData = {
      grossIncome: data.grossRemuneration || data.grossIncome || 0,
      taxPaid: data.payeWithheld || data.taxPaid || 0,
      uifContrib: data.uifContrib || 0,
      retirementContrib: data.retirementFund || data.retirementContrib || 0,
      medicalContrib: data.medicalScheme || data.medicalContrib || 0,
      travelAllowance: data.travelAllowance || 0,
      medicalCredits: data.medicalCredits || 0,
    };

    // Use the callback prop if available, otherwise fallback to navigation
    if (onEditData) {
      onEditData(editData);
    } else {
      // Fallback: Navigate to manual entry with current data for editing
      const manualData: IRP5Data = {
        grossRemuneration: editData.grossIncome,
        payeWithheld: editData.taxPaid,
        uifContrib: editData.uifContrib,
        retirementFund: editData.retirementContrib,
        medicalScheme: editData.medicalContrib,
        travelAllowance: editData.travelAllowance,
        medicalCredits: editData.medicalCredits,
        taxYear: data.taxYear || new Date().getFullYear().toString(),
        totalTax: editData.taxPaid,
        source: "manual_entry",
        uploadedAt: new Date().toISOString(),
      };
      window.location.href = `/manual-entry?edit=${encodeURIComponent(JSON.stringify(manualData))}`;
    }
  };

  useEffect(() => {
    // Staggered animation stages
    const timer1 = setTimeout(() => setAnimationStage(1), 100);
    const timer2 = setTimeout(() => setAnimationStage(2), 300);
    const timer3 = setTimeout(() => setAnimationStage(3), 500);

    // Log performance summary after component loads
    const summaryTimer = setTimeout(() => {
      logPerformanceSummary();
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(summaryTimer);
    };
  }, [logPerformanceSummary]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <LoadingSkeleton variant="results" />
      </div>
    );
  }

  // Check if we have data
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="glass border-border/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-muted/10 border border-border/20">
                <Calculator className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Ready to Calculate</CardTitle>
            <CardDescription>
              Upload your IRP5 document and click "Calculate My Refund" to see
              your results.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onReset} className="rounded-xl">
              Upload Document
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate refund/owing amount using either recalculated or original data
  const currentTaxResult = recalculatedResult || data.taxResult;
  const currentData = editedData || data;
  const refundAmount = currentData.taxPaid - currentTaxResult.totalTax;
  const isRefund = refundAmount > 0;
  const absoluteAmount = Math.abs(refundAmount);

  // Calculate validation info
  const payeDifference = currentData.taxPaid - currentTaxResult.totalTax;
  const hasPayeMismatch = Math.abs(payeDifference) > 100; // Allow small rounding differences

  const handleShare = async () => {
    // Scroll to top when sharing
    scrollToTop();

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Tax Refund Calculation",
          text: `I calculated my tax refund with Taxfy and ${isRefund ? `I'm getting R${absoluteAmount.toLocaleString()} back!` : `I owe R${absoluteAmount.toLocaleString()}`}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        const shareText = `I calculated my tax refund with Taxfy and ${isRefund ? `I'm getting R${absoluteAmount.toLocaleString()} back!` : `I owe R${absoluteAmount.toLocaleString()}`} 🎉`;
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard!",
          description: "Share text has been copied to your clipboard.",
        });
      }

      trackReportGeneration();
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "Unable to share at this time. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (format: "pdf" | "csv" | "excel") => {
    onDownloadReport?.(format);
  };

  const handleSarsEfilingExport = async (
    format: "csv" | "excel" | "json" = "csv",
  ) => {
    if (!checkExportAccess("sars-efiling")) {
      return;
    }

    try {
      const input = {
        grossIncome: currentData.grossIncome,
        taxPaid: currentData.taxPaid,
        retirementContrib: currentData.retirementContrib || 0,
        medicalContrib: currentData.medicalContrib || 0,
        medicalCredits: currentData.medicalCredits || 0,
        travelAllowance: currentData.travelAllowance || 0,
        taxYear: currentData.taxYear || new Date().getFullYear().toString(),
      };

      // Extend currentTaxResult with refund information
      const resultWithRefund = {
        ...currentTaxResult,
        refund: absoluteAmount,
      };

      const validationErrors = SarsEfilingExporter.validateExportData(
        input,
        currentData.taxPaid,
        absoluteAmount,
      );
      if (validationErrors.length > 0) {
        toast({
          title: "Export Validation Failed",
          description: validationErrors.join(", "),
          variant: "destructive",
        });
        return;
      }

      SarsEfilingExporter.downloadSarsEfilingExport(
        input,
        currentTaxResult,
        currentData.taxPaid,
        absoluteAmount,
        format
      );

      toast({
        title: "SARS eFiling Export Ready",
        description: `Your ${format.toUpperCase()} file has been downloaded. Use this data to complete your SARS eFiling return.`,
      });
    } catch (error) {
      console.error("Error exporting SARS eFiling data:", error);
      toast({
        title: "Export Failed",
        description:
          "There was an error preparing your SARS eFiling export. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveToAccount = () => {
    toast({
      title: "Results Saved",
      description: "Your tax calculation has been saved to your account.",
    });
  };

  const handleDownloadForGuest = (format: "pdf" | "csv" | "excel") => {
    toast({
      title: "Account Required",
      description: `Create a free account to download ${format.toUpperCase()} reports.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Success Message */}
      <div
        className={`p-4 rounded-xl border ${isRefund ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${isRefund ? "bg-green-500" : "bg-red-500"}`}
          >
            {isRefund ? (
              <TrendingUp className="h-5 w-5 text-white" />
            ) : (
              <TrendingDown className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3
              className={`font-semibold ${isRefund ? "text-green-400" : "text-red-400"}`}
            >
              {isRefund
                ? "Good news! You're getting money back"
                : "You owe SARS money"}
            </h3>
            <p
              className={`text-2xl font-bold ${isRefund ? "text-green-400" : "text-red-400"}`}
            >
              SARS {isRefund ? "owes you" : "is owed"} R
              {absoluteAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Data Validation Results */}
      {hasPayeMismatch && (
        <Card className="bg-card/50 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              Data Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">
                    PAYE vs Tax Due Mismatch
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Large difference between PAYE withheld (R
                    {currentData.taxPaid.toLocaleString()}) and tax due (R
                    {currentTaxResult.totalTax.toLocaleString()}). This could
                    indicate timing differences or changes in circumstances.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current value: R{currentData.taxPaid.toLocaleString()} |
                    Expected: R{currentTaxResult.totalTax.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Result Display */}
      <div className="relative text-center p-8 bg-card/30 rounded-2xl border border-border/50 overflow-hidden">
        {/* Celebration Animation */}
        <CelebrationAnimation isActive={isRefund} />

        <div className="mb-6 relative z-10">
          {/* Enhanced emoji display for refunds */}
          {isRefund ? (
            <div className="relative">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              {/* Additional celebration emojis around the main one - gentle animations */}
              <div
                className="absolute -top-2 -left-8 text-3xl"
                style={{
                  animation: "fallDown 6s linear 0.5s forwards",
                  top: "-30px",
                }}
              >
                🎊
              </div>
              <div
                className="absolute -top-2 -right-8 text-3xl"
                style={{
                  animation: "fallDown 5.5s linear 1s forwards",
                  top: "-30px",
                }}
              >
                🎊
              </div>
              <div
                className="absolute top-8 -left-12 text-2xl"
                style={{
                  animation: "fallDown 7s linear 1.5s forwards",
                  top: "-40px",
                }}
              >
                💰
              </div>
              <div
                className="absolute top-8 -right-12 text-2xl"
                style={{
                  animation: "fallDown 6.5s linear 2s forwards",
                  top: "-40px",
                }}
              >
                💸
              </div>
              <div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xl"
                style={{
                  animation: "fallDown 5s linear 2.5s forwards",
                  top: "-35px",
                }}
              >
                ✨
              </div>
            </div>
          ) : (
            <div className="text-6xl mb-4 animate-pulse">😱</div>
          )}

          <div
            className={`text-6xl font-bold mb-4 transition-all duration-500 ${isRefund ? "text-green-400" : "text-red-400"}`}
          >
            R{absoluteAmount.toLocaleString()}
          </div>
          <p
            className={`text-lg transition-all duration-500 ${isRefund ? "text-green-300" : "text-muted-foreground"}`}
          >
            {isRefund
              ? "🎊 SARS owes you money! Time to celebrate! 🎊"
              : "You owe SARS money."}
          </p>

          {/* Extra celebration message for large refunds */}
          {isRefund && absoluteAmount > 10000 && (
            <p
              className="text-sm text-green-400 mt-2 animate-bounce"
              style={{ animationDelay: "3s" }}
            >
              🚀 That's a fantastic refund! 🚀
            </p>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="space-y-4">
        {/* Edit Controls */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Financial Summary</h3>
          <div className="flex gap-2">
            {!showEditModal ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                  className="rounded-lg"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Values
                </Button>
                {onReset && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditData}
                    className="rounded-lg"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Data
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="rounded-lg"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveChanges}
                  className="rounded-lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save & Recalculate
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showEditModal ? (
                <div className="space-y-2">
                  <Input
                    value={editedData?.grossIncome?.toLocaleString() || ""}
                    onChange={(e) =>
                      handleEditChange("grossIncome", e.target.value)
                    }
                    placeholder="Enter total salary"
                    className="text-xl font-bold"
                  />
                  <p className="text-xs text-muted-foreground">
                    Before any deductions
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    R{currentData.grossIncome.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Before any deductions
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Income SARS Will Tax
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R{currentTaxResult.taxableIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                What SARS actually taxes
              </p>
              {recalculatedResult && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Recalculated
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tax Already Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showEditModal ? (
                <div className="space-y-2">
                  <Input
                    value={editedData?.taxPaid?.toLocaleString() || ""}
                    onChange={(e) =>
                      handleEditChange("taxPaid", e.target.value)
                    }
                    placeholder="Enter tax paid"
                    className="text-xl font-bold"
                  />
                  <p className="text-xs text-muted-foreground">
                    Taken from your salary
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    R{currentData.taxPaid.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Taken from your salary
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Editable Fields */}
        {showEditModal && (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-card/30 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">
                  Retirement Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={editedData?.retirementContrib?.toLocaleString() || ""}
                  onChange={(e) =>
                    handleEditChange("retirementContrib", e.target.value)
                  }
                  placeholder="Enter retirement contributions"
                />
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">
                  Medical Aid Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={editedData?.medicalContrib?.toLocaleString() || ""}
                  onChange={(e) =>
                    handleEditChange("medicalContrib", e.target.value)
                  }
                  placeholder="Enter medical aid contributions"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* How We Got to Your Taxable Income */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            How We Got to Your Taxable Income
            {recalculatedResult && (
              <Badge variant="secondary" className="ml-2">
                Updated
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Salary</span>
            <span className="font-semibold">
              R{currentData.grossIncome.toLocaleString()}
            </span>
          </div>

          {(currentData.retirementContrib || 0) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Retirement Fund Contributions
              </span>
              <span className="text-green-400">
                -R{(currentData.retirementContrib || 0).toLocaleString()}
              </span>
            </div>
          )}

          {(currentData.medicalContrib || 0) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Medical Aid Contributions
              </span>
              <span className="text-green-400">
                -R{(currentData.medicalContrib || 0).toLocaleString()}
              </span>
            </div>
          )}

          <div className="border-t border-border/50 pt-4">
            <div className="flex justify-between items-center font-semibold">
              <span>Income SARS Will Tax</span>
              <span>R{currentTaxResult.taxableIncome.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Rates */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Tax Rates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Your Real Tax Rate</span>
            <span className="font-semibold">
              {currentTaxResult.effectiveRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tax Rate on Next Rand</span>
            <span className="font-semibold">
              {currentTaxResult.marginalRate.toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tax Breakdown */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Calculation Breakdown
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowBreakdown(!showBreakdown);
                scrollToTop();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              {showBreakdown ? (
                <>
                  Hide Details <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show Details <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {showBreakdown && (
          <CardContent className="space-y-6">
            {/* Tax Brackets */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                Tax Brackets Applied
              </h4>
              {currentTaxResult.taxBrackets.map((bracket, index) => {
                const bracketMax =
                  bracket.max === Infinity
                    ? data.grossIncome
                    : Math.min(bracket.max, data.grossIncome);
                const applicableIncome = Math.max(
                  0,
                  Math.min(
                    bracketMax - bracket.min,
                    Math.max(0, data.grossIncome - bracket.min),
                  ),
                );
                const bracketTax = applicableIncome * bracket.rate;

                if (applicableIncome <= 0) return null;

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {(bracket.rate * 100).toFixed(0)}% on R
                        {bracket.min.toLocaleString()} -{" "}
                        {bracket.max === Infinity
                          ? "R∞"
                          : `R${bracket.max.toLocaleString()}`}
                      </span>
                      <span className="font-medium">
                        R{bracketTax.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        bracket.max === Infinity
                          ? 100
                          : (applicableIncome / (bracket.max - bracket.min)) *
                            100
                      }
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>

            <Separator className="bg-border/50" />

            {/* Final Calculation */}
            <div className="space-y-3 bg-muted/10 p-4 rounded-lg border border-border/30">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Gross Tax Before Rebates
                </span>
                <span className="font-medium">
                  R{currentTaxResult.incomeTax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Less: Primary Rebate
                </span>
                <span className="text-green-400">
                  -R{currentTaxResult.primaryRebate.toLocaleString()}
                </span>
              </div>
              {currentTaxResult.medicalTaxCredits > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Less: Medical Tax Credits
                  </span>
                  <span className="text-green-400">
                    -R{currentTaxResult.medicalTaxCredits.toLocaleString()}
                  </span>
                </div>
              )}
              <Separator className="bg-border/50" />
              <div className="flex justify-between font-bold text-lg">
                <span>Net Tax Liability</span>
                <span>R{currentTaxResult.totalTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tax Already Paid (PAYE)
                </span>
                <span>R{currentData.taxPaid.toLocaleString()}</span>
              </div>
              <Separator className="bg-border/50" />
              <div
                className={`flex justify-between font-bold text-xl ${isRefund ? "text-green-400" : "text-red-400"}`}
              >
                <span>{isRefund ? "Refund Due" : "Amount Owed"}</span>
                <span>R{absoluteAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Calculation Audit */}
      <CalculationAudit
        input={{
          grossIncome: currentData.grossIncome,
          retirementContrib: currentData.retirementContrib || 0,
          medicalContrib: currentData.medicalContrib || 0,
          medicalCredits: currentData.medicalCredits || 0,
          uifContrib: currentData.uifContrib || 0,
          age: 35, // Default age, could be made configurable
        }}
        result={currentTaxResult}
        payeWithheld={currentData.taxPaid}
      />

      {/* Action Buttons */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Save Options
          </CardTitle>
          <CardDescription>
            Download your tax calculation results in various formats -
            completely free!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => handleDownload("pdf")}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 h-auto p-4 flex-col"
            >
              {isGeneratingPDF ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FileText className="h-6 w-6" />
              )}
              {isGeneratingPDF ? "Generating..." : "Save as PDF"}
              <span className="text-xs opacity-75">
                Enhanced report with logo
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSarsEfilingExport("csv")}
              className="flex items-center gap-2 h-auto p-4 flex-col"
            >
              <Upload className="h-6 w-6" />
              SARS eFiling Export
              <span className="text-xs opacity-75">Ready for SARS filing</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleDownload("excel")}
              className="flex items-center gap-2 h-auto p-4 flex-col"
            >
              <BarChart3 className="h-6 w-6" />
              Export to Excel
              <span className="text-xs opacity-75">Detailed spreadsheet</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleDownload("csv")}
              className="flex items-center gap-2 h-auto p-4 flex-col"
            >
              <FileText className="h-6 w-6" />
              Export to CSV
              <span className="text-xs opacity-75">Raw data format</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SARS eFiling Preview - Always rendered to preserve modal state */}
      <SarsEfilingPreview
        taxData={currentData && currentTaxResult ? {
          grossRemuneration: currentData.grossIncome,
          payeWithheld: currentData.taxPaid,
          taxableIncome: currentTaxResult.taxableIncome,
          incomeTax: currentTaxResult.incomeTax,
          totalTaxDue: currentTaxResult.totalTax,
          refundDue: absoluteAmount,
          isRefund: isRefund,
          retirementFund: currentData.retirementContrib,
          medicalScheme: currentData.medicalContrib,
          medicalCredits: currentData.medicalCredits || 0,
          uifContrib: currentData.uifContrib || 0,
          travelAllowance: currentData.travelAllowance || 0,
        } : {}}
      />

      {/* SARS eFiling Step-by-Step Guide */}
      <SarsEfilingGuide
        refundAmount={absoluteAmount}
        taxYear={currentData?.taxYear || new Date().getFullYear().toString()}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          onClick={() => {
            scrollToTop();
            onReset?.();
          }}
          className="rounded-xl border-border/50 hover:bg-muted/20"
          variant="outline"
          size="lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Calculate Another Return
        </Button>

        <Button
          onClick={handleManualEntry}
          className="rounded-xl bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Manual Entry Mode
        </Button>
      </div>

      {/* Custom Notification Manager */}
      <CustomNotificationManager toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default TaxResults;
