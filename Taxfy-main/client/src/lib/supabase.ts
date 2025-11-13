import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Support both VITE_ and REACT_APP_ prefixes for compatibility
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.REACT_APP_SUPABASE_URL;

// Get the API key from environment variables - no hardcoded fallback
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                       import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

// Use window to store singleton instance across HMR reloads
declare global {
  interface Window {
    __supabaseClient?: SupabaseClient;
  }
}

// Supabase environment validation (silent in production)

// Mock client for when Supabase credentials are missing
const createMockClient = () => ({
  auth: {
    signInWithPassword: () => {
      console.warn("⚠️ Supabase credentials not configured - authentication unavailable");
      return Promise.resolve({
        data: null,
        error: {
          message: "Authentication service unavailable - please configure Supabase credentials",
          status: 401,
          name: "AuthError",
        },
      });
    },
    signUp: () => {
      console.warn("⚠️ Supabase credentials not configured - authentication unavailable");
      return Promise.resolve({
        data: null,
        error: {
          message: "Authentication service unavailable - please configure Supabase credentials",
          status: 401,
          name: "AuthError",
        },
      });
    },
    signInWithOAuth: () => {
      console.warn("⚠️ Supabase credentials not configured - authentication unavailable");
      return Promise.resolve({
        error: {
          message: "Authentication service unavailable - please configure Supabase credentials",
          status: 401,
          name: "AuthError",
        },
      });
    },
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    resend: () =>
      Promise.resolve({
        error: {
          message: "Authentication service unavailable - please configure Supabase credentials",
          status: 401,
          name: "AuthError",
        },
      }),
  },
});

// Check if we should use mock client (only if credentials are actually missing)
const shouldUseMockClient =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseAnonKey.length < 100 || // Invalid key is usually much shorter
  !supabaseAnonKey.startsWith("eyJ"); // Valid JWT should start with eyJ

// Environment check complete

let supabase: SupabaseClient | any;

// Check if we already have a singleton instance (prevents multiple clients during HMR)
if (typeof window !== 'undefined' && window.__supabaseClient) {
  supabase = window.__supabaseClient;
} else if (shouldUseMockClient) {
  console.warn(
    "⚠️ Supabase credentials missing - authentication unavailable. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
  );
  supabase = createMockClient() as any;
} else {
  try {
    const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      global: {
        headers: {
          "X-Client-Info": "taxfy-web-app",
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 2,
        },
      },
    });

    // Test the client quickly to see if it works
    tempClient.auth.getSession().then((result) => {
      if (result.error && result.error.message.includes("Invalid API key")) {
        console.warn("Supabase API key invalid");
      }
    }).catch(() => {
      // Silently handle connection test failures
    });

    // Store in window for HMR persistence
    if (typeof window !== 'undefined') {
      window.__supabaseClient = tempClient;
    }
    supabase = tempClient;
  } catch (clientError) {
    console.warn("Supabase client creation failed");
    supabase = createMockClient() as any;
  }
}

export { supabase };
