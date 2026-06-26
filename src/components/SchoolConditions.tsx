/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Users, User, Smile, Sparkles, TrendingUp } from "lucide-react";

interface SchoolConditionsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export default function SchoolConditions(props: SchoolConditionsProps) {
  const classStats = [
    { grade: "Kelas 1", total: 28, boys: 14, girls: 14, ratio: "50%", color: "from-blue-500 to-indigo-600" },
    { grade: "Kelas 2", total: 26, boys: 12, girls: 14, ratio: "46%", color: "from-purple-500 to-pink-600" },
    { grade: "Kelas 3", total: 29, boys: 15, girls: 14, ratio: "52%", color: "from-cyan-500 to-blue-600" },
    { grade: "Kelas 4", total: 27, boys: 13, girls: 14, ratio: "48%", color: "from-teal-500 to-emerald-600" },
    { grade: "Kelas 5", total: 30, boys: 16, girls: 14, ratio: "53%", color: "from-amber-500 to-orange-600" },
    { grade: "Kelas 6", total: 28, boys: 14, girls: 14, ratio: "50%", color: "from-emerald-500 to-green-600" },
  ];

  const totalStudents = classStats.reduce((sum, item) => sum + item.total, 0);
  const totalBoys = classStats.reduce((sum, item) => sum + item.boys, 0);
  const totalGirls = classStats.reduce((sum, item) => sum + item.girls, 0);

  return (
    <section id="section-kondisi" className="py-10 md:py-12 bg-[#F8FAFC] text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {props.badge || "Akuntabilitas Publik"}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
            {props.title || "Kondisi Siswa & Rombel"}
          </h2>
          <p className="text-[#64748B] font-normal mt-2 text-xs md:text-sm leading-relaxed">
            {props.subtitle || "Rincian data persebaran peserta didik berdasarkan kelas dan jenis kelamin tahun ajaran berjalan di SDN 3 Purwosari."}
          </p>
          <div className="w-12 h-1 bg-[#2563EB] mx-auto mt-3 rounded-full" />
        </div>

        {/* Dynamic Demographics Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white p-6 rounded-[28px] border border-slate-150 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div>
              <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block">Total Siswa Aktif</span>
              <span className="text-2xl md:text-3xl font-extrabold text-[#1E293B] mt-0.5 block">{totalStudents} Murid</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-slate-150 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50/70 text-blue-500 flex items-center justify-center shrink-0">
              <User size={24} />
            </div>
            <div>
              <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block">Siswa Laki-Laki (L)</span>
              <span className="text-2xl md:text-3xl font-extrabold text-[#1E293B] mt-0.5 block">{totalBoys} Anak</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-slate-150 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
              <Smile size={24} />
            </div>
            <div>
              <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block">Siswa Perempuan (P)</span>
              <span className="text-2xl md:text-3xl font-extrabold text-[#1E293B] mt-0.5 block">{totalGirls} Anak</span>
            </div>
          </div>

        </div>

        {/* Detailed Class distribution Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {classStats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-[24px] border border-slate-150 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100/30 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-[#1E293B] text-base md:text-lg">
                    {item.grade}
                  </span>
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full text-white bg-gradient-to-r ${item.color}`}>
                    {item.total} Siswa
                  </span>
                </div>

                <p className="text-xs text-[#64748B] font-normal leading-relaxed mt-2.5">
                  Proses belajar mengajar aktif menggunakan panduan Kurikulum Merdeka yang dirancang interaktif.
                </p>
              </div>

              {/* Gender Distribution Bar */}
              <div className="mt-6 relative z-10 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-[11px] text-slate-500 mb-2 font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>L: {item.boys} ({Math.round((item.boys/item.total)*100)}%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>P: {item.girls} ({Math.round((item.girls/item.total)*100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${(item.boys / item.total) * 100}%` }}
                  />
                  <div
                    className="bg-pink-500 h-full transition-all duration-500"
                    style={{ width: `${(item.girls / item.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Summary Accent Bento Box */}
        <div className="bg-gradient-to-r from-blue-600 via-[#1D4ED8] to-indigo-700 text-white p-8 rounded-[32px] shadow-lg shadow-indigo-100/50 mt-10 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150 pointer-events-none">
            <Users size={200} />
          </div>
          <div className="relative z-10 max-w-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest bg-white/20 border border-white/25 px-3 py-1 rounded-full">
                <Sparkles size={10} /> Rasio Murid Aktual
              </span>
              <h3 className="text-xl md:text-2xl font-heading font-extrabold mt-3 tracking-tight">
                Rata-rata Kuota Kelas yang Kondusif
              </h3>
              <p className="font-sans font-medium text-xs md:text-sm mt-1 leading-relaxed text-slate-100 opacity-95">
                SDN 3 Purwosari mempertahankan rasio kelas berkisar antara 26 s.d 30 murid per rombongan belajar. Hal ini dipertahankan demi menjaga fokus pembelajaran individu di kelas tetap maksimal dan interaktif.
              </p>
            </div>
            
            <div className="flex md:flex-col items-start gap-2 shrink-0 bg-white/10 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#FBBF24]" />
                <span className="text-sm font-extrabold">100% Kondusif</span>
              </div>
              <span className="text-[10px] text-slate-200">Sesuai aturan standar nasional pendidik</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
