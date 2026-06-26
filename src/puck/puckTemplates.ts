import { getSetting, upsertSetting, isSupabaseConfigured } from "../supabase";

export interface PuckTemplate {
  id: string;
  name: string;
  type: "full" | "block" | "global";
  description?: string;
  category?: string;
  data: any; // Puck page data (with content and root) or block contents array
  createdAt: string;
}

const TEMPLATES_KEY = "puck_templates";

// Load all templates
export async function getPuckTemplates(): Promise<PuckTemplate[]> {
  if (!isSupabaseConfigured) {
    const local = localStorage.getItem(TEMPLATES_KEY);
    if (local) {
      try {
        return JSON.parse(local) || [];
      } catch (e) {
        console.error("Failed to parse local templates", e);
      }
    }
    return [];
  }

  try {
    const { data } = await getSetting<PuckTemplate[]>(TEMPLATES_KEY);
    return data || [];
  } catch (e) {
    console.warn("Supabase disabled or error fetching templates:", e);
    // Fallback to local storage on error
    const local = localStorage.getItem(TEMPLATES_KEY);
    if (local) {
      try {
        return JSON.parse(local) || [];
      } catch (err) {}
    }
    return [];
  }
}

// Save a template
export async function savePuckTemplate(templateData: Omit<PuckTemplate, "id" | "createdAt"> & { id?: string }): Promise<boolean> {
  try {
    const currentTemplates = await getPuckTemplates();
    
    const newTemplate: PuckTemplate = {
      id: templateData.id || `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: templateData.name,
      type: templateData.type,
      description: templateData.description || "",
      category: templateData.category || "General",
      data: templateData.data,
      createdAt: new Date().toISOString(),
    };

    let updatedTemplates: PuckTemplate[];
    const exists = currentTemplates.some(t => t.id === newTemplate.id);
    
    if (exists) {
      updatedTemplates = currentTemplates.map(t => t.id === newTemplate.id ? { ...newTemplate, createdAt: t.createdAt } : t);
    } else {
      updatedTemplates = [newTemplate, ...currentTemplates];
    }

    if (!isSupabaseConfigured) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
      return true;
    }

    const { error } = await upsertSetting(TEMPLATES_KEY, updatedTemplates);
    if (error) {
      console.error("Failed to save templates to Supabase", error);
      // Save locally as fallback
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
      return true;
    }
    return true;
  } catch (e) {
    console.error("Error saving template:", e);
    return false;
  }
}

// Delete a template
export async function deletePuckTemplate(id: string): Promise<boolean> {
  try {
    const currentTemplates = await getPuckTemplates();
    const updatedTemplates = currentTemplates.filter(t => t.id !== id);

    if (!isSupabaseConfigured) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
      return true;
    }

    const { error } = await upsertSetting(TEMPLATES_KEY, updatedTemplates);
    if (error) {
      console.error("Failed to delete template from Supabase", error);
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
      return true;
    }
    return true;
  } catch (e) {
    console.error("Error deleting template:", e);
    return false;
  }
}

// Helper to trigger browser download of JSON file
export function downloadJsonFile(data: any, fileName: string) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
