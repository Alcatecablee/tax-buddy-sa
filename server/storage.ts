import type { TaxCalculation, InsertTaxCalculation } from "@shared/schema";

export interface IStorage {
  getTaxCalculations(userId?: string): Promise<TaxCalculation[]>;
  getTaxCalculation(id: string): Promise<TaxCalculation | null>;
  createTaxCalculation(data: InsertTaxCalculation): Promise<TaxCalculation>;
  updateTaxCalculation(id: string, data: Partial<InsertTaxCalculation>): Promise<TaxCalculation>;
  deleteTaxCalculation(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private calculations: Map<string, TaxCalculation> = new Map();

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
