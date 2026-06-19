import re

path = r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the opening AdminPanel JSX block
old_start = """  return (
    <>
      {showFullPageHtmlEditor && (
        <FullPageHtmlEditor onClose={() => setShowFullPageHtmlEditor(false)} />
      )}
      <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-100">
"""

new_start = """  const scrollToSection = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById("admin-section-" + id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const sectionNavItems = [
    { id: "topbar", label: "Topbar", icon: Globe },
    { id: "header", label: "Header", icon: Menu },
    { id: "hero", label: "Hero", icon: Star },
    { id: "welcome", label: "Sambutan/Visi/Misi/Tujuan", icon: BookOpen },
    { id: "teachers", label: "Guru & Tenaga", icon: Users },
    { id: "facilities", label: "Sarana & Prasarana", icon: Building2 },
    { id: "conditions", label: "Kondisi Murid & Rombongan", icon: UserCheck },
    { id: "intrakurikuler", label: "Intrakurikuler", icon: BookMarked },
    { id: "kokurikuler", label: "Kokurikuler", icon: Puzzle },
    { id: "program-unggulan", label: "Program Unggulan", icon: Trophy },
    { id: "ekstrakurikuler", label: "Ekstrakurikuler", icon: Sparkles },
    { id: "achievements", label: "Prestasi", icon: Award },
    { id: "innovations", label: "Inovasi Sekolah", icon: Lightbulb },
    { id: "news", label: "Berita & Informasi", icon: Newspaper },
    { id: "agenda", label: "Agenda Kegiatan", icon: Calendar },
    { id: "gallery", label: "Galeri Foto", icon: Image },
    { id: "testimonials", label: "Testimoni Wali Murid", icon: MessageSquare },
    { id: "downloads", label: "Pusat Unduhan", icon: Download },
    { id: "contact", label: "Peta Lokasi & Kontak", icon: MapPin },
  ];

  return (
    <>
      {showFullPageHtmlEditor && (
        <FullPageHtmlEditor onClose={() => setShowFullPageHtmlEditor(false)} />
      )}
      <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col">
        {/* Top Bar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm md:text-base tracking-wide">
                Pusat Kontrol Administratif Portal SDN 3
              </h3>
              {currentUserEmail ? (
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-300">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sesi Aktif: <strong className="text-slate-100">{currentUserEmail}</strong></span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">Verifikasi email diperlukan</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Tutup Panel Admin"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Section Nav */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 shrink-0 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
"""

if old_start in content:
    content = content.replace(old_start, new_start)
    print("Replaced opening JSX successfully")
else:
    print("ERROR: Could not find opening JSX block")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Written to file")
