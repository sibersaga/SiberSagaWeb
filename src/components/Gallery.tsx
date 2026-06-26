/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Filter, Eye, X, ChevronLeft, ChevronRight, Image } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { GalleryPhoto } from "../types";

interface GalleryProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  gallery?: GalleryPhoto[];
}

export default function Gallery(props: GalleryProps) {
  const { gallery: globalGallery } = useAdmin();
  const gallery = props.gallery && props.gallery.length > 0 ? props.gallery : globalGallery;
  const [activeFilter, setActiveFilter] = useState<"all" | "fasilitas" | "kegiatan" | "siswa" | "guru">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = gallery.filter((photo) => {
    if (activeFilter === "all") return true;
    return photo.category === activeFilter;
  });

  const handleOpenLightbox = (photoId: string) => {
    const idx = filteredPhotos.findIndex((item) => item.id === photoId);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else if (lightboxIndex === 0) {
      setLightboxIndex(filteredPhotos.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < filteredPhotos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else if (lightboxIndex === filteredPhotos.length - 1) {
      setLightboxIndex(0);
    }
  };

  const currentLightboxPhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const categories = [
    { value: "all", label: "Semua Foto" },
    { value: "fasilitas", label: "Fasilitas" },
    { value: "kegiatan", label: "Kegiatan" },
    { value: "siswa", label: "Aktivitas Siswa" },
    { value: "guru", label: "Guru & Staff" },
  ];

  return (
    <section id="section-galeri" className="py-12 md:py-16 bg-[#F8FAFC] text-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {props.badge || "Jejak Visual"}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
            {props.title || "Galeri Kehidupan Sekolah"}
          </h2>
          <p className="text-[#64748B] font-normal mt-2 text-xs md:text-sm leading-relaxed">
            {props.subtitle || "Rangkuman memori visual kegiatan belajar mengajar, ekstrakurikuler, serta ragam fasilitas pendukung di lingkungan asri SDN 3 Purwosari."}
          </p>
          <div className="w-12 h-1.5 bg-[#2563EB] mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Toolbar Buttons menu */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value as any)}
              className={`px-4 py-2.5 rounded-[14px] text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                activeFilter === cat.value
                  ? "bg-[#2563EB] text-white border-transparent shadow-md shadow-blue-100"
                  : "bg-white text-[#64748B] border-slate-200/60 hover:text-[#2563EB] hover:border-[#2563EB]/40 hover:bg-[#2563EB]/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photo Grid Layout (Desktop 4 columns, Mobile 2 columns as restricted) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => handleOpenLightbox(photo.id)}
              className="group relative rounded-[24px] overflow-hidden aspect-square bg-[#1E293B] border border-slate-100 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              {/* On hover content layer overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-5 text-white flex flex-col justify-end transform translate-y-0 opacity-100 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-300">
                <span className="text-[9px] font-bold text-[#FBBF24] uppercase tracking-wider leading-none mb-1">
                  {photo.category}
                </span>
                <h4 className="font-heading font-extrabold text-xs sm:text-sm leading-tight text-white line-clamp-1">
                  {photo.title}
                </h4>
                <p className="text-[10px] text-slate-200 font-normal leading-snug line-clamp-2 mt-1 hidden sm:block">
                  {photo.description}
                </p>
                <div className="mt-2 text-[10px] font-bold text-blue-300 flex items-center gap-1">
                  <Eye size={12} strokeWidth={2.5} />
                  <span>Lihat Detail</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal display overlay full-screen */}
        {currentLightboxPhoto && lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Close indicator bar */}
            <div className="absolute top-4 right-4 z-55 flex items-center gap-4">
              <span className="text-white/60 text-xs tracking-wider">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                title="Tutup Galeri"
              >
                <X size={20} />
              </button>
            </div>

            {/* Left Prev Navigation btn */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-55 p-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
              title="Sebelumnya"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Central High resolution Display block with description footer metadata info */}
            <div
              className="max-w-4xl w-full flex flex-col items-center gap-4 relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] max-h-[65vh] w-full overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center">
                <img
                  src={currentLightboxPhoto.image}
                  alt={currentLightboxPhoto.title}
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & descriptive card underneath */}
              <div className="w-full text-center max-w-2xl px-4 text-white">
                <span className="text-amber-400 font-extrabold text-[10px] tracking-widest uppercase">
                  {currentLightboxPhoto.category}
                </span>
                <h3 className="font-heading font-bold text-base md:text-xl mt-1 text-white">
                  {currentLightboxPhoto.title}
                </h3>
                <p className="text-white/70 text-xs md:text-sm font-light leading-relaxed mt-2">
                  {currentLightboxPhoto.description}
                </p>
              </div>
            </div>

            {/* Right Next Navigation btn */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-55 p-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
              title="Selanjutnya"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
