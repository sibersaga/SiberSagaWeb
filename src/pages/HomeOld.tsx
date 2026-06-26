/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Welcome from "../components/Welcome";
import Teachers from "../components/Teachers";
import SchoolConditions from "../components/SchoolConditions";
import Innovations from "../components/Innovations";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";
import VideoMap from "../components/VideoMap";
import { useAdmin } from "../context/AdminContext";
import SectionToolbar from "../components/editor/SectionToolbar";

export default function HomeOld() {
  const [activeSection, setActiveSection] = useState("hero");
  const navigate = useNavigate();
  const { siteContent, updateSiteContent } = useAdmin();
  
  const sectionOrder = siteContent.sectionOrder || [
    "hero", "stats", "welcome", "teachers", "conditions",
    "programs", "achievements", "innovations", "news",
    "gallery", "services", "testimonials", "videomap",
  ];
  const hiddenSections = siteContent.hiddenSections || [];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (const section of sectionOrder) {
        if (hiddenSections.includes(section)) continue;
        const el = document.getElementById(`section-${section}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionOrder, hiddenSections]);

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    } else {
      return;
    }
    await updateSiteContent({ ...siteContent, sectionOrder: newOrder });
  };

  const toggleVisibility = async (id: string) => {
    const isHidden = hiddenSections.includes(id);
    const newHidden = isHidden 
      ? hiddenSections.filter(s => s !== id) 
      : [...hiddenSections, id];
    await updateSiteContent({ ...siteContent, hiddenSections: newHidden });
  };

  const renderSection = (id: string, index: number) => {
    const isHidden = hiddenSections.includes(id);
    
    const toolbarProps = {
      sectionId: id,
      isVisible: !isHidden,
      onMoveUp: index > 0 ? () => moveSection(index, 'up') : undefined,
      onMoveDown: index < sectionOrder.length - 1 ? () => moveSection(index, 'down') : undefined,
      onToggleVisibility: () => toggleVisibility(id),
    };

    switch (id) {
      case "hero":
        return (
          <SectionToolbar key={id} sectionLabel="Hero Banner" {...toolbarProps}>
            <div id="section-hero"><Hero /></div>
          </SectionToolbar>
        );
      case "stats":
        return (
          <SectionToolbar key={id} sectionLabel="Statistik" {...toolbarProps}>
            <Stats />
          </SectionToolbar>
        );
      case "welcome":
        return (
          <SectionToolbar key={id} sectionLabel="Sambutan & Visi Misi" {...toolbarProps}>
            <Welcome />
          </SectionToolbar>
        );
      case "teachers":
        return (
          <SectionToolbar key={id} sectionLabel="Preview Guru" {...toolbarProps}>
            <section id="section-guru" className="bg-white py-12 md:py-16 border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-6">
                <Teachers />
                <div className="text-center mt-8">
                  <button onClick={() => navigate("/tim")} className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-sky to-brand-navy text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all">Lihat Tim Kami Lengkap</button>
                </div>
              </div>
            </section>
          </SectionToolbar>
        );
      case "conditions":
        return (
          <SectionToolbar key={id} sectionLabel="Kondisi Sekolah" {...toolbarProps}>
            <SchoolConditions />
          </SectionToolbar>
        );
      case "programs":
        return (
          <SectionToolbar key={id} sectionLabel="Preview Program" {...toolbarProps}>
            <section id="section-program" className="bg-slate-50 py-12 md:py-16 border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-6 text-center mb-8">
                <div className="inline-block mb-3"><span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">Akademik & Ekstrakurikuler</span></div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Program Unggulan</h2>
                <p className="text-slate-600 max-w-2xl mx-auto mb-8">Jelajahi program akademik dan ekstrakurikuler kami yang dirancang untuk mengembangkan potensi setiap siswa.</p>
                <button onClick={() => navigate("/program")} className="inline-flex items-center gap-2 bg-brand-sky text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-navy transition-all">Lihat Semua Program</button>
              </div>
            </section>
          </SectionToolbar>
        );
      case "achievements":
        return (
          <SectionToolbar key={id} sectionLabel="Prestasi" {...toolbarProps}>
            <Achievements />
          </SectionToolbar>
        );
      case "innovations":
        return (
          <SectionToolbar key={id} sectionLabel="Inovasi" {...toolbarProps}>
            <Innovations />
          </SectionToolbar>
        );
      case "news":
        return (
          <SectionToolbar key={id} sectionLabel="Preview Berita" {...toolbarProps}>
            <section id="section-berita" className="bg-white py-12 md:py-16 border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-6 text-center mb-8">
                <div className="inline-block mb-3"><span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">Informasi Terbaru</span></div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Berita & Pengumuman</h2>
                <p className="text-slate-600 max-w-2xl mx-auto mb-8">Ikuti perkembangan terbaru dan pengumuman penting dari SDN 3 Purwosari.</p>
                <button onClick={() => navigate("/berita")} className="inline-flex items-center gap-2 bg-brand-sky text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-navy transition-all">Lihat Semua Berita</button>
              </div>
            </section>
          </SectionToolbar>
        );
      case "gallery":
        return (
          <SectionToolbar key={id} sectionLabel="Preview Galeri" {...toolbarProps}>
            <section id="section-galeri" className="bg-slate-50 py-12 md:py-16 border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-6 text-center mb-8">
                <div className="inline-block mb-3"><span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">Dokumentasi Visual</span></div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Galeri Foto</h2>
                <p className="text-slate-600 max-w-2xl mx-auto mb-8">Lihat momen-momen berharga dari kegiatan dan fasilitas sekolah kami.</p>
                <button onClick={() => navigate("/galeri")} className="inline-flex items-center gap-2 bg-brand-sky text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-navy transition-all">Lihat Galeri Lengkap</button>
              </div>
            </section>
          </SectionToolbar>
        );
      case "services":
        return (
          <SectionToolbar key={id} sectionLabel="Layanan & Fasilitas" {...toolbarProps}>
            <section id="section-layanan" className="bg-white py-12 md:py-16 border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Layanan */}
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Layanan & Informasi</h3>
                    <p className="text-slate-600 text-sm mb-4">Akses dokumen dan formulir layanan pendidikan kami.</p>
                    <button onClick={() => navigate("/layanan")} className="text-brand-sky font-bold text-sm hover:text-brand-navy transition">Lihat Layanan →</button>
                  </div>
                  {/* Download */}
                  <div className="bg-gradient-to-br from-amber-50 to-slate-50 rounded-2xl p-6 border border-amber-100">
                    <div className="text-4xl mb-3">📥</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Download Center</h3>
                    <p className="text-slate-600 text-sm mb-4">Unduh dokumen, brosur, dan formulir sekolah.</p>
                    <button onClick={() => navigate("/download")} className="text-brand-sky font-bold text-sm hover:text-brand-navy transition">Unduh Sekarang →</button>
                  </div>
                  {/* Fasilitas */}
                  <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-4xl mb-3">🏢</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fasilitas Sekolah</h3>
                    <p className="text-slate-600 text-sm mb-4">Jelajahi sarana dan prasarana lengkap kami.</p>
                    <button onClick={() => navigate("/fasilitas")} className="text-brand-sky font-bold text-sm hover:text-brand-navy transition">Lihat Fasilitas →</button>
                  </div>
                </div>
              </div>
            </section>
          </SectionToolbar>
        );
      case "testimonials":
        return (
          <SectionToolbar key={id} sectionLabel="Testimoni" {...toolbarProps}>
            <Testimonials />
          </SectionToolbar>
        );
      case "videomap":
        return (
          <SectionToolbar key={id} sectionLabel="Video & Map" {...toolbarProps}>
            <VideoMap />
          </SectionToolbar>
        );
      default:
        return null;
    }
  };

  return <>{sectionOrder.map((id, index) => renderSection(id, index))}</>;
}
