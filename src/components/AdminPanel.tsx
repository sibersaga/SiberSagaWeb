/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import {
  Lock,
  Unlock,
  Mail,
  KeyRound,
  User,
  Plus,
  Trash2,
  Edit2,
  Shield,
  X,
  LogOut,
  Layers,
  Award,
  Calendar,
  Newspaper,
  Users,
  Check,
  AlertCircle,
  FolderOpen,
  Code,
  BookOpen,
  Eye,
  Target,
  Flag,
  Quote
} from "lucide-react";
import { Program, Achievement, AgendaEvent, NewsItem } from "../types";
import { deleteRegistration, isSupabaseConfigured, listRegistrations } from "../supabase";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const {
    programs,
    achievements,
    agendas,
    news,
    admins,
    currentUserEmail,
    manualLoginUsername,
    isManualLoginEnabled,
    login,
    logout,
    updateManualLogin,
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
    siteContent,
    updateSiteContent,
    teachers,
    setTeachers,
    facilities,
    setFacilities,
    testimonials,
    setTestimonials,
    innovations,
    setInnovations,
  } = useAdmin();

  // Login Form state
  const [loginMode, setLoginMode] = useState<"email" | "manual">("email");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState<"admins" | "welcome" | "programs" | "achievements" | "agendas" | "news" | "registrations" | "dev">("admins");

  // Registration list state
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isRegsLoading, setIsRegsLoading] = useState(false);

  // Load registrations when the tab changes to "registrations"
  useEffect(() => {
    if (activeTab !== "registrations") return;
    
    setIsRegsLoading(true);
    if (isSupabaseConfigured) {
      listRegistrations()
        .then((result) => {
          if (result.error) throw result.error;
          setRegistrations(result.data);
        })
        .catch((err) => {
          console.error("Failed to fetch registrations from Supabase:", err);
        })
        .finally(() => {
          setIsRegsLoading(false);
        });
    } else {
      try {
        const raw = localStorage.getItem("sdn3_registrations");
        const list = raw ? JSON.parse(raw) : [];
        list.sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
        setRegistrations(list);
      } catch (e) {
        console.error("Failed to parse local registrations:", e);
      } finally {
        setIsRegsLoading(false);
      }
    }
  }, [activeTab]);

  const handleDeleteRegistration = async (regNo: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pendaftaran ${regNo}?`)) {
      if (isSupabaseConfigured) {
        try {
          const result = await deleteRegistration(regNo);
          if (result.error) throw result.error;
          setRegistrations(prev => prev.filter(r => r.id !== regNo && r.regNo !== regNo));
        } catch (e) {
          console.error("Failed to delete registration from Supabase:", e);
          alert("Gagal menghapus data.");
        }
      } else {
        const raw = localStorage.getItem("sdn3_registrations");
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.filter((r: any) => r.regNo !== regNo);
          localStorage.setItem("sdn3_registrations", JSON.stringify(updated));
          setRegistrations(updated);
        }
      }
    }
  };

  // Developer Modes (HTML / JSON Editor State)
  type JsonCollection = "all" | "siteContent" | "customHTML" | "programs" | "achievements" | "agendas" | "news" | "admins" | "stats" | "gallery" | "faqs" | "downloads" | "teachers" | "facilities" | "testimonials" | "innovations";
  const [devSubTab, setDevSubTab] = useState<"html" | "json">("json");
  const [selectedJsonCollection, setSelectedJsonCollection] = useState<JsonCollection>("all");
  const [textareaJsonValue, setTextareaJsonValue] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [jsonSuccess, setJsonSuccess] = useState(false);
  const [htmlValue, setHtmlValue] = useState(customHTML);
  const [htmlSuccess, setHtmlSuccess] = useState(false);
  const [htmlMode, setHtmlMode] = useState<"custom" | "full">("full");

  const buildAllJsonPayload = () => ({
    siteContent,
    customHTML,
    admins,
    stats,
    programs,
    achievements,
    agendas,
    news,
    teachers,
    facilities,
    gallery,
    faqs,
    downloads,
    testimonials,
    innovations,
  });

  const buildFullHtmlSnapshot = () => {
    const escapeHtml = (value: unknown) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const listItems = (items: string[]) => items.map((item) => `        <li>${escapeHtml(item)}</li>`).join("\n");
    const cards = (items: Array<{ title: string; desc?: string; description?: string }>) =>
      items.map((item) => [
        "        <article>",
        `          <h3>${escapeHtml(item.title)}</h3>`,
        `          <p>${escapeHtml(item.desc || item.description || "")}</p>`,
        "        </article>",
      ].join("\n")).join("\n");

    const w = siteContent.welcome;
    return [
      "<!doctype html>",
      "<html lang=\"id\">",
      "<head>",
      "  <meta charset=\"utf-8\" />",
      "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />",
      `  <title>${escapeHtml(siteContent.header.brandTitle)}</title>`,
      "</head>",
      "<body>",
      "  <header>",
      `    <h1>${escapeHtml(siteContent.header.brandTitle)}</h1>`,
      `    <p>${escapeHtml(siteContent.header.tagline)}</p>`,
      "    <nav>",
      "      <ul>",
      ...siteContent.header.menu.map((item) => `        <li><a href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a></li>`),
      "      </ul>",
      "    </nav>",
      "  </header>",
      "  <main>",
      "    <section id=\"hero\">",
      `      <p>${escapeHtml(siteContent.hero.badge)}</p>`,
      `      <h2>${escapeHtml(siteContent.hero.titlePrimary)} ${escapeHtml(siteContent.hero.titleSecondary)}</h2>`,
      `      <p>${escapeHtml(siteContent.hero.description)}</p>`,
      "    </section>",
      "    <section id=\"sambutan\">",
      `      <h2>${escapeHtml(w.title)}</h2>`,
      `      <p>${escapeHtml(w.description)}</p>`,
      `      <h3>${escapeHtml(w.tabs.sambutan.label)}</h3>`,
      `      <blockquote>${escapeHtml(w.tabs.sambutan.quote)}</blockquote>`,
      ...w.tabs.sambutan.paragraphs.map((item) => `      <p>${escapeHtml(item)}</p>`),
      `      <p><strong>${escapeHtml(w.tabs.sambutan.closing)}</strong></p>`,
      `      <h3>${escapeHtml(w.tabs.visi.label)}</h3>`,
      `      <p>${escapeHtml(w.tabs.visi.title)}</p>`,
      `      <p>${escapeHtml(w.tabs.visi.description)}</p>`,
      cards(w.tabs.visi.highlights),
      `      <h3>${escapeHtml(w.tabs.misi.label)}</h3>`,
      "      <ol>",
      listItems(w.tabs.misi.items),
      "      </ol>",
      `      <h3>${escapeHtml(w.tabs.tujuan.label)}</h3>`,
      cards(w.tabs.tujuan.goals),
      "    </section>",
      "    <section id=\"program\">",
      "      <h2>Program</h2>",
      cards(programs),
      "    </section>",
      "    <section id=\"prestasi\">",
      "      <h2>Prestasi</h2>",
      ...achievements.map((item) => `      <article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.rank)} - ${escapeHtml(item.level)} (${escapeHtml(item.year)})</p></article>`),
      "    </section>",
      "    <section id=\"berita\">",
      "      <h2>Berita</h2>",
      ...news.map((item) => `      <article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.excerpt)}</p></article>`),
      "    </section>",
      "  </main>",
      "  <footer>",
      `    <p>${escapeHtml(siteContent.footer.address)}</p>`,
      `    <p>${escapeHtml(siteContent.footer.copyright)}</p>`,
      "  </footer>",
      "</body>",
      "</html>",
    ].join("\n");
  };

  // Sync JSON Textarea with selected collection
  useEffect(() => {
    let rawData: any = buildAllJsonPayload();
    if (selectedJsonCollection === "all") rawData = buildAllJsonPayload();
    else if (selectedJsonCollection === "siteContent") rawData = siteContent;
    else if (selectedJsonCollection === "customHTML") rawData = customHTML;
    else if (selectedJsonCollection === "programs") rawData = programs;
    else if (selectedJsonCollection === "achievements") rawData = achievements;
    else if (selectedJsonCollection === "agendas") rawData = agendas;
    else if (selectedJsonCollection === "news") rawData = news;
    else if (selectedJsonCollection === "admins") rawData = admins;
    else if (selectedJsonCollection === "stats") rawData = stats;
    else if (selectedJsonCollection === "gallery") rawData = gallery;
    else if (selectedJsonCollection === "faqs") rawData = faqs;
    else if (selectedJsonCollection === "downloads") rawData = downloads;
    else if (selectedJsonCollection === "teachers") rawData = teachers;
    else if (selectedJsonCollection === "facilities") rawData = facilities;
    else if (selectedJsonCollection === "testimonials") rawData = testimonials;
    else if (selectedJsonCollection === "innovations") rawData = innovations;
    
    setTextareaJsonValue(JSON.stringify(rawData, null, 2));
    setJsonError("");
    setJsonSuccess(false);
  }, [selectedJsonCollection, siteContent, customHTML, programs, achievements, agendas, news, admins, stats, gallery, faqs, downloads, teachers, facilities, testimonials, innovations]);

  // Sync HTML input state when customHTML changes
  useEffect(() => {
    setHtmlValue(htmlMode === "full" ? buildFullHtmlSnapshot() : customHTML);
  }, [customHTML, htmlMode, siteContent, programs, achievements, news]);

  // General Form States
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingWelcome, setIsEditingWelcome] = useState(false);
  const [welcomeEditStatus, setWelcomeEditStatus] = useState<{ success: boolean; message: string } | null>(null);

  const buildWelcomeForm = () => ({
    eyebrow: siteContent.welcome.eyebrow || "",
    title: siteContent.welcome.title || "",
    description: siteContent.welcome.description || "",
    sambutan: {
      label: siteContent.welcome.tabs.sambutan.label || "",
      badge: siteContent.welcome.tabs.sambutan.badge || "",
      title: siteContent.welcome.tabs.sambutan.title || "",
      quote: siteContent.welcome.tabs.sambutan.quote || "",
      paragraphs: [...(siteContent.welcome.tabs.sambutan.paragraphs || ["", "", "", ""])],
      closing: siteContent.welcome.tabs.sambutan.closing || ""
    },
    visi: {
      label: siteContent.welcome.tabs.visi.label || "",
      badge: siteContent.welcome.tabs.visi.badge || "",
      title: siteContent.welcome.tabs.visi.title || "",
      intro: siteContent.welcome.tabs.visi.intro || "",
      description: siteContent.welcome.tabs.visi.description || "",
      highlights: [...(siteContent.welcome.tabs.visi.highlights || [{ title: "", desc: "" }])]
    },
    misi: {
      label: siteContent.welcome.tabs.misi.label || "",
      badge: siteContent.welcome.tabs.misi.badge || "",
      title: siteContent.welcome.tabs.misi.title || "",
      intro: siteContent.welcome.tabs.misi.intro || "",
      items: [...(siteContent.welcome.tabs.misi.items || ["", "", ""])],
      panelTitle: siteContent.welcome.tabs.misi.panelTitle || "",
      panelDescription: siteContent.welcome.tabs.misi.panelDescription || "",
      footerLeft: siteContent.welcome.tabs.misi.footerLeft || "",
      footerRight: siteContent.welcome.tabs.misi.footerRight || ""
    },
    tujuan: {
      label: siteContent.welcome.tabs.tujuan.label || "",
      badge: siteContent.welcome.tabs.tujuan.badge || "",
      title: siteContent.welcome.tabs.tujuan.title || "",
      intro: siteContent.welcome.tabs.tujuan.intro || "",
      sideTitle: siteContent.welcome.tabs.tujuan.sideTitle || "",
      sideDescription: siteContent.welcome.tabs.tujuan.sideDescription || "",
      goals: [...(siteContent.welcome.tabs.tujuan.goals || [{ title: "", desc: "" }])]
    }
  });

  // Welcome form state
  const [welcomeForm, setWelcomeForm] = useState(buildWelcomeForm);

  useEffect(() => {
    if (!isEditingWelcome) {
      setWelcomeForm(buildWelcomeForm());
    }
  }, [siteContent, isEditingWelcome]);

  // New admin state
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminStatus, setAdminStatus] = useState({ success: true, message: "" });
  const [manualUsername, setManualUsername] = useState(manualLoginUsername);
  const [manualPassword, setManualPassword] = useState("");
  const [manualPasswordConfirm, setManualPasswordConfirm] = useState("");
  const [manualLoginStatus, setManualLoginStatus] = useState({ success: true, message: "" });

  useEffect(() => {
    setManualUsername(manualLoginUsername);
  }, [manualLoginUsername]);

  // CRUD Item states
  const [programForm, setProgramForm] = useState<Omit<Program, "id">>({
    title: "",
    description: "",
    category: "unggulan",
    icon: "BookOpen",
    color: "from-blue-500 to-blue-700"
  });

  const [achievementForm, setAchievementForm] = useState<Omit<Achievement, "id">>({
    title: "",
    rank: "",
    level: "",
    year: "",
    category: "",
    image: ""
  });

  const [agendaForm, setAgendaForm] = useState<Omit<AgendaEvent, "id">>({
    title: "",
    date: "",
    day: "",
    month: "",
    time: "",
    location: "",
    category: "akademik"
  });

  const [newsForm, setNewsForm] = useState<Omit<NewsItem, "id">>({
    title: "",
    excerpt: "",
    content: "",
    date: "",
    category: "Berita",
    image: "",
    author: ""
  });

  const handleSaveJson = async () => {
    setJsonError("");
    setJsonSuccess(false);
    try {
      const parsedData = JSON.parse(textareaJsonValue);

      if (selectedJsonCollection === "all") {
        if (!parsedData || typeof parsedData !== "object" || Array.isArray(parsedData)) {
          setJsonError("Format Seluruh Website harus berupa Object JSON.");
          return;
        }

        if (parsedData.siteContent) {
          const result = await updateSiteContent(parsedData.siteContent);
          if (!result.success) {
            setJsonError(result.error || "Gagal menyimpan siteContent.");
            return;
          }
        }
        if (typeof parsedData.customHTML === "string") updateCustomHTML(parsedData.customHTML);
        if (Array.isArray(parsedData.programs)) setPrograms(parsedData.programs);
        if (Array.isArray(parsedData.achievements)) setAchievements(parsedData.achievements);
        if (Array.isArray(parsedData.agendas)) setAgendas(parsedData.agendas);
        if (Array.isArray(parsedData.news)) setNews(parsedData.news);
        if (Array.isArray(parsedData.admins)) setAdmins(parsedData.admins);
        if (Array.isArray(parsedData.stats)) setStats(parsedData.stats);
        if (Array.isArray(parsedData.gallery)) setGallery(parsedData.gallery);
        if (Array.isArray(parsedData.faqs)) setFaqs(parsedData.faqs);
        if (Array.isArray(parsedData.downloads)) setDownloads(parsedData.downloads);
        if (Array.isArray(parsedData.teachers)) setTeachers(parsedData.teachers);
        if (Array.isArray(parsedData.facilities)) setFacilities(parsedData.facilities);
        if (Array.isArray(parsedData.testimonials)) setTestimonials(parsedData.testimonials);
        if (Array.isArray(parsedData.innovations)) setInnovations(parsedData.innovations);
      } else if (selectedJsonCollection === "siteContent") {
        if (!parsedData || typeof parsedData !== "object" || Array.isArray(parsedData)) {
          setJsonError("Format siteContent harus berupa Object JSON.");
          return;
        }
        const result = await updateSiteContent(parsedData);
        if (!result.success) {
          setJsonError(result.error || "Gagal menyimpan siteContent.");
          return;
        }
      } else if (selectedJsonCollection === "customHTML") {
        if (typeof parsedData !== "string") {
          setJsonError("Format customHTML harus berupa string JSON.");
          return;
        }
        updateCustomHTML(parsedData);
      } else if (!Array.isArray(parsedData)) {
        setJsonError("Format data harus berupa Array JSON.");
        return;
      } else if (selectedJsonCollection === "programs") {
        setPrograms(parsedData);
      } else if (selectedJsonCollection === "achievements") {
        setAchievements(parsedData);
      } else if (selectedJsonCollection === "agendas") {
        setAgendas(parsedData);
      } else if (selectedJsonCollection === "news") {
        setNews(parsedData);
      } else if (selectedJsonCollection === "admins") {
        if (!parsedData.every((item: any) => typeof item === "string")) {
          setJsonError("Data admin harus berupa array of strings yang berisi alamat email.");
          return;
        }
        setAdmins(parsedData);
      } else if (selectedJsonCollection === "stats") {
        setStats(parsedData);
      } else if (selectedJsonCollection === "gallery") {
        setGallery(parsedData);
      } else if (selectedJsonCollection === "faqs") {
        setFaqs(parsedData);
      } else if (selectedJsonCollection === "downloads") {
        setDownloads(parsedData);
      } else if (selectedJsonCollection === "teachers") {
        setTeachers(parsedData);
      } else if (selectedJsonCollection === "facilities") {
        setFacilities(parsedData);
      } else if (selectedJsonCollection === "testimonials") {
        setTestimonials(parsedData);
      } else if (selectedJsonCollection === "innovations") {
        setInnovations(parsedData);
      }

      setJsonSuccess(true);
      setTimeout(() => setJsonSuccess(false), 3000);
    } catch (err: any) {
      setJsonError("JSON tidak valid atau mengalami galat struktur: " + err.message);
    }
  };

  const handleSaveHtml = () => {
    updateCustomHTML(htmlValue);
    setHtmlSuccess(true);
    setTimeout(() => setHtmlSuccess(false), 3000);
  };

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = loginMode === "email"
      ? await login(loginEmail)
      : await login(loginUsername, loginPassword);

    if (!res.success) {
      setLoginError(res.error || "Gagal masuk.");
    } else {
      setLoginEmail("");
      setLoginUsername("");
      setLoginPassword("");
    }
  };

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminStatus({ success: true, message: "" });
    const res = addAdmin(newAdminEmail);
    if (res.success) {
      setAdminStatus({ success: true, message: `Admin ${newAdminEmail} berhasil ditambahkan!` });
      setNewAdminEmail("");
    } else {
      setAdminStatus({ success: false, message: res.error || "Gagal menambahkan admin." });
    }
  };

  const handleDeleteAdmin = (email: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus admin ${email}?`)) {
      const res = deleteAdmin(email);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  const handleManualLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualLoginStatus({ success: true, message: "" });

    if (manualPassword !== manualPasswordConfirm) {
      setManualLoginStatus({ success: false, message: "Konfirmasi password belum sama." });
      return;
    }

    const res = await updateManualLogin(manualUsername, manualPassword);
    if (res.success) {
      setManualPassword("");
      setManualPasswordConfirm("");
      setManualLoginStatus({ success: true, message: "Login manual berhasil disimpan." });
    } else {
      setManualLoginStatus({ success: false, message: res.error || "Gagal menyimpan login manual." });
    }
  };

  const handleWelcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWelcomeEditStatus(null);

    const nextContent = {
      ...siteContent,
      welcome: {
        ...siteContent.welcome,
        eyebrow: welcomeForm.eyebrow.trim(),
        title: welcomeForm.title.trim(),
        description: welcomeForm.description.trim(),
        tabs: {
          ...siteContent.welcome.tabs,
          sambutan: {
            ...siteContent.welcome.tabs.sambutan,
            ...welcomeForm.sambutan,
            paragraphs: welcomeForm.sambutan.paragraphs.map((item) => item.trim()).filter(Boolean),
          },
          visi: {
            ...siteContent.welcome.tabs.visi,
            ...welcomeForm.visi,
            highlights: welcomeForm.visi.highlights
              .map((item) => ({ title: item.title.trim(), desc: item.desc.trim() }))
              .filter((item) => item.title || item.desc),
          },
          misi: {
            ...siteContent.welcome.tabs.misi,
            ...welcomeForm.misi,
            items: welcomeForm.misi.items.map((item) => item.trim()).filter(Boolean),
          },
          tujuan: {
            ...siteContent.welcome.tabs.tujuan,
            ...welcomeForm.tujuan,
            goals: welcomeForm.tujuan.goals
              .map((item) => ({ title: item.title.trim(), desc: item.desc.trim() }))
              .filter((item) => item.title || item.desc),
          },
        },
      },
    };

    const result = await updateSiteContent(nextContent);
    if (result.success) {
      setIsEditingWelcome(false);
      setWelcomeEditStatus({ success: true, message: "Konten profil sekolah berhasil disimpan." });
    } else {
      setWelcomeEditStatus({ success: false, message: result.error || "Gagal menyimpan konten profil." });
    }
  };

  const updateWelcomeParagraph = (index: number, value: string) => {
    const paragraphs = [...welcomeForm.sambutan.paragraphs];
    paragraphs[index] = value;
    setWelcomeForm({ ...welcomeForm, sambutan: { ...welcomeForm.sambutan, paragraphs } });
  };

  const updateMisiItem = (index: number, value: string) => {
    const items = [...welcomeForm.misi.items];
    items[index] = value;
    setWelcomeForm({ ...welcomeForm, misi: { ...welcomeForm.misi, items } });
  };

  const updateVisiHighlight = (index: number, key: "title" | "desc", value: string) => {
    const highlights = [...welcomeForm.visi.highlights];
    highlights[index] = { ...highlights[index], [key]: value };
    setWelcomeForm({ ...welcomeForm, visi: { ...welcomeForm.visi, highlights } });
  };

  const updateTujuanGoal = (index: number, key: "title" | "desc", value: string) => {
    const goals = [...welcomeForm.tujuan.goals];
    goals[index] = { ...goals[index], [key]: value };
    setWelcomeForm({ ...welcomeForm, tujuan: { ...welcomeForm.tujuan, goals } });
  };

  // Program Handlers
  const handleProgramEditInit = (p: Program) => {
    setEditingId(p.id);
    setProgramForm({
      title: p.title,
      description: p.description,
      category: p.category,
      icon: p.icon,
      color: p.color
    });
    setIsAdding(true);
  };

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.title || !programForm.description) {
      alert("Judul dan deskripsi tidak boleh kosong");
      return;
    }
    if (editingId) {
      updateProgram(editingId, programForm);
    } else {
      addProgram(programForm);
    }
    // Reset Form
    setIsAdding(false);
    setEditingId(null);
    setProgramForm({
      title: "",
      description: "",
      category: "unggulan",
      icon: "BookOpen",
      color: "from-blue-500 to-blue-700"
    });
  };

  const handleProgramDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus program "${title}"?`)) {
      deleteProgram(id);
    }
  };

  // Achievement Handlers
  const handleAchievementEditInit = (a: Achievement) => {
    setEditingId(a.id);
    setAchievementForm({
      title: a.title,
      rank: a.rank,
      level: a.level,
      year: a.year,
      category: a.category,
      image: a.image
    });
    setIsAdding(true);
  };

  const handleAchievementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.title || !achievementForm.rank || !achievementForm.level) {
      alert("Lengkapi semua field utama prestasi");
      return;
    }
    // provide default elegant image if empty
    const img = achievementForm.image.trim() || "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=500";
    const payload = { ...achievementForm, image: img };

    if (editingId) {
      updateAchievement(editingId, payload);
    } else {
      addAchievement(payload);
    }
    setIsAdding(false);
    setEditingId(null);
    setAchievementForm({
      title: "",
      rank: "",
      level: "",
      year: new Date().getFullYear().toString(),
      category: "Akademik",
      image: ""
    });
  };

  const handleAchievementDelete = (id: string, title: string) => {
    if (confirm(`Hapus prestasi "${title}"?`)) {
      deleteAchievement(id);
    }
  };

  // Agenda Handlers
  const handleAgendaEditInit = (ag: AgendaEvent) => {
    setEditingId(ag.id);
    setAgendaForm({
      title: ag.title,
      date: ag.date,
      day: ag.day,
      month: ag.month,
      time: ag.time,
      location: ag.location,
      category: ag.category
    });
    setIsAdding(true);
  };

  const handleAgendaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaForm.title || !agendaForm.date || !agendaForm.day) {
      alert("Harap lengkapi judul, tanggal, dan hari");
      return;
    }
    if (editingId) {
      updateAgenda(editingId, agendaForm);
    } else {
      addAgenda(agendaForm);
    }
    setIsAdding(false);
    setEditingId(null);
    setAgendaForm({
      title: "",
      date: "",
      day: "",
      month: "",
      time: "",
      location: "",
      category: "akademik"
    });
  };

  const handleAgendaDelete = (id: string, title: string) => {
    if (confirm(`Hapus agenda "${title}"?`)) {
      deleteAgenda(id);
    }
  };

  // News Handlers
  const handleNewsEditInit = (n: NewsItem) => {
    setEditingId(n.id);
    setNewsForm({
      title: n.title,
      excerpt: n.excerpt,
      content: n.content,
      date: n.date,
      category: n.category,
      image: n.image,
      author: n.author
    });
    setIsAdding(true);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) {
      alert("Harap isi judul dan konten berita");
      return;
    }
    const img = newsForm.image.trim() || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600";
    const payload = { ...newsForm, image: img, author: newsForm.author || "Admin Sekolah" };

    if (editingId) {
      updateNews(editingId, payload);
    } else {
      addNews(payload);
    }
    setIsAdding(false);
    setEditingId(null);
    setNewsForm({
      title: "",
      excerpt: "",
      content: "",
      date: "",
      category: "Berita",
      image: "",
      author: ""
    });
  };

  const handleNewsDelete = (id: string, title: string) => {
    if (confirm(`Hapus berita "${title}"?`)) {
      deleteNews(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-50 w-screen h-screen flex flex-col overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-slate-950 px-5 md:px-8 py-4 flex items-center justify-between text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm md:text-lg tracking-wide">
                Admin Workspace SDN 3 Purwosari
              </h3>
              {currentUserEmail ? (
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-350">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sesi Aktif: <strong className="text-slate-200">{currentUserEmail}</strong></span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">Verifikasi email diperlukan</span>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Tutup Panel Admin"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conditional Layout: Login or Dashboard */}
        {!currentUserEmail ? (
          /* LOGIN FORM SCREEN */
          <div className="flex-1 overflow-y-auto flex items-center justify-center bg-slate-50 p-6 md:p-12">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full border border-slate-200 shadow-xl">
              <div className="text-center mb-6">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl inline-block mb-3">
                  <Lock size={28} />
                </div>
                <h4 className="text-lg font-heading font-extrabold text-[#1E293B]">
                  Pintu Masuk Admin
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Masuk memakai email admin atau username manual yang sudah diseting di panel.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => { setLoginMode("email"); setLoginError(""); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    loginMode === "email" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMode("manual"); setLoginError(""); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    loginMode === "manual" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Manual
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginMode === "email" ? (
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">
                      Alamat Email Admin
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="websdn3purwosari@gmail.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-blue-600 rounded-xl outline-none text-xs md:text-sm font-medium transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder={isManualLoginEnabled ? "Masukkan username" : "Belum diseting"}
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-blue-600 rounded-xl outline-none text-xs md:text-sm font-medium transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <KeyRound size={16} className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="password"
                          required
                          placeholder="Masukkan password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-blue-600 rounded-xl outline-none text-xs md:text-sm font-medium transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {loginError && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-start gap-2 text-red-700 text-xs text-left">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock size={14} />
                  Verifikasi & Masuk
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-relaxed">
                Email admin utama: <strong className="text-slate-650 font-bold">websdn3purwosari@gmail.com</strong>
              </div>
            </div>
          </div>
        ) : (
          /* ADMIN DASHBOARD WORKSPACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-full md:w-72 bg-slate-950 text-white flex flex-col shrink-0 border-r border-slate-800">
              <div className="p-5 border-b border-slate-800 hidden md:block">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Menu Dashboard</span>
                <p className="text-xs text-slate-300 font-semibold mt-1">Kelola konten, data, HTML, dan JSON website.</p>
              </div>
              
              <nav className="p-3 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
<button
                   onClick={() => { setActiveTab("admins"); setIsAdding(false); setEditingId(null); }}
                   className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                     activeTab === "admins"
                       ? "bg-blue-600 text-white font-bold"
                       : "text-slate-400 hover:bg-slate-900 hover:text-white"
                   }`}
                 >
                   <Shield size={14} />
                   Kelola Admin
                 </button>

                 <button
                   onClick={() => { setActiveTab("welcome"); setIsAdding(false); setEditingId(null); }}
                   className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                     activeTab === "welcome"
                       ? "bg-blue-600 text-white font-bold"
                       : "text-slate-400 hover:bg-slate-900 hover:text-white"
                   }`}
                 >
                   <Quote size={14} />
                   Kelola Profil
                 </button>

                <button
                  onClick={() => { setActiveTab("programs"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "programs"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Layers size={14} />
                  Kelola Program
                </button>

                <button
                  onClick={() => { setActiveTab("achievements"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "achievements"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Award size={14} />
                  Kelola Prestasi
                </button>

                <button
                  onClick={() => { setActiveTab("agendas"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "agendas"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Calendar size={14} />
                  Kelola Agenda
                </button>

                <button
                  onClick={() => { setActiveTab("news"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "news"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Newspaper size={14} />
                  Kelola Berita
                </button>

                <button
                  onClick={() => { setActiveTab("registrations"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "registrations"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Users size={14} />
                  Pendaftar PPDB
                </button>

                <button
                  onClick={() => { setActiveTab("dev"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "dev"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Code size={14} />
                  Editor HTML & JSON
                </button>

                <a
                  href="/admin/builder"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all text-slate-400 hover:bg-slate-900 hover:text-white"
                >
                  <Layers size={14} className="text-blue-400" />
                  Visual Page Builder (Puck)
                </a>
              </nav>

              <div className="mt-auto p-3 border-t border-slate-800 hidden md:block">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  Keluar Akun
                </button>
              </div>
            </div>

            {/* Main Action Working Canvas Workspace */}
            <div className="flex-1 bg-slate-100 p-4 md:p-6 lg:p-8 overflow-y-auto flex flex-col gap-5">
              
              {/* 1. MANAGE ADMINS TAB */}
              {activeTab === "admins" && (
                <div className="max-w-2xl w-full mx-auto space-y-6">
                  <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-slate-200">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">Kelola Hak Akses Admin</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Atur email admin dan login manual untuk masuk ke panel kontrol.</p>
                    </div>
                  </div>

                  {/* Manual Login Settings */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-150">
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Login Manual</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isManualLoginEnabled ? `Aktif untuk username "${manualLoginUsername}".` : "Belum aktif. Simpan username dan password untuk mengaktifkan."}
                        </p>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2 py-1 rounded uppercase ${
                        isManualLoginEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                      }`}>
                        {isManualLoginEnabled ? "Aktif" : "Belum Aktif"}
                      </span>
                    </div>

                    <form onSubmit={handleManualLoginSubmit} className="grid md:grid-cols-3 gap-2">
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="Username"
                          value={manualUsername}
                          onChange={(e) => setManualUsername(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-blue-600 rounded-xl outline-none text-xs font-medium transition-all"
                        />
                      </div>
                      <div className="relative">
                        <KeyRound size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Password baru"
                          value={manualPassword}
                          onChange={(e) => setManualPassword(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-blue-600 rounded-xl outline-none text-xs font-medium transition-all"
                        />
                      </div>
                      <div className="relative">
                        <KeyRound size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Ulangi password"
                          value={manualPasswordConfirm}
                          onChange={(e) => setManualPasswordConfirm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-blue-600 rounded-xl outline-none text-xs font-medium transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        className="md:col-span-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check size={14} />
                        Simpan Login Manual
                      </button>
                    </form>

                    {manualLoginStatus.message && (
                      <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                        manualLoginStatus.success ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-red-50 text-red-800 border-red-100"
                      }`}>
                        {manualLoginStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
                        <span>{manualLoginStatus.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Add Admin Form */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-150">
                    <h5 className="font-bold text-slate-800 text-xs mb-3.5 uppercase tracking-wide">Daftarkan Admin Baru</h5>
                    <form onSubmit={handleAddAdminSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="Masukkan email baru..."
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-blue-600 rounded-xl outline-none text-xs font-medium transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        Tambah Admin
                      </button>
                    </form>

                    {adminStatus.message && (
                      <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                        adminStatus.success ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-red-50 text-red-800 border-red-100"
                      }`}>
                        {adminStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
                        <span>{adminStatus.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Registered Admins List */}
                  <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-150">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Daftar Admin Aktif ({admins.length})</h5>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {admins.map((email) => (
                        <div key={email} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-slate-100 p-1.5 rounded-lg text-slate-600">
                              <Shield size={12} />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-slate-800">{email}</span>
                              {email === "websdn3purwosari@gmail.com" && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Owner</span>
                              )}
                              {currentUserEmail?.toLowerCase() === email.toLowerCase() && (
                                <span className="ml-2 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Anda</span>
                              )}
                            </div>
                          </div>
                          
                          {email !== "websdn3purwosari@gmail.com" && currentUserEmail?.toLowerCase() !== email.toLowerCase() && (
                            <button
                              onClick={() => handleDeleteAdmin(email)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer"
                              title="Hapus Hak Akses"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 1.5 MANAGE WELCOME / SCHOOL PROFILE TAB */}
              {activeTab === "welcome" && (
                <form onSubmit={handleWelcomeSubmit} className="w-full max-w-5xl mx-auto space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4.5 rounded-2xl border border-slate-200 gap-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">Kelola Sambutan, Visi, Misi & Tujuan</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Ubah isi profil sekolah yang tampil di halaman utama website.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWelcomeForm(buildWelcomeForm());
                          setIsEditingWelcome(false);
                          setWelcomeEditStatus(null);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        onClick={() => setIsEditingWelcome(true)}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Check size={14} />
                        Simpan Profil
                      </button>
                    </div>
                  </div>

                  {welcomeEditStatus && (
                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      welcomeEditStatus.success ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-red-50 text-red-800 border border-red-100"
                    }`}>
                      {welcomeEditStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
                      <span>{welcomeEditStatus.message}</span>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Label Kecil Section</label>
                        <input
                          type="text"
                          value={welcomeForm.eyebrow}
                          onChange={(e) => {
                            setIsEditingWelcome(true);
                            setWelcomeForm({ ...welcomeForm, eyebrow: e.target.value });
                          }}
                          className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Judul Section</label>
                        <input
                          type="text"
                          value={welcomeForm.title}
                          onChange={(e) => {
                            setIsEditingWelcome(true);
                            setWelcomeForm({ ...welcomeForm, title: e.target.value });
                          }}
                          className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Deskripsi Section</label>
                      <textarea
                        rows={2}
                        value={welcomeForm.description}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, description: e.target.value });
                        }}
                        className="w-full border border-slate-200 outline-none px-3.5 py-2 rounded-xl text-xs font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Quote size={16} className="text-blue-600" />
                        <h5 className="font-heading font-extrabold text-sm">Sambutan Kepala Sekolah</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Label tab"
                          value={welcomeForm.sambutan.label}
                          onChange={(e) => {
                            setIsEditingWelcome(true);
                            setWelcomeForm({ ...welcomeForm, sambutan: { ...welcomeForm.sambutan, label: e.target.value } });
                          }}
                          className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Badge"
                          value={welcomeForm.sambutan.badge}
                          onChange={(e) => {
                            setIsEditingWelcome(true);
                            setWelcomeForm({ ...welcomeForm, sambutan: { ...welcomeForm.sambutan, badge: e.target.value } });
                          }}
                          className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Judul sambutan"
                        value={welcomeForm.sambutan.title}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, sambutan: { ...welcomeForm.sambutan, title: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <textarea
                        rows={2}
                        placeholder="Kutipan utama"
                        value={welcomeForm.sambutan.quote}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, sambutan: { ...welcomeForm.sambutan, quote: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium leading-relaxed"
                      />
                      {welcomeForm.sambutan.paragraphs.map((paragraph, index) => (
                        <textarea
                          key={index}
                          rows={index === 0 ? 2 : 3}
                          placeholder={`Paragraf sambutan ${index + 1}`}
                          value={paragraph}
                          onChange={(e) => {
                            setIsEditingWelcome(true);
                            updateWelcomeParagraph(index, e.target.value);
                          }}
                          className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium leading-relaxed"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, sambutan: { ...welcomeForm.sambutan, paragraphs: [...welcomeForm.sambutan.paragraphs, ""] } });
                        }}
                        className="text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-2 text-xs font-bold"
                      >
                        Tambah Paragraf
                      </button>
                      <input
                        type="text"
                        placeholder="Kalimat penutup"
                        value={welcomeForm.sambutan.closing}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, sambutan: { ...welcomeForm.sambutan, closing: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                    </section>

                    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Eye size={16} className="text-blue-600" />
                        <h5 className="font-heading font-extrabold text-sm">Visi Sekolah</h5>
                      </div>
                      <input
                        type="text"
                        placeholder="Label tab"
                        value={welcomeForm.visi.label}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, visi: { ...welcomeForm.visi, label: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Badge visi"
                        value={welcomeForm.visi.badge}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, visi: { ...welcomeForm.visi, badge: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <textarea
                        rows={3}
                        placeholder="Isi visi sekolah"
                        value={welcomeForm.visi.title}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, visi: { ...welcomeForm.visi, title: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium leading-relaxed"
                      />
                      <textarea
                        rows={2}
                        placeholder="Pengantar visi"
                        value={welcomeForm.visi.intro}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, visi: { ...welcomeForm.visi, intro: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium leading-relaxed"
                      />
                      <textarea
                        rows={3}
                        placeholder="Deskripsi visi"
                        value={welcomeForm.visi.description}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, visi: { ...welcomeForm.visi, description: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium leading-relaxed"
                      />
                      {welcomeForm.visi.highlights.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Judul poin visi"
                            value={item.title}
                            onChange={(e) => {
                              setIsEditingWelcome(true);
                              updateVisiHighlight(index, "title", e.target.value);
                            }}
                            className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                          />
                          <input
                            type="text"
                            placeholder="Deskripsi poin visi"
                            value={item.desc}
                            onChange={(e) => {
                              setIsEditingWelcome(true);
                              updateVisiHighlight(index, "desc", e.target.value);
                            }}
                            className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, visi: { ...welcomeForm.visi, highlights: [...welcomeForm.visi.highlights, { title: "", desc: "" }] } });
                        }}
                        className="text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-2 text-xs font-bold"
                      >
                        Tambah Poin Visi
                      </button>
                    </section>

                    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Target size={16} className="text-blue-600" />
                        <h5 className="font-heading font-extrabold text-sm">Misi Sekolah</h5>
                      </div>
                      <input
                        type="text"
                        placeholder="Label tab"
                        value={welcomeForm.misi.label}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, misi: { ...welcomeForm.misi, label: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Badge misi"
                        value={welcomeForm.misi.badge}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, misi: { ...welcomeForm.misi, badge: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Judul misi"
                        value={welcomeForm.misi.title}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, misi: { ...welcomeForm.misi, title: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      {welcomeForm.misi.items.map((item, index) => (
                        <textarea
                          key={index}
                          rows={2}
                          placeholder={`Misi ${index + 1}`}
                          value={item}
                          onChange={(e) => {
                            setIsEditingWelcome(true);
                            updateMisiItem(index, e.target.value);
                          }}
                          className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium leading-relaxed"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, misi: { ...welcomeForm.misi, items: [...welcomeForm.misi.items, ""] } });
                        }}
                        className="text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-2 text-xs font-bold"
                      >
                        Tambah Misi
                      </button>
                      <input
                        type="text"
                        placeholder="Judul panel misi"
                        value={welcomeForm.misi.panelTitle}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, misi: { ...welcomeForm.misi, panelTitle: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <textarea
                        rows={3}
                        placeholder="Deskripsi panel misi"
                        value={welcomeForm.misi.panelDescription}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, misi: { ...welcomeForm.misi, panelDescription: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium leading-relaxed"
                      />
                    </section>

                    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Flag size={16} className="text-blue-600" />
                        <h5 className="font-heading font-extrabold text-sm">Tujuan Sekolah</h5>
                      </div>
                      <input
                        type="text"
                        placeholder="Label tab"
                        value={welcomeForm.tujuan.label}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, tujuan: { ...welcomeForm.tujuan, label: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Badge tujuan"
                        value={welcomeForm.tujuan.badge}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, tujuan: { ...welcomeForm.tujuan, badge: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Judul tujuan"
                        value={welcomeForm.tujuan.title}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, tujuan: { ...welcomeForm.tujuan, title: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Judul panel samping"
                        value={welcomeForm.tujuan.sideTitle}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, tujuan: { ...welcomeForm.tujuan, sideTitle: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                      />
                      <textarea
                        rows={3}
                        placeholder="Deskripsi panel samping"
                        value={welcomeForm.tujuan.sideDescription}
                        onChange={(e) => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, tujuan: { ...welcomeForm.tujuan, sideDescription: e.target.value } });
                        }}
                        className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium leading-relaxed"
                      />
                      {welcomeForm.tujuan.goals.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Judul tujuan"
                            value={item.title}
                            onChange={(e) => {
                              setIsEditingWelcome(true);
                              updateTujuanGoal(index, "title", e.target.value);
                            }}
                            className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                          />
                          <input
                            type="text"
                            placeholder="Deskripsi tujuan"
                            value={item.desc}
                            onChange={(e) => {
                              setIsEditingWelcome(true);
                              updateTujuanGoal(index, "desc", e.target.value);
                            }}
                            className="w-full border border-slate-200 outline-none px-3 py-2 rounded-xl text-xs font-medium"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingWelcome(true);
                          setWelcomeForm({ ...welcomeForm, tujuan: { ...welcomeForm.tujuan, goals: [...welcomeForm.tujuan.goals, { title: "", desc: "" }] } });
                        }}
                        className="text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-2 text-xs font-bold"
                      >
                        Tambah Tujuan
                      </button>
                    </section>
                  </div>
                </form>
              )}

              {/* 2. MANAGE PROGRAMS TAB */}
              {activeTab === "programs" && (
                <div className="w-full space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4.5 rounded-2xl border border-slate-200 gap-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">Manajemen Program Kependidikan</h4>
                      <p className="text-[11px] text-slate-405 mt-0.5">Kelola data program kurikulum unggulan, intrakurikuler, kokurikuler (P5), serta klub ekstrakurikuler.</p>
                    </div>
                    {!isAdding && (
                      <button
                        onClick={() => { setIsAdding(true); setEditingId(null); }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        Tambah Program
                      </button>
                    )}
                  </div>

                  {isAdding ? (
                    /* ADD/EDIT FORM FOR PROGRAMS */
                    <form onSubmit={handleProgramSubmit} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                          {editingId ? "Ubah Program" : "Tambah Program Kategori Baru"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="p-1 px-3 hover:bg-slate-100 text-slate-400 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Judul Program</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Tahfidz Al-Qur'an Juz 30"
                            value={programForm.title}
                            onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                            className="w-full border border-slate-200 focus:ring-1 focus:ring-blue-605 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Kategori Kurikulum</label>
                          <select
                            value={programForm.category}
                            onChange={(e) => setProgramForm({ ...programForm, category: e.target.value as any })}
                            className="w-full border border-slate-200 outline-none px-3 py-2.5 rounded-xl text-xs font-medium"
                          >
                            <option value="unggulan">Materi Unggulan</option>
                            <option value="ekskul">Ekstrakurikuler (Bakat)</option>
                            <option value="intrakurikuler">Intrakurikuler (Utama)</option>
                            <option value="kokurikuler">Kokurikuler (P5 / Khusus)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Ringkasan Deskripsi Program</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Gambarkan secara singkat keunikan, nilai lebih, agenda penunjang kependidikan program ini bagi masa depan peserta didik..."
                          value={programForm.description}
                          onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                          className="w-full border border-slate-200 focus:ring-1 focus:ring-blue-605 outline-none px-3.5 py-2 rounded-xl text-xs font-medium leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pilihan Icon Visual (Lucide-react)</label>
                          <select
                            value={programForm.icon}
                            onChange={(e) => setProgramForm({ ...programForm, icon: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3 py-2.5 rounded-xl text-xs font-medium"
                          >
                            <option value="BookOpen">Buku Pelajaran (BookOpen)</option>
                            <option value="Cpu">Teknologi / Sains (Cpu)</option>
                            <option value="Heart">Ramah Anak / Peduli (Heart)</option>
                            <option value="Leaf">Adiwiyata / Lingkungan (Leaf)</option>
                            <option value="Compass">Kepanduan / Pramuka (Compass)</option>
                            <option value="Music">Seni Musik (Music)</option>
                            <option value="ShieldAlert">Silat Bela Diri (ShieldAlert)</option>
                            <option value="Palette">Lukis & Warna (Palette)</option>
                            <option value="HeartPulse">Medis / Kesehatan (HeartPulse)</option>
                            <option value="Activity">Fisikal / Olahraga (Activity)</option>
                            <option value="GraduationCap">Gelar Akademik (GraduationCap)</option>
                            <option value="Store">Kewirausahaan / Market (Store)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pilihan Kombinasi Warna (Gradient Tailwind)</label>
                          <select
                            value={programForm.color}
                            onChange={(e) => setProgramForm({ ...programForm, color: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3 py-2.5 rounded-xl text-xs font-medium"
                          >
                            <option value="from-blue-500 to-blue-700">Lazuardi Biru Premium</option>
                            <option value="from-amber-500 to-amber-600">Sari Emas Kehangatan</option>
                            <option value="from-emerald-500 to-emerald-600">Lestari Hijau Botani</option>
                            <option value="from-purple-500 to-indigo-600">Seni Indigo Karismatis</option>
                            <option value="from-red-500 to-rose-600">Gelora Merah Berani</option>
                            <option value="from-teal-500 to-green-600">Toska Segar Harmoni</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 gap-2">
                        <button
                          type="button"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Batalkan
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          {editingId ? "Simpan Perubahan" : "Terbitkan Program"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* PROGRAMS LIST SHOWCASE */
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      {programs.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">Belum ada data program kurikulum tersedia.</div>
                      ) : (
                        programs.map((p) => (
                          <div key={p.id} className="p-4 flex justify-between items-start gap-4 hover:bg-slate-50/50">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                                  p.category === "unggulan"
                                    ? "bg-amber-100 text-amber-800"
                                    : p.category === "ekskul"
                                    ? "bg-purple-100 text-purple-800"
                                    : p.category === "intrakurikuler"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}>
                                  {p.category}
                                </span>
                                <h5 className="font-bold text-slate-800 text-xs md:text-sm">{p.title}</h5>
                              </div>
                              <p className="text-slate-405 text-xs font-normal mt-1 max-w-2xl leading-relaxed">{p.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleProgramEditInit(p)}
                                className="p-1 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Edit2 size={11} />
                                Ubah
                              </button>
                              <button
                                onClick={() => handleProgramDelete(p.id, p.title)}
                                className="p-1 px-2.5 bg-red-50 text-red-650 hover:bg-red-100 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 size={11} />
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3. MANAGE ACHIEVEMENTS TAB */}
              {activeTab === "achievements" && (
                <div className="w-full space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4.5 rounded-2xl border border-slate-200 gap-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">Kelola Prestasi Kebanggaan Siswa</h4>
                      <p className="text-[11px] text-slate-450 mt-0.5">Edit daftar piagam kejuaraan, medali, serta trofi prestasi tingkat lokal, provinsi, hingga nasional.</p>
                    </div>
                    {!isAdding && (
                      <button
                        onClick={() => { setIsAdding(true); setEditingId(null); }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        Tambah Prestasi
                      </button>
                    )}
                  </div>

                  {isAdding ? (
                    /* ADD/EDIT FORM FOR ACHIEVEMENTS */
                    <form onSubmit={handleAchievementSubmit} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                          {editingId ? "Ubah Piala Prestasi" : "Daftarkan Penghargaan Baru"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="p-1 px-3 hover:bg-slate-100 text-slate-400 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Judul Kejuaraan</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Juara I Lomba Cerdas Cermat (LCC) Umum"
                            value={achievementForm.title}
                            onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Predikat Juara / Peringkat</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Juara 1 / Harapan I / Predikat Utama"
                            value={achievementForm.rank}
                            onChange={(e) => setAchievementForm({ ...achievementForm, rank: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tingkat Kejuaraan</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Kabupaten Wonogiri / Provinsi Jateng"
                            value={achievementForm.level}
                            onChange={(e) => setAchievementForm({ ...achievementForm, level: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tahun Perolehan</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 2026"
                            value={achievementForm.year}
                            onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Kategori Bidang</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Akademik / Seni & Budaya / Olahraga"
                            value={achievementForm.category}
                            onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tautan Foto Dokumentasi Prestasi (URL Image)</label>
                        <input
                          type="text"
                          placeholder="Contoh: https://images.unsplash.com/photo-..."
                          value={achievementForm.image}
                          onChange={(e) => setAchievementForm({ ...achievementForm, image: e.target.value })}
                          className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">Saran: Gunakan foto berorientasi lanskap (horizontal) berukuran optimal 800x600 piksel. Kosongkan untuk menggunakan gambar default.</span>
                      </div>

                      <div className="flex justify-end pt-3 gap-2">
                        <button
                          type="button"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          {editingId ? "Simpan Perbaikan" : "Simpan Prestasi"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ACHIEVEMENTS GRID FOR DASHBOARD */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs col-span-2">Belum ada prestasi kebanggaan diunggah.</div>
                      ) : (
                        achievements.map((a) => (
                          <div key={a.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-3 h-full justify-between items-start hover:shadow-md transition-all">
                            <img
                              src={a.image}
                              alt={a.title}
                              className="w-16 h-12 object-cover rounded-lg border border-slate-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <span className="bg-amber-100 text-amber-850 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                                {a.category} • {a.year}
                              </span>
                              <h5 className="font-bold text-slate-800 text-xs mt-1 truncate leading-tight">{a.title}</h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">{a.rank} ({a.level})</p>
                            </div>

                            <div className="flex flex-col gap-1.5 justify-end shrink-0">
                              <button
                                onClick={() => handleAchievementEditInit(a)}
                                className="p-1 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Ubah
                              </button>
                              <button
                                onClick={() => handleAchievementDelete(a.id, a.title)}
                                className="p-1 px-2.5 bg-red-50 text-red-650 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 4. MANAGE AGENDAS TAB */}
              {activeTab === "agendas" && (
                <div className="w-full space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4.5 rounded-2xl border border-slate-200 gap-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">Jadwal Kalender Keaktifan Agenda</h4>
                      <p className="text-[11px] text-slate-450 mt-0.5">Kelola agenda akademik, penerimaan rapor, PPDB, serta rapat komite mendatang.</p>
                    </div>
                    {!isAdding && (
                      <button
                        onClick={() => { setIsAdding(true); setEditingId(null); }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        Tambah Agenda
                      </button>
                    )}
                  </div>

                  {isAdding ? (
                    /* ADD/EDIT FORM FOR AGENDAS */
                    <form onSubmit={handleAgendaSubmit} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                          {editingId ? "Ubah Informasi Agenda" : "Petakan Agenda Kegiatan Baru"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="p-1 px-3 hover:bg-slate-100 text-slate-400 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Judul Agenda</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Rapat Pleno Komite & Program Kerja Baru"
                          value={agendaForm.title}
                          onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })}
                          className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tanggal Lengkap (Format Bebas)</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 20 Jun 2026"
                            value={agendaForm.date}
                            onChange={(e) => setAgendaForm({ ...agendaForm, date: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Hanya Angka Hari</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 20"
                            value={agendaForm.day}
                            onChange={(e) => setAgendaForm({ ...agendaForm, day: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Singkatan Nama Bulan</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Jun / Jul / Agu"
                            value={agendaForm.month}
                            onChange={(e) => setAgendaForm({ ...agendaForm, month: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Jam Kegiatan</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 08:00 - selesai"
                            value={agendaForm.time}
                            onChange={(e) => setAgendaForm({ ...agendaForm, time: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Lokasi Sesi</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Aula SDN 3 / Ruang Kelas V"
                            value={agendaForm.location}
                            onChange={(e) => setAgendaForm({ ...agendaForm, location: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Kategori Agenda</label>
                          <select
                            value={agendaForm.category}
                            onChange={(e) => setAgendaForm({ ...agendaForm, category: e.target.value as any })}
                            className="w-full border border-slate-200 outline-none px-3 py-2.5 rounded-xl text-xs font-medium"
                          >
                            <option value="akademik">Kalender Akademik</option>
                            <option value="spmb">PPDB / SPMB</option>
                            <option value="umum">Kegiatan Umum / Paguyuban</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 gap-2">
                        <button
                          type="button"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          {editingId ? "Ganti Jadwal" : "Terbitkan Agenda"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* AGENDAS GRID SHOWCASE */
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      {agendas.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">Belum ada agenda terencana diunggah.</div>
                      ) : (
                        agendas.map((ag) => (
                          <div key={ag.id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <div className="bg-slate-100 text-slate-800 rounded-xl p-2.5 shrink-0 text-center min-w-[50px]">
                                <span className="block font-extrabold text-xs leading-none">{ag.day}</span>
                                <span className="block text-[10px] text-slate-500 uppercase font-bold mt-0.5">{ag.month}</span>
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-800 text-xs md:text-sm">{ag.title}</h5>
                                <p className="text-[10px] text-slate-450 mt-0.5">{ag.time} | Tempat: {ag.location} ({ag.category})</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleAgendaEditInit(ag)}
                                className="p-1 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Ubah
                              </button>
                              <button
                                onClick={() => handleAgendaDelete(ag.id, ag.title)}
                                className="p-1 px-2.5 bg-red-50 text-red-650 hover:bg-red-100 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 5. MANAGE NEWS TAB */}
              {activeTab === "news" && (
                <div className="w-full space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4.5 rounded-2xl border border-slate-200 gap-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">Kanal Wartawan Berita & Warta</h4>
                      <p className="text-[11px] text-slate-450 mt-0.5">Kelola dan sunting kumpulan postingan berita untuk pameran bulletin sekolah yang dinamis.</p>
                    </div>
                    {!isAdding && (
                      <button
                        onClick={() => { setIsAdding(true); setEditingId(null); }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        Tulis Konten Berita
                      </button>
                    )}
                  </div>

                  {isAdding ? (
                    /* ADD/EDIT FORM FOR NEWS ARTICLES */
                    <form onSubmit={handleNewsSubmit} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 space-y-4 font-sans">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                          {editingId ? "Sunting Berita Sekolah" : "Ketik Catatan Berita Baru"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="p-1 px-3 hover:bg-slate-100 text-slate-400 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Judul Utama Berita</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Akreditasi 'A' Unggul SDN 3 Purwosari resmi diterbitkan..."
                            value={newsForm.title}
                            onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Kutipan Pendek (Excerpt)</label>
                          <input
                            type="text"
                            required
                            placeholder="Ringkasan 1-kalimat untuk pameran kartu depan..."
                            value={newsForm.excerpt}
                            onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Kategori Berita</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Akademik / Kegiatan / PPDB"
                            value={newsForm.category}
                            onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tanggal Terbit</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 15 Jun 2026"
                            value={newsForm.date}
                            onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Penulis / Wartawan</label>
                          <input
                            type="text"
                            placeholder="Default: Tim Humas Sekolah"
                            value={newsForm.author}
                            onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                            className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Poster Utama Gambar (Image URL)</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={newsForm.image}
                          onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                          className="w-full border border-slate-200 outline-none px-3.5 py-2.5 rounded-xl text-xs font-medium"
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">Tinggalkan kosong untuk memakai visual jurnalis default.</span>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Isi Artikel Lengkap</label>
                        <textarea
                          required
                          rows={6}
                          placeholder="Ketikkan laporan berita kronologis narasi lengkap Anda di sini secara rinci dan menarik..."
                          value={newsForm.content}
                          onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                          className="w-full border border-slate-200 focus:ring-1 focus:ring-blue-605 outline-none px-3.5 py-2 rounded-xl text-xs font-normal leading-relaxed font-sans"
                        />
                      </div>

                      <div className="flex justify-end pt-3 gap-2">
                        <button
                          type="button"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          {editingId ? "Terapkan Perubahan" : "Terbitkan Warta"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* NEWS ARTICLES GRID SHOWCASE */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {news.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs col-span-2">Belum ada bulletin berita diumumkan.</div>
                      ) : (
                        news.map((item) => (
                          <div key={item.id} className="bg-white p-4.5 rounded-2xl border border-slate-200 flex gap-4 h-full hover:shadow-md transition-all justify-between items-start">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-20 h-16 object-cover rounded-xl border border-slate-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <span className="bg-blue-50 text-blue-700 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                                {item.category}
                              </span>
                              <h5 className="font-bold text-slate-800 text-xs mt-1.5 truncate leading-tight">{item.title}</h5>
                              <p className="text-[10px] text-slate-400 mt-1">Oleh: {item.author || "Admin"} • {item.date}</p>
                            </div>

                            <div className="flex flex-col gap-1.5 justify-end shrink-0">
                              <button
                                onClick={() => handleNewsEditInit(item)}
                                className="p-1 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Ubah
                              </button>
                              <button
                                onClick={() => handleNewsDelete(item.id, item.title)}
                                className="p-1 px-2.5 bg-red-50 text-red-650 hover:bg-red-100 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 5.5 MANAGE PPDB REGISTRATIONS TAB */}
              {activeTab === "registrations" && (
                <div className="w-full space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4.5 rounded-2xl border border-slate-200 gap-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">Daftar Pendaftar PPDB Online</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Pantau data prapendaftaran calon peserta didik baru yang masuk secara real-time.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsRegsLoading(true);
                        if (isSupabaseConfigured) {
                          listRegistrations()
                            .then((result) => {
                              if (result.error) throw result.error;
                              setRegistrations(result.data);
                            })
                            .catch(err => console.error(err))
                            .finally(() => setIsRegsLoading(false));
                        } else {
                          try {
                            const raw = localStorage.getItem("sdn3_registrations");
                            const list = raw ? JSON.parse(raw) : [];
                            list.sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
                            setRegistrations(list);
                          } catch(e) {}
                          setIsRegsLoading(false);
                        }
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Refresh Data
                    </button>
                  </div>

                  {isRegsLoading ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-xs font-semibold text-slate-400 border border-slate-150">
                      Memuat data pendaftar...
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-400 border border-slate-150">
                      Belum ada calon siswa yang mendaftar online.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                              <th className="px-5 py-3">No. Pendaftaran</th>
                              <th className="px-5 py-3">Nama Siswa</th>
                              <th className="px-5 py-3">NIK</th>
                              <th className="px-5 py-3">Orang Tua</th>
                              <th className="px-5 py-3">No. Telp</th>
                              <th className="px-5 py-3">Jalur</th>
                              <th className="px-5 py-3">Tanggal Daftar</th>
                              <th className="px-5 py-3 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {registrations.map((reg) => (
                              <tr key={reg.id || reg.regNo} className="hover:bg-slate-50/50">
                                <td className="px-5 py-3.5 font-bold text-blue-900 font-mono">{reg.regNo}</td>
                                <td className="px-5 py-3.5 font-bold text-slate-800">
                                  <div className="flex flex-col">
                                    <span>{reg.studentName}</span>
                                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase w-max mt-1 ${
                                      reg.gender === "Laki-laki" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"
                                    }`}>{reg.gender}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5 font-mono text-slate-500">{reg.nik}</td>
                                <td className="px-5 py-3.5 font-semibold">{reg.parentName}</td>
                                <td className="px-5 py-3.5">{reg.parentPhone}</td>
                                <td className="px-5 py-3.5">
                                  <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                    {reg.pathway}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-slate-400">{reg.submittedAt}</td>
                                <td className="px-5 py-3.5 text-center">
                                  <div className="flex gap-1.5 justify-center">
                                    <button
                                      onClick={() => alert(`Detail Pendaftar:\n\nNama: ${reg.studentName} (${reg.gender})\nNIK: ${reg.nik}\nTempat/Tgl Lahir: ${reg.birthPlace}, ${reg.birthDate}\nWali/Ortu: ${reg.parentName}\nTelepon: ${reg.parentPhone}\nJalur: ${reg.pathway}\nAlamat: ${reg.address}`)}
                                      className="p-1 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold cursor-pointer"
                                    >
                                      Detail
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRegistration(reg.regNo)}
                                      className="p-1 px-2.5 bg-red-50 text-red-650 hover:bg-red-100 rounded-lg text-[10px] font-bold cursor-pointer"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. DEVELOPER MODES (HTML & JSON DIRECT CODES) */}
              {activeTab === "dev" && (
                <div className="w-full space-y-6">
                  {/* Tab Title */}
                  <div className="bg-slate-950 text-white p-5 md:p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-heading font-extrabold text-white text-base md:text-lg flex items-center gap-2">
                          <Code size={18} className="text-blue-500 animate-pulse" />
                          Editor Kode Website
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Tampilkan dan sunting konten website dalam format JSON lengkap atau HTML utuh dari satu ruang kerja fullscreen.
                        </p>
                      </div>
                      
                      {/* Sub tab toggling buttons */}
                      <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 self-start md:self-auto">
                        <button
                          onClick={() => { setDevSubTab("json"); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            devSubTab === "json"
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Database JSON
                        </button>
                        <button
                          onClick={() => { setDevSubTab("html"); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            devSubTab === "html"
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          HTML Utuh
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SUBTAB 1: JSON CODES DIRECT TRANSLATION */}
                  {devSubTab === "json" && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h5 className="font-heading font-extrabold text-slate-800 text-base md:text-lg">
                            Edit JSON Lengkap
                          </h5>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Pilih "Seluruh Website" untuk melihat semua konten, atau pilih koleksi tertentu untuk edit lebih fokus.
                          </p>
                        </div>

                        {/* Dropdown list database select */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Tabel:</span>
                          <select
                            value={selectedJsonCollection}
                            onChange={(e: any) => setSelectedJsonCollection(e.target.value)}
                            className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer w-full sm:w-64"
                          >
                            <option value="all">Seluruh Website</option>
                            <option value="siteContent">Teks Tampilan Utama</option>
                            <option value="customHTML">HTML Kustom</option>
                            <option value="programs">Program & Ekskul</option>
                            <option value="achievements">Prestasi Sekolah</option>
                            <option value="agendas">Agenda Kegiatan</option>
                            <option value="news">Kabar & Berita</option>
                            <option value="admins">Hak Akses Admin</option>
                            <option value="stats">Statistik Sekolah</option>
                            <option value="teachers">Guru & Staff</option>
                            <option value="facilities">Sarana Prasarana</option>
                            <option value="gallery">Galeri Foto</option>
                            <option value="faqs">Tanya-Jawab FAQ</option>
                            <option value="downloads">Download Berkas</option>
                            <option value="testimonials">Testimoni</option>
                            <option value="innovations">Inovasi</option>
                          </select>
                        </div>
                      </div>

                      {/* Error & Success Alerts */}
                      {jsonError && (
                        <div className="p-3 bg-red-50 text-red-850 border-l-4 border-red-500 rounded-xl text-xs font-semibold flex items-start gap-2.5">
                          <AlertCircle size={16} className="shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Gagal Menyimpan Data</p>
                            <p className="text-[11px] font-normal mt-0.5 leading-relaxed">{jsonError}</p>
                          </div>
                        </div>
                      )}

                      {jsonSuccess && (
                        <div className="p-3 bg-emerald-50 text-emerald-850 border-l-4 border-emerald-500 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                          <Check size={16} className="shrink-0" />
                          <p>Database berhasil diperbarui dan disinkronkan ke seluruh website!</p>
                        </div>
                      )}

                      {/* Text editor box container */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between px-2 text-[10px] uppercase font-bold tracking-wider text-slate-450">
                          <span>Raw JSON data</span>
                          <span className="font-mono text-blue-600">{selectedJsonCollection.toUpperCase()} ARRAY</span>
                        </div>
                        <textarea
                          value={textareaJsonValue}
                          onChange={(e) => setTextareaJsonValue(e.target.value)}
                          placeholder="Loading JSON data..."
                          className="w-full h-[62vh] min-h-[520px] p-4 font-mono text-xs text-blue-100 bg-slate-950 border border-slate-900 focus:ring-2 focus:ring-blue-600/25 rounded-2xl outline-none resize-y leading-relaxed"
                          spellCheck={false}
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-between items-center pt-2 gap-4">
                        <p className="text-[10px] text-slate-400 leading-relaxed max-w-md font-medium">
                          <strong className="text-red-500 font-bold">Pemberitahuan:</strong> Koleksi biasa memakai Array JSON. Seluruh Website dan Teks Tampilan Utama memakai Object JSON.
                        </p>
                        <button
                          onClick={handleSaveJson}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2 shrink-0 select-none"
                        >
                          <Check size={14} />
                          Simpan Database
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: EMBEDDABLE RESPONSIVE HTML PAGE WIDGET */}
                  {devSubTab === "html" && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <h5 className="font-heading font-extrabold text-slate-800 text-base md:text-lg">
                            Editor HTML
                          </h5>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Mode HTML utuh menampilkan snapshot struktur halaman. Mode HTML kustom digunakan untuk blok tambahan yang tampil di beranda.
                          </p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setHtmlMode("full")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              htmlMode === "full" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            HTML Utuh
                          </button>
                          <button
                            type="button"
                            onClick={() => setHtmlMode("custom")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              htmlMode === "custom" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            HTML Kustom
                          </button>
                        </div>
                      </div>

                      {/* Help examples container */}
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-[11px] text-blue-900 leading-relaxed">
                        {htmlMode === "full"
                          ? "HTML utuh ini adalah tampilan gabungan dari data website saat ini. Untuk mengubah konten halaman utama secara aman, gunakan JSON Seluruh Website atau Teks Tampilan Utama."
                          : "HTML kustom akan ditampilkan sebagai blok tambahan di beranda, cocok untuk pengumuman, embed video, peta, atau banner khusus."}
                      </div>

                      {htmlSuccess && (
                        <div className="p-3 bg-emerald-50 text-emerald-855 border-l-4 border-emerald-500 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                          <Check size={16} className="shrink-0" />
                          <p>Widget HTML berhasil terpasang dan ditayangkan langsung di halaman utama!</p>
                        </div>
                      )}

                      {/* Text editor box container */}
                      <div className="flex flex-col gap-1.5">
                        <span className="px-2 text-[10px] uppercase font-bold tracking-wider text-slate-450 font-heading">Rencana HTML</span>
                        <textarea
                          value={htmlValue}
                          onChange={(e) => setHtmlValue(e.target.value)}
                          placeholder="Masukkan markup HTML di sini..."
                          className="w-full h-[62vh] min-h-[520px] p-4 font-mono text-xs text-emerald-100 bg-slate-950 border border-slate-900 focus:ring-2 focus:ring-blue-600/25 rounded-2xl outline-none resize-y leading-relaxed"
                          spellCheck={false}
                        />
                      </div>

                      {/* Live preview slot inside admin dashboard to stay safe */}
                      <div className="border border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-2">Pratinjau Widget HTML Hasil Akhir:</span>
                        {htmlValue.trim() !== "" ? (
                          <div className="bg-white p-4 rounded-xl border border-slate-200 min-h-12 shadow-inner">
                            <div dangerouslySetInnerHTML={{ __html: htmlValue }} />
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic font-light">Tidak ada custom widget HTML saat ini</p>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-between items-center pt-2 gap-4">
                        <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                          Abaikan area ini jika tidak ingin menampilkan bulletin/billboard kustom tambahan di beranda.
                        </p>
                        <button
                          onClick={handleSaveHtml}
                          className="px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2 shrink-0 select-none"
                        >
                          <Check size={14} />
                          Terapkan Widget HTML
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
