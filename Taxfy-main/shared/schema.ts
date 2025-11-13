import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  json,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for Supabase auth integration
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Supabase UUID
  email: text("email").notNull().unique(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  last_login: timestamp("last_login"),
  is_admin: boolean("is_admin").default(false).notNull(),
});

// Tax calculations table
export const taxCalculations = pgTable("tax_calculations", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  calculation_type: varchar("calculation_type", { length: 100 }).notNull(),
  input_data: json("input_data").notNull(),
  result_data: json("result_data").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Document uploads table
export const documentUploads = pgTable("document_uploads", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  filename: text("filename").notNull(),
  original_name: text("original_name").notNull(),
  file_size: integer("file_size").notNull(),
  mime_type: varchar("mime_type", { length: 100 }).notNull(),
  upload_path: text("upload_path").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// User activity logs
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  activity_type: varchar("activity_type", { length: 100 }).notNull(),
  description: text("description"),
  metadata: json("metadata"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  plan_id: varchar("plan_id", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  start_date: timestamp("start_date").defaultNow().notNull(),
  end_date: timestamp("end_date"),
  billing_cycle: varchar("billing_cycle", { length: 20 }),
  auto_renew: boolean("auto_renew").default(true),
  payment_provider: varchar("payment_provider", { length: 50 }),
  provider_subscription_id: text("provider_subscription_id"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Usage tracking table
export const usageTracking = pgTable("usage_tracking", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  feature: varchar("feature", { length: 100 }).notNull(),
  usage_count: integer("usage_count").default(0).notNull(),
  last_used: timestamp("last_used"),
  period_start: timestamp("period_start").notNull(),
  period_end: timestamp("period_end").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tax reports table
export const taxReports = pgTable("tax_reports", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  report_type: varchar("report_type", { length: 100 }).notNull(),
  tax_year: integer("tax_year").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, generated, error
  file_path: text("file_path"),
  report_data: json("report_data"), // Stores the data used to generate the report
  download_count: integer("download_count").default(0).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertTaxCalculationSchema = createInsertSchema(taxCalculations);
export const insertDocumentUploadSchema = createInsertSchema(documentUploads);
export const insertUserActivitySchema = createInsertSchema(userActivities);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const insertUsageTrackingSchema = createInsertSchema(usageTracking);
export const insertTaxReportSchema = createInsertSchema(taxReports);

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TaxCalculation = typeof taxCalculations.$inferSelect;
export type InsertTaxCalculation = typeof taxCalculations.$inferInsert;
export type DocumentUpload = typeof documentUploads.$inferSelect;
export type InsertDocumentUpload = typeof documentUploads.$inferInsert;
export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = typeof userActivities.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;
export type TaxReport = typeof taxReports.$inferSelect;
export type InsertTaxReport = typeof taxReports.$inferInsert;
