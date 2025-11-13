import React, { useState } from "react";
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
  Award,
  Clock,
  DollarSign,
  Calendar,
  Video,
  Phone,
  Mail,
  MessageSquare,
  Star,
  BookOpen,
  FileText,
  TrendingUp,
  Target,
  CheckCircle,
  Eye,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Crown,
  Sparkles,
  Globe,
  Building,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  BarChart3,
  RefreshCw,
  Share,
  AlertTriangle,
  Info,
} from "lucide-react";

interface TaxExpert {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: "available" | "busy" | "offline";
  languages: string[];
  certifications: string[];
  location: string;
  photo: string;
  bio: string;
  completedConsultations: number;
  successRate: number;
}

interface ConsultationSession {
  id: string;
  expertId: string;
  clientName: string;
  topic: string;
  type:
    | "strategy"
    | "compliance"
    | "optimization"
    | "audit_support"
    | "planning";
  scheduledDate: Date;
  duration: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  hourlyRate: number;
  totalCost: number;
  description: string;
  documents: string[];
  recordings?: string;
  summary?: string;
  actionItems: string[];
  followUpRequired: boolean;
}

interface ExpertiseArea {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  averageRate: number;
  experts: number;
  commonIssues: string[];
  deliverables: string[];
}

export default function TaxExpertConsulting() {
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState("all");

  // Mock data
  const taxExperts: TaxExpert[] = [
    {
      id: "expert_001",
      name: "Dr. Sarah Mitchell",
      title: "Senior Tax Strategist & SARS Specialist",
      specializations: [
        "SARS Compliance",
        "Corporate Tax Strategy",
        "International Tax",
        "Mergers & Acquisitions",
      ],
      experience: 15,
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 1800,
      availability: "available",
      languages: ["English", "Afrikaans"],
      certifications: ["CA(SA)", "CTA", "SARS Advanced Tax Certificate"],
      location: "Johannesburg, South Africa",
      photo: "/api/placeholder/120/120",
      bio: "Dr. Mitchell is a leading tax expert with 15 years of experience in complex corporate tax matters. She has successfully guided over 200 companies through SARS audits and tax optimization strategies.",
      completedConsultations: 485,
      successRate: 98.5,
    },
    {
      id: "expert_002",
      name: "Marcus Chen",
      title: "International Tax Advisor",
      specializations: [
        "Cross-border Taxation",
        "Transfer Pricing",
        "Double Taxation Treaties",
        "Global Compliance",
      ],
      experience: 12,
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 1650,
      availability: "available",
      languages: ["English", "Mandarin", "Afrikaans"],
      certifications: [
        "CA(SA)",
        "International Tax Planning Certificate",
        "OECD Transfer Pricing Guidelines",
      ],
      location: "Cape Town, South Africa",
      photo: "/api/placeholder/120/120",
      bio: "Marcus specializes in international tax planning and has helped multinational corporations save millions in tax through strategic structuring and compliance optimization.",
      completedConsultations: 356,
      successRate: 97.2,
    },
    {
      id: "expert_003",
      name: "Prof. Lisa Rodriguez",
      title: "Tax Litigation & Audit Defense Specialist",
      specializations: [
        "SARS Audits",
        "Tax Litigation",
        "Dispute Resolution",
        "Penalty Mitigation",
      ],
      experience: 18,
      rating: 4.9,
      reviewCount: 156,
      hourlyRate: 2100,
      availability: "busy",
      languages: ["English", "Spanish", "Portuguese"],
      certifications: [
        "CA(SA)",
        "Tax Court Advocate",
        "Advanced Litigation Certificate",
      ],
      location: "Durban, South Africa",
      photo: "/api/placeholder/120/120",
      bio: "Prof. Rodriguez is renowned for her expertise in tax litigation and has successfully defended clients in high-profile SARS disputes, achieving favorable outcomes in 95% of cases.",
      completedConsultations: 623,
      successRate: 99.1,
    },
  ];

  const consultationSessions: ConsultationSession[] = [
    {
      id: "session_001",
      expertId: "expert_001",
      clientName: "ABC Holdings Ltd",
      topic: "Corporate Restructuring Tax Implications",
      type: "strategy",
      scheduledDate: new Date("2024-12-21T14:00:00"),
      duration: 120,
      status: "scheduled",
      hourlyRate: 1800,
      totalCost: 3600,
      description:
        "Strategic consultation on tax-efficient corporate restructuring for upcoming merger",
      documents: ["Financial_Statements_2024.pdf", "Proposed_Structure.pdf"],
      actionItems: [],
      followUpRequired: true,
    },
    {
      id: "session_002",
      expertId: "expert_003",
      clientName: "XYZ Manufacturing",
      topic: "SARS Audit Defense Strategy",
      type: "audit_support",
      scheduledDate: new Date("2024-12-20T09:00:00"),
      duration: 90,
      status: "completed",
      hourlyRate: 2100,
      totalCost: 3150,
      description:
        "Preparation and strategy for upcoming SARS comprehensive audit",
      documents: ["Audit_Notice.pdf", "Supporting_Documents.zip"],
      recordings: "session_002_recording.mp4",
      summary:
        "Developed comprehensive audit defense strategy, prepared documentation package, and outlined response timeline.",
      actionItems: [
        "Prepare detailed transaction documentation",
        "Review all expense claims for past 3 years",
        "Schedule follow-up meeting with internal team",
      ],
      followUpRequired: true,
    },
  ];

  const expertiseAreas: ExpertiseArea[] = [
    {
      id: "strategy",
      name: "Tax Strategy & Planning",
      description: "Long-term tax planning and optimization strategies",
      icon: Target,
      averageRate: 1650,
      experts: 8,
      commonIssues: [
        "Corporate restructuring",
        "Tax-efficient investments",
        "Succession planning",
      ],
      deliverables: [
        "Strategic tax plan",
        "Implementation roadmap",
        "Risk analysis",
      ],
    },
    {
      id: "compliance",
      name: "Compliance & Regulatory",
      description: "SARS compliance and regulatory guidance",
      icon: Shield,
      averageRate: 1500,
      experts: 12,
      commonIssues: [
        "SARS submissions",
        "Regulatory changes",
        "Compliance audits",
      ],
      deliverables: [
        "Compliance checklist",
        "Filing assistance",
        "Risk assessment",
      ],
    },
    {
      id: "optimization",
      name: "Tax Optimization",
      description: "Immediate tax savings and efficiency improvements",
      icon: TrendingUp,
      averageRate: 1400,
      experts: 10,
      commonIssues: [
        "Deduction optimization",
        "Credit utilization",
        "Structure efficiency",
      ],
      deliverables: [
        "Optimization report",
        "Implementation plan",
        "Savings projection",
      ],
    },
    {
      id: "audit_support",
      name: "Audit Support & Defense",
      description: "SARS audit preparation and representation",
      icon: Briefcase,
      averageRate: 2000,
      experts: 6,
      commonIssues: [
        "Audit preparation",
        "Document organization",
        "SARS representation",
      ],
      deliverables: [
        "Audit strategy",
        "Documentation package",
        "Representation services",
      ],
    },
    {
      id: "international",
      name: "International Tax",
      description: "Cross-border tax planning and compliance",
      icon: Globe,
      averageRate: 1800,
      experts: 5,
      commonIssues: [
        "Transfer pricing",
        "Double taxation",
        "Cross-border structures",
      ],
      deliverables: [
        "International tax plan",
        "Treaty analysis",
        "Compliance strategy",
      ],
    },
  ];

  const filteredExperts =
    selectedExpertise === "all"
      ? taxExperts
      : taxExperts.filter((expert) =>
          expert.specializations.some((spec) =>
            spec.toLowerCase().includes(selectedExpertise.toLowerCase()),
          ),
        );

  const availableExperts = taxExperts.filter(
    (expert) => expert.availability === "available",
  ).length;
  const averageRating =
    taxExperts.reduce((sum, expert) => sum + expert.rating, 0) /
    taxExperts.length;
  const totalConsultations = taxExperts.reduce(
    (sum, expert) => sum + expert.completedConsultations,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Tax Expert Consulting Services
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium Service
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  Expert tax consultations at R1,500/hour with certified South
                  African tax professionals
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-green-600" />
                {availableExperts} experts available
              </div>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Book Consultation
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Service Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Experts
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableExperts}</div>
            <p className="text-xs text-muted-foreground">
              {taxExperts.length} total experts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.floor(averageRating) ? "text-yellow-600 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsultations}</div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(
                taxExperts.reduce(
                  (sum, expert) => sum + expert.successRate,
                  0,
                ) / taxExperts.length
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Client satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Consulting Tabs */}
      <Tabs defaultValue="experts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="experts">Expert Directory</TabsTrigger>
          <TabsTrigger value="expertise">Expertise Areas</TabsTrigger>
          <TabsTrigger value="sessions">My Consultations</TabsTrigger>
          <TabsTrigger value="booking">Book Session</TabsTrigger>
        </TabsList>

        <TabsContent value="experts" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                Filter by Expertise:
              </label>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Experts</option>
                <option value="sars">SARS Compliance</option>
                <option value="corporate">Corporate Tax</option>
                <option value="international">International Tax</option>
                <option value="audit">Audit Support</option>
                <option value="planning">Tax Planning</option>
              </select>
            </div>
            <div className="flex-1" />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search Experts
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
          </div>

          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      src={expert.photo}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {expert.name}
                        <Badge
                          variant={
                            expert.availability === "available"
                              ? "outline"
                              : expert.availability === "busy"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {expert.availability}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {expert.title}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {expert.experience} years experience
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-600" />
                          {expert.rating} ({expert.reviewCount} reviews)
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {expert.successRate}% success rate
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      R{expert.hourlyRate}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per hour
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{expert.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Specializations:
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {expert.specializations.map((spec, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Certifications:
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {expert.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold">
                      {expert.completedConsultations}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Consultations
                    </div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold text-green-600">
                      {expert.successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                  <div className="p-2 rounded border">
                    <div className="text-lg font-bold">
                      {expert.languages.join(", ")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Languages
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={expert.availability !== "available"}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expertise" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertiseAreas.map((area) => (
              <Card key={area.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <area.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{area.name}</CardTitle>
                      <CardDescription>{area.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Average Rate:
                    </span>
                    <span className="font-bold text-green-600">
                      R{area.averageRate}/hour
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Available Experts:
                    </span>
                    <span className="font-medium">{area.experts}</span>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Common Issues:</h4>
                    <ul className="space-y-1">
                      {area.commonIssues.map((issue, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Typical Deliverables:
                    </h4>
                    <ul className="space-y-1">
                      {area.deliverables.map((deliverable, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <FileText className="h-3 w-3 text-blue-600" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Find Expert
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">My Consultation Sessions</h3>
            <div className="flex-1" />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>

          {consultationSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{session.topic}</CardTitle>
                    <CardDescription className="mt-1">
                      {session.type.replace("_", " ")} session with{" "}
                      {taxExperts.find((e) => e.id === session.expertId)?.name}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {session.scheduledDate.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration} minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />R
                        {session.totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      session.status === "completed"
                        ? "outline"
                        : session.status === "scheduled"
                          ? "secondary"
                          : session.status === "in_progress"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {session.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {session.description}
                </p>

                {session.documents.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Session Documents:
                    </h4>
                    <div className="flex gap-2">
                      {session.documents.map((doc, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {session.summary && (
                  <div className="p-3 rounded border bg-muted/50">
                    <h4 className="font-medium text-sm mb-1">
                      Session Summary:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {session.summary}
                    </p>
                  </div>
                )}

                {session.actionItems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Action Items:</h4>
                    <ul className="space-y-1">
                      {session.actionItems.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  {session.status === "scheduled" && (
                    <>
                      <Button size="sm">
                        <Video className="h-3 w-3 mr-2" />
                        Join Session
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-2" />
                        Reschedule
                      </Button>
                    </>
                  )}
                  {session.recordings && (
                    <Button size="sm" variant="outline">
                      <Video className="h-3 w-3 mr-2" />
                      View Recording
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-2" />
                    Download Summary
                  </Button>
                  {session.followUpRequired && (
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Book Follow-up
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book a Tax Consultation</CardTitle>
              <CardDescription>
                Schedule a consultation with our certified tax experts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Consultation Type
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Tax Strategy & Planning</option>
                      <option>SARS Compliance Review</option>
                      <option>Audit Support & Defense</option>
                      <option>International Tax Matters</option>
                      <option>Corporate Restructuring</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Preferred Expert
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Any Available Expert</option>
                      {taxExperts
                        .filter((e) => e.availability === "available")
                        .map((expert) => (
                          <option key={expert.id} value={expert.id}>
                            {expert.name} - R{expert.hourlyRate}/hour
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Session Duration
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="60">60 minutes - R1,500</option>
                      <option value="90">90 minutes - R2,250</option>
                      <option value="120">120 minutes - R3,000</option>
                      <option value="180">180 minutes - R4,500</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your tax situation and what you'd like to discuss..."
                      className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Preferred Date & Time
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <input
                        type="date"
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="time"
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Contact Information
                    </label>
                    <div className="space-y-2 mt-1">
                      <input
                        type="email"
                        placeholder="Email address"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="tel"
                        placeholder="Phone number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Upload Documents (Optional)
                    </label>
                    <div className="mt-1 border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">
                        Drop files here or click to upload
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        PDF, Excel, Word files up to 10MB
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-green-500/10">
                    <h4 className="font-medium text-green-800 mb-2">
                      Consultation Benefits:
                    </h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        Expert advice from certified professionals
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        Personalized tax strategies
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        Written summary and action plan
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        Follow-up support included
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation - R1,500
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call to Discuss
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
