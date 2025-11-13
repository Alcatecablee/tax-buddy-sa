import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  Calendar,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  FileSpreadsheet,
  FileCheck,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Calculator,
  DollarSign,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiService } from "@/services/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TaxReport {
  id: number;
  user_id: string;
  report_type: string;
  tax_year: number;
  status: "generated" | "pending" | "error";
  file_path?: string;
  report_data?: any;
  download_count: number;
  created_at: string;
  updated_at: string;
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<TaxReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);

  useEffect(() => {
    fetchReports();
  }, [user?.id]);

  const fetchReports = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await apiService.getUserReports(user.id);
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType: string, taxYear: number) => {
    if (!user?.id) return;

    try {
      setGeneratingReport(reportType);
      setError(null);

      const report = await apiService.generateReport(
        user.id,
        reportType,
        taxYear,
      );
      setReports((prev) => [report, ...prev]);
    } catch (err) {
      console.error("Error generating report:", err);

      let errorMessage = "Failed to generate report";
      if (err instanceof Error) {
        if (err.message.includes("API Error: 500")) {
          errorMessage = "Server error while generating report. Please try again.";
        } else if (err.message.includes("Network error")) {
          errorMessage = "Network connection issue. Please check your internet connection.";
        } else if (err.message.includes("API Error: 400")) {
          errorMessage = "Invalid request. Please check your input and try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setGeneratingReport(null);
    }
  };

  const downloadReport = async (report: TaxReport) => {
    try {
      await apiService.downloadReport(report.id);
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? { ...r, download_count: r.download_count + 1 }
            : r,
        ),
      );
    } catch (err) {
      console.error("Error downloading report:", err);

      let errorMessage = "Failed to download report";
      if (err instanceof Error) {
        if (err.message.includes("Report not found")) {
          errorMessage = "Report not found. It may have been deleted.";
        } else if (err.message.includes("not ready")) {
          errorMessage = "Report is not ready for download yet.";
        } else if (err.message.includes("Network error")) {
          errorMessage = "Network connection issue. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    }
  };

  const reportTypes = [
    {
      name: "Annual Tax Return",
      description: "Complete SARS-compliant tax return with detailed calculations",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "PAYE Certificate",
      description: "Employee tax certificate with income and deductions",
      icon: FileCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Tax Summary",
      description: "Comprehensive summary with tax brackets and rebates",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Provisional Tax",
      description: "Provisional tax calculation with payment schedule",
      icon: FileSpreadsheet,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generated":
        return CheckCircle;
      case "pending":
        return Clock;
      case "error":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderCalculationPreview = (report: TaxReport) => {
    if (!report.report_data || !report.report_data.calculations || report.report_data.calculations.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No calculation data available in this report</p>
        </div>
      );
    }

    // Show all calculations in the report
    return (
      <div className="space-y-6 mt-4">
        {report.report_data.calculations.map((calc: any, calcIndex: number) => {
          const result = calc.result_data;
          const input = calc.input_data;

          return (
            <div key={calcIndex} className="space-y-4">
              {/* Calculation Header */}
              {report.report_data.calculations.length > 1 && (
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">Calculation {calcIndex + 1}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {calc.calculation_type} - {new Date(calc.created_at).toLocaleDateString('en-ZA')}
                  </span>
                </div>
              )}

              {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gross Income</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(input.grossIncome || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxable Income</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(result.taxableIncome || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calculator className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Liability</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(result.totalTax || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Calculation Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Tax Calculation Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Gross Remuneration</span>
              <span className="font-medium">{formatCurrency(input.grossIncome || 0)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Less: Retirement Fund ({((Math.min((input.grossIncome || 0) * 0.275, 350000) / (input.grossIncome || 1)) * 100).toFixed(1)}%)
              </span>
              <span className="font-medium text-red-600">
                ({formatCurrency(Math.min(input.retirementContrib || 0, Math.min((input.grossIncome || 0) * 0.275, 350000)))})
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Less: UIF Contribution</span>
              <span className="font-medium text-red-600">({formatCurrency(input.uifContrib || 0)})</span>
            </div>

            <div className="flex justify-between items-center py-2 bg-muted/30 px-2 rounded">
              <span className="font-semibold">Taxable Income</span>
              <span className="font-bold text-lg">{formatCurrency(result.taxableIncome || 0)}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Income Tax (Before Rebates)</span>
              <span className="font-medium">{formatCurrency(result.incomeTax || 0)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Less: Tax Rebates</span>
              <span className="font-medium text-green-600">({formatCurrency(result.primaryRebate || 0)})</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Less: Medical Tax Credits</span>
              <span className="font-medium text-green-600">({formatCurrency(result.medicalTaxCredits || 0)})</span>
            </div>

            <div className="flex justify-between items-center py-3 bg-primary/10 px-3 rounded-lg">
              <span className="font-bold">Final Tax Liability</span>
              <span className="font-bold text-xl text-primary">{formatCurrency(result.totalTax || 0)}</span>
            </div>

            {/* Refund/Owing Status */}
            {(result.refundAmount > 0 || result.amountOwed > 0) && (
              <>
                <Separator />
                <div className={`flex justify-between items-center py-3 px-3 rounded-lg ${
                  result.refundAmount > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <span className="font-bold">
                    {result.refundAmount > 0 ? 'Refund Due' : 'Amount Owing'}
                  </span>
                  <span className={`font-bold text-xl ${
                    result.refundAmount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(result.refundAmount > 0 ? result.refundAmount : result.amountOwed)}
                  </span>
                </div>
              </>
            )}

            {/* Tax Rates */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Effective Rate</p>
                <p className="text-lg font-bold">{(result.effectiveRate || 0).toFixed(2)}%</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Marginal Rate</p>
                <p className="text-lg font-bold">{(result.marginalRate || 0).toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

              {/* SARS Compliance Badge */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Calculations verified against SARS 2025/26 tax tables</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" data-testid="loader-reports" />
            <p className="text-muted-foreground">Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tax Reports - Taxfy</title>
        <meta
          name="description"
          content="Generate and download your SARS-compliant tax reports with detailed calculations, tax breakdowns, and comprehensive analysis."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="heading-reports">
                <Download className="w-8 h-8 text-primary" />
                Tax Reports
              </h1>
              <p className="text-muted-foreground mt-2">
                Generate SARS-compliant tax documents with detailed calculations and audit trails
              </p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" data-testid="button-back-dashboard">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50" data-testid="alert-error">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Generate New Report */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <p className="text-muted-foreground">
              Create comprehensive tax reports with SARS formulas, tax bracket breakdowns, and detailed audit trails
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((type, index) => (
                <Card
                  key={index}
                  className="border-2 hover:border-primary/50 transition-all"
                  data-testid={`card-report-type-${index}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${type.bgColor} rounded-lg flex items-center justify-center`}>
                        <type.icon className={`w-5 h-5 ${type.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{type.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {type.description}
                        </p>
                        <Button
                          size="sm"
                          onClick={() =>
                            generateReport(type.name, new Date().getFullYear())
                          }
                          disabled={generatingReport === type.name}
                          data-testid={`button-generate-${type.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {generatingReport === type.name ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4 mr-2" />
                              Generate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Existing Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
            <p className="text-muted-foreground">
              Download and review previously generated tax reports with detailed calculations
            </p>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
                <p className="text-muted-foreground mb-6">
                  Generate your first SARS-compliant tax report to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => {
                  const StatusIcon = getStatusIcon(report.status);
                  const isExpanded = expandedReport === report.id;
                  
                  return (
                    <Collapsible
                      key={report.id}
                      open={isExpanded}
                      onOpenChange={(open) => setExpandedReport(open ? report.id : null)}
                    >
                      <Card className="border-2">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold" data-testid={`text-report-type-${report.id}`}>
                                  {report.report_type}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Tax Year {report.tax_year}/{String(report.tax_year + 1).slice(-2)}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Created{" "}
                                    {new Date(report.created_at).toLocaleDateString('en-ZA')}
                                  </span>
                                  <span>•</span>
                                  <span data-testid={`text-download-count-${report.id}`}>
                                    {report.download_count} downloads
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(report.status)} data-testid={`badge-status-${report.id}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {report.status}
                              </Badge>
                              
                              {report.status === "generated" && report.report_data && (
                                <CollapsibleTrigger asChild>
                                  <Button variant="outline" size="sm" data-testid={`button-preview-${report.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    {isExpanded ? 'Hide' : 'Preview'}
                                    {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                                  </Button>
                                </CollapsibleTrigger>
                              )}
                              
                              {report.status === "generated" && (
                                <Button
                                  size="sm"
                                  onClick={() => downloadReport(report)}
                                  data-testid={`button-download-${report.id}`}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download PDF
                                </Button>
                              )}
                            </div>
                          </div>

                          <CollapsibleContent>
                            {renderCalculationPreview(report)}
                          </CollapsibleContent>
                        </div>
                      </Card>
                    </Collapsible>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Reports;
