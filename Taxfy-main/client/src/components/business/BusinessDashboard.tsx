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
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";

const BusinessDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    completedReturns: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        // In production, this would fetch real business data from your API
        // For now, we'll show empty states to encourage user interaction
        setStats({
          totalClients: 0,
          activeProjects: 0,
          monthlyRevenue: 0,
          completedReturns: 0,
        });
        setRecentActivity([]);
      } catch (error) {
        // Handle error silently in production
      }
    };

    loadBusinessData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/assets/logo-ta.png"
            alt="Taxfy Logo"
            className="h-12 w-12 object-contain animate-bounce-subtle"
          />
        </div>
        <h2 className="text-2xl font-bold">Business Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your business performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalClients === 0 ? (
                <span className="text-muted-foreground">
                  Add your first client
                </span>
              ) : (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects === 0 ? (
                <span className="text-muted-foreground">
                  Start your first project
                </span>
              ) : (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyRevenue === 0 ? (
                <span className="text-muted-foreground">
                  Complete projects to earn revenue
                </span>
              ) : (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Returns
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReturns}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedReturns === 0 ? (
                <span className="text-muted-foreground">
                  Process your first return
                </span>
              ) : (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +15% from last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your business</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground">
                Activity will appear here as you use the platform
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${activity.color}`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDashboard;
