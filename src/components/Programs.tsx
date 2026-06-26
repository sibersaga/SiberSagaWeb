/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Cpu,
  Heart,
  Leaf,
  Compass,
  Music,
  ShieldAlert,
  Palette,
  HeartPulse,
  Activity,
  Award,
  Sparkles,
  GraduationCap,
  Store,
  Calendar,
  Users,
  CheckCircle,
  X,
} from "lucide-react";
import { Program } from "../types";
import { useAdmin } from "../context/AdminContext";

const iconMap: { [key: string]: React.ComponentType<any> } = {
  BookOpen: BookOpen,
  Cpu: Cpu,
  Heart: Heart,
  Leaf: Leaf,
  Compass: Compass,
  Music: Music,
  ShieldAlert: ShieldAlert,
  Palette: Palette,
  HeartPulse: HeartPulse,
  Activity: Activity,
  GraduationCap: GraduationCap,
  Store: Store,
};

// Rich extra details translated for all programs so information in landing page is complete
interface ExtraDetail {
  schedule: string;
  target: string;
  activities: string[];
  benefits: string;
}

const programExtraDetails: { [key: string]: ExtraDetail } = {
  "prog-tahfiz": {
    schedule: "Selasa, Rabu, dan Kamis pukul 06.45 - 07.15 WIB",
    target: "Siswa Kelas 1 s.d Kelas 6 (Wali Kelas & Pembimbing khusus)",
    activities: [
      "Setoran privat hafalan Juz 30 (Juz Amma) setiap pagi bergantian",
      "Murottal dan murajaah bersama di dalam kelas sebelum KBM utama dimulai",
      "Sertifikasi kelulusan hafalan dan wisuda tahfidz tahunan sekolah",
      "Pembiasaan makharijul huruf yang baik, fasih, dan benar sejak dini"
    ],
    benefits: "Membina kecerdasan spiritual siswa, kedisiplinan mental, serta pembentukan karakter budi pekerti religius yang luhur."
  },
  "prog-literasi": {
    schedule: "Senin dan Jumat pukul 06.45 - 07.00 WIB",
    target: "Seluruh Siswa SDN 3 Purwosari (Kelas 1 - 6)",
    activities: [
      "Membaca senyap buku cerita, fiksi edukatif, atau ensiklopedia selama 15 menit",
      "Ulasan kreatif berkala (review mingguan) yang diunggah ke mading kelas",
      "Pembelajaran interaktif menggunakan modul digital dan game matematika seru",
      "Pemilihan Duta Literasi Kelas per semester sebagai agen pemicu minat baca"
    ],
    benefits: "Meningkatkan kemampuan pemahaman verbal, kemampuan numerasi, serta melatih daya pikir kritis analitis siswa."
  },
  "prog-ramah": {
    schedule: "Pelaksanaan setiap hari terintegrasi di seluruh kegiatan sekolah",
    target: "Seluruh Warga Sekolah (Siswa, Pendidik, Staf, & Komite Wali Murid)",
    activities: [
      "Sosialisasi rutin anti-perundungan (bullying) dan pembinaan kerukunan teman sebaya",
      "Kotak curhat terproteksi ramah anak untuk bimbingan konseling mandiri",
      "Penerapan disiplin positif di kelas tanpa adanya hukuman fisik atau verbal",
      "Audit keamanan sarana fisik secara berkala demi menjamin keselamatan belajar"
    ],
    benefits: "Menciptakan iklim sekolah yang aman, inklusif, toleran, bebas dari rasa takut, serta mendukung kebebasan berekspresi anak."
  },
  "prog-adiwiyata": {
    schedule: "Setiap hari Jumat Bersih dan Sabtu Sehat",
    target: "Komunitas Green-Leaders (Kader Adiwiyata Cilik) & Seluruh Siswa",
    activities: [
      "Penyetoran dan pencatatan sampah anorganik terpilah di Bank Sampah Sekolah",
      "Praktik pelestarian lingkungan melalui kebun hidroponik dan tanaman herbal (Apotek Hidup)",
      "Pembuatan pupuk organik cair/padat dari pengomposan mandiri guguran daun",
      "Pemanfaatan kembali barang bekas untuk karya seni estetis ramah lingkungan"
    ],
    benefits: "Menanamkan kecerdasan ekologis sejak dini, tanggung jawab menjaga alam, serta melestarikan status asri lingkungan sekolah."
  },
  "ekskul-pramuka": {
    schedule: "Setiap hari Sabtu pukul 13.00 - 14.30 WIB",
    target: "Siswa Kelas 3, 4, dan 5 (Regu Siaga & Penggalang)",
    activities: [
      "Pelatihan dasar sandi, tali temali (pionering), navigasi kompas, dan baris-berbaris",
      "Kemah bakti akhir tahun ajaran (Persami) lengkap dengan malam api unggun karya",
      "Kegiatan sosial bakti kemasyarakatan dan aksi peduli kebersihan desa",
      "Bimbingan kecakapan umum (SKU) serta pelantikan tanda kecakapan khusus"
    ],
    benefits: "Membentuk ketangguhan mental, kepemimpinan (leadership), kerja sama kelompok yang kuat, mandiri, dan berjiwa ksatria."
  },
  "ekskul-rebana": {
    schedule: "Setiap hari Kamis pukul 14.00 - 15.30 WIB",
    target: "Siswa Kelas 4 dan 5 (Peminat Seni Tari & Vokal)",
    activities: [
      "Latihan ritme ketukan instrumen terbang/rebana secara kompak",
      "Harmonisasi vokal lagu-lagu Islami khas qasidah, sholawat, dan lagu daerah",
      "Aransemen dinamis kombinasi musik modern dengan alat musik tradisional",
      "Persiapan pentas unjuk seni kelulusan dan seleksi lomba MAPSI kabupaten"
    ],
    benefits: "Mengembangkan kecerdasan seni musikal, menyalurkan minat spiritual, serta mengapresiasi kebudayaan nusantara bernuansa Islami."
  },
  "ekskul-silat": {
    schedule: "Setiap hari Jumat pukul 15.00 - 16.30 WIB",
    target: "Siswa Kelas 3, 4, dan 5 (Terbuka untuk Putra & Putri)",
    activities: [
      "Latihan pemanasan, kelenturan tubuh, stamina fisik, dan refleks keseimbangan",
      "Pengenalan jurus silat seni pertahanan diri tradisional bersertifikasi IPSI",
      "Simulasi latihan tanding aman berpasangan menggunakan body-protector khusus",
      "Pendidikan budi pekerti pendekar Pancasila yang rendah hati dan sportif"
    ],
    benefits: "Meningkatkan daya tahan kardiovaskular raga, kesigapan refleks bela diri, rasa percaya diri tinggi, serta disiplin bersikap."
  },
  "ekskul-melukis": {
    schedule: "Setiap hari Rabu pukul 14.00 - 15.30 WIB",
    target: "Siswa Kelas 1 s.d Kelas 5",
    activities: [
      "Teknik gradasi warna crayon, pencampuran warna cat air, dan melukis kanvas",
      "Pembuatan seni kaligrafi arab kontemporer dan gambar dekoratif imajinatif",
      "Mading pameran berkala karya terbaik siswa di koridor utama sekolah",
      "Bimbingan khusus untuk persiapan partisipasi lomba seni lukis FLS2N"
    ],
    benefits: "Memicu kecerdasan visual spasial, mengasah imajinasi, meningkatkan fokus dan motorik halus jemari tangan anak."
  },
  "ekskul-dokter": {
    schedule: "Setiap hari Jumat pukul 07.30 - 08.30 WIB (Bergilir)",
    target: "Kader Terpilih Kelas 4 dan 5 (Duta Sehat Sekolah)",
    activities: [
      "Pelatihan teori dan praktik pertolongan pertama pada kecelakaan (P3K) dasar",
      "Pemeriksaan berkala kebersihan kuku, gigi, serta telinga siswa antar kelas",
      "Pencatatan statistik tinggi badang dan berat badan siswa rombel berkala",
      "Penyuluhan berkala sikat gigi massal dan edukasi mencuci tangan pakai sabun"
    ],
    benefits: "Melatih kepedulian sosial, kesadaran pola hidup sehat, serta kepemimpinan teman sebaya dalam bidang kesehatan diri."
  },
  "ekskul-olahraga": {
    schedule: "Setiap hari Selasa pukul 15.00 - 16.30 WIB",
    target: "Siswa Kelas 3 s.d Kelas 6",
    activities: [
      "Pelatihan dasar dribbling, passing, control bola, serta taktik formasi futsal",
      "Latihan atletik mencakup lari jarak pendek, lompat jauh, dan lempar lembing modifikasi",
      "Sparing partner persahabatan berkala dengan sekolah terdekat",
      "Penyelenggaraan mini tournament antarkelas untuk menyalakan gairah kompetisi"
    ],
    benefits: "Menjaga kebugaran jasmani anak, menyalurkan energi aktif berlebih, mengasah kerja sama tim, serta menanamkan sportivitas tinggi."
  },
  "intra-pancasila": {
    schedule: "Terintegrasi penuh dalam jadwal KBM harian kelas",
    target: "Seluruh Siswa dari Jenjang Kelas 1 s.d Kelas 6",
    activities: [
      "Metode pembelajaran berbasis kasus (Case Method) kearifan sosial",
      "Role-play drama singkat tentang kepedulian berteman dan musyawarah mufakat",
      "Sesi refleksi karakter harian (kejujuran, berbagi, dan kepedulian) sebelum pulang sekolah",
      "Projek kerja sama kecil antarteman bangku untuk melatih empati"
    ],
    benefits: "Siswa menginternalisasi dan mengaplikasikan nilai-nilai moral pancasila dalam kebiasaan perilaku sosial harian dengan alami."
  },
  "intra-sains": {
    schedule: "Terjadwal dalam alokasi mata pelajaran IPA & Matematika kelas",
    target: "Siswa Kelas 4, 5, dan 6",
    activities: [
      "Eksperimen fisika/biologi sederhana menggunakan laboratorium alam sekitar",
      "Game logika pemecahan teka-teki pecahan, bangun ruang, dan pola matematika",
      "Pembuatan model sederhana peraga sains (kompas magnetik, saringan air filter)",
      "Kelas pembinaan khusus olimpiade sains (KSN) bagi siswa berpotensi akademik"
    ],
    benefits: "Memicu rasa ingin tahu ilmiah (scientific curiosity), penalaran logis berbasis bukti, serta kecakapan angka analitis."
  },
  "kokur-p5": {
    schedule: "Blok waktu terjadwal di tengah maupun akhir semester",
    target: "Seluruh Jenjang Kelas (Fase A, B, dan C)",
    activities: [
      "Penelitian aksi tema gaya hidup berkelanjutan seputar penumpukan plastik",
      "Projek eksplorasi tema kearifan lokal (produksi kerajinan dan kuliner Wonogiri)",
      "Gelar Karya P5 akbar tahunan sekolah yang dihadiri komite wali murid luar",
      "Refleksi tertulis penguatan kompetensi gotong royong dan kemandirian siswa"
    ],
    benefits: "Melatih kematangan emosional kerja sama lintas teman, mempraktikkan proyek solusi nyata atas situasi di lingkungan tempat tinggal."
  },
  "kokur-market": {
    schedule: "Satu kali setiap semester (Pada hari Sabtu Ceria)",
    target: "Seluruh Rombel Kelas 1 - 6 (Secara Bergilir sebagai Stan & Pembeli)",
    activities: [
      "Merumuskan bersama wali murid kreasi menu dagangan bergizi harga murah terjangkau",
      "Menghias stan dagangan mini kelas menggunakan hiasan daur ulang buatan siswa",
      "Mengadakan transaksi jual-beli langsung menggunakan alat bayar sah didampingi guru",
      "Menghitung secara berkelompok pemasukan bersih, modal, dan laba yang didapatkan"
    ],
    benefits: "Menumbuhkan jiwa kewirausahaan (entrepreneurship), mengerti konsep uang & nilai tambah, serta menyatukan ikatan kebersamaan wali murid."
  }
};

