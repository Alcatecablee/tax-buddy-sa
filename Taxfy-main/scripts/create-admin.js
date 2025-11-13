#!/usr/bin/env node

/**
 * Admin User Creation Script for Taxfy
 *
 * This script helps you create admin users for your Taxfy application.
 *
 * Usage:
 *   node scripts/create-admin.js --email admin@taxfy.co.za
 *   node scripts/create-admin.js --userId user-id-from-supabase
 */

import { config } from "dotenv";
config();

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:5000/api";
const ADMIN_KEY = process.env.ADMIN_CREATION_KEY || "taxfy-admin-2025";

async function createAdmin() {
  const args = process.argv.slice(2);
  const emailArg = args
    .find((arg) => arg.startsWith("--email="))
    ?.split("=")[1];
  const userIdArg = args
    .find((arg) => arg.startsWith("--userId="))
    ?.split("=")[1];

  if (!emailArg && !userIdArg) {
    console.log("❌ Error: Please provide either --email or --userId");
    console.log("\nUsage:");
    console.log("  node scripts/create-admin.js --email=admin@taxfy.co.za");
    console.log("  node scripts/create-admin.js --userId=supabase-user-id");
    process.exit(1);
  }

  console.log("🔄 Creating admin user...");

  try {
    const payload = {
      adminKey: ADMIN_KEY,
      ...(emailArg && { email: emailArg }),
      ...(userIdArg && { userId: userIdArg }),
    };

    const response = await fetch(`${API_BASE_URL}/admin/create-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Admin user created successfully!");
      console.log(`📧 Email: ${result.user.email}`);
      console.log(`👤 User ID: ${result.user.id}`);
      console.log(`🛡️  Admin Status: ${result.user.is_admin}`);
      console.log("\n🎯 Next steps:");
      console.log("1. User can now access the admin dashboard at /admin");
      console.log("2. Admin privileges are active immediately");
    } else {
      console.log("❌ Failed to create admin user:");
      console.log(`   ${result.error}`);

      if (result.error.includes("Invalid admin creation key")) {
        console.log("\n💡 Tip: Set ADMIN_CREATION_KEY environment variable");
      }
    }
  } catch (error) {
    console.log("❌ Error creating admin user:");
    console.log(`   ${error.message}`);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure your server is running (npm run dev)");
    console.log("2. Check your database connection");
    console.log("3. Verify the user exists in your system");
  }
}

createAdmin();
