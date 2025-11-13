import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, CheckCircle, AlertTriangle, Clock, FileText, Download } from 'lucide-react';
import { ComplianceAPI, ComplianceFramework, ComplianceRequirement } from '@/services/businessApiService';

export function ComplianceFrameworks() {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      const [frameworksResponse, requirementsResponse] = await Promise.all([
        ComplianceAPI.getFrameworks(),
        ComplianceAPI.getRequirements()
      ]);

      if (frameworksResponse.success) {
        setFrameworks(frameworksResponse.data || []);
      }
      if (requirementsResponse.success) {
        setRequirements(requirementsResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'non-compliant':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance Frameworks</h2>
          <p className="text-muted-foreground">
            Monitor and manage compliance with industry standards
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Frameworks</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{frameworks.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active compliance frameworks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  Overall compliance rating
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {requirements.filter(r => r.status === 'not-met').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requiring immediate attention
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Status by Framework</CardTitle>
              <CardDescription>
                Current compliance status across all active frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {frameworks.map((framework) => (
                  <div key={framework.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(framework.status)}
                        <span className="font-medium">{framework.name}</span>
                        <Badge className={getComplianceStatusColor(framework.status)}>
                          {framework.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {framework.completionPercentage}%
                      </span>
                    </div>
                    <Progress value={framework.completionPercentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {frameworks.map((framework) => (
              <Card key={framework.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(framework.status)}
                    {framework.name}
                  </CardTitle>
                  <CardDescription>{framework.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm text-muted-foreground">
                      {framework.completionPercentage}%
                    </span>
                  </div>
                  <Progress value={framework.completionPercentage} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Version:</span>
                      <br />
                      {framework.version}
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Last Updated:</span>
                      <br />
                      {new Date(framework.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge className={getComplianceStatusColor(framework.status)}>
                      {framework.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
              <CardDescription>
                Detailed view of all compliance requirements and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requirements.map((requirement) => (
                  <div key={requirement.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(requirement.status)}
                        <h4 className="font-medium">{requirement.title}</h4>
                      </div>
                      <Badge className={getComplianceStatusColor(requirement.status)}>
                        {requirement.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {requirement.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Framework:</span>
                        <br />
                        {requirement.frameworkName}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Priority:</span>
                        <br />
                        <Badge variant={requirement.priority === 'high' ? 'destructive' : 'secondary'}>
                          {requirement.priority}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Due Date:</span>
                        <br />
                        {requirement.dueDate ? new Date(requirement.dueDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance Summary Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Comprehensive overview of compliance status across all frameworks
                </p>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Gap Analysis Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Detailed analysis of compliance gaps and remediation steps
                </p>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Audit Trail Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Complete audit trail of compliance activities and changes
                </p>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Remediation Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Action plan for addressing compliance gaps and requirements
                </p>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ComplianceFrameworks; 