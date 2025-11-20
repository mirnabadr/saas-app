import { auth as clerkAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const createClientSupabase = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
         accessToken: async () => {
           return (await clerkAuth()).getToken();
        },
    }
);

// Public Supabase client for static pages (doesn't require auth)
export const createPublicSupabaseClient = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);