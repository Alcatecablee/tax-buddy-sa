import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  users,
  taxCalculations,
  documentUploads,
  userActivities,
  subscriptions,
  usageTracking,
  taxReports,
  type User,
  type InsertUser,
  type TaxCalculation,
  type InsertTaxCalculation,
  type DocumentUpload,
  type InsertDocumentUpload,
  type UserActivity,
  type InsertUserActivity,
  type TaxReport,
  type InsertTaxReport,
} from "@shared/schema";
import { eq, desc, and, gte, lte, count } from "drizzle-orm";

// Load environment variables first
config({ path: '.env.local' });
config(); // Fallback to .env if .env.local doesn't exist

// Database connection (only if DATABASE_URL is available)
let db: any = null;
let connectionError: string | null = null;

if (process.env.DATABASE_URL) {
  try {
    console.log("🔄 Attempting to connect to production database...");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    db = drizzle(pool);

    // Test the connection asynchronously (but don't null db on error)
    pool
      .query("SELECT 1")
      .then(() => {
        console.log("✅ Database connection established successfully");
      })
      .catch((error) => {
        console.error("❌ Database connection test failed:", error.message);
        console.log(
          "🔄 Continuing with database instance - may work for actual queries",
        );
        connectionError = error.message;
        // Don't set db = null here, let it try actual queries
      });
  } catch (error) {
    console.warn("❌ Failed to initialize database connection:", error);
    connectionError = error instanceof Error ? error.message : String(error);
    db = null;
  }
} else {
  console.log("⚠️  No DATABASE_URL found - using in-memory storage");
  console.log("💡 To connect a production database, see DATABASE_SETUP.md");
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLogin(id: string): Promise<void>;

  // Tax calculation operations
  createTaxCalculation(
    calculation: InsertTaxCalculation,
  ): Promise<TaxCalculation>;
  getUserTaxCalculations(
    userId: string,
    limit?: number,
  ): Promise<TaxCalculation[]>;

  // Document upload operations
  createDocumentUpload(upload: InsertDocumentUpload): Promise<DocumentUpload>;
  getUserDocumentUploads(
    userId: string,
    limit?: number,
  ): Promise<DocumentUpload[]>;

  // User activity operations
  createUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId: string, limit?: number): Promise<UserActivity[]>;

  // Dashboard statistics
  getUserDashboardStats(userId: string): Promise<{
    totalCalculations: number;
    totalUploads: number;
    recentCalculations: TaxCalculation[];
    recentUploads: DocumentUpload[];
    recentActivity: UserActivity[];
  }>;

  // Tax reports operations
  getUserReports(userId: string): Promise<TaxReport[]>;
  createTaxReport(report: InsertTaxReport): Promise<TaxReport>;
  updateTaxReport(id: number, updates: Partial<TaxReport>): Promise<TaxReport>;
  getTaxReport(id: number): Promise<TaxReport | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, id));
  }

  // Tax calculation operations
  async createTaxCalculation(
    calculation: InsertTaxCalculation,
  ): Promise<TaxCalculation> {
    const result = await db
      .insert(taxCalculations)
      .values(calculation)
      .returning();
    return result[0];
  }

  async getUserTaxCalculations(
    userId: string,
    limit = 10,
  ): Promise<TaxCalculation[]> {
    return await db
      .select()
      .from(taxCalculations)
      .where(eq(taxCalculations.user_id, userId))
      .orderBy(desc(taxCalculations.created_at))
      .limit(limit);
  }

  // Document upload operations
  async createDocumentUpload(
    upload: InsertDocumentUpload,
  ): Promise<DocumentUpload> {
    const result = await db.insert(documentUploads).values(upload).returning();
    return result[0];
  }

  async getUserDocumentUploads(
    userId: string,
    limit = 10,
  ): Promise<DocumentUpload[]> {
    return await db
      .select()
      .from(documentUploads)
      .where(eq(documentUploads.user_id, userId))
      .orderBy(desc(documentUploads.created_at))
      .limit(limit);
  }

  // User activity operations
  async createUserActivity(
    activity: InsertUserActivity,
  ): Promise<UserActivity> {
    const result = await db.insert(userActivities).values(activity).returning();
    return result[0];
  }

  async getUserActivities(userId: string, limit = 10): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.user_id, userId))
      .orderBy(desc(userActivities.created_at))
      .limit(limit);
  }

  // Dashboard statistics
  async getUserDashboardStats(userId: string) {
    // Count tax calculations for this user
    const [calculationsCount] = await db
      .select({ count: count() })
      .from(taxCalculations)
      .where(eq(taxCalculations.user_id, userId));

    // Count document uploads for this user
    const [uploadsCount] = await db
      .select({ count: count() })
      .from(documentUploads)
      .where(eq(documentUploads.user_id, userId));

    const recentCalculations = await this.getUserTaxCalculations(userId, 5);
    const recentUploads = await this.getUserDocumentUploads(userId, 5);
    const recentActivity = await this.getUserActivities(userId, 10);

    return {
      totalCalculations: calculationsCount?.count || 0,
      totalUploads: uploadsCount?.count || 0,
      recentCalculations,
      recentUploads,
      recentActivity,
    };
  }

  // Tax reports operations
  async getUserReports(userId: string): Promise<TaxReport[]> {
    if (!db) throw new Error("Database not connected");
    return await db
      .select()
      .from(taxReports)
      .where(eq(taxReports.user_id, userId))
      .orderBy(desc(taxReports.created_at));
  }

  async createTaxReport(report: InsertTaxReport): Promise<TaxReport> {
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(taxReports).values(report).returning();
    return result[0];
  }

  async updateTaxReport(id: number, updates: Partial<TaxReport>): Promise<TaxReport> {
    if (!db) throw new Error("Database not connected");
    const result = await db
      .update(taxReports)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(taxReports.id, id))
      .returning();
    return result[0];
  }

  async getTaxReport(id: number): Promise<TaxReport | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db
      .select()
      .from(taxReports)
      .where(eq(taxReports.id, id))
      .limit(1);
    return result[0];
  }
}

