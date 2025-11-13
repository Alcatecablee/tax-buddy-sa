import { apiRequest, queryClient } from './queryClient';

export interface OfflineCalculation {
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
  syncStatus: 'pending' | 'synced' | 'failed';
}

const STORAGE_KEY = 'taxify_offline_calculations';
const SYNC_QUEUE_KEY = 'taxify_sync_queue';

export function getOfflineCalculations(): OfflineCalculation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading offline calculations:', error);
    return [];
  }
}

export function saveOfflineCalculation(calculation: OfflineCalculation): void {
  try {
    const calculations = getOfflineCalculations();
    const existingIndex = calculations.findIndex(c => c.id === calculation.id);
    
    if (existingIndex >= 0) {
      calculations[existingIndex] = calculation;
    } else {
      calculations.push(calculation);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculations));
  } catch (error) {
    console.error('Error saving offline calculation:', error);
    throw error;
  }
}

export function deleteOfflineCalculation(id: string): void {
  try {
    const calculations = getOfflineCalculations();
    const filtered = calculations.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting offline calculation:', error);
  }
}

export function clearSyncedCalculations(): void {
  try {
    const calculations = getOfflineCalculations();
    const pending = calculations.filter(c => c.syncStatus === 'pending' || c.syncStatus === 'failed');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error('Error clearing synced calculations:', error);
  }
}

export async function syncOfflineCalculations(userId: string): Promise<{ synced: number; failed: number }> {
  const calculations = getOfflineCalculations();
  const toSync = calculations.filter(c => 
    c.syncStatus === 'pending' || c.syncStatus === 'failed'
  );
  
  let synced = 0;
  let failed = 0;
  const syncedIds: string[] = [];
  
  for (const calc of toSync) {
    try {
      const payload = {
        userId: calc.userId || userId,
        taxYear: calc.taxYear,
        ageCategory: calc.ageCategory,
        salaryIncome: calc.salaryIncome,
        freelanceIncome: calc.freelanceIncome,
        rentalIncome: calc.rentalIncome,
        investmentIncome: calc.investmentIncome,
        retirementContributions: calc.retirementContributions,
        medicalAidContributions: calc.medicalAidContributions,
        medicalExpenses: calc.medicalExpenses,
        charitableDonations: calc.charitableDonations,
        payePaid: calc.payePaid,
        provisionalTaxPaid: calc.provisionalTaxPaid,
        totalIncome: calc.totalIncome,
        taxableIncome: calc.taxableIncome,
        totalTaxOwed: calc.totalTaxOwed,
        totalTaxPaid: calc.totalTaxPaid,
        refundAmount: calc.refundAmount,
      };
      
      await apiRequest('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      syncedIds.push(calc.id);
      synced++;
    } catch (error) {
      console.error('Failed to sync calculation:', calc.id, error);
      calc.syncStatus = 'failed';
      saveOfflineCalculation(calc);
      failed++;
    }
  }
  
  for (const id of syncedIds) {
    deleteOfflineCalculation(id);
  }
  
  if (synced > 0) {
    queryClient.invalidateQueries({ queryKey: ['/api/calculations'] });
  }
  
  return { synced, failed };
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function setupOnlineListener(callback: () => void): () => void {
  const handleOnline = () => {
    console.log('Connection restored, attempting to sync...');
    callback();
  };
  
  window.addEventListener('online', handleOnline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
