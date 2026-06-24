/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/shared/Breadcrumb";
import SearchBar from "../components/shared/SearchBar";
import { useAdmin } from "../context/AdminContext";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Share2, Copy, Check } from "lucide-react";

export default function BeritaPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { news } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const itemsPerPage = 6;

  // If viewing detail article
  if (slug) {
    const article = news.find((n) => n.title.toLowerCase().replace(/\s+/g, "-") === slug);

    if (!article) {
      return (
        <div className="min-h-screen bg-white">
          <Breadcrumb items={[{ label: "Berita", href: "/berita" }, { label: "Artikel Tidak Ditemukan" }]} />
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <p className="text-slate-600 mb-4">Artikel yang Anda cari tidak ditemukan.</p>
            <button
              onClick={() => navigate("/berita")}
              className="inline-flex items-center gap-2 bg-brand-sky text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-navy transition"
            >
              Kembali ke Berita
            </button>
          </div>
        </div>
      );
    }

    const relatedNews = news
      .filter((n) => n.id !== article.id && n.category === article.category)
      .slice(0, 3);

    const handleCopyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

    return (
      <div className="min-h-screen bg-white">
        <Breadcrumb items={[{ label: "Berita", href: "/berita" }, { label: article.title }]} />

        <article className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            {/* Back Button */}
            <button
              onClick={() => navigate("/berita")}
              className="inline-flex items-center gap-2 text-brand-sky hover:text-brand-navy font-bold mb-8 transition"
            >
              <ArrowLeft size={20} />
              Kembali ke Berita
            </button>

            {/* Article Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-bold bg-brand-light text-brand-sky px-3 py-1 rounded-full uppercase tracking-wide">
                  {article.category}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{article.date}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
                {article.title}
              </h1>

              <p className="text-slate-600 text-lg leading-relaxed">{article.excerpt}</p>

              <div className="flex items-center justify-between my-6 py-4 border-y border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">PENULIS</p>
                  <p className="font-bold text-slate-900">{article.author}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                      isCopied
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "text-slate-600 border-slate-200 hover:border-brand-sky hover:text-brand-sky"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={16} />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Salin
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Article Image */}
            {article.image && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-sm md:prose max-w-none mb-12">
              <div
                className="text-slate-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Related Articles */}
            {relatedNews.length > 0 && (
              <div className="border-t pt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Artikel Terkait</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNews.map((related) => (
                    <button
                      key={related.id}
                      onClick={() =>
                        navigate(
                          `/berita/${related.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      }
                      className="text-left group"
                    >
                      <div className="rounded-xl overflow-hidden mb-3">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mb-1">{related.date}</p>
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-sky transition line-clamp-2">
                        {related.title}
                      </h3>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    );
  }

  // News List View
  const filteredNews = useMemo(() => {
    return news.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, news]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const recentNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const popularNews = [...news]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Breadcrumb items={[{ label: "Portal Berita" }]} />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
                Informasi Terbaru
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
              Portal Berita & Pengumuman
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Ikuti perkembangan terbaru dan pengumuman penting dari SDN 3 Purwosari.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3">Cari Berita</h3>
                <SearchBar
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Berita Terbaru</h3>
                <div className="space-y-4">
                  {recentNews.map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        navigate(`/berita/${item.title.toLowerCase().replace(/\s+/g, "-")}`)
                      }
                      className="text-left group"
                    >
                      <p className="text-xs text-slate-500 font-semibold mb-1">{item.date}</p>
                      <p className="font-bold text-slate-900 group-hover:text-brand-sky transition text-sm line-clamp-2">
                        {item.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Posts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Populer</h3>
                <div className="space-y-4">
                  {popularNews.map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        navigate(`/berita/${item.title.toLowerCase().replace(/\s+/g, "-")}`)
                      }
                      className="text-left group"
                    >
                      <p className="text-xs text-slate-500 font-semibold mb-1">{item.date}</p>
                      <p className="font-bold text-slate-900 group-hover:text-brand-sky transition text-sm line-clamp-2">
                        {item.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <AnimatePresence mode="wait">
                  {paginatedNews.map((item, idx) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() =>
                        navigate(`/berita/${item.title.toLowerCase().replace(/\s+/g, "-")}`)
                      }
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-brand-sky/30 text-left group"
                    >
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-3 left-3 bg-brand-sky text-white text-xs font-bold px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-4">
                        <p className="text-xs text-slate-500 font-semibold mb-2">{item.date}</p>
                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-sky transition">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">{item.excerpt}</p>
                        <p className="text-brand-sky font-bold text-sm">Baca Selengkapnya →</p>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>

              {paginatedNews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-600">Tidak ada berita yang sesuai dengan pencarian Anda.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-bold transition ${
                        currentPage === page
                          ? "bg-brand-sky text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-brand-sky hover:text-brand-sky"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
