#!/usr/bin/env node

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function testConnection() {
  console.log("🔄 Testing database connection...\n");

  if (!DATABASE_URL) {
    console.log("❌ No DATABASE_URL found in environment variables");
    console.log("📝 Please set up your database connection:");
    console.log("   1. Update the .env file with your database URL");
    console.log("   2. See DATABASE_SETUP.md for detailed instructions");
    console.log("   3. Recommended: Use your Supabase database");
    return false;
  }

  console.log(
    `🔗 Attempting to connect to: ${DATABASE_URL.split("@")[1]?.split("/")[0] || "database"}`,
  );

  try {
    const pool = new Pool({ connectionString: DATABASE_URL });
    const db = drizzle(pool);

    // Test basic connection
    const result = await pool.query("SELECT NOW() as current_time, version()");

    console.log("✅ Database connection successful!");
    console.log(`📅 Server time: ${result.rows[0].current_time}`);
    console.log(
      `🐘 PostgreSQL version: ${result.rows[0].version.split(" ")[0]} ${result.rows[0].version.split(" ")[1]}`,
    );

    // Test if our tables exist
    try {
      const tables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'tax_calculations', 'document_uploads', 'user_activities')
      `);

      if (tables.rows.length > 0) {
        console.log(`📊 Found ${tables.rows.length} application tables:`);
        tables.rows.forEach((row) => console.log(`   - ${row.table_name}`));
      } else {
        console.log("⚠️  No application tables found");
        console.log("🔧 Run 'npm run db:push' to create the database schema");
      }
    } catch (tableError) {
      console.log(
        "⚠️  Could not check tables (this is normal for new databases)",
      );
    }

    await pool.end();
    return true;
  } catch (error) {
    console.log("❌ Database connection failed:");
    console.log(`   Error: ${error.message}`);

    if (error.message.includes("password authentication failed")) {
      console.log("\n💡 Suggestions:");
      console.log("   - Check your database password in the connection string");
      console.log(
        "   - Ensure the password doesn't contain special characters that need URL encoding",
      );
      console.log("   - Verify the username is correct");
    } else if (error.message.includes("does not exist")) {
      console.log("\n💡 Suggestions:");
      console.log("   - Check if the database name is correct");
      console.log("   - Ensure the database has been created");
    } else if (
      error.message.includes("timeout") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.log("\n💡 Suggestions:");
      console.log("   - Check your internet connection");
      console.log("   - Verify the host and port in the connection string");
      console.log("   - Check if the database service is running");
    }

    console.log("\n📖 For detailed setup instructions, see: DATABASE_SETUP.md");
    return false;
  }
}

// Run the test
testConnection()
  .then((success) => {
    if (success) {
      console.log("\n🎉 Your database is ready for production!");
      console.log("   Next: Restart your server with 'npm run dev'");
    } else {
      console.log("\n🔧 Please fix the database connection and try again");
    }
  })
  .catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
  });
