import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, Filter, Search, Shield, Clock, User, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { AuditAPI, AuditEntry } from '@/services/businessApiService';

type AuditEntryWithDate = AuditEntry & {
  dateObject: Date;
};

export function AuditTrail() {
  const { profile, canAccessFeature } = useAuth();
  const { toast } = useCustomToast();
  const [auditEntries, setAuditEntries] = useState<AuditEntryWithDate[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditEntryWithDate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');
  const [loading, setLoading] = useState(true);

  // Load audit data on component mount
  useEffect(() => {
    if (profile?.id && canAccessFeature('audit_trail')) {
      fetchAuditEntries();
    }
  }, [profile?.id]);

  const fetchAuditEntries = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const response = await AuditAPI.getAuditEntries(profile.id);
      
      if (response.success && response.data) {
        // Convert timestamp strings to Date objects
        const entriesWithDates = response.data.map(entry => ({
          ...entry,
          dateObject: new Date(entry.timestamp)
        }));
        
        setAuditEntries(entriesWithDates);
        setFilteredEntries(entriesWithDates);
      } else {
        toast({
          title: "Warning",
          description: "Failed to load audit entries. Using fallback data.",
          variant: "destructive"
        });
        // Set empty array as fallback
        setAuditEntries([]);
        setFilteredEntries([]);
      }
    } catch (error) {
      console.error('Failed to fetch audit entries:', error);
      toast({
        title: "Error",
        description: "Failed to load audit data. Please try again.",
        variant: "destructive"
      });
      setAuditEntries([]);
      setFilteredEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter entries based on search and filters
  useEffect(() => {
    let filtered = auditEntries;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.details.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(entry => entry.category === categoryFilter);
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(entry => entry.severity === severityFilter);
    }

    // Date range filter
    const now = new Date();
    const dateThreshold = new Date();
    switch (dateRange) {
      case '24hours':
        dateThreshold.setHours(now.getHours() - 24);
        break;
      case '7days':
        dateThreshold.setDate(now.getDate() - 7);
        break;
      case '30days':
        dateThreshold.setDate(now.getDate() - 30);
        break;
      case '90days':
        dateThreshold.setDate(now.getDate() - 90);
        break;
      default:
        dateThreshold.setFullYear(2000); // Show all
    }

    filtered = filtered.filter(entry => entry.dateObject >= dateThreshold);

    setFilteredEntries(filtered);
  }, [auditEntries, searchTerm, categoryFilter, severityFilter, dateRange]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <User className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'client': return <User className="h-4 w-4" />;
      case 'system': return <Shield className="h-4 w-4" />;
      case 'compliance': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const exportAuditLog = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'Severity', 'Category', 'IP Address'].join(','),
      ...filteredEntries.map(entry => [
        entry.dateObject.toISOString(),
        entry.userEmail,
        entry.action,
        entry.resource,
        `"${JSON.stringify(entry.details)}"`,
        entry.severity,
        entry.category,
        entry.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!canAccessFeature('audit_trail')) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            Audit Trail - Pro Feature
          </CardTitle>
          <CardDescription>
            Audit trail and compliance tracking is available with Pro plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Track all activities, maintain compliance records, and generate audit reports for regulatory requirements.
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
          <h2 className="text-2xl font-bold">Audit Trail</h2>
          <p className="text-muted-foreground">
            Complete activity log for compliance and security monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchAuditEntries} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button onClick={exportAuditLog} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {filteredEntries.length} of {auditEntries.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {entry.dateObject.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{entry.userEmail}</TableCell>
                    <TableCell className="font-medium">{entry.action}</TableCell>
                    <TableCell>{entry.resource}</TableCell>
                    <TableCell className="max-w-xs truncate" title={JSON.stringify(entry.details)}>
                      {JSON.stringify(entry.details)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(entry.severity) as any}>
                        {entry.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(entry.category)}
                        <span className="capitalize">{entry.category}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit entries found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 