/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, createContext, useContext, forwardRef } from "react";
import { HTMLMotionProps, MotionConfig, motion } from "motion/react";
import { ShieldCheck, ArrowRight, Layers, Sparkles } from "lucide-react";

// Inline helper for CSS class merging to prevent import errors
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

interface TextStaggerHoverProps {
  text: string;
  index: number;
}

interface HoverSliderImageProps {
  index: number;
  imageUrl: string;
}

interface HoverSliderProps {}

interface HoverSliderContextValue {
  activeSlide: number;
  changeSlide: (index: number) => void;
}

function splitText(text: string) {
  const words = text.split(" ").map((word) => word.concat(" "));
  const characters = words.map((word) => word.split("")).flat(1);
  return {
    words,
    characters,
  };
}

const HoverSliderContext = createContext<HoverSliderContextValue | undefined>(undefined);

function useHoverSliderContext() {
  const context = useContext(HoverSliderContext);
  if (context === undefined) {
    throw new Error("useHoverSliderContext must be used within a HoverSliderProvider");
  }
  return context;
}

export const HoverSlider = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & HoverSliderProps
>(({ children, className, ...props }, ref) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const changeSlide = useCallback(
    (index: number) => setActiveSlide(index),
    [setActiveSlide]
  );
  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </HoverSliderContext.Provider>
  );
});
HoverSlider.displayName = "HoverSlider";

export const TextStaggerHover = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & TextStaggerHoverProps
>(({ text, index, children, className, ...props }, ref) => {
  const { activeSlide, changeSlide } = useHoverSliderContext();
  const { characters } = splitText(text);
  const isActive = activeSlide === index;
  const handleMouse = () => changeSlide(index);
  
  return (
    <span
      className={cn(
        "relative inline-block origin-bottom overflow-hidden cursor-pointer w-full select-none",
        className
      )}
      {...props}
      ref={ref}
      onMouseEnter={handleMouse}
    >
      {characters.map((char, charIdx) => (
        <span
          key={`${char}-${charIdx}`}
          className="relative inline-block overflow-hidden"
        >
          <MotionConfig
            transition={{
              delay: charIdx * 0.015,
              duration: 0.25,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.span
              className="inline-block"
              style={{ display: "inline-block" }}
              initial={{ y: "0%" }}
              animate={isActive ? { y: "-110%", opacity: 0.15 } : { y: "0%", opacity: 0.5 }}
            >
              {char === " " ? <>&nbsp;</> : char}
            </motion.span>

            <motion.span
              className="absolute left-0 top-0 inline-block text-[#2563EB]"
              style={{ display: "inline-block" }}
              initial={{ y: "110%" }}
              animate={isActive ? { y: "0%" } : { y: "110%" }}
            >
              {char === " " ? <>&nbsp;</> : char}
            </motion.span>
          </MotionConfig>
        </span>
      ))}
    </span>
  );
});
TextStaggerHover.displayName = "TextStaggerHover";

export const clipPathVariants = {
  visible: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    scale: 1,
    opacity: 1,
  },
  hidden: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
    scale: 0.96,
    opacity: 0,
  },
};

export const HoverSliderImageWrap = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full rounded-2xl md:rounded-3xl shadow-lg border border-slate-200/60 bg-slate-100",
        className
      )}
      {...props}
    />
  );
});
HoverSliderImageWrap.displayName = "HoverSliderImageWrap";

export const HoverSliderImage = forwardRef<
  HTMLImageElement,
  HTMLMotionProps<"img"> & HoverSliderImageProps
>(({ index, imageUrl, children, className, ...props }, ref) => {
  const { activeSlide } = useHoverSliderContext();
  const isActive = activeSlide === index;
  
  return (
    <motion.img
      src={imageUrl}
      className={cn("inline-block align-middle object-cover w-full h-full select-none pointer-events-none", className)}
      transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.7 }}
      variants={clipPathVariants}
      animate={isActive ? "visible" : "hidden"}
      draggable={false}
      referrerPolicy="no-referrer"
      ref={ref}
      {...props}
    />
  );
});
HoverSliderImage.displayName = "HoverSliderImage";


