import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Calendar,
  Target,
  PieChart,
  LineChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface AnalyticsData {
  period: string;
  revenue: number;
  clients: number;
  completedReturns: number;
  averageRefund: number;
  processingTime: number;
  clientSatisfaction: number;
}

interface ClientMetrics {
  newClients: number;
  returningClients: number;
  churnRate: number;
  lifetimeValue: number;
}

interface PerformanceMetrics {
  accuracy: number;
  efficiency: number;
  turnaroundTime: number;
  errorRate: number;
}

interface RevenueBreakdown {
  individual: number;
  business: number;
  consultation: number;
  additional: number;
}

export const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("month");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useCustomToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    // In production, this would fetch from your analytics API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData: AnalyticsData[] = [
      {
        period: "January 2024",
        revenue: 125000,
        clients: 87,
        completedReturns: 156,
        averageRefund: 4500,
        processingTime: 2.3,
        clientSatisfaction: 4.8,
      },
      {
        period: "February 2024",
        revenue: 142000,
        clients: 94,
        completedReturns: 178,
        averageRefund: 5200,
        processingTime: 2.1,
        clientSatisfaction: 4.9,
      },
      {
        period: "March 2024",
        revenue: 158000,
        clients: 103,
        completedReturns: 201,
        averageRefund: 4800,
        processingTime: 1.9,
        clientSatisfaction: 4.7,
      },
    ];

    setAnalyticsData(mockData);
    setIsLoading(false);
  };

  const currentData = analyticsData[analyticsData.length - 1] || {
    period: "",
    revenue: 0,
    clients: 0,
    completedReturns: 0,
    averageRefund: 0,
    processingTime: 0,
    clientSatisfaction: 0,
  };

  const previousData = analyticsData[analyticsData.length - 2] || currentData;

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const clientMetrics: ClientMetrics = {
    newClients: 28,
    returningClients: 75,
    churnRate: 8.5,
    lifetimeValue: 2850,
  };

  const performanceMetrics: PerformanceMetrics = {
    accuracy: 98.7,
    efficiency: 94.2,
    turnaroundTime: 1.9,
    errorRate: 1.3,
  };

  const revenueBreakdown: RevenueBreakdown = {
    individual: 85000,
    business: 52000,
    consultation: 18000,
    additional: 3000,
  };

  const exportReport = () => {
    toast({
      title: "Report Exported",
      description: "Analytics report has been downloaded successfully",
    });
  };

  const refreshData = () => {
    loadAnalyticsData();
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Advanced Analytics Dashboard
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Comprehensive insights into your tax practice performance and
                growth
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportReport}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(currentData.revenue)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {calculateGrowth(
                            currentData.revenue,
                            previousData.revenue,
                          ) >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm ${
                              calculateGrowth(
                                currentData.revenue,
                                previousData.revenue,
                              ) >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {Math.abs(
                              calculateGrowth(
                                currentData.revenue,
                                previousData.revenue,
                              ),
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Active Clients
                        </p>
                        <p className="text-2xl font-bold">
                          {currentData.clients}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">
                            {calculateGrowth(
                              currentData.clients,
                              previousData.clients,
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Completed Returns
                        </p>
                        <p className="text-2xl font-bold">
                          {currentData.completedReturns}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">
                            {calculateGrowth(
                              currentData.completedReturns,
                              previousData.completedReturns,
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Avg Processing Time
                        </p>
                        <p className="text-2xl font-bold">
                          {currentData.processingTime}h
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingDown className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">
                            {Math.abs(
                              calculateGrowth(
                                currentData.processingTime,
                                previousData.processingTime,
                              ),
                            ).toFixed(1)}
                            % faster
                          </span>
                        </div>
                      </div>
                      <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {analyticsData.map((data, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <div
                            className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80"
                            style={{
                              height: `${(data.revenue / Math.max(...analyticsData.map((d) => d.revenue))) * 200}px`,
                            }}
                          />
                          <p className="text-xs text-muted-foreground text-center">
                            {data.period.split(" ")[0]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {analyticsData.map((data, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <div
                            className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-500/80"
                            style={{
                              height: `${(data.clients / Math.max(...analyticsData.map((d) => d.clients))) * 200}px`,
                            }}
                          />
                          <p className="text-xs text-muted-foreground text-center">
                            {data.period.split(" ")[0]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-1">
                        {performanceMetrics.accuracy}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accuracy Rate
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {performanceMetrics.efficiency}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Efficiency Score
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-500 mb-1">
                        {performanceMetrics.turnaroundTime}h
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Avg Turnaround
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-500 mb-1">
                        {performanceMetrics.errorRate}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Error Rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(revenueBreakdown).map(
                        ([category, amount]) => {
                          const percentage =
                            (amount /
                              Object.values(revenueBreakdown).reduce(
                                (a, b) => a + b,
                                0,
                              )) *
                            100;
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="capitalize">
                                  {category} Tax Returns
                                </span>
                                <span className="font-semibold">
                                  {formatCurrency(amount)}
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {percentage.toFixed(1)}% of total revenue
                              </p>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Average per Client
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(
                          currentData.revenue / currentData.clients,
                        )}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Average Refund
                      </p>
                      <p className="text-2xl font-bold text-green-500">
                        {formatCurrency(currentData.averageRefund)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Monthly Growth
                      </p>
                      <p className="text-2xl font-bold text-orange-500">
                        {calculateGrowth(
                          currentData.revenue,
                          previousData.revenue,
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">New Clients</p>
                    <p className="text-2xl font-bold">
                      {clientMetrics.newClients}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Returning Clients
                    </p>
                    <p className="text-2xl font-bold">
                      {clientMetrics.returningClients}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <TrendingDown className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Churn Rate</p>
                    <p className="text-2xl font-bold">
                      {clientMetrics.churnRate}%
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Lifetime Value
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(clientMetrics.lifetimeValue)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {currentData.clientSatisfaction}/5.0
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Average Rating
                      </p>
                      <div className="flex justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-6 h-6 rounded-full ${
                              star <= Math.floor(currentData.clientSatisfaction)
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on {currentData.completedReturns} client reviews
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Individual Clients</span>
                        <Badge variant="outline">75%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Small Business</span>
                        <Badge variant="outline">20%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Corporate</span>
                        <Badge variant="outline">5%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Accuracy Rate</span>
                        <span className="font-semibold">
                          {performanceMetrics.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${performanceMetrics.accuracy}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Efficiency Score</span>
                        <span className="font-semibold">
                          {performanceMetrics.efficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${performanceMetrics.efficiency}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Error Rate</span>
                        <span className="font-semibold">
                          {performanceMetrics.errorRate}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${performanceMetrics.errorRate}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Processing Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-500 mb-2">
                        {performanceMetrics.turnaroundTime}h
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Average Turnaround Time
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold">Best Time</p>
                          <p className="text-green-500">45 min</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">Target</p>
                          <p className="text-primary">2h</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid gap-4">
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-500">
                          Revenue Growth Opportunity
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your business client segment shows 32% higher revenue
                          per client. Consider targeting more small businesses
                          for growth.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-primary">
                          Efficiency Improvement
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Processing time has improved by 18% this month. Your
                          team's productivity is trending upward.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-500">
                          Client Retention Alert
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Churn rate has increased to 8.5%. Consider
                          implementing a client follow-up program to improve
                          retention.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
