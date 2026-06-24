/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchoolStat {
  id: string;
  count: number;
  suffix?: string;
  label: string;
  icon: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  category: "unggulan" | "ekskul" | "intrakurikuler" | "kokurikuler";
  icon: string;
  color: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  author: string;
}

export interface Achievement {
  id: string;
  title: string;
  rank: string;
  level: string;
  year: string;
  category: string;
  image: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string; // "DD MMM YYYY" format
  day: string; // e.g., "15"
  month: string; // e.g., "Jun"
  time: string;
  location: string;
  category: "akademik" | "umum" | "spmb";
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: "fasilitas" | "kegiatan" | "siswa" | "guru";
  image: string;
  description: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface DownloadFile {
  id: string;
  title: string;
  size: string;
  type: string;
  downloads: number;
  url: string;
}

export interface RegistrationData {
  studentName: string;
  nik: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  parentName: string;
  parentPhone: string;
  address: string;
  pathway: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Facility {
  id: string;
  name: string;
  qty: string;
  status: string;
  desc: string;
  image: string;
}

export interface Testimonial {
  id: string;
  text: string;
  name: string;
  role: string;
  image: string;
}

export interface Innovation {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  colorTheme: string;
  iconName: string;
  stats: Array<{ label: string; value: string; sub: string; iconName: string }>;
  steps: Array<{ title: string; desc: string }>;
  impactTitle: string;
  impactDesc: string;
}

export interface ServiceFile {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  url?: string;
}