export default function SchoolFacilities() {
  const facilities = [
    {
      name: "Ruang Kelas Pembelajaran",
      qty: "6 Unit",
      status: "Sangat Baik",
      desc: "Dilengkapi proyektor multimedia, kipas angin, poster edukasi interaktif, serta sirkulasi udara alami yang melimpah.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Perpustakaan Digital",
      qty: "1 Unit",
      status: "Sangat Baik",
      desc: "Koleksi ribuan buku fisik fiksi & referensi, lengkap dengan laptop pencarian OPAC digital siber.",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Lab Komputer & Multimedia",
      qty: "1 Unit",
      status: "Sangat Baik",
      desc: "Ruang full-AC berspesifikasi tinggi untuk menunjang kelancaran ujian nasional (ANBK) serta literasi coding anak.",
      image: "https://images.unsplash.com/photo-1562774053-455044249b61?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Ruang Kantor Kepala & Guru",
      qty: "1 Unit",
      status: "Sangat Baik",
      desc: "Pusat penyusunan modul Kurikulum Merdeka, administrasi guru, serta ruang konsultasi wali murid.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Mushola Ash-Sholihin",
      qty: "1 Unit",
      status: "Sangat Baik",
      desc: "Sarana ibadah berjamaah, pendidikan karakter, shalat dhuha teratur, serta bimbingan tahfidz Quran.",
      image: "https://images.unsplash.com/photo-1597935258735-e254c1839512?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Unit Kesehatan Sekolah (UKS)",
      qty: "1 Unit",
      status: "Sangat Baik",
      desc: "Pusat penanganan pertama murid sakit, dilengkapi ranjang medis, obat wajib, tinggi/berat badan, serta obat P3K.",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Halaman Bermain & Lapangan",
      qty: "1 Area",
      status: "Sangat Baik",
      desc: "Halaman hijau ekologis yang luas, sirkulasi upacara bendera senin, senam bersama, serta kompetisi olahraga futsal.",
      image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Kantin Sehat Organik",
      qty: "1 Unit",
      status: "Sangat Baik",
      desc: "Menyediakan asupan sehat bergizi higienis bebas pewarna buatan, mendukung kampanye bebas penimbunan plastik.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Sanitasi Kamar Mandi Bersih",
      qty: "4 Unit",
      status: "Sangat Baik",
      desc: "Terpisah rapi antara bilik laki-laki & perempuan, dilengkapi keran air mengalir deras bebas jentik nyamuk.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="section-fasilitas" className="py-10 md:py-14 bg-white text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
            Eksplorasi Sarana Prasarana
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
            Sarana & Prasarana Unggulan
          </h2>
          <p className="text-[#64748B] font-normal mt-2 text-xs md:text-sm leading-relaxed">
            Menyajikan visualisasi fisik sirkulasi ruang pendukung pembelajaran kondusif, berpusat pada kenyamanan tumbuh kembang belajar buah hati Anda.
          </p>
          <div className="w-12 h-1 bg-[#2563EB] mx-auto mt-3 rounded-full" />
        </div>

        {/* Core HoverSlider Implementation */}
        <HoverSlider className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Vertical Menu with Character Stagger Hover */}
          <div className="lg:col-span-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-4 bg-slate-50 border border-slate-100 rounded-xl p-3 select-none self-start">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <p className="text-[11px] md:text-xs text-[#64748B] font-bold uppercase tracking-wider">
                Arahkan kursor / Sentuh menu untuk merubah galeri
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {facilities.map((fac, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={cn(
                    "w-full transition-all duration-300 py-3.5 px-4 rounded-2xl flex items-center justify-between group",
                    activeIdx === idx
                      ? "bg-slate-50 border-l-4 border-[#2563EB]/80 pl-6 shadow-sm border-slate-200"
                      : "hover:bg-slate-50/50 pl-4 border-l-4 border-transparent"
                  )}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    {/* Character Flip Text */}
                    <TextStaggerHover
                      text={fac.name}
                      index={idx}
                      className={cn(
                        "text-sm md:text-base font-extrabold transition-colors leading-none font-heading",
                        activeIdx === idx ? "text-[#2563EB]" : "text-[#1E293B]"
                      )}
                    />
                    
                    {/* Simple details */}
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] md:text-[11px] text-slate-400 select-none">
                      <span className="font-extrabold bg-slate-200/60 text-slate-600 px-2.5 py-0.5 rounded-lg">
                        {fac.qty}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 font-extrabold text-emerald-600">
                        <ShieldCheck size={11} /> {fac.status}
                      </span>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className={cn(
                      "transition-all duration-300",
                      activeIdx === idx
                        ? "translate-x-1 text-[#2563EB] opacity-100"
                        : "opacity-0 group-hover:opacity-40"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hover Image Wrap Frame with Smooth Reveal & Info Detail */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="relative aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <HoverSliderImageWrap className="w-full h-full">
                {facilities.map((fac, idx) => (
                  <HoverSliderImage
                    key={idx}
                    index={idx}
                    imageUrl={fac.image}
                    className="w-full h-full object-cover"
                  />
                ))}
              </HoverSliderImageWrap>
              
              {/* Decorative label */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 select-none">
                <Sparkles size={11} className="text-[#FBBF24]" />
                <span>Dokumentasi Aktual</span>
              </div>
            </div>

            {/* Dynamic Active Facility Description Caption */}
            <div className="bg-slate-50 border border-slate-150 p-6 rounded-[24px] shadow-sm relative overflow-hidden flex flex-col transition-all duration-350 min-h-[120px]">
              <div className="absolute right-0 top-0 opacity-[0.03] scale-125 transform translate-x-4 -translate-y-4 text-blue-600 pointer-events-none">
                <Layers size={96} />
              </div>

              <div className="flex items-center gap-2 mb-2 select-none">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded">
                  Detail Sarana
                </span>
              </div>
              
              <h4 className="font-heading font-extrabold text-[#1E293B] text-sm md:text-base leading-tight">
                {facilities[activeIdx]?.name}
              </h4>
              
              <p className="text-xs text-slate-500 leading-relaxed font-normal mt-2">
                {facilities[activeIdx]?.desc}
              </p>
            </div>
          </div>

        </HoverSlider>

      </div>
    </section>
  );
}
