import type { TaxCalculation, InsertTaxCalculation, PropertyTaxRate } from "@shared/schema";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export interface IStorage {
  getTaxCalculations(userId?: string): Promise<TaxCalculation[]>;
  getTaxCalculation(id: string): Promise<TaxCalculation | null>;
  createTaxCalculation(data: InsertTaxCalculation): Promise<TaxCalculation>;
  updateTaxCalculation(id: string, data: Partial<InsertTaxCalculation>): Promise<TaxCalculation>;
  deleteTaxCalculation(id: string): Promise<void>;
  
  getPropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string
  ): Promise<PropertyTaxRate | null>;
  createPropertyTaxRate(data: PropertyTaxRate): Promise<PropertyTaxRate>;
  updatePropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string,
    data: Partial<PropertyTaxRate>
  ): Promise<PropertyTaxRate>;
  deletePropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string
  ): Promise<void>;
  getAllPropertyTaxRates(): Promise<PropertyTaxRate[]>;
}

export class MemStorage implements IStorage {
  private calculations: Map<string, TaxCalculation> = new Map();
  private propertyTaxRates: Map<string, PropertyTaxRate> = new Map();

  private getRateKey(municipalityCode: string, category: PropertyTaxRate['category'], financialYear: string): string {
    return `${municipalityCode}:${category}:${financialYear}`;
  }

  async getPropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string
  ): Promise<PropertyTaxRate | null> {
    const key = this.getRateKey(municipalityCode, category, financialYear);
    return this.propertyTaxRates.get(key) || null;
  }

  async createPropertyTaxRate(data: PropertyTaxRate): Promise<PropertyTaxRate> {
    const key = this.getRateKey(data.municipalityCode, data.category, data.financialYear);
    this.propertyTaxRates.set(key, data);
    return data;
  }

  async updatePropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string,
    data: Partial<PropertyTaxRate>
  ): Promise<PropertyTaxRate> {
    const key = this.getRateKey(municipalityCode, category, financialYear);
    const existing = this.propertyTaxRates.get(key);
    if (!existing) {
      throw new Error(`Property tax rate not found for ${municipalityCode} ${category} ${financialYear}`);
    }
    const updated: PropertyTaxRate = {
      ...existing,
      ...data,
    };
    this.propertyTaxRates.set(key, updated);
    return updated;
  }

  async deletePropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string
  ): Promise<void> {
    const key = this.getRateKey(municipalityCode, category, financialYear);
    this.propertyTaxRates.delete(key);
  }

  async getAllPropertyTaxRates(): Promise<PropertyTaxRate[]> {
    return Array.from(this.propertyTaxRates.values());
  }

  async getTaxCalculations(userId?: string): Promise<TaxCalculation[]> {
    const all = Array.from(this.calculations.values());
    if (userId) {
      return all.filter(calc => calc.userId === userId);
    }
    return all;
  }

  async getTaxCalculation(id: string): Promise<TaxCalculation | null> {
    return this.calculations.get(id) || null;
  }

  async createTaxCalculation(data: InsertTaxCalculation): Promise<TaxCalculation> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const calculation: TaxCalculation = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async updateTaxCalculation(id: string, data: Partial<InsertTaxCalculation>): Promise<TaxCalculation> {
    const existing = this.calculations.get(id);
    if (!existing) {
      throw new Error("Tax calculation not found");
    }
    const updated: TaxCalculation = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.calculations.set(id, updated);
    return updated;
  }

  async deleteTaxCalculation(id: string): Promise<void> {
    this.calculations.delete(id);
  }
}

