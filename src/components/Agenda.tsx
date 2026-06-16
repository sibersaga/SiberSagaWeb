/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Users, 
  Megaphone, 
  FileText, 
  Shirt,
  Search,
  Filter,
  Sparkles,
  Info,
  CalendarDays,
  RotateCcw
} from "lucide-react";
import { AgendaEvent } from "../types";
import { useAdmin } from "../context/AdminContext";

interface AgendaExtraDetail {
  speaker: string;
  targetedAudience: string;
  description: string;
  dressCode: string;
  requirements: string;
}

const agendaExtraDetails: { [key: string]: AgendaExtraDetail } = {
  "evt-1": {
    speaker: "Wali Kelas Masing-masing Jenjang (Kelas I s.d. VI)",
    targetedAudience: "Seluruh Orang Tua / Wali Murid Kelas I - VI",
    description: "Pertemuan tatap muka untuk menerima Buku Laporan Hasil Belajar (Rapor) semester genap. Ini adalah momentum berharga bagi orang tua untuk berkonsultasi langsung dengan wali kelas mengenai perkembangan akademis, pencapaian kompetensi sikap berbasis nilai Pancasila, minat belajar anak, serta pembagian sertifikat peringkat kelas.",
    dressCode: "Batik atau Pakaian Bebas, Sopan, Rapi, dan Bersepatu",
    requirements: "Wajib mengambil sendiri (tidak boleh diwakilkan siswa/anak demi koordinasi terpadu)"
  },
  "evt-2": {
    speaker: "Panitia Pelaksana & Tim Verifikator PPDB SDN 3 Purwosari",
    targetedAudience: "Calon Wali Murid Baru (Siswa pendaftar Kelas I)",
    description: "Sesi verifikasi berkas pendaftaran fisik yang sebelumnya diisikan pada portal pendaftaran online. Agenda meliputi pemeriksaan usia calon siswa berdasarkan akta kelahiran asli, kesesuaian zonasi jarak alamat di Kartu Keluarga (KK), serta wawancara kesiapan belajar dasar non-test kognitif.",
    dressCode: "Pakaian Bebas Rapi (Menghindari Sandal Jepit)",
    requirements: "Membawa Dokumen Asli & 2 Lembar Fotokopi Terlegalisir (Akta Lahir, KK, KTP Orang Tua)"
  },
  "evt-3": {
    speaker: "Kepala Sekolah & Pengurus Komite Paguyuban SDN 3",
    targetedAudience: "Seluruh Perwakilan Wali Murid, Tokoh Masyarakat & Komite",
    description: "Pembalajaran pertanggungjawaban program sekolah setahun lalu, dilanjutkan curah pendapat serta penandatanganan pakta komitmen pelaksanaan Rencana Kerja Jangka Menengah Sekolah (RKJM) dan program kebersihan Adiwiyata tahun ajaran baru. Suara Anda berharga demi masa depan putra-putri kita.",
    dressCode: "Batik Kerja / Busana Muslim Penduduk Rapi",
    requirements: "Mengisi Formulir Keberadaan Pendukung Program SPMB di lokasi"
  },
  "evt-4": {
    speaker: "Tim Pembina Kesiswaan & Pengajar Kelas I",
    targetedAudience: "Siswa-Siswi Baru Kelas I & Seluruh Siswa Kelas II-VI",
    description: "Memasuki gerbang sekolah dengan senyum gembira! Kegiatan diisi dengan apel pagi penyambutan siswa baru, perkenalan guru-guru kelas, jelajah keliling fasilitas sekolah (ruang UKS, perpus, laboratorium komputer), latihan kedisiplinan baris-berbaris sederhana, serta motivasi belajar ceria.",
    dressCode: "Seragam Merah Putih Lengkap Berdasi & Topi Sekolah Upacara",
    requirements: "Membawa alat tulis dasar, buku catatan hari pertama, serta bekal makanan sehat"
  }
};

const indonesianMonths = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const shortMonthToNum: { [key: string]: number } = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5,
  Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11
};

