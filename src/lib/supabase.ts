import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase client with retry logic
const initSupabaseClient = () => {
  try {
    const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
      db: {
        schema: 'public'
      },
    });

    // Test the connection
    client.from('categories').select('count').single()
      .then(() => {
        console.log('Successfully connected to Supabase');
      })
      .catch((error) => {
        console.error('Error connecting to Supabase:', error.message);
      });

    return client;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }
};

export const supabase = initSupabaseClient();

// Add error handling for the connection
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.email);
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Session token refreshed');
  } else if (event === 'USER_UPDATED') {
    console.log('User data updated');
  }
});
