/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  downloadFiles 
} from "../data";

interface AdminContextType {
  programs: Program[];
  achievements: Achievement[];
  agendas: AgendaEvent[];
  news: NewsItem[];
  admins: string[];
  currentUserEmail: string | null;
  isAdminMode: boolean;
  
  // Extended editable collections
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
  
  // Custom setter actions for bulk JSON updates
  setPrograms: (programs: Program[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setAgendas: (agendas: AgendaEvent[]) => void;
  setNews: (news: NewsItem[]) => void;
  setAdmins: (admins: string[]) => void;

  // Auth actions
  login: (email: string) => { success: boolean; error?: string };
  logout: () => void;
  
  // Content actions - Programs
  addProgram: (program: Omit<Program, "id">) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  
  // Content actions - Achievements
  addAchievement: (achievement: Omit<Achievement, "id">) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;
  
  // Content actions - Agendas
  addAgenda: (agenda: Omit<AgendaEvent, "id">) => void;
  updateAgenda: (id: string, agenda: Partial<AgendaEvent>) => void;
  deleteAgenda: (id: string) => void;
  
  // Content actions - News
  addNews: (newsItem: Omit<NewsItem, "id">) => void;
  updateNews: (id: string, newsItem: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  
  // Admin list actions
  addAdmin: (email: string) => { success: boolean; error?: string };
  deleteAdmin: (email: string) => { success: boolean; error?: string };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Load data from LocalStorage or fall back to default assets
  const [programs, setProgramsState] = useState<Program[]>(() => {
    const raw = localStorage.getItem("sdn3_programs");
    return raw ? JSON.parse(raw) : schoolPrograms;
  });

  const [achievements, setAchievementsState] = useState<Achievement[]>(() => {
    const raw = localStorage.getItem("sdn3_achievements");
    return raw ? JSON.parse(raw) : schoolAchievements;
  });

  const [agendas, setAgendasState] = useState<AgendaEvent[]>(() => {
    const raw = localStorage.getItem("sdn3_agendas");
    return raw ? JSON.parse(raw) : agendaEvents;
  });

  const [news, setNewsState] = useState<NewsItem[]>(() => {
    const raw = localStorage.getItem("sdn3_news");
    return raw ? JSON.parse(raw) : latestNews;
  });

  const [admins, setAdminsState] = useState<string[]>(() => {
    const raw = localStorage.getItem("sdn3_admins");
    return raw ? JSON.parse(raw) : ["kridaloka.id@gmail.com", "sdn3purwosari@gmail.com"];
  });

  // Extended collections
  const [stats, setStatsState] = useState<SchoolStat[]>(() => {
    const raw = localStorage.getItem("sdn3_stats");
    return raw ? JSON.parse(raw) : schoolStats;
  });

  const [gallery, setGalleryState] = useState<GalleryPhoto[]>(() => {
    const raw = localStorage.getItem("sdn3_gallery");
    return raw ? JSON.parse(raw) : galleryPhotos;
  });

  const [faqs, setFaqsState] = useState<FAQItem[]>(() => {
    const raw = localStorage.getItem("sdn3_faqs");
    return raw ? JSON.parse(raw) : faqItems;
  });

  const [downloads, setDownloadsState] = useState<DownloadFile[]>(() => {
    const raw = localStorage.getItem("sdn3_downloads");
    return raw ? JSON.parse(raw) : downloadFiles;
  });

  const [customHTML, setCustomHTMLState] = useState<string>(() => {
    return localStorage.getItem("sdn3_custom_html") || "";
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("sdn3_current_user");
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem("sdn3_is_admin_mode") === "true";
  });

  // Sync to local storage
  const setPrograms = (data: Program[]) => {
    setProgramsState(data);
    localStorage.setItem("sdn3_programs", JSON.stringify(data));
  };

  const setAchievements = (data: Achievement[]) => {
    setAchievementsState(data);
    localStorage.setItem("sdn3_achievements", JSON.stringify(data));
  };

  const setAgendas = (data: AgendaEvent[]) => {
    setAgendasState(data);
    localStorage.setItem("sdn3_agendas", JSON.stringify(data));
  };

  const setNews = (data: NewsItem[]) => {
    setNewsState(data);
    localStorage.setItem("sdn3_news", JSON.stringify(data));
  };

  const setAdmins = (data: string[]) => {
    setAdminsState(data);
    localStorage.setItem("sdn3_admins", JSON.stringify(data));
  };

  const setStats = (data: SchoolStat[]) => {
    setStatsState(data);
    localStorage.setItem("sdn3_stats", JSON.stringify(data));
  };

  const setGallery = (data: GalleryPhoto[]) => {
    setGalleryState(data);
    localStorage.setItem("sdn3_gallery", JSON.stringify(data));
  };

  const setFaqs = (data: FAQItem[]) => {
    setFaqsState(data);
    localStorage.setItem("sdn3_faqs", JSON.stringify(data));
  };

  const setDownloads = (data: DownloadFile[]) => {
    setDownloadsState(data);
    localStorage.setItem("sdn3_downloads", JSON.stringify(data));
  };

  const updateCustomHTML = (html: string) => {
    setCustomHTMLState(html);
    localStorage.setItem("sdn3_custom_html", html);
  };

  // Keep original LocalStorage items in sync on load & update
  useEffect(() => {
    localStorage.setItem("sdn3_programs", JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem("sdn3_achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("sdn3_agendas", JSON.stringify(agendas));
  }, [agendas]);

  useEffect(() => {
    localStorage.setItem("sdn3_news", JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem("sdn3_admins", JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem("sdn3_current_user", currentUserEmail);
      localStorage.setItem("sdn3_is_admin_mode", "true");
      setIsAdminMode(true);
    } else {
      localStorage.removeItem("sdn3_current_user");
      localStorage.setItem("sdn3_is_admin_mode", "false");
      setIsAdminMode(false);
    }
  }, [currentUserEmail]);

  // Auth functions
  const login = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: "Email tidak boleh kosong" };
    }
    if (admins.map(a => a.toLowerCase()).includes(trimmedEmail)) {
      setCurrentUserEmail(trimmedEmail);
      return { success: true };
    }
    return { success: false, error: "Email belum terdaftar sebagai Admin." };
  };

  const logout = () => {
    setCurrentUserEmail(null);
  };

  // Admin list functions
  const addAdmin = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: "Email tidak boleh kosong" };
    }
    if (admins.map(a => a.toLowerCase()).includes(trimmedEmail)) {
      return { success: false, error: "Email admin sudah terdaftar." };
    }
    setAdmins([...admins, trimmedEmail]);
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
    setAdmins(admins.filter(a => a.toLowerCase() !== trimmedEmail));
    return { success: true };
  };

