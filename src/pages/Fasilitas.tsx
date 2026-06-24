/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Breadcrumb from "../components/shared/Breadcrumb";
import { useAdmin } from "../context/AdminContext";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export default function Fasilitas() {
  const { facilities } = useAdmin();
  const [selectedFacility, setSelectedFacility] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Breadcrumb items={[{ label: "Fasilitas Sekolah" }]} />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
                Infrastruktur Sekolah
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
              Fasilitas Sekolah
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Jelajahi sarana dan prasarana lengkap yang mendukung proses pembelajaran di SDN 3 Purwosari.
            </p>
          </div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, idx) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedFacility(facility)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 hover:border-brand-sky/30 group"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        facility.status === "Baik"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {facility.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-brand-sky transition">
                    {facility.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <span className="font-semibold">Jumlah: {facility.qty}</span>
                  </div>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{facility.desc}</p>
                  <button className="text-brand-sky font-bold text-sm hover:text-brand-navy transition">
                    Lihat Detail →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFacility && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFacility(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{selectedFacility.name}</h2>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedFacility.status === "Baik"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedFacility.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Jumlah</p>
                    <p className="font-bold text-slate-900">{selectedFacility.qty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Kondisi</p>
                    <p className="font-bold text-slate-900">{selectedFacility.status}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Deskripsi:</h3>
                  <p className="text-slate-600 leading-relaxed">{selectedFacility.desc}</p>
                </div>

                <button
                  onClick={() => setSelectedFacility(null)}
                  className="w-full mt-6 bg-brand-sky text-white font-bold py-3 rounded-xl hover:bg-brand-navy transition"
                >
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
