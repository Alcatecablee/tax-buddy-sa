#!/usr/bin/env node

/**
 * Setup Admin Authentication in Supabase
 *
 * This script helps create the admin user in your Supabase auth system
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("❌ Missing Supabase environment variables");
  console.log(
    "Make sure you have VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminAuth() {
  console.log("🔄 Setting up admin authentication...");

  const adminEmail = "admin@taxfy.co.za";
  const adminPassword = "TaxfyAdmin2025!";

  try {
    // Try to create the admin user
    console.log(`📧 Creating admin user: ${adminEmail}`);

    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: "Admin",
        last_name: "User",
        is_admin: true,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        console.log("✅ Admin user already exists");

        // Try to update the user
        const { data: users } = await supabase.auth.admin.listUsers();
        const adminUser = users.users.find((u) => u.email === adminEmail);

        if (adminUser) {
          console.log(`👤 Found existing admin user: ${adminUser.id}`);

          // Update user metadata to ensure admin status
          const { error: updateError } =
            await supabase.auth.admin.updateUserById(adminUser.id, {
              user_metadata: {
                first_name: "Admin",
                last_name: "User",
                is_admin: true,
              },
            });

          if (!updateError) {
            console.log("✅ Updated admin user metadata");
          }
        }
      } else {
        console.log("❌ Error creating admin user:", error.message);
        return;
      }
    } else {
      console.log("✅ Admin user created successfully!");
      console.log(`👤 User ID: ${data.user.id}`);
    }

    console.log("\n🎯 Admin credentials:");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log("\n📝 Next steps:");
    console.log("1. Go to your app's /signin page");
    console.log("2. Sign in with the admin credentials above");
    console.log("3. Navigate to /admin to access the admin dashboard");
    console.log(
      "4. Your admin user is now set up in both Supabase and your app database",
    );
  } catch (err) {
    console.log("❌ Error setting up admin auth:", err.message);
    console.log("\n🔧 Manual setup:");
    console.log("1. Go to your Supabase dashboard");
    console.log("2. Navigate to Authentication > Users");
    console.log("3. Click 'Add User'");
    console.log(`4. Email: ${adminEmail}`);
    console.log(`5. Password: ${adminPassword}`);
    console.log("6. Confirm the user");
  }
}

setupAdminAuth();
