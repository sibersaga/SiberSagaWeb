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
import { db, isFirebaseConfigured } from "../firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

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
  // Local storage cache used as synchronous initial state
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

  // Asynchronously fetch/sync and seed Firebase Firestore data on mount
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const loadData = async () => {
      try {
        // 1. Fetch Global settings (e.g. customHTML)
        const globalSettingsDoc = await getDoc(doc(db!, "settings", "global"));
        if (globalSettingsDoc.exists()) {
          const fetchedHTML = globalSettingsDoc.data().customHTML || "";
          setCustomHTMLState(fetchedHTML);
          localStorage.setItem("sdn3_custom_html", fetchedHTML);
        } else {
          // Initialize in DB
          await setDoc(doc(db!, "settings", "global"), { customHTML: "" });
        }

        // Helper to fetch collection
        const fetchCollection = async (colName: string) => {
          const snapshot = await getDocs(collection(db!, colName));
          return snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        };

        // A. Programs
        const fbPrograms = await fetchCollection("programs");
        if (fbPrograms.length > 0) {
          setProgramsState(fbPrograms as Program[]);
          localStorage.setItem("sdn3_programs", JSON.stringify(fbPrograms));
        } else {
          // Seeding DB with defaults
          for (const item of schoolPrograms) {
            await setDoc(doc(db!, "programs", item.id), item);
          }
          setProgramsState(schoolPrograms);
        }

        // B. Achievements
        const fbAchievements = await fetchCollection("achievements");
        if (fbAchievements.length > 0) {
          setAchievementsState(fbAchievements as Achievement[]);
          localStorage.setItem("sdn3_achievements", JSON.stringify(fbAchievements));
        } else {
          for (const item of schoolAchievements) {
            await setDoc(doc(db!, "achievements", item.id), item);
          }
          setAchievementsState(schoolAchievements);
        }

        // C. Agendas
        const fbAgendas = await fetchCollection("agendas");
        if (fbAgendas.length > 0) {
          setAgendasState(fbAgendas as AgendaEvent[]);
          localStorage.setItem("sdn3_agendas", JSON.stringify(fbAgendas));
        } else {
          for (const item of agendaEvents) {
            await setDoc(doc(db!, "agendas", item.id), item);
          }
          setAgendasState(agendaEvents);
        }

        // D. News
        const fbNews = await fetchCollection("news");
        if (fbNews.length > 0) {
          setNewsState(fbNews as NewsItem[]);
          localStorage.setItem("sdn3_news", JSON.stringify(fbNews));
        } else {
          for (const item of latestNews) {
            await setDoc(doc(db!, "news", item.id), item);
          }
          setNewsState(latestNews);
        }

        // E. Stats
        const fbStats = await fetchCollection("stats");
        if (fbStats.length > 0) {
          setStatsState(fbStats as SchoolStat[]);
          localStorage.setItem("sdn3_stats", JSON.stringify(fbStats));
        } else {
          for (const item of schoolStats) {
            await setDoc(doc(db!, "stats", item.id), item);
          }
          setStatsState(schoolStats);
        }

        // F. Gallery
        const fbGallery = await fetchCollection("gallery");
        if (fbGallery.length > 0) {
          setGalleryState(fbGallery as GalleryPhoto[]);
          localStorage.setItem("sdn3_gallery", JSON.stringify(fbGallery));
        } else {
          for (const item of galleryPhotos) {
            await setDoc(doc(db!, "gallery", item.id), item);
          }
          setGalleryState(galleryPhotos);
        }

        // G. FAQs
        const fbFaqs = await fetchCollection("faqs");
        if (fbFaqs.length > 0) {
          setFaqsState(fbFaqs as FAQItem[]);
          localStorage.setItem("sdn3_faqs", JSON.stringify(fbFaqs));
        } else {
          for (const item of faqItems) {
            await setDoc(doc(db!, "faqs", item.id), item);
          }
          setFaqsState(faqItems);
        }

        // H. Downloads
        const fbDownloads = await fetchCollection("downloads");
        if (fbDownloads.length > 0) {
          setDownloadsState(fbDownloads as DownloadFile[]);
          localStorage.setItem("sdn3_downloads", JSON.stringify(fbDownloads));
        } else {
          for (const item of downloadFiles) {
            await setDoc(doc(db!, "downloads", item.id), item);
          }
          setDownloadsState(downloadFiles);
        }

        // I. Admins
        const fbAdminsSnapshot = await getDocs(collection(db!, "admins"));
        const fbAdmins = fbAdminsSnapshot.docs.map(d => d.id);
        if (fbAdmins.length > 0) {
          setAdminsState(fbAdmins);
          localStorage.setItem("sdn3_admins", JSON.stringify(fbAdmins));
        } else {
          const defaultAdmins = ["kridaloka.id@gmail.com", "sdn3purwosari@gmail.com"];
          for (const email of defaultAdmins) {
            await setDoc(doc(db!, "admins", email), { enabled: true });
          }
          setAdminsState(defaultAdmins);
        }

      } catch (err) {
        console.error("Firestore sync failed, falling back to LocalStorage cached states:", err);
      }
    };

    loadData();
  }, []);

  // Update Auth persistence
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

  // Bulk synchronizer helper (wipes collection and writes new array)
  const syncCollectionToFirestore = async (colName: string, data: any[]) => {
    if (!isFirebaseConfigured || !db) return;
    try {
      const snapshot = await getDocs(collection(db, colName));
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, colName, d.id));
      }
      for (const item of data) {
        await setDoc(doc(db, colName, item.id), item);
      }
    } catch (e) {
      console.error(`Error syncing ${colName} to Firestore:`, e);
    }
  };

  // Bulk Setter Sync Actions
  const setPrograms = (data: Program[]) => {
    setProgramsState(data);
    localStorage.setItem("sdn3_programs", JSON.stringify(data));
    syncCollectionToFirestore("programs", data);
  };

  const setAchievements = (data: Achievement[]) => {
    setAchievementsState(data);
    localStorage.setItem("sdn3_achievements", JSON.stringify(data));
    syncCollectionToFirestore("achievements", data);
  };

  const setAgendas = (data: AgendaEvent[]) => {
    setAgendasState(data);
    localStorage.setItem("sdn3_agendas", JSON.stringify(data));
    syncCollectionToFirestore("agendas", data);
  };

  const setNews = (data: NewsItem[]) => {
    setNewsState(data);
    localStorage.setItem("sdn3_news", JSON.stringify(data));
    syncCollectionToFirestore("news", data);
  };

  const setAdmins = async (data: string[]) => {
    setAdminsState(data);
    localStorage.setItem("sdn3_admins", JSON.stringify(data));
    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await getDocs(collection(db, "admins"));
        for (const d of snapshot.docs) {
          await deleteDoc(doc(db, "admins", d.id));
        }
        for (const email of data) {
          await setDoc(doc(db, "admins", email), { enabled: true });
        }
      } catch (e) {
        console.error("Error syncing admins to Firestore:", e);
      }
    }
  };

  const setStats = (data: SchoolStat[]) => {
    setStatsState(data);
    localStorage.setItem("sdn3_stats", JSON.stringify(data));
    syncCollectionToFirestore("stats", data);
  };

  const setGallery = (data: GalleryPhoto[]) => {
    setGalleryState(data);
    localStorage.setItem("sdn3_gallery", JSON.stringify(data));
    syncCollectionToFirestore("gallery", data);
  };

  const setFaqs = (data: FAQItem[]) => {
    setFaqsState(data);
    localStorage.setItem("sdn3_faqs", JSON.stringify(data));
    syncCollectionToFirestore("faqs", data);
  };

  const setDownloads = (data: DownloadFile[]) => {
    setDownloadsState(data);
    localStorage.setItem("sdn3_downloads", JSON.stringify(data));
    syncCollectionToFirestore("downloads", data);
  };

  const updateCustomHTML = async (html: string) => {
    setCustomHTMLState(html);
    localStorage.setItem("sdn3_custom_html", html);
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "settings", "global"), { customHTML: html });
      } catch (e) {
        console.error("Error saving customHTML settings in Firestore:", e);
      }
    }
  };

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
    const updatedAdmins = [...admins, trimmedEmail];
    setAdminsState(updatedAdmins);
    localStorage.setItem("sdn3_admins", JSON.stringify(updatedAdmins));
    
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "admins", trimmedEmail), { enabled: true }).catch(err => {
        console.error("Failed to add admin to Firestore:", err);
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
    const updatedAdmins = admins.filter(a => a.toLowerCase() !== trimmedEmail);
    setAdminsState(updatedAdmins);
    localStorage.setItem("sdn3_admins", JSON.stringify(updatedAdmins));

    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, "admins", trimmedEmail)).catch(err => {
        console.error("Failed to delete admin from Firestore:", err);
      });
    }
    return { success: true };
  };

  // Program CRUD
  const addProgram = (p: Omit<Program, "id">) => {
    const nextId = "prog-custom-" + Date.now();
    const newProg = { ...p, id: nextId };
    setProgramsState(prev => [...prev, newProg]);
    localStorage.setItem("sdn3_programs", JSON.stringify([...programs, newProg]));

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "programs", nextId), newProg).catch(err => {
        console.error("Failed to add program to Firestore:", err);
      });
    }
  };

  const updateProgram = (id: string, updated: Partial<Program>) => {
    const updatedProgs = programs.map(p => p.id === id ? { ...p, ...updated } : p);
    setProgramsState(updatedProgs);
    localStorage.setItem("sdn3_programs", JSON.stringify(updatedProgs));

    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, "programs", id), updated).catch(err => {
        console.error("Failed to update program in Firestore:", err);
      });
    }
  };

  const deleteProgram = (id: string) => {
    const updatedProgs = programs.filter(p => p.id !== id);
    setProgramsState(updatedProgs);
    localStorage.setItem("sdn3_programs", JSON.stringify(updatedProgs));

    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, "programs", id)).catch(err => {
        console.error("Failed to delete program from Firestore:", err);
      });
    }
  };

  // Achievement CRUD
  const addAchievement = (a: Omit<Achievement, "id">) => {
    const nextId = "ach-custom-" + Date.now();
    const newAch = { ...a, id: nextId };
    setAchievementsState(prev => [...prev, newAch]);
    localStorage.setItem("sdn3_achievements", JSON.stringify([...achievements, newAch]));

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "achievements", nextId), newAch).catch(err => {
        console.error("Failed to add achievement to Firestore:", err);
      });
    }
  };

  const updateAchievement = (id: string, updated: Partial<Achievement>) => {
    const updatedAchs = achievements.map(a => a.id === id ? { ...a, ...updated } : a);
    setAchievementsState(updatedAchs);
    localStorage.setItem("sdn3_achievements", JSON.stringify(updatedAchs));

    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, "achievements", id), updated).catch(err => {
        console.error("Failed to update achievement in Firestore:", err);
      });
    }
  };

  const deleteAchievement = (id: string) => {
    const updatedAchs = achievements.filter(a => a.id !== id);
    setAchievementsState(updatedAchs);
    localStorage.setItem("sdn3_achievements", JSON.stringify(updatedAchs));

    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, "achievements", id)).catch(err => {
        console.error("Failed to delete achievement from Firestore:", err);
      });
    }
  };

  // Agenda CRUD
  const addAgenda = (ag: Omit<AgendaEvent, "id">) => {
    const nextId = "evt-custom-" + Date.now();
    const newAg = { ...ag, id: nextId };
    setAgendasState(prev => [...prev, newAg]);
    localStorage.setItem("sdn3_agendas", JSON.stringify([...agendas, newAg]));

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "agendas", nextId), newAg).catch(err => {
        console.error("Failed to add agenda to Firestore:", err);
      });
    }
  };

  const updateAgenda = (id: string, updated: Partial<AgendaEvent>) => {
    const updatedAgs = agendas.map(ag => ag.id === id ? { ...ag, ...updated } : ag);
    setAgendasState(updatedAgs);
    localStorage.setItem("sdn3_agendas", JSON.stringify(updatedAgs));

    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, "agendas", id), updated).catch(err => {
        console.error("Failed to update agenda in Firestore:", err);
      });
    }
  };

  const deleteAgenda = (id: string) => {
    const updatedAgs = agendas.filter(ag => ag.id !== id);
    setAgendasState(updatedAgs);
    localStorage.setItem("sdn3_agendas", JSON.stringify(updatedAgs));

    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, "agendas", id)).catch(err => {
        console.error("Failed to delete agenda from Firestore:", err);
      });
    }
  };

  // News CRUD
  const addNews = (n: Omit<NewsItem, "id">) => {
    const nextId = "news-custom-" + Date.now();
    const newN = { ...n, id: nextId };
    setNewsState(prev => [...prev, newN]);
    localStorage.setItem("sdn3_news", JSON.stringify([...news, newN]));

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "news", nextId), newN).catch(err => {
        console.error("Failed to add news to Firestore:", err);
      });
    }
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    const updatedNewsList = news.map(n => n.id === id ? { ...n, ...updated } : n);
    setNewsState(updatedNewsList);
    localStorage.setItem("sdn3_news", JSON.stringify(updatedNewsList));

    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, "news", id), updated).catch(err => {
        console.error("Failed to update news in Firestore:", err);
      });
    }
  };

  const deleteNews = (id: string) => {
    const updatedNewsList = news.filter(n => n.id !== id);
    setNewsState(updatedNewsList);
    localStorage.setItem("sdn3_news", JSON.stringify(updatedNewsList));

    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, "news", id)).catch(err => {
        console.error("Failed to delete news from Firestore:", err);
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
