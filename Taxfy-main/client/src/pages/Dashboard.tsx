import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ReferralSystem } from "@/components/ReferralSystem";
import { WhiteLabelReports } from "@/components/practitioner/WhiteLabelReports";
import { PrioritySupport } from "@/components/practitioner/PrioritySupport";
import { AuditTrail } from "@/components/practitioner/AuditTrail";
import {
  Calculator,
  Upload,
  FileText,
  Users,
  Settings,
  Crown,
  Building,
  User,
  TrendingUp,
  Shield,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Calendar,
  Zap,
  Download,
  Star,
  BarChart3,
  Activity,
  Gift,
  Palette,
  Headphones,
  Building2,
  Clock,
  FileCheck,
  Database,
  HardDrive,
  Loader2,
  Mail,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { StoredDocuments } from "@/components/StoredDocuments";
import { EnhancedReports } from "@/components/EnhancedReports";
import { apiService, DashboardStats, UserActivity } from "@/services/api";
import { Helmet } from "react-helmet-async";
import { TaxfyLogo } from "@/components/ui/taxfy-logo";
import { MiniLoader } from "@/components/ui/site-loader";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    currentPlan,
    planLimits,
    usage,
    featureFlags,
    canUploadIRP5,
    canAccessVault,
  } = useSubscription();

  // State for real data
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null,
  );
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get active tab from URL params, default to 'overview'
  const activeTab = searchParams.get("tab") || "overview";

  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === "overview") {
      newSearchParams.delete("tab");
    } else {
      newSearchParams.set("tab", value);
    }
    setSearchParams(newSearchParams);
  };

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Create user in database if not exists - continue even if this fails
        try {
          await apiService.createUser({
            id: user.id,
            email: user.email || "",
            firstName: user.user_metadata?.first_name || "",
            lastName: user.user_metadata?.last_name || "",
          });
        } catch (userCreateError) {
          console.log(
            "User creation failed (likely already exists):",
            userCreateError,
          );
        }

        // Update login timestamp - continue even if this fails
        try {
          await apiService.updateUserLogin(user.id);
        } catch (loginUpdateError) {
          console.log("Login update failed:", loginUpdateError);
        }

        // Fetch dashboard data and activity with fallback handling
        try {
          const [dashboardResponse, activityResponse] = await Promise.all([
            apiService.getUserDashboard(user.id).catch((dashboardError) => {
              console.warn(
                "Dashboard API failed, using fallback data:",
                dashboardError,
              );
              return {
                totalCalculations: 0,
                totalUploads: 0,
                recentCalculations: [],
                recentUploads: [],
                recentActivity: [],
              };
            }),
            apiService.getUserActivities(user.id, 20).catch((activityError) => {
              console.warn(
                "Activities API failed, using empty array:",
                activityError,
              );
              return [];
            }),
          ]);

          setDashboardData(dashboardResponse);
          setUserActivity(activityResponse);

          // Show a warning if we're using fallback data
          if (
            dashboardResponse.totalCalculations === 0 &&
            dashboardResponse.totalUploads === 0
          ) {
            toast({
              title: "Limited Connectivity",
              description:
                "Dashboard data may be incomplete due to network issues. Core features still work.",
              variant: "default",
            });
          }
        } catch (fallbackError) {
          console.error("Even fallback failed:", fallbackError);
          // Set minimal working data
          setDashboardData({
            totalCalculations: 0,
            totalUploads: 0,
            recentCalculations: [],
            recentUploads: [],
            recentActivity: [],
          });
          setUserActivity([]);

          toast({
            title: "Offline Mode",
            description:
              "Dashboard is running in offline mode. Core features are still available.",
            variant: "default",
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  // Use real data from API with actual subscription limits
  const currentUsage = {
    uploads: {
      used: usage.irp5ProcessedThisMonth,
      limit:
        planLimits.irp5Uploads === "unlimited" ? "∞" : planLimits.irp5Uploads,
    },
    vault: {
      used: usage.documentsInVault,
      limit:
        planLimits.documentVault === "unlimited"
          ? "∞"
          : planLimits.documentVault,
    },
    reports: {
      used: usage.reportsGenerated,
      limit:
        planLimits.pdfReports === "unlimited" ? "∞" : planLimits.pdfReports,
    },
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const formatUsage = (used: number, limit: number) => {
    return `${used}/${limit}`;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 75) return "bg-primary/60";
    return "bg-primary";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Upload Tax Documents",
      description: "Upload your IRP5 or IT3(a) for instant analysis",
      icon: Upload,
      href: "/upload",
      color: "bg-primary/10 text-primary border-border",
    },
    {
      title: "Manual Tax Entry",
      description: "Enter your tax information manually",
      icon: Calculator,
      href: "/manual-entry",
      color: "bg-primary/10 text-primary border-border",
    },
    {
      title: "View Tax Analysis",
      description: "Review your tax calculations and insights",
      icon: BarChart3,
      href: "/dashboard",
      color: "bg-primary/10 text-primary border-border",
    },
    {
      title: "Download Reports",
      description: "Generate and download your tax reports",
      icon: Download,
      href: "/reports",
      color: "bg-primary/10 text-primary border-border",
    },
    {
      title: "Account Settings",
      description: "Manage your account and preferences",
      icon: Settings,
      href: "/settings",
      color: "bg-primary/10 text-primary border-border",
    },
    {
      title: "How-To Guide",
      description: "Learn how to use Taxfy step-by-step",
      icon: Star,
      href: "/how-to",
      color: "bg-primary/10 text-primary border-border",
    },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const accountAge = user?.created_at
    ? Math.floor(
        (Date.now() - new Date(user.created_at).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const userStats = [
    {
      label: "Documents Processed",
      value: dashboardData?.totalUploads.toString() || "0",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Tax documents uploaded",
    },
    {
      label: "Tax Calculations",
      value: dashboardData?.totalCalculations.toString() || "0",
      icon: Calculator,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Calculations completed",
    },
    {
      label: "Account Age",
      value: accountAge > 0 ? `${accountAge} days` : "New",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Member since",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Taxfy</title>
        <meta
          name="description"
          content="Your personal tax dashboard. Manage your tax documents, calculations, and get insights."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Enhanced Header with User Profile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || "User"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back,{" "}
                  {user?.user_metadata?.first_name ||
                    user?.email?.split("@")[0] ||
                    "User"}
                  !
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="default">
                    {user
                      ? `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() ||
                        user.email?.split("@")[0]
                      : "Guest User"}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    {currentPlan.charAt(0).toUpperCase() +
                      currentPlan.slice(1)}{" "}
                    Plan
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/pricing">
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Plans
                </Button>
              </Link>
            </div>
          </div>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Full Name:</span>
                    <span>
                      {user?.user_metadata?.full_name || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{user?.email || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Member Since:</span>
                    <span>
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-fit">
                      Free Account
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive/20 bg-destructive/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Getting Started Section for New Users */}
          {dashboardData &&
            dashboardData.totalCalculations === 0 &&
            dashboardData.totalUploads === 0 && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Welcome to Taxfy! Let's get you started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <h4 className="font-semibold mb-2">Upload Documents</h4>
                      <p className="text-sm text-muted-foreground">
                        Start by uploading your IRP5 or other tax documents for
                        automatic processing
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <h4 className="font-semibold mb-2">Review Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI will analyze your documents and calculate your
                        tax obligations
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <h4 className="font-semibold mb-2">Download Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        Get comprehensive tax reports ready for SARS submission
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Link to="/upload">
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Your First Document
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Plan Usage Overview */}
          {featureFlags.enableSubscriptions && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Plan Usage This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">IRP5 Uploads</span>
                      <span className="text-sm text-muted-foreground">
                        {currentUsage.uploads.used}/{currentUsage.uploads.limit}
                      </span>
                    </div>
                    <Progress
                      value={
                        currentUsage.uploads.limit === "∞"
                          ? 0
                          : getUsagePercentage(
                              currentUsage.uploads.used,
                              currentUsage.uploads.limit as number,
                            )
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Documents in Vault
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {currentUsage.vault.used}/{currentUsage.vault.limit}
                      </span>
                    </div>
                    <Progress
                      value={
                        currentUsage.vault.limit === "∞"
                          ? 0
                          : getUsagePercentage(
                              currentUsage.vault.used,
                              currentUsage.vault.limit as number,
                            )
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Reports Generated
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {currentUsage.reports.used}/{currentUsage.reports.limit}
                      </span>
                    </div>
                    <Progress
                      value={
                        currentUsage.reports.limit === "∞"
                          ? 0
                          : getUsagePercentage(
                              currentUsage.reports.used,
                              currentUsage.reports.limit as number,
                            )
                      }
                      className="h-2"
                    />
                  </div>

                  {!canUploadIRP5() && (
                    <Alert className="bg-primary/10 border-primary/20">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-foreground">
                        You've reached your upload limit for this month.
                        <Link
                          to="/pricing"
                          className="font-medium underline ml-1 text-primary"
                        >
                          Upgrade your plan
                        </Link>{" "}
                        for unlimited uploads.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userStats.map((stat, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Plan Status
                </CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentPlan === "free"
                    ? "Upgrade for more features"
                    : `${planLimits.irp5Uploads === "unlimited" ? "Unlimited" : planLimits.irp5Uploads} uploads/month`}
                </p>
                {currentPlan === "free" ? (
                  <Link to="/pricing">
                    <Button size="sm" className="mt-2 w-full">
                      Upgrade Now
                    </Button>
                  </Link>
                ) : (
                  <Link to="/settings">
                    <Button size="sm" variant="outline" className="mt-2 w-full">
                      Manage Plan
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">My Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Get started with your tax calculations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                      <Link key={index} to={action.href}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-6">
                            <div
                              className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                            >
                              <action.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-2">
                              {action.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {action.description}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Get Started
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Calculations */}
              {dashboardData?.recentCalculations &&
                dashboardData.recentCalculations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Recent Calculations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardData.recentCalculations.map((calc) => (
                          <div
                            key={calc.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium">
                                {calc.calculation_type}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(calc.created_at)}
                              </p>
                            </div>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Recent Uploads */}
              {dashboardData?.recentUploads &&
                dashboardData.recentUploads.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Recent Uploads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardData.recentUploads.map((upload) => (
                          <div
                            key={upload.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium">
                                {upload.original_name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(upload.file_size)} •{" "}
                                {formatDate(upload.created_at)}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {upload.mime_type.includes("pdf")
                                ? "PDF"
                                : "Document"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest tax calculations and uploads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData?.recentActivity &&
                  dashboardData.recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 border-l-2 border-primary/20"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">
                              {activity.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity yet.</p>
                      <p className="text-sm">
                        Start by uploading your tax documents or entering your
                        information manually.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <StoredDocuments />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>
                    Track your tax calculations and document uploads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userActivity && userActivity.length > 0 ? (
                    <div className="space-y-4">
                      {userActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 border-l-2 border-primary/20 hover:bg-muted/50 rounded-r-lg transition-colors"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">
                                {activity.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {activity.activity_type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No activity history</p>
                      <p className="text-sm">
                        Your calculations and uploads will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <EnhancedReports />
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Tax Calculator
                    </CardTitle>
                    <CardDescription>
                      Calculate your tax liability and refunds
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Link to="/upload">
                        <Button className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload IRP5
                        </Button>
                      </Link>
                      <Link to="/manual-entry">
                        <Button variant="outline" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Manual Entry
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Resources
                    </CardTitle>
                    <CardDescription>
                      Helpful guides and information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Link to="/how-to">
                        <Button variant="outline" className="w-full">
                          How-To Guide
                        </Button>
                      </Link>
                      <Link to="/blog">
                        <Button variant="outline" className="w-full">
                          Tax Blog
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
