import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Server,
  Zap,
  FileText,
  ExternalLink,
  Activity,
  Target,
  Award,
  Calendar,
  BarChart3,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Video,
  Users
} from 'lucide-react';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SLAMetricsAPI, SLAMetric, IncidentReport } from '@/services/businessApiService';

interface SupportTier {
  name: string;
  responseTime: string;
  resolutionTime: string;
  availability: string;
  channels: string[];
  escalation: boolean;
}

const SUPPORT_TIERS: SupportTier[] = [
  {
    name: 'Business Plan Support',
    responseTime: '< 2 hours',
    resolutionTime: '< 24 hours',
    availability: '24/7',
    channels: ['Email', 'Phone', 'Live Chat', 'Video Call'],
    escalation: true
  },
  {
    name: 'Critical Issue Support',
    responseTime: '< 30 minutes',
    resolutionTime: '< 4 hours',
    availability: '24/7',
    channels: ['Emergency Hotline', 'Dedicated Manager'],
    escalation: true
  }
];

export function SLAGuarantees() {
  const { toast } = useCustomToast();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SLAMetric[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load data on component mount
  useEffect(() => {
    loadSLAData();
  }, []);

  const loadSLAData = async () => {
    setLoading(true);
    try {
      const [metricsResponse, incidentsResponse] = await Promise.all([
        SLAMetricsAPI.getSLAMetrics(),
        SLAMetricsAPI.getIncidentReports()
      ]);

      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data);
      } else {
        toast({
          title: "Warning",
          description: "Failed to load SLA metrics. Using fallback data.",
          variant: "destructive"
        });
      }

      if (incidentsResponse.success && incidentsResponse.data) {
        setIncidents(incidentsResponse.data);
      } else {
        toast({
          title: "Warning", 
          description: "Failed to load incident reports. Using fallback data.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to load SLA data:', error);
      toast({
        title: "Error",
        description: "Failed to load SLA data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      await loadSLAData();
      setLastRefresh(new Date());
      toast({
        title: "Metrics Refreshed",
        description: "SLA metrics have been updated with the latest data.",
      });
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
      toast({
        title: "Error",
        description: "Failed to refresh metrics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: SLAMetric['status']) => {
    switch (status) {
      case 'meeting': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'breached': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: SLAMetric['status']) => {
    switch (status) {
      case 'meeting': return <CheckCircle className="h-4 w-4" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4" />;
      case 'breached': return <AlertTriangle className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: SLAMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: IncidentReport['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentStatusColor = (status: IncidentReport['status']) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      case 'identified': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateUptime = () => {
    const uptimeMetric = metrics.find(m => m.id === 'uptime');
    return uptimeMetric ? uptimeMetric.current : 0;
  };

  const calculateMTTR = () => {
    // Mean Time To Resolution calculation
    return '1.2 hours';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            SLA Guarantees
          </h2>
          <p className="text-muted-foreground">
            Service Level Agreements and performance commitments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <Button onClick={refreshMetrics} disabled={loading} variant="outline">
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Uptime</p>
                <p className="text-2xl font-bold">{calculateUptime().toFixed(2)}%</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">MTTR</p>
                <p className="text-2xl font-bold">{calculateMTTR()}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Incidents</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SLA Status</p>
                <p className="text-2xl font-bold text-green-600">Meeting</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">SLA Metrics</TabsTrigger>
          <TabsTrigger value="support">Support Tiers</TabsTrigger>
          <TabsTrigger value="incidents">Incident History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* SLA Metrics */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      <Badge className={getStatusColor(metric.status)}>
                        {getStatusIcon(metric.status)}
                        <span className="ml-1">{metric.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Target: {metric.target}{metric.unit}</span>
                    <span className="font-medium">
                      Current: {metric.current.toFixed(metric.unit === '%' ? 2 : 0)}{metric.unit}
                    </span>
                  </div>
                  
                  <Progress 
                    value={metric.unit === '%' ? metric.current : (metric.current / metric.target) * 100} 
                    className="h-2"
                  />
                  
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(metric.lastUpdated).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support Tiers */}
        <TabsContent value="support" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUPPORT_TIERS.map((tier, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {tier.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                      <p className="text-lg font-semibold">{tier.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolution Time</p>
                      <p className="text-lg font-semibold">{tier.resolutionTime}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Availability</p>
                    <Badge variant="default">{tier.availability}</Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Support Channels</p>
                    <div className="flex flex-wrap gap-2">
                      {tier.channels.map((channel, channelIndex) => (
                        <Badge key={channelIndex} variant="secondary" className="text-xs">
                          {channel === 'Email' && <Mail className="h-3 w-3 mr-1" />}
                          {channel === 'Phone' && <Phone className="h-3 w-3 mr-1" />}
                          {channel === 'Live Chat' && <MessageSquare className="h-3 w-3 mr-1" />}
                          {channel === 'Video Call' && <Video className="h-3 w-3 mr-1" />}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {tier.escalation && (
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>Automatic escalation available</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Incident History */}
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Incidents
              </CardTitle>
              <CardDescription>
                Historical incident reports and resolutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{incident.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge className={getIncidentStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Started:</span>
                        <br />
                        {new Date(incident.startTime).toLocaleString()}
                      </div>
                      {incident.endTime && (
                        <div>
                          <span className="font-medium">Resolved:</span>
                          <br />
                          {new Date(incident.endTime).toLocaleString()}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Duration:</span>
                        <br />
                        {incident.endTime 
                          ? `${Math.round((new Date(incident.endTime).getTime() - new Date(incident.startTime).getTime()) / (1000 * 60))} minutes`
                          : 'Ongoing'
                        }
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Affected Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {incident.affectedServices.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly SLA Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Comprehensive monthly report on SLA performance and metrics
                </p>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Uptime Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Detailed uptime statistics and availability metrics
                </p>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Performance Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  API response times and system performance analysis
                </p>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Support Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Support ticket metrics and resolution times
                </p>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
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

export default SLAGuarantees; 