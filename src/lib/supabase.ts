import { auth as clerkAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please set it in your Vercel project settings under Environment Variables.'
    );
  }
  return url;
};

const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
      'Please set it in your Vercel project settings under Environment Variables.'
    );
  }
  return key;
};

export const createClientSupabase = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  return createClient(url, key, {
    accessToken: async () => {
      return (await clerkAuth()).getToken();
    },
  });
};

// Public Supabase client for static pages (doesn't require auth)
export const createPublicSupabaseClient = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  return createClient(url, key);
};