interface ProgramsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  programs?: Program[];
}

export default function Programs(props: ProgramsProps) {
  const { programs: globalPrograms } = useAdmin();
  const programs = props.programs && props.programs.length > 0 ? props.programs : globalPrograms;
  const [activeTab, setActiveTab] = useState<"all" | "unggulan" | "ekskul" | "intrakurikuler" | "kokurikuler">("all");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const filteredPrograms = programs.filter((program) => {
    if (activeTab === "all") return true;
    return program.category === activeTab;
  });

  const getExtraInfo = (id: string): ExtraDetail => {
    return programExtraDetails[id] || {
      schedule: "Menyesuaikan kalender KBM sekolah",
      target: "Siswa SDN 3 Purwosari",
      activities: [
        "Aktivitas bimbingan teratur bersama guru pembimbing",
        "Pemberian materi kreatif dan latihan praktik interaktif",
        "Evaluasi minat bakat dan apresiasi unjuk hasil karya siswa"
      ],
      benefits: "Mendukung proses pendidikan karakter yang terintegrasi, mandiri, dan meningkatkan kreativitas."
    };
  };

  return (
    <section id="section-program" className="py-12 md:py-16 bg-[#F8FAFC] text-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {props.badge || "Kurikulum & Bakat"}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
            {props.title || "Program & Ekstrakurikuler"}
          </h2>
          <p className="text-[#64748B] font-normal mt-3 text-sm md:text-base leading-relaxed">
            {props.subtitle || "Menfasilitasi tumbuh kembang minat belajar dan menyalurkan kreativitas seni, kepangkatan, serta kebugaran fisik siswa secara seimbang."}
          </p>
          <div className="w-12 h-1.5 bg-[#2563EB] mx-auto mt-4 rounded-full" />
        </div>

        {/* Filters Tabs Buttons */}
        <div className="flex justify-center mb-12 px-2">
          <div className="flex flex-wrap justify-center p-1.5 bg-slate-100 rounded-[24px] gap-1.5 border border-slate-200/60 shadow-sm max-w-4xl w-full font-heading">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 sm:px-5 py-2.5 rounded-[16px] text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-[#1E293B] shadow-sm"
                  : "text-[#64748B] hover:text-[#1E293B] hover:bg-white/50"
              }`}
            >
              Semua Program
            </button>
            <button
              onClick={() => setActiveTab("intrakurikuler")}
              className={`px-4 sm:px-5 py-2.5 rounded-[16px] text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "intrakurikuler"
                  ? "bg-[#4F46E5] text-white shadow-sm shadow-indigo-100"
                  : "text-[#64748B] hover:text-[#4F46E5] hover:bg-white/50"
              }`}
            >
              <GraduationCap size={15} />
              Intrakurikuler
            </button>
            <button
              onClick={() => setActiveTab("kokurikuler")}
              className={`px-4 sm:px-5 py-2.5 rounded-[16px] text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "kokurikuler"
                  ? "bg-[#10B981] text-white shadow-sm shadow-emerald-100"
                  : "text-[#64748B] hover:text-[#10B981] hover:bg-white/50"
              }`}
            >
              <Heart size={15} />
              Kokurikuler
            </button>
            <button
              onClick={() => setActiveTab("unggulan")}
              className={`px-4 sm:px-5 py-2.5 rounded-[16px] text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "unggulan"
                  ? "bg-[#2563EB] text-white shadow-sm shadow-blue-100"
                  : "text-[#64748B] hover:text-[#2563EB] hover:bg-white/50"
              }`}
            >
              <Sparkles size={14} />
              Program Unggulan
            </button>
            <button
              onClick={() => setActiveTab("ekskul")}
              className={`px-4 sm:px-5 py-2.5 rounded-[16px] text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "ekskul"
                  ? "bg-[#FBBF24] text-[#1E293B] shadow-sm shadow-yellow-100"
                  : "text-[#64748B] hover:text-[#1E293B] hover:bg-white/50"
              }`}
            >
              <Award size={14} />
              Ekstrakurikuler
            </button>
          </div>
        </div>

        {/* Programs Cards Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {filteredPrograms.map((program, index) => {
            const Icon = iconMap[program.icon] || BookOpen;
            // Aesthetic organic offsets and micro-rotations for non-uniform grid look
            const offsets = [
              "lg:-translate-y-0.5 lg:-rotate-1 lg:hover:rotate-0",
              "lg:translate-y-1 bg-white/95 lg:rotate-0.5 lg:hover:rotate-0",
              "lg:-translate-y-1.5 lg:-rotate-0.5 lg:hover:rotate-0",
              "lg:translate-y-0.5 lg:rotate-1 lg:hover:rotate-0",
              "lg:translate-y-1.5 lg:-rotate-1 lg:hover:rotate-0 shadow-sm",
            ];
            const randomOffset = offsets[index % offsets.length];

            return (
              <div
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className={`group relative bg-white rounded-2xl border border-slate-100/90 p-4 shadow-sm hover:shadow-lg hover:border-slate-300/80 transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between cursor-pointer ${randomOffset}`}
                title="Pencet untuk melihat detail utuh program"
              >
                <div>
                  {/* Header Icon + Badge info - tighter margin */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 text-[#2563EB] flex items-center justify-center shadow-sm shrink-0">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <span
                      className={`text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        program.category === "unggulan"
                          ? "bg-blue-50 text-[#2563EB]"
                          : program.category === "ekskul"
                          ? "bg-amber-50 text-amber-700"
                          : program.category === "intrakurikuler"
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "bg-emerald-50 text-emerald-700 font-semibold"
                      }`}
                    >
                      {program.category === "unggulan"
                        ? "Unggulan"
                        : program.category === "ekskul"
                        ? "Ekskul"
                        : program.category === "intrakurikuler"
                        ? "Intra"
                        : "Koku"}
                    </span>
                  </div>

                  {/* Texts Content - tighter margins */}
                  <h3 className="font-heading font-extrabold text-[#1E293B] group-hover:text-[#2563EB] transition leading-tight text-sm line-clamp-1">
                    {program.title}
                  </h3>
                  <p className="text-[#64748B] text-[11px] leading-relaxed mt-1.5 font-medium line-clamp-2">
                    {program.description}
                  </p>
                </div>

                {/* Small active badge - tighter padded bottom separator */}
                <div className="mt-3 pt-2.5 border-t border-slate-150 flex items-center justify-between text-[10px] text-[#2563EB] font-bold">
                  <span className="text-slate-400 font-semibold text-[9px] group-hover:text-[#2563EB] transition-colors">Program Aktif</span>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Robust Detail Modal Overlay (Blurred Backdrop & Clean Visuals) */}
      {selectedProgram && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col transform transition-all animate-[slideIn_0.3s_ease-out] border border-slate-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header Area with Graphic / Color Stripe */}
            <div className={`h-3 bg-gradient-to-r ${selectedProgram.color || 'from-blue-600 to-indigo-700'}`} />
            
            <div className="p-6 md:p-8 flex flex-col gap-5">
              {/* Top Row: Icon and Close Target */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2563EB] flex items-center justify-center shadow-sm`}>
                    {React.createElement(iconMap[selectedProgram.icon] || BookOpen, { size: 24, strokeWidth: 2 })}
                  </div>
                  <div>
                    <span className="text-[10px] bg-blue-50 border border-blue-100 text-[#2563EB] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {selectedProgram.category === "unggulan"
                        ? "Program Unggulan"
                        : selectedProgram.category === "ekskul"
                        ? "Ekstrakurikuler"
                        : selectedProgram.category === "intrakurikuler"
                        ? "Intrakurikuler"
                        : "Kokurikuler"}
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                      {selectedProgram.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="p-1 px-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-500 transition-colors cursor-pointer"
                  title="Tutup Detail"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Description */}
              <div className="text-slate-600 text-xs md:text-sm leading-relaxed border-b border-slate-100 pb-4">
                <p className="font-medium text-slate-800 mb-1">Deskripsi Umum:</p>
                <p className="font-normal text-slate-600 leading-relaxed font-sans">{selectedProgram.description}</p>
              </div>

              {/* Grid Metadata details: Schedule & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100/80 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                    <Calendar size={12} className="text-amber-500" />
                    <span>Jadwal Penyelenggaraan</span>
                  </div>
                  <span className="text-slate-700 font-bold text-[11px] leading-snug">
                    {getExtraInfo(selectedProgram.id).schedule}
                  </span>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100/80 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                    <Users size={12} className="text-[#2563EB]" />
                    <span>Sasaran Siswa</span>
                  </div>
                  <span className="text-slate-700 font-bold text-[11px] leading-snug">
                    {getExtraInfo(selectedProgram.id).target}
                  </span>
                </div>
              </div>

              {/* Activities list block */}
              <div className="flex flex-col gap-2.5 font-sans">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-emerald-500" />
                  <span>Aktivitas Utama Kegiatan:</span>
                </h4>
                <ul className="flex flex-col gap-2 pl-1.5">
                  {getExtraInfo(selectedProgram.id).activities.map((act, aIdx) => (
                    <li key={aIdx} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target & benefits */}
              <div className="bg-blue-50/40 border border-blue-100/40 p-4 rounded-2xl flex flex-col gap-1 font-sans">
                <h4 className="text-[10px] text-blue-900 font-extrabold uppercase tracking-widest">
                  Target & Manfaat Kompetensi
                </h4>
                <p className="text-xs text-blue-950 leading-relaxed font-medium mt-1">
                  {getExtraInfo(selectedProgram.id).benefits}
                </p>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex justify-end mt-4 pt-3.5 border-t border-slate-100">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Tutup Detail Program
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

