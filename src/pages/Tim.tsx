/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Breadcrumb from "../shared/Breadcrumb";
import { useAdmin } from "../../context/AdminContext";
import { motion, AnimatePresence } from "motion/react";
import { Mail, X } from "lucide-react";

export default function Tim() {
  const { teachers } = useAdmin();
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Breadcrumb items={[{ label: "Tim Kami" }]} />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
                Pendidik & Staf
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
              Tim Kami
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Bertemu dengan para pendidik dan staf yang berdedikasi untuk memberikan pendidikan terbaik.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari guru atau staf..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-brand-sky outline-none transition"
              />
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher, idx) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedTeacher(teacher)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 hover:border-brand-sky/30 group"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-brand-sky transition">
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-slate-600 font-semibold mb-4">{teacher.role}</p>
                  <button className="text-brand-sky font-bold text-sm hover:text-brand-navy transition">
                    Lihat Profil →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">Guru atau staf tidak ditemukan.</p>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTeacher(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedTeacher.image}
                  alt={selectedTeacher.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedTeacher.name}</h2>
                <p className="text-brand-sky font-bold mb-4">{selectedTeacher.role}</p>

                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedTeacher.name} adalah bagian dari tim pengajar berdedikasi kami yang berkomitmen
                    untuk memberikan pendidikan berkualitas kepada setiap siswa di SDN 3 Purwosari.
                  </p>
                </div>

                <button className="w-full bg-brand-sky text-white font-bold py-3 rounded-xl hover:bg-brand-navy transition">
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
