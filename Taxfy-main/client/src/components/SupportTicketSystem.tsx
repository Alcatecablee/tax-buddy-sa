import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: Date;
  responseDeadline: Date;
  responses: TicketResponse[];
  slaStatus: "on-time" | "at-risk" | "overdue";
}

interface TicketResponse {
  id: string;
  from: "user" | "support";
  message: string;
  timestamp: Date;
}

export const SupportTicketSystem: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium" as const,
  });
  const { toast } = useCustomToast();
  const { currentPlan, hasEmailSupport, hasPrioritySupport } =
    useSubscription();

  useEffect(() => {
    loadExistingTickets();
  }, []);

  const loadExistingTickets = () => {
    // In production, this would fetch from your API
    const storedTickets = localStorage.getItem("supportTickets");
    if (storedTickets) {
      const parsed = JSON.parse(storedTickets);
      setTickets(
        parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          responseDeadline: new Date(t.responseDeadline),
          responses: t.responses.map((r: any) => ({
            ...r,
            timestamp: new Date(r.timestamp),
          })),
        })),
      );
    }
  };

  const getSLADeadline = (priority: string, isPriority: boolean): Date => {
    const now = new Date();
    let hours = 48; // Default 48h for starter plan

    if (isPriority) {
      // Priority support gets faster response times
      switch (priority) {
        case "urgent":
          hours = 4;
          break;
        case "high":
          hours = 8;
          break;
        case "medium":
          hours = 24;
          break;
        case "low":
          hours = 48;
          break;
      }
    } else {
      // Standard support
      switch (priority) {
        case "urgent":
        case "high":
          hours = 48;
          break;
        case "medium":
          hours = 72;
          break;
        case "low":
          hours = 96;
          break;
      }
    }

    return new Date(now.getTime() + hours * 60 * 60 * 1000);
  };

  const getSLAStatus = (deadline: Date): "on-time" | "at-risk" | "overdue" => {
    const now = new Date();
    const timeToDeadline = deadline.getTime() - now.getTime();
    const hoursToDeadline = timeToDeadline / (1000 * 60 * 60);

    if (timeToDeadline < 0) return "overdue";
    if (hoursToDeadline < 4) return "at-risk";
    return "on-time";
  };

  const createTicket = async () => {
    if (!newTicket.subject.trim()) {
      toast({
        title: "Subject Required",
        description: "Please provide a subject for your support ticket",
        variant: "destructive",
      });
      return;
    }

    if (!newTicket.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe your issue in detail",
        variant: "destructive",
      });
      return;
    }

    if (newTicket.subject.length < 5) {
      toast({
        title: "Subject Too Short",
        description: "Please provide a more descriptive subject",
        variant: "destructive",
      });
      return;
    }

    if (newTicket.description.length < 10) {
      toast({
        title: "Description Too Short",
        description: "Please provide more details about your issue",
        variant: "destructive",
      });
      return;
    }

    const ticket: SupportTicket = {
      id: `TICKET-${Date.now()}`,
      subject: newTicket.subject,
      description: newTicket.description,
      priority: newTicket.priority,
      status: "open",
      createdAt: new Date(),
      responseDeadline: getSLADeadline(
        newTicket.priority,
        hasPrioritySupport(),
      ),
      responses: [
        {
          id: `MSG-${Date.now()}`,
          from: "user",
          message: newTicket.description,
          timestamp: new Date(),
        },
      ],
      slaStatus: "on-time",
    };

    const updatedTickets = [ticket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem("supportTickets", JSON.stringify(updatedTickets));

    // Simulate sending email
    await simulateEmailToSupport(ticket);

    setNewTicket({ subject: "", description: "", priority: "medium" });
    setIsCreatingTicket(false);

    toast({
      title: "Ticket Created",
      description: `Ticket ${ticket.id} created successfully. You'll receive an email confirmation.`,
    });
  };

  const simulateEmailToSupport = async (ticket: SupportTicket) => {
    // Simulate email API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate auto-response after a delay
    setTimeout(() => {
      const autoResponse: TicketResponse = {
        id: `MSG-${Date.now()}-AUTO`,
        from: "support",
        message: `Thank you for contacting Taxfy support. We've received your ticket ${ticket.id} regarding "${ticket.subject}". ${hasPrioritySupport() ? "As a priority support customer, you can expect a response within the next few hours." : "We aim to respond within 48 hours."}`,
        timestamp: new Date(),
      };

      const updatedTickets = tickets.map((t) =>
        t.id === ticket.id
          ? {
              ...t,
              responses: [...t.responses, autoResponse],
              status: "in-progress" as const,
            }
          : t,
      );

      setTickets(updatedTickets);
      localStorage.setItem("supportTickets", JSON.stringify(updatedTickets));
    }, 2000);
  };

  const getSLABadge = (slaStatus: string) => {
    switch (slaStatus) {
      case "on-time":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            On Time
          </Badge>
        );
      case "at-risk":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            At Risk
          </Badge>
        );
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return null;
    }
  };

  const getTimeRemaining = (deadline: Date): string => {
    const now = new Date();
    const timeRemaining = deadline.getTime() - now.getTime();

    if (timeRemaining < 0) return "Overdue";

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
    );

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }

    return `${hours}h ${minutes}m remaining`;
  };

  if (!hasEmailSupport()) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Email Support Not Available
          </h3>
          <p className="text-muted-foreground mb-4">
            Upgrade to Starter plan or higher to access email support with
            guaranteed response times.
          </p>
          <Button>Upgrade Plan</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Email Support
            {hasPrioritySupport() && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Zap className="w-3 h-3 mr-1" />
                Priority
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {hasPrioritySupport()
                ? "Priority support with fast response times"
                : "48-hour response time guarantee"}
            </p>
            <Button onClick={() => setIsCreatingTicket(true)} size="sm">
              <Send className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </CardHeader>

        {isCreatingTicket && (
          <CardContent className="border-t border-border">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                  placeholder="Brief description of your issue"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value: any) =>
                    setNewTicket({ ...newTicket, priority: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General question</SelectItem>
                    <SelectItem value="medium">
                      Medium - Issue affecting usage
                    </SelectItem>
                    <SelectItem value="high">
                      High - Important feature broken
                    </SelectItem>
                    {hasPrioritySupport() && (
                      <SelectItem value="urgent">
                        Urgent - Critical business impact
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  placeholder="Please provide detailed information about your issue..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={createTicket}>Create Ticket</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingTicket(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {tickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const updatedSLAStatus = getSLAStatus(ticket.responseDeadline);

                return (
                  <Card key={ticket.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{ticket.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            Ticket #{ticket.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              ticket.status === "resolved"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : ticket.status === "in-progress"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground"
                            }
                          >
                            {ticket.status}
                          </Badge>
                          {getSLABadge(updatedSLAStatus)}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {ticket.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeRemaining(ticket.responseDeadline)}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            ticket.priority === "urgent"
                              ? "border-red-500/20 text-red-500"
                              : ticket.priority === "high"
                                ? "border-orange-500/20 text-orange-500"
                                : ticket.priority === "medium"
                                  ? "border-primary/20 text-primary"
                                  : "border-muted-foreground/20 text-muted-foreground"
                          }
                        >
                          {ticket.priority} priority
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {ticket.responses.slice(-2).map((response) => (
                          <div
                            key={response.id}
                            className={`p-3 rounded-lg ${
                              response.from === "support"
                                ? "bg-primary/10 border border-primary/20"
                                : "bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {response.from === "support" ? (
                                <MessageSquare className="w-4 h-4 text-primary" />
                              ) : (
                                <User className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">
                                {response.from === "support"
                                  ? "Taxfy Support"
                                  : "You"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {response.timestamp.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{response.message}</p>
                          </div>
                        ))}
                      </div>

                      {ticket.status !== "resolved" &&
                        ticket.status !== "closed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 w-full"
                          >
                            Reply to Ticket
                          </Button>
                        )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/30 border-primary/20">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2">Support Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Email: support@taxfy.co.za</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>
                Response Time:{" "}
                {hasPrioritySupport() ? "Fast-track (4-24h)" : "Standard (48h)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>Business Hours: Mon-Fri 8AM-6PM SAST</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketSystem;
