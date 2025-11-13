import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download,
  Eye,
  BarChart3,
  Activity,
  Clock,
  Globe,
  Smartphone
} from 'lucide-react';
import { GuestUploadTracker } from '@/lib/guestUploadTracker';

interface MonitoringStats {
  totalAttempts: number;
  successfulUploads: number;
  blockedAttempts: number;
  suspiciousActivity: number;
  conversionRate: number;
  bypassAttempts: number;
  avgConfidenceScore: number;
}

interface SecurityMetrics {
  botDetections: number;
  honeypotTriggers: number;
  fingerprintInconsistencies: number;
  rapidRetries: number;
  multiSessionAbuse: number;
}

export function GuestUploadMonitor() {
  const [stats, setStats] = useState<MonitoringStats>({
    totalAttempts: 0,
    successfulUploads: 0,
    blockedAttempts: 0,
    suspiciousActivity: 0,
    conversionRate: 0,
    bypassAttempts: 0,
    avgConfidenceScore: 0,
  });

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    botDetections: 0,
    honeypotTriggers: 0,
    fingerprintInconsistencies: 0,
    rapidRetries: 0,
    multiSessionAbuse: 0
  });

  const [detailedAnalytics, setDetailedAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const tracker = GuestUploadTracker.getInstance();
      const analytics = tracker.getDetailedAnalytics();
      setDetailedAnalytics(analytics);

      // Calculate stats from analytics
      const newStats: MonitoringStats = {
        totalAttempts: analytics.summary.totalAttempts,
        successfulUploads: analytics.summary.successfulUploads,
        blockedAttempts: analytics.summary.totalAttempts - analytics.summary.successfulUploads,
        suspiciousActivity: analytics.summary.suspiciousActivity ? 1 : 0,
        conversionRate: analytics.summary.successfulUploads > 0 ? 
          (analytics.summary.successfulUploads / analytics.summary.totalAttempts) * 100 : 0,
        bypassAttempts: analytics.patterns.uniqueSessions > 3 ? analytics.patterns.uniqueSessions - 1 : 0,
        avgConfidenceScore: analytics.summary.confidenceScore
      };

      const newSecurityMetrics: SecurityMetrics = {
        botDetections: analytics.security.botScore > 0.3 ? 1 : 0,
        honeypotTriggers: analytics.security.honeypotTriggered ? 1 : 0,
        fingerprintInconsistencies: analytics.patterns.userAgentChanges > 2 ? 1 : 0,
        rapidRetries: analytics.recentActivity.filter((activity: any) => 
          !activity.success && 
          new Date(activity.timestamp).getTime() > Date.now() - 60000
        ).length,
        multiSessionAbuse: analytics.patterns.uniqueSessions > 3 ? 1 : 0
      };

      setStats(newStats);
      setSecurityMetrics(newSecurityMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const exportAnalytics = () => {
    if (!detailedAnalytics) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      stats,
      securityMetrics,
      detailedAnalytics
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guest-upload-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (value: number, threshold: number, reverse = false) => {
    if (reverse) {
      return value <= threshold ? 'text-green-500' : 'text-red-500';
    }
    return value >= threshold ? 'text-green-500' : 'text-red-500';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Guest Upload Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of guest upload restrictions and security
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={refreshData} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={exportAnalytics}
            disabled={!detailedAnalytics}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">
              All upload attempts tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(stats.conversionRate, 80)}`}>
              {stats.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successful uploads vs attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(stats.blockedAttempts, 1)}`}>
              {stats.blockedAttempts}
            </div>
            <p className="text-xs text-muted-foreground">
              Restriction system working
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getConfidenceColor(stats.avgConfidenceScore)}`}>
              {(stats.avgConfidenceScore * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average detection confidence
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Metrics
          </CardTitle>
          <CardDescription>
            Advanced threat detection and abuse prevention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Bot Detections</span>
              </div>
              <Badge variant={securityMetrics.botDetections > 0 ? "destructive" : "default"}>
                {securityMetrics.botDetections}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Honeypot Triggers</span>
              </div>
              <Badge variant={securityMetrics.honeypotTriggers > 0 ? "destructive" : "default"}>
                {securityMetrics.honeypotTriggers}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Fingerprint Issues</span>
              </div>
              <Badge variant={securityMetrics.fingerprintInconsistencies > 0 ? "destructive" : "default"}>
                {securityMetrics.fingerprintInconsistencies}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Rapid Retries</span>
              </div>
              <Badge variant={securityMetrics.rapidRetries > 0 ? "destructive" : "default"}>
                {securityMetrics.rapidRetries}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Multi-Session Abuse</span>
              </div>
              <Badge variant={securityMetrics.multiSessionAbuse > 0 ? "destructive" : "default"}>
                {securityMetrics.multiSessionAbuse}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">System Health</span>
              </div>
              <Badge variant="default">
                Operational
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      {detailedAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>First Seen:</span>
                  <span className="font-medium">
                    {new Date(detailedAnalytics.summary.firstSeen).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Activity:</span>
                  <span className="font-medium">
                    {new Date(detailedAnalytics.summary.lastSeen).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unique Sessions:</span>
                  <span className="font-medium">
                    {detailedAnalytics.patterns.uniqueSessions}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>User Agent Changes:</span>
                  <span className="font-medium">
                    {detailedAnalytics.patterns.userAgentChanges}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Timezone Changes:</span>
                  <span className="font-medium">
                    {detailedAnalytics.patterns.timezoneChanges}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Confidence Score</span>
                  <span className={`text-sm font-bold ${getConfidenceColor(detailedAnalytics.summary.confidenceScore)}`}>
                    {(detailedAnalytics.summary.confidenceScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={detailedAnalytics.summary.confidenceScore * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {detailedAnalytics.recentActivity.map((activity: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/20 rounded-lg text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      {activity.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">
                        {activity.success ? 'Upload' : 'Blocked'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="text-xs">
                        Confidence: {(activity.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastUpdated.toLocaleString()} • 
        Auto-refresh every 30 seconds
      </div>
    </div>
  );
} 