/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Calendar, User, X, Clock, ArrowRight } from "lucide-react";
import { NewsItem } from "../types";
import { useAdmin } from "../context/AdminContext";

export default function News() {
  const { news } = useAdmin();
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  return (
    <section id="section-berita" className="py-12 md:py-16 bg-brand-light text-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 bg-brand-sky/10 text-brand-sky px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Portal Warta
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mt-4 tracking-tight">
            Berita & Informasi Terbaru
          </h2>
          <p className="text-[#64748B] font-normal mt-3 text-sm md:text-base leading-relaxed">
            Ikuti kabar terkini seputar prestasi, agenda kegiatan, pengumuman, serta petualangan seru siswa SDN 3 Purwosari.
          </p>
          <div className="w-12 h-1.5 bg-brand-sky mx-auto mt-4 rounded-full" />
        </div>

        {/* 6 Grid Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {news.map((news) => (
            <article
              key={news.id}
              onClick={() => setSelectedArticle(news)}
              className="group bg-white rounded-[24px] shadow-md hover:shadow-xl hover:border-slate-200/80 border border-slate-100 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full"
            >
              {/* Image with Category floating label */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-[#1E293B]/90 backdrop-blur-md text-[#FBBF24] font-bold text-[9px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md border border-white/10">
                  {news.category}
                </span>
              </div>

              {/* Core Text Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Meta details */}
                <div className="flex items-center gap-4 text-[#64748B] text-xs mb-3 font-normal">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} strokeWidth={2} />
                    {news.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={13} strokeWidth={2} />
                    {news.author}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-extrabold text-base md:text-lg text-[#1E293B] leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2">
                  {news.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[#64748B] text-xs md:text-sm mt-3 leading-relaxed font-normal line-clamp-3">
                  {news.excerpt}
                </p>

                {/* Bottom Trigger button */}
                <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-[#2563EB] font-bold">
                  <span>Selengkapnya</span>
                  <div className="flex items-center justify-center p-1.5 bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white rounded-lg transition-all">
                    <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Detailed Modal Overlay for Reading Articles */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col transform transition-all animate-[slideIn_0.3s_ease-out]"
              role="dialog"
              aria-modal="true"
            >
              {/* Header Image inside Modal */}
              <div className="relative aspect-[16/9] w-full bg-slate-150">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-900/75 hover:bg-slate-900 text-white rounded-full shadow-lg transition-all"
                  title="Tutup Berita"
                >
                  <X size={18} />
                </button>
                <span className="absolute bottom-4 left-4 bg-blue-600 text-white font-bold text-xs uppercase px-3.5 py-1.5 rounded-lg shadow-md">
                  {selectedArticle.category}
                </span>
              </div>

              {/* Text Articles content body inside Modal */}
              <div className="p-6 md:p-8 flex flex-col gap-4">
                <div className="flex items-center gap-5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {selectedArticle.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={13} />
                    {selectedArticle.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    Baca 3 Menit
                  </span>
                </div>

                <h1 className="font-heading font-extrabold text-xl md:text-2xl text-blue-950 leading-snug">
                  {selectedArticle.title}
                </h1>

                <div className="w-12 h-1 bg-blue-600 rounded-full" />

                <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed font-light pt-2">
                  {selectedArticle.content.split("\n\n").map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Footer Modal Action close */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-all cursor-pointer"
                  >
                    Tutup Artikel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
