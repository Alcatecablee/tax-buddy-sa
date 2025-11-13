import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  MessageSquare, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Target,
  TrendingUp,
  Send,
  Video,
  Headphones,
  Plus,
  Globe
} from 'lucide-react';
import { useCustomToast } from '@/hooks/use-custom-toast';

interface AccountManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  title: string;
  department: string;
  specialties: string[];
  availability: 'available' | 'busy' | 'offline';
  timezone: string;
  languages: string[];
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  category: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  type: 'call' | 'video' | 'in_person';
  status: 'scheduled' | 'completed' | 'cancelled';
  agenda?: string;
}

export default function DedicatedAccountManager() {
  const { toast } = useCustomToast();
  const [accountManager, setAccountManager] = useState<AccountManager | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountManagerData = async () => {
      try {
        setLoading(true);
        setAccountManager(null);
        setTickets([]);
        setMeetings([]);
      } catch (error) {
        toast({
          title: "Unable to load account manager data",
          description: "Please try again or contact support if the problem persists.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccountManagerData();
  }, [toast]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${accountManager?.name}.`,
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) return;
    
    setLoading(true);
    try {
      // Simulate creating ticket
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Support Ticket Created",
        description: "Your support ticket has been created and assigned to your account manager.",
      });
      
      setNewTicketTitle('');
      setNewTicketDescription('');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const scheduleCall = async () => {
    setLoading(true);
    try {
      // Simulate scheduling call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Call Scheduled",
        description: "A call has been scheduled with your account manager. You'll receive a calendar invite shortly.",
      });
    } catch (error) {
      console.error('Failed to schedule call:', error);
      toast({
        title: "Error",
        description: "Failed to schedule call. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!accountManager) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dedicated Account Manager</h2>
          <p className="text-muted-foreground">Your dedicated support team</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Account Manager Assigned</h3>
            <p className="text-muted-foreground text-center mb-6">
              Contact our sales team to get assigned a dedicated account manager for personalized support.
            </p>
            <Button>
              <Mail className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dedicated Account Manager</h1>
          <p className="text-muted-foreground">
            Your personal point of contact for enterprise support and success
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Manager Profile */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Account Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={accountManager.avatar} alt={accountManager.name} />
                  <AvatarFallback>{accountManager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(accountManager.availability)}`}></div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{accountManager.name}</h3>
                <p className="text-sm text-muted-foreground">{accountManager.title}</p>
                <p className="text-sm text-muted-foreground">{accountManager.department}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={accountManager.availability === 'available' ? 'default' : 'secondary'}>
                    {accountManager.availability}
                  </Badge>
                  <Badge variant="outline">
                    <Globe className="w-3 h-3 mr-1" />
                    {accountManager.timezone}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{accountManager.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{accountManager.phone}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {accountManager.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {accountManager.languages.map((language) => (
                  <Badge key={language} variant="outline" className="text-xs">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={scheduleCall} className="w-full" disabled={loading}>
                <Video className="w-4 h-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                        <p className="text-2xl font-bold">{tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upcoming Meetings</p>
                        <p className="text-2xl font-bold">{meetings.filter(m => m.status === 'scheduled').length}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                        <p className="text-2xl font-bold">&lt; 2h</p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Ticket #002 resolved</p>
                        <p className="text-sm text-muted-foreground">Custom reporting requirements completed</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Meeting scheduled</p>
                        <p className="text-sm text-muted-foreground">Quarterly Business Review - Next week</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium">New ticket created</p>
                        <p className="text-sm text-muted-foreground">Integration with SAP system</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Support Ticket</CardTitle>
                  <CardDescription>
                    Submit a new support request to your account manager
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ticket-title">Title</Label>
                    <Input
                      id="ticket-title"
                      value={newTicketTitle}
                      onChange={(e) => setNewTicketTitle(e.target.value)}
                      placeholder="Brief description of your request"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticket-description">Description</Label>
                    <Textarea
                      id="ticket-description"
                      value={newTicketDescription}
                      onChange={(e) => setNewTicketDescription(e.target.value)}
                      placeholder="Detailed description of your request or issue"
                      rows={4}
                    />
                  </div>
                  <Button onClick={createTicket} disabled={loading || !newTicketTitle.trim() || !newTicketDescription.trim()}>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Ticket
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{ticket.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getTicketStatusColor(ticket.status)}>
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {ticket.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <p>Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
                            <p>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meetings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meetings.filter(m => m.status === 'scheduled').map((meeting) => (
                      <div key={meeting.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{meeting.title}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(meeting.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {meeting.duration} minutes
                              </div>
                              <div className="flex items-center gap-1">
                                {meeting.type === 'video' && <Video className="w-4 h-4" />}
                                {meeting.type === 'call' && <Phone className="w-4 h-4" />}
                                {meeting.type === 'in_person' && <Users className="w-4 h-4" />}
                                {meeting.type}
                              </div>
                            </div>
                            {meeting.agenda && (
                              <p className="text-sm text-muted-foreground mt-2">
                                <strong>Agenda:</strong> {meeting.agenda}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline">
                            {meeting.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                  <CardDescription>
                    Send a direct message to your account manager
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows={6}
                    />
                  </div>
                  <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Direct Contact</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{accountManager.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{accountManager.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Availability</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Mon-Fri: 8:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{accountManager.timezone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 