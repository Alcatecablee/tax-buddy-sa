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
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
  Search,
  UserCheck,
  UserPlus,
  DollarSign,
  FileText,
} from "lucide-react";
import { UserManagementAPI, AdminDashboardAPI } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface UserAnalyticsProps {}

const UserAnalytics: React.FC<UserAnalyticsProps> = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [userStatsResult, adminResult, usersResult] = await Promise.all([
        UserManagementAPI.getUserStats(),
        AdminDashboardAPI.getAdminDashboard(),
        UserManagementAPI.getAllUsers(1, 100),
      ]);

      if (userStatsResult.success) {
        setUserStats(userStatsResult.data);
      }

      if (adminResult.success) {
        setAdminData(adminResult.data);
      }

      if (usersResult.success) {
        setUsers(usersResult.data?.items || []);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);

    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated",
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: userStats?.total_users || 0,
      change: "+12.5%",
      trend: "up",
      icon: Users,
      description: "All registered users",
    },
    {
      title: "New Today",
      value: userStats?.new_today || 0,
      change: "+8.3%",
      trend: "up",
      icon: UserPlus,
      description: "Users registered today",
    },
    {
      title: "Active Today",
      value: userStats?.active_today || 0,
      change: "+15.2%",
      trend: "up",
      icon: Activity,
      description: "Users active today",
    },
    {
      title: "Premium Users",
      value: userStats?.premium_users || 0,
      change: "+23.1%",
      trend: "up",
      icon: UserCheck,
      description: "Users with paid plans",
    },
  ];

  const recentUsers = users.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Analytics</h2>
          <p className="text-muted-foreground">
            Monitor user activity and engagement metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            {refreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">
                    {stat.value.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Monthly user registration trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <span className="font-medium">
                      {userStats?.new_today * 30 || 0}
                    </span>
                  </div>
                  <Progress value={75} className="w-full" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Month</span>
                    <span className="font-medium">
                      {userStats?.new_today * 25 || 0}
                    </span>
                  </div>
                  <Progress value={60} className="w-full" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Growth Rate</span>
                    <Badge
                      variant="default"
                      className="bg-green-500/10 text-green-600 border-green-500/20"
                    >
                      +20%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>
                  Breakdown of user subscription tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Free Plan</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {userStats?.total_users - userStats?.premium_users || 0}
                      </span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                  </div>
                  <Progress value={80} className="w-full" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Premium Plans</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {userStats?.premium_users || 0}
                      </span>
                      <Badge
                        variant="default"
                        className="bg-purple-500/10 text-purple-600 border-purple-500/20"
                      >
                        Premium
                      </Badge>
                    </div>
                  </div>
                  <Progress value={20} className="w-full" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <Badge variant="outline">
                      {userStats?.total_users > 0
                        ? (
                            (userStats.premium_users / userStats.total_users) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>
                Latest user registrations and their activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          user.subscription_tier === "free"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {user.subscription_tier}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Recent user actions and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminData?.recent?.activity
                  ?.slice(0, 10)
                  .map((activity: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <Activity className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.first_name} {activity.last_name} -{" "}
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.activity_type}
                      </Badge>
                    </div>
                  )) || (
                  <p className="text-muted-foreground text-center py-4">
                    No recent activity found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      R {(userStats?.premium_users * 899 || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +18.2%
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg. Revenue Per User
                    </p>
                    <p className="text-2xl font-bold">R 245</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +5.4%
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Churn Rate</p>
                    <p className="text-2xl font-bold">2.1%</p>
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      -0.3%
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAnalytics;
