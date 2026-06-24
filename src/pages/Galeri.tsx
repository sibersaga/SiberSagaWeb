/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import Breadcrumb from "../components/shared/Breadcrumb";
import SearchBar from "../components/shared/SearchBar";
import { useAdmin } from "../context/AdminContext";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Galeri() {
  const { gallery } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const categories = ["semua", "fasilitas", "kegiatan", "siswa", "guru"];
  const categoryLabels: Record<string, string> = {
    semua: "Semua Foto",
    fasilitas: "Fasilitas",
    kegiatan: "Kegiatan",
    siswa: "Siswa",
    guru: "Guru",
  };

  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      const matchCategory = selectedCategory === "semua" || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery, gallery]);

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setCurrentImageIdx(filteredGallery.indexOf(image));
  };

  const handlePrevImage = () => {
    const newIdx = (currentImageIdx - 1 + filteredGallery.length) % filteredGallery.length;
    setCurrentImageIdx(newIdx);
    setSelectedImage(filteredGallery[newIdx]);
  };

  const handleNextImage = () => {
    const newIdx = (currentImageIdx + 1) % filteredGallery.length;
    setCurrentImageIdx(newIdx);
    setSelectedImage(filteredGallery[newIdx]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Breadcrumb items={[{ label: "Galeri Foto" }]} />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
                Dokumentasi Visual
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
              Galeri Foto
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Lihat momen-momen berharga dari kegiatan dan fasilitas sekolah kami.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-20">
                <h3 className="font-bold text-slate-900 mb-4">Filter Foto</h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Kategori
                  </p>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${
                          selectedCategory === cat
                            ? "bg-brand-light text-brand-sky border border-brand-sky"
                            : "text-slate-600 hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        {categoryLabels[cat]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Cari Foto
                  </p>
                  <SearchBar
                    placeholder="Cari foto..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>

                {/* Info */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-600">
                    Ditemukan: <span className="font-bold">{filteredGallery.length}</span> foto
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence mode="wait">
                  {filteredGallery.length > 0 ? (
                    filteredGallery.map((photo, idx) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleImageClick(photo)}
                        className="relative group overflow-hidden rounded-xl cursor-pointer"
                      >
                        <img
                          src={photo.image}
                          alt={photo.title}
                          className="w-full h-40 object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                          <div className="text-center text-white">
                            <p className="text-xs font-bold opacity-75">{photo.category}</p>
                            <p className="font-bold text-sm line-clamp-2">{photo.title}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-2 md:col-span-3 py-12 text-center">
                      <p className="text-slate-600">Tidak ada foto yang sesuai dengan filter Anda.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-slate-300 transition z-10"
            >
              <X size={32} />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center gap-4 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image */}
              <div className="relative w-full">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full max-h-[70vh] object-contain rounded-xl"
                />

                {/* Navigation Arrows */}
                {filteredGallery.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="text-white text-center max-w-2xl">
                <p className="text-xs font-bold opacity-75 mb-2">{selectedImage.category}</p>
                <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-sm opacity-90">{selectedImage.description}</p>
              </div>

              {/* Counter */}
              {filteredGallery.length > 1 && (
                <p className="text-white text-xs opacity-75">
                  {currentImageIdx + 1} / {filteredGallery.length}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
