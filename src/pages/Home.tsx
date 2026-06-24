/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../sections/Hero";
import Stats from "../Stats";
import Welcome from "../Welcome";
import Teachers from "../Teachers";
import SchoolConditions from "../SchoolConditions";
import Innovations from "../Innovations";
import Achievements from "../Achievements";
import Testimonials from "../Testimonials";
import VideoMap from "../VideoMap";
import { useAdmin } from "../../context/AdminContext";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const navigate = useNavigate();

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
        "layanan",
        "spmb",
        "download",
        "kontak",
      ];

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

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div id="section-hero">
        <Hero />
      </div>

      <Stats />

      <Welcome />

      {/* Teachers Preview */}
      <section id="section-guru" className="bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <Teachers />
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/tim")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-sky to-brand-navy text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Lihat Tim Kami Lengkap
            </button>
          </div>
        </div>
      </section>

      <SchoolConditions />

      {/* Programs Preview */}
      <section id="section-program" className="bg-slate-50 py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-8">
          <div className="inline-block mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
              Akademik & Ekstrakurikuler
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Program Unggulan
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Jelajahi program akademik dan ekstrakurikuler kami yang dirancang untuk mengembangkan potensi setiap siswa.
          </p>
          <button
            onClick={() => navigate("/program")}
            className="inline-flex items-center gap-2 bg-brand-sky text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-navy transition-all"
          >
            Lihat Semua Program
          </button>
        </div>
      </section>

      <Achievements />

      <Innovations />

      {/* News Preview */}
      <section id="section-berita" className="bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-8">
          <div className="inline-block mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
              Informasi Terbaru
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Berita & Pengumuman
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Ikuti perkembangan terbaru dan pengumuman penting dari SDN 3 Purwosari.
          </p>
          <button
            onClick={() => navigate("/berita")}
            className="inline-flex items-center gap-2 bg-brand-sky text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-navy transition-all"
          >
            Lihat Semua Berita
          </button>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="section-galeri" className="bg-slate-50 py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-8">
          <div className="inline-block mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
              Dokumentasi Visual
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Galeri Foto
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Lihat momen-momen berharga dari kegiatan dan fasilitas sekolah kami.
          </p>
          <button
            onClick={() => navigate("/galeri")}
            className="inline-flex items-center gap-2 bg-brand-sky text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-navy transition-all"
          >
            Lihat Galeri Lengkap
          </button>
        </div>
      </section>

      {/* Services, Downloads, Facilities Preview */}
      <section className="bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Layanan */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Layanan & Informasi</h3>
              <p className="text-slate-600 text-sm mb-4">
                Akses dokumen dan formulir layanan pendidikan kami.
              </p>
              <button
                onClick={() => navigate("/layanan")}
                className="text-brand-sky font-bold text-sm hover:text-brand-navy transition"
              >
                Lihat Layanan →
              </button>
            </div>

            {/* Download */}
            <div className="bg-gradient-to-br from-amber-50 to-slate-50 rounded-2xl p-6 border border-amber-100">
              <div className="text-4xl mb-3">📥</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Download Center</h3>
              <p className="text-slate-600 text-sm mb-4">
                Unduh dokumen, brosur, dan formulir sekolah.
              </p>
              <button
                onClick={() => navigate("/download")}
                className="text-brand-sky font-bold text-sm hover:text-brand-navy transition"
              >
                Unduh Sekarang →
              </button>
            </div>

            {/* Fasilitas */}
            <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl p-6 border border-emerald-100">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Fasilitas Sekolah</h3>
              <p className="text-slate-600 text-sm mb-4">
                Jelajahi sarana dan prasarana lengkap kami.
              </p>
              <button
                onClick={() => navigate("/fasilitas")}
                className="text-brand-sky font-bold text-sm hover:text-brand-navy transition"
              >
                Lihat Fasilitas →
              </button>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <VideoMap />
    </>
  );
}
