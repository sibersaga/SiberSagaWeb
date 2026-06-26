/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { useAdmin } from '../../context/AdminContext';
import { X, Save, Code, FileJson, FileCode, AlertCircle, Check } from 'lucide-react';

const SECTION_CONFIG: Record<string, { label: string; icon: string }> = {
  hero: { label: 'Hero / Banner', icon: 'Layout' },
  stats: { label: 'Statistik', icon: 'BarChart3' },
  welcome: { label: 'Sambutan', icon: 'MessageSquare' },
  teachers: { label: 'Guru & Staff', icon: 'Users' },
  conditions: { label: 'Kondisi Siswa', icon: 'School' },
  programs: { label: 'Program', icon: 'BookOpen' },
  achievements: { label: 'Prestasi', icon: 'Trophy' },
  innovations: { label: 'Inovasi', icon: 'Lightbulb' },
  news: { label: 'Berita', icon: 'Newspaper' },
  gallery: { label: 'Galeri', icon: 'Image' },
  testimonials: { label: 'Testimoni', icon: 'Quote' },
  footer: { label: 'Footer', icon: 'PanelBottom' },
  topbar: { label: 'Top Bar', icon: 'PanelTop' },
  ticker: { label: 'Pengumuman', icon: 'Megaphone' },
};

