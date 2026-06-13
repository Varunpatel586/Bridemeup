import { createClient } from "@supabase/supabase-js";

// Uses environment variables if available, otherwise falls back to a mock for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mock.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "mock-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
