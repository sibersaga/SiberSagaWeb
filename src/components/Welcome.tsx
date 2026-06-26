/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Quote, 
  Eye, 
  Target, 
  Flag, 
  Compass, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  BookOpen, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAdmin } from "../context/AdminContext";
import EditableText from "./editor/EditableText";
import EditableImage from "./editor/EditableImage";

interface WelcomeProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  tabs?: any;
}

export default function Welcome(props: WelcomeProps) {
  const [activeTab, setActiveTab] = useState<string>("sambutan");
  const { siteContent, updateSiteContent } = useAdmin();
  const welcome = { ...siteContent.welcome, ...props };
  const updateWelcome = (key: string, value: any) => {
    updateSiteContent({
      ...siteContent,
      welcome: { ...welcome, [key]: value }
    });
  };

  const updateTab = (tabId: string, key: string, value: any) => {
    const tabData = (welcome.tabs as any)[tabId];
    updateSiteContent({
      ...siteContent,
      welcome: {
        ...welcome,
        tabs: {
          ...welcome.tabs,
          [tabId]: { ...tabData, [key]: value }
        }
      }
    });
  };

  const tabs = [
    {
      id: "sambutan",
      label: welcome.tabs.sambutan.label,
      icon: <Quote size={15} strokeWidth={2.5} />,
      badge: welcome.tabs.sambutan.badge,
      title: welcome.tabs.sambutan.title,
    },
    {
      id: "visi",
      label: welcome.tabs.visi.label,
      icon: <Eye size={15} strokeWidth={2.5} />,
      badge: welcome.tabs.visi.badge,
      title: welcome.tabs.visi.title,
    },
    {
      id: "misi",
      label: welcome.tabs.misi.label,
      icon: <Target size={15} strokeWidth={2.5} />,
      badge: welcome.tabs.misi.badge,
      title: welcome.tabs.misi.title,
    },
    {
      id: "tujuan",
      label: welcome.tabs.tujuan.label,
      icon: <Flag size={15} strokeWidth={2.5} />,
      badge: welcome.tabs.tujuan.badge,
      title: welcome.tabs.tujuan.title,
    },
  ];

  return (
    <section id="section-sambutan" className="py-10 md:py-14 bg-white text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 bg-brand-sky/10 text-brand-sky px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <EditableText value={welcome.eyebrow} onChange={(v) => updateWelcome('eyebrow', v)} />
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy mt-4 tracking-tight">
            <EditableText value={welcome.title} onChange={(v) => updateWelcome('title', v)} />
          </h2>
          <p className="text-[#64748B] font-normal mt-2 text-xs md:text-sm leading-relaxed">
            <EditableText value={welcome.description} onChange={(v) => updateWelcome('description', v)} multiline />
          </p>
          <div className="w-12 h-1 bg-brand-sky mx-auto mt-3 rounded-full" />
        </div>

        {/* Custom Tab Triggers Wrapper */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const shortLabel = tab.id === "sambutan" ? "Sambutan" : tab.id === "visi" ? "Visi" : tab.id === "misi" ? "Misi" : "Tujuan";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer border select-none ${
                  isActive
                    ? "bg-white text-brand-sky border-slate-200 shadow-sm font-extrabold"
                    : "bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100"
                }`}
              >
                <span className={isActive ? "text-brand-sky" : "text-slate-400"}>
                  {tab.icon}
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Content Display */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-8 shadow-md relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "sambutan" && (
              <motion.div
                key="sambutan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start"
              >
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative group max-w-sm w-full">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#2563EB] to-[#FBBF24] rounded-[28px] opacity-25 blur-md transition-all duration-300 group-hover:opacity-40 group-hover:blur-lg" />
                    <div className="absolute inset-0 bg-slate-900 rounded-[28px] transform translate-x-3 translate-y-3 z-0 shadow" />

                    <div className="relative z-10 bg-white p-3 rounded-[28px] shadow-lg overflow-hidden aspect-[4/5] flex items-center justify-center border border-slate-150">
                      <EditableImage
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500"
                        alt={welcome.tabs.sambutan.leadImageAlt}
                        className="w-full h-full object-cover rounded-2xl grayscale-[15%] transition-all duration-300 transform group-hover:scale-102"
                        onChange={() => {}}
                      />
                      <div className="absolute bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-md text-white p-4.5 rounded-2xl border border-white/10 shadow-lg select-none">
                        <span className="text-[9px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md font-extrabold uppercase tracking-wide block w-fit mb-1.5">
                          Kepala Sekolah
                        </span>
                        <h4 className="font-heading font-extrabold text-sm md:text-base leading-tight text-[#FBBF24]">
                          Kiswanto, S.Pd., M.Pd.
                        </h4>
                        <p className="text-[10px] text-slate-300 font-medium font-sans mt-0.5">
                          NIP. 19741205 199903 1 002
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      <EditableText value={welcome.tabs.sambutan.badge} onChange={(v) => updateTab('sambutan', 'badge', v)} />
                    </span>
                  </div>

                  <div className="text-[#2563EB] opacity-15 self-start">
                    <Quote size={44} strokeWidth={3} />
                  </div>

                  <h3 className="text-xl md:text-2xl font-heading font-extrabold text-[#1E293B] leading-snug tracking-tight">
                    &ldquo;<EditableText value={welcome.tabs.sambutan.quote} onChange={(v) => updateTab('sambutan', 'quote', v)} multiline />&rdquo;
                  </h3>

                  <div className="space-y-4 text-[#64748B] text-xs md:text-sm leading-relaxed font-normal">
                    {welcome.tabs.sambutan.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    <p className="font-extrabold text-[#1E293B]">
                      <EditableText value={welcome.tabs.sambutan.closing} onChange={(v) => updateTab('sambutan', 'closing', v)} />
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "visi" && (
              <motion.div
                key="visi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center"
              >
                <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-3xl border border-slate-150">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 border border-blue-100 shadow-sm animate-pulse">
                    <Compass size={32} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-heading font-extrabold text-[#1E293B] text-lg md:text-xl mb-3">
                    <EditableText value={welcome.tabs.visi.title} onChange={(v) => updateTab('visi', 'title', v)} multiline />
                  </h4>
                  <p className="text-xs md:text-sm text-[#64748B] font-medium leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <EditableText value={welcome.tabs.visi.intro} onChange={(v) => updateTab('visi', 'intro', v)} multiline />
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <div className="mb-6">
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                      <EditableText value={welcome.tabs.visi.badge} onChange={(v) => updateTab('visi', 'badge', v)} />
                    </span>
                    <p className="text-[#64748B] text-sm leading-relaxed mt-2">
                      <EditableText value={welcome.tabs.visi.description} onChange={(v) => updateTab('visi', 'description', v)} multiline />
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {welcome.tabs.visi.highlights.map((item, idx) => (
                      <div key={idx} className="flex gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="mt-0.5 text-[#FBBF24]">
                          <Sparkles size={16} strokeWidth={3} />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-[#1E293B]">{item.title}</h5>
                          <p className="text-[11px] text-[#64748B] leading-snug mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "misi" && (
              <motion.div
                key="misi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
              >
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="mb-6">
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                      <EditableText value={welcome.tabs.misi.badge} onChange={(v) => updateTab('misi', 'badge', v)} />
                    </span>
                    <h3 className="text-xl md:text-2xl font-heading font-extrabold text-[#1E293B] leading-tight mt-2 mb-2">
                      <EditableText value={welcome.tabs.misi.title} onChange={(v) => updateTab('misi', 'title', v)} />
                    </h3>
                    <p className="text-[#64748B] text-sm">
                      <EditableText value={welcome.tabs.misi.intro} onChange={(v) => updateTab('misi', 'intro', v)} multiline />
                    </p>
                  </div>

                  <ul className="space-y-4">
                    {welcome.tabs.misi.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl transition hover:bg-blue-50/50 hover:border-blue-100">
                        <div className="bg-[#2563EB] text-white rounded-full p-1 mt-0.5 shadow-sm shrink-0">
                          <CheckCircle2 size={14} strokeWidth={3} />
                        </div>
                        <p className="text-xs md:text-sm text-[#475569] leading-relaxed font-medium">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5 h-full">
                  <div className="bg-gradient-to-br from-slate-900 to-[#1e293b] rounded-3xl p-8 h-full text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-slate-800">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <ShieldCheck size={120} strokeWidth={1} />
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10 text-brand-sky">
                        <Heart size={24} fill="currentColor" className="text-brand-sky" />
                      </div>
                      <h4 className="text-xl font-heading font-extrabold mb-3">
                        <EditableText value={welcome.tabs.misi.panelTitle} onChange={(v) => updateTab('misi', 'panelTitle', v)} />
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        <EditableText value={welcome.tabs.misi.panelDescription} onChange={(v) => updateTab('misi', 'panelDescription', v)} multiline />
                      </p>
                    </div>
                    
                    <div className="relative z-10 pt-6 border-t border-slate-700/50 flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <EditableText value={welcome.tabs.misi.footerLeft} onChange={(v) => updateTab('misi', 'footerLeft', v)} />
                      </div>
                      <div className="bg-[#FBBF24] text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        <EditableText value={welcome.tabs.misi.footerRight} onChange={(v) => updateTab('misi', 'footerRight', v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "tujuan" && (
              <motion.div
                key="tujuan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
              >
                <div className="lg:col-span-4 flex flex-col justify-center">
                  <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider mb-3 w-fit">
                    <EditableText value={welcome.tabs.tujuan.badge} onChange={(v) => updateTab('tujuan', 'badge', v)} />
                  </span>
                  <h3 className="text-2xl font-heading font-extrabold text-[#1E293B] leading-tight mt-2 mb-4">
                    <EditableText value={welcome.tabs.tujuan.sideTitle} onChange={(v) => updateTab('tujuan', 'sideTitle', v)} multiline />
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed mb-6">
                    <EditableText value={welcome.tabs.tujuan.sideDescription} onChange={(v) => updateTab('tujuan', 'sideDescription', v)} multiline />
                  </p>
                  
                  <div className="p-5 bg-[#F8FAFC] border border-slate-200 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-sky border border-slate-100 shrink-0">
                      <Zap size={24} className="text-brand-sky" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Fokus Tahunan</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Meningkatkan prestasi sains & olahraga</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                    {welcome.tabs.tujuan.goals.map((goal, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col group">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-sky flex items-center justify-center mb-4 group-hover:bg-brand-sky group-hover:text-white transition-colors">
                          <Award size={18} strokeWidth={2.5} />
                        </div>
                        <h4 className="font-bold text-[#1E293B] text-base mb-2">{goal.title}</h4>
                        <p className="text-[#64748B] text-xs leading-relaxed mt-auto">
                          {goal.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
