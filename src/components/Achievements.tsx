/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { Award, Trophy, Calendar, Sparkles, ChevronLeft, ChevronRight, X, Users, MapPin, UserCheck, Quote } from "lucide-react";
import { Achievement } from "../types";
import { useAdmin } from "../context/AdminContext";

interface AchievementExtraDetail {
  winner: string;
  coach: string;
  date: string;
  location: string;
  description: string;
  quote: string;
}

const achievementExtraDetails: { [key: string]: AchievementExtraDetail } = {
  "ach-1": {
    winner: "Fajar Ramadhan (Kelas V), Azizah Nuraini (Kelas V), & Gibran Al-Fariz (Kelas VI)",
    coach: "Siti Aminah, S.Pd.SD & Tim Delegasi Kurikulum",
    date: "24 April 2026",
    location: "Aula Koordinator Wilayah Dinas Pendidikan Wonogiri",
    description: "Delegasi LCC SDN 3 Purwosari sukses mendominasi babak penyisihan dengan skor akumulatif tertinggi, serta menunjukkan kecepatan luar biasa pada babak rebutan final atas materi Kewarganegaraan, Matematika Logika, dan Pengetahuan Agama.",
    quote: "Kerja sama tim yang padu serta doa restu orang tua melahirkan keberanian menjawab cepat dan akurat."
  },
  "ach-2": {
    winner: "Rian Prasetyo (Siswa Kelas IV)",
    coach: "Rina Astuti, S.Sn. (Guru Seni Budaya)",
    date: "15 September 2025",
    location: "Pendopo Ageng Kabupaten Wonogiri",
    description: "Membawakan lagu pilihan 'Tembang Dolanan' serta lagu wajib nasional secara tunggal tanpa pengiring musik elektronik melainkan bimbingan ketukan murni. Penampilan vokal Rian merebut pujian istimewa dari juri vokal nasional.",
    quote: "Setiap nada yang keluar dari hati sanubari tulus akan langsung merasuk mengetuk sanubari yang mendengarkan."
  },
  "ach-3": {
    winner: "Regu Tari Srikandi Cilik (Diva, Nisa, Siska, Amel, & Cinta - Kelas V)",
    coach: "Endang Lestari, S.Pd. & Pelatih Sanggar Seni Purwosari",
    date: "02 Mei 2026",
    location: "Gedung Teater Besar Taman Budaya Surakarta (TBS)",
    description: "Tarian bertajuk 'Dolanan Bocah Ing Pelataran' menggambarkan kelincahan, sportivitas, dan kegotongroyongan masa kecil anak-anak pedesaan dikemas dalam balutan busana kain lurik khas daerah Wonogiri yang ayu.",
    quote: "Menari adalah cara kami merayakan kekayaan tradisi Nusantara dengan senyuman ceria penuh rasa syukur."
  },
  "ach-4": {
    winner: "Aditya Pratama & Larasati (Siswa Kelas VI)",
    coach: "Kak Bambang Wijaya, S.Pd. (Pembina Gugusdepan Pramuka)",
    date: "10 November 2025",
    location: "Bumi Perkemahan Kwarcab Gerakan Pramuka Wonogiri",
    description: "Dinobatkan sebagai peserta didik teladan Pramuka Garuda setelah menuntaskan seluruh kecakapan umum (SKU) tingkat tinggi, uji kecakapan hidup mandiri, bakti lingkungan pedesaan, serta presentasi portofolio kemandirian.",
    quote: "Satyaku kudharmakan, Dharmaku kubaktikan. Pramuka senantiasa siap siaga memimpin kepedulian bersama."
  }
};

interface AchievementsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  achievements?: Achievement[];
}

