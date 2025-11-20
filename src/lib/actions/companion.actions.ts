'use server';

import { createClientSupabase, createPublicSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


type CreateCompanion = {
    username: string;
    subject: string;
    topic: string;
    voice: string;
    style: string;
    duration: number;
};

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createClientSupabase();

    const { data, error } = await supabase
        .from('companions')
        .insert({ 
            name: formData.username,
            subject: formData.subject,
            topic: formData.topic,
            voice: formData.voice,
            style: formData.style,
            duration: formData.duration,
            author 
        })
        .select();
    
    if (error || !data) {
        throw new Error(error?.message || "Failed to create companion");
    }
    return data[0];
}

type GetAllCompanions = {
    limit?: number;
    page?: number;
    subject?: string;
    topic?: string;
};

export const getAllCompanions = async ({limit = 10, page = 1, subject, topic}: GetAllCompanions) => {
    const supabase = createPublicSupabaseClient();
    
    let query = supabase.from('companions').select('*');
    if (subject && topic) {
        query = query
            .ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if (subject) {
        query = query.ilike('subject', `%${subject}%`);
    } else if (topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }
    query = query.range((page - 1) * limit, page * limit - 1);
    const { data: companions, error } = await query;
    if (error || !companions) {
        throw new Error(error?.message || "Failed to get companions");
    }
    return companions;
}
export const getCompanion = async (id: string) => {
    const supabase = createPublicSupabaseClient();
     const {data, error} = await supabase
        .from('companions')
        .select('*')
        .eq('id', id);
    if (error) {
       return console.log(error);
    }
    return data[0];
}
export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createClientSupabase();
    const { data, error } = await supabase
        .from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        });
    if (error) throw new Error(error.message);
      
    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select('id, created_at, companions: companion_id(*)')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
}


export const getUserSessions = async ( userId: string, limit = 10) => {
    const supabase = createClientSupabase();
    const { data, error } = await supabase
        .from('session_history')
        .select('id, created_at, companions: companion_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
}


export const getUserCompanions = async (userId: string) => {
    const supabase = createClientSupabase();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}



export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    const supabase = createClientSupabase();

    let limit = 0;

    if(has({ plan: 'pro' })) {
        return true;
    } else if(has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if(has({ feature: "10_companion_limit" })) {
        limit = 10;
    }

    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if(error) throw new Error(error.message);

    const companionCount = data?.length;

    if(companionCount >= limit) {
        return false
    } else {
        return true;
    }
}

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createClientSupabase();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  if (error) {
    // If table doesn't exist, log warning and return null
    if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
      console.warn("Bookmarks table not found, cannot add bookmark");
      return null;
    }
    throw new Error(error.message);
  }
  // Revalidate the path to force a re-render of the page
  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createClientSupabase();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
  if (error) {
    // If table doesn't exist, log warning and return null
    if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
      console.warn("Bookmarks table not found, cannot remove bookmark");
      return null;
    }
    throw new Error(error.message);
  }
  revalidatePath(path);
  return data;
};

// Check if a companion is bookmarked by the user
export const isBookmarked = async (companionId: string, userId: string) => {
  const supabase = createClientSupabase();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("companion_id", companionId)
    .eq("user_id", userId)
    .limit(1);
  if (error) {
    // If table doesn't exist, return false
    if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
      return false;
    }
    return false;
  }
  return data && data.length > 0;
};

// Get all bookmarked companion IDs for a user
export const getBookmarkedIds = async (userId: string) => {
  const supabase = createClientSupabase();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("companion_id")
    .eq("user_id", userId);
  if (error) {
    // If table doesn't exist, return empty array
    if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
      return [];
    }
    return [];
  }
  return data?.map((item) => item.companion_id) || [];
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createClientSupabase();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
    .eq("user_id", userId);
  if (error) {
    // If table doesn't exist, return empty array
    if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
      return [];
    }
    throw new Error(error.message);
  }
  // We don't need the bookmarks data, so we return only the companions
  return data?.map(({ companions }) => companions).filter((c: any) => c) || [];
};