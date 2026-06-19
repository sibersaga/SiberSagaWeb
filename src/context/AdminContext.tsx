import React, { createContext, useContext, useState, useEffect } from "react";
import { Program, Achievement, AgendaEvent, NewsItem, SchoolStat, GalleryPhoto, FAQItem, DownloadFile, Teacher, Facility, Testimonial, Innovation } from "../types";
import {
  schoolPrograms,
  schoolAchievements,
  agendaEvents,
  latestNews,
  schoolStats,
  galleryPhotos,
  faqItems,
  downloadFiles,
  defaultTeachers,
  defaultFacilities,
  defaultTestimonials,
  defaultInnovations,
} from "../data";
import {
  getCollection,
  getSetting,
  upsertCollection,
  upsertItem,
  updateItem,
  deleteItem,
  upsertSetting,
  isSupabaseConfigured,
  listAdmins,
  upsertAdmin,
  deleteAdmin as deleteAdminFromSupabase,
} from "../supabase";

interface AdminContextType {
  programs: Program[];
  achievements: Achievement[];
  agendas: AgendaEvent[];
  news: NewsItem[];
  admins: string[];
  currentUserEmail: string | null;
  isAdminMode: boolean;
  manualLoginUsername: string;
  isManualLoginEnabled: boolean;

  stats: SchoolStat[];
  setStats: (stats: SchoolStat[]) => void;
  gallery: GalleryPhoto[];
  setGallery: (photos: GalleryPhoto[]) => void;
  faqs: FAQItem[];
  setFaqs: (items: FAQItem[]) => void;
  downloads: DownloadFile[];
  setDownloads: (files: DownloadFile[]) => void;
  customHTML: string;
  updateCustomHTML: (html: string) => void;
  siteContent: SiteContent;
  setSiteContent: (content: SiteContent) => Promise<{ success: boolean; error?: string }>;
  updateSiteContent: (content: SiteContent) => Promise<{ success: boolean; error?: string }>;

