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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Play,
  CheckCircle,
  Star,
  Award,
  Target,
  TrendingUp,
  FileText,
  Video,
  Headphones,
  MessageSquare,
  Download,
  ExternalLink,
  Plus,
  Settings,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: "platform" | "tax-law" | "compliance" | "advanced";
  type: "video" | "interactive" | "document" | "webinar";
  duration: number; // in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number;
  completed: boolean;
  certification: boolean;
  prerequisites?: string[];
  tags: string[];
}

interface TrainingSession {
  id: string;
  title: string;
  instructor: string;
  type: "live" | "recorded" | "hands-on";
  date: Date;
  duration: number;
  capacity: number;
  enrolled: number;
  status: "upcoming" | "live" | "completed";
  description: string;
  level: "beginner" | "intermediate" | "advanced";
}

interface TrainingProgress {
  totalModules: number;
  completedModules: number;
  hoursSpent: number;
  certificationsEarned: number;
  currentStreak: number;
}

export default function StaffTraining() {
  const [activeTab, setActiveTab] = useState("modules");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const { toast } = useCustomToast();

  // Mock training data
  useEffect(() => {
    const mockModules: TrainingModule[] = [
      {
        id: "mod-1",
        title: "Taxfy Platform Fundamentals",
        description:
          "Complete introduction to the Taxfy platform, features, and navigation",
        category: "platform",
        type: "interactive",
        duration: 45,
        difficulty: "beginner",
        progress: 100,
        completed: true,
        certification: true,
        tags: ["basics", "navigation", "features"],
      },
      {
        id: "mod-2",
        title: "Advanced Tax Calculations",
        description:
          "Deep dive into complex tax scenarios and calculation methodologies",
        category: "tax-law",
        type: "video",
        duration: 90,
        difficulty: "advanced",
        progress: 65,
        completed: false,
        certification: true,
        prerequisites: ["mod-1"],
        tags: ["calculations", "complex-returns", "methodology"],
      },
      {
        id: "mod-3",
        title: "SARS Compliance Updates 2025",
        description: "Latest compliance requirements and regulatory changes",
        category: "compliance",
        type: "webinar",
        duration: 60,
        difficulty: "intermediate",
        progress: 0,
        completed: false,
        certification: true,
        tags: ["compliance", "regulations", "updates"],
      },
      {
        id: "mod-4",
        title: "Client Management Best Practices",
        description:
          "Effective strategies for managing client relationships and communications",
        category: "advanced",
        type: "video",
        duration: 75,
        difficulty: "intermediate",
        progress: 30,
        completed: false,
        certification: false,
        tags: ["client-management", "communication", "best-practices"],
      },
    ];

    const mockSessions: TrainingSession[] = [
      {
        id: "sess-1",
        title: "Live Q&A: Complex Tax Scenarios",
        instructor: "Sarah Mitchell, CPA",
        type: "live",
        date: new Date("2025-01-15T14:00:00"),
        duration: 60,
        capacity: 50,
        enrolled: 23,
        status: "upcoming",
        description:
          "Interactive session covering complex tax scenarios with live Q&A",
        level: "advanced",
      },
      {
        id: "sess-2",
        title: "Hands-on: Bulk Processing Workshop",
        instructor: "David Chen, Tax Expert",
        type: "hands-on",
        date: new Date("2025-01-20T10:00:00"),
        duration: 120,
        capacity: 25,
        enrolled: 18,
        status: "upcoming",
        description:
          "Practical workshop on efficient bulk processing techniques",
        level: "intermediate",
      },
      {
        id: "sess-3",
        title: "Platform Updates & New Features",
        instructor: "Alex Johnson, Product Manager",
        type: "live",
        date: new Date("2025-01-25T15:30:00"),
        duration: 45,
        capacity: 100,
        enrolled: 67,
        status: "upcoming",
        description:
          "Overview of latest platform updates and upcoming features",
        level: "beginner",
      },
    ];

    const mockProgress: TrainingProgress = {
      totalModules: 12,
      completedModules: 3,
      hoursSpent: 8.5,
      certificationsEarned: 2,
      currentStreak: 5,
    };

    setModules(mockModules);
    setSessions(mockSessions);
    setProgress(mockProgress);
  }, []);

  const handleStartModule = (moduleId: string) => {
    toast({
      title: "Module Started",
      description: "Opening training module...",
    });
  };

  const handleEnrollSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, enrolled: session.enrolled + 1 }
          : session,
      ),
    );

    toast({
      title: "Enrolled Successfully",
      description: "You've been enrolled in the training session",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "platform":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "tax-law":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "compliance":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "advanced":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-600";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-600";
      case "advanced":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "interactive":
        return Play;
      case "document":
        return FileText;
      case "webinar":
        return Headphones;
      case "live":
        return Video;
      case "hands-on":
        return Settings;
      default:
        return BookOpen;
    }
  };

  const filteredModules =
    selectedCategory === "all"
      ? modules
      : modules.filter((module) => module.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Staff Training & Onboarding
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  Enterprise
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg">
                Comprehensive training programs to maximize your team's
                productivity
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Request Custom Training
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      {progress && (
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {progress.completedModules}/{progress.totalModules}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Modules Completed
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <Progress
                value={
                  (progress.completedModules / progress.totalModules) * 100
                }
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {progress.hoursSpent}hrs
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Training Time
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {progress.certificationsEarned}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Certifications
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {progress.currentStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Day Streak
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Training Modules</TabsTrigger>
          <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            <Button
              variant={selectedCategory === "platform" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("platform")}
            >
              Platform
            </Button>
            <Button
              variant={selectedCategory === "tax-law" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("tax-law")}
            >
              Tax Law
            </Button>
            <Button
              variant={
                selectedCategory === "compliance" ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategory("compliance")}
            >
              Compliance
            </Button>
            <Button
              variant={selectedCategory === "advanced" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("advanced")}
            >
              Advanced
            </Button>
          </div>

          {/* Training Modules */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => {
              const TypeIcon = getTypeIcon(module.type);
              return (
                <Card
                  key={module.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(module.category)}
                          >
                            {module.category}
                          </Badge>
                        </div>
                      </div>
                      {module.completed && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {module.title}
                    </CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration} min
                        </span>
                        <Badge
                          variant="secondary"
                          className={getDifficultyColor(module.difficulty)}
                        >
                          {module.difficulty}
                        </Badge>
                      </div>

                      {module.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {module.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        className="w-full"
                        variant={module.completed ? "outline" : "default"}
                        onClick={() => handleStartModule(module.id)}
                      >
                        {module.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review
                          </>
                        ) : module.progress > 0 ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>

                      {module.certification && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Award className="w-4 h-4" />
                          Certification available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid gap-6">
            {sessions.map((session) => {
              const TypeIcon = getTypeIcon(session.type);
              return (
                <Card
                  key={session.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              {session.title}
                            </h3>
                            <Badge
                              variant={
                                session.status === "live"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {session.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">
                            {session.description}
                          </p>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{session.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{session.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {session.enrolled}/{session.capacity} enrolled
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span>Instructor: {session.instructor}</span>
                            <Badge
                              variant="secondary"
                              className={getDifficultyColor(session.level)}
                            >
                              {session.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleEnrollSession(session.id)}
                          disabled={session.enrolled >= session.capacity}
                        >
                          {session.enrolled >= session.capacity
                            ? "Full"
                            : "Enroll"}
                        </Button>
                        <Progress
                          value={(session.enrolled / session.capacity) * 100}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules
              .filter((m) => m.certification && m.completed)
              .map((module) => (
                <Card
                  key={module.id}
                  className="border-2 border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                    <CardTitle className="text-lg">
                      Certificate of Completion
                    </CardTitle>
                    <CardDescription>{module.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Completed on: {new Date().toLocaleDateString()}
                      </div>
                      <Button variant="outline" className="w-full gap-2">
                        <Download className="w-4 h-4" />
                        Download Certificate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Placeholder for available certifications */}
            {modules
              .filter((m) => m.certification && !m.completed)
              .map((module) => (
                <Card
                  key={module.id}
                  className="border-dashed border-2 opacity-60"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-gray-500" />
                    </div>
                    <CardTitle className="text-lg">
                      Certificate Available
                    </CardTitle>
                    <CardDescription>{module.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Complete the module to earn this certificate
                      </div>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => handleStartModule(module.id)}
                      >
                        <Play className="w-4 h-4" />
                        Complete Module
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
