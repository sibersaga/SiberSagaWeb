import { getSetting, upsertSetting, isSupabaseConfigured } from "../supabase";

export const PUCK_PUBLISHED_KEY = "puck_published";
export const PUCK_DRAFT_KEY = "puck_draft";
export const PUCK_REVISIONS_KEY = "puck_revisions";

export interface PageRevision {
  id: string;
  timestamp: string;
  data: any;
}

const MAX_REVISIONS = 15;

export async function getPuckPublishedData(): Promise<any | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data } = await getSetting<any>(PUCK_PUBLISHED_KEY);
    return data;
  } catch (e) {
    console.warn("Supabase disabled or error fetching published data:", e);
    return null;
  }
}

export async function getPuckDraftData(): Promise<any | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data } = await getSetting<any>(PUCK_DRAFT_KEY);
    return data;
  } catch (e) {
    console.warn("Supabase disabled or error fetching draft data:", e);
    return null;
  }
}

export async function savePuckDraft(data: any): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured. Using localStorage for draft.");
    localStorage.setItem(PUCK_DRAFT_KEY, JSON.stringify(data));
    return true;
  }
  
  try {
    const { error } = await upsertSetting(PUCK_DRAFT_KEY, data);
    if (error) {
      console.error("Failed to save puck draft", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Error saving puck draft", e);
    return false;
  }
}

export async function publishPuckData(data: any): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured. Using localStorage for publish.");
    localStorage.setItem("puck-page-data", JSON.stringify(data));
    localStorage.removeItem(PUCK_DRAFT_KEY);
    return true;
  }

  try {
    // 1. Save as published
    const { error } = await upsertSetting(PUCK_PUBLISHED_KEY, data);
    if (error) {
      console.error("Failed to publish puck data", error);
      return false;
    }

    // 2. Clear draft since it is published
    await upsertSetting(PUCK_DRAFT_KEY, null);

    // 3. Add to revisions
    const { data: revisions } = await getSetting<PageRevision[]>(PUCK_REVISIONS_KEY);
    let revArray = revisions || [];
    
    const newRevision: PageRevision = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data: data,
    };

    revArray = [newRevision, ...revArray];
    
    // Keep only the latest MAX_REVISIONS
    if (revArray.length > MAX_REVISIONS) {
      revArray = revArray.slice(0, MAX_REVISIONS);
    }
    
    await upsertSetting(PUCK_REVISIONS_KEY, revArray);
    return true;
  } catch (e) {
    console.error("Failed to publish or save revision", e);
    return false;
  }
}

export async function getPuckRevisions(): Promise<PageRevision[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data } = await getSetting<PageRevision[]>(PUCK_REVISIONS_KEY);
    return data || [];
  } catch (e) {
    console.warn("Error fetching revisions:", e);
    return [];
  }
}
