
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables or use your actual project values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjqpzthhhustptislgwp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcXB6dGhoaHVzdHB0aXNsZ3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDUyMDYsImV4cCI6MjA1NjUyMTIwNn0.y7HrqB4EDLWueLsU19ibxrq_OsXcqVijPeApxjopGng';

// Log which credentials we're using (for debugging)
console.log(`Using Supabase URL: ${supabaseUrl}`);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
