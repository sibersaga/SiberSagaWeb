/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Download, 
  FileText, 
  CheckCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  FileIcon, 
  Clock, 
  Eye, 
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { DownloadFile } from "../types";

const SQRT_5000 = Math.sqrt(5000);

// Helper inline class negotiator
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

// Helper to resolve icon based on file type
const getFileIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("pdf")) return <FileText className="w-8 h-10 text-rose-500" />;
  if (t.includes("xls") || t.includes("xlsx") || t.includes("excel") || t.includes("csv")) {
    return <FileSpreadsheet className="w-8 h-10 text-emerald-500" />;
  }
  return <FileIcon className="w-8 h-10 text-blue-500" />;
};

interface DocumentCardProps {
  position: number;
  file: DownloadFile;
  handleMove: (steps: number) => void;
  cardSize: number;
  handleDownload: (id: string, title: string) => void;
  downloadingId: string | null;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  position,
  file,
  handleMove,
  cardSize,
  handleDownload,
  downloadingId,
}) => {
  const isCenter = position === 0;
  const isLeft = position < 0;
  const isRight = position > 0;

  // Render file extension beautifully
  const fileExt = file.type.toUpperCase();

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border p-6 flex flex-col justify-between transition-all duration-500 ease-out select-none",
        isCenter
          ? "z-30 bg-white text-slate-800 border-blue-500 scale-100 shadow-[0_25px_50px_-12px_rgba(59,130,246,0.15)] ring-4 ring-blue-500/10"
          : "z-10 bg-slate-50 text-slate-500 border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300 scale-90"
      )}
      style={{
        width: cardSize,
        height: cardSize * 1.12, // slightly taller for folders
        clipPath: `polygon(35px 0%, calc(100% - 35px) 0%, 100% 35px, 100% 100%, calc(100% - 35px) 100%, 35px 100%, 0% 100%, 0% 0%)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.55) * position}px)
          translateY(${isCenter ? -35 : position % 2 ? 10 : -10}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        transition: "all 500ms cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {/* Clip path border accent */}
      <span
        className={cn(
          "absolute block origin-top-right rotate-45 transition-colors",
          isCenter ? "bg-blue-500" : "bg-slate-200"
        )}
        style={{
          right: -2,
          top: 33,
          width: SQRT_5000,
          height: 2,
        }}
      />

      {/* Modern Folder Top Tab Header */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-2xl border transition-all duration-300 shadow-sm",
            isCenter 
              ? "bg-blue-50 border-blue-100 text-blue-600 scale-110" 
              : "bg-slate-100 border-slate-200 text-slate-400"
          )}>
            {getFileIcon(file.type)}
          </div>
          <div>
            <span className={cn(
              "text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full",
              isCenter ? "bg-rose-50 text-rose-600" : "bg-slate-200 text-slate-505"
            )}>
              {fileExt}
            </span>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold tracking-tight">
              {file.size}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        {isCenter && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        )}
      </div>

      {/* Middle: Document Title block */}
      <div className="my-3 flex-grow flex flex-col justify-center">
        <h3 className={cn(
          "font-heading font-extrabold tracking-tight leading-snug break-words selection:bg-blue-100",
          isCenter 
            ? "text-slate-800 text-lg md:text-xl md:line-clamp-3 line-clamp-3" 
            : "text-slate-500 text-sm line-clamp-2"
        )}>
          {file.title}
        </h3>
        {isCenter && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
            <Clock size={12} className="text-slate-300" />
            <span>Berlaku Resmi &amp; Update Terbaru</span>
          </div>
        )}
      </div>

      {/* Bottom status & download triggers */}
      <div className={cn(
        "pt-4 border-t flex flex-col gap-3 transition-colors",
        isCenter ? "border-slate-100" : "border-slate-200/50"
      )}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Diunduh <strong className={cn(
              "font-extrabold",
              isCenter ? "text-slate-800" : "text-slate-500"
            )}>{file.downloads}</strong> kali
          </span>
          {!isCenter && (
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              Fokus <ArrowRight size={10} />
            </span>
          )}
        </div>

        {isCenter && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(file.id, file.title);
            }}
            disabled={downloadingId !== null}
            className={cn(
              "w-full py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer select-none",
              downloadingId === file.id
                ? "bg-slate-100 text-slate-400 border border-slate-200 shadow-inner"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:scale-[1.02] active:scale-98"
            )}
          >
            {downloadingId === file.id ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-slate-400 rounded-full animate-spin" />
                <span>Menghubungkan Server...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Unduh Berkas Sekarang</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default function Downloads() {
  const { downloads, setDownloads } = useAdmin();
  const [cardSize, setCardSize] = useState(365);
  const [filesList, setFilesList] = useState<DownloadFile[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync downloads list from Admin Context without violating rotation state order
  useEffect(() => {
    if (downloads && downloads.length > 0) {
      setFilesList((prev) => {
        if (prev.length === 0 || prev.length !== downloads.length) {
          return [...downloads];
        }
        // Sync stats counts while preserving local shifted rotation
        return prev.map(localFile => {
          const masterFile = downloads.find(d => d.id === localFile.id);
          return masterFile ? { ...localFile, downloads: masterFile.downloads } : localFile;
        });
      });
    }
  }, [downloads]);

  const handleDownload = (id: string, title: string) => {
    if (downloadingId) return;
    setDownloadingId(id);

    // Simulate safe server extraction with gorgeous interactive feedback
    setTimeout(() => {
      // Modify download counts state
      setDownloads(
        downloads.map((file) =>
          file.id === id ? { ...file, downloads: file.downloads + 1 } : file
        )
      );
      setDownloadingId(null);
      setSuccessToast(title);
    }, 1200);
  };

  // Carousel shifting rotation engine
  const handleMove = (steps: number) => {
    const newList = [...filesList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push(item);
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift(item);
      }
    }
    setFilesList(newList);
  };

  // Auto-hide toast notifications safely
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => {
        setSuccessToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Handle responsive viewport size alterations
  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section id="section-download" className="py-16 md:py-24 bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] text-slate-800 scroll-mt-20 overflow-hidden relative">
      {/* Tech decorative background particles */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-blue-500/10 shadow-sm animate-pulse">
            <Layers size={11} className="text-blue-500 shrink-0" />
            Akses Berkas Digital
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#1E293B] mt-5 tracking-tightest leading-tight">
            Pusat Unduhan SDN 3
          </h2>
          <p className="text-[#64748B] font-normal mt-4 text-sm md:text-base leading-relaxed">
            Dapatkan administrasi resmi, modul kurikulum, syarat PPDB, serta formulir SDN 3 Purwosari Wonogiri secara praktis. Tunjuk berkas untuk mengunduh.
          </p>
          <div className="w-16 h-1.5 bg-blue-600 mx-auto mt-5 rounded-full" />
        </div>

        {/* Carousel Outer Containment Stage Selector */}
        {filesList.length > 0 ? (
          <div className="relative w-full flex flex-col items-center">
            {/* Visual focus shadow background layer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />

            {/* Stage wrapper for absolute card renders */}
            <div
              className="relative w-full z-10 flex items-center justify-center"
              style={{ height: cardSize * 1.35 }}
            >
              {filesList.map((file, index) => {
                const position = filesList.length % 2
                  ? index - (filesList.length - 1) / 2
                  : index - Math.floor(filesList.length / 2);

                // Hide cards that are way too far to maintain readable layout
                if (Math.abs(position) > 2) return null;

                return (
                  <DocumentCard
                    key={file.id}
                    file={file}
                    handleMove={handleMove}
                    position={position}
                    cardSize={cardSize}
                    handleDownload={handleDownload}
                    downloadingId={downloadingId}
                  />
                );
              })}
            </div>

            {/* Slider Navigation controllers */}
            <div className="mt-4 flex flex-col items-center gap-4 z-20">
              {/* Guidance Tips */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
                <Sparkles size={12} className="text-blue-500 animate-spin-slow" />
                <span>Geser atau klik dokumen di samping untuk fokus</span>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleMove(-1)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl bg-white border border-slate-200/80 hover:border-blue-400 text-slate-700 hover:text-blue-600 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer select-none"
                  aria-label="Previous file"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {/* Micro pagination dots selector */}
                <div className="flex items-center gap-1.5 px-3 bg-white/50 border border-slate-200/50 rounded-2xl">
                  {filesList.map((_, i) => (
                    <span 
                      key={i} 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === Math.floor(filesList.length / 2) 
                          ? "w-4 bg-blue-600" 
                          : "w-1.5 bg-slate-200"
                      )} 
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleMove(1)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl bg-white border border-slate-200/80 hover:border-blue-400 text-slate-700 hover:text-blue-600 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer select-none"
                  aria-label="Next file"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto">
            <FileIcon className="mx-auto text-slate-350 w-12 h-12 mb-3" />
            <p className="text-slate-500 font-semibold text-sm">Belum ada berkas unduhan yang terdaftar.</p>
            <p className="text-slate-400 text-xs mt-1">Gunakan panel admin untuk menambahkan berkas baru.</p>
          </div>
        )}
      </div>

      {/* Success Download Notification Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] text-white px-5 py-4 rounded-[20px] shadow-2xl border border-white/10 flex items-center gap-3 animate-slide-up max-w-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle size={18} />
          </div>
          <div className="flex-grow">
            <p className="text-xs font-bold text-white leading-none">Unduhan Berhasil!</p>
            <p className="text-[10px] text-slate-300 font-normal leading-tight mt-1 line-clamp-1">
              {successToast} sedang diunduh.
            </p>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
