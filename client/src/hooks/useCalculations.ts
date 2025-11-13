import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  getOfflineCalculations, 
  deleteOfflineCalculation,
  syncOfflineCalculations,
  isOnline,
  setupOnlineListener,
} from '@/lib/offlineStorage';
import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

interface Calculation {
  id: string;
  userId: string | null;
  taxYear: string;
  ageCategory: string;
  salaryIncome: number;
  freelanceIncome: number;
  rentalIncome: number;
  investmentIncome: number;
  retirementContributions: number;
  medicalAidContributions: number;
  medicalExpenses: number;
  charitableDonations: number;
  payePaid: number;
  provisionalTaxPaid: number;
  totalIncome: number;
  taxableIncome: number;
  totalTaxOwed: number;
  totalTaxPaid: number;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
}

export function useCalculations(userId?: string) {
  const { toast } = useToast();
  const [pendingSync, setPendingSync] = useState(0);

  const { data: calculations = [], isLoading, error, refetch } = useQuery<Calculation[]>({
    queryKey: ['/api/calculations', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        if (!isOnline()) {
          throw new Error('offline');
        }

        const response = await apiRequest(`/api/calculations?userId=${userId}`);
        const data = await response.json();
        
        return data || [];
      } catch (err) {
        console.log('Loading from offline storage due to error:', err);
        const offline = getOfflineCalculations();
        const userCalcs = offline.filter(c => c.userId === userId && c.syncStatus === 'pending');
        
        return userCalcs.map(c => ({
          id: c.id,
          userId: c.userId,
          taxYear: c.taxYear,
          ageCategory: c.ageCategory,
          salaryIncome: c.salaryIncome,
          freelanceIncome: c.freelanceIncome,
          rentalIncome: c.rentalIncome,
          investmentIncome: c.investmentIncome,
          retirementContributions: c.retirementContributions,
          medicalAidContributions: c.medicalAidContributions,
          medicalExpenses: c.medicalExpenses,
          charitableDonations: c.charitableDonations,
          payePaid: c.payePaid,
          provisionalTaxPaid: c.provisionalTaxPaid,
          totalIncome: c.totalIncome,
          taxableIncome: c.taxableIncome,
          totalTaxOwed: c.totalTaxOwed,
          totalTaxPaid: c.totalTaxPaid,
          refundAmount: c.refundAmount,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));
      }
    },
    enabled: !!userId,
  });

  useEffect(() => {
    const updatePendingCount = () => {
      const offline = getOfflineCalculations();
      const pending = offline.filter(c => c.syncStatus === 'pending' || c.syncStatus === 'failed').length;
      setPendingSync(pending);
    };

    updatePendingCount();

    const cleanup = setupOnlineListener(async () => {
      if (userId) {
        try {
          const result = await syncOfflineCalculations(userId);
          if (result.synced > 0) {
            toast({
              title: 'Synced',
              description: `${result.synced} calculation(s) synced successfully`,
            });
            refetch();
            updatePendingCount();
          }
          if (result.failed > 0) {
            toast({
              title: 'Sync Warning',
              description: `${result.failed} calculation(s) failed to sync`,
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Auto-sync failed:', error);
        }
      }
    });

    return cleanup;
  }, [userId, toast, refetch]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isOnline()) {
        await apiRequest(`/api/calculations/${id}`, {
          method: 'DELETE',
        });
      }
      
      deleteOfflineCalculation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calculations'] });
    },
  });

  const manualSync = async () => {
    if (!userId) return { synced: 0, failed: 0 };
    
    try {
      const result = await syncOfflineCalculations(userId);
      if (result.synced > 0) {
        refetch();
      }
      return result;
    } catch (error) {
      console.error('Manual sync failed:', error);
      return { synced: 0, failed: 0 };
    }
  };

  return {
    calculations,
    isLoading,
    error,
    deleteCalculation: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    refetch,
    manualSync,
    pendingSync,
    isOffline: !isOnline(),
  };
}
