/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lightbulb, 
  Cpu, 
  Recycle, 
  BookOpen, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Users, 
  Globe, 
  Sparkles,
  Zap,
  Leaf
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InfoItem {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}

interface Step {
  title: string;
  desc: string;
}

interface InnovationSubMenu {
  id: string;
  title: string;
  description: string;
  badge: string;
  tagline: string;
  colorTheme: string; // Tailwind class presets
  icon: React.ReactNode;
  stats: InfoItem[];
  steps: Step[];
  impactTitle: string;
  impactDesc: string;
}

export default function Innovations() {
  const [activeTab, setActiveTab] = useState<string>("digital");

  const innovations: InnovationSubMenu[] = [
    {
      id: "digital",
      title: "e-Learning & Smart Class",
      badge: "Inovasi Pembelajaran",
      tagline: "Sistem Manajemen Belajar & Kelas Berbasis Proyektor Interaktif",
      description: "Transformasi kegiatan belajar mengajar (KBM) konvensional ke berbasis media teknologi. Setiap tingkat kelas dilengkapi koneksi internet kecepatan tinggi, proyektor multimedial, dan platform interaktif belajar mandiri.",
      colorTheme: "indigo",
      icon: <Cpu size={15} strokeWidth={2.5} />,
      stats: [
        { label: "Kelas Cerdas", value: "100%", sub: "Terpasang Smart Projector", icon: <Cpu className="text-indigo-600" size={18} /> },
        { label: "Materi Digital", value: "320+", sub: "Modul & Animasi Interaktif", icon: <Globe className="text-indigo-600" size={18} /> },
        { label: "Guru Cakap IT", value: "100%", sub: "Telah Tersertifikasi Digital", icon: <Award className="text-indigo-600" size={18} /> },
        { label: "Efisiensi KBM", value: "+45%", sub: "Keterpaduan Pemahaman Siswa", icon: <TrendingUp className="text-indigo-600" size={18} /> }
      ],
      steps: [
        { title: "Pembelajaran Interaktif", desc: "Guru menyajikan konsep abstrak sains/matematika dengan animasi 3D interaktif." },
        { title: "Evaluasi Game-Based", desc: "Kuis harian menyenangkan menggunakan media e-learning untuk melatih daya tangkas." },
        { title: "Portofolio Online", desc: "Hasil karya anak didik terabadikan secara aman dalam arsip digital cloud sekolah." }
      ],
      impactTitle: "Dampak Akademis Nyata",
      impactDesc: "92% siswa melaporkan lebih menyukai model KBM berbasis smart class, mengurangi tingkat ketidakhadiran secara signifikan di seluruh jenjang rombel."
    },
    {
      id: "adiwiyata",
      title: "Adiwiyata Saku / Bank Sampah",
      badge: "Karakter Peduli Lingkungan",
      tagline: "Aplikasi Pencatatan & Tabungan Sampah Plastik Murid",
      description: "Program sadar lingkungan di mana seluruh siswa diajarkan memilah sampah harian. Sampah organik dijadikan kompos taman sekolah, dan sampah anorganik ditimbang dan dicatat sebagai tabungan poin lingkungan.",
      colorTheme: "emerald",
      icon: <Recycle size={15} strokeWidth={2.5} />,
      stats: [
        { label: "Sampah Terkelola", value: "850 kg", sub: "Plastik Berhasil Didaur Ulang", icon: <Recycle className="text-emerald-600" size={18} /> },
        { label: "Partisipasi Siswa", value: "98%", sub: "Siswa Aktif Menabung Sampah", icon: <Users className="text-emerald-600" size={18} /> },
        { label: "Taman Hidup", value: "6 Zona", sub: "Kawasan Kehati & Tanaman Obat", icon: <Leaf className="text-emerald-600" size={18} /> },
        { label: "Ekskul Hijau", value: "2 Kali", sub: "Pembinaan Rutin per Pekan", icon: <Sparkles className="text-emerald-600" size={18} /> }
      ],
      steps: [
        { title: "Pilah & Setor harian", desc: "Murid menyisihkan sampah plastik minumannya untuk ditimbang setiap pagi hari." },
        { title: "Konversi Buku Tabungan", desc: "Sampah dikonversi menjadi poin yang bisa ditukar dengan alat tulis atau buku fiksi." },
        { title: "Produksi Pupuk Kompos", desc: "Sampah daun diproduksi langsung oleh siswa bersama kader Adiwiyata untuk kebun." }
      ],
      impactTitle: "Keasrian & Kepedulian Lestari",
      impactDesc: "Menciptakan lingkungan belajar yang sangat asri, sejuk, minim limbah plastik sekali pakai, serta mengantarkan SDN 3 Purwosari meraih Adiwiyata Tingkat Kabupaten."
    },
    {
      id: "literasi",
      title: "Perpustakaan Pojok Digital",
      badge: "Inovasi Literasi",
      tagline: "Akses E-Book Gratis & Koleksi Buku Fisik Kreatif Kelas",
      description: "Meningkatkan kegemaran membaca (reading culture) melalui penyediaan tablet baca khusus anak dan rak kreasi buku di sudut baris setiap ruang kelas. Akses luas ke ratusan dongeng nusantara dan ensiklopedia interaktif.",
      colorTheme: "amber",
      icon: <BookOpen size={15} strokeWidth={2.5} />,
      stats: [
        { label: "Koleksi E-Book", value: "450+", sub: "Buku Bacaan Ramah Anak", icon: <BookOpen className="text-amber-600" size={18} /> },
        { label: "Pojok Baca", value: "6 Spot", sub: "Nyaman di Seluruh Ruang Kelas", icon: <Sparkles className="text-amber-600" size={18} /> },
        { label: "Rata-rata Baca", value: "3 Buku", sub: "Selesai diulas Siswa per Bulan", icon: <CheckCircle2 className="text-amber-600" size={18} /> },
        { label: "Indeks Literasi", value: "Tinggi", sub: "Standar Kemendikbudristek", icon: <Zap className="text-amber-600" size={18} /> }
      ],
      steps: [
        { title: "15 Menit Membaca", desc: "Kebiasaan membaca buku non-akademis bersama guru kelas sebelum gerbang pelajaran utama dimulai." },
        { title: "Ulasan Kreatif (Review)", desc: "Siswa menempelkan resume gambar cerita mading di dinding apresiasi pojok kreatif lokal." },
        { title: "Rewards Duta Baca", desc: "Pemilihan secara berkala duta literasi berhadiah pin penghargaan kepemimpinan cilik." }
      ],
      impactTitle: "Pondasi Penalaran Kritis",
      impactDesc: "Mendorong nilai kompetensi asesmen nasional literasi SDN 3 Purwosari melampaui rata-rata nasional, melahirkan generasi haus ilmu yang kritis dan ekspresif."
    }
  ];

  const activeInovasi = innovations.find(item => item.id === activeTab) || innovations[0];

  return (
    <section id="section-inovasi" className="py-10 md:py-14 bg-white text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Inovasi Unggulan & Dampak
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight animate-fade-in">
            Portal Inovasi Sekolah
          </h2>
          <p className="text-[#64748B] font-normal mt-2 text-xs md:text-sm leading-relaxed">
            Menghadirkan terobosan kreatif dalam sistem tata belajar, lingkungan hijau berkelanjutan, dan penguatan budaya baca demi memicu percepatan karakter anak didik.
          </p>
          <div className="w-12 h-1 bg-[#2563EB] mx-auto mt-3 rounded-full" />
        </div>

        {/* Sub-Menu Bar - Extracurricular Tab Style */}
        <div className="flex justify-center mb-6 px-2">
          <div className="flex flex-wrap justify-center p-1.5 bg-slate-100 rounded-2xl gap-1.5 border border-slate-200/50 shadow-sm max-w-3xl w-full">
            {innovations.map((item) => {
              const isActive = activeTab === item.id;
              let activeBg = "bg-[#2563EB] text-white shadow-sm shadow-blue-100";
              let hoverColor = "hover:text-[#2563EB]";
              
              if (item.colorTheme === "emerald") {
                activeBg = "bg-emerald-500 text-white shadow-sm shadow-emerald-100";
                hoverColor = "hover:text-emerald-500";
              } else if (item.colorTheme === "amber") {
                activeBg = "bg-amber-500 text-[#1E293B] shadow-sm shadow-amber-100";
                hoverColor = "hover:text-amber-600";
              }

              const shortTitle = item.id === "digital" ? "Smart Class" : item.id === "adiwiyata" ? "Bank Sampah" : "Pojok Digital";

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 sm:px-6 py-2 rounded-[14px] text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                    isActive
                      ? activeBg
                      : `text-[#64748B] hover:bg-white/50 ${hoverColor}`
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.title}</span>
                  <span className="inline sm:hidden">{shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Infographic Dashboard Panel */}
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/60 p-5 md:p-8 shadow-sm relative overflow-hidden">
          {/* Subtle backgrounds visual element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/10 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeInovasi.id}
              initial={{ opacity: 0, scale: 0.99, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start"
            >
              {/* Infographic column (Left: 7-columns wide) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div>
                  <span className={`text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full ${
                    activeInovasi.colorTheme === "emerald"
                      ? "bg-emerald-50 text-emerald-700"
                      : activeInovasi.colorTheme === "amber"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-blue-50 text-[#2563EB]"
                  }`}>
                    {activeInovasi.badge}
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-[#1E293B] mt-3 tracking-tight">
                    {activeInovasi.title}
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-slate-500 mt-1 leading-relaxed bg-white/50 py-1 px-3 rounded-lg border border-slate-100 inline-block">
                    {activeInovasi.tagline}
                  </p>
                  <p className="text-[#64748B] text-xs md:text-sm leading-relaxed mt-4 font-normal">
                    {activeInovasi.description}
                  </p>
                </div>

                {/* Dashboard Metrics (Infographic Grid) */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {activeInovasi.stats.map((stat, sIdx) => {
                    let borderHover = "hover:border-indigo-200";
                    let bgHover = "hover:bg-indigo-50/20";
                    if (activeInovasi.colorTheme === "emerald") {
                      borderHover = "hover:border-emerald-200";
                      bgHover = "hover:bg-emerald-50/20";
                    } else if (activeInovasi.colorTheme === "amber") {
                      borderHover = "hover:border-amber-200";
                      bgHover = "hover:bg-amber-50/20";
                    }

                    return (
                      <div
                        key={sIdx}
                        className={`bg-white border border-slate-200/60 p-4.5 rounded-[22px] transition duration-300 flex items-start gap-3.5 shadow-sm ${borderHover} ${bgHover} cursor-default`}
                      >
                        <div className={`p-2 bg-slate-50 border border-slate-100 rounded-xl shrink-0`}>
                          {stat.icon}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block leading-none">
                            {stat.label}
                          </span>
                          <span className="text-xl md:text-2xl font-heading font-extrabold text-[#1E293B] block mt-1 tracking-tight leading-none">
                            {stat.value}
                          </span>
                          <span className="text-[10px] text-slate-400 leading-tight block mt-1 font-medium font-sans">
                            {stat.sub}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Impact Statement Box */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/50 flex gap-3.5 items-start">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeInovasi.colorTheme === "emerald"
                      ? "bg-emerald-50 text-emerald-600"
                      : activeInovasi.colorTheme === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-blue-600"
                  }`}>
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-extrabold text-[#1E293B] uppercase tracking-wide">
                      {activeInovasi.impactTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-normal leading-relaxed mt-1">
                      {activeInovasi.impactDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Sequence column (Right: 5-columns wide) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white rounded-[28px] p-6.5 md:p-8 border border-slate-800 shadow relative overflow-hidden flex flex-col gap-5">
                  <div className="absolute right-0 top-0 opacity-[0.03] text-white scale-125 translate-x-4 -translate-y-4 pointer-events-none">
                    <Lightbulb size={128} />
                  </div>
                  
                  <div>
                    <span className="text-[8px] bg-slate-700 border border-slate-600 text-slate-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest inline-flex items-center gap-1">
                      <Sparkles size={8} /> Alur Pelaksanaan Inovasi
                    </span>
                    <h4 className="text-base font-heading font-extrabold mt-2.5 leading-snug tracking-tight">
                      Bagaimana Sistem Bekerja?
                    </h4>
                    <p className="text-[10px] text-slate-400 font-normal mt-1 leading-relaxed">
                      Langkah-langkah integrasi harian yang dijalankan berkelanjutan secara teratur di lingkungan SDN 3 Purwosari.
                    </p>
                  </div>

                  {/* Flow Steps List */}
                  <div className="flex flex-col gap-4">
                    {activeInovasi.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start group">
                        <div className={`w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center justify-center shrink-0 font-extrabold text-[10px] group-hover:bg-[#2563EB] group-hover:border-blue-500 transition duration-300`}>
                          0{idx + 1}
                        </div>
                        <div className="flex-1">
                          <span className="text-[11.5px] font-heading font-bold text-slate-200 block truncate leading-tight group-hover:text-white transition">
                            {step.title}
                          </span>
                          <span className="text-[10px] text-slate-400 leading-normal block mt-1 font-normal font-sans">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 pt-3.5 mt-2 flex items-center justify-between text-[9px] text-[#2563EB] font-extrabold">
                    <span>• Berkelanjutan (Sustainable)</span>
                    <span>• Ramah Anak (Kid-Friendly)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
