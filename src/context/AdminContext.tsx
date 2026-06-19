import React, { createContext, useContext, useState, useEffect } from "react";
import { Program, Achievement, AgendaEvent, NewsItem, SchoolStat, GalleryPhoto, FAQItem, DownloadFile } from "../types";
import {
  schoolPrograms,
  schoolAchievements,
  agendaEvents,
  latestNews,
  schoolStats,
  galleryPhotos,
  faqItems,
  downloadFiles,
} from "../data";
import {
  getCollection,
  getSetting,
  upsertCollection,
  upsertItem,
  updateItem,
  deleteItem,
  upsertSetting,
  isSupabaseConfigured,
  listAdmins,
  upsertAdmin,
  deleteAdmin as deleteAdminFromSupabase,
} from "../supabase";

interface AdminContextType {
  programs: Program[];
  achievements: Achievement[];
  agendas: AgendaEvent[];
  news: NewsItem[];
  admins: string[];
  currentUserEmail: string | null;
  isAdminMode: boolean;

  stats: SchoolStat[];
  setStats: (stats: SchoolStat[]) => void;
  gallery: GalleryPhoto[];
  setGallery: (photos: GalleryPhoto[]) => void;
  faqs: FAQItem[];
  setFaqs: (items: FAQItem[]) => void;
  downloads: DownloadFile[];
  setDownloads: (files: DownloadFile[]) => void;
  customHTML: string;
  updateCustomHTML: (html: string) => void;

  setPrograms: (programs: Program[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setAgendas: (agendas: AgendaEvent[]) => void;
  setNews: (news: NewsItem[]) => void;
  setAdmins: (admins: string[]) => void;

  login: (email: string) => { success: boolean; error?: string };
  logout: () => void;

  addProgram: (program: Omit<Program, "id">) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;

  addAchievement: (achievement: Omit<Achievement, "id">) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  addAgenda: (agenda: Omit<AgendaEvent, "id">) => void;
  updateAgenda: (id: string, agenda: Partial<AgendaEvent>) => void;
  deleteAgenda: (id: string) => void;

  addNews: (newsItem: Omit<NewsItem, "id">) => void;
  updateNews: (id: string, newsItem: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  addAdmin: (email: string) => { success: boolean; error?: string };
  deleteAdmin: (email: string) => { success: boolean; error?: string };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);
const DEFAULT_ADMINS = ["kridaloka.id@gmail.com", "sdn3purwosari@gmail.com"];

type CollectionName = "programs" | "achievements" | "agendas" | "news" | "stats" | "gallery" | "faqs" | "downloads";
type CollectionPayload = Program | Achievement | AgendaEvent | NewsItem | SchoolStat | GalleryPhoto | FAQItem | DownloadFile;

const collectionDefaults: Record<CollectionName, CollectionPayload[]> = {
  programs: schoolPrograms,
  achievements: schoolAchievements,
  agendas: agendaEvents,
  news: latestNews,
  stats: schoolStats,
  gallery: galleryPhotos,
  faqs: faqItems,
  downloads: downloadFiles,
};

const storageKeys: Record<CollectionName, string> = {
  programs: "sdn3_programs",
  achievements: "sdn3_achievements",
  agendas: "sdn3_agendas",
  news: "sdn3_news",
  stats: "sdn3_stats",
  gallery: "sdn3_gallery",
  faqs: "sdn3_faqs",
  downloads: "sdn3_downloads",
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [programs, setProgramsState] = useState<Program[]>(() => readStorage(storageKeys.programs, schoolPrograms));
  const [achievements, setAchievementsState] = useState<Achievement[]>(() => readStorage(storageKeys.achievements, schoolAchievements));
  const [agendas, setAgendasState] = useState<AgendaEvent[]>(() => readStorage(storageKeys.agendas, agendaEvents));
  const [news, setNewsState] = useState<NewsItem[]>(() => readStorage(storageKeys.news, latestNews));
  const [admins, setAdminsState] = useState<string[]>(() => readStorage("sdn3_admins", DEFAULT_ADMINS));
  const [stats, setStatsState] = useState<SchoolStat[]>(() => readStorage(storageKeys.stats, schoolStats));
  const [gallery, setGalleryState] = useState<GalleryPhoto[]>(() => readStorage(storageKeys.gallery, galleryPhotos));
  const [faqs, setFaqsState] = useState<FAQItem[]>(() => readStorage(storageKeys.faqs, faqItems));
  const [downloads, setDownloadsState] = useState<DownloadFile[]>(() => readStorage(storageKeys.downloads, downloadFiles));
  const [customHTML, setCustomHTMLState] = useState<string>(() => readStorage("sdn3_custom_html", ""));
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => readStorage<string | null>("sdn3_current_user", null));
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => readStorage("sdn3_is_admin_mode", false));

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    const apply = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, storageKey: string, data: T) => {
      if (!cancelled) {
        setter(data);
        writeStorage(storageKey, data);
      }
    };