  // Program CRUD
  const addProgram = (p: Omit<Program, "id">) => {
    const nextId = "prog-custom-" + Date.now();
    setPrograms([...programs, { ...p, id: nextId }]);
  };

  const updateProgram = (id: string, updated: Partial<Program>) => {
    setPrograms(programs.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProgram = (id: string) => {
    setPrograms(programs.filter(p => p.id !== id));
  };

  // Achievement CRUD
  const addAchievement = (a: Omit<Achievement, "id">) => {
    const nextId = "ach-custom-" + Date.now();
    setAchievements([...achievements, { ...a, id: nextId }]);
  };

  const updateAchievement = (id: string, updated: Partial<Achievement>) => {
    setAchievements(achievements.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const deleteAchievement = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
  };

  // Agenda CRUD
  const addAgenda = (ag: Omit<AgendaEvent, "id">) => {
    const nextId = "evt-custom-" + Date.now();
    setAgendas([...agendas, { ...ag, id: nextId }]);
  };

  const updateAgenda = (id: string, updated: Partial<AgendaEvent>) => {
    setAgendas(agendas.map(ag => ag.id === id ? { ...ag, ...updated } : ag));
  };

  const deleteAgenda = (id: string) => {
    setAgendas(agendas.filter(ag => ag.id !== id));
  };

  // News CRUD
  const addNews = (n: Omit<NewsItem, "id">) => {
    const nextId = "news-custom-" + Date.now();
    setNews([...news, { ...n, id: nextId }]);
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    setNews(news.map(n => n.id === id ? { ...n, ...updated } : n));
  };

  const deleteNews = (id: string) => {
    setNews(news.filter(n => n.id !== id));
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