export default function Achievements(props: AchievementsProps) {
  const { achievements: globalAchievements } = useAdmin();
  const achievements = props.achievements && props.achievements.length > 0 ? props.achievements : globalAchievements;
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedAch, setSelectedAch] = useState<Achievement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 340; // Approx card width + gap
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Autoplay sliding logic: scrolls the achievements list continuously at 4x speed and loops seamlessly
  useEffect(() => {
    if (isHovered || achievements.length === 0) return;

    let animationFrameId: number;
    const scrollContainer = carouselRef.current;
    if (!scrollContainer) return;

    // 4x move speed (standard speed is ~0.5px, 4x speed is 2.0px per frame)
    const speed = 2.0;

    const step = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += speed;
        
        // Loop back seamlessly when scrolling past the first duplicated set
        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollContainer.scrollLeft >= halfWidth) {
          scrollContainer.scrollLeft -= halfWidth;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, achievements]);

  const getExtraInfo = (id: string): AchievementExtraDetail => {
    return achievementExtraDetails[id] || {
      winner: "Siswa Berbakat Pilihan SDN 3 Purwosari",
      coach: "Guru Pembimbing Ekstrakurikuler terkait",
      date: "Periode Kompetisi Tahun Ajaran",
      location: "Kecamatan / Kabupaten Wonogiri",
      description: "Keikutsertaan aktif siswa dalam menjunjung tinggi sportivitas dan nilai juang belajar untuk mengukir tinta emas prestasi kebanggaan sekolah.",
      quote: "Terus mengasah diri, membanggakan nama sekolah, guru, orang tua, dan bangsa tercinta."
    };
  };

  return (
    <section id="section-prestasi" className="py-12 md:py-16 bg-[#F8FAFC] text-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-[#F59E0B]/10 text-[#F59E0B] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Trophy size={14} className="animate-pulse" />
              {props.badge || "Pilar Kebanggaan"}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
              {props.title || "Prestasi Gemilang Siswa"}
            </h2>
            <p className="text-[#64748B] font-normal mt-3 text-sm md:text-base leading-relaxed max-w-xl">
              {props.subtitle || "Bukti nyata dari dedikasi, kerja keras, dan komitmen SDN 3 Purwosari dalam mencetak talenta berprestasi di berbagai tingkatan."}
            </p>
          </div>
          
          {/* Slider Controllers */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => scroll("left")}
              className="p-2 sm:p-2.5 bg-white border border-slate-200 hover:border-[#2563EB] text-slate-600 hover:text-[#2563EB] rounded-xl hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              aria-label="Kembali"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 sm:p-2.5 bg-white border border-slate-200 hover:border-[#2563EB] text-slate-600 hover:text-[#2563EB] rounded-xl hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              aria-label="Lanjut"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Carousel Container Wrapper */}
        <div className="relative">
          {/* Subtle horizontal mask gradients for elegant slider fades */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none hidden md:block" />

          {/* Horizontal Drag-Scroll area */}
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            id="achievements-scroll-container"
            className="flex gap-6 overflow-x-auto pt-6 pb-12 px-4 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[...achievements, ...achievements].map((ach, idx) => (
              <div
                key={`${ach.id}-${idx}`}
                id={`achievement-card-${ach.id}-${idx}`}
                onClick={() => setSelectedAch(ach)}
                className="group shrink-0 min-w-[280px] sm:min-w-[310px] w-[280px] sm:w-[310px] bg-white rounded-3xl p-5 border border-slate-150 shadow-sm hover:shadow-2xl hover:border-blue-300 hover:scale-[1.08] md:hover:scale-110 hover:z-20 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                title="Pencet untuk membaca ulasan detail prestasi lengkap"
              >
                {/* Image panel with Zoom-In effect */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-150 mb-3.5 shadow-inner">
                  <img
                    src={ach.image}
                    alt={ach.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <span className="absolute bottom-2.5 left-2.5 bg-amber-400 text-slate-900 font-extrabold text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow border border-white/20 flex items-center gap-1">
                    <Trophy size={9} />
                    {ach.rank}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-slate-900/90 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                    {ach.year}
                  </span>
                </div>

                {/* Info and Titles */}
                <div className="flex-grow">
                  <div className="flex items-center gap-1 text-[8px] uppercase font-bold text-[#64748B] mb-1 tracking-widest">
                    <span>{ach.category}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#1E293B] leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2">
                    {ach.title}
                  </h3>
                </div>

                {/* Level details in mini badge */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-[10px]">Tingkat kejuaraan</span>
                  <span className="font-bold text-[#2563EB] bg-blue-50/80 px-2 py-0.5 rounded-lg text-[10px]">
                    {ach.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small motivational quote row */}
        <div className="mt-14 bg-white border border-slate-100 shadow-xl shadow-slate-200/30 rounded-[28px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-500 shrink-0 hidden sm:block">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-[#1E293B]">
                Ingin Menyumbangkan Bakat Anak Anda Selanjutnya?
              </h4>
              <p className="text-xs md:text-sm text-[#64748B] font-normal mt-1 max-w-xl">
                Kami berkomitmen memetakan dan menyemai bakat alamiah setiap anak lewat bimbingan intensif ekstrakurikuler sekolah terakreditasi kami.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const element = document.getElementById("section-spmb");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-[#2563EB] hover:bg-[#2563EB]/95 text-white text-xs font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 cursor-pointer shrink-0"
          >
            Gabung SDN 3 Purwosari &rarr;
          </button>
        </div>

      </div>

      {/* Achievement Detail Pop-up Modal with blurred backdrop */}
      {selectedAch && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedAch(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col transform transition-all animate-[slideIn_0.3s_ease-out] border border-slate-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header Image */}
            <div className="relative aspect-video w-full bg-slate-100 shadow-inner">
              <img
                src={selectedAch.image}
                alt={selectedAch.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
              <button
                onClick={() => setSelectedAch(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/75 hover:bg-slate-900 text-white rounded-full shadow-lg transition-all cursor-pointer"
                title="Tutup Detil Prestasi"
              >
                <X size={16} />
              </button>
              
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                  {selectedAch.category} • {selectedAch.year}
                </span>
                <h3 className="text-white font-heading font-extrabold text-base md:text-lg mt-2 leading-tight">
                  {selectedAch.title}
                </h3>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col gap-5 font-sans">
              {/* Winner and Mentor info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <Users size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Siswa Penerima</span>
                    <span className="text-slate-800 text-xs font-bold leading-relaxed block mt-0.5">
                      {getExtraInfo(selectedAch.id).winner}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <UserCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Guru Pembina</span>
                    <span className="text-slate-800 text-xs font-bold leading-relaxed block mt-0.5">
                      {getExtraInfo(selectedAch.id).coach}
                    </span>
                  </div>
                </div>
              </div>

              {/* Venue / Location Details row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={13} className="text-red-500 shrink-0" />
                  <span className="font-semibold text-slate-700">{getExtraInfo(selectedAch.id).location}</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={13} className="text-[#2563EB] shrink-0" />
                  <span className="font-semibold text-slate-700">{getExtraInfo(selectedAch.id).date}</span>
                </span>
              </div>

              {/* Main review / Event summary detail block */}
              <div>
                <p className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-1.5">Ulasan Kronologi Kejuaraan:</p>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                  {getExtraInfo(selectedAch.id).description}
                </p>
              </div>

              {/* Quote block inspired by achievement */}
              <div className="bg-amber-50/50 border-l-4 border-amber-400 p-4 rounded-r-2xl flex gap-3 items-start">
                <Quote size={20} className="text-amber-400 shrink-0 transform rotate-180" />
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Kutipan Juara</h5>
                  <p className="text-xs text-amber-950 font-medium italic leading-relaxed mt-0.5">
                    "{getExtraInfo(selectedAch.id).quote}"
                  </p>
                </div>
              </div>

              {/* Levels display badge */}
              <div className="flex justify-between items-center text-xs mt-2 pt-3 border-t border-slate-100">
                <span className="text-slate-400 font-semibold">Tingkat Kejuaraan:</span>
                <span className="font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full uppercase text-[10px]">
                  {selectedAch.level}
                </span>
              </div>

              {/* Footer controls Close button */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setSelectedAch(null)}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Tutup Tinjauan Prestasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