const numToShortMonth = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const weekdayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function Agenda() {
  const { agendas } = useAdmin();
  const [selectedEvt, setSelectedEvt] = useState<AgendaEvent | null>(null);

  // Calendar display state - Default to June 2026 as per sample records
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // June is 5 (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Filter state for dynamic table
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getExtraInfo = (id: string): AgendaExtraDetail => {
    return agendaExtraDetails[id] || {
      speaker: "Dewan Guru SDN 3 Purwosari",
      targetedAudience: "Siswa, Guru, serta Komite Sekolah",
      description: "Sosialisasi berkala dan koordinasi aktivitas kependidikan guna mempertahankan kualitas tata pamong sekolah dasar berakreditasi 'A'.",
      dressCode: "Seragam Harian Resmi / Bebas Pantas",
      requirements: "Mempersiapkan kehadiran fisik di lokasi penugasan tepat waktu"
    };
  };

  // Calendar Math
  const daysInMonthNum = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayIndex = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday, 1 = Monday etc.
  }, [currentYear, currentMonth]);

  const prevMonthTotalDays = useMemo(() => {
    return new Date(currentYear, currentMonth, 0).getDate();
  }, [currentYear, currentMonth]);

  // Construct Calendar grid cells
  const calendarCells = useMemo(() => {
    const cells = [];
    
    // 1. Padding days from the previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        dayNum: prevMonthTotalDays - i,
        isCurrent: false,
        month: currentMonth === 0 ? 11 : currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear
      });
    }

    // 2. Days of the current active month
    for (let d = 1; d <= daysInMonthNum; d++) {
      cells.push({
        dayNum: d,
        isCurrent: true,
        month: currentMonth,
        year: currentYear
      });
    }

    // 3. Padding days from the next month (to fill the usual 6x7 grid)
    const len = cells.length;
    const padding = len % 7 === 0 ? 0 : 7 - (len % 7);
    for (let d = 1; d <= padding; d++) {
      cells.push({
        dayNum: d,
        isCurrent: false,
        month: currentMonth === 11 ? 0 : currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear
      });
    }

    return cells;
  }, [currentYear, currentMonth, daysInMonthNum, firstDayIndex, prevMonthTotalDays]);

  // Retrieve agendas mapped to specific calendar days
  const getAgendasForCell = (day: number, isCurrent: boolean, monthIndex: number, yearNum: number) => {
    if (!isCurrent) return [];
    return agendas.filter(evt => {
      const parts = evt.date.split(" ");
      const evtDay = parseInt(evt.day || parts[0]);
      const mStr = evt.month || parts[1];
      const evtMonthIdx = shortMonthToNum[mStr];
      const evtYear = parseInt(parts[2] || "2026");
      return evtDay === day && evtMonthIdx === monthIndex && evtYear === yearNum;
    });
  };

  const currentMonthEvents = useMemo(() => {
    return agendas.filter(evt => {
      const parts = evt.date.split(" ");
      const mStr = evt.month || parts[1];
      const evtYear = parseInt(parts[2] || "2026");
      return shortMonthToNum[mStr] === currentMonth && evtYear === currentYear;
    });
  }, [agendas, currentMonth, currentYear]);

  // Determine standard list items displayed in table (filtered dynamically)
  const tableAgendasOnFilter = useMemo(() => {
    let list = agendas;

    // Filter by active calendar month and year by default
    list = list.filter(evt => {
      const parts = evt.date.split(" ");
      const mStr = evt.month || parts[1];
      const evtYear = parseInt(parts[2] || "2026");
      return shortMonthToNum[mStr] === currentMonth && evtYear === currentYear;
    });

    // If specific day cell is chosen, filter by day
    if (selectedDay !== null) {
      list = list.filter(evt => {
        const parts = evt.date.split(" ");
        const evtDay = parseInt(evt.day || parts[0]);
        return evtDay === selectedDay;
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter(evt => evt.category === selectedCategory);
    }

    // Filter by live text query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        evt => 
          evt.title.toLowerCase().includes(query) || 
          evt.location.toLowerCase().includes(query) || 
          evt.time.toLowerCase().includes(query)
      );
    }

    return list;
  }, [agendas, currentMonth, currentYear, selectedDay, selectedCategory, searchQuery]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const handleResetFilters = () => {
    setSelectedDay(null);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <section id="section-agenda" className="py-12 md:py-16 bg-brand-light text-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 bg-brand-sky/10 text-brand-sky px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Kalender Sekolah
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mt-4 tracking-tight">
            Agenda Kegiatan Mendatang
          </h2>
          <p className="text-[#64748B] font-normal mt-3 text-sm md:text-base leading-relaxed">
            Akses agenda akademik tingkat dasar, verifikasi SPMB/PPDB, rapat kependidikan, serta tabel rincian kegiatan interaktif.
          </p>
          <div className="w-12 h-1.5 bg-brand-sky mx-auto mt-4 rounded-full" />
        </div>

        {/* Master Calendar + Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Premium Interactive Calendar Grid Card */}
          <div className="lg:col-span-5 bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-7 shadow-lg relative overflow-visible">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer active:scale-95 text-slate-600"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <div className="flex flex-col items-center text-center">
                <span className="text-sm font-extrabold font-heading text-brand-navy uppercase tracking-wide">
                  {indonesianMonths[currentMonth]} {currentYear}
                </span>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                  <CalendarDays size={10} className="text-brand-sky" />
                  {currentMonthEvents.length} Agenda Bulan Ini
                </span>
              </div>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer active:scale-95 text-slate-600"
                title="Bulan Berikutnya"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Week Days Label Header */}
            <div className="grid grid-cols-7 gap-2 text-center mb-3">
              {weekdayNames.map((day, idx) => (
                <div 
                  key={day} 
                  className={`text-[10px] font-extrabold uppercase tracking-widest py-1 font-sans ${
                    idx === 0 ? "text-rose-500" : "text-slate-400"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 6x7 Calendar Grid Fields */}
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((cell, idx) => {
                const dayAgendas = getAgendasForCell(cell.dayNum, cell.isCurrent, cell.month, cell.year);
                const hasAgenda = dayAgendas.length > 0;
                const isSelected = selectedDay === cell.dayNum && cell.isCurrent;

                return (
                  <div
                    key={`${cell.year}-${cell.month}-${cell.dayNum}-${idx}`}
                    onClick={() => {
                      if (cell.isCurrent) {
                        setSelectedDay(isSelected ? null : cell.dayNum);
                      }
                    }}
                    className={`group relative aspect-square flex flex-col justify-between items-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                      !cell.isCurrent
                        ? "text-slate-300 border-transparent bg-slate-50/30 cursor-not-allowed select-none"
                        : isSelected
                        ? "bg-brand-sky text-white border-brand-sky font-extrabold shadow-md shadow-brand-sky/20"
                        : hasAgenda
                        ? "bg-brand-sky/10 text-brand-navy border-brand-sky/30 font-extrabold hover:bg-brand-sky/20"
                        : "bg-white text-slate-700 border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Day Number */}
                    <span className="text-xs md:text-sm font-bold mt-0.5">{cell.dayNum}</span>

                    {/* Small category indicator dot badges */}
                    <div className="flex gap-1 mb-0.5 justify-center">
                      {cell.isCurrent && dayAgendas.map((evt) => (
                        <span
                          key={evt.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected 
                              ? "bg-white" 
                              : evt.category === "akademik"
                              ? "bg-brand-sky"
                              : evt.category === "spmb"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Hover tooltip card displaying list of daily agenda (jika ada) */}
                    {cell.isCurrent && hasAgenda && (
                      <div className="absolute bottom-[115%] left-1/2 -translate-x-1/2 mb-2 w-52 md:w-60 bg-brand-navy border border-white/10 text-white rounded-2xl p-3 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-40">
                        {/* Little triangle arrow point */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-brand-navy" />
                        
                        <div className="text-[9px] uppercase font-bold tracking-widest text-brand-sky/90 mb-1.5 flex items-center gap-1 select-none">
                          <Sparkles size={10} className="text-amber-400" />
                          <span>{dayAgendas.length} Agenda Terjadwal</span>
                        </div>
                        
                        <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                          {dayAgendas.map((a) => (
                            <div key={a.id} className="border-b border-white/5 last:border-0 pb-1.5 last:pb-0">
                              <p className="font-bold text-xs text-white leading-tight mb-0.5">
                                {a.title}
                              </p>
                              <span className="text-[9px] text-slate-300 block">
                                ⏱ {a.time}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[8px] text-center text-slate-400 mt-2 pt-1 border-t border-white/5 select-none">
                          Klik tanggal untuk memfilter tabel
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Color Legend Badge Guide */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-sky" />
                <span>Akademik</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Pendaftaran</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Agenda Umum</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Dynamic Table showing detailed agendas */}
          <div className="lg:col-span-7 flex flex-col gap-5 bg-white rounded-[24px] border border-slate-200/60 p-6 shadow-lg min-h-[420px]">
            
            {/* Table Dynamic Controls / Dynamic Filter Header */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-extrabold text-base text-brand-navy flex items-center gap-2">
                  <Calendar size={18} className="text-brand-sky" />
                  Rincian Detail Agenda
                </h3>
                <p className="text-slate-400 text-[11px] font-bold mt-0.5">
                  {selectedDay 
                    ? `Menampilkan agenda tanggal ${selectedDay} ${indonesianMonths[currentMonth]} ${currentYear}`
                    : `Menampilkan semua agenda bulan ${indonesianMonths[currentMonth]} ${currentYear}`}
                </p>
              </div>

              {/* Reset button to clear active day filter */}
              {(selectedDay !== null || searchQuery !== "" || selectedCategory !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-sky font-bold bg-brand-sky/10 hover:bg-brand-sky/20 rounded-xl transition cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw size={13} />
                  Reset Filter
                </button>
              )}
            </div>

            {/* Secondary Search & Category Pill selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Text Search Box */}
              <div className="sm:col-span-7 relative flex items-center">
                <Search size={14} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari acara, lokasi, waktu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-sky/50 focus:border-brand-sky font-sans"
                />
              </div>

              {/* Category Filter Selector */}
              <div className="sm:col-span-5 relative">
                <div className="flex items-center">
                  <Filter size={13} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-sky/50 focus:border-brand-sky font-sans appearance-none cursor-pointer"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="akademik">Akademik</option>
                    <option value="spmb">Pendaftaran</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Render dynamic table responsive */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-3 w-28">Tanggal</th>
                    <th className="py-3 px-4 min-w-[200px]">Nama Agenda</th>
                    <th className="py-3 px-3 text-center">Kategori</th>
                    <th className="py-3 px-3 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {tableAgendasOnFilter.length > 0 ? (
                    tableAgendasOnFilter.map((evt, idx) => {
                      return (
                        <tr 
                          key={evt.id}
                          className="border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-200"
                        >
                          {/* Centered item indices */}
                          <td className="py-3 px-3 text-center font-bold text-slate-400">
                            {idx + 1}
                          </td>

                          {/* Dynamic date card styles */}
                          <td className="py-3 px-3 font-semibold text-slate-700">
                            <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-bold block w-fit whitespace-nowrap">
                              {evt.date}
                            </span>
                          </td>

                          {/* Title + small details below */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-brand-navy leading-normal text-[13px]">{evt.title}</div>
                            <div className="flex flex-wrap gap-2.5 mt-1 text-slate-400 font-bold text-[10px]">
                              <span className="flex items-center gap-1 shrink-0">
                                <Clock size={11} className="text-slate-400" />
                                {evt.time}
                              </span>
                              <span className="flex items-center gap-1 shrink-0">
                                <MapPin size={11} className="text-slate-400" />
                                {evt.location}
                              </span>
                            </div>
                          </td>

                          {/* Category Badge pill color matches indicator line */}
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${
                                evt.category === "akademik"
                                  ? "bg-brand-sky/10 text-brand-sky border border-brand-sky/20"
                                  : evt.category === "spmb"
                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              }`}
                            >
                              {evt.category === "akademik"
                                ? "Akademik"
                                : evt.category === "spmb"
                                ? "PPDB / SPMB"
                                : "Acara Umum"}
                            </span>
                          </td>

                          {/* Action Button: Opens Details Popover Modal */}
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => setSelectedEvt(evt)}
                              className="px-3 py-1.5 bg-brand-navy hover:bg-brand-sky text-white text-[10px] font-bold rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm shadow-slate-900/10"
                              title="Tinjau Detail Agenda Lengkap"
                            >
                              Lihat
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2.5">
                          <Info size={24} className="text-slate-300" />
                          <div>
                            <p className="font-extrabold text-slate-500">Tidak Ada Agenda Ditemukan</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Coba reset filter atau pilih bulan-tahun lain kependidikan.
                            </p>
                          </div>
                          <button
                            onClick={handleResetFilters}
                            className="mt-2.5 px-4 py-1.5 text-[11px] text-white font-bold bg-slate-800 hover:bg-slate-900 rounded-xl transition cursor-pointer"
                          >
                            Tampilkan Kembali Semua
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Fast info tip helper */}
            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150 text-[10px] text-slate-400 leading-relaxed mt-auto font-sans">
              <Info size={14} className="text-brand-sky shrink-0 mt-0.5" />
              <span>
                <strong>Tips Navigasi:</strong> Sorot (hover) mouse pada hari berkode warna di kalender untuk preview instan. Klik sel tanggal di kalender untuk menampilkan agenda tanggal bersangkutan pada tabel.
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Event Click Detail Pop-up Modal with Blurred Canvas Screen */}
      {selectedEvt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedEvt(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col transform transition-all animate-[slideIn_0.3s_ease-out] border border-slate-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header / Top Ribbon with Color according to category */}
            <div className={`p-6 text-white relative ${
              selectedEvt.category === "akademik"
                ? "bg-gradient-to-br from-[#1b3152] to-brand-navy"
                : selectedEvt.category === "spmb"
                ? "bg-gradient-to-br from-amber-500 to-amber-700"
                : "bg-gradient-to-br from-emerald-600 to-emerald-800"
            }`}>
              <button
                onClick={() => setSelectedEvt(null)}
                className="absolute top-4 right-4 p-2 bg-black/25 hover:bg-black/40 text-white rounded-full transition-all cursor-pointer"
                title="Tutup Detil Agenda"
              >
                <X size={16} />
              </button>

              <span className="bg-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                {selectedEvt.category === "akademik"
                  ? "Kalender Akademik"
                  : selectedEvt.category === "spmb"
                  ? "Penerimaan Murid Baru"
                  : "Pengumuman / Kegiatan Umum"}
              </span>

              <h3 className="font-heading font-extrabold text-lg md:text-xl mt-4 leading-snug">
                {selectedEvt.title}
              </h3>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 md:p-8 flex flex-col gap-5 text-sm">
              
              {/* Event Time and Location Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Waktu Sesi</span>
                    <span className="text-slate-700 font-bold text-xs">{selectedEvt.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Lokasi Agenda</span>
                    <span className="text-slate-700 font-bold text-xs truncate max-w-[120px] block">{selectedEvt.location}</span>
                  </div>
                </div>
              </div>

              {/* Informative Grid (Speaker & Targets) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <Megaphone size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pembicara / Koordinator</span>
                    <span className="text-[#1E293B] text-xs font-semibold leading-relaxed block mt-0.5">
                      {getExtraInfo(selectedEvt.id).speaker}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Users size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Hadirin</span>
                    <span className="text-[#1E293B] text-xs font-semibold leading-relaxed block mt-0.5">
                      {getExtraInfo(selectedEvt.id).targetedAudience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Description Text */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Deskripsi Lengkap</span>
                <p className="text-[#475569] text-xs md:text-sm leading-relaxed font-normal">
                  {getExtraInfo(selectedEvt.id).description}
                </p>
              </div>

              {/* Dresscode Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex gap-2.5 items-start">
                  <Shirt size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ketentuan Pakaian</span>
                    <span className="text-[#1E293B] text-xs font-medium leading-relaxed block mt-0.5">
                      {getExtraInfo(selectedEvt.id).dressCode}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <FileText size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Persyaratan / Catatan</span>
                    <span className="text-[#1E293B] text-xs font-medium leading-relaxed block mt-0.5">
                      {getExtraInfo(selectedEvt.id).requirements}
                    </span>
                  </div>
                </div>
              </div>

              {/* Practical date detail box */}
              <div className="flex justify-between items-center text-xs mt-2 pt-3 border-t border-slate-100">
                <span className="text-slate-400 font-semibold">Tanggal Kegiatan resmi:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full text-[10px]">
                  {selectedEvt.date}
                </span>
              </div>

              {/* Footer controls Close button */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setSelectedEvt(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Tutup Tinjauan Agenda
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}

