import { createClient } from "@supabase/supabase-js";

// Client Supabase partage (front public : cle anon, lecture seule via RLS).
// Les vraies valeurs sont dans .env.local (et dans les variables Vercel).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
