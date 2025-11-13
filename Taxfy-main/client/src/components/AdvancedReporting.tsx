import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Eye,
  Share2,
  Settings,
  Printer,
  Mail,
  PieChart,
  LineChart,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'compliance' | 'analytical';
  status: 'ready' | 'generating' | 'scheduled';
  generatedDate: string;
  fileSize: string;
  downloadUrl?: string;
  preview: ReportPreview;
}

interface ReportPreview {
  totalClients: number;
  totalRefunds: number;
  avgProcessingTime: number;
  successRate: number;
  topDeductions: Array<{ name: string; amount: number; frequency: number }>;
  monthlyTrends: Array<{ month: string; refunds: number; clients: number }>;
}

interface AdvancedReportingProps {
  className?: string;
  enabled?: boolean;
}

export function AdvancedReporting({ 
  className, 
  enabled = false 
}: AdvancedReportingProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample reports for demonstration
  useEffect(() => {
    if (enabled) {
      const sampleReports: Report[] = [
        {
          id: '1',
          name: 'Monthly Tax Summary - March 2024',
          type: 'summary',
          status: 'ready',
          generatedDate: '2024-03-15',
          fileSize: '2.4 MB',
          downloadUrl: '#',
          preview: {
            totalClients: 157,
            totalRefunds: 2850000,
            avgProcessingTime: 1.8,
            successRate: 96.2,
            topDeductions: [
              { name: 'Medical Aid Contributions', amount: 45000, frequency: 89 },
              { name: 'Retirement Annuity', amount: 38500, frequency: 76 },
              { name: 'Travel Allowance', amount: 23000, frequency: 45 }
            ],
            monthlyTrends: [
              { month: 'Jan', refunds: 2100000, clients: 134 },
              { month: 'Feb', refunds: 2400000, clients: 145 },
              { month: 'Mar', refunds: 2850000, clients: 157 }
            ]
          }
        },
        {
          id: '2',
          name: 'Compliance Audit Report Q1 2024',
          type: 'compliance',
          status: 'ready',
          generatedDate: '2024-03-10',
          fileSize: '5.1 MB',
          downloadUrl: '#',
          preview: {
            totalClients: 157,
            totalRefunds: 2850000,
            avgProcessingTime: 1.8,
            successRate: 98.7,
            topDeductions: [],
            monthlyTrends: []
          }
        },
        {
          id: '3',
          name: 'Client Performance Analytics',
          type: 'analytical',
          status: 'generating',
          generatedDate: '2024-03-15',
          fileSize: 'Generating...',
          preview: {
            totalClients: 157,
            totalRefunds: 2850000,
            avgProcessingTime: 1.8,
            successRate: 96.2,
            topDeductions: [],
            monthlyTrends: []
          }
        }
      ];
      setReports(sampleReports);
    }
  }, [enabled]);

  const reportTypes = [
    { id: 'summary', name: 'Tax Summary Reports', icon: BarChart3 },
    { id: 'detailed', name: 'Detailed Client Reports', icon: FileText },
    { id: 'compliance', name: 'Compliance Reports', icon: Target },
    { id: 'analytical', name: 'Analytics & Insights', icon: PieChart }
  ];

  const dateRanges = [
    { id: 'last-7-days', name: 'Last 7 days' },
    { id: 'last-30-days', name: 'Last 30 days' },
    { id: 'last-3-months', name: 'Last 3 months' },
    { id: 'last-year', name: 'Last year' },
    { id: 'custom', name: 'Custom range' }
  ];

  const generateReport = (type: string) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
        type: type as Report['type'],
        status: 'ready',
        generatedDate: new Date().toISOString().split('T')[0],
        fileSize: '3.2 MB',
        downloadUrl: '#',
        preview: {
          totalClients: 157,
          totalRefunds: 2850000,
          avgProcessingTime: 1.8,
          successRate: 96.2,
          topDeductions: [
            { name: 'Medical Aid Contributions', amount: 45000, frequency: 89 },
            { name: 'Retirement Annuity', amount: 38500, frequency: 76 }
          ],
          monthlyTrends: [
            { month: 'Mar', refunds: 2850000, clients: 157 }
          ]
        }
      };
      
      setReports([newReport, ...reports]);
      setIsGenerating(false);
    }, 3000);
  };

  const filteredReports = reports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  );

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'generating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'summary': return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'detailed': return <FileText className="w-4 h-4 text-green-600" />;
      case 'compliance': return <Target className="w-4 h-4 text-purple-600" />;
      case 'analytical': return <PieChart className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!enabled) {
    return (
      <Card className={cn("border-yellow-200 bg-yellow-50/50", className)}>
        <CardContent className="p-6 text-center">
          <BarChart3 className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Advanced Reporting Not Available</h3>
          <p className="text-muted-foreground mb-4">
            Advanced reporting features are available in Starter plans and higher.
          </p>
          <Button variant="outline">
            Upgrade to Starter
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Reporting</h2>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analytics
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Professional Feature
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => new Date(r.generatedDate).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold text-blue-600">157</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Refunds</p>
                <p className="text-2xl font-bold text-purple-600">R2.85M</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium">Report Type</Label>
              <select 
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                onChange={(e) => setSelectedReportType(e.target.value)}
              >
                <option value="summary">Tax Summary</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="compliance">Compliance Report</option>
                <option value="analytical">Analytics & Insights</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Date Range</Label>
              <select 
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                {dateRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Format</Label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                <option value="pdf">PDF Report</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV Data</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center text-center"
                  onClick={() => generateReport(type.id)}
                  disabled={isGenerating}
                >
                  <Icon className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-sm font-medium">{type.name}</span>
                  {isGenerating && (
                    <div className="text-xs text-muted-foreground mt-1">Generating...</div>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Generated Reports
            </CardTitle>
            <div className="flex gap-2">
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">All Types</option>
                <option value="summary">Summary</option>
                <option value="detailed">Detailed</option>
                <option value="compliance">Compliance</option>
                <option value="analytical">Analytical</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(report.generatedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{report.fileSize}</span>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {report.downloadUrl && report.status === 'ready' && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first report to see analytics and insights
                </p>
                <Button onClick={() => generateReport('summary')}>
                  Generate Summary Report
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Report Insights Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Top Tax Deductions</h4>
                <div className="space-y-2">
                  {reports[0]?.preview.topDeductions.map((deduction, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">{deduction.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">R{deduction.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{deduction.frequency} clients</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Monthly Trends</h4>
                <div className="space-y-2">
                  {reports[0]?.preview.monthlyTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm font-medium">{trend.month} 2024</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">R{(trend.refunds / 1000000).toFixed(1)}M</div>
                        <div className="text-xs text-muted-foreground">{trend.clients} clients</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}