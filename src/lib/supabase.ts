
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// These environment variables are automatically injected by the Lovable platform
// when you connect the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xtmkphotwwivgyqmltrb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bWtwaG90d3dpdmd5cW1sdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NDcyNzcsImV4cCI6MjA2MDIyMzI3N30.VbpXTQLChIqn3Qld2JEE5jo4Kfu2e5MBiariFb8XZdE';

// Check for required Supabase environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('🚨 Supabase Integration Error: Please connect your Supabase project in Lovable');
  throw new Error('Missing Supabase environment variables. Please connect Supabase integration in Lovable.');
}

// Create the Supabase client with proper configuration for authentication
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Important for password reset URLs
  }
});

// Configure Site URL for auth redirects
export const configureAuthRedirects = () => {
  console.log("Configuring auth redirects with current domain:", window.location.origin);
  
  // Set site URL to current origin
  const siteUrl = window.location.origin;
  
  // This is a client-side only configuration to ensure redirects work properly
  // Especially important for development environments where the URL might change
  if (siteUrl) {
    console.log("Setting site URL for auth redirects:", siteUrl);
    
    // Create a storage bucket for review screenshots if it doesn't exist
    const createStorageBucket = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const reviewBucket = buckets?.find(b => b.name === 'review-screenshots');
        
        if (!reviewBucket) {
          console.log("Creating review-screenshots bucket");
          const { error } = await supabase.storage.createBucket('review-screenshots', {
            public: true
          });
          
          if (error) {
            console.error("Error creating bucket:", error);
          } else {
            console.log("Successfully created review-screenshots bucket");
          }
        }
      } catch (error) {
        console.error("Error checking/creating storage bucket:", error);
      }
    };
    
    // Check and create storage bucket
    createStorageBucket();
  }
};
