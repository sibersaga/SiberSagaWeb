/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Breadcrumb from "../shared/Breadcrumb";
import { useAdmin } from "../../context/AdminContext";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, ExternalLink, Briefcase, FileText, CheckCircle2 } from "lucide-react";

export default function Download() {
  const { downloads } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["semua", "brosur", "formulir", "kalender", "kurikulum"];
  const categoryColors: Record<string, string> = {
    brosur: "from-blue-500 to-blue-600",
    formulir: "from-amber-500 to-amber-600",
    kalender: "from-emerald-500 to-emerald-600",
    kurikulum: "from-purple-500 to-purple-600",
  };

  const filteredDownloads = downloads.filter((d) => {
    const matchCategory = selectedCategory === "semua" || d.type.toLowerCase().includes(selectedCategory);
    const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Breadcrumb items={[{ label: "Download Center" }]} />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
                Pusat Unduhan
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
              Download Center
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Unduh dokumen, brosur, formulir dan berbagai file penting lainnya dari SDN 3 Purwosari.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-20">
                <h3 className="font-bold text-slate-900 mb-4">Filter</h3>

                <div className="space-y-2 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        selectedCategory === cat
                          ? "bg-brand-light text-brand-sky"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari file..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-brand-sky outline-none transition"
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-600">
                    Total file: <span className="font-bold">{filteredDownloads.length}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Download Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDownloads.map((file, idx) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-brand-sky/30"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${categoryColors[file.type] || "from-slate-500 to-slate-600"} flex items-center justify-center flex-shrink-0`}>
                        <FileText size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {file.type}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{file.title}</h3>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200">
                      <span>{file.size}</span>
                      <span>{file.downloads} unduhan</span>
                    </div>

                    <a
                      href={file.url}
                      download
                      className="inline-flex items-center gap-2 w-full justify-center bg-brand-sky text-white font-bold py-2.5 px-4 rounded-xl hover:bg-brand-navy transition text-sm"
                    >
                      Unduh File
                    </a>
                  </motion.div>
                ))}
              </div>

              {filteredDownloads.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-600">Tidak ada file yang sesuai.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
