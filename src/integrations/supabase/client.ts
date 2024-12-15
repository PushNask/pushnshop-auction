import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://thzwoqkfwgxshqkyerzv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoendvcWtmd2d4c2hxa3llcnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwODA5OTMsImV4cCI6MjA0OTY1Njk5M30.iqWlv2tnvpcQfieRiik7GS3Oe_AfZUm8Ig4L3VuDVs8";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'pushnshop-web'
      }
    }
  }
);