/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Sangat bersyukur mempercayakan pendidikan putra-putri kami belajar di SDN 3 Purwosari. Pendekatan pembelajarannya menyenangkan, membimbing spiritual dengan program tahfidz Juz 30 dan shalat dhuha.",
    name: "Sri Wahyuni",
    role: "Wali Murid Kelas 3",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
  },
  {
    text: "Ekstrakurikuler di SDN 3 Purwosari sangat variatif dan mendidik. Anak saya senang sekali ikut ekstra rebana, bakat seni dan ritme ketukannya tumbuh percaya diri tinggi.",
    name: "Bambang Susanto",
    role: "Wali Murid Kelas 5",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    text: "Fasilitas penunjang laptop dan lab komputer sangat membantu anak-anak siap menghadapi masa depan digital secara sehat, bertanggung jawab, penuh kegembiraan.",
    name: "Dewi Lestari",
    role: "Wali Murid Kelas 6",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  },
  {
    text: "Bimbingan kepramukaan yang solid menanamkan jiwa mandiri, disiplin, peduli lingkungan, serta empati sosial luhur pada anak harian sejalan Kurikulum Merdeka.",
    name: "Heru Prasetyo",
    role: "Wali Murid Kelas 4",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  },
  {
    text: "Komitmen lingkungan nihil perundungan dan toleransi di SDN 3 Purwosari benar-benar nyata. Anak kami berangkat sekolah gembira, pulang dengan sopan santun mulia.",
    name: "Siti Rahmawati",
    role: "Wali Murid Kelas 2",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
  },
  {
    text: "Koordinasi guru lintas kelas dengan wali murid lewat paguyuban sangat interaktif dan responsif, meringankan kekhawatiran orang tua terkait perkembangan akademik anak.",
    name: "Agus Salim",
    role: "Wali Murid Kelas 1",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 select-none"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-6 md:p-8 rounded-[24px] border border-slate-100 bg-white shadow-lg shadow-slate-100/70 max-w-sm w-full hover:-translate-y-1 hover:shadow-xl hover:border-slate-200/80 transition-all duration-300"
                  key={i}
                >
                  <div className="text-slate-600 text-xs md:text-sm leading-relaxed font-normal italic">
                    "{text}"
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <div className="font-heading font-extrabold text-[#1E293B] text-xs md:text-sm leading-none tracking-tight">
                        {name}
                      </div>
                      <div className="text-[10px] md:text-xs text-[#64748B] tracking-tight mt-1 font-normal opacity-80 leading-none">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

interface TestimonialsComponentProps {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export default function Testimonials(props: TestimonialsComponentProps) {
  const col1 = [testimonials[0], testimonials[3]];
  const col2 = [testimonials[1], testimonials[4]];
  const col3 = [testimonials[2], testimonials[5]];

  return (
    <section id="section-testimonials" className="py-12 md:py-16 bg-white text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {props.badge || "Kepercayaan Publik"}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
            {props.title || "Apa Kata Mereka?"}
          </h2>
          <p className="text-[#64748B] font-normal mt-2 text-xs md:text-sm leading-relaxed">
            {props.subtitle || "Cerita tulus dan inspiratif dari para orang tua/wali murid mengenai pengalaman berharga menyekolahkan putra-putri mereka di SDN 3 Purwosari."}
          </p>
          <div className="w-12 h-1.5 bg-[#2563EB] mx-auto mt-4 rounded-full" />
        </div>

        {/* Sliding Columns Container */}
        <div className="relative flex justify-center max-h-[580px] h-[580px] overflow-hidden gap-6 mt-10">
          {/* Top & Bottom elegant gradient masks */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-30" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-30" />

          {/* Testimonial Rows with staggered speeds */}
          <TestimonialsColumn
            testimonials={col1}
            duration={18}
            className="flex flex-col gap-6"
          />
          <TestimonialsColumn
            testimonials={col2}
            duration={25}
            className="flex flex-col gap-6 animate-none"
          />
          <TestimonialsColumn
            testimonials={col3}
            duration={20}
            className="hidden md:flex flex-col gap-6"
          />
        </div>
      </div>
    </section>
  );
}
