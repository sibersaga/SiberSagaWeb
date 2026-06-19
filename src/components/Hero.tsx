/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowRight, BookOpen, UserCheck, ShieldCheck } from "lucide-react";
import { SplineScene } from "./SplineScene";
import { useAdmin } from "../context/AdminContext";

export default function Hero() {
  const { siteContent } = useAdmin();
  const hero = siteContent.hero;

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
    <section id="section-hero" className="bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Bento Hero Container */}
        <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 relative p-8 md:p-12 lg:p-14 flex flex-col lg:flex-row gap-8 items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-sky/5 to-transparent pointer-events-none"></div>
          
          {/* Left Content Area */}
          <div className="flex-1 min-w-0 z-10">
            <span className="inline-flex items-center gap-1.5 bg-brand-sky/10 text-brand-sky px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-5">
              <BookOpen size={13} />
              {hero.badge}
            </span>
            <span className="block text-[#64748B] font-bold text-[11px] uppercase tracking-[0.2em] mb-2 pl-0.5">
              {hero.schoolName}
            </span>
            <h1 className="text-brand-navy text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5">
              {hero.titlePrimary} <span className="text-brand-sky">{hero.titleSecondary.split(",")[0]}</span>,<br />
              {hero.titleSecondary.includes(",") ? hero.titleSecondary.split(",").slice(1).join(",").trim() : hero.titleSecondary}
            </h1>
            <p className="text-[#64748B] text-sm md:text-base leading-relaxed max-w-xl mb-8 font-normal">
              {hero.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleScrollTo("spmb")}
                className="bg-brand-sky hover:bg-brand-sky/95 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-brand-sky/20 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer opacity-100"
              >
                {hero.primaryButton}
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => handleScrollTo("sambutan")}
                className="border-2 border-brand-light text-brand-navy hover:bg-brand-light px-8 py-3.5 rounded-2xl font-bold text-sm bg-white transition-all transform active:scale-95 cursor-pointer"
              >
                {hero.secondaryButton}
              </button>
            </div>
          </div>

          {/* Right Bento Visual Graphic with interactive 3D Spline scene */}
          <div className="w-full lg:w-[440px] xl:w-[500px] shrink-0 z-10">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-brand-light border border-slate-100 shadow-md">
              <SplineScene
                scene="https://prod.spline.design/6Wq1Q7YGyMvjNabt/scene.splinecode"
                className="w-full h-full min-h-[300px]"
                errorFallback={
                  <div className="relative w-full h-full min-h-[300px]">
                    <img
                      src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000"
                      alt="SDN 3 Purwosari Wonogiri Gedung Sekolah"
                      alt={hero.imageAlt}
                      className="w-full h-full object-cover rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent pointer-events-none rounded-2xl" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="text-[9px] font-bold text-[#FBBF24] uppercase tracking-wider">{hero.fallbackBadge}</span>
                      <h3 className="font-bold text-sm md:text-base mt-0.5">{hero.fallbackTitle}</h3>
                    </div>
                  </div>
                }
              />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-slate-200/50 px-2.5 py-1 rounded-full text-[9px] font-extrabold text-brand-sky shadow-sm flex items-center gap-1 select-none pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse"></span>
                <span>{hero.fallbackSubtitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small sub bento belief cards underneath */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white border border-slate-100 shadow-md p-6 rounded-[24px] flex items-start gap-4 hover:shadow-lg transition">
            <div className="text-brand-sky bg-brand-sky/10 p-3 rounded-2xl shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-navy">{hero.cards[0].title}</h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{hero.cards[0].description}</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 shadow-md p-6 rounded-[24px] flex items-start gap-4 hover:shadow-lg transition">
            <div className="text-emerald-500 bg-emerald-50 p-3 rounded-2xl shrink-0">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-navy">{hero.cards[1].title}</h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{hero.cards[1].description}</p>
            </div>
          </div>

          <div className="bg-[#FBBF24] shadow-md shadow-yellow-101/50 p-6 rounded-[24px] flex items-start gap-4">
            <div className="text-[#1E293B] bg-white/40 p-3 rounded-2xl shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E293B]">{hero.cards[2].title}</h3>
              <p className="text-xs text-[#1E293B]/80 mt-1.5 leading-relaxed">{hero.cards[2].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
