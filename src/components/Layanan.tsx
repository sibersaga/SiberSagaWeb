/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  CheckCircle2,
  ClipboardList,
  BookOpen,
  Calendar,
  MapPin,
  Award,
  Heart,
  Send,
  Phone,
  Mail,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function Layanan() {
  const { services } = useAdmin();
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    subjek: "",
    pesan: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    FileText,
    CheckCircle2,
    ClipboardList,
    BookOpen,
    Calendar,
    MapPin,
    Award,
    Heart,
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.pesan) {
      setFormStatus("error");
      return;
    }
    setFormStatus("success");
    setFormData({ nama: "", email: "", telepon: "", subjek: "", pesan: "" });
    setTimeout(() => setFormStatus("idle"), 3000);
  };

  return (
    <section id="section-layanan" className="bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
              Layanan Pendidikan
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
            Pusat Layanan Berkas & Informasi
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Akses lengkap dokumen, formulir, dan layanan administrasi pendidikan SDN 3 Purwosari.
          </p>
        </div>

        {/* CariYanlik Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-sky rounded-3xl p-8 md:p-10 mb-12 text-white shadow-xl border border-white/10"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <Briefcase size={28} className="text-brand-light" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">CariYanlik SIPPN</h3>
              <p className="text-slate-100 mb-4 leading-relaxed">
                Sistem Informasi Pelayanan Publik Nasional (SIPPN) menyediakan informasi lengkap layanan publik.
                Kunjungi portal resmi untuk informasi layanan pemerintah yang komprehensif.
              </p>
              <a
                href="https://www.yanlik.sippn.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-light text-brand-navy font-bold px-5 py-2.5 rounded-xl hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>Kunjungi CariYanlik</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Sidebar - Service Files List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-20">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Daftar Layanan</h3>
              <div className="space-y-2">
                {services.map((service) => {
                  const Icon = iconMap[service.icon] || FileText;
                  const isSelected = selectedServiceId === service.id;

                  return (
                    <motion.button
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-300 text-left ${
                        isSelected
                          ? "bg-brand-light text-brand-navy shadow-md border border-brand-sky/30"
                          : "text-slate-700 hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <Icon size={18} className="flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-2">{service.title}</p>
                        <p className={`text-xs mt-0.5 ${isSelected ? "text-brand-sky" : "text-slate-500"}`}>
                          {service.category}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Content - Service Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {selectedService && (
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-sky/20 to-brand-navy/10 flex items-center justify-center flex-shrink-0">
                      {React.createElement(iconMap[selectedService.icon] || FileText, {
                        size: 32,
                        className: "text-brand-sky",
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="inline-block mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-sky bg-brand-light px-3 py-1 rounded-lg">
                          {selectedService.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedService.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-6 text-lg">{selectedService.description}</p>

                  <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-6 mb-6 border border-blue-100">
                    <p className="text-sm text-slate-700 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold">File dapat diunduh atau diminta langsung di sekretariat.</span>
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <a
                      href={selectedService.url || "#"}
                      className="inline-flex items-center justify-center gap-2 bg-brand-sky text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-navy transition-all duration-300 shadow-md hover:shadow-lg flex-1"
                    >
                      <Send size={18} />
                      Unduh File
                    </a>
                    <a
                      href="mailto:websdn3purwosari@gmail.com"
                      className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-200 transition-all duration-300 flex-1"
                    >
                      <Mail size={18} />
                      Email
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Hubungi Kami</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Memiliki pertanyaan tentang layanan atau dokumen yang Anda butuhkan? Hubungi kami melalui formulir di bawah ini.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Telepon (Opsional)</label>
                <input
                  type="tel"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  placeholder="+62 xxx xxxx xxxx"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subjek</label>
                <input
                  type="text"
                  value={formData.subjek}
                  onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                  placeholder="Topik pertanyaan"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pesan</label>
                <textarea
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  placeholder="Tuliskan pesan Anda di sini..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 outline-none transition resize-none"
                  required
                />
              </div>

              {formStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
                </motion.div>
              )}

              {formStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl font-semibold"
                >
                  Mohon isi semua kolom yang wajib diisi (Nama, Email, Pesan).
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-sky to-brand-navy text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Kirim Pesan
              </button>
            </form>

            {/* Quick Contact Info */}
            <div className="grid md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Phone size={20} className="text-brand-sky" />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase">Telepon</p>
                  <p className="text-slate-900 font-bold">+62 (0273) 321-456</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail size={20} className="text-brand-sky" />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase">Email</p>
                  <p className="text-slate-900 font-bold">websdn3purwosari@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lapor Banner & Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Pengaduan & Masukan Pelayanan</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Jika ada kendala dalam pelayanan pendidikan atau masukan untuk perbaikan, silakan laporkan melalui portal resmi Lapor.go.id.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
              <a
                href="https://www.lapor.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <ExternalLink size={20} />
                Lapor.go.id
              </a>
              <a
                href="mailto:websdn3purwosari@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm whitespace-nowrap"
              >
                <Mail size={20} />
                Hubungi Kami
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
