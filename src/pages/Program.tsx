/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import Breadcrumb from "../components/shared/Breadcrumb";
import { useAdmin } from "../context/AdminContext";
import { Award, BookOpen, Music, Dumbbell } from "lucide-react";

export default function Program() {
  const { programs } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const categories = [
    { id: "semua", label: "Semua Program" },
    { id: "unggulan", label: "Program Unggulan" },
    { id: "intrakurikuler", label: "Intrakurikuler" },
    { id: "kokurikuler", label: "Kokurikuler" },
    { id: "ekskul", label: "Ekstrakurikuler" },
  ];

  const filteredPrograms =
    selectedCategory === "semua"
      ? programs
      : programs.filter((p) => p.category === selectedCategory);

  const categoryIcons: Record<string, React.ElementType> = {
    unggulan: Award,
    intrakurikuler: BookOpen,
    ekskul: Music,
    kokurikuler: Dumbbell,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Breadcrumb items={[{ label: "Program & Ekstrakurikuler" }]} />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
                Akademik & Ekstrakurikuler
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
              Program Unggulan & Ekstrakurikuler
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Jelajahi berbagai program akademik dan kegiatan ekstrakurikuler yang kami tawarkan untuk
              mengembangkan potensi setiap siswa.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 md:px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-brand-sky text-white shadow-lg"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-brand-sky hover:text-brand-sky"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program, idx) => {
              const Icon = categoryIcons[program.category] || BookOpen;

              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedProgram(program)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 hover:border-brand-sky/30 group"
                >
                  <div className={`h-32 bg-gradient-to-br ${program.color} p-6 flex items-start justify-between`}>
                    <div>
                      <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-2">
                        {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
                      </span>
                    </div>
                    <Icon size={32} className="text-white opacity-80" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-sky transition">
                      {program.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      {program.description}
                    </p>
                    <button className="text-brand-sky font-bold text-sm hover:text-brand-navy transition">
                      Pelajari Lebih Lanjut →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">Tidak ada program dalam kategori ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal Detail Program */}
      {selectedProgram && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProgram(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-40 bg-gradient-to-br ${selectedProgram.color} p-8 text-white`}>
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3">
                {selectedProgram.category}
              </span>
              <h2 className="text-3xl font-bold">{selectedProgram.title}</h2>
            </div>

            <div className="p-8">
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {selectedProgram.description}
              </p>

              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-3">Tentang Program Ini:</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Program {selectedProgram.title.toLowerCase()} merupakan bagian dari
                  komitmen SDN 3 Purwosari dalam mengembangkan potensi siswa di bidang{" "}
                  {selectedProgram.category}. Program ini dirancang untuk memberikan pengalaman
                  belajar yang bermakna dan menyenangkan.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="flex-1 bg-brand-sky text-white font-bold py-3 rounded-xl hover:bg-brand-navy transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