function convertSectionToHtml(section: string, data: any): string {
  if (!data) return "<!-- Tidak ada data tersedia -->";

  const escapeHtml = (val: unknown) =>
    String(val ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  try {
    switch (section) {
      case "topbar":
        return `<!-- Topbar Component -->
<div class="topbar">
  <div class="contact-info">
    <span>Email: ${escapeHtml(data.contactEmail)}</span>
    <span>Lokasi: ${escapeHtml(data.location)}</span>
  </div>
  <div class="social-links">
    <a href="${escapeHtml(data.instagramUrl)}">Instagram</a>
    <a href="${escapeHtml(data.youtubeUrl)}">YouTube</a>
  </div>
</div>`;

      case "hero":
        return `<!-- Hero Section -->
<section id="hero" class="hero">
  <span class="badge">${escapeHtml(data.badge)}</span>
  <span class="school-name">${escapeHtml(data.schoolName)}</span>
  <h2>${escapeHtml(data.titlePrimary)} <span>${escapeHtml(data.titleSecondary)}</span></h2>
  <p>${escapeHtml(data.description)}</p>
  <div class="cta">
    <a href="#spmb" class="btn-primary">${escapeHtml(data.primaryButton)}</a>
    <a href="#sambutan" class="btn-secondary">${escapeHtml(data.secondaryButton)}</a>
  </div>
  <div class="cards-grid">
    ${(data.cards || []).map((c: any, i: number) => `
    <div class="card card-${i + 1}">
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.description)}</p>
    </div>`).join("")}
  </div>
</section>`;

      case "welcome":
        return `<!-- Sambutan, Visi, Misi & Tujuan Section -->
<section id="welcome" class="welcome">
  <span class="eyebrow">${escapeHtml(data.eyebrow)}</span>
  <h2>${escapeHtml(data.title)}</h2>
  <p>${escapeHtml(data.description)}</p>
  
  <div class="tab-content sambutan">
    <h3>${escapeHtml(data.tabs?.sambutan?.label)}</h3>
    <span class="badge">${escapeHtml(data.tabs?.sambutan?.badge)}</span>
    <h4>${escapeHtml(data.tabs?.sambutan?.title)}</h4>
    <blockquote>${escapeHtml(data.tabs?.sambutan?.quote)}</blockquote>
    ${(data.tabs?.sambutan?.paragraphs || []).map((p: string) => `<p>${escapeHtml(p)}</p>`).join("")}
    <p class="closing">${escapeHtml(data.tabs?.sambutan?.closing)}</p>
  </div>

  <div class="tab-content visi">
    <h3>${escapeHtml(data.tabs?.visi?.label)}</h3>
    <h4>${escapeHtml(data.tabs?.visi?.title)}</h4>
    <p>${escapeHtml(data.tabs?.visi?.description)}</p>
    <ul>
      ${(data.tabs?.visi?.highlights || []).map((h: any) => `<li><strong>${escapeHtml(h.title)}</strong>: ${escapeHtml(h.desc)}</li>`).join("")}
    </ul>
  </div>

  <div class="tab-content misi">
    <h3>${escapeHtml(data.tabs?.misi?.label)}</h3>
    <ol>
      ${(data.tabs?.misi?.items || []).map((item: string) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ol>
  </div>

  <div class="tab-content tujuan">
    <h3>${escapeHtml(data.tabs?.tujuan?.label)}</h3>
    <ul>
      ${(data.tabs?.tujuan?.goals || []).map((g: any) => `<li><strong>${escapeHtml(g.title)}</strong>: ${escapeHtml(g.desc)}</li>`).join("")}
    </ul>
  </div>
</section>`;

      case "footer":
        return `<!-- Footer Section -->
<footer>
  <div class="brand">
    <h3>${escapeHtml(data.brandTitle)}</h3>
    <p>${escapeHtml(data.tagline)}</p>
  </div>
  <nav class="links">
    <h4>${escapeHtml(data.quickLinksTitle)}</h4>
    <ul>
      ${(data.links || []).map((l: any) => `<li><a href="#${escapeHtml(l.id)}">${escapeHtml(l.label)}</a></li>`).join("")}
    </ul>
  </nav>
  <div class="contact">
    <h4>${escapeHtml(data.mediaTitle)}</h4>
    <p>${escapeHtml(data.address)}</p>
    <p>${escapeHtml(data.phone)}</p>
    <p>${escapeHtml(data.email)}</p>
  </div>
  <div class="copyright">
    <p>${escapeHtml(data.copyright)}</p>
    <p>${escapeHtml(data.bottomBrand)} | NPSN: ${escapeHtml(data.npsnInfo)}</p>
  </div>
</footer>`;

      case "ticker":
        return `<!-- Announcements Ticker -->
<div class="announcements-ticker">
  <strong>${escapeHtml(data.title)}</strong>
  <marquee>${(data.items || []).map((item: string) => escapeHtml(item)).join(" | ")}</marquee>
</div>`;

      case "stats":
        return `<!-- Statistics Section -->
<section class="stats">
  <h3>Statistik Sekolah</h3>
  <ul>
    ${(Array.isArray(data) ? data : []).map((s: any) => `
    <li>
      <span class="value">${escapeHtml(s.value)}</span>
      <span class="label">${escapeHtml(s.label)}</span>
    </li>`).join("")}
  </ul>
</section>`;

      case "teachers":
        return `<!-- Teachers List -->
<section class="teachers">
  <h2>Guru & Tenaga Kependidikan</h2>
  <div class="teacher-grid">
    ${(Array.isArray(data) ? data : []).map((t: any) => `
    <div class="teacher-card">
      <img src="${escapeHtml(t.image)}" alt="${escapeHtml(t.name)}" />
      <h3>${escapeHtml(t.name)}</h3>
      <p class="role">${escapeHtml(t.role)}</p>
      <span class="status">${escapeHtml(t.status)}</span>
    </div>`).join("")}
  </div>
</section>`;

      case "programs":
        return `<!-- Programs List -->
<section class="programs">
  <h2>Program Unggulan</h2>
  <div class="programs-grid">
    ${(Array.isArray(data) ? data : []).map((p: any) => `
    <div class="program-card">
      <h3>${escapeHtml(p.title)}</h3>
      <span class="category">${escapeHtml(p.category)}</span>
      <p>${escapeHtml(p.description)}</p>
      <p class="details">${escapeHtml(p.details)}</p>
    </div>`).join("")}
  </div>
</section>`;

      case "achievements":
        return `<!-- Achievements List -->
<section class="achievements">
  <h2>Prestasi Kebanggaan</h2>
  <div class="achievements-grid">
    ${(Array.isArray(data) ? data : []).map((a: any) => `
    <div class="achievement-card">
      <h3>${escapeHtml(a.title)}</h3>
      <span class="category">${escapeHtml(a.category)}</span>
      <span class="recipient">${escapeHtml(a.recipient)}</span>
      <p>${escapeHtml(a.description)}</p>
      <span class="date">${escapeHtml(a.date)}</span>
    </div>`).join("")}
  </div>
</section>`;

      case "innovations":
        return `<!-- Innovations List -->
<section class="innovations">
  <h2>Portal Inovasi</h2>
  <div class="innovations-grid">
    ${(Array.isArray(data) ? data : []).map((inno: any) => `
    <div class="innovation-card">
      <h3>${escapeHtml(inno.title)}</h3>
      <p>${escapeHtml(inno.description)}</p>
      <span class="creator">${escapeHtml(inno.creator)}</span>
    </div>`).join("")}
  </div>
</section>`;

      case "news":
        return `<!-- News & Updates -->
<section class="news">
  <h2>Kabar & Berita Terbaru</h2>
  <div class="news-grid">
    ${(Array.isArray(data) ? data : []).map((n: any) => `
    <article class="news-item">
      <h3>${escapeHtml(n.title)}</h3>
      <span class="category">${escapeHtml(n.category)}</span>
      <span class="date">${escapeHtml(n.date)}</span>
      <p class="excerpt">${escapeHtml(n.excerpt)}</p>
      <div class="content">${escapeHtml(n.content)}</div>
    </article>`).join("")}
  </div>
</section>`;

      case "gallery":
        return `<!-- Photo Gallery -->
<div class="gallery">
  <h2>Galeri Foto Kegiatan</h2>
  <div class="gallery-grid">
    ${(Array.isArray(data) ? data : []).map((photo: any) => `
    <figure class="gallery-item">
      <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.title)}" />
      <figcaption>${escapeHtml(photo.title)} - ${escapeHtml(photo.category)}</figcaption>
    </figure>`).join("")}
  </div>
</div>`;

      case "testimonials":
        return `<!-- Testimonials -->
<section class="testimonials">
  <h2>Testimoni Wali Murid</h2>
  <div class="testimonials-grid">
    ${(Array.isArray(data) ? data : []).map((test: any) => `
    <blockquote class="testimonial">
      <p>"${escapeHtml(test.text)}"</p>
      <cite>- ${escapeHtml(test.author)} (${escapeHtml(test.role)})</cite>
    </blockquote>`).join("")}
  </div>
</section>`;

      case "agendas":
        return `<!-- Agenda Events -->
<section class="agenda">
  <h2>Agenda Kegiatan Sekolah</h2>
  <div class="agenda-list">
    ${(Array.isArray(data) ? data : []).map((ev: any) => `
    <div class="event-item">
      <h3>${escapeHtml(ev.title)}</h3>
      <span class="date">${escapeHtml(ev.date)}</span>
      <span class="time">${escapeHtml(ev.time)}</span>
      <p class="description">${escapeHtml(ev.description)}</p>
      <p class="location">Lokasi: ${escapeHtml(ev.location)}</p>
    </div>`).join("")}
  </div>
</section>`;

      case "faqs":
        return `<!-- Frequently Asked Questions -->
<section class="faqs">
  <h2>Tanya-Jawab (FAQ)</h2>
  <div class="faqs-list">
    ${(Array.isArray(data) ? data : []).map((item: any) => `
    <details class="faq-item">
      <summary>${escapeHtml(item.question)}</summary>
      <p>${escapeHtml(item.answer)}</p>
    </details>`).join("")}
  </div>
</section>`;

      case "downloads":
        return `<!-- Downloads Center -->
<section class="downloads">
  <h2>Pusat Unduhan Berkas</h2>
  <ul class="files-list">
    ${(Array.isArray(data) ? data : []).map((file: any) => `
    <li>
      <a href="${escapeHtml(file.url)}" download>
        <span class="title">${escapeHtml(file.title)}</span>
        <span class="info">(${escapeHtml(file.type)} - ${escapeHtml(file.size)})</span>
      </a>
    </li>`).join("")}
  </ul>
</section>`;

      default:
        // Fallback for custom or unknown sections: format key-value pairs
        return `<!-- HTML Snapshot: ${escapeHtml(section)} -->
<div class="section-${escapeHtml(section)}">
  ${Object.entries(data || {}).map(([key, val]) => `  <div class="${escapeHtml(key)}">${escapeHtml(String(val))}</div>`).join("\n")}
</div>`;
    }
  } catch (e) {
    return `<!-- Gagal me-render pratinjau HTML: ${escapeHtml(String(e))} -->`;
  }
}

