import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Download, 
  Eye, 
  Settings,
  BarChart3,
  Calendar,
  Users,
  Lock,
  Database,
  Zap,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  Award,
  BookOpen,
  Bell,
  FileCheck,
  Target
} from 'lucide-react';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceAPI } from '@/services/businessApiService';
import type { ComplianceFramework, ComplianceRequirement } from '@/services/businessApiService';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  outcome: 'success' | 'failure' | 'warning';
}

interface ComplianceReport {
  id: string;
  name: string;
  type: 'regulatory' | 'internal' | 'audit' | 'assessment';
  framework: string;
  generatedAt: string;
  period: string;
  status: 'draft' | 'final' | 'submitted';
  size: string;
  downloadUrl: string;
}

interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'deadline' | 'violation' | 'update' | 'review';
  createdAt: string;
  dueDate?: string;
  resolved: boolean;
  framework: string;
}

const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'sars',
    name: 'SARS Tax Compliance',
    description: 'South African Revenue Service tax compliance requirements',
    status: 'compliant',
    lastAssessment: '2024-01-01T00:00:00Z',
    nextReview: '2024-04-01T00:00:00Z',
    score: 95,
    enabled: true,
    requirements: [
      {
        id: 'req-001',
        title: 'VAT Registration',
        description: 'Valid VAT registration and compliance',
        status: 'met',
        evidence: ['VAT Certificate', 'Recent VAT Returns'],
        lastVerified: '2024-01-01T00:00:00Z',
        responsible: 'Tax Manager',
        priority: 'high'
      },
      {
        id: 'req-002',
        title: 'Monthly VAT Returns',
        description: 'Timely submission of monthly VAT returns',
        status: 'met',
        evidence: ['VAT201 Submissions', 'Payment Confirmations'],
        lastVerified: '2024-01-10T00:00:00Z',
        responsible: 'Accounting Team',
        priority: 'critical'
      }
    ]
  },
  {
    id: 'popia',
    name: 'POPIA Compliance',
    description: 'Protection of Personal Information Act compliance',
    status: 'partial',
    lastAssessment: '2023-12-15T00:00:00Z',
    nextReview: '2024-03-15T00:00:00Z',
    score: 78,
    enabled: true,
    requirements: [
      {
        id: 'req-003',
        title: 'Data Processing Register',
        description: 'Maintain comprehensive data processing register',
        status: 'met',
        evidence: ['Processing Register', 'Data Flow Diagrams'],
        lastVerified: '2023-12-15T00:00:00Z',
        responsible: 'Data Protection Officer',
        priority: 'high'
      },
      {
        id: 'req-004',
        title: 'Consent Management',
        description: 'Proper consent collection and management',
        status: 'partial',
        evidence: ['Consent Forms', 'Consent Database'],
        lastVerified: '2023-12-15T00:00:00Z',
        responsible: 'Legal Team',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'Information Security Management System',
    status: 'compliant',
    lastAssessment: '2023-11-01T00:00:00Z',
    nextReview: '2024-11-01T00:00:00Z',
    score: 92,
    enabled: true,
    requirements: [
      {
        id: 'req-005',
        title: 'Security Policies',
        description: 'Comprehensive information security policies',
        status: 'met',
        evidence: ['Security Policy Document', 'Policy Reviews'],
        lastVerified: '2023-11-01T00:00:00Z',
        responsible: 'CISO',
        priority: 'critical'
      }
    ]
  }
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [];
const DEFAULT_COMPLIANCE_REPORTS: ComplianceReport[] = [];
const DEFAULT_COMPLIANCE_ALERTS: ComplianceAlert[] = [];

export function AdvancedComplianceFeatures() {
  const { user } = useAuth();
  const { toast } = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load compliance frameworks on component mount
  useEffect(() => {
    loadComplianceFrameworks();
  }, []);

  const loadComplianceFrameworks = async () => {
    setLoading(true);
    try {
      const response = await ComplianceAPI.getComplianceFrameworks();
      
      if (response.success) {
        setFrameworks(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to load compliance frameworks',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to load compliance frameworks',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runComplianceCheck = async () => {
    setLoading(true);
    try {
      // Simulate compliance check
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update frameworks with mock results
      const updatedFrameworks = frameworks.map(framework => ({
        ...framework,
        completionPercentage: Math.floor(Math.random() * 100),
        lastUpdated: new Date().toISOString()
      }));
      
      setFrameworks(updatedFrameworks);
      toast({
        title: "Success",
        description: 'Compliance check completed successfully',
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to run compliance check',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshAllFrameworks = async () => {
    setLastRefresh(new Date());
    await loadComplianceFrameworks();
    toast({
      title: "Success",
      description: 'Compliance frameworks refreshed successfully',
      variant: "default"
    });
  };

  const getStatusColor = (status: ComplianceFramework['status']) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'non-compliant': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ComplianceFramework['status']) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'partial': return <AlertTriangle className="h-4 w-4" />;
      case 'non-compliant': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getRequirementStatusColor = (status: ComplianceRequirement['status']) => {
    switch (status) {
      case 'met': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'not-met': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: ComplianceRequirement['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Calculate overall compliance metrics
  const overallMetrics = frameworks.reduce((acc, framework) => {
    if (framework.enabled) {
      acc.totalFrameworks++;
      acc.totalScore += framework.score;
      
      if (framework.status === 'compliant') acc.compliantFrameworks++;
      else if (framework.status === 'partial') acc.partialFrameworks++;
      else if (framework.status === 'non-compliant') acc.nonCompliantFrameworks++;
      
      framework.requirements.forEach(req => {
        acc.totalRequirements++;
        if (req.status === 'met') acc.metRequirements++;
        else if (req.status === 'partial') acc.partialRequirements++;
        else if (req.status === 'not-met') acc.notMetRequirements++;
      });
    }
    return acc;
  }, {
    totalFrameworks: 0,
    compliantFrameworks: 0,
    partialFrameworks: 0,
    nonCompliantFrameworks: 0,
    totalScore: 0,
    totalRequirements: 0,
    metRequirements: 0,
    partialRequirements: 0,
    notMetRequirements: 0
  });

  const averageScore = overallMetrics.totalFrameworks > 0 
    ? Math.round(overallMetrics.totalScore / overallMetrics.totalFrameworks) 
    : 0;

  const requirementCompletionRate = overallMetrics.totalRequirements > 0
    ? Math.round((overallMetrics.metRequirements / overallMetrics.totalRequirements) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Advanced Compliance Features
          </h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive compliance management and monitoring
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {frameworks.filter(f => f.enabled).length} Active Frameworks
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshAllFrameworks}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
              <div className={`p-2 rounded-full ${averageScore >= 90 ? 'bg-green-100' : averageScore >= 70 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <BarChart3 className={`h-4 w-4 ${averageScore >= 90 ? 'text-green-600' : averageScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`} />
              </div>
            </div>
            <Progress value={averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliant Frameworks</p>
                <p className="text-2xl font-bold">{overallMetrics.compliantFrameworks}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {overallMetrics.totalFrameworks} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Requirements Met</p>
                <p className="text-2xl font-bold">{requirementCompletionRate}%</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallMetrics.metRequirements} of {overallMetrics.totalRequirements}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">
                  {frameworks.filter(f => f.enabled && new Date(f.nextReview) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <div className="p-2 rounded-full bg-orange-100">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Due within 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Frameworks Overview</TabsTrigger>
          <TabsTrigger value="details">Framework Details</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {frameworks.map((framework) => (
              <Card 
                key={framework.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFramework?.id === framework.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedFramework(framework)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(framework.status)} bg-opacity-10`}>
                        {getStatusIcon(framework.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{framework.name}</h3>
                        <p className="text-sm text-muted-foreground">{framework.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{framework.score}%</p>
                        <Badge variant={framework.status === 'compliant' ? 'default' : 'secondary'}>
                          {framework.status}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          runComplianceCheck();
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Compliance Score</span>
                      <span>{framework.score}%</span>
                    </div>
                    <Progress value={framework.score} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>Last Assessment: {new Date(framework.lastAssessment).toLocaleDateString()}</span>
                    <span>Next Review: {new Date(framework.nextReview).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedFramework ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(selectedFramework.status)}
                        {selectedFramework.name}
                      </CardTitle>
                      <CardDescription>{selectedFramework.description}</CardDescription>
                    </div>
                    <Badge variant={selectedFramework.status === 'compliant' ? 'default' : 'secondary'}>
                      {selectedFramework.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Compliance Score</p>
                      <p className="text-2xl font-bold">{selectedFramework.score}%</p>
                      <Progress value={selectedFramework.score} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Assessment</p>
                      <p className="font-semibold">{new Date(selectedFramework.lastAssessment).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Review</p>
                      <p className="font-semibold">{new Date(selectedFramework.nextReview).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Requirements</h4>
                    {selectedFramework.requirements.map((requirement) => (
                      <Card key={requirement.id} className="border-l-4" style={{borderLeftColor: getRequirementStatusColor(requirement.status).replace('bg-', '#')}}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-medium">{requirement.title}</h5>
                                <Badge variant="outline" className={getPriorityColor(requirement.priority)}>
                                  {requirement.priority}
                                </Badge>
                                <Badge variant={requirement.status === 'met' ? 'default' : 'secondary'}>
                                  {requirement.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{requirement.description}</p>
                              <div className="text-xs text-muted-foreground">
                                <p>Responsible: {requirement.responsible}</p>
                                <p>Last Verified: {new Date(requirement.lastVerified).toLocaleDateString()}</p>
                                {requirement.dueDate && (
                                  <p>Due Date: {new Date(requirement.dueDate).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {requirement.evidence.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium mb-1">Evidence:</p>
                              <div className="flex flex-wrap gap-1">
                                {requirement.evidence.map((evidence, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {evidence}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Framework Selected</h3>
                <p className="text-muted-foreground">
                  Select a compliance framework from the overview to view detailed requirements.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Generate and download comprehensive compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Download Full Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileCheck className="h-6 w-6 mb-2" />
                  <span>Compliance Summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Audit Trail</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Metrics Dashboard</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 