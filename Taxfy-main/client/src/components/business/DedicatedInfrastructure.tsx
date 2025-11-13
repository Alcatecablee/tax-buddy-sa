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
import {
  CloudCog,
  Server,
  Database,
  Shield,
  Zap,
  Globe,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Lock,
  Eye,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Clock,
  MapPin,
  Users,
  Target,
  Award,
  Layers,
  Monitor,
  PhoneCall,
  Download,
  Upload,
  Gauge,
  Wifi,
  Truck,
  Building,
  Crown,
  Sparkles,
} from "lucide-react";

interface InfrastructureNode {
  id: string;
  name: string;
  type: "compute" | "database" | "storage" | "network";
  status: "online" | "maintenance" | "offline";
  location: string;
  specs: {
    cpu: string;
    memory: string;
    storage: string;
    network: string;
  };
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    networkIn: number;
    networkOut: number;
  };
  uptime: number;
}

interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  status: "enabled" | "disabled" | "configured";
  level: "basic" | "advanced" | "enterprise";
  compliance: string[];
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  target: number;
  status: "good" | "warning" | "critical";
}

export default function DedicatedInfrastructure() {
  const [selectedRegion, setSelectedRegion] = useState("za-central");
  const [isScaling, setIsScaling] = useState(false);
  const [realTimeMetrics, setRealTimeMetrics] = useState(true);

  // Mock infrastructure data
  const infrastructureNodes: InfrastructureNode[] = [
    {
      id: "node_001",
      name: "Primary Compute Cluster",
      type: "compute",
      status: "online",
      location: "Johannesburg, South Africa",
      specs: {
        cpu: "64 vCPUs (Intel Xeon Platinum)",
        memory: "256 GB DDR4",
        storage: "2TB NVMe SSD",
        network: "10 Gbps",
      },
      metrics: {
        cpuUsage: 68,
        memoryUsage: 72,
        storageUsage: 45,
        networkIn: 8.5,
        networkOut: 12.3,
      },
      uptime: 99.98,
    },
    {
      id: "node_002",
      name: "Database Primary",
      type: "database",
      status: "online",
      location: "Cape Town, South Africa",
      specs: {
        cpu: "32 vCPUs (Intel Xeon)",
        memory: "512 GB DDR4",
        storage: "5TB NVMe SSD",
        network: "25 Gbps",
      },
      metrics: {
        cpuUsage: 42,
        memoryUsage: 68,
        storageUsage: 67,
        networkIn: 15.2,
        networkOut: 8.7,
      },
      uptime: 99.99,
    },
    {
      id: "node_003",
      name: "Storage Cluster",
      type: "storage",
      status: "online",
      location: "Durban, South Africa",
      specs: {
        cpu: "16 vCPUs",
        memory: "128 GB DDR4",
        storage: "50TB Enterprise SSD",
        network: "40 Gbps",
      },
      metrics: {
        cpuUsage: 28,
        memoryUsage: 35,
        storageUsage: 78,
        networkIn: 22.1,
        networkOut: 18.9,
      },
      uptime: 99.97,
    },
    {
      id: "node_004",
      name: "CDN Edge Network",
      type: "network",
      status: "online",
      location: "Multi-Region",
      specs: {
        cpu: "Distributed",
        memory: "Distributed",
        storage: "10TB Cache",
        network: "100 Gbps",
      },
      metrics: {
        cpuUsage: 55,
        memoryUsage: 48,
        storageUsage: 62,
        networkIn: 45.7,
        networkOut: 67.3,
      },
      uptime: 99.95,
    },
  ];

  const securityFeatures: SecurityFeature[] = [
    {
      id: "sec_001",
      name: "Advanced Firewall",
      description: "Enterprise-grade firewall with DDoS protection",
      status: "enabled",
      level: "enterprise",
      compliance: ["SOC 2", "ISO 27001"],
    },
    {
      id: "sec_002",
      name: "End-to-End Encryption",
      description: "AES-256 encryption for data at rest and in transit",
      status: "enabled",
      level: "enterprise",
      compliance: ["POPIA", "GDPR"],
    },
    {
      id: "sec_003",
      name: "Zero Trust Network",
      description: "Zero trust security architecture with microsegmentation",
      status: "enabled",
      level: "enterprise",
      compliance: ["NIST", "SOC 2"],
    },
    {
      id: "sec_004",
      name: "Intrusion Detection",
      description: "AI-powered intrusion detection and prevention system",
      status: "enabled",
      level: "advanced",
      compliance: ["ISO 27001"],
    },
    {
      id: "sec_005",
      name: "Vulnerability Scanning",
      description: "Continuous vulnerability assessment and remediation",
      status: "enabled",
      level: "enterprise",
      compliance: ["SOC 2", "ISO 27001"],
    },
  ];

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: "metric_001",
      name: "Response Time",
      value: 45,
      unit: "ms",
      trend: "stable",
      target: 50,
      status: "good",
    },
    {
      id: "metric_002",
      name: "Throughput",
      value: 15420,
      unit: "req/min",
      trend: "up",
      target: 12000,
      status: "good",
    },
    {
      id: "metric_003",
      name: "Availability",
      value: 99.98,
      unit: "%",
      trend: "stable",
      target: 99.9,
      status: "good",
    },
    {
      id: "metric_004",
      name: "Error Rate",
      value: 0.02,
      unit: "%",
      trend: "down",
      target: 0.1,
      status: "good",
    },
  ];

  const triggerAutoScale = () => {
    setIsScaling(true);
    setTimeout(() => {
      setIsScaling(false);
    }, 8000);
  };

  // Simulate real-time updates
  useEffect(() => {
    if (realTimeMetrics) {
      const interval = setInterval(() => {
        // Update metrics simulation
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [realTimeMetrics]);

  const averageUptime =
    infrastructureNodes.reduce((sum, node) => sum + node.uptime, 0) /
    infrastructureNodes.length;
  const totalCpuUsage =
    infrastructureNodes.reduce((sum, node) => sum + node.metrics.cpuUsage, 0) /
    infrastructureNodes.length;
  const totalMemoryUsage =
    infrastructureNodes.reduce(
      (sum, node) => sum + node.metrics.memoryUsage,
      0,
    ) / infrastructureNodes.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-green-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <CloudCog className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Dedicated Infrastructure
                  <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                    Enterprise Pro & Elite
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  Private cloud infrastructure with dedicated resources and
                  enterprise-grade security
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                All systems operational
              </div>
              <Button onClick={triggerAutoScale} disabled={isScaling}>
                {isScaling ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scaling...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Auto Scale
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Auto-scaling Status */}
      {isScaling && (
        <Alert className="border-blue-500/20 bg-blue-500/10">
          <Zap className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium">
                Infrastructure auto-scaling in progress...
              </span>
              <div className="text-sm text-muted-foreground mt-1">
                Adding additional compute resources based on demand patterns
              </div>
            </div>
            <Progress value={75} className="w-32" />
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Infrastructure Uptime
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {averageUptime.toFixed(2)}%
            </div>
            <Progress value={averageUptime} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              CPU Utilization
            </CardTitle>
            <Cpu className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCpuUsage.toFixed(0)}%
            </div>
            <Progress value={totalCpuUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Across all nodes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMemoryUsage.toFixed(0)}%
            </div>
            <Progress value={totalMemoryUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Total memory pool
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
            <Server className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                infrastructureNodes.filter((node) => node.status === "online")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {infrastructureNodes.length} total nodes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Infrastructure Tabs */}
      <Tabs defaultValue="nodes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="nodes">Infrastructure Nodes</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Region:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="za-central">South Africa Central</option>
                <option value="za-west">South Africa West</option>
                <option value="eu-west">Europe West</option>
                <option value="us-east">US East</option>
              </select>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure Nodes
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Network Topology
            </Button>
          </div>

          {infrastructureNodes.map((node) => (
            <Card key={node.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        node.status === "online"
                          ? "bg-green-500/10"
                          : node.status === "maintenance"
                            ? "bg-yellow-500/10"
                            : "bg-red-500/10"
                      }`}
                    >
                      {node.type === "compute" && (
                        <Cpu className="h-5 w-5 text-blue-600" />
                      )}
                      {node.type === "database" && (
                        <Database className="h-5 w-5 text-purple-600" />
                      )}
                      {node.type === "storage" && (
                        <HardDrive className="h-5 w-5 text-orange-600" />
                      )}
                      {node.type === "network" && (
                        <Network className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{node.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3" />
                        {node.location}
                        <span className="mx-2">•</span>
                        <Badge
                          variant={
                            node.status === "online"
                              ? "outline"
                              : node.status === "maintenance"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {node.status}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Uptime</div>
                    <div className="text-lg font-bold text-green-600">
                      {node.uptime}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Specifications:
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPU:</span>
                        <span>{node.specs.cpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Memory:</span>
                        <span>{node.specs.memory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage:</span>
                        <span>{node.specs.storage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network:</span>
                        <span>{node.specs.network}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Real-time Metrics:
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CPU Usage</span>
                          <span>{node.metrics.cpuUsage}%</span>
                        </div>
                        <Progress
                          value={node.metrics.cpuUsage}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Memory Usage</span>
                          <span>{node.metrics.memoryUsage}%</span>
                        </div>
                        <Progress
                          value={node.metrics.memoryUsage}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Storage Usage</span>
                          <span>{node.metrics.storageUsage}%</span>
                        </div>
                        <Progress
                          value={node.metrics.storageUsage}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3 text-green-600" />
                      <span>{node.metrics.networkIn} Gbps in</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Upload className="h-3 w-3 text-blue-600" />
                      <span>{node.metrics.networkOut} Gbps out</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Monitor className="h-3 w-3 mr-2" />
                      Monitor
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Enterprise Security Features
              </CardTitle>
              <CardDescription>
                Advanced security controls and compliance measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-4 rounded-lg border space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          feature.status === "enabled"
                            ? "outline"
                            : feature.status === "configured"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {feature.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{feature.level}</Badge>
                      {feature.compliance.map((comp, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {comp}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-2" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-lg">0</div>
                  <div className="text-sm text-muted-foreground">
                    Security Incidents
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-lg">99.9%</div>
                  <div className="text-sm text-muted-foreground">
                    Security Score
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10">
                  <Lock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-lg">2.4M</div>
                  <div className="text-sm text-muted-foreground">
                    Threats Blocked
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-500/10">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-bold text-lg">Live</div>
                  <div className="text-sm text-muted-foreground">
                    Monitoring Status
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Performance Monitoring</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Activity
                  className={`h-4 w-4 ${realTimeMetrics ? "text-green-600 animate-pulse" : "text-gray-400"}`}
                />
                <span className="text-sm">
                  Real-time: {realTimeMetrics ? "ON" : "OFF"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRealTimeMetrics(!realTimeMetrics)}
              >
                {realTimeMetrics ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <Badge
                      variant={
                        metric.status === "good"
                          ? "outline"
                          : metric.status === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {metric.value.toLocaleString()}
                      <span className="text-lg text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {metric.trend === "up" && (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                      {metric.trend === "down" && (
                        <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
                      )}
                      {metric.trend === "stable" && <div className="h-4 w-4" />}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Target: {metric.target.toLocaleString()} {metric.unit}
                      </span>
                      <span>
                        {((metric.value / metric.target) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(metric.value / metric.target) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    component: "Load Balancers",
                    status: "healthy",
                    load: 67,
                    instances: 3,
                  },
                  {
                    component: "Application Servers",
                    status: "healthy",
                    load: 72,
                    instances: 8,
                  },
                  {
                    component: "Database Cluster",
                    status: "healthy",
                    load: 45,
                    instances: 3,
                  },
                  {
                    component: "Cache Layer",
                    status: "healthy",
                    load: 58,
                    instances: 6,
                  },
                  {
                    component: "Message Queue",
                    status: "healthy",
                    load: 34,
                    instances: 2,
                  },
                ].map((component, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="font-medium">{component.component}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {component.instances} instances
                      </div>
                      <div className="w-24">
                        <Progress value={component.load} className="h-2" />
                      </div>
                      <div className="text-sm font-medium w-12">
                        {component.load}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scaling" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Auto-Scaling Configuration
              </CardTitle>
              <CardDescription>
                Intelligent scaling based on demand patterns and performance
                metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Scale-Out Triggers</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Threshold:</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Memory Threshold:</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Network I/O:</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Queue Depth:</span>
                      <span className="font-medium">100 requests</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Current Scale</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compute Nodes:</span>
                      <span className="font-medium">8 / 12 max</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Database Replicas:</span>
                      <span className="font-medium">3 / 5 max</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cache Instances:</span>
                      <span className="font-medium">6 / 10 max</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CDN Edges:</span>
                      <span className="font-medium">15 / 25 max</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Scaling Actions</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={triggerAutoScale}
                    >
                      <Zap className="h-3 w-3 mr-2" />
                      Manual Scale Out
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Settings className="h-3 w-3 mr-2" />
                      Configure Rules
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <BarChart3 className="h-3 w-3 mr-2" />
                      View History
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scaling History & Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    time: "2024-12-20 14:30",
                    action: "Scale Out",
                    trigger: "CPU > 80%",
                    change: "+2 compute nodes",
                    duration: "15 minutes",
                  },
                  {
                    time: "2024-12-20 11:15",
                    action: "Scale In",
                    trigger: "Low demand period",
                    change: "-1 compute node",
                    duration: "8 minutes",
                  },
                  {
                    time: "2024-12-20 08:45",
                    action: "Scale Out",
                    trigger: "Queue depth > 100",
                    change: "+1 database replica",
                    duration: "12 minutes",
                  },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          event.action === "Scale Out"
                            ? "bg-green-500/10"
                            : "bg-blue-500/10"
                        }`}
                      >
                        {event.action === "Scale Out" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-blue-600 transform rotate-180" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {event.action}: {event.change}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.trigger}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{event.time}</div>
                      <div>{event.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  SOC 2 Type II
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Certified</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Valid until: March 2025
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  ISO 27001
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Certified</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Valid until: June 2025
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  POPIA Compliant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Compliant</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last audit: November 2024
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
              <CardDescription>
                Continuous monitoring of compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    control: "Data Encryption",
                    status: "compliant",
                    lastCheck: "2 hours ago",
                  },
                  {
                    control: "Access Controls",
                    status: "compliant",
                    lastCheck: "4 hours ago",
                  },
                  {
                    control: "Audit Logging",
                    status: "compliant",
                    lastCheck: "1 hour ago",
                  },
                  {
                    control: "Backup & Recovery",
                    status: "compliant",
                    lastCheck: "6 hours ago",
                  },
                  {
                    control: "Incident Response",
                    status: "compliant",
                    lastCheck: "3 hours ago",
                  },
                  {
                    control: "Vulnerability Management",
                    status: "compliant",
                    lastCheck: "5 hours ago",
                  },
                ].map((control, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{control.control}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{control.status}</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {control.lastCheck}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dedicated Infrastructure Support</CardTitle>
          <CardDescription>
            24/7 support for your dedicated infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>
              <PhoneCall className="h-4 w-4 mr-2" />
              Emergency Support
            </Button>
            <Button variant="outline">
              <Monitor className="h-4 w-4 mr-2" />
              Request Maintenance
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Infrastructure Report
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Custom Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
