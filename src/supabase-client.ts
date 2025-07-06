import { createClient } from "@supabase/supabase-js";

//URL for the database
const supabaseURL = "https://rgsykwpqxzynkwtawrzy.supabase.co";

//API Key
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseURL, supabaseAnonKey);
