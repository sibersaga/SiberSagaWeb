/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Breadcrumb from "../shared/Breadcrumb";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Pendaftaran() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [formData, setFormData] = useState({
    studentName: "",
    nik: "",
    gender: "",
    birthPlace: "",
    birthDate: "",
    parentName: "",
    parentPhone: "",
    address: "",
    pathway: "",
  });

  const [faqOpen, setFaqOpen] = useState<string | null>(null);

  const faqs = [
    {
      id: "1",
      question: "Berapakah batas usia minimal untuk mendaftar Kelas 1 SD?",
      answer: "Sesuai petunjuk teknis dinas pendidikan, batas usia minimal pendaftar adalah 6 tahun pada tanggal 1 Juli 2026.",
    },
    {
      id: "2",
      question: "Apakah dikenakan biaya gedung atau SPP bulanan?",
      answer: "Tidak ada. Sebagai lembaga sekolah dasar negeri, seluruh biaya operasional telah disubsidi penuh oleh dana BOS.",
    },
    {
      id: "3",
      question: "Dokumen apa saja yang wajib dilampirkan?",
      answer: "Wali murid wajib melampirkan: 1) Akta Kelahiran, 2) Kartu Keluarga, 3) KTP Orang Tua, 4) Pas foto 3x4.",
    },
    {
      id: "4",
      question: "Kapan pembukaan dan penutupan pendaftaran?",
      answer: "Pendaftaran dibuka Bulan Januari hingga Maret setiap tahun ajaran baru.",
    },
    {
      id: "5",
      question: "Bagaimana cara cek hasil seleksi?",
      answer: "Hasil seleksi dapat dicek melalui website sekolah atau datang langsung ke sekolah pada tanggal pengumumuman.",
    },
  ];

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    setRegistrationNumber("PPDB-" + Date.now());
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
        <Breadcrumb items={[{ label: "Pendaftaran PPDB" }]} />

        <section className="py-20">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-12 shadow-xl border border-slate-100 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={40} className="text-emerald-600" />
              </motion.div>

              <h2 className="text-3xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h2>
              <p className="text-slate-600 mb-6">
                Terima kasih telah mendaftar di SDN 3 Purwosari. Berikut adalah nomor pendaftaran Anda:
              </p>

              <div className="bg-brand-light rounded-xl p-4 mb-8">
                <p className="text-xs text-slate-600 font-semibold mb-1">NOMOR PENDAFTARAN</p>
                <p className="font-mono font-bold text-2xl text-brand-sky">{registrationNumber}</p>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                Simpan nomor ini untuk keperluan verifikasi. Anda akan menerima notifikasi melalui WhatsApp
                pada nomor yang terdaftar.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep(1);
                    setFormData({
                      studentName: "",
                      nik: "",
                      gender: "",
                      birthPlace: "",
                      birthDate: "",
                      parentName: "",
                      parentPhone: "",
                      address: "",
                      pathway: "",
                    });
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
                >
                  Daftar Ulang
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-brand-sky text-white font-bold py-3 rounded-xl hover:bg-brand-navy transition"
                >
                  Cetak Bukti
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Breadcrumb items={[{ label: "Pendaftaran PPDB Online" }]} />

      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-sky bg-brand-light px-4 py-1.5 rounded-full">
                Pendaftaran Siswa Baru
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
              Pendaftaran PPDB Online
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Daftar sekarang untuk menjadi bagian dari keluarga besar SDN 3 Purwosari.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s ? "bg-brand-sky text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${step > s ? "bg-brand-sky" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span className="font-semibold">Data Siswa</span>
              <span className="font-semibold">Data Orang Tua</span>
              <span className="font-semibold">Konfirmasi</span>
            </div>
          </div>

          {/* Form */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Data Siswa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nama Lengkap Siswa"
                    value={formData.studentName}
                    onChange={(e) => handleFormChange("studentName", e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-sky outline-none transition"
                  />
                  <input
                    type="text"
                    placeholder="NIK (Nomor Induk Kependudukan)"
                    value={formData.nik}
                    onChange={(e) => handleFormChange("nik", e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-sky outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleFormChange("gender", e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-sky outline-none transition"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleFormChange("birthDate", e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-sky outline-none transition"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Tempat Lahir"
                  value={formData.birthPlace}
                  onChange={(e) => handleFormChange("birthPlace", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-sky outline-none transition"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Data Orang Tua/Wali</h2>
                <input
                  type="text"
                  placeholder="Nama Orang Tua/Wali"
                  value={formData.parentName}
                  onChange={(e) => handleFormChange("parentName", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-sky outline-none transition"
                />

                <input
                  type="tel"
                  placeholder="Nomor Telepon/WhatsApp"
                  value={formData.parentPhone}
                  onChange={(e) => handleFormChange("parentPhone", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-sky outline-none transition"
                />

                <textarea
                  placeholder="Alamat Lengkap"
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-sky outline-none transition resize-none"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Konfirmasi Data</h2>
                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Nama Siswa</p>
                    <p className="font-bold text-slate-900">{formData.studentName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Orang Tua</p>
                    <p className="font-bold text-slate-900">{formData.parentName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Kontak</p>
                    <p className="font-bold text-slate-900">{formData.parentPhone || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Dengan mengklik "Kirim", Anda menyetujui syarat dan ketentuan pendaftaran PPDB SDN 3
                    Purwosari.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Buttons */}
          <div className="flex gap-3 mb-12">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition disabled:opacity-50"
            >
              Kembali
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-brand-sky text-white font-bold py-3 rounded-xl hover:bg-brand-navy transition flex items-center justify-center gap-2"
              >
                Lanjut
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                Kirim Pendaftaran
                <CheckCircle2 size={18} />
              </button>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Pertanyaan Umum (FAQ)</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => setFaqOpen(faqOpen === faq.id ? null : faq.id)}
                  className="w-full text-left p-4 border border-slate-200 rounded-lg hover:border-brand-sky hover:bg-slate-50 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-bold text-slate-900">{faq.question}</p>
                    <span className={`text-brand-sky transition ${faqOpen === faq.id ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </div>
                  <AnimatePresence>
                    {faqOpen === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-slate-200"
                      >
                        <p className="text-slate-600 text-sm">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
