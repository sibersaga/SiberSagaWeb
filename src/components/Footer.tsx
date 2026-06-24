/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GraduationCap, Mail, Phone, MapPin, Instagram, Youtube, Compass, ArrowUp, Send, Shield } from "lucide-react";
import SchoolLogo from "./SchoolLogo";

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
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

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs md:text-sm">
      {/* Upper footer Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Brief Identity & Contact */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <SchoolLogo size={40} />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-sm text-white">
                  SDN 3 PURWOSARI
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-500">
                  Kabupaten Wonogiri • Terakreditasi A
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Membentuk karakter berbudi luhur, unggul dalam prestasi akademis/non-akademis, kreatif, mandiri, serta berwawasan lingkungan.
            </p>

            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-tight">Purwosari, Kec. Wonogiri, Jawa Tengah 57615</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-amber-500 shrink-0" />
                <span>+62 (0273) 321-456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-amber-500 shrink-0" />
                <span>sdn3purwosari@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-heading font-extrabold text-[#F8FAFC] text-xs uppercase tracking-wider">
              Akses Cepat
            </h4>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs font-medium">
              <button onClick={() => handleScrollTo("hero")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">Beranda</button>
              <button onClick={() => handleScrollTo("sambutan")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">Profil</button>
              <button onClick={() => handleScrollTo("program")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">Akademik</button>
              <button onClick={() => handleScrollTo("prestasi")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">Prestasi</button>
              <button onClick={() => handleScrollTo("berita")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">Berita</button>
              <button onClick={() => handleScrollTo("layanan")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">Layanan</button>
              <button onClick={() => handleScrollTo("spmb")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">PPDB</button>
              <button onClick={() => handleScrollTo("download")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">Download</button>
              <button onClick={() => handleScrollTo("kontak")} className="text-left text-slate-400 hover:text-amber-400 transition-colors">Kontak</button>
            </div>
          </div>

          {/* Right Column: Medsos & NPSN Info */}
          <div className="md:col-span-3 lg:col-span-4 flex flex-col gap-4">
            <h4 className="font-heading font-extrabold text-[#F8FAFC] text-xs uppercase tracking-wider">
              Media Sosial & Info
            </h4>
            <div className="flex items-center gap-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-300 rounded-lg transition-colors" title="Instagram"><Instagram size={14} /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 rounded-lg transition-colors" title="YouTube"><Youtube size={14} /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 rounded-lg transition-colors" title="TikTok"><Compass size={14} /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 rounded-lg transition-colors" title="Facebook"><Send size={14} /></a>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              NPSN: 203112223 • Siswa: 312 • Status: Negeri
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="bg-slate-950 text-slate-500 text-[10px] py-4 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; 2026 SDN 3 Purwosari Wonogiri. Hak Cipta Dilindungi Undang-Undang.</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-850 hover:text-white rounded-lg transition-all text-[10px] text-slate-400 font-bold cursor-pointer"
              title="Akses Kontrol Admin"
            >
              <Shield size={10} className="text-blue-500 shrink-0" />
              Masuk Admin
            </button>
            <span className="text-slate-600">|</span>
            <span>SDN 3 Purwosari Digital</span>
            <button
              onClick={handleBackToTop}
              className="p-1.5 bg-slate-800 hover:bg-blue-600 text-amber-500 hover:text-white rounded transition-all cursor-pointer"
              title="Ke Atas"
            >
              <ArrowUp size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
