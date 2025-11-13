import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Simple Supabase client without custom fetch overrides
export const supabaseSimple = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Test function for simple authentication
export const testSimpleAuth = async (email: string, password: string) => {
  try {
    const { data, error } = await supabaseSimple.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  } catch (err) {
    console.error("Simple auth test error:", err);
    return { data: null, error: err };
  }
};
