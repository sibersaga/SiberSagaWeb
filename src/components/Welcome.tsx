/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Quote, 
  Eye, 
  Target, 
  Flag, 
  Compass, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  BookOpen, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge: string;
  title: string;
}

export default function Welcome() {
  const [activeTab, setActiveTab] = useState<string>("sambutan");

  const tabs: Tab[] = [
    {
      id: "sambutan",
      label: "Sambutan Kepala Sekolah",
      icon: <Quote size={15} strokeWidth={2.5} />,
      badge: "Profil Kepemimpinan",
      title: "Mendidik dengan Hati, Merajut Prestasi",
    },
    {
      id: "visi",
      label: "Visi Sekolah",
      icon: <Eye size={15} strokeWidth={2.5} />,
      badge: "Orientasi Masa Depan",
      title: "Uraian Visi Kelembagaan",
    },
    {
      id: "misi",
      label: "Misi Sekolah",
      icon: <Target size={15} strokeWidth={2.5} />,
      badge: "Langkah Strategis",
      title: "Uraian Mandat Kelembagaan",
    },
    {
      id: "tujuan",
      label: "Tujuan Sekolah",
      icon: <Flag size={15} strokeWidth={2.5} />,
      badge: "Pencapaian Institusi",
      title: "Target Kualitas Hasil Belajar",
    },
  ];

  return (
    <section id="section-sambutan" className="py-10 md:py-14 bg-white text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 bg-brand-sky/10 text-brand-sky px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Eksplorasi Profil Sekolah
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy mt-4 tracking-tight">
            Sambutan, Visi, Misi & Tujuan
          </h2>
          <p className="text-[#64748B] font-normal mt-2 text-xs md:text-sm leading-relaxed">
            Mengenal lebih dekat arah fundamental pendidikan dasar, kepemimpinan, dan komitmen pelayanan mutu di lingkungan SDN 3 Purwosari.
          </p>
          <div className="w-12 h-1 bg-brand-sky mx-auto mt-3 rounded-full" />
        </div>

        {/* Custom Tab Triggers Wrapper */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const shortLabel = tab.id === "sambutan" ? "Sambutan" : tab.id === "visi" ? "Visi" : tab.id === "misi" ? "Misi" : "Tujuan";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer border select-none ${
                  isActive
                    ? "bg-white text-brand-sky border-slate-200 shadow-sm font-extrabold"
                    : "bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100"
                }`}
              >
                <span className={isActive ? "text-brand-sky" : "text-slate-400"}>
                  {tab.icon}
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Content Display */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-8 shadow-md relative overflow-hidden min-h-[400px]">
          
          <AnimatePresence mode="wait">
            {activeTab === "sambutan" && (
              <motion.div
                key="sambutan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start"
              >
                {/* Photo Frame Column */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative group max-w-sm w-full">
                    {/* Glowing Accents */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#2563EB] to-[#FBBF24] rounded-[28px] opacity-25 blur-md transition-all duration-300 group-hover:opacity-40 group-hover:blur-lg" />
                    <div className="absolute inset-0 bg-slate-900 rounded-[28px] transform translate-x-3 translate-y-3 z-0 shadow" />

                    {/* Photo Box */}
                    <div className="relative z-10 bg-white p-3 rounded-[28px] shadow-lg overflow-hidden aspect-[4/5] flex items-center justify-center border border-slate-150">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500"
                        alt="Kepala Sekolah SDN 3 Purwosari Wonogiri"
                        className="w-full h-full object-cover rounded-2xl grayscale-[15%] group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-md text-white p-4.5 rounded-2xl border border-white/10 shadow-lg select-none">
                        <span className="text-[9px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md font-extrabold uppercase tracking-wide block w-fit mb-1.5">
                          Kepala Sekolah
                        </span>
                        <h4 className="font-heading font-extrabold text-sm md:text-base leading-tight text-[#FBBF24]">
                          Kiswanto, S.Pd., M.Pd.
                        </h4>
                        <p className="text-[10px] text-slate-300 font-medium font-sans mt-0.5">
                          NIP. 19741205 199903 1 002
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Message Column */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Profil Kepemimpinan
                    </span>
                  </div>

                  <div className="text-[#2563EB] opacity-15 self-start">
                    <Quote size={44} strokeWidth={3} />
                  </div>

                  <h3 className="text-xl md:text-2xl font-heading font-extrabold text-[#1E293B] leading-snug tracking-tight">
                    &ldquo;Mendidik dengan Hati, Mengantarkan Anak Didik Menjadi Generasi Emas yang Berbudi Luhur dan Unggul&rdquo;
                  </h3>

                  <div className="space-y-4 text-[#64748B] text-xs md:text-sm leading-relaxed font-normal">
                    <p>
                      Assalamu&apos;alaikum Warahmatullahi Wabarakatuh,<br />
                      Salam Sejahtera bagi kita semua, Shalom, Om Swastyastu, Namo Buddhaya, Salam Kebajikan.
                    </p>
                    <p>
                      Puji syukur kehadirat Tuhan Yang Maha Esa atas limpahan rahmat-Nya sehingga kita dapat meluncurkan portal informasi resmi SDN 3 Purwosari Wonogiri. Selamat datang, sebuah kebanggaan bagi kami dapat bersinergi secara transparan demi memajukan mutu pendidikan dasar putra-putri tercinta.
                    </p>
                    <p>
                      Pendidikan tingkat dasar merupakan fondasi paling kritis dalam membentuk karakter anak. Kami meyakini, keunggulan akademis harus diimbangi oleh <strong className="text-[#2563EB] font-bold">budi pekerti yang agung</strong>, <strong className="text-amber-600 bg-amber-50 px-1 rounded font-bold">fondasi religi yang kokoh</strong>, serta kesadaran peduli kelestarian lingkungan hidup ekologis.
                    </p>
                    <p>
                      Bersama 12 pendidik dan staf yang berdedikasi tinggi, kami berkomitmen menghadirkan lingkungan belajar yang aman, ramah anak, dan responsif terhadap tuntutan zaman. Terima kasih atas kepercayaan bapak/ibu wali murid sekalian. Mari bersama-sama mencetak calon pemimpin bangsa yang andal, kreatif, dan mandiri.
                    </p>
                    <p className="font-extrabold text-[#1E293B]">
                      Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "visi" && (
              <motion.div
                key="visi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center"
              >
                {/* Visual Icon Art Column */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-3xl border border-slate-150">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 border border-blue-100 shadow-sm animate-pulse">
                    <Compass size={32} />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                    Arah Kebijakan
                  </span>
                  <h4 className="text-xs text-slate-400 font-bold max-w-xs uppercase tracking-wider leading-relaxed">
                    Visi ini merupakan landasan operasional pembelajaran terstruktur jangka panjang di SDN 3 Purwosari.
                  </h4>
                </div>

                {/* Visi Content Column */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Visi Sekolah
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1E293B] leading-snug tracking-tight">
                    &ldquo;Terwujudnya Peserta Didik yang Berakhlak Mulia, Unggul dalam Prestasi, Kreatif, Mandiri, dan Berwawasan Lingkungan&rdquo;
                  </h3>

                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal">
                    Melalui visi ini, SDN 3 Purwosari tidak hanya menuntut ketajaman prestasi kognitif, melainkan mengawal pembentukan pembiasaan akhlak mulia dan kecintaan murid terhadap konservasi alam demi keberlangsungan masa depan yang lestari.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Heart size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-heading font-extrabold text-slate-800 block">Akhlak Mulia</span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Sopan, religius, beradat ketimuran</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                        <Award size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-heading font-extrabold text-slate-800 block">Unggul Prestasi</span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Kompetitif akademis & non-akademis</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-heading font-extrabold text-slate-800 block">Kreatif & Mandiri</span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Mampu bernalar kritis & mencari solusi</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-heading font-extrabold text-slate-800 block font-heading">Eco-Friendly</span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Peduli kelestarian alam & kebersihan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "misi" && (
              <motion.div
                key="misi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12"
              >
                {/* Misi List Column */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Misi Sekolah
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-heading font-extrabold text-[#1E293B] tracking-tight">
                    Langkah Nyata Pelayanan Mutu
                  </h3>

                  <div className="flex flex-col gap-2.5 mt-2">
                    {[
                      "Menanamkan keimanan dan ketakwaan melalui pengamalan nilai-nilai keagamaan dan pembiasaan akhlak mulia sejak dini.",
                      "Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan (PAIKEM) berbasis teknologi informasi.",
                      "Mengembangkan potensi, bakat, dan minat siswa secara optimal melalui bimbingan kepribadian dan ekstrakurikuler komprehensif.",
                      "Mendorong kemandirian belajar siswa melalui pembelajaran bermakna (meaningful learning) dan berbasis proyek (P5).",
                      "Menumbuhkan kesadaran dan kepedulian lingkungan hidup melalui program sekolah hijau (eco-school) dan kebersihan sirkular."
                    ].map((misiText, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/55 border border-slate-150 hover:bg-slate-50 transition-all duration-250 group cursor-default"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 font-extrabold text-xs group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-250 font-sans">
                          {idx + 1}
                        </div>
                        <p className="text-xs md:text-sm text-[#475569] leading-relaxed font-normal">
                          {misiText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Column */}
                <div className="lg:col-span-5 flex flex-col gap-4 justify-center">
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-[28px] border border-slate-800 shadow relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-[0.04] scale-125 transform translate-x-6 translate-y-6 text-white pointer-events-none">
                      <Zap size={144} />
                    </div>
                    
                    <span className="text-[8px] bg-indigo-500/25 border border-indigo-400/30 text-indigo-200 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest inline-flex items-center gap-1">
                      <Sparkles size={9} /> Evaluasi Mutu Berkala
                    </span>
                    
                    <h4 className="text-base font-heading font-extrabold mt-3 tracking-tight">
                      Komitmen Bersama
                    </h4>
                    
                    <p className="text-[11px] text-slate-300 font-normal leading-relaxed mt-1.5">
                      Setiap poin misi di atas selalu dievaluasi per semester bersama Komite Sekolah dan Pengawas TK/SD Purwosari Wonogiri guna menjaga relevansi mutu dan kepatuhan akademis secara sinergis.
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-indigo-300 font-extrabold">
                      <span>• Standar Nasional Pendidikan</span>
                      <span>• Terakreditasi Unggul</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "tujuan" && (
              <motion.div
                key="tujuan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center"
              >
                {/* Info Column */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-150">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-4">
                      <BookOpen size={20} />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded uppercase tracking-wider block w-fit">
                      Target Kompetensi Kelulusan
                    </span>
                    <h4 className="font-heading font-extrabold text-[#1E293B] mt-2.5 text-base tracking-tight leading-tight">
                      Membentuk Output Lulusan yang Siap, Berkarakter, dan Adaptif
                    </h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-1.5 leading-relaxed">
                      Lulusan SDN 3 Purwosari dibekali keterampilan berpikir logis berbasis numerasi serta diimbangi karakter ketuhanan untuk melanjutkan ke jenjang SMP favorit.
                    </p>
                  </div>
                </div>

                {/* Goals Grid Column */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Tujuan Sekolah
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-heading font-extrabold text-[#1E293B] tracking-tight">
                    Sasaran Strategis Jangka Menengah
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    {[
                      { icon: <CheckCircle2 size={16} className="text-blue-600" />, title: "Akhlak Luhur", desc: "Mempersiapkan lulusan taat ibadah, jujur, santun, dan toleran." },
                      { icon: <CheckCircle2 size={16} className="text-blue-600" />, title: "Kelulusan 100%", desc: "Mencapai tingkat kelulusan paripurna dengan rata-rata nilai naik." },
                      { icon: <CheckCircle2 size={16} className="text-blue-600" />, title: "Tim Kompetitif", desc: "Memiliki delegasi andalan dalam bidang olahraga, seni, & sains." },
                      { icon: <CheckCircle2 size={16} className="text-blue-600" />, title: "Infrastruktur IT", desc: "Menyediakan sarana belajar ramah anak, nyaman dan berbasis digital." }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/50 p-4 rounded-2xl border border-slate-150 flex items-start gap-3 hover:border-slate-300 transition duration-200"
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <span className="text-xs font-heading font-extrabold text-slate-800 block">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-[#64748B] leading-normal block mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
