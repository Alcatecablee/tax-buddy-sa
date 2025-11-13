import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Calendar,
  User,
  FileText,
  Headphones,
  Video,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  responses: SupportResponse[];
}

interface SupportResponse {
  id: string;
  message: string;
  author: string;
  authorType: 'user' | 'support';
  timestamp: Date;
  attachments?: string[];
}

interface SupportContact {
  type: 'phone' | 'email' | 'chat' | 'video';
  title: string;
  description: string;
  availability: string;
  responseTime: string;
  icon: React.ReactNode;
}

export function PrioritySupport() {
  const { user } = useAuth();
  
  const canAccessFeature = (feature: string) => {
    return user?.user_metadata?.subscription_plan === 'professional' || 
           user?.user_metadata?.subscription_plan === 'business';
  };
  const [activeTab, setActiveTab] = useState('contact');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as const,
    category: 'general'
  });
  const [submitting, setSubmitting] = useState(false);

  const [tickets] = useState<SupportTicket[]>([]);

  const supportContacts: SupportContact[] = [
    {
      type: 'phone',
      title: 'Priority Phone Support',
      description: 'Direct line to our senior support team',
      availability: '24/7 for Pro subscribers',
      responseTime: 'Immediate',
      icon: <Phone className="h-5 w-5" />
    },
    {
      type: 'email',
      title: 'Priority Email Support',
      description: 'Fast-tracked email responses',
      availability: 'Business hours',
      responseTime: '< 2 hours',
      icon: <Mail className="h-5 w-5" />
    },
    {
      type: 'chat',
      title: 'Live Chat Support',
      description: 'Real-time chat with support agents',
      availability: 'Mon-Fri 8AM-6PM',
      responseTime: '< 5 minutes',
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      type: 'video',
      title: 'Video Call Support',
      description: 'Screen sharing and video assistance',
      availability: 'By appointment',
      responseTime: 'Same day',
      icon: <Video className="h-5 w-5" />
    }
  ];

  const ticketCategories = [
    { value: 'general', label: 'General Question' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Subscription' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'training', label: 'Training & Onboarding' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level?.color || 'bg-gray-100 text-gray-800';
  };

  const submitTicket = async () => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, submit to backend
      console.log('Submitting ticket:', newTicket);
      
      // Reset form
      setNewTicket({
        subject: '',
        description: '',
        priority: 'medium',
        category: 'general'
      });
      
      // Switch to tickets tab
      setActiveTab('tickets');
    } catch (error) {
      console.error('Failed to submit ticket:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const scheduleCall = (type: string) => {
    // In real app, this would open a scheduling interface
    console.log(`Scheduling ${type} call`);
  };

  if (!canAccessFeature('priority_support')) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Priority Support - Pro Feature
          </CardTitle>
          <CardDescription>
            Priority support is available with Pro plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Get priority access to our support team with faster response times and dedicated assistance.
          </p>
          <Button>Upgrade to Pro</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Priority Support</h2>
          <p className="text-muted-foreground">
            Get expert help when you need it most
          </p>
        </div>
        <Badge variant="default" className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          Pro Support
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="new-ticket">New Ticket</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportContacts.map((contact, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {contact.icon}
                    {contact.title}
                  </CardTitle>
                  <CardDescription>{contact.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Availability:</span>
                      <span className="font-medium">{contact.availability}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="font-medium text-green-600">{contact.responseTime}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => scheduleCall(contact.type)}
                  >
                    {contact.type === 'phone' && 'Call Now'}
                    {contact.type === 'email' && 'Send Email'}
                    {contact.type === 'chat' && 'Start Chat'}
                    {contact.type === 'video' && 'Schedule Call'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Emergency Contact */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Shield className="h-5 w-5" />
                Emergency Support
              </CardTitle>
              <CardDescription className="text-red-600">
                For critical issues affecting your business operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-700">24/7 Emergency Hotline</p>
                  <p className="text-sm text-red-600">+27670494876</p>
                </div>
                <Button variant="destructive">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                Track your support requests and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(ticket.status)}
                            <span className="text-sm capitalize">{ticket.status.replace('-', ' ')}</span>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>#{ticket.id}</p>
                          <p>{ticket.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                      
                      {ticket.assignedTo && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4" />
                          <span>Assigned to: {ticket.assignedTo}</span>
                        </div>
                      )}

                      {ticket.responses.length > 0 && (
                        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Latest Response</span>
                          </div>
                          <p className="text-sm">{ticket.responses[ticket.responses.length - 1].message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {ticket.responses[ticket.responses.length - 1].timestamp.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {tickets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No support tickets yet</p>
                    <p className="text-sm">Create a new ticket to get help from our team</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Ticket Tab */}
        <TabsContent value="new-ticket" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and we'll get back to you quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newTicket.category} 
                    onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newTicket.priority} 
                    onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable"
                  rows={6}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={submitTicket} 
                  disabled={submitting || !newTicket.subject || !newTicket.description}
                >
                  {submitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Pro Features Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Bulk Processing Tutorial
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  White-Label Setup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  API Documentation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Getting Started with Pro
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Client Management Walkthrough
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Report Customization
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Advanced Features
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Training Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  Exclusive training sessions for Pro subscribers
                </div>
                <Button className="w-full">
                  Schedule 1-on-1 Training
                </Button>
                <Button variant="outline" className="w-full">
                  Join Group Webinar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Account Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  Your dedicated account manager for strategic guidance
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <p className="font-medium">Sarah Mitchell</p>
                  <p className="text-sm text-muted-foreground">Senior Account Manager</p>
                  <p className="text-sm">sarah.mitchell@taxfy.co.za</p>
                </div>
                <Button className="w-full">
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 