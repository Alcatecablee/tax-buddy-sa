#!/usr/bin/env node

/**
 * Create Admin User in Supabase Auth
 * This script creates the admin user directly in Supabase
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminInSupabase() {
  console.log("🔄 Creating admin user in Supabase Auth...");

  const adminEmail = "admin@taxfy.co.za";
  const adminPassword = "TaxfyAdmin2025!";

  try {
    // Try to sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          first_name: "Admin",
          last_name: "User",
          is_admin: true,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        console.log("✅ Admin user already exists in Supabase");
        console.log("🔑 Try signing in with:");
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
      } else {
        console.log("❌ Error creating admin user:", error.message);
        console.log("\n📝 Manual Steps:");
        console.log(
          "1. Go to: https://supabase.com/dashboard/project/gegcqqedwmuncqdilbjx",
        );
        console.log("2. Authentication → Users → Add User");
        console.log(`3. Email: ${adminEmail}`);
        console.log(`4. Password: ${adminPassword}`);
        console.log("5. Check 'Confirm user'");
      }
    } else {
      console.log("✅ Admin user created successfully!");
      console.log(`👤 User ID: ${data.user?.id}`);
      console.log("📧 Check your email for confirmation (if required)");
    }

    console.log("\n🎯 Ready to test:");
    console.log("1. Go to your app's /signin page");
    console.log(`2. Email: ${adminEmail}`);
    console.log(`3. Password: ${adminPassword}`);
    console.log("4. Should sign in successfully!");
  } catch (err) {
    console.log("❌ Unexpected error:", err.message);
  }
}

createAdminInSupabase();
