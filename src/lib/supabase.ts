import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  console.warn("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

// 1. Standard Client (Client-safe and Server-safe, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Admin Client (Server-side ONLY, bypasses RLS policies)
export const supabaseAdmin =
  typeof window === "undefined" && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : supabase;
