import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  User,
  Star,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  status: 'active' | 'inactive' | 'pending';
  priority: 'low' | 'medium' | 'high';
  addedDate: string;
  lastActivity: string;
  totalReturns: number;
  totalRefunds: number;
  notes?: string;
  tags: string[];
  documents: number;
  communicationHistory: CommunicationRecord[];
}

interface CommunicationRecord {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'note';
  subject: string;
  date: string;
  content: string;
  status: 'sent' | 'received' | 'scheduled';
}

interface ClientManagementProps {
  className?: string;
  enabled?: boolean;
  maxClients?: number | "unlimited";
}

export function ClientManagement({ 
  className, 
  enabled = false,
  maxClients = "unlimited" 
}: ClientManagementProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sample clients for demonstration
  useEffect(() => {
    if (enabled) {
      const sampleClients: Client[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+27 82 123 4567',
          address: '123 Main St, Cape Town',
          taxNumber: '9001015009087',
          status: 'active',
          priority: 'high',
          addedDate: '2024-01-15',
          lastActivity: '2024-03-10',
          totalReturns: 3,
          totalRefunds: 12500,
          tags: ['individual', 'high-value'],
          documents: 5,
          notes: 'Prefers email communication. Has complex investment portfolio.',
          communicationHistory: [
            {
              id: '1',
              type: 'email',
              subject: 'Tax return completed',
              date: '2024-03-10',
              content: 'Your tax return has been successfully submitted to SARS.',
              status: 'sent'
            }
          ]
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@company.co.za',
          phone: '+27 83 987 6543',
          status: 'active',
          priority: 'medium',
          addedDate: '2024-02-01',
          lastActivity: '2024-03-05',
          totalReturns: 2,
          totalRefunds: 8750,
          tags: ['business-owner', 'medical-aid'],
          documents: 3,
          communicationHistory: []
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'mbrown@gmail.com',
          status: 'pending',
          priority: 'low',
          addedDate: '2024-03-01',
          lastActivity: '2024-03-01',
          totalReturns: 0,
          totalRefunds: 0,
          tags: ['new-client'],
          documents: 1,
          communicationHistory: []
        }
      ];
      setClients(sampleClients);
    }
  }, [enabled]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Client['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddClient = () => {
    if (maxClients !== "unlimited" && clients.length >= maxClients) {
      alert(`Client limit reached (${maxClients}). Upgrade your plan for more clients.`);
      return;
    }
    setShowAddClient(true);
  };

  const handleSendEmail = (client: Client) => {
    // Simulate email sending
    alert(`Email functionality would open here for ${client.name}`);
  };

  const handleScheduleMeeting = (client: Client) => {
    alert(`Meeting scheduler would open here for ${client.name}`);
  };

  if (!enabled) {
    return (
      <Card className={cn("border-yellow-200 bg-yellow-50/50", className)}>
        <CardContent className="p-6 text-center">
          <Users className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Client Management Not Available</h3>
          <p className="text-muted-foreground mb-4">
            Client management is available in Professional and Enterprise plans.
          </p>
          <Button variant="outline">
            Upgrade to Professional
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Management</h2>
          <p className="text-muted-foreground">
            Manage your client relationships and communications
            {maxClients !== "unlimited" && (
              <span className="ml-2">
                ({clients.length}/{maxClients} clients)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Professional Feature
          </Badge>
          <Button onClick={handleAddClient}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Refunds</p>
                <p className="text-2xl font-bold text-blue-600">
                  R{clients.reduce((sum, c) => sum + c.totalRefunds, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {clients.filter(c => c.priority === 'high').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid/List */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      )}>
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                  {client.priority === 'high' && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Returns</p>
                  <p className="font-medium">{client.totalReturns}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Refunds</p>
                  <p className="font-medium text-green-600">
                    R{client.totalRefunds.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Added: {new Date(client.addedDate).toLocaleDateString()}</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>Last: {new Date(client.lastActivity).toLocaleDateString()}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {client.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                <Badge className={getPriorityColor(client.priority)}>
                  {client.priority} priority
                </Badge>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedClient(client)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSendEmail(client)}
                >
                  <Mail className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleScheduleMeeting(client)}
                >
                  <Calendar className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No clients found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? "Try adjusting your search or filter criteria"
                : "Add your first client to get started"
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
              <Button onClick={handleAddClient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedClient.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedClient(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contact Information</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      {selectedClient.email}
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        {selectedClient.phone}
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        {selectedClient.address}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tax Information</Label>
                  <div className="space-y-2 mt-2">
                    {selectedClient.taxNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4" />
                        Tax Number: {selectedClient.taxNumber}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      Documents: {selectedClient.documents}
                    </div>
                  </div>
                </div>
              </div>

              {selectedClient.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedClient.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={() => handleSendEmail(selectedClient)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" onClick={() => handleScheduleMeeting(selectedClient)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}