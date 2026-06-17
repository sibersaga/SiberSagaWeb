/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AnnouncementsTicker from "./components/AnnouncementsTicker";
import Welcome from "./components/Welcome";
import Teachers from "./components/Teachers";
import SchoolConditions from "./components/SchoolConditions";
import SchoolFacilities from "./components/SchoolFacilities";
import Stats from "./components/Stats";
import Programs from "./components/Programs";
import News from "./components/News";
import Achievements from "./components/Achievements";
import Innovations from "./components/Innovations";
import Agenda from "./components/Agenda";
import Gallery from "./components/Gallery";
import SpmbFaq from "./components/SpmbFaq";
import Downloads from "./components/Downloads";
import Testimonials from "./components/Testimonials";
import VideoMap from "./components/VideoMap";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import { useAdmin } from "./context/AdminContext";

export default function App() {
  const { customHTML } = useAdmin();
  const [activeSection, setActiveSection] = useState("hero");
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "sambutan",
        "guru",
        "fasilitas",
        "kondisi",
        "program",
        "prestasi",
        "inovasi",
        "berita",
        "galeri",
        "spmb",
        "download",
        "kontak",
      ];
      
      // Calculate scroll offset positions
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      {/* 1. Global Topbar (Contact & Medsos) */}
      <Topbar />

      {/* 2. Main Sticky Navigation Header */}
      <Header activeSection={activeSection} />

      {/* 3. Hero Presentation Banner (Home) */}
      <div id="section-hero">
        <Hero />
      </div>

      {/* 5. Statistik Sekolah (Moved here below Hero and before Sambutan per user request) */}
      <Stats />

      {/* Custom Global HTML Widget (Admin-Defined Announcements/Badges) */}
      {customHTML && customHTML.trim() !== "" && (
        <div id="custom-html-widget" className="bg-white border-b border-slate-100 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div dangerouslySetInnerHTML={{ __html: customHTML }} />
          </div>
        </div>
      )}

      {/* 4. Sambutan Kepala Sekolah */}
      <Welcome />

      {/* 6. Guru & Tenaga Kependidikan */}
      <Teachers />

      {/* 7. Sarana & Prasarana */}
      <SchoolFacilities />

      {/* 8. Kondisi Siswa & Rombel */}
      <SchoolConditions />

      {/* 9. Program Unggulan & Ekskul */}
      <Programs />

      {/* 10. Prestasi Kebanggaan */}
      <Achievements />

      {/* 10.5. Inovasi Unggulan & Dampak */}
      <Innovations />

      {/* 11. Portal Berita & Informasi */}
      <News />

      {/* 12. Agenda Sekolah */}
      <Agenda />

      {/* 13. Dokumen Galeri Foto */}
      <Gallery />

      {/* 14. FAQ & SPMB Form */}
      <SpmbFaq />

      {/* 15. Testimoni Wali Murid */}
      <Testimonials />

      {/* 16. Pusat Unduhan File Dokumen */}
      <Downloads />

      {/* 17. Video Promosi & Google Maps Koordinat */}
      <VideoMap />

      {/* 14. Footer Layout */}
      <Footer onOpenAdmin={() => setIsAdminPanelOpen(true)} />

      {/* Admin Panel Modal Overlay */}
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />

      {/* Fixed-bottom overlay ticker for important announcements */}
      <AnnouncementsTicker />
    </div>
  );
}
