// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://thzwoqkfwgxshqkyerzv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoendvcWtmd2d4c2hxa3llcnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwODA5OTMsImV4cCI6MjA0OTY1Njk5M30.iqWlv2tnvpcQfieRiik7GS3Oe_AfZUm8Ig4L3VuDVs8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);