export default function EditorSidebar() {
  const { sidebarOpen, sidebarSection, closeSidebar } = useEditor();
  const admin = useAdmin();
  const [jsonText, setJsonText] = useState('');
  const [htmlText, setHtmlText] = useState('');
  const [viewMode, setViewMode] = useState<'json' | 'html'>('json');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (sidebarOpen && sidebarSection) {
      let data: any = null;
      if (['programs', 'achievements', 'agendas', 'news', 'stats', 'gallery', 'faqs', 'downloads', 'teachers', 'facilities', 'testimonials', 'innovations'].includes(sidebarSection)) {
        data = (admin as any)[sidebarSection];
      } else if (['hero', 'welcome', 'footer', 'topbar', 'ticker'].includes(sidebarSection)) {
        data = (admin.siteContent as any)[sidebarSection];
      }
      setJsonText(JSON.stringify(data || {}, null, 2));
      setError(null);
      setViewMode('json'); // Reset to JSON tab when opening a new section
    }
  }, [sidebarOpen, sidebarSection, admin]);

  // Compute HTML snapshot when JSON text updates
  useEffect(() => {
    if (sidebarSection) {
      try {
        const parsed = JSON.parse(jsonText);
        const generatedHtml = convertSectionToHtml(sidebarSection, parsed);
        setHtmlText(generatedHtml);
      } catch (e) {
        setHtmlText(`<!-- Format data JSON tidak valid, tidak bisa menghasilkan pratinjau HTML -->`);
      }
    }
  }, [jsonText, sidebarSection]);

  if (!sidebarOpen || !sidebarSection) return null;

  const config = SECTION_CONFIG[sidebarSection] || { label: sidebarSection, icon: 'Settings' };

  const handleSave = async () => {
    if (viewMode !== 'json') return; // Only allow save in JSON mode
    try {
      setIsSaving(true);
      setError(null);
      const parsedData = JSON.parse(jsonText);
      
      if (['programs', 'achievements', 'agendas', 'news', 'stats', 'gallery', 'faqs', 'downloads', 'teachers', 'facilities', 'testimonials', 'innovations'].includes(sidebarSection)) {
        const setterName = 'set' + sidebarSection.charAt(0).toUpperCase() + sidebarSection.slice(1);
        if (typeof (admin as any)[setterName] === 'function') {
          (admin as any)[setterName](parsedData);
        }
      } else if (['hero', 'welcome', 'footer', 'topbar', 'ticker'].includes(sidebarSection)) {
        const newSiteContent = { ...admin.siteContent, [sidebarSection]: parsedData };
        await admin.updateSiteContent(newSiteContent);
      }
      
      closeSidebar();
    } catch (err: any) {
      setError(err.message || 'Data JSON tidak valid');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-sm transition-opacity" 
        onClick={closeSidebar}
      />
      
      {/* Sidebar panel */}
      <div className="fixed top-0 right-0 h-full w-[480px] max-w-[90vw] z-[120] bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 translate-x-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Code size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">Edit {config.label}</h3>
              <p className="text-xs text-slate-500">Workspace Editor Kanan</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 flex flex-col bg-slate-50/50">
          
          {/* Format Select Buttons (JSON / HTML) */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-200/60 p-1 rounded-xl mb-4 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('json')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 select-none ${
                viewMode === 'json'
                  ? "bg-white text-blue-600 shadow-sm shadow-blue-500/5"
                  : "text-slate-500 hover:text-slate-855"
              }`}
            >
              <FileJson size={14} />
              <span>Format JSON</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('html')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 select-none ${
                viewMode === 'html'
                  ? "bg-white text-blue-600 shadow-sm shadow-blue-500/5"
                  : "text-slate-500 hover:text-slate-855"
              }`}
            >
              <FileCode size={14} />
              <span>Format HTML</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-650 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {viewMode === 'json' ? (
            <div className="flex-1 flex flex-col min-h-0">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Raw JSON Data</label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="flex-1 w-full bg-slate-900 text-emerald-450 font-mono text-xs p-4 rounded-xl border border-slate-955 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rendered HTML Output (Read‑Only)</label>
              <textarea
                value={htmlText}
                readOnly
                className="flex-1 w-full bg-slate-950 text-amber-300 font-mono text-xs p-4 rounded-xl border border-slate-900 outline-none resize-none select-all leading-relaxed"
                spellCheck="false"
              />
              <div className="mt-2.5 p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2.5">
                <Check size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-900 leading-relaxed font-medium">
                  Kode HTML di atas dihasilkan secara otomatis dari data JSON aktif untuk mempermudah visualisasi dan penyalinan markup. Silakan beralih kembali ke mode <strong>Format JSON</strong> untuk melakukan penyuntingan data.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white">
          {viewMode === 'json' ? (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 active:scale-98 disabled:opacity-50 select-none text-xs"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={15} />
                  Simpan Perubahan
                </>
              )}
            </button>
          ) : (
            <button 
              disabled
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed select-none text-xs"
            >
              <Save size={15} />
              Simpan Dinonaktifkan (Mode HTML)
            </button>
          )}
        </div>
      </div>
    </>
  );
}