// Fallback memory storage for development
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private calculations: TaxCalculation[] = [];
  private uploads: DocumentUpload[] = [];
  private activities: UserActivity[] = [];
  private reports: TaxReport[] = [];

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: user.id,
      email: user.email,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      created_at: new Date(),
      last_login: null,
      is_admin: false,
    };
    this.users.set(user.id, newUser);
    return newUser;
  }

  async updateUserLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.last_login = new Date();
    }
  }

  async createTaxCalculation(
    calculation: InsertTaxCalculation,
  ): Promise<TaxCalculation> {
    const newCalc = {
      ...calculation,
      id: this.calculations.length + 1,
      created_at: new Date(),
    };
    this.calculations.push(newCalc);
    return newCalc;
  }

  async getUserTaxCalculations(
    userId: string,
    limit = 10,
  ): Promise<TaxCalculation[]> {
    return this.calculations
      .filter((calc) => calc.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);
  }

  async createDocumentUpload(
    upload: InsertDocumentUpload,
  ): Promise<DocumentUpload> {
    const newUpload = {
      ...upload,
      id: this.uploads.length + 1,
      created_at: new Date(),
    };
    this.uploads.push(newUpload);
    return newUpload;
  }

  async getUserDocumentUploads(
    userId: string,
    limit = 10,
  ): Promise<DocumentUpload[]> {
    return this.uploads
      .filter((upload) => upload.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);
  }

  async createUserActivity(
    activity: InsertUserActivity,
  ): Promise<UserActivity> {
    const newActivity: UserActivity = {
      id: this.activities.length + 1,
      user_id: activity.user_id,
      activity_type: activity.activity_type,
      description: activity.description ?? null,
      metadata: activity.metadata ?? null,
      created_at: new Date(),
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  async getUserActivities(userId: string, limit = 10): Promise<UserActivity[]> {
    return this.activities
      .filter((activity) => activity.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);
  }

  async getUserDashboardStats(userId: string) {
    const userCalculations = this.calculations.filter(
      (c) => c.user_id === userId,
    );
    const userUploads = this.uploads.filter((u) => u.user_id === userId);

    const recentCalculations = await this.getUserTaxCalculations(userId, 5);
    const recentUploads = await this.getUserDocumentUploads(userId, 5);
    const recentActivity = await this.getUserActivities(userId, 10);

    console.log(`📊 Dashboard stats for user ${userId}:`, {
      totalCalculations: userCalculations.length,
      totalUploads: userUploads.length,
      recentCalculationsCount: recentCalculations.length,
      recentUploadsCount: recentUploads.length,
      recentActivityCount: recentActivity.length,
    });

    return {
      totalCalculations: userCalculations.length,
      totalUploads: userUploads.length,
      recentCalculations,
      recentUploads,
      recentActivity,
    };
  }

  // Tax reports operations
  async getUserReports(userId: string): Promise<TaxReport[]> {
    return this.reports
      .filter((report) => report.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async createTaxReport(report: InsertTaxReport): Promise<TaxReport> {
    const newReport: TaxReport = {
      id: this.reports.length + 1,
      user_id: report.user_id,
      report_type: report.report_type,
      tax_year: report.tax_year,
      status: report.status || "pending",
      file_path: report.file_path ?? null,
      report_data: report.report_data ?? null,
      download_count: report.download_count || 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.reports.push(newReport);
    return newReport;
  }

  async updateTaxReport(id: number, updates: Partial<TaxReport>): Promise<TaxReport> {
    const reportIndex = this.reports.findIndex((r) => r.id === id);
    if (reportIndex === -1) {
      throw new Error("Report not found");
    }
    this.reports[reportIndex] = {
      ...this.reports[reportIndex],
      ...updates,
      updated_at: new Date(),
    };
    return this.reports[reportIndex];
  }

  async getTaxReport(id: number): Promise<TaxReport | undefined> {
    return this.reports.find((r) => r.id === id);
  }
}

// Use DatabaseStorage if DATABASE_URL is available and connection succeeded, otherwise fallback to MemStorage
export const storage: IStorage =
  process.env.DATABASE_URL && db ? new DatabaseStorage() : new MemStorage();

// Log which storage system is being used
const storageType = storage instanceof DatabaseStorage ? "Database" : "Memory";
console.log(`📊 Using ${storageType} storage`);

if (connectionError) {
  console.log(`⚠️  Database connection failed: ${connectionError}`);
  console.log("💡 Run 'npm run db:test' to diagnose connection issues");
}

if (storage instanceof MemStorage && process.env.DATABASE_URL) {
  console.log(
    "🔄 Falling back to memory storage due to database connection issues",
  );
} else if (storage instanceof MemStorage) {
  console.log("🔧 To connect a production database:");
  console.log("   1. Set DATABASE_URL in your .env file");
  console.log("   2. Run 'npm run db:test' to verify connection");
  console.log("   3. Run 'npm run db:push' to create tables");
  console.log("   4. See DATABASE_SETUP.md for detailed instructions");
}