    const loadCollection = async <T extends CollectionPayload>(
      table: CollectionName,
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      storageKey: string,
      fallback: T[]
    ) => {
      const result = await getCollection<T>(table);
      if (result.error) throw result.error;

      if (result.data && result.data.length > 0) {
        apply(setter, storageKey, result.data);
      } else {
        await upsertCollection(table, fallback as unknown as Array<Record<string, unknown>>);
        apply(setter, storageKey, fallback);
      }
    };

    const loadData = async () => {
      try {
        const settingsResult = await getSetting<{ customHTML?: string }>("customHTML");
        if (settingsResult.error) throw settingsResult.error;

        if (settingsResult.data) {
          apply(setCustomHTMLState, "sdn3_custom_html", settingsResult.data.customHTML || "");
        } else {
          await upsertSetting("customHTML", "");
        }

        await loadCollection("programs", setProgramsState, storageKeys.programs, schoolPrograms);
        await loadCollection("achievements", setAchievementsState, storageKeys.achievements, schoolAchievements);
        await loadCollection("agendas", setAgendasState, storageKeys.agendas, agendaEvents);
        await loadCollection("news", setNewsState, storageKeys.news, latestNews);
        await loadCollection("stats", setStatsState, storageKeys.stats, schoolStats);
        await loadCollection("gallery", setGalleryState, storageKeys.gallery, galleryPhotos);
        await loadCollection("faqs", setFaqsState, storageKeys.faqs, faqItems);
        await loadCollection("downloads", setDownloadsState, storageKeys.downloads, downloadFiles);

        const adminsResult = await listAdmins();
        if (adminsResult.error) throw adminsResult.error;

        if (adminsResult.data && adminsResult.data.length > 0) {
          apply(setAdminsState, "sdn3_admins", adminsResult.data);
        } else {
          await upsertCollection("admins", DEFAULT_ADMINS.map((email) => ({ id: email, email })));
          apply(setAdminsState, "sdn3_admins", DEFAULT_ADMINS);
        }
      } catch (err) {
        console.error("Supabase sync failed, falling back to LocalStorage cached states:", err);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (currentUserEmail) {
      writeStorage("sdn3_current_user", currentUserEmail);
      writeStorage("sdn3_is_admin_mode", true);
      setIsAdminMode(true);
    } else {
      localStorage.removeItem("sdn3_current_user");
      writeStorage("sdn3_is_admin_mode", false);
      setIsAdminMode(false);
    }
  }, [currentUserEmail]);

  const syncCollectionToSupabase = async (table: CollectionName, data: CollectionPayload[]) => {
    if (!isSupabaseConfigured) return;

    try {
      await upsertCollection(table, data as unknown as Array<Record<string, unknown>>);
    } catch (e) {
      console.error(`Error syncing ${table} to Supabase:`, e);
    }
  };

  const setPrograms = (data: Program[]) => {
    setProgramsState(data);
    writeStorage(storageKeys.programs, data);
    syncCollectionToSupabase("programs", data);
  };

  const setAchievements = (data: Achievement[]) => {
    setAchievementsState(data);
    writeStorage(storageKeys.achievements, data);
    syncCollectionToSupabase("achievements", data);
  };

  const setAgendas = (data: AgendaEvent[]) => {
    setAgendasState(data);
    writeStorage(storageKeys.agendas, data);
    syncCollectionToSupabase("agendas", data);
  };

  const setNews = (data: NewsItem[]) => {
    setNewsState(data);
    writeStorage(storageKeys.news, data);
    syncCollectionToSupabase("news", data);
  };

  const setAdmins = async (data: string[]) => {
    setAdminsState(data);
    writeStorage("sdn3_admins", data);

    if (isSupabaseConfigured) {
      try {
        await upsertCollection("admins", data.map((email) => ({ id: email, email })));
      } catch (e) {
        console.error("Error syncing admins to Supabase:", e);
      }
    }
  };

