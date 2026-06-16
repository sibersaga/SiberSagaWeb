/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Volume2 } from "lucide-react";

const announcements = [
  "📢 Pendaftaran Peserta Didik Baru (PPDB) SDN 3 Purwosari Tahun Ajaran 2026/2027 Resmi Dibuka secara Online!",
  "🏆 SDN 3 Purwosari Wonogiri Sukses Meraih Predikat Akreditasi 'A' (Unggul) dari BAN-PDM Jawa Tengah!",
  "📅 Agenda Imunisasi BIAS berkala dari Puskesmas Wonogiri II berjalan dengan tertib dan lancar.",
  "🌟 Selamat atas prestasi luar biasa delegasi siswa SDN 3 Purwosari meraih Juara 1 LCC Umum Tingkat Kecamatan!",
  "⚡ Bagi calon pendaftar PPDB, berkas fisik dapat diserahkan ke ruang sekretariat panitia pada hari kerja.",
];

export default function AnnouncementsTicker() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/50 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] py-2.5 px-4 md:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Modern Announcements Ticker / Marquee */}
        <div className="relative overflow-hidden bg-orange-500 border border-orange-600 rounded-[14px] flex items-center shadow-inner flex-grow">
          <div className="z-10 bg-brand-navy text-white uppercase font-extrabold text-[9px] md:text-[10px] tracking-wider px-3.5 py-2.5 flex items-center gap-1.5 shrink-0 rounded-l-[13px] shadow-[3px_0_10px_rgba(15,23,42,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
            <span className="whitespace-nowrap flex items-center gap-1">
              <Volume2 size={12} className="inline md:hidden" />
              <span>Pengumuman Penting</span>
            </span>
          </div>
          <div className="w-full overflow-hidden flex items-center py-2 bg-orange-500 relative">
            <style>{`
              @keyframes news-marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-news-marquee {
                display: flex;
                width: max-content;
                animation: news-marquee 32s linear infinite;
              }
              .animate-news-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="animate-news-marquee whitespace-nowrap flex items-center">
              {/* Block 1 */}
              <div className="flex items-center gap-12 pr-12 shrink-0">
                {announcements.map((anno, idx) => (
                  <span key={`1-${idx}`} className="inline-flex items-center gap-2 text-xs md:text-sm text-white font-bold hover:text-white/80 transition-colors select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-navy"></span>
                    <span>{anno}</span>
                  </span>
                ))}
              </div>
              {/* Block 2 (duplicate to allow seamless loop) */}
              <div className="flex items-center gap-12 pr-12 shrink-0">
                {announcements.map((anno, idx) => (
                  <span key={`2-${idx}`} className="inline-flex items-center gap-2 text-xs md:text-sm text-white font-bold hover:text-white/80 transition-colors select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-navy"></span>
                    <span>{anno}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Close button for clean UX */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition cursor-pointer"
          title="Tutup pengumuman"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

