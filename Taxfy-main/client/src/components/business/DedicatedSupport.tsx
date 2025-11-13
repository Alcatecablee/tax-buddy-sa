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
  Phone,
  MessageSquare,
  Users,
  Clock,
  Star,
  CheckCircle,
  Calendar,
  Mail,
  Video,
  HeartHandshake,
  Award,
  Target,
  TrendingUp,
  Bell,
  AlertTriangle,
  User,
  Settings,
  Download,
  Upload,
  Eye,
  RefreshCw,
  Shield,
  Zap,
  Crown,
  Sparkles,
  Activity,
  BarChart3,
  FileText,
  Headphones,
  PhoneCall,
  Mic,
  MicOff,
  VideoOff,
  Share,
} from "lucide-react";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "pending" | "resolved" | "closed";
  category: "technical" | "billing" | "compliance" | "integration" | "training";
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
  slaDeadline: Date;
  resolutionTime?: number;
  satisfaction?: number;
}

interface AccountManager {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  photo: string;
  specialties: string[];
  availability: string;
  timezone: string;
  languages: string[];
  yearsExperience: number;
  clientCount: number;
  satisfactionScore: number;
}

interface SupportSession {
  id: string;
  type: "phone" | "video" | "chat" | "screen_share";
  status: "scheduled" | "active" | "completed" | "cancelled";
  startTime: Date;
  duration: number;
  participants: string[];
  topic: string;
  recording?: string;
  notes?: string;
}

