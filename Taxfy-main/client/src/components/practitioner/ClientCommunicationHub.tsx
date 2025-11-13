import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import {
  MessageSquare,
  Send,
  Phone,
  Mail,
  Calendar,
  FileText,
  Paperclip,
  Search,
  Filter,
  Bell,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  Star,
  MoreHorizontal,
  Video,
  Users,
  Archive,
  Tag,
  Zap,
  Shield,
  Building,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { formatCurrency } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive" | "prospective";
  lastContact: Date;
  communicationPreference: "email" | "phone" | "sms" | "portal";
  timezone: string;
  tags: string[];
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "text" | "file" | "system" | "template";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  attachments?: Attachment[];
  isImportant: boolean;
  templateId?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Conversation {
  id: string;
  clientId: string;
  subject: string;
  lastMessage: Date;
  unreadCount: number;
  priority: "low" | "normal" | "high" | "urgent";
  status: "open" | "pending" | "resolved" | "archived";
  assignedTo: string;
  tags: string[];
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: "welcome" | "reminder" | "status_update" | "request" | "follow_up";
  variables: string[];
}

export const ClientCommunicationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [clients, setClients] = useState<Client[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useCustomToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = () => {
    // Load mock data for demonstration
    const mockClients: Client[] = [
      {
        id: "client-1",
        name: "John Smith",
        email: "john@example.com",
        phone: "+27 82 123 4567",
        status: "active",
        lastContact: new Date("2024-01-20"),
        communicationPreference: "email",
        timezone: "Africa/Johannesburg",
        tags: ["high-value", "business-owner"],
      },
      {
        id: "client-2",
        name: "Sarah Williams",
        email: "sarah@example.com",
        phone: "+27 83 987 6543",
        status: "active",
        lastContact: new Date("2024-01-18"),
        communicationPreference: "phone",
        timezone: "Africa/Johannesburg",
        tags: ["individual", "repeat-client"],
      },
      {
        id: "client-3",
        name: "Tech Solutions Ltd",
        email: "admin@techsolutions.co.za",
        phone: "+27 11 234 5678",
        status: "active",
        lastContact: new Date("2024-01-15"),
        communicationPreference: "portal",
        timezone: "Africa/Johannesburg",
        tags: ["enterprise", "compliance"],
      },
    ];

    const mockConversations: Conversation[] = [
      {
        id: "conv-1",
        clientId: "client-1",
        subject: "2024 Tax Return Status",
        lastMessage: new Date("2024-01-20T14:30:00"),
        unreadCount: 2,
        priority: "high",
        status: "open",
        assignedTo: "practitioner-1",
        tags: ["tax-return", "urgent"],
      },
      {
        id: "conv-2",
        clientId: "client-2",
        subject: "Medical Aid Certificate Query",
        lastMessage: new Date("2024-01-18T10:15:00"),
        unreadCount: 0,
        priority: "normal",
        status: "pending",
        assignedTo: "practitioner-1",
        tags: ["medical-aid", "query"],
      },
      {
        id: "conv-3",
        clientId: "client-3",
        subject: "Quarterly VAT Submission",
        lastMessage: new Date("2024-01-15T16:45:00"),
        unreadCount: 1,
        priority: "urgent",
        status: "open",
        assignedTo: "practitioner-1",
        tags: ["vat", "quarterly", "enterprise"],
      },
    ];

    const mockMessages: Message[] = [
      {
        id: "msg-1",
        conversationId: "conv-1",
        senderId: "client-1",
        receiverId: "practitioner-1",
        content:
          "Hi, I wanted to check on the status of my 2024 tax return. When can I expect it to be completed?",
        type: "text",
        timestamp: new Date("2024-01-20T14:30:00"),
        status: "read",
        isImportant: true,
      },
      {
        id: "msg-2",
        conversationId: "conv-1",
        senderId: "practitioner-1",
        receiverId: "client-1",
        content:
          "Thank you for your inquiry. We're currently reviewing your documents and expect to complete your return by Friday. I'll send you a summary as soon as it's ready.",
        type: "text",
        timestamp: new Date("2024-01-20T14:35:00"),
        status: "delivered",
        isImportant: false,
      },
    ];

    const mockTemplates: MessageTemplate[] = [
      {
        id: "template-1",
        name: "Tax Return Complete",
        subject: "Your tax return is ready for review",
        content:
          "Dear {{clientName}},\n\nWe're pleased to inform you that your {{taxYear}} tax return has been completed. Based on our calculations, you are due a refund of {{refundAmount}}.\n\nPlease review the attached documents and let us know if you have any questions.\n\nBest regards,\n{{practitionerName}}",
        category: "status_update",
        variables: [
          "clientName",
          "taxYear",
          "refundAmount",
          "practitionerName",
        ],
      },
      {
        id: "template-2",
        name: "Document Request",
        subject: "Additional documents required",
        content:
          "Dear {{clientName}},\n\nTo complete your tax return, we require the following additional documents:\n\n{{documentList}}\n\nPlease provide these at your earliest convenience to avoid any delays.\n\nThank you,\n{{practitionerName}}",
        category: "request",
        variables: ["clientName", "documentList", "practitionerName"],
      },
      {
        id: "template-3",
        name: "Appointment Reminder",
        subject: "Reminder: Upcoming appointment",
        content:
          "Dear {{clientName}},\n\nThis is a friendly reminder about your upcoming appointment scheduled for {{appointmentDate}} at {{appointmentTime}}.\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nLooking forward to meeting with you.\n\nBest regards,\n{{practitionerName}}",
        category: "reminder",
        variables: [
          "clientName",
          "appointmentDate",
          "appointmentTime",
          "practitionerName",
        ],
      },
    ];

    setClients(mockClients);
    setConversations(mockConversations);
    setMessages(mockMessages);
    setTemplates(mockTemplates);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: "practitioner-1",
      receiverId: selectedConversation.clientId,
      content: newMessage,
      type: "text",
      timestamp: new Date(),
      status: "sent",
      isImportant: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: new Date() }
          : conv,
      ),
    );

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the client",
    });
  };

  const useTemplate = (template: MessageTemplate) => {
    const client = clients.find((c) => c.id === selectedConversation?.clientId);
    if (!client) return;

    let content = template.content;

    // Replace variables with actual values
    content = content.replace(/{{clientName}}/g, client.name);
    content = content.replace(
      /{{practitionerName}}/g,
      "Professional Tax Practitioner",
    );
    content = content.replace(/{{taxYear}}/g, "2024");
    content = content.replace(/{{refundAmount}}/g, formatCurrency(5500));
    content = content.replace(/{{appointmentDate}}/g, "25 January 2024");
    content = content.replace(/{{appointmentTime}}/g, "10:00 AM");
    content = content.replace(
      /{{documentList}}/g,
      "• IRP5 Certificate\n• Medical Aid Certificate\n• Retirement Annuity Statement",
    );

    setNewMessage(content);
    setShowTemplateModal(false);

    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied to your message`,
    });
  };

  const startNewConversation = (clientId: string) => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      clientId,
      subject: "New Conversation",
      lastMessage: new Date(),
      unreadCount: 0,
      priority: "normal",
      status: "open",
      assignedTo: "practitioner-1",
      tags: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setSelectedConversation(newConv);
    setSelectedClient(clients.find((c) => c.id === clientId) || null);
  };

  const markAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    );
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const client = clients.find((c) => c.id === conv.clientId);
    const matchesSearch =
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || conv.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const conversationMessages = messages.filter(
    (m) => m.conversationId === selectedConversation?.id,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Communication Hub</h2>
          <p className="text-muted-foreground">
            Manage all client communications in one centralized platform
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            Professional
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secure
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="clients">Client Directory</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="settings">Communication Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="h-[500px] overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2 h-[400px] overflow-y-auto px-4 pb-4">
                    {filteredConversations.map((conversation) => {
                      const client = clients.find(
                        (c) => c.id === conversation.clientId,
                      );
                      return (
                        <div
                          key={conversation.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedConversation?.id === conversation.id
                              ? "bg-primary/10 border-primary/20"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => {
                            setSelectedConversation(conversation);
                            setSelectedClient(client || null);
                            markAsRead(conversation.id);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={client?.avatar} />
                                <AvatarFallback>
                                  {client?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {client?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {conversation.subject}
                                </p>
                              </div>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge
                                variant="default"
                                className="h-5 w-5 p-0 text-xs"
                              >
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={getPriorityColor(
                                conversation.priority,
                              )}
                            >
                              {conversation.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {conversation.lastMessage.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Thread */}
            <div className="lg:col-span-2">
              {selectedConversation && selectedClient ? (
                <Card className="h-[550px] flex flex-col">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedClient.avatar} />
                          <AvatarFallback>
                            {selectedClient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {selectedClient.name}
                          </CardTitle>
                          <CardDescription>
                            {selectedConversation.subject}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversationMessages.map((message) => {
                      const isFromClient =
                        message.senderId === selectedClient.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isFromClient ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              isFromClient
                                ? "bg-muted"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {!isFromClient && (
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(message.status)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplateModal(true)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-[550px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Select a Conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>
                Manage client information and communication preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <Card
                    key={client.id}
                    className="border hover:border-primary/20 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={client.avatar} />
                            <AvatarFallback>
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {client.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            client.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {client.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="capitalize">
                            {client.communicationPreference}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>
                            Last contact:{" "}
                            {client.lastContact.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {client.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => startNewConversation(client.id)}
                      >
                        <MessageSquare className="h-3 w-3 mr-2" />
                        Start Conversation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>
                    Pre-written templates for common communications
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="border hover:border-primary/20 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {template.subject}
                          </p>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm bg-muted p-3 rounded-lg">
                          {template.content.substring(0, 150)}...
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Variables:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {template.variables.map((variable) => (
                              <Badge
                                key={variable}
                                variant="secondary"
                                className="text-xs"
                              >
                                {`{{${variable}}}`}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => useTemplate(template)}
                            disabled={!selectedConversation}
                          >
                            Use Template
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Settings</CardTitle>
              <CardDescription>
                Configure your communication preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-read Receipts</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send read receipts when you view messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Message Templates</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable quick access to message templates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Client Status Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Send automatic updates when client status changes
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Business Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Select defaultValue="08:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="07:00">07:00</SelectItem>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Select defaultValue="17:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">16:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[500px] max-h-[600px] overflow-y-auto">
            <CardHeader>
              <CardTitle>Select Message Template</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setShowTemplateModal(false)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 border rounded-lg cursor-pointer hover:border-primary/20"
                    onClick={() => useTemplate(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {template.subject}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientCommunicationHub;
