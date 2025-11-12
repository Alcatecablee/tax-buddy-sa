import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calculator, 
  Plus, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Trash2,
  Edit,
  User,
  FileDown
} from 'lucide-react';
import { formatCurrency } from '@/lib/taxCalculator';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportCalculationToPDF, exportCalculationToCSV, exportAllCalculationsToCSV } from '@/lib/exportUtils';

interface SavedCalculation {
  id: string;
  user_id: string | null;
  tax_year: string;
  age_category: string;
  total_income: number | null;
  taxable_income: number | null;
  total_tax_owed: number | null;
  refund_amount: number | null;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCalculations();
    }
  }, [user]);

  const loadCalculations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalculations(data || []);
    } catch (error) {
      console.error('Error loading calculations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your calculations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const calculation = calculations.find(calc => calc.id === id);
      if (!calculation || calculation.user_id !== user?.id) {
        throw new Error('You do not have permission to delete this calculation');
      }

      const { error } = await supabase
        .from('tax_calculations')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setCalculations(calculations.filter(calc => calc.id !== id));
      toast({
        title: 'Deleted',
        description: 'Calculation deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting calculation:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete calculation',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  const handleExportPDF = async (calc: SavedCalculation) => {
    try {
      setExportingId(calc.id);
      
      if (calc.user_id !== user?.id) {
        throw new Error('You do not have permission to export this calculation');
      }

      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('id', calc.id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Calculation not found or you do not have permission to export it');

      exportCalculationToPDF(data);
      toast({
        title: 'PDF Downloaded',
        description: 'Your tax calculation has been exported to PDF.',
      });
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExportingId(null);
    }
  };

  const handleExportCSV = async (calc: SavedCalculation) => {
    try {
      setExportingId(calc.id);
      
      if (calc.user_id !== user?.id) {
        throw new Error('You do not have permission to export this calculation');
      }

      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('id', calc.id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Calculation not found or you do not have permission to export it');

      exportCalculationToCSV(data);
      toast({
        title: 'CSV Downloaded',
        description: 'Your tax calculation has been exported to CSV.',
      });
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export CSV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExportingId(null);
    }
  };

  const handleExportAll = async () => {
    if (calculations.length === 0) {
      toast({
        title: 'No Calculations',
        description: 'There are no calculations to export.',
        variant: 'destructive',
      });
      return;
    }

    try {
      exportAllCalculationsToCSV(calculations);
      toast({
        title: 'Export Complete',
        description: `Exported ${calculations.length} calculation${calculations.length > 1 ? 's' : ''} to CSV.`,
      });
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export calculations. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAgeCategoryLabel = (category: string) => {
    switch (category) {
      case 'under_65':
        return 'Under 65';
      case '65_to_74':
        return '65-74 years';
      case '75_plus':
        return '75+ years';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background border-b border-border sticky top-0 z-10 shadow-soft">
        <div className="container px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Tax Dashboard</h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button
                variant="outline"
                onClick={() => setLocation('/calculator')}
                data-testid="button-new-calculation"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Calculation
              </Button>
              {calculations.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleExportAll}
                  data-testid="button-export-all"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => setLocation('/profile')}
                data-testid="button-profile"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Saved Calculations
            </h2>
            <p className="text-muted-foreground">
              View and manage all your tax calculations
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading calculations...</p>
              </div>
            </div>
          ) : calculations.length === 0 ? (
            <Card className="p-12 text-center">
              <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No calculations yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your first tax calculation to see it here
              </p>
              <Button onClick={() => setLocation('/calculator')} data-testid="button-start-calculation">
                <Plus className="w-4 h-4 mr-2" />
                Start New Calculation
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {calculations.map((calc) => {
                const isRefund = (calc.refund_amount ?? 0) > 0;
                const isOwing = (calc.refund_amount ?? 0) < 0;

                return (
                  <Card key={calc.id} className="p-6 hover-elevate" data-testid={`card-calculation-${calc.id}`}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
                              {calc.tax_year}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getAgeCategoryLabel(calc.age_category)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setLocation(`/calculator?edit=${calc.id}`)}
                            data-testid={`button-edit-${calc.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={exportingId === calc.id}
                                data-testid={`button-export-${calc.id}`}
                              >
                                <FileDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleExportPDF(calc)}
                                disabled={exportingId === calc.id}
                                data-testid={`button-export-pdf-${calc.id}`}
                              >
                                {exportingId === calc.id ? 'Exporting...' : 'Download PDF'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleExportCSV(calc)}
                                disabled={exportingId === calc.id}
                                data-testid={`button-export-csv-${calc.id}`}
                              >
                                {exportingId === calc.id ? 'Exporting...' : 'Download CSV'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteId(calc.id)}
                            data-testid={`button-delete-${calc.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Income</p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(calc.total_income ?? 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Taxable Income</p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(calc.taxable_income ?? 0)}
                          </p>
                        </div>
                      </div>

                      <div className={`p-3 rounded-md ${
                        isRefund ? 'bg-success/10' : isOwing ? 'bg-destructive/10' : 'bg-muted'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {isRefund && <TrendingUp className="w-4 h-4 text-success" />}
                          {isOwing && <TrendingDown className="w-4 h-4 text-destructive" />}
                          <span className={`text-xs font-medium ${
                            isRefund ? 'text-success' : isOwing ? 'text-destructive' : 'text-foreground'
                          }`}>
                            {isRefund ? 'Refund Expected' : isOwing ? 'Amount Owing' : 'Settled'}
                          </span>
                        </div>
                        <p className={`text-lg font-bold ${
                          isRefund ? 'text-success' : isOwing ? 'text-destructive' : 'text-foreground'
                        }`}>
                          {formatCurrency(Math.abs(calc.refund_amount ?? 0))}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Saved on {formatDate(calc.created_at)}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Calculation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this calculation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