  const setStats = (data: SchoolStat[]) => {
    setStatsState(data);
    writeStorage(storageKeys.stats, data);
    syncCollectionToSupabase("stats", data);
  };

  const setGallery = (data: GalleryPhoto[]) => {
    setGalleryState(data);
    writeStorage(storageKeys.gallery, data);
    syncCollectionToSupabase("gallery", data);
  };

  const setFaqs = (data: FAQItem[]) => {
    setFaqsState(data);
    writeStorage(storageKeys.faqs, data);
    syncCollectionToSupabase("faqs", data);
  };

  const setDownloads = (data: DownloadFile[]) => {
    setDownloadsState(data);
    writeStorage(storageKeys.downloads, data);
    syncCollectionToSupabase("downloads", data);
  };

  const updateCustomHTML = async (html: string) => {
    setCustomHTMLState(html);
    writeStorage("sdn3_custom_html", html);

    if (isSupabaseConfigured) {
      try {
        await upsertSetting("customHTML", html);
      } catch (e) {
        console.error("Error saving customHTML settings in Supabase:", e);
      }
    }
  };

  const login = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      return { success: false, error: "Email tidak boleh kosong" };
    }

    if (admins.map((a) => a.toLowerCase()).includes(trimmedEmail)) {
      setCurrentUserEmail(trimmedEmail);
      return { success: true };
    }

    return { success: false, error: "Email belum terdaftar sebagai Admin." };
  };

  const logout = () => {
    setCurrentUserEmail(null);
  };

  const addAdmin = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      return { success: false, error: "Email tidak boleh kosong" };
    }

    if (admins.map((a) => a.toLowerCase()).includes(trimmedEmail)) {
      return { success: false, error: "Email admin sudah terdaftar." };
    }

    const updatedAdmins = [...admins, trimmedEmail];
    setAdminsState(updatedAdmins);
    writeStorage("sdn3_admins", updatedAdmins);

    if (isSupabaseConfigured) {
      upsertAdmin(trimmedEmail).catch((err) => {
        console.error("Failed to add admin to Supabase:", err);
      });
    }

    return { success: true };
  };

  const deleteAdmin = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail === "kridaloka.id@gmail.com") {
      return { success: false, error: "Admin utama (kridaloka.id@gmail.com) tidak bisa dihapus." };
    }

    if (currentUserEmail?.toLowerCase() === trimmedEmail) {
      return { success: false, error: "Anda tidak bisa menghapus email Anda sendiri yang sedang aktif." };
    }

    const updatedAdmins = admins.filter((a) => a.toLowerCase() !== trimmedEmail);
    setAdminsState(updatedAdmins);
    writeStorage("sdn3_admins", updatedAdmins);

    if (isSupabaseConfigured) {
      deleteAdminFromSupabase(trimmedEmail).catch((err) => {
        console.error("Failed to delete admin from Supabase:", err);
      });
    }

    return { success: true };
  };

  const addProgram = (p: Omit<Program, "id">) => {
    const nextId = "prog-custom-" + Date.now();
    const newProg = { ...p, id: nextId };
    const updated = [...programs, newProg];
    setProgramsState(updated);
    writeStorage(storageKeys.programs, updated);

    if (isSupabaseConfigured) {
      upsertItem("programs", nextId, newProg).catch((err) => {
        console.error("Failed to add program to Supabase:", err);
      });
    }
  };

  const updateProgram = (id: string, updated: Partial<Program>) => {
    const updatedProgs = programs.map((p) => (p.id === id ? { ...p, ...updated } : p));
    setProgramsState(updatedProgs);
    writeStorage(storageKeys.programs, updatedProgs);

    if (isSupabaseConfigured) {
      updateItem("programs", id, updated).catch((err) => {
        console.error("Failed to update program in Supabase:", err);
      });
    }
  };

  const deleteProgram = (id: string) => {
    const updatedProgs = programs.filter((p) => p.id !== id);
    setProgramsState(updatedProgs);
    writeStorage(storageKeys.programs, updatedProgs);

    if (isSupabaseConfigured) {
      deleteItem("programs", id).catch((err) => {
        console.error("Failed to delete program from Supabase:", err);
      });
    }
  };

  const addAchievement = (a: Omit<Achievement, "id">) => {
    const nextId = "ach-custom-" + Date.now();
    const newAch = { ...a, id: nextId };
    const updated = [...achievements, newAch];
    setAchievementsState(updated);
    writeStorage(storageKeys.achievements, updated);

    if (isSupabaseConfigured) {
      upsertItem("achievements", nextId, newAch).catch((err) => {
        console.error("Failed to add achievement to Supabase:", err);
      });
    }
  };

  const updateAchievement = (id: string, updated: Partial<Achievement>) => {
    const updatedAchs = achievements.map((a) => (a.id === id ? { ...a, ...updated } : a));
    setAchievementsState(updatedAchs);
    writeStorage(storageKeys.achievements, updatedAchs);

    if (isSupabaseConfigured) {
      updateItem("achievements", id, updated).catch((err) => {
        console.error("Failed to update achievement in Supabase:", err);
      });
    }
  };

  const deleteAchievement = (id: string) => {
    const updatedAchs = achievements.filter((a) => a.id !== id);
    setAchievementsState(updatedAchs);
    writeStorage(storageKeys.achievements, updatedAchs);

    if (isSupabaseConfigured) {
      deleteItem("achievements", id).catch((err) => {
        console.error("Failed to delete achievement from Supabase:", err);
      });
    }
  };

  const addAgenda = (ag: Omit<AgendaEvent, "id">) => {
    const nextId = "evt-custom-" + Date.now();
    const newAg = { ...ag, id: nextId };
    const updated = [...agendas, newAg];
    setAgendasState(updated);
    writeStorage(storageKeys.agendas, updated);

    if (isSupabaseConfigured) {
      upsertItem("agendas", nextId, newAg).catch((err) => {
        console.error("Failed to add agenda to Supabase:", err);
      });
    }
  };

  const updateAgenda = (id: string, updated: Partial<AgendaEvent>) => {
    const updatedAgs = agendas.map((ag) => (ag.id === id ? { ...ag, ...updated } : ag));
    setAgendasState(updatedAgs);
    writeStorage(storageKeys.agendas, updatedAgs);

    if (isSupabaseConfigured) {
      updateItem("agendas", id, updated).catch((err) => {
        console.error("Failed to update agenda in Supabase:", err);
      });
    }
  };

  const deleteAgenda = (id: string) => {
    const updatedAgs = agendas.filter((ag) => ag.id !== id);
    setAgendasState(updatedAgs);
    writeStorage(storageKeys.agendas, updatedAgs);

    if (isSupabaseConfigured) {
      deleteItem("agendas", id).catch((err) => {
        console.error("Failed to delete agenda from Supabase:", err);
      });
    }
  };

  const addNews = (n: Omit<NewsItem, "id">) => {
    const nextId = "news-custom-" + Date.now();
    const newN = { ...n, id: nextId };
    const updated = [...news, newN];
    setNewsState(updated);
    writeStorage(storageKeys.news, updated);

    if (isSupabaseConfigured) {
      upsertItem("news", nextId, newN).catch((err) => {
        console.error("Failed to add news to Supabase:", err);
      });
    }
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    const updatedNewsList = news.map((n) => (n.id === id ? { ...n, ...updated } : n));
    setNewsState(updatedNewsList);
    writeStorage(storageKeys.news, updatedNewsList);

    if (isSupabaseConfigured) {
      updateItem("news", id, updated).catch((err) => {
        console.error("Failed to update news in Supabase:", err);
      });
    }
  };

  const deleteNews = (id: string) => {
    const updatedNewsList = news.filter((n) => n.id !== id);
    setNewsState(updatedNewsList);
    writeStorage(storageKeys.news, updatedNewsList);

    if (isSupabaseConfigured) {
      deleteItem("news", id).catch((err) => {
        console.error("Failed to delete news from Supabase:", err);
      });
    }
  };

  return (
    <AdminContext.Provider
      value={{
        programs,
        achievements,
        agendas,
        news,
        admins,
        currentUserEmail,
        isAdminMode,
        stats,
        setStats,
        gallery,
        setGallery,
        faqs,
        setFaqs,
        downloads,
        setDownloads,
        customHTML,
        updateCustomHTML,
        setPrograms,
        setAchievements,
        setAgendas,
        setNews,
        setAdmins,
        login,
        logout,
        addProgram,
        updateProgram,
        deleteProgram,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        addAgenda,
        updateAgenda,
        deleteAgenda,
        addNews,
        updateNews,
        deleteNews,
        addAdmin,
        deleteAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
}
