/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { useAdmin } from '../../context/AdminContext';
import { X, Save, Code } from 'lucide-react';

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

export default function EditorSidebar() {
  const { sidebarOpen, sidebarSection, closeSidebar } = useEditor();
  const admin = useAdmin();
  const [jsonText, setJsonText] = useState('');
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
    }
  }, [sidebarOpen, sidebarSection, admin]);

  if (!sidebarOpen || !sidebarSection) return null;

  const config = SECTION_CONFIG[sidebarSection] || { label: sidebarSection, icon: 'Settings' };

  const handleSave = async () => {
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
      <div className="fixed top-0 right-0 h-full w-[450px] max-w-[90vw] z-[120] bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 translate-x-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Code size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">Edit {config.label}</h3>
              <p className="text-xs text-slate-500">Mode JSON Lanjutan</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 flex flex-col bg-slate-50/50">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Data JSON</label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="flex-1 w-full bg-slate-900 text-emerald-400 font-mono text-sm p-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 resize-none"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
