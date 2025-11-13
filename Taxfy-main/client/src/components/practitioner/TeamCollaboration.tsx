import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  MessageSquare,
  CheckCircle,
  Clock,
  UserPlus,
  Settings,
  Search,
  Filter,
  Calendar,
  FileText,
  Share2,
  Bell,
  User,
  Mail,
  Phone,
  Shield,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "practitioner" | "assistant";
  avatar?: string;
  status: "active" | "inactive" | "pending";
  lastActive: Date;
  permissions: string[];
  clientsAssigned: number;
  tasksCompleted: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "review" | "completed";
  dueDate: Date;
  createdAt: Date;
  clientId?: string;
  tags: string[];
}

interface TeamComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  timestamp: Date;
  mentions?: string[];
}

export const TeamCollaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<TeamComment[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const { toast } = useCustomToast();

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    // In production, this would fetch from your API
    const mockTeamMembers: TeamMember[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@taxfirm.co.za",
        role: "admin",
        status: "active",
        lastActive: new Date(),
        permissions: ["all"],
        clientsAssigned: 25,
        tasksCompleted: 45,
      },
      {
        id: "2",
        name: "David Smith",
        email: "david@taxfirm.co.za",
        role: "practitioner",
        status: "active",
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        permissions: ["client_management", "tax_calculations"],
        clientsAssigned: 18,
        tasksCompleted: 32,
      },
      {
        id: "3",
        name: "Lisa Chen",
        email: "lisa@taxfirm.co.za",
        role: "assistant",
        status: "active",
        lastActive: new Date(Date.now() - 30 * 60 * 1000),
        permissions: ["data_entry", "client_communication"],
        clientsAssigned: 12,
        tasksCompleted: 28,
      },
    ];

    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Review ABC Corp Tax Return",
        description:
          "Complete review of ABC Corporation's annual tax return submission",
        assignedTo: "2",
        assignedBy: "1",
        priority: "high",
        status: "in-progress",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        clientId: "abc-corp",
        tags: ["review", "corporate", "urgent"],
      },
      {
        id: "2",
        title: "Prepare Monthly Report",
        description: "Generate monthly tax processing report for management",
        assignedTo: "3",
        assignedBy: "1",
        priority: "medium",
        status: "pending",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        tags: ["reporting", "monthly"],
      },
    ];

    setTeamMembers(mockTeamMembers);
    setTasks(mockTasks);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "manager":
        return "bg-primary/10 text-primary border-primary/20";
      case "practitioner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "assistant":
        return "bg-muted text-muted-foreground border-muted-foreground/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "pending":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "medium":
        return "bg-primary/10 text-primary border-primary/20";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-primary/10 text-primary border-primary/20";
      case "review":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "pending":
        return "bg-muted text-muted-foreground border-muted-foreground/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const addTeamMember = () => {
    toast({
      title: "Invite Sent",
      description: "Team member invitation has been sent via email",
    });
    setShowAddMember(false);
  };

  const addTask = () => {
    toast({
      title: "Task Created",
      description: "New task has been assigned successfully",
    });
    setShowAddTask(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Team Collaboration
          </CardTitle>
          <p className="text-muted-foreground">
            Manage your tax practice team, assign tasks, and collaborate
            efficiently
          </p>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Team Members
                    </p>
                    <p className="text-2xl font-bold">{teamMembers.length}</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Active Tasks
                    </p>
                    <p className="text-2xl font-bold">
                      {tasks.filter((t) => t.status !== "completed").length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Pending Reviews
                    </p>
                    <p className="text-2xl font-bold">
                      {tasks.filter((t) => t.status === "review").length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Total Clients
                    </p>
                    <p className="text-2xl font-bold">
                      {teamMembers.reduce(
                        (sum, m) => sum + m.clientsAssigned,
                        0,
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Tasks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className={getPriorityColor(task.priority)}
                            >
                              {task.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getTaskStatusColor(task.status)}
                            >
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Team Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{member.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {member.tasksCompleted} tasks completed •{" "}
                            {member.clientsAssigned} clients
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getRoleColor(member.role)}
                        >
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search team members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="practitioner">Practitioner</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setShowAddMember(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={getRoleColor(member.role)}
                              >
                                {member.role}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getStatusColor(member.status)}
                              >
                                {member.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Last active:{" "}
                            {member.lastActive.toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">
                            {member.clientsAssigned}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Clients Assigned
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-500">
                            {member.tasksCompleted}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tasks Completed
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-500">
                            {member.permissions.length}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Permissions
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {showAddMember && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Add Team Member</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <Input placeholder="Enter full name" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          placeholder="Enter email address"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Role</label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="practitioner">
                              Practitioner
                            </SelectItem>
                            <SelectItem value="assistant">Assistant</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          placeholder="Enter phone number"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={addTeamMember}>Send Invitation</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddMember(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Task Management</h3>
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </div>

              <div className="grid gap-4">
                {tasks.map((task) => {
                  const assignedMember = teamMembers.find(
                    (m) => m.id === task.assignedTo,
                  );
                  return (
                    <Card key={task.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge
                                variant="outline"
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority} priority
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getTaskStatusColor(task.status)}
                              >
                                {task.status}
                              </Badge>
                              {task.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="bg-muted text-muted-foreground"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Due: {task.dueDate.toLocaleDateString()}
                            </p>
                            {assignedMember && (
                              <div className="flex items-center gap-2 mt-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {assignedMember.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {assignedMember.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {showAddTask && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Task Title</label>
                      <Input placeholder="Enter task title" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe the task..."
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Assign To</label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Due Date</label>
                        <Input type="date" className="mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={addTask}>Create Task</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddTask(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        user: "Sarah Johnson",
                        action: "assigned a new task to David Smith",
                        time: "2 hours ago",
                        type: "task",
                      },
                      {
                        user: "Lisa Chen",
                        action: "completed ABC Corp tax review",
                        time: "4 hours ago",
                        type: "completion",
                      },
                      {
                        user: "David Smith",
                        action: "commented on Monthly Report task",
                        time: "6 hours ago",
                        type: "comment",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 border border-border rounded-lg"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {activity.type === "task" && (
                            <FileText className="w-4 h-4 text-primary" />
                          )}
                          {activity.type === "completion" && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {activity.type === "comment" && (
                            <MessageSquare className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamCollaboration;
