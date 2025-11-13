import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Ultra-clean Supabase client with minimal configuration
export const supabaseClean = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Completely bypass all conflicts with a direct auth test
export const directAuthTest = async (email: string, password: string) => {
  try {
    console.log("🧪 Testing direct authentication without any overrides...");

    const response = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Direct auth successful!");
      return { success: true, data };
    } else {
      const error = await response.json();
      console.log("❌ Direct auth failed:", error);
      return { success: false, error };
    }
  } catch (err) {
    console.log("❌ Direct auth exception:", err);
    return { success: false, error: err };
  }
};