export default function DedicatedSupport() {
  const [activeCall, setActiveCall] = useState(false);
  const [supportQueue, setSupportQueue] = useState(2);
  const [responseTime, setResponseTime] = useState(0);

  // Mock data
  const accountManager: AccountManager = {
    id: "am_001",
    name: "Sarah Williams",
    title: "Senior Enterprise Account Manager",
    email: "sarah.williams@taxfy.co.za",
    phone: "+27 11 123 4567",
    photo: "/api/placeholder/120/120",
    specialties: [
      "Enterprise Tax Solutions",
      "Compliance Management",
      "System Integration",
      "Training & Onboarding",
    ],
    availability: "24/7 (Primary: 08:00-17:00 SAST)",
    timezone: "SAST (UTC+2)",
    languages: ["English", "Afrikaans"],
    yearsExperience: 8,
    clientCount: 25,
    satisfactionScore: 4.9,
  };

  const supportTickets: SupportTicket[] = [
    {
      id: "ticket_001",
      title: "SAP Integration Performance Issues",
      description:
        "Experiencing slow response times during peak hours when syncing payroll data from SAP",
      priority: "high",
      status: "in_progress",
      category: "technical",
      createdAt: new Date("2024-12-20T09:30:00"),
      updatedAt: new Date("2024-12-20T11:15:00"),
      assignedTo: "Marcus Chen - Senior Technical Specialist",
      slaDeadline: new Date("2024-12-20T17:30:00"),
      resolutionTime: undefined,
      satisfaction: undefined,
    },
    {
      id: "ticket_002",
      title: "Monthly Compliance Report Training",
      description:
        "Need training session for new compliance officer on generating monthly reports",
      priority: "medium",
      status: "pending",
      category: "training",
      createdAt: new Date("2024-12-19T14:20:00"),
      updatedAt: new Date("2024-12-20T08:45:00"),
      assignedTo: "Sarah Williams - Account Manager",
      slaDeadline: new Date("2024-12-21T14:20:00"),
      resolutionTime: undefined,
      satisfaction: undefined,
    },
    {
      id: "ticket_003",
      title: "Enterprise License Upgrade",
      description:
        "Request to upgrade from Enterprise Pro to Enterprise Elite with additional features",
      priority: "medium",
      status: "open",
      category: "billing",
      createdAt: new Date("2024-12-20T10:00:00"),
      updatedAt: new Date("2024-12-20T10:00:00"),
      assignedTo: "Lisa Rodriguez - Billing Specialist",
      slaDeadline: new Date("2024-12-22T10:00:00"),
      resolutionTime: undefined,
      satisfaction: undefined,
    },
  ];

  const recentSessions: SupportSession[] = [
    {
      id: "session_001",
      type: "video",
      status: "completed",
      startTime: new Date("2024-12-20T09:00:00"),
      duration: 45,
      participants: [
        "Sarah Williams",
        "Client: John Smith",
        "Technical: Marcus Chen",
      ],
      topic: "Monthly Business Review - Q4 Performance",
      recording: "recording_001.mp4",
      notes:
        "Discussed performance metrics, upcoming features, and optimization opportunities",
    },
    {
      id: "session_002",
      type: "phone",
      status: "completed",
      startTime: new Date("2024-12-19T15:30:00"),
      duration: 22,
      participants: ["Sarah Williams", "Client: Jane Doe"],
      topic: "Integration Planning Discussion",
      notes: "Planned new QuickBooks integration timeline and requirements",
    },
    {
      id: "session_003",
      type: "screen_share",
      status: "completed",
      startTime: new Date("2024-12-18T11:00:00"),
      duration: 60,
      participants: ["Marcus Chen", "Client: Tech Team"],
      topic: "API Integration Training Session",
      recording: "recording_003.mp4",
      notes: "Comprehensive API training with hands-on implementation guidance",
    },
  ];

  const initiateCall = () => {
    setActiveCall(true);
  };

  const endCall = () => {
    setActiveCall(false);
  };

  // Simulate real-time support metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseTime(Math.floor(Math.random() * 10) + 5); // 5-15 seconds
      setSupportQueue(Math.floor(Math.random() * 5)); // 0-4 people in queue
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-green-500/20 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Headphones className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  24/7 Dedicated Support
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    Enterprise Pro & Elite
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  Premium support with dedicated account management and instant
                  assistance
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                24/7 Available
              </div>
              <Button onClick={initiateCall} disabled={activeCall}>
                {activeCall ? (
                  <>
                    <PhoneCall className="h-4 w-4 mr-2 animate-pulse" />
                    In Call...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Call Interface */}
      {activeCall && (
        <Alert className="border-green-500/20 bg-green-500/10">
          <PhoneCall className="h-4 w-4 text-green-600 animate-pulse" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium">
                Connected to Enterprise Support
              </span>
              <div className="text-sm text-muted-foreground mt-1">
                Sarah Williams - Your Dedicated Account Manager
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Mic className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Video className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Share className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="destructive" onClick={endCall}>
                End Call
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Support Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {responseTime}s
            </div>
            <p className="text-xs text-muted-foreground">Average pickup time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Queue</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportQueue}</div>
            <p className="text-xs text-muted-foreground">People ahead of you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfaction Score
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {accountManager.satisfactionScore}
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.floor(accountManager.satisfactionScore) ? "text-yellow-600 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                supportTickets.filter(
                  (t) => t.status !== "closed" && t.status !== "resolved",
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {supportTickets.length} total tickets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Support Tabs */}
      <Tabs defaultValue="account-manager" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account-manager">Account Manager</TabsTrigger>
          <TabsTrigger value="support-tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="support-channels">Support Channels</TabsTrigger>
          <TabsTrigger value="session-history">Session History</TabsTrigger>
        </TabsList>

        <TabsContent value="account-manager" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Dedicated Account Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={accountManager.photo}
                    alt={accountManager.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{accountManager.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {accountManager.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-600 fill-current" />
                      <span className="text-sm font-medium">
                        {accountManager.satisfactionScore}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({accountManager.clientCount} clients)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Email:
                    </span>
                    <span className="text-sm font-medium">
                      {accountManager.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Phone:
                    </span>
                    <span className="text-sm font-medium">
                      {accountManager.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Availability:
                    </span>
                    <span className="text-sm font-medium">
                      {accountManager.availability}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Timezone:
                    </span>
                    <span className="text-sm font-medium">
                      {accountManager.timezone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Experience:
                    </span>
                    <span className="text-sm font-medium">
                      {accountManager.yearsExperience} years
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Languages:</h4>
                  <div className="flex gap-2">
                    {accountManager.languages.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Specialties:</h4>
                  <div className="space-y-1">
                    {accountManager.specialties.map((specialty, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={initiateCall}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Quick Actions & Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Phone className="h-6 w-6" />
                    <span className="text-sm">Emergency Call</span>
                    <span className="text-xs text-muted-foreground">
                      24/7 Available
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Schedule Meeting</span>
                    <span className="text-xs text-muted-foreground">
                      Business Review
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">Live Chat</span>
                    <span className="text-xs text-muted-foreground">
                      Instant Support
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Share className="h-6 w-6" />
                    <span className="text-sm">Screen Share</span>
                    <span className="text-xs text-muted-foreground">
                      Technical Help
                    </span>
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Upcoming Scheduled Sessions:</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            Quarterly Business Review
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Performance review and strategy planning
                          </div>
                        </div>
                        <Badge variant="outline">Tomorrow</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Dec 21, 2024 • 10:00 AM SAST • 60 minutes
                      </div>
                    </div>
                    <div className="p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            Integration Training
                          </div>
                          <div className="text-sm text-muted-foreground">
                            New team member onboarding
                          </div>
                        </div>
                        <Badge variant="outline">Next Week</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Dec 26, 2024 • 2:00 PM SAST • 45 minutes
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support-tickets" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Your Support Tickets</h3>
            <div className="flex-1" />
            <Button>
              <Bell className="h-4 w-4 mr-2" />
              Create New Ticket
            </Button>
          </div>

          {supportTickets.map((ticket) => (
            <Card key={ticket.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {ticket.title}
                      <Badge
                        variant={
                          ticket.priority === "critical"
                            ? "destructive"
                            : ticket.priority === "high"
                              ? "secondary"
                              : ticket.priority === "medium"
                                ? "outline"
                                : "outline"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {ticket.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created: {ticket.createdAt.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ticket.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        SLA: {ticket.slaDeadline.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        ticket.status === "open"
                          ? "destructive"
                          : ticket.status === "in_progress"
                            ? "secondary"
                            : ticket.status === "pending"
                              ? "outline"
                              : "outline"
                      }
                    >
                      {ticket.status.replace("_", " ")}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {ticket.category}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Last updated: {ticket.updatedAt.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-2" />
                      Add Comment
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm">
                      <Phone className="h-3 w-3 mr-2" />
                      Call About This
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="support-channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Phone Support
                </CardTitle>
                <CardDescription>
                  Immediate assistance with 2-hour SLA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded border">
                  <div className="text-3xl font-bold text-green-600">
                    +27 11 123 4567
                  </div>
                  <div className="text-sm text-muted-foreground">
                    24/7 Enterprise Hotline
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">Average Wait</div>
                    <div className="text-green-600">{responseTime} seconds</div>
                  </div>
                  <div>
                    <div className="font-medium">Availability</div>
                    <div className="text-green-600">24/7/365</div>
                  </div>
                </div>
                <Button className="w-full" onClick={initiateCall}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  Video Support
                </CardTitle>
                <CardDescription>
                  Screen sharing and visual assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded border">
                  <Video className="h-12 w-12 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium">HD Video Calls</div>
                  <div className="text-sm text-muted-foreground">
                    Screen sharing included
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">Resolution</div>
                    <div className="text-blue-600">1080p HD</div>
                  </div>
                  <div>
                    <div className="font-medium">Recording</div>
                    <div className="text-blue-600">Available</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Start Video Call
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Live Chat
                </CardTitle>
                <CardDescription>
                  Instant messaging with support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded border">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium">Real-time Chat</div>
                  <div className="text-sm text-muted-foreground">
                    File sharing supported
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">Response</div>
                    <div className="text-purple-600">Instant</div>
                  </div>
                  <div>
                    <div className="font-medium">History</div>
                    <div className="text-purple-600">Saved</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-600" />
                  Email Support
                </CardTitle>
                <CardDescription>
                  Detailed responses within 4 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded border">
                  <Mail className="h-12 w-12 mx-auto mb-2 text-orange-600" />
                  <div className="font-medium">Priority Email</div>
                  <div className="text-sm text-muted-foreground">
                    Detailed documentation
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">Response</div>
                    <div className="text-orange-600">4 hours</div>
                  </div>
                  <div>
                    <div className="font-medium">Tracking</div>
                    <div className="text-orange-600">Full History</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="session-history" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Support Session History</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>

          {recentSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        session.type === "phone"
                          ? "bg-green-500/10"
                          : session.type === "video"
                            ? "bg-blue-500/10"
                            : session.type === "chat"
                              ? "bg-purple-500/10"
                              : "bg-orange-500/10"
                      }`}
                    >
                      {session.type === "phone" && (
                        <Phone className="h-5 w-5 text-green-600" />
                      )}
                      {session.type === "video" && (
                        <Video className="h-5 w-5 text-blue-600" />
                      )}
                      {session.type === "chat" && (
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      )}
                      {session.type === "screen_share" && (
                        <Share className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{session.topic}</CardTitle>
                      <CardDescription className="mt-1">
                        {session.type.replace("_", " ")} session •{" "}
                        {session.duration} minutes
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.startTime.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {session.participants.length} participants
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{session.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Participants:</h4>
                    <div className="flex gap-2">
                      {session.participants.map((participant, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {session.notes && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">
                        Session Notes:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {session.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {session.recording && (
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-2" />
                        View Recording
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-2" />
                      Download Notes
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Schedule Follow-up
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
