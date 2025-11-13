import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  Send, 
  Paperclip, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal,
  Headphones,
  Zap,
  BarChart3,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  Video,
  RefreshCw
} from 'lucide-react';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { BusinessApiService, SupportTicket, SupportAgent } from '@/services/businessApiService';

interface TicketResponse {
  id: string;
  author: string;
  role: 'customer' | 'support' | 'manager';
  content: string;
  timestamp: string;
  internal: boolean;
}

interface SupportChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  availability: string;
  responseTime: string;
  enabled: boolean;
  priority: number;
}

const SUPPORT_CHANNELS: SupportChannel[] = [
  {
    id: 'emergency',
    name: 'Emergency Hotline',
    description: 'For critical issues affecting business operations',
    icon: <Phone className="h-5 w-5" />,
    availability: '24/7',
    responseTime: '< 5 minutes',
    enabled: true,
    priority: 1
  },
  {
    id: 'dedicated-manager',
    name: 'Dedicated Account Manager',
    description: 'Direct line to your assigned account manager',
    icon: <User className="h-5 w-5" />,
    availability: 'Business Hours',
    responseTime: '< 30 minutes',
    enabled: true,
    priority: 2
  },
  {
    id: 'live-chat',
    name: 'Priority Live Chat',
    description: 'Instant chat with technical support team',
    icon: <MessageSquare className="h-5 w-5" />,
    availability: '24/7',
    responseTime: '< 2 minutes',
    enabled: true,
    priority: 3
  },
  {
    id: 'video-call',
    name: 'Video Support',
    description: 'Screen sharing and video consultation',
    icon: <Video className="h-5 w-5" />,
    availability: 'Business Hours',
    responseTime: '< 15 minutes',
    enabled: true,
    priority: 4
  },
  {
    id: 'email',
    name: 'Priority Email',
    description: 'High-priority email support queue',
    icon: <Mail className="h-5 w-5" />,
    availability: '24/7',
    responseTime: '< 2 hours',
    enabled: true,
    priority: 5
  }
];

const PrioritySupport = () => {
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const { toast } = useCustomToast();

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      setLoading(true);
      
      setAgents([]);
      setTickets([]);
    } catch (error) {
      toast({
        title: "Unable to load support data",
        description: "Please refresh the page or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) {
      return;
    }

    try {
      setNewTicketTitle('');
      setNewTicketDescription('');
      setNewTicketPriority('medium');
      
      await fetchSupportData();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
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
      case 'resolved':
      case 'closed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'open':
        return 'outline';
      default:
        return 'outline';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Priority Support</h2>
          <p className="text-muted-foreground">
            Get dedicated support from our expert team
          </p>
        </div>
        <Button variant="outline" onClick={fetchSupportData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Support Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Support Team
            </CardTitle>
            <CardDescription>
              Your dedicated support specialists
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Support Agents Available</h3>
                <p className="text-muted-foreground mb-4">
                  Support team information is not available at the moment.
                </p>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(agent.status)}`}></div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{agent.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{agent.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{agent.role}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {agent.specializations.split(', ').map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {'< 15 minutes'}
                        </div>
                        <span>{agent.active_tickets} active tickets</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create New Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Support Ticket
            </CardTitle>
            <CardDescription>
              Get help from our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Brief description of your issue"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select
                value={newTicketPriority}
                onChange={(e) => setNewTicketPriority(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Detailed description of your issue..."
                value={newTicketDescription}
                onChange={(e) => setNewTicketDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={createTicket} 
              className="w-full"
              disabled={!newTicketTitle.trim() || !newTicketDescription.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Support Tickets
          </CardTitle>
          <CardDescription>
            Your recent support requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any support tickets yet.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{ticket.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                          {ticket.priority}
                        </Badge>
                        <Badge variant={getTicketStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                      <span>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Channels */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Phone className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Speak directly with our support team
            </p>
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Video className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Video Call</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Schedule a video consultation
            </p>
            <Button variant="outline">
              <Video className="w-4 h-4 mr-2" />
              Schedule Call
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <MessageSquare className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Chat with our support team
            </p>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PrioritySupport; 