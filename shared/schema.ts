import { z } from "zod";

export const taxCalculationSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional().nullable(),
  taxYear: z.string(),
  ageCategory: z.enum(["under_65", "65_to_74", "75_plus"]),
  salaryIncome: z.number().default(0),
  freelanceIncome: z.number().default(0),
  rentalIncome: z.number().default(0),
  investmentIncome: z.number().default(0),
  retirementContributions: z.number().default(0),
  medicalAidContributions: z.number().default(0),
  medicalExpenses: z.number().default(0),
  charitableDonations: z.number().default(0),
  payePaid: z.number().default(0),
  provisionalTaxPaid: z.number().default(0),
  totalIncome: z.number().optional(),
  taxableIncome: z.number().optional(),
  totalTaxOwed: z.number().optional(),
  totalTaxPaid: z.number().optional(),
  refundAmount: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TaxCalculation = z.infer<typeof taxCalculationSchema>;

export const insertTaxCalculationSchema = taxCalculationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTaxCalculation = z.infer<typeof insertTaxCalculationSchema>;
