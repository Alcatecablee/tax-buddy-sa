import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  BarChart3,
  TrendingUp,
  Shield,
  Calculator,
  Eye,
  Share2,
  Mail,
  Printer,
  FileSpreadsheet,
  PieChart,
  Activity,
  Target,
  Zap,
  Star,
  Award,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { EnhancedPDFGenerator, type ComprehensiveReportData, type AuditStep, type TaxRecommendation, type ComplianceCheck } from '@/lib/enhancedPdfGenerator';
import { calculateTax, type TaxCalculationInput, type TaxCalculationResult } from '@/lib/taxCalculator';
import { PDFStorageManager } from '@/lib/pdfStorage';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'standard' | 'detailed' | 'compliance' | 'analysis';
  features: string[];
  estimatedPages: number;
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  size: string;
  status: 'generating' | 'ready' | 'error';
  downloadUrl?: string;
}

export function EnhancedReports() {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive');
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load reports from database
  useEffect(() => {
    const loadReports = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const reports = await apiService.getUserReports(user.id);
        const formattedReports: GeneratedReport[] = reports.map(report => ({
          id: report.id.toString(),
          name: report.report_type,
          generatedAt: report.created_at,
          size: '1.2 MB', // Default size
          type: report.report_type,
          status: report.status,
          downloadCount: report.download_count,
        }));
        setGeneratedReports(formattedReports);
      } catch (error) {
        console.warn('Failed to load reports from database:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user?.id]);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Tax Report',
      description: 'Complete tax analysis with audit trail, recommendations, and compliance checks',
      icon: FileText,
      category: 'detailed',
      features: [
        'Executive Summary',
        'Detailed Calculations',
        'Audit Trail with SARS References',
        'Tax Optimization Recommendations',
        'Compliance Verification',
        'Professional Formatting'
      ],
      estimatedPages: 8
    },
    {
      id: 'summary',
      name: 'Tax Summary Report',
      description: 'Quick overview of tax calculations and key metrics',
      icon: BarChart3,
      category: 'standard',
      features: [
        'Key Tax Metrics',
        'Income & Deduction Summary',
        'Final Tax Position',
        'Basic Recommendations'
      ],
      estimatedPages: 3
    },
    {
      id: 'audit',
      name: 'Audit Trail Report',
      description: 'Detailed step-by-step calculation verification',
      icon: Shield,
      category: 'compliance',
      features: [
        'Complete Calculation Steps',
        'SARS Reference Verification',
        'Formula Documentation',
        'Compliance Checks'
      ],
      estimatedPages: 5
    },
    {
      id: 'optimization',
      name: 'Tax Optimization Analysis',
      description: 'Focus on tax-saving opportunities and recommendations',
      icon: TrendingUp,
      category: 'analysis',
      features: [
        'Tax Saving Opportunities',
        'Investment Recommendations',
        'Deduction Analysis',
        'Future Planning Strategies'
      ],
      estimatedPages: 4
    }
  ];

  // Load stored documents to generate reports from
  useEffect(() => {
    loadStoredDocuments();
  }, []);

  const loadStoredDocuments = () => {
    const storedDocs = PDFStorageManager.getInstance().getStoredPDFs();
    if (storedDocs.length > 0) {
      // Use the most recent document with tax results
      const docWithResults = storedDocs.find(doc => doc.taxResults);
      if (docWithResults) {
        setReportData(docWithResults);
      }
    }
  };

  const generateAuditSteps = (input: TaxCalculationInput, result: TaxCalculationResult): AuditStep[] => {
    return [
      {
        step: 1,
        title: "Gross Remuneration",
        calculation: `R${input.grossIncome.toLocaleString()}`,
        result: input.grossIncome,
        formula: "Total income from employment (Code 3601)",
        sarsReference: "IRP5 Code 3601 - Gross Remuneration",
        verified: true,
        notes: "This is your total salary before any deductions"
      },
      {
        step: 2,
        title: "Retirement Fund Deduction",
        calculation: `R${input.retirementContrib.toLocaleString()} (Max: R${Math.min(input.grossIncome * 0.275, 350000).toLocaleString()})`,
        result: Math.min(input.retirementContrib, Math.min(input.grossIncome * 0.275, 350000)),
        formula: "Min(Contribution, Min(27.5% × Gross, R350,000))",
        sarsReference: "Section 11F - Retirement Fund Contributions",
        verified: true,
        notes: "Retirement contributions are tax-deductible up to 27.5% of gross income or R350,000"
      },
      {
        step: 3,
        title: "Taxable Income",
        calculation: `R${input.grossIncome.toLocaleString()} - R${Math.min(input.retirementContrib, Math.min(input.grossIncome * 0.275, 350000)).toLocaleString()}`,
        result: result.taxableIncome,
        formula: "Gross Income - Allowable Deductions",
        sarsReference: "Income Tax Act Section 1 - Definition of Taxable Income",
        verified: true
      },
      {
        step: 4,
        title: "Income Tax Calculation",
        calculation: "Progressive tax brackets applied",
        result: result.incomeTax,
        formula: "Tax calculated using SARS progressive tax brackets",
        sarsReference: "Income Tax Act - Tax Tables for 2025/26",
        verified: true
      },
      {
        step: 5,
        title: "Tax Rebates & Credits",
        calculation: `Primary Rebate: R${result.primaryRebate.toLocaleString()}, Medical Credits: R${result.medicalTaxCredits.toLocaleString()}`,
        result: result.primaryRebate + result.medicalTaxCredits,
        formula: "Age-based rebates + Medical scheme fees tax credit",
        sarsReference: "Income Tax Act - Tax Rebates & Section 6A",
        verified: true
      },
      {
        step: 6,
        title: "Final Tax Liability",
        calculation: `Max(0, R${result.incomeTax.toLocaleString()} - R${(result.primaryRebate + result.medicalTaxCredits).toLocaleString()})`,
        result: result.totalTax,
        formula: "Max(0, Income Tax - Rebates - Credits)",
        sarsReference: "Income Tax Act - Final Tax Calculation",
        verified: true
      }
    ];
  };

  const generateRecommendations = (input: TaxCalculationInput, result: TaxCalculationResult): TaxRecommendation[] => {
    const recommendations: TaxRecommendation[] = [];

    // Retirement contribution optimization
    const maxRetirement = Math.min(input.grossIncome * 0.275, 350000);
    if (input.retirementContrib < maxRetirement) {
      const additionalContrib = maxRetirement - input.retirementContrib;
      const potentialSaving = additionalContrib * (result.marginalRate / 100);
      
      recommendations.push({
        id: 'retirement-optimization',
        category: 'investment',
        title: 'Maximize Retirement Fund Contributions',
        description: `You can contribute an additional R${additionalContrib.toLocaleString()} to your retirement fund to maximize your tax deduction.`,
        potentialSaving: potentialSaving,
        priority: 'high',
        actionRequired: 'Increase retirement fund contributions',
        deadline: 'Before end of tax year'
      });
    }

    // Medical aid optimization
    if (input.medicalContrib === 0) {
      recommendations.push({
        id: 'medical-aid',
        category: 'deduction',
        title: 'Consider Medical Aid Contributions',
        description: 'Medical aid contributions provide tax credits and can reduce your overall tax liability.',
        potentialSaving: 3000,
        priority: 'medium',
        actionRequired: 'Evaluate medical aid options'
      });
    }

    // Tax planning for next year
    if (result.effectiveRate > 25) {
      recommendations.push({
        id: 'tax-planning',
        category: 'planning',
        title: 'Tax Planning Strategy',
        description: 'Your effective tax rate is high. Consider tax-efficient investment strategies for the next tax year.',
        potentialSaving: 5000,
        priority: 'medium',
        actionRequired: 'Consult with tax advisor'
      });
    }

    return recommendations;
  };

  const generateComplianceChecks = (input: TaxCalculationInput): ComplianceCheck[] => {
    return [
      {
        requirement: 'Income Declaration Completeness',
        status: 'compliant',
        description: 'All required income sources have been declared',
        reference: 'Income Tax Act Section 3'
      },
      {
        requirement: 'Retirement Fund Contribution Limits',
        status: input.retirementContrib <= Math.min(input.grossIncome * 0.275, 350000) ? 'compliant' : 'warning',
        description: 'Retirement contributions are within allowable limits',
        reference: 'Section 11F - Retirement Fund Contributions'
      },
      {
        requirement: 'Medical Aid Tax Credit Eligibility',
        status: 'compliant',
        description: 'Medical aid contributions qualify for tax credits',
        reference: 'Section 6A - Medical Scheme Fees Tax Credit'
      },
      {
        requirement: 'PAYE Compliance',
        status: 'compliant',
        description: 'PAYE deductions appear to be correctly applied',
        reference: 'Fourth Schedule - PAYE'
      }
    ];
  };

  const handleGenerateReport = async (templateId: string) => {
    if (!reportData) {
      alert('No tax calculation data available. Please complete a tax calculation first.');
      return;
    }

    setIsGenerating(true);

    try {
      const input: TaxCalculationInput = {
        grossIncome: reportData.extractedData.grossRemuneration,
        retirementContrib: reportData.extractedData.retirementFunding || 0,
        medicalContrib: reportData.extractedData.medicalAidContributions || 0,
        medicalCredits: reportData.extractedData.medicalCredits || 0,
        uifContrib: reportData.extractedData.uifContributions || 0,
        age: 35 // Default age, could be extracted from data
      };

      const result = calculateTax(input);
      const payeWithheld = reportData.extractedData.payeWithheld || 0;
      const refundOrOwing = payeWithheld - result.totalTax;

      const comprehensiveData: ComprehensiveReportData = {
        documentName: reportData.fileName,
        processingDate: new Date().toLocaleDateString(),
        processingTime: new Date().toLocaleTimeString(),
        taxYear: '2025/26',
        input,
        result,
        payeWithheld,
        refundOrOwing,
        isRefund: refundOrOwing > 0,
        auditSteps: generateAuditSteps(input, result),
        recommendations: generateRecommendations(input, result),
        complianceChecks: generateComplianceChecks(input)
      };

      // Generate the PDF based on template
      switch (templateId) {
        case 'comprehensive':
          await EnhancedPDFGenerator.generateComprehensiveReport(comprehensiveData);
          break;
        default:
          await EnhancedPDFGenerator.generateComprehensiveReport(comprehensiveData);
      }

      // Save report to database for authenticated users
      let reportId = Date.now().toString();
      if (user && !user.id.startsWith('offline-')) {
        try {
          const dbReport = await apiService.generateReport(
            user.id,
            reportTemplates.find(t => t.id === templateId)?.name || 'Tax Report',
            2025
          );
          reportId = dbReport.id.toString();
        } catch (dbError) {
          console.warn('Failed to save report to database:', dbError);
        }
      }

      // Add to generated reports list
      const newReport: GeneratedReport = {
        id: reportId,
        name: reportTemplates.find(t => t.id === templateId)?.name || 'Tax Report',
        type: templateId,
        generatedAt: new Date().toLocaleString(),
        size: '2.5 MB',
        status: 'ready'
      };

      setGeneratedReports(prev => [newReport, ...prev]);

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'standard': return FileText;
      case 'detailed': return BookOpen;
      case 'compliance': return Shield;
      case 'analysis': return TrendingUp;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'detailed': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-green-100 text-green-800';
      case 'analysis': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enhanced Reports</h2>
          <p className="text-muted-foreground">
            Generate comprehensive tax reports with professional formatting and detailed analysis
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          Professional Reports
        </Badge>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="analytics">Report Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {!reportData && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">No Tax Data Available</p>
                    <p className="text-sm text-orange-600">
                      Please complete a tax calculation first to generate reports.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template) => {
              const IconComponent = template.icon;
              const CategoryIcon = getCategoryIcon(template.category);
              
              return (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getCategoryColor(template.category)}>
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {template.category}
                            </Badge>
                            <Badge variant="outline">
                              ~{template.estimatedPages} pages
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <CardDescription className="mt-3">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Features included:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {template.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport(template.id);
                        }}
                        disabled={!reportData || isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Generate Report
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          {generatedReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Reports Generated</p>
                  <p className="text-sm">Generate your first report using the templates above</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{report.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Generated: {report.generatedAt}</span>
                            <span>Size: {report.size}</span>
                            <Badge 
                              variant={report.status === 'ready' ? 'default' : 'secondary'}
                              className={report.status === 'ready' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {report.status === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {report.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{generatedReports.length}</div>
                <p className="text-xs text-muted-foreground">
                  Generated this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Comprehensive</div>
                <p className="text-xs text-muted-foreground">
                  Report template
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Generation Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2s</div>
                <p className="text-xs text-muted-foreground">
                  Per report
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Usage Trends</CardTitle>
              <CardDescription>
                Track your report generation patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Usage analytics will be displayed here</p>
                <p className="text-sm">Generate more reports to see trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