export class SupabaseStorage implements IStorage {
  private supabase;

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getTaxCalculations(userId?: string): Promise<TaxCalculation[]> {
    let query = this.supabase.from('tax_calculations').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch calculations: ${error.message}`);
    }
    
    return (data || []).map(this.mapFromDb);
  }

  async getTaxCalculation(id: string): Promise<TaxCalculation | null> {
    const { data, error } = await this.supabase
      .from('tax_calculations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch calculation: ${error.message}`);
    }
    
    return data ? this.mapFromDb(data) : null;
  }

  async createTaxCalculation(data: InsertTaxCalculation): Promise<TaxCalculation> {
    const dbData = this.mapToDb(data);
    
    const { data: result, error } = await this.supabase
      .from('tax_calculations')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create calculation: ${error.message}`);
    }
    
    return this.mapFromDb(result);
  }

  async updateTaxCalculation(id: string, data: Partial<InsertTaxCalculation>): Promise<TaxCalculation> {
    const dbData = this.mapToDb(data as InsertTaxCalculation);
    
    const { data: result, error } = await this.supabase
      .from('tax_calculations')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update calculation: ${error.message}`);
    }
    
    return this.mapFromDb(result);
  }

  async deleteTaxCalculation(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tax_calculations')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete calculation: ${error.message}`);
    }
  }

  async getPropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string
  ): Promise<PropertyTaxRate | null> {
    throw new Error('Property tax rate storage not yet implemented in Supabase (Phase 3)');
  }

  async createPropertyTaxRate(data: PropertyTaxRate): Promise<PropertyTaxRate> {
    throw new Error('Property tax rate storage not yet implemented in Supabase (Phase 3)');
  }

  async updatePropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string,
    data: Partial<PropertyTaxRate>
  ): Promise<PropertyTaxRate> {
    throw new Error('Property tax rate storage not yet implemented in Supabase (Phase 3)');
  }

  async deletePropertyTaxRate(
    municipalityCode: string,
    category: PropertyTaxRate['category'],
    financialYear: string
  ): Promise<void> {
    throw new Error('Property tax rate storage not yet implemented in Supabase (Phase 3)');
  }

  async getAllPropertyTaxRates(): Promise<PropertyTaxRate[]> {
    throw new Error('Property tax rate storage not yet implemented in Supabase (Phase 3)');
  }

  private mapFromDb(dbRow: any): TaxCalculation {
    return {
      id: dbRow.id,
      userId: dbRow.user_id,
      taxYear: dbRow.tax_year,
      ageCategory: dbRow.age_category,
      salaryIncome: dbRow.salary_income || 0,
      freelanceIncome: dbRow.freelance_income || 0,
      rentalIncome: dbRow.rental_income || 0,
      investmentIncome: dbRow.investment_income || 0,
      retirementContributions: dbRow.retirement_contributions || 0,
      medicalAidContributions: dbRow.medical_aid_contributions || 0,
      medicalExpenses: dbRow.medical_expenses || 0,
      charitableDonations: dbRow.charitable_donations || 0,
      payePaid: dbRow.paye_paid || 0,
      provisionalTaxPaid: dbRow.provisional_tax_paid || 0,
      totalIncome: dbRow.total_income,
      taxableIncome: dbRow.taxable_income,
      totalTaxOwed: dbRow.total_tax_owed,
      totalTaxPaid: dbRow.total_tax_paid,
      refundAmount: dbRow.refund_amount,
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at,
    };
  }

  private mapToDb(data: InsertTaxCalculation): any {
    return {
      user_id: data.userId,
      tax_year: data.taxYear,
      age_category: data.ageCategory,
      salary_income: data.salaryIncome,
      freelance_income: data.freelanceIncome,
      rental_income: data.rentalIncome,
      investment_income: data.investmentIncome,
      retirement_contributions: data.retirementContributions,
      medical_aid_contributions: data.medicalAidContributions,
      medical_expenses: data.medicalExpenses,
      charitable_donations: data.charitableDonations,
      paye_paid: data.payePaid,
      provisional_tax_paid: data.provisionalTaxPaid,
      total_income: data.totalIncome,
      taxable_income: data.taxableIncome,
      total_tax_owed: data.totalTaxOwed,
      total_tax_paid: data.totalTaxPaid,
      refund_amount: data.refundAmount,
    };
  }
}
