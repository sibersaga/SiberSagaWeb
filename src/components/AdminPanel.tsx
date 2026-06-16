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
  Code
} from "lucide-react";
import { Program, Achievement, AgendaEvent, NewsItem } from "../types";

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
  } = useAdmin();

  // Login Form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState<"admins" | "programs" | "achievements" | "agendas" | "news" | "dev">("admins");

  // Developer Modes (HTML / JSON Editor State)
  const [devSubTab, setDevSubTab] = useState<"html" | "json">("json");
  const [selectedJsonCollection, setSelectedJsonCollection] = useState<"programs" | "achievements" | "agendas" | "news" | "admins" | "stats" | "gallery" | "faqs" | "downloads">("programs");
  const [textareaJsonValue, setTextareaJsonValue] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [jsonSuccess, setJsonSuccess] = useState(false);
  const [htmlValue, setHtmlValue] = useState(customHTML);
  const [htmlSuccess, setHtmlSuccess] = useState(false);

  // Sync JSON Textarea with selected collection
  useEffect(() => {
    let rawData: any = [];
    if (selectedJsonCollection === "programs") rawData = programs;
    else if (selectedJsonCollection === "achievements") rawData = achievements;
    else if (selectedJsonCollection === "agendas") rawData = agendas;
    else if (selectedJsonCollection === "news") rawData = news;
    else if (selectedJsonCollection === "admins") rawData = admins;
    else if (selectedJsonCollection === "stats") rawData = stats;
    else if (selectedJsonCollection === "gallery") rawData = gallery;
    else if (selectedJsonCollection === "faqs") rawData = faqs;
    else if (selectedJsonCollection === "downloads") rawData = downloads;
    
    setTextareaJsonValue(JSON.stringify(rawData, null, 2));
    setJsonError("");
    setJsonSuccess(false);
  }, [selectedJsonCollection, programs, achievements, agendas, news, admins, stats, gallery, faqs, downloads]);

  // Sync HTML input state when customHTML changes
  useEffect(() => {
    setHtmlValue(customHTML);
  }, [customHTML]);

  // General Form States
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New admin state
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminStatus, setAdminStatus] = useState({ success: true, message: "" });

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

  const handleSaveJson = () => {
    setJsonError("");
    setJsonSuccess(false);
    try {
      const parsedData = JSON.parse(textareaJsonValue);
      if (!Array.isArray(parsedData)) {
        setJsonError("Format data harus berupa Array JSON.");
        return;
      }

      // Basic validating schema and matching targets
      if (selectedJsonCollection === "programs") {
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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = login(loginEmail);
    if (!res.success) {
      setLoginError(res.error || "Gagal masuk.");
    } else {
      setLoginEmail("");
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
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header Ribbon */}
        <div className="bg-slate-900 px-6 py-4.5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm md:text-base tracking-wide">
                Pusat Kontrol Administratif Portal SDN 3
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
            className="p-2 bg-slate-800 hover:bg-slate-750 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer"
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
                  Masukkan email terdaftar Anda untuk memverifikasi hak akses administratif keamanan penuh.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">
                    Alamat Email Admin
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="contoh: kridaloka.id@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-blue-600 rounded-xl outline-none text-xs md:text-sm font-medium transition-all"
                    />
                  </div>
                </div>

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
                Tip: Gunakan email utama Anda <strong className="text-slate-650 font-bold">kridaloka.id@gmail.com</strong> sebagai akun admin pemula.
              </div>
            </div>
          </div>
        ) : (
          /* ADMIN DASHBOARD WORKSPACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-full md:w-56 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
              <div className="p-4 border-b border-slate-800 hidden md:block">
                <span className="text-[10px] text-slate-450 uppercase tracking-widest font-extrabold block">Menu Dashboard</span>
              </div>
              
              <nav className="p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                <button
                  onClick={() => { setActiveTab("admins"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "admins"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Shield size={14} />
                  Kelola Admin
                </button>

                <button
                  onClick={() => { setActiveTab("programs"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "programs"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Newspaper size={14} />
                  Kelola Berita
                </button>

                <button
                  onClick={() => { setActiveTab("dev"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "dev"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Code size={14} />
                  Editor HTML & JSON
                </button>
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
            <div className="flex-1 bg-slate-50 p-4 md:p-6 overflow-y-auto flex flex-col gap-5">
              
              {/* 1. MANAGE ADMINS TAB */}
              {activeTab === "admins" && (
                <div className="max-w-2xl w-full mx-auto space-y-6">
                  <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-slate-200">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">Kelola Hak Akses Admin</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Tambah atau hapus email yang diperbolehkan masuk ke panel kontrol admin.</p>
                    </div>
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
                              {email === "kridaloka.id@gmail.com" && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Owner</span>
                              )}
                              {currentUserEmail?.toLowerCase() === email.toLowerCase() && (
                                <span className="ml-2 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Anda</span>
                              )}
                            </div>
                          </div>
                          
                          {email !== "kridaloka.id@gmail.com" && currentUserEmail?.toLowerCase() !== email.toLowerCase() && (
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

              {/* 6. DEVELOPER MODES (HTML & JSON DIRECT CODES) */}
              {activeTab === "dev" && (
                <div className="max-w-4xl w-full mx-auto space-y-6">
                  {/* Tab Title */}
                  <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-heading font-extrabold text-white text-sm md:text-base flex items-center gap-2">
                          <Code size={18} className="text-blue-500 animate-pulse" />
                          Mode Lanjutan: Editor Kode Sumber
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Ubah dan kelola data website SDN 3 secara aman langsung melalui format HTML dan database JSON.
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
                          Pengumuman HTML
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SUBTAB 1: JSON CODES DIRECT TRANSLATION */}
                  {devSubTab === "json" && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h5 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">
                            Edit Database JSON
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Pilih tabel koleksi untuk memuat dan menyunting baris data mentah secara massal.
                          </p>
                        </div>

                        {/* Dropdown list database select */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Tabel:</span>
                          <select
                            value={selectedJsonCollection}
                            onChange={(e: any) => setSelectedJsonCollection(e.target.value)}
                            className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer w-full sm:w-48"
                          >
                            <option value="programs">Program & Ekskul</option>
                            <option value="achievements">Prestasi Sekolah</option>
                            <option value="agendas">Agenda Kegiatan</option>
                            <option value="news">Kabar & Berita</option>
                            <option value="admins">Hak Akses Admin</option>
                            <option value="stats">Statistik Sekolah</option>
                            <option value="gallery">Galeri Foto</option>
                            <option value="faqs">Tanya-Jawab FAQ</option>
                            <option value="downloads">Download Berkas</option>
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
                          className="w-full h-96 p-4 font-mono text-xs text-blue-400 bg-slate-900 border border-slate-950 focus:ring-2 focus:ring-blue-600/25 rounded-2xl outline-none resize-y leading-relaxed"
                          spellCheck={false}
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-between items-center pt-2 gap-4">
                        <p className="text-[10px] text-slate-400 leading-relaxed max-w-md font-medium">
                          <strong className="text-red-500 font-bold">Pemberitahuan:</strong> Pastikan isi kolom berupa Array JSON yang valid sesuai atribut awal.
                        </p>
                        <button
                          onClick={handleSaveJson}
                          className="px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2 shrink-0 select-none"
                        >
                          <Check size={14} />
                          Simpan Database
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: EMBEDDABLE RESPONSIVE HTML PAGE WIDGET */}
                  {devSubTab === "html" && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-sm">
                      <div>
                        <h5 className="font-heading font-extrabold text-slate-800 text-sm md:text-base">
                          Widget Custom HTML Pengumuman
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Tulis atau tempel kode HTML kustom untuk memunculkan billboard khusus, peta, video embed, atau dekorasi khusus langsung pada beranda website.
                        </p>
                      </div>

                      {/* Help examples container */}
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-[11px] text-blue-855 space-y-2 leading-relaxed">
                        <p className="font-bold">💡 Ide Custom Widget HTML yang bisa anda pasangkan:</p>
                        <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-650">
                          <li><strong>Spanduk Berjalan:</strong> <code className="bg-white px-1 py-0.5 rounded font-mono text-rose-600">&lt;marquee className="text-xs font-bold text-red-650 bg-red-50 p-2 border border-red-100 rounded-xl block"&gt;Pendaftaran Pindahan PPDB Telah Dibuka!&lt;/marquee&gt;</code></li>
                          <li><strong>Badge/Map Frame / Video Youtube:</strong> Salin script embed kemudian tempelkan disini.</li>
                        </ul>
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
                          className="w-full h-80 p-4 font-mono text-xs text-emerald-400 bg-slate-900 border border-slate-950 focus:ring-2 focus:ring-blue-600/25 rounded-2xl outline-none resize-y leading-relaxed"
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
