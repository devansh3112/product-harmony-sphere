// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mjqpzthhhustptislgwp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcXB6dGhoaHVzdHB0aXNsZ3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDUyMDYsImV4cCI6MjA1NjUyMTIwNn0.y7HrqB4EDLWueLsU19ibxrq_OsXcqVijPeApxjopGng";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);