  teachers: Teacher[];
  setTeachers: (teachers: Teacher[]) => void;
  facilities: Facility[];
  setFacilities: (facilities: Facility[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (items: Testimonial[]) => void;
  innovations: Innovation[];
  setInnovations: (items: Innovation[]) => void;

  setPrograms: (programs: Program[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setAgendas: (agendas: AgendaEvent[]) => void;
  setNews: (news: NewsItem[]) => void;
  setAdmins: (admins: string[]) => void;

  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  addProgram: (program: Omit<Program, "id">) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;

  addAchievement: (achievement: Omit<Achievement, "id">) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  addAgenda: (agenda: Omit<AgendaEvent, "id">) => void;
  updateAgenda: (id: string, agenda: Partial<AgendaEvent>) => void;
  deleteAgenda: (id: string) => void;

  addNews: (newsItem: Omit<NewsItem, "id">) => void;
  updateNews: (id: string, newsItem: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  addFacility: (facility: Omit<Facility, "id">) => void;
  updateFacility: (id: string, facility: Partial<Facility>) => void;
  deleteFacility: (id: string) => void;

  addTestimonial: (item: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, item: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  addInnovation: (item: Omit<Innovation, "id">) => void;
  updateInnovation: (id: string, item: Partial<Innovation>) => void;
  deleteInnovation: (id: string) => void;

  addAdmin: (email: string) => { success: boolean; error?: string };
  deleteAdmin: (email: string) => { success: boolean; error?: string };
  updateManualLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

type SiteContent = {
  topbar: {
    contactEmail: string;
    location: string;
    instagramUrl: string;
    youtubeUrl: string;
  };
  header: {
    brandTitle: string;
    tagline: string;
    searchPlaceholder: string;
    menu: Array<{ id: string; label: string }>;
    searchItems: Array<{ title: string; id: string; category: string; desc: string }>;
    shareText: string;
    shareTitle: string;
  };
  hero: {
    badge: string;
    schoolName: string;
    titlePrimary: string;
    titleSecondary: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    imageAlt: string;
    fallbackBadge: string;
    fallbackTitle: string;
    fallbackSubtitle: string;
    cards: Array<{ title: string; description: string }>;
  };
  welcome: {
    eyebrow: string;
    title: string;
    description: string;
    tabs: {
      sambutan: {
        label: string;
        badge: string;
        title: string;
        leadImageAlt: string;
        quote: string;
        paragraphs: string[];
        closing: string;
      };
      visi: {
        label: string;
        badge: string;
        title: string;
        intro: string;
        description: string;
        highlights: Array<{ title: string; desc: string }>;
      };
      misi: {
        label: string;
        badge: string;
        title: string;
        intro: string;
        items: string[];
        panelTitle: string;
        panelDescription: string;
        footerLeft: string;
        footerRight: string;
      };
      tujuan: {
        label: string;
        badge: string;
        title: string;
        intro: string;
        sideTitle: string;
        sideDescription: string;
        goals: Array<{ title: string; desc: string }>;
      };
    };
  };
  footer: {
    brandTitle: string;
    tagline: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    quickLinksTitle: string;
    mediaTitle: string;
    npsnInfo: string;
    copyright: string;
    adminButton: string;
    bottomBrand: string;
    links: Array<{ id: string; label: string }>;
    socialUrls: {
      instagram: string;
      youtube: string;
      tiktok: string;
      facebook: string;
    };
  };
  ticker: {
    title: string;
    items: string[];
  };
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);
const PRIMARY_ADMIN_EMAIL = "websdn3purwosari@gmail.com";
const LEGACY_ADMIN_EMAILS = ["kridaloka.id@gmail.com", "sdn3purwosari@gmail.com"];
const DEFAULT_ADMINS = [PRIMARY_ADMIN_EMAIL];

const DEFAULT_SITE_CONTENT: SiteContent = {
  topbar: {
    contactEmail: "websdn3purwosari@gmail.com",
    location: "Wonogiri, Jawa Tengah",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
  },
  header: {
    brandTitle: "SDN 3 PURWOSARI",
    tagline: "Kabupaten Wonogiri • Terakreditasi A",
    searchPlaceholder: "Cari program, guru, fasilitas, ppdb...",
    menu: [
      { id: "hero", label: "Beranda" },
      { id: "sambutan", label: "Profil" },
      { id: "program", label: "Akademik" },
      { id: "prestasi", label: "Prestasi" },
      { id: "inovasi", label: "Inovasi" },
      { id: "berita", label: "Berita" },
      { id: "galeri", label: "Galeri" },
      { id: "spmb", label: "SPMB" },
      { id: "download", label: "Download" },
      { id: "kontak", label: "Kontak" },
    ],
    searchItems: [
      { title: "Profil & Sambutan Kepala Sekolah", id: "sambutan", category: "Profil", desc: "Sambutan resmi Kepala Sekolah SDN 3 Purwosari, Kiswanto, S.Pd., M.Pd." },
      { title: "Statistik & Capaian Sekolah", id: "stats", category: "Statistik", desc: "Data statistik akreditasi, rasio guru, dan statistik siswa aktif kelembagaan." },
      { title: "Pendidik & Tenaga Kependidikan", id: "guru", category: "Profil", desc: "Daftar 12 pengajar berdedikasi dan staf administratif sekolah." },
      { title: "Sarana & Prasarana Unggulan", id: "fasilitas", category: "Fasilitas", desc: "Detail fisik ruang kelas, laboratorium komputer, perpustakaan digital, dsb." },
      { title: "Kondisi Siswa & Rombel Aktual", id: "kondisi", category: "Kondisi", desc: "Rincian sebaran rombongan belajar (rombel) kelas 1 sampai kelas 6." },
      { title: "Program Unggulan Akademik & Ekskul", id: "program", category: "Akademik", desc: "Program unggulan, pembinaan keagamaan, bela diri, Pramuka, sains, dsb." },
      { title: "Prestasi Kebanggaan Sekolah", id: "prestasi", category: "Akademik", desc: "Penghargaan nasional, regional, seni budaya, dan kejuaraan perlombaan." },
      { title: "Portal Inovasi Unggulan & Dampak", id: "inovasi", category: "Inovasi", desc: "Smart Classroom, Bank Sampah Adiwiyata, dan Pojok Literasi Digital." },
      { title: "Portal Berita & Informasi Kegiatan", id: "berita", category: "Informasi", desc: "Kabar terbaru kegiatan KBM, pameran seni, outbound, dsb." },
      { title: "Agenda Kegiatan Utama", id: "agenda", category: "Informasi", desc: "Jadwal penting sekolah: pembagian raport, rapat wali murid, dan pendaftaran." },
      { title: "Galeri Foto Dokumentasi KBM", id: "galeri", category: "Dokumentasi", desc: "Koleksi foto kegiatan belajar siswa di kelas dan ekstrakurikuler." },
      { title: "Penerimaan Murid Baru (SPMB / FAQ)", id: "spmb", category: "PPDB", desc: "Formulir pendaftaran siswa baru, biaya gratis, FAQ pendaftaran." },
      { title: "Pusat Unduhan Brosur & Dokumen", id: "download", category: "Dokumentasi", desc: "Pusat download berkas PDF brosur, kalender akademik, dan berkas syarat pendaftaran." },
      { title: "Video Profil & Lokasi Sekolah", id: "kontak", category: "Kontak", desc: "Video dokumenter institusi, nomor telepon, email, dan integrasi Google Maps." },
    ],
    shareText: "Yuk kunjungi website resmi SDN 3 Purwosari Wonogiri!",
    shareTitle: "Website Resmi SDN 3 Purwosari Wonogiri",
  },
  hero: {
    badge: "Visi & Misi Sekolah",
    schoolName: "SDN 3 PURWOSARI WONOGIRI",
    titlePrimary: "Sekolah yang",
    titleSecondary: "Unggul, Berkarakter & Berprestasi",
    description: "Selamat datang di portal resmi SDN 3 Purwosari Wonogiri. Kami berkomitmen menyelenggarakan pendidikan bermutu tinggi, ramah anak, dan berbasis nilai-nilai luhur Pancasila demi masa depan gemilang anak bangsa.",
    primaryButton: "Pendaftaran PPDB 2026",
    secondaryButton: "Profil Sekolah",
    imageAlt: "SDN 3 Purwosari Wonogiri Gedung Sekolah",
    fallbackBadge: "Kampus Hijau Purwosari",
    fallbackTitle: "Asri, Bersih, dan Terakreditasi A",
    fallbackSubtitle: "Kampus Hijau Purwosari",
    cards: [
      { title: "Pendidikan Karakter", description: "Menanamkan budi pekerti jujur, religius, gotong royong." },
      { title: "Guru Berkompetensi", description: "Dibimbing oleh tenaga pengajar profesional dan berdedikasi tinggi." },
      { title: "Fasilitas Lengkap", description: "Laboratorium, perpustakaan nyaman, kebun Adiwiyata, & UKS." },
    ],
  },
  welcome: {
    eyebrow: "Eksplorasi Profil Sekolah",
    title: "Sambutan, Visi, Misi & Tujuan",
    description: "Mengenal lebih dekat arah fundamental pendidikan dasar, kepemimpinan, dan komitmen pelayanan mutu di lingkungan SDN 3 Purwosari.",
    tabs: {
      sambutan: {
        label: "Sambutan Kepala Sekolah",
        badge: "Profil Kepemimpinan",
        title: "Mendidik dengan Hati, Merajut Prestasi",
        leadImageAlt: "Kepala Sekolah SDN 3 Purwosari Wonogiri",
        quote: "Mendidik dengan Hati, Mengantarkan Anak Didik Menjadi Generasi Emas yang Berbudi Luhur dan Unggul",
        paragraphs: [
          "Assalamu'alaikum Warahmatullahi Wabarakatuh,\nSalam Sejahtera bagi kita semua, Shalom, Om Swastyastu, Namo Buddhaya, Salam Kebajikan.",
          "Puji syukur kehadirat Tuhan Yang Maha Esa atas limpahan rahmat-Nya sehingga kita dapat meluncurkan portal informasi resmi SDN 3 Purwosari Wonogiri. Selamat datang, sebuah kebanggaan bagi kami dapat bersinergi secara transparan demi memajukan mutu pendidikan dasar putra-putri tercinta.",
          "Pendidikan tingkat dasar merupakan fondasi paling kritis dalam membentuk karakter anak. Kami meyakini, keunggulan akademis harus diimbangi oleh budi pekerti yang agung, fondasi religi yang kokoh, serta kesadaran peduli kelestarian lingkungan hidup ekologis.",
          "Bersama 12 pendidik dan staf yang berdedikasi tinggi, kami berkomitmen menghadirkan lingkungan belajar yang aman, ramah anak, dan responsif terhadap tuntutan zaman. Terima kasih atas kepercayaan bapak/ibu wali murid sekalian. Mari bersama-sama mencetak calon pemimpin bangsa yang andal, kreatif, dan mandiri.",
        ],
        closing: "Wassalamu'alaikum Warahmatullahi Wabarakatuh.",
      },
      visi: {
        label: "Visi Sekolah",
        badge: "Arah Kebijakan",
        title: "Terwujudnya Peserta Didik yang Berakhlak Mulia, Unggul dalam Prestasi, Kreatif, Mandiri, dan Berwawasan Lingkungan",
        intro: "Visi ini merupakan landasan operasional pembelajaran terstruktur jangka panjang di SDN 3 Purwosari.",
        description: "Melalui visi ini, SDN 3 Purwosari tidak hanya menuntut ketajaman prestasi kognitif, melainkan mengawal pembentukan pembiasaan akhlak mulia dan kecintaan murid terhadap konservasi alam demi keberlangsungan masa depan yang lestari.",
        highlights: [
          { title: "Akhlak Mulia", desc: "Sopan, religius, beradat ketimuran" },
          { title: "Unggul Prestasi", desc: "Kompetitif akademis & non-akademis" },
          { title: "Kreatif & Mandiri", desc: "Mampu bernalar kritis & mencari solusi" },
          { title: "Eco-Friendly", desc: "Peduli kelestarian alam & kebersihan" },
        ],
      },
      misi: {
        label: "Misi Sekolah",
        badge: "Langkah Strategis",
        title: "Langkah Nyata Pelayanan Mutu",
        intro: "Misi sekolah ini menjadi arah kerja harian seluruh warga sekolah.",
        items: [
          "Menanamkan keimanan dan ketakwaan melalui pengamalan nilai-nilai keagamaan dan pembiasaan akhlak mulia sejak dini.",
          "Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan (PAIKEM) berbasis teknologi informasi.",
          "Mengembangkan potensi, bakat, dan minat siswa secara optimal melalui bimbingan kepribadian dan ekstrakurikuler komprehensif.",
          "Mendorong kemandirian belajar siswa melalui pembelajaran bermakna (meaningful learning) dan berbasis proyek (P5).",
          "Menumbuhkan kesadaran dan kepedulian lingkungan hidup melalui program sekolah hijau (eco-school) dan kebersihan sirkular.",
        ],
        panelTitle: "Komitmen Bersama",
        panelDescription: "Setiap poin misi di atas selalu dievaluasi per semester bersama Komite Sekolah dan Pengawas TK/SD Purwosari Wonogiri guna menjaga relevansi mutu dan kepatuhan akademis secara sinergis.",
        footerLeft: "Standar Nasional Pendidikan",
        footerRight: "Terakreditasi Unggul",
      },
      tujuan: {
        label: "Tujuan Sekolah",
        badge: "Pencapaian Institusi",
        title: "Sasaran Strategis Jangka Menengah",
        intro: "Target operasional sekolah yang terukur dan menjadi rujukan evaluasi capaian tahunan.",
        sideTitle: "Membentuk Output Lulusan yang Siap, Berkarakter, dan Adaptif",
        sideDescription: "Lulusan SDN 3 Purwosari dibekali keterampilan berpikir logis berbasis numerasi serta diimbangi karakter ketuhanan untuk melanjutkan ke jenjang SMP favorit.",
        goals: [
          { title: "Akhlak Luhur", desc: "Mempersiapkan lulusan taat ibadah, jujur, santun, dan toleran." },
          { title: "Kelulusan 100%", desc: "Mencapai tingkat kelulusan paripurna dengan rata-rata nilai naik." },
          { title: "Tim Kompetitif", desc: "Memiliki delegasi andalan dalam bidang olahraga, seni, & sains." },
          { title: "Infrastruktur IT", desc: "Menyediakan sarana belajar ramah anak, nyaman dan berbasis digital." },
        ],
      },
    },
  },
  footer: {
    brandTitle: "SDN 3 PURWOSARI",
    tagline: "Kabupaten Wonogiri • Terakreditasi A",
    description: "Membentuk karakter berbudi luhur, unggul dalam prestasi akademis/non-akademis, kreatif, mandiri, serta berwawasan lingkungan.",
    address: "Purwosari, Kec. Wonogiri, Jawa Tengah 57615",
    phone: "+62 (0273) 321-456",
    email: "websdn3purwosari@gmail.com",
    quickLinksTitle: "Akses Cepat",
    mediaTitle: "Media Sosial & Info",
    npsnInfo: "NPSN: 203112223 • Siswa: 312 • Status: Negeri",
    copyright: "© 2026 SDN 3 Purwosari Wonogiri. Hak Cipta Dilindungi Undang-Undang.",
    adminButton: "Masuk Admin",
    bottomBrand: "SDN 3 Purwosari Digital",
    links: [
      { id: "hero", label: "Beranda" },
      { id: "sambutan", label: "Profil" },
      { id: "program", label: "Akademik" },
      { id: "prestasi", label: "Prestasi" },
      { id: "berita", label: "Berita" },
      { id: "spmb", label: "PPDB" },
      { id: "download", label: "Download" },
      { id: "kontak", label: "Kontak" },
    ],
    socialUrls: {
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      tiktok: "https://tiktok.com",
      facebook: "https://facebook.com",
    },
  },
  ticker: {
    title: "Pengumuman Penting",
    items: [
      "Pendaftaran Peserta Didik Baru (PPDB) SDN 3 Purwosari Tahun Ajaran 2026/2027 Resmi Dibuka secara Online!",
      "SDN 3 Purwosari Wonogiri Sukses Meraih Predikat Akreditasi 'A' (Unggul) dari BAN-PDM Jawa Tengah!",
      "Agenda Imunisasi BIAS berkala dari Puskesmas Wonogiri II berjalan dengan tertib dan lancar.",
      "Selamat atas prestasi luar biasa delegasi siswa SDN 3 Purwosari meraih Juara 1 LCC Umum Tingkat Kecamatan!",
      "Bagi calon pendaftar PPDB, berkas fisik dapat diserahkan ke ruang sekretariat panitia pada hari kerja.",
    ],
  },
};

interface ManualLoginConfig {
  username: string;
  passwordHash: string;
  updatedAt?: string;
}

type CollectionName = "programs" | "achievements" | "agendas" | "news" | "stats" | "gallery" | "faqs" | "downloads";
type CollectionPayload = Program | Achievement | AgendaEvent | NewsItem | SchoolStat | GalleryPhoto | FAQItem | DownloadFile;

const collectionDefaults: Record<CollectionName, CollectionPayload[]> = {
  programs: schoolPrograms,
  achievements: schoolAchievements,
  agendas: agendaEvents,
  news: latestNews,
  stats: schoolStats,
  gallery: galleryPhotos,
  faqs: faqItems,
  downloads: downloadFiles,
};

const storageKeys: Record<CollectionName, string> = {
  programs: "sdn3_programs",
  achievements: "sdn3_achievements",
  agendas: "sdn3_agendas",
  news: "sdn3_news",
  stats: "sdn3_stats",
  gallery: "sdn3_gallery",
  faqs: "sdn3_faqs",
  downloads: "sdn3_downloads",
};

const extraStorageKeys = {
  teachers: "sdn3_teachers",
  facilities: "sdn3_facilities",
  testimonials: "sdn3_testimonials",
  innovations: "sdn3_innovations",
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

function normalizeAdmins(data: string[]) {
  const cleaned = data
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email && !LEGACY_ADMIN_EMAILS.includes(email));

  return Array.from(new Set([PRIMARY_ADMIN_EMAIL, ...cleaned]));
}

function readCurrentUser() {
  const currentUser = readStorage<string | null>("sdn3_current_user", null);

  if (!currentUser) return null;
  if (currentUser.startsWith("manual:")) return currentUser;
  if (currentUser.toLowerCase() === PRIMARY_ADMIN_EMAIL) return currentUser.toLowerCase();

  return null;
}

async function hashPassword(password: string) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [programs, setProgramsState] = useState<Program[]>(() => readStorage(storageKeys.programs, schoolPrograms));
  const [achievements, setAchievementsState] = useState<Achievement[]>(() => readStorage(storageKeys.achievements, schoolAchievements));
  const [agendas, setAgendasState] = useState<AgendaEvent[]>(() => readStorage(storageKeys.agendas, agendaEvents));
  const [news, setNewsState] = useState<NewsItem[]>(() => readStorage(storageKeys.news, latestNews));
  const [admins, setAdminsState] = useState<string[]>(() => normalizeAdmins(readStorage("sdn3_admins", DEFAULT_ADMINS)));
  const [stats, setStatsState] = useState<SchoolStat[]>(() => readStorage(storageKeys.stats, schoolStats));
  const [gallery, setGalleryState] = useState<GalleryPhoto[]>(() => readStorage(storageKeys.gallery, galleryPhotos));
  const [faqs, setFaqsState] = useState<FAQItem[]>(() => readStorage(storageKeys.faqs, faqItems));
  const [downloads, setDownloadsState] = useState<DownloadFile[]>(() => readStorage(storageKeys.downloads, downloadFiles));
  const [customHTML, setCustomHTMLState] = useState<string>(() => readStorage("sdn3_custom_html", ""));
  const [siteContent, setSiteContentState] = useState<SiteContent>(() => readStorage("sdn3_site_content", DEFAULT_SITE_CONTENT));
  const [manualLogin, setManualLogin] = useState<ManualLoginConfig | null>(() => readStorage<ManualLoginConfig | null>("sdn3_manual_admin_login", null));
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => readCurrentUser());
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => readStorage("sdn3_is_admin_mode", false));

  const [teachers, setTeachersState] = useState<Teacher[]>(() => readStorage(extraStorageKeys.teachers, defaultTeachers));
  const [facilities, setFacilitiesState] = useState<Facility[]>(() => readStorage(extraStorageKeys.facilities, defaultFacilities));
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(() => readStorage(extraStorageKeys.testimonials, defaultTestimonials));
  const [innovations, setInnovationsState] = useState<Innovation[]>(() => readStorage(extraStorageKeys.innovations, defaultInnovations));

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    const apply = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, storageKey: string, data: T) => {
      if (!cancelled) {
        setter(data);
        writeStorage(storageKey, data);
      }
    };

    const loadCollection = async <T extends CollectionPayload>(
      table: CollectionName,
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      storageKey: string,
      fallback: T[]
    ) => {
      const result = await getCollection<T>(table);
      if (result.error) throw result.error;

      if (result.data && result.data.length > 0) {
        apply(setter, storageKey, result.data);
      } else {
        await upsertCollection(table, fallback as unknown as Array<Record<string, unknown>>);
        apply(setter, storageKey, fallback);
      }
    };

    const loadData = async () => {
      try {
        const settingsResult = await getSetting<{ customHTML?: string }>("customHTML");
        if (settingsResult.error) throw settingsResult.error;

        if (settingsResult.data) {
          apply(setCustomHTMLState, "sdn3_custom_html", settingsResult.data.customHTML || "");
        } else {
          await upsertSetting("customHTML", "");
        }

        const siteContentResult = await getSetting<SiteContent>("siteContent");
        if (siteContentResult.error) throw siteContentResult.error;

        if (siteContentResult.data) {
          apply(setSiteContentState, "sdn3_site_content", siteContentResult.data);
        } else {
          await upsertSetting("siteContent", DEFAULT_SITE_CONTENT);
        }

        const manualLoginResult = await getSetting<ManualLoginConfig>("manualAdminLogin");
        if (manualLoginResult.error) throw manualLoginResult.error;

        if (manualLoginResult.data?.username && manualLoginResult.data.passwordHash) {
          apply(setManualLogin, "sdn3_manual_admin_login", manualLoginResult.data);
        }

        await loadCollection("programs", setProgramsState, storageKeys.programs, schoolPrograms);
        await loadCollection("achievements", setAchievementsState, storageKeys.achievements, schoolAchievements);
        await loadCollection("agendas", setAgendasState, storageKeys.agendas, agendaEvents);
        await loadCollection("news", setNewsState, storageKeys.news, latestNews);
        await loadCollection("stats", setStatsState, storageKeys.stats, schoolStats);
        await loadCollection("gallery", setGalleryState, storageKeys.gallery, galleryPhotos);
        await loadCollection("faqs", setFaqsState, storageKeys.faqs, faqItems);
        await loadCollection("downloads", setDownloadsState, storageKeys.downloads, downloadFiles);

        const loadExtra = async <T,>(key: string, fallback: T[], setter: (v: T[]) => void) => {
          try {
            const result = await getSetting<{ data?: T[] }>(key);
            if (result.error) throw result.error;
            const next = (result.data?.data && result.data.data.length > 0) ? result.data.data : fallback;
            setter(next);
            writeStorage(key, next);
          } catch {
            setter(fallback);
            writeStorage(key, fallback);
          }
        };

        await loadExtra(extraStorageKeys.teachers, defaultTeachers);
        await loadExtra(extraStorageKeys.facilities, defaultFacilities);
        await loadExtra(extraStorageKeys.testimonials, defaultTestimonials);
        await loadExtra(extraStorageKeys.innovations, defaultInnovations);

        const adminsResult = await listAdmins();
        if (adminsResult.error) throw adminsResult.error;

        if (adminsResult.data && adminsResult.data.length > 0) {
          const normalizedAdmins = normalizeAdmins(adminsResult.data);
          await upsertCollection("admins", normalizedAdmins.map((email) => ({ id: email, email })));
          apply(setAdminsState, "sdn3_admins", normalizedAdmins);
        } else {
          await upsertCollection("admins", DEFAULT_ADMINS.map((email) => ({ id: email, email })));
          apply(setAdminsState, "sdn3_admins", DEFAULT_ADMINS);
        }
      } catch (err) {
        console.error("Supabase sync failed, falling back to LocalStorage cached states:", err);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (currentUserEmail) {
      writeStorage("sdn3_current_user", currentUserEmail);
      writeStorage("sdn3_is_admin_mode", true);
      setIsAdminMode(true);
    } else {
      localStorage.removeItem("sdn3_current_user");
      writeStorage("sdn3_is_admin_mode", false);
      setIsAdminMode(false);
    }
  }, [currentUserEmail]);

  const syncCollectionToSupabase = async (table: CollectionName, data: CollectionPayload[]) => {
    if (!isSupabaseConfigured) return;

    try {
      await upsertCollection(table, data as unknown as Array<Record<string, unknown>>);
    } catch (e) {
      console.error(`Error syncing ${table} to Supabase:`, e);
    }
  };

  const setPrograms = (data: Program[]) => {
    setProgramsState(data);
    writeStorage(storageKeys.programs, data);
    syncCollectionToSupabase("programs", data);
  };

  const setAchievements = (data: Achievement[]) => {
    setAchievementsState(data);
    writeStorage(storageKeys.achievements, data);
    syncCollectionToSupabase("achievements", data);
  };

  const setAgendas = (data: AgendaEvent[]) => {
    setAgendasState(data);
    writeStorage(storageKeys.agendas, data);
    syncCollectionToSupabase("agendas", data);
  };

  const setNews = (data: NewsItem[]) => {
    setNewsState(data);
    writeStorage(storageKeys.news, data);
    syncCollectionToSupabase("news", data);
  };

  const setAdmins = async (data: string[]) => {
    const normalizedAdmins = normalizeAdmins(data);
    setAdminsState(normalizedAdmins);
    writeStorage("sdn3_admins", normalizedAdmins);

    if (isSupabaseConfigured) {
      try {
        await upsertCollection("admins", normalizedAdmins.map((email) => ({ id: email, email })));
      } catch (e) {
        console.error("Error syncing admins to Supabase:", e);
      }
    }
  };

  const setStats = (data: SchoolStat[]) => {
    setStatsState(data);
    writeStorage(storageKeys.stats, data);
    syncCollectionToSupabase("stats", data);
  };

  const setGallery = (data: GalleryPhoto[]) => {
    setGalleryState(data);
    writeStorage(storageKeys.gallery, data);
    syncCollectionToSupabase("gallery", data);
  };

  const setFaqs = (data: FAQItem[]) => {
    setFaqsState(data);
    writeStorage(storageKeys.faqs, data);
    syncCollectionToSupabase("faqs", data);
  };

  const setDownloads = (data: DownloadFile[]) => {
    setDownloadsState(data);
    writeStorage(storageKeys.downloads, data);
    syncCollectionToSupabase("downloads", data);
  };

  const syncExtra = (key: string, data: any[]) => {
    if (!isSupabaseConfigured) return;
    try {
      upsertCollection(key, data);
    } catch (e) {
      console.error(`Error syncing ${key} to Supabase:`, e);
    }
  };

  const setTeachers = (data: Teacher[]) => {
    setTeachersState(data);
    writeStorage(extraStorageKeys.teachers, data);
    syncExtra("teachers", data as any);
  };

  const setFacilities = (data: Facility[]) => {
    setFacilitiesState(data);
    writeStorage(extraStorageKeys.facilities, data);
    syncExtra("facilities", data as any);
  };

  const setTestimonials = (data: Testimonial[]) => {
    setTestimonialsState(data);
    writeStorage(extraStorageKeys.testimonials, data);
    syncExtra("testimonials", data as any);
  };

  const setInnovations = (data: Innovation[]) => {
    setInnovationsState(data);
    writeStorage(extraStorageKeys.innovations, data);
    syncExtra("innovations", data as any);
  };

  const updateCustomHTML = async (html: string) => {
    setCustomHTMLState(html);
    writeStorage("sdn3_custom_html", html);

    if (isSupabaseConfigured) {
      try {
        await upsertSetting("customHTML", html);
      } catch (e) {
        console.error("Error saving customHTML settings in Supabase:", e);
      }
    }
  };

  const setSiteContent = async (content: SiteContent) => {
    setSiteContentState(content);
    writeStorage("sdn3_site_content", content);

    if (isSupabaseConfigured) {
      try {
        await upsertSetting("siteContent", content);
      } catch (e) {
        console.error("Error saving siteContent settings in Supabase:", e);
        return { success: false, error: "Gagal menyimpan konten situs." };
      }
    }

    return { success: true };
  };

  const login = async (identifier: string, password?: string) => {
    const trimmedIdentifier = identifier.trim();

    if (password !== undefined) {
      if (!trimmedIdentifier || !password) {
        return { success: false, error: "Username dan password tidak boleh kosong." };
      }

      if (!manualLogin?.username || !manualLogin.passwordHash) {
        return { success: false, error: "Login manual belum diseting di menu admin." };
      }

      const passwordHash = await hashPassword(password);
      const isUsernameValid = manualLogin.username.toLowerCase() === trimmedIdentifier.toLowerCase();

      if (isUsernameValid && passwordHash === manualLogin.passwordHash) {
        setCurrentUserEmail(`manual:${manualLogin.username}`);
        return { success: true };
      }

      return { success: false, error: "Username atau password salah." };
    }

    const trimmedEmail = trimmedIdentifier.toLowerCase();

    if (!trimmedEmail) {
      return { success: false, error: "Email tidak boleh kosong" };
    }

    if (admins.map((a) => a.toLowerCase()).includes(trimmedEmail)) {
      setCurrentUserEmail(trimmedEmail);
      return { success: true };
    }

    return { success: false, error: "Email belum terdaftar sebagai Admin." };
  };

  const logout = () => {
    setCurrentUserEmail(null);
  };

  const addAdmin = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      return { success: false, error: "Email tidak boleh kosong" };
    }

    if (admins.map((a) => a.toLowerCase()).includes(trimmedEmail)) {
      return { success: false, error: "Email admin sudah terdaftar." };
    }

    const updatedAdmins = normalizeAdmins([...admins, trimmedEmail]);
    setAdminsState(updatedAdmins);
    writeStorage("sdn3_admins", updatedAdmins);

    if (isSupabaseConfigured) {
      upsertAdmin(trimmedEmail).catch((err) => {
        console.error("Failed to add admin to Supabase:", err);
      });
    }

    return { success: true };
  };

  const deleteAdmin = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail === PRIMARY_ADMIN_EMAIL) {
      return { success: false, error: `Admin utama (${PRIMARY_ADMIN_EMAIL}) tidak bisa dihapus.` };
    }

    if (currentUserEmail?.toLowerCase() === trimmedEmail) {
      return { success: false, error: "Anda tidak bisa menghapus email Anda sendiri yang sedang aktif." };
    }

    const updatedAdmins = admins.filter((a) => a.toLowerCase() !== trimmedEmail);
    setAdminsState(updatedAdmins);
    writeStorage("sdn3_admins", updatedAdmins);

    if (isSupabaseConfigured) {
      deleteAdminFromSupabase(trimmedEmail).catch((err) => {
        console.error("Failed to delete admin from Supabase:", err);
      });
    }

    return { success: true };
  };

  const updateManualLogin = async (username: string, password: string) => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      return { success: false, error: "Username dan password tidak boleh kosong." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    const nextConfig: ManualLoginConfig = {
      username: trimmedUsername,
      passwordHash: await hashPassword(password),
      updatedAt: new Date().toISOString(),
    };

    setManualLogin(nextConfig);
    writeStorage("sdn3_manual_admin_login", nextConfig);

    if (isSupabaseConfigured) {
      try {
        await upsertSetting("manualAdminLogin", nextConfig);
      } catch (e) {
        console.error("Error saving manual admin login settings in Supabase:", e);
      }
    }

    return { success: true };
  };

  const addProgram = (p: Omit<Program, "id">) => {
    const nextId = "prog-custom-" + Date.now();
    const newProg = { ...p, id: nextId };
    const updated = [...programs, newProg];
    setProgramsState(updated);
    writeStorage(storageKeys.programs, updated);

    if (isSupabaseConfigured) {
      upsertItem("programs", nextId, newProg).catch((err) => {
        console.error("Failed to add program to Supabase:", err);
      });
    }
  };

  const updateProgram = (id: string, updated: Partial<Program>) => {
    const updatedProgs = programs.map((p) => (p.id === id ? { ...p, ...updated } : p));
    setProgramsState(updatedProgs);
    writeStorage(storageKeys.programs, updatedProgs);

    if (isSupabaseConfigured) {
      updateItem("programs", id, updated).catch((err) => {
        console.error("Failed to update program in Supabase:", err);
      });
    }
  };

  const deleteProgram = (id: string) => {
    const updatedProgs = programs.filter((p) => p.id !== id);
    setProgramsState(updatedProgs);
    writeStorage(storageKeys.programs, updatedProgs);

    if (isSupabaseConfigured) {
      deleteItem("programs", id).catch((err) => {
        console.error("Failed to delete program from Supabase:", err);
      });
    }
  };

  const addAchievement = (a: Omit<Achievement, "id">) => {
    const nextId = "ach-custom-" + Date.now();
    const newAch = { ...a, id: nextId };
    const updated = [...achievements, newAch];
    setAchievementsState(updated);
    writeStorage(storageKeys.achievements, updated);

    if (isSupabaseConfigured) {
      upsertItem("achievements", nextId, newAch).catch((err) => {
        console.error("Failed to add achievement to Supabase:", err);
      });
    }
  };

  const updateAchievement = (id: string, updated: Partial<Achievement>) => {
    const updatedAchs = achievements.map((a) => (a.id === id ? { ...a, ...updated } : a));
    setAchievementsState(updatedAchs);
    writeStorage(storageKeys.achievements, updatedAchs);

    if (isSupabaseConfigured) {
      updateItem("achievements", id, updated).catch((err) => {
        console.error("Failed to update achievement in Supabase:", err);
      });
    }
  };

  const deleteAchievement = (id: string) => {
    const updatedAchs = achievements.filter((a) => a.id !== id);
    setAchievementsState(updatedAchs);
    writeStorage(storageKeys.achievements, updatedAchs);

    if (isSupabaseConfigured) {
      deleteItem("achievements", id).catch((err) => {
        console.error("Failed to delete achievement from Supabase:", err);
      });
    }
  };

  const addAgenda = (ag: Omit<AgendaEvent, "id">) => {
    const nextId = "evt-custom-" + Date.now();
    const newAg = { ...ag, id: nextId };
    const updated = [...agendas, newAg];
    setAgendasState(updated);
    writeStorage(storageKeys.agendas, updated);

    if (isSupabaseConfigured) {
      upsertItem("agendas", nextId, newAg).catch((err) => {
        console.error("Failed to add agenda to Supabase:", err);
      });
    }
  };

  const updateAgenda = (id: string, updated: Partial<AgendaEvent>) => {
    const updatedAgs = agendas.map((ag) => (ag.id === id ? { ...ag, ...updated } : ag));
    setAgendasState(updatedAgs);
    writeStorage(storageKeys.agendas, updatedAgs);

    if (isSupabaseConfigured) {
      updateItem("agendas", id, updated).catch((err) => {
        console.error("Failed to update agenda in Supabase:", err);
      });
    }
  };

  const deleteAgenda = (id: string) => {
    const updatedAgs = agendas.filter((ag) => ag.id !== id);
    setAgendasState(updatedAgs);
    writeStorage(storageKeys.agendas, updatedAgs);

    if (isSupabaseConfigured) {
      deleteItem("agendas", id).catch((err) => {
        console.error("Failed to delete agenda from Supabase:", err);
      });
    }
  };

  const addNews = (n: Omit<NewsItem, "id">) => {
    const nextId = "news-custom-" + Date.now();
    const newN = { ...n, id: nextId };
    const updated = [...news, newN];
    setNewsState(updated);
    writeStorage(storageKeys.news, updated);

    if (isSupabaseConfigured) {
      upsertItem("news", nextId, newN).catch((err) => {
        console.error("Failed to add news to Supabase:", err);
      });
    }
  };

  const addTeacher = (t: Omit<Teacher, "id">) => {
    const nextId = "t_" + Date.now();
    const next = { ...t, id: nextId };
    const updated = [...teachers, next];
    setTeachersState(updated);
    writeStorage(extraStorageKeys.teachers, updated);
    syncExtra("teachers", updated);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    const next = teachers.map((t) => (t.id === id ? { ...t, ...updated } : t));
    setTeachersState(next);
    writeStorage(extraStorageKeys.teachers, next);
    syncExtra("teachers", next);
  };

  const deleteTeacher = (id: string) => {
    const next = teachers.filter((t) => t.id !== id);
    setTeachersState(next);
    writeStorage(extraStorageKeys.teachers, next);
    syncExtra("teachers", next);
  };

  const addFacility = (f: Omit<Facility, "id">) => {
    const nextId = "fac-" + Date.now();
    const next = { ...f, id: nextId };
    const updated = [...facilities, next];
    setFacilitiesState(updated);
    writeStorage(extraStorageKeys.facilities, updated);
    syncExtra("facilities", updated);
  };

  const updateFacility = (id: string, updated: Partial<Facility>) => {
    const next = facilities.map((f) => (f.id === id ? { ...f, ...updated } : f));
    setFacilitiesState(next);
    writeStorage(extraStorageKeys.facilities, next);
    syncExtra("facilities", next);
  };

  const deleteFacility = (id: string) => {
    const next = facilities.filter((f) => f.id !== id);
    setFacilitiesState(next);
    writeStorage(extraStorageKeys.facilities, next);
    syncExtra("facilities", next);
  };

  const addTestimonial = (t: Omit<Testimonial, "id">) => {
    const nextId = "tes-" + Date.now();
    const next = { ...t, id: nextId };
    const updated = [...testimonials, next];
    setTestimonialsState(updated);
    writeStorage(extraStorageKeys.testimonials, updated);
    syncExtra("testimonials", updated);
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    const next = testimonials.map((t) => (t.id === id ? { ...t, ...updated } : t));
    setTestimonialsState(next);
    writeStorage(extraStorageKeys.testimonials, next);
    syncExtra("testimonials", next);
  };

  const deleteTestimonial = (id: string) => {
    const next = testimonials.filter((t) => t.id !== id);
    setTestimonialsState(next);
    writeStorage(extraStorageKeys.testimonials, next);
    syncExtra("testimonials", next);
  };

  const addInnovation = (i: Omit<Innovation, "id">) => {
    const nextId = "inno-" + Date.now();
    const next = { ...i, id: nextId };
    const updated = [...innovations, next];
    setInnovationsState(updated);
    writeStorage(extraStorageKeys.innovations, updated);
    syncExtra("innovations", updated);
  };

  const updateInnovation = (id: string, updated: Partial<Innovation>) => {
    const next = innovations.map((i) => (i.id === id ? { ...i, ...updated } : i));
    setInnovationsState(next);
    writeStorage(extraStorageKeys.innovations, next);
    syncExtra("innovations", next);
  };

  const deleteInnovation = (id: string) => {
    const next = innovations.filter((i) => i.id !== id);
    setInnovationsState(next);
    writeStorage(extraStorageKeys.innovations, next);
    syncExtra("innovations", next);
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    const updatedNewsList = news.map((n) => (n.id === id ? { ...n, ...updated } : n));
    setNewsState(updatedNewsList);
    writeStorage(storageKeys.news, updatedNewsList);

    if (isSupabaseConfigured) {
      updateItem("news", id, updated).catch((err) => {
        console.error("Failed to update news in Supabase:", err);
      });
    }
  };

  const deleteNews = (id: string) => {
    const updatedNewsList = news.filter((n) => n.id !== id);
    setNewsState(updatedNewsList);
    writeStorage(storageKeys.news, updatedNewsList);

    if (isSupabaseConfigured) {
      deleteItem("news", id).catch((err) => {
        console.error("Failed to delete news from Supabase:", err);
      });
    }
  };

  return (
    <AdminContext.Provider
      value={{
        programs,
        achievements,
        agendas,
        news,
        admins,
        currentUserEmail,
        isAdminMode,
        manualLoginUsername: manualLogin?.username || "",
        isManualLoginEnabled: Boolean(manualLogin?.username && manualLogin.passwordHash),
        siteContent,
        stats,
        setStats,
        gallery,
        setGallery,
        faqs,
        setFaqs,
        downloads,
        setDownloads,
        customHTML,
        updateCustomHTML,
        setSiteContent,
        updateSiteContent: setSiteContent,
        teachers,
        setTeachers,
        facilities,
        setFacilities,
        testimonials,
        setTestimonials,
        innovations,
        setInnovations,
        setPrograms,
        setAchievements,
        setAgendas,
        setNews,
        setAdmins,
        login,
        logout,
        addProgram,
        updateProgram,
        deleteProgram,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        addAgenda,
        updateAgenda,
        deleteAgenda,
        addNews,
        updateNews,
        deleteNews,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addFacility,
        updateFacility,
        deleteFacility,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addInnovation,
        updateInnovation,
        deleteInnovation,
        addAdmin,
        deleteAdmin,
        updateManualLogin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
}
