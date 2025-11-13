import React, { useState, useEffect, useRef } from "react";
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
  MessageSquare,
  Send,
  Search,
  Filter,
  Phone,
  Video,
  Mail,
  FileText,
  Paperclip,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  Archive,
  Star,
  MoreHorizontal,
  Bell,
  Smile,
  Image as ImageIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: "active" | "pending" | "completed";
  lastContact: Date;
  priority: "low" | "medium" | "high";
  unreadCount: number;
}

interface Message {
  id: string;
  clientId: string;
  fromUser: boolean;
  content: string;
  timestamp: Date;
  type: "text" | "file" | "appointment" | "system";
  attachments?: Attachment[];
  isRead: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}

export const ClientCommunication: React.FC = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useCustomToast();

  useEffect(() => {
    loadClients();
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadClients = async () => {
    // In production, this would fetch from your API
    const mockClients: Client[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+27 82 123 4567",
        status: "active",
        lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: "high",
        unreadCount: 3,
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+27 83 456 7890",
        status: "pending",
        lastContact: new Date(Date.now() - 5 * 60 * 60 * 1000),
        priority: "medium",
        unreadCount: 1,
      },
      {
        id: "3",
        name: "Michael Brown",
        email: "michael.brown@email.com",
        status: "completed",
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
        priority: "low",
        unreadCount: 0,
      },
    ];

    setClients(mockClients);
    setSelectedClient(mockClients[0]);
  };

  const loadMessages = async () => {
    // In production, this would fetch messages for the selected client
    const mockMessages: Message[] = [
      {
        id: "1",
        clientId: "1",
        fromUser: false,
        content:
          "Hi there! I have a question about my tax return. When should I expect my refund?",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: "text",
        isRead: true,
      },
      {
        id: "2",
        clientId: "1",
        fromUser: true,
        content:
          "Hello John! Thanks for reaching out. Your refund should be processed within 21 business days from submission. I'll keep you updated on the progress.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        type: "text",
        isRead: true,
      },
      {
        id: "3",
        clientId: "1",
        fromUser: false,
        content:
          "Great, thank you! Also, I have some additional documents to share.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "text",
        isRead: true,
      },
      {
        id: "4",
        clientId: "1",
        fromUser: false,
        content: "Medical aid certificate for 2024",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "file",
        attachments: [
          {
            id: "1",
            name: "medical_aid_certificate.pdf",
            type: "application/pdf",
            size: 245000,
            url: "#",
          },
        ],
        isRead: false,
      },
    ];

    setMessages(mockMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedClient) return;

    const message: Message = {
      id: Date.now().toString(),
      clientId: selectedClient.id,
      fromUser: true,
      content: newMessage,
      timestamp: new Date(),
      type: "text",
      isRead: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate client response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          clientId: selectedClient.id,
          fromUser: false,
          content: "Thank you for the quick response! I appreciate your help.",
          timestamp: new Date(),
          type: "text",
          isRead: false,
        };
        setMessages((prev) => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }, 1000);

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedClient.name}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "completed":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const clientMessages = messages.filter(
    (msg) => msg.clientId === selectedClient?.id,
  );

  const emailTemplates: EmailTemplate[] = [
    {
      id: "1",
      name: "Welcome Email",
      subject: "Welcome to Our Tax Services",
      content:
        "Dear [Client Name],\n\nWelcome to our tax practice! We're excited to help you with your tax needs...",
      category: "onboarding",
    },
    {
      id: "2",
      name: "Document Request",
      subject: "Additional Documents Required",
      content:
        "Dear [Client Name],\n\nTo complete your tax return, we need the following documents...",
      category: "requests",
    },
    {
      id: "3",
      name: "Status Update",
      subject: "Tax Return Status Update",
      content:
        "Dear [Client Name],\n\nI wanted to update you on the progress of your tax return...",
      category: "updates",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Client Communication Center
          </CardTitle>
          <p className="text-muted-foreground">
            Manage all client communications in one centralized hub
          </p>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="emails">Email Center</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Client List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredClients.map((client) => (
                      <Card
                        key={client.id}
                        className={`cursor-pointer transition-colors hover:border-primary/20 ${
                          selectedClient?.id === client.id
                            ? "border-primary/50 bg-primary/5"
                            : ""
                        }`}
                        onClick={() => setSelectedClient(client)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={client.avatar} />
                              <AvatarFallback>
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate">
                                  {client.name}
                                </h4>
                                {client.unreadCount > 0 && (
                                  <Badge className="bg-primary text-primary-foreground">
                                    {client.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {client.email}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(client.status)}
                                >
                                  {client.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={getPriorityColor(client.priority)}
                                >
                                  {client.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Last contact:{" "}
                                {client.lastContact.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2">
                  {selectedClient ? (
                    <Card className="h-full flex flex-col">
                      <CardHeader className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={selectedClient.avatar} />
                              <AvatarFallback>
                                {selectedClient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">
                                {selectedClient.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedClient.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Video className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                          {clientMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.fromUser ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  message.fromUser
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                {message.type === "text" ? (
                                  <p className="text-sm">{message.content}</p>
                                ) : message.type === "file" &&
                                  message.attachments ? (
                                  <div className="space-y-2">
                                    <p className="text-sm">{message.content}</p>
                                    {message.attachments.map((attachment) => (
                                      <div
                                        key={attachment.id}
                                        className="flex items-center gap-2 p-2 bg-background/10 rounded"
                                      >
                                        <FileText className="w-4 h-4" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium truncate">
                                            {attachment.name}
                                          </p>
                                          <p className="text-xs opacity-70">
                                            {(attachment.size / 1024).toFixed(
                                              1,
                                            )}{" "}
                                            KB
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}

                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="bg-muted rounded-lg p-3">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                                  <div
                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                                    style={{ animationDelay: "0.4s" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </CardContent>

                      <div className="p-4 border-t">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && sendMessage()
                            }
                            className="flex-1"
                          />
                          <Button variant="outline" size="sm">
                            <Smile className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Select a Client
                        </h3>
                        <p className="text-muted-foreground">
                          Choose a client from the list to start messaging
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emails" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compose Email</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">To</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} - {client.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input placeholder="Email subject" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        placeholder="Type your email message..."
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {emailTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="border-border hover:border-primary/20 transition-colors cursor-pointer"
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm">
                            {template.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.subject}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Use Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Appointment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Client</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Appointment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">
                            Initial Consultation
                          </SelectItem>
                          <SelectItem value="review">Tax Review</SelectItem>
                          <SelectItem value="followup">Follow-up</SelectItem>
                          <SelectItem value="planning">Tax Planning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Input type="time" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      placeholder="Appointment notes..."
                      className="mt-1"
                    />
                  </div>
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Communication Templates</CardTitle>
                    <Button>
                      <FileText className="w-4 h-4 mr-2" />
                      New Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {emailTemplates.map((template) => (
                      <Card key={template.id} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{template.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {template.subject}
                              </p>
                              <Badge variant="outline" className="mt-2">
                                {template.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <FileText className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-muted/30 rounded text-xs">
                            {template.content.substring(0, 100)}...
                          </div>
                        </CardContent>
                      </Card>
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

export default ClientCommunication;
