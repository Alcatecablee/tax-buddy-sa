import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Shield, FileText, Pencil } from 'lucide-react';
import { useState } from 'react';
import type { PropertyTaxRate } from '@shared/schema';
import { PropertyTaxRateDialog } from '@/components/PropertyTaxRateDialog';

export default function Admin() {
  const { user, isAdmin, signOut, getAccessToken } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<PropertyTaxRate | null>(null);

  if (!isAdmin) {
    setLocation('/admin/login');
    return null;
  }

  const { data: ratesData, isLoading } = useQuery<{ success: boolean; data: PropertyTaxRate[]; count: number }>({
    queryKey: ['/api/municipal/rates'],
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch('/api/municipal/rates', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch rates');
      }
      
      return response.json();
    },
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been logged out successfully',
      });
      setLocation('/admin/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  const rates = ratesData?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuditLog(!showAuditLog)}
                data-testid="button-toggle-audit-log"
              >
                <FileText className="h-4 w-4 mr-2" />
                {showAuditLog ? 'Hide' : 'Show'} Audit Log
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                data-testid="button-admin-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {showAuditLog ? (
          <AuditLogViewer />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Property Tax Rates</h2>
                <p className="text-sm text-muted-foreground">
                  Manage manual overrides for municipal property tax rates
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedRate(null);
                  setDialogOpen(true);
                }}
                data-testid="button-add-rate"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rate
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Rates</CardTitle>
                <CardDescription>
                  {rates.length} rate{rates.length !== 1 ? 's' : ''} configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : rates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No property tax rates configured yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Municipality</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Validated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rates.map((rate, index) => (
                        <TableRow key={index} data-testid={`row-rate-${index}`}>
                          <TableCell className="font-medium">
                            {rate.municipalityCode}
                          </TableCell>
                          <TableCell>{rate.financialYear}</TableCell>
                          <TableCell className="capitalize">
                            {rate.category.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{(rate.rate * 100).toFixed(4)}%</TableCell>
                          <TableCell>
                            <Badge variant={
                              rate.source === 'manual_override' ? 'default' :
                              rate.source === 'validated_fallback' ? 'secondary' :
                              'outline'
                            }>
                              {rate.source.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {rate.lastValidated || 'Never'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRate(rate);
                                setDialogOpen(true);
                              }}
                              data-testid={`button-edit-rate-${index}`}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <PropertyTaxRateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rate={selectedRate}
      />
    </div>
  );
}

function AuditLogViewer() {
  const { getAccessToken } = useAuth();

  const { data: auditData, isLoading } = useQuery<{ success: boolean; data: any[]; count: number }>({
    queryKey: ['/api/municipal/audit'],
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch('/api/municipal/audit', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        return { success: true, data: [], count: 0 };
      }
      
      return response.json();
    },
  });

  const auditLogs = auditData?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
        <CardDescription>
          Track all changes to property tax rates ({auditLogs.length} entries)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No audit log entries yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Rate ID</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log, index) => (
                <TableRow key={index} data-testid={`row-audit-${index}`}>
                  <TableCell className="text-sm">
                    {new Date(log.changed_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      log.action === 'INSERT' ? 'default' :
                      log.action === 'UPDATE' ? 'secondary' :
                      'destructive'
                    }>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.rate_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.changed_by?.slice(0, 8) || 'System'}...
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {log.notes || JSON.stringify(log.new_values)?.slice(0, 50)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
