/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText,
  Send,
  UserCheck,
  Calendar,
  Phone,
  MapPin,
  CheckCircle,
  Printer,
  Download,
} from "lucide-react";
import { FAQItem, RegistrationData } from "../types";
import { useAdmin } from "../context/AdminContext";

export default function SpmbFaq() {
  const { faqs } = useAdmin();
  // Frequently Asked Questions accordion open-close indices state
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  // Registration Form state
  const [formData, setFormData] = useState<RegistrationData>({
    studentName: "",
    nik: "",
    gender: "Laki-laki",
    birthPlace: "",
    birthDate: "",
    parentName: "",
    parentPhone: "",
    address: "",
    pathway: "Zonasi",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    regNo: string;
    submittedAt: string;
    data: RegistrationData;
  } | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.nik || !formData.birthPlace || !formData.birthDate || !formData.parentName || !formData.parentPhone || !formData.address) {
      alert("Harap lengkapi semua isian formulir terlebih dahulu!");
      return;
    }
    setIsSubmitting(true);

    // Simulate database api delay
    setTimeout(() => {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const today = new Date();
      const submittedAtDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()} ${today.getHours()}:${String(today.getMinutes()).padStart(2, "0")} WIB`;
      
      setSubmissionReceipt({
        regNo: `REG/PPDB-${today.getFullYear()}/${randomId}`,
        submittedAt: submittedAtDate,
        data: { ...formData }, // store exact clone
      });
      setIsSubmitting(false);

      // Reset fields
      setFormData({
        studentName: "",
        nik: "",
        gender: "Laki-laki",
        birthPlace: "",
        birthDate: "",
        parentName: "",
        parentPhone: "",
        address: "",
        pathway: "Zonasi",
      });
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <section id="section-spmb" className="py-12 md:py-16 bg-[#F8FAFC] text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 bg-[#FBBF24]/10 text-[#2563EB] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Pendaftaran & FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
            Penerimaan Peserta Didik Baru (PPDB)
          </h2>
          <p className="text-[#64748B] font-normal mt-3 text-sm md:text-base leading-relaxed">
            Portal pendaftaran mandiri bagi calon wali siswa SDN 3 Purwosari Wonogiri Tahun Ajaran 2026/2027 lengkap dengan rangkuman tanya-jawab teknis.
          </p>
          <div className="w-12 h-1.5 bg-[#2563EB] mx-auto mt-4 rounded-full" />
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: FAQ Accordions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shadow-sm">
                <HelpCircle size={18} />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#1E293B]">
                Paling Sering Ditanyakan (FAQ)
              </h3>
            </div>

            {/* Accordion List container */}
            <div className="flex flex-col gap-3">
              {faqs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-md hover:shadow-lg hover:border-slate-200/85 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full flex justify-between items-center text-left p-5 text-sm md:text-base font-bold text-[#1E293B] hover:bg-slate-50/50 transition cursor-pointer"
                  >
                    <span className="pr-4 leading-snug">{item.question}</span>
                    {openFaqId === item.id ? (
                      <ChevronUp size={16} className="text-[#2563EB] shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaqId === item.id && (
                    <div className="px-5 pb-5 pt-1 text-[#64748B] text-xs md:text-sm font-normal leading-relaxed border-t border-slate-50">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Registration Form / Receipt Wrapper */}
          <div className="lg:col-span-7">
            {submissionReceipt ? (
              /* Submission Success Receipt */
              <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                {/* Print receipt top header visual indicator */}
                <div className="bg-emerald-50 text-emerald-700 font-bold py-3 px-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <CheckCircle size={18} />
                    Pra-Pendaftaran PPDB Berhasil
                  </span>
                  <span className="text-xs uppercase">{submissionReceipt.regNo}</span>
                </div>

                <div className="flex flex-col items-center text-center max-w-md mx-auto mb-6">
                  <div className="p-4 rounded-full bg-emerald-50 text-emerald-500 mb-3 shadow-inner">
                    <UserCheck size={36} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-blue-950">
                    Siswa Berhasil Diprapun daftar!
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light mt-1.5">
                    Harap cetak bukti pendaftaran online di bawah ini dan lampirkan bersama berkas fisik asli saat melakukan sesi ferivikasi berkas tatap muka di sekolah sesuai jadwal.
                  </p>
                </div>

                {/* Receipt Grid data */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 space-y-3.5 text-xs md:text-sm text-slate-700">
                  <div className="flex justify-between pb-2.5 border-b border-dashed border-slate-200">
                    <span className="text-slate-400 font-light">No. Pra-Pendaftaran:</span>
                    <span className="font-bold text-blue-900">{submissionReceipt.regNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-light">Tanggal Submit:</span>
                    <span className="font-medium text-slate-700">{submissionReceipt.submittedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-light">Nama Calon Siswa:</span>
                    <span className="font-semibold text-blue-950">{submissionReceipt.data.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-light">NIK Calon Siswa:</span>
                    <span className="font-mono">{submissionReceipt.data.nik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-light">Jalur Pendaftaran:</span>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100">
                      Jalur {submissionReceipt.data.pathway}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-light">Nama Orang Tua/Wali:</span>
                    <span className="font-semibold text-slate-700">{submissionReceipt.data.parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-light">Telepon:</span>
                    <span className="font-semibold text-slate-700">{submissionReceipt.data.parentPhone}</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-150">
                    <span className="text-slate-400 font-light">Alamat Domisili Sesuai KK:</span>
                    <span className="font-light italic text-slate-600 leading-relaxed">
                      {submissionReceipt.data.address}
                    </span>
                  </div>
                </div>

                {/* Print button controls */}
                <div className="mt-8 flex flex-wrap gap-4 justify-end no-print">
                  <button
                    onClick={() => setSubmissionReceipt(null)}
                    className="flex-1 sm:flex-initial text-slate-500 hover:bg-slate-100 font-semibold text-xs md:text-sm px-5 py-3 rounded-xl border border-slate-200 transition"
                  >
                    Daftar Siswa Lain
                  </button>
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 sm:flex-initial bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Printer size={16} />
                    Cetak Bukti Pendaftaran
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <div className="bg-white border border-slate-100 rounded-[28px] p-6 md:p-8 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-[#FBBF24] flex items-center justify-center shadow-sm">
                    <FileText size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-[#1E293B]">
                      Formulir Pra-Pendaftaran Online
                    </h3>
                    <p className="text-[#64748B] text-xs font-normal mt-0.5">
                      Silakan isi biodata awal calon siswa secara valid. Masa Prapendaftaran TA 2026/2027.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Student block name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="studentName" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        Nama Lengkap Calon Siswa *
                      </label>
                      <input
                        id="studentName"
                        type="text"
                        name="studentName"
                        required
                        placeholder="contoh: Gibran Shiddiq"
                        value={formData.studentName}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-normal transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="nik" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        NIK Calon Siswa (16 Digit) *
                      </label>
                      <input
                        id="nik"
                        type="text"
                        name="nik"
                        required
                        maxLength={16}
                        placeholder="contoh: 3312041234567890"
                        value={formData.nik}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-mono font-medium transition-all"
                      />
                    </div>
                  </div>

                  {/* Gender birth metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="gender" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        Jenis Kelamin *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-medium transition-all cursor-pointer"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="birthPlace" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        Tempat Lahir *
                      </label>
                      <input
                        id="birthPlace"
                        type="text"
                        name="birthPlace"
                        required
                        placeholder="contoh: Wonogiri"
                        value={formData.birthPlace}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-medium transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="birthDate" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        Tanggal Lahir *
                      </label>
                      <input
                        id="birthDate"
                        type="date"
                        name="birthDate"
                        required
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-medium transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Parent credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="parentName" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        Nama Ibu Kandung / Ayah Wali *
                      </label>
                      <input
                        id="parentName"
                        type="text"
                        name="parentName"
                        required
                        placeholder="contoh: Hartati Sukowati"
                        value={formData.parentName}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-medium transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="parentPhone" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        No. HP / WA Aktif Orang Tua *
                      </label>
                      <input
                        id="parentPhone"
                        type="tel"
                        name="parentPhone"
                        required
                        placeholder="contoh: 081234567890"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  {/* Pathway & address */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pathway" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        Pilih Jalur Pendaftaran *
                      </label>
                      <select
                        id="pathway"
                        name="pathway"
                        value={formData.pathway}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-medium transition-all cursor-pointer"
                      >
                        <option value="Zonasi">Jalur Zonasi (Berdasarkan Domisili Radius KK)</option>
                        <option value="Afirmasi">Jalur Afirmasi (Bantuan KIP/Kurang Mampu)</option>
                        <option value="Prestasi">Jalur Prestasi (Piala Tingkat Kabupaten/Kecamatan)</option>
                        <option value="Tugas Orang Tua">Jalur Mutasi Tugas Orang Tua/Wali</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="address" className="text-xs font-bold text-[#1E293B] uppercase tracking-wider pl-1">
                        Alamat Tinggal Lengkap (Sesuai Kartu Keluarga) *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        required
                        rows={3}
                        placeholder="Tuliskan nama jalan, RT/RW, Dusun/Kelurahan, Kecamatan secara lengkap..."
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full text-[#1E293B] bg-slate-50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] rounded-2xl px-4 py-3 text-xs md:text-sm font-normal transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#2563EB] hover:bg-[#2563EB]/95 disabled:bg-blue-300 text-white font-bold p-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-150 transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-98 cursor-pointer select-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-3 border-t-transparent border-white rounded-full animate-spin" />
                          <span>Memproses Data Calon Siswa...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Kirim Pra-Pendaftaran Online</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
