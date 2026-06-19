import React, { useState, useLayoutEffect, useMemo } from "react";
import { useAdmin } from "../context/AdminContext";
import { X } from "lucide-react";

function buildDefaultHtml(siteContent: any): string {
  if (!siteContent) return "";
  const t = siteContent.topbar || {};
  const h = siteContent.header || {};
  const hero = siteContent.hero || {};
  const w = siteContent.welcome || {};
  const f = siteContent.footer || {};
  const ticker = siteContent.ticker || {};

  const menuLinks = (h.menu || []).map((m: any) => `      <li><a href="#${m.id}">${m.label}</a></li>`).join("\n");

  return [
    "<!DOCTYPE html>",
    "<html lang=\"id\">",
    "<head>",
    "  <meta charset=\"utf-8\" />",
    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />",
    "  <title>${hero.schoolName || 'SDN 3 Purwosari'} - ${[hero.titlePrimary, hero.titleSecondary].filter(Boolean).join(' ')}</title>",
    "</head>",
    "<body>",
    "",
    "  <!-- ========== TOPBAR ========== -->",
    "  <div class=\"topbar\">",
    "    <span>Email: ${t.contactEmail || ''}</span>",
    "    <span>Lokasi: ${t.location || ''}</span>",
    "    <span>Instagram: ${t.instagramUrl || ''}</span>",
    "    <span>YouTube: ${t.youtubeUrl || ''}</span>",
    "  </div>",
    "",
    "  <!-- ========== HEADER / NAVBAR ========== -->",
    "  <header>",
    "    <div class=\"brand\">",
    "      <h1>${h.brandTitle || 'SDN 3 PURWOSARI'}</h1>",
    "      <p>${h.tagline || ''}</p>",
    "    </div>",
    "    <nav>",
    "      <ul>",
    menuLinks ? menuLinks : "        <li><a href=\"#hero\">Beranda</a></li>",
    "      </ul>",
    "    </nav>",
    "    <div class=\"search\">",
    "      <input type=\"text\" placeholder=\"${h.searchPlaceholder || 'Cari...'}\" />",
    "    </div>",
    "  </header>",
    "",
    "  <!-- ========== HERO ========== -->",
    "  <section id=\"hero\" class=\"hero\">",
    "    <span class=\"badge\">${hero.badge || ''}</span>",
    "    <h2>${hero.titlePrimary || ''} <span>${hero.titleSecondary || ''}</span></h2>",
    "    <p>${hero.description || ''}</p>",
    "    <div class=\"cta\">",
    "      <a href=\"#spmb\">${hero.primaryButton || 'PPDB 2026'}</a>",
    "      <a href=\"#sambutan\">${hero.secondaryButton || 'Profil'}</a>",
    "    </div>",
    "  </section>",
    "",
    "  <!-- ========== STATISTIK ========== -->",
    "  <section id=\"stats\" class=\"stats\">",
    "    <h3>Statistik Sekolah</h3>",
    "    <ul>",
    "      <li>Siswa Aktif</li>",
    "      <li>Tenaga Pendidik</li>",
    "      <li>Fasilitas</li>",
    "      <li>Akreditasi</li>",
    "    </ul>",
    "  </section>",
    "",
    "  <!-- ========== SAMBUTAN, VISI, MISI, TUJUAN ========== -->",
    "  <section id=\"sambutan\" class=\"welcome\">",
    "    <h2>${w.title || 'Sambutan, Visi, Misi & Tujuan'}</h2>",
    "    <p>${w.description || ''}</p>",
    "    <article>",
    "      <h3>Sambutan Kepala Sekolah</h3>",
    "      <p>${(w.tabs?.sambutan?.paragraphs || []).join('</p><p>')}</p>",
    "    </article>",
    "    <article>",
    "      <h3>Visi</h3>",
    "      <p>${w.tabs?.visi?.description || ''}</p>",
    "      <ul>",
    "        ${(w.tabs?.visi?.highlights || []).map((x: any) => `<li><b>${x.title}</b>: ${x.desc}</li>`).join('\n        ')}",
    "      </ul>",
    "    </article>",
    "    <article>",
    "      <h3>Misi</h3>",
    "      <ol>",
    "        ${(w.tabs?.misi?.items || []).map((item: string) => `<li>${item}</li>`).join('\n        ')}",
    "      </ol>",
    "    </article>",
    "    <article>",
    "    <h3>Tujuan</h3>",
    "    <ul>",
    "      ${(w.tabs?.tujuan?.goals || []).map((x: any) => `<li><b>${x.title}</b>: ${x.desc}</li>`).join('\n      ')}",
    "    </ul>",
    "    </article>",
    "  </section>",
    "",
    "  <!-- ========== GURU & TENAGA KEPENDIDIKAN ========== -->",
    "  <section id=\"guru\" class=\"teachers\">",
    "    <h2>Guru & Tenaga Kependidikan</h2>",
    "    <p>Daftar pendidik dan staf di SDN 3 Purwosari.</p>",
    "    <!-- Konten guru dimuat dari koleksi 'teachers' -->",
    "  </section>",
    "",
    "  <!-- ========== SARANA & PRASARANA ========== -->",
    "  <section id=\"fasilitas\" class=\"facilities\">",
    "    <h2>Sarana & Prasarana Unggulan</h2>",
    "    <p>Fasilitas penunjang kegiatan belajar mengajar.</p>",
    "    <!-- Konten fasilitas dimuat dari koleksi 'facilities' -->",
    "  </section>",
    "",
    "  <!-- ========== KONDISI MURID & ROMBONGAN BELAJAR ========== -->",
    "  <section id=\"kondisi\" class=\"conditions\">",
    "    <h2>Kondisi Murid & Rombongan Belajar</h2>",
    "    <p>Data sebaran rombongan belajar kelas 1 sampai 6.</p>",
    "    <!-- Konten kondisi siswa dimuat dari data lokal -->",
    "  </section>",
    "",
    "  <!-- ========== PROGRAM KURIKULUM ========== -->",
    "  <section id=\"program\" class=\"programs\">",
    "    <h2>Program Kurikulum</h2>",
    "    <p>Intrakurikuler, Kokurikuler (P5), Ekstrakurikuler, dan Program Unggulan.</p>",
    "    <!-- Konten program dimuat dari koleksi 'programs' -->",
    "  </section>",
    "",
    "  <!-- ========== INOVASI SEKOLAH ========== -->",
    "  <section id=\"inovasi\" class=\"innovations\">",
    "    <h2>Portal Inovasi Sekolah</h2>",
    "    <p>Kumpulkan dan kenalkan inovasi unggulan sekolah.</p>",
    "    <!-- Konten inovasi dimuat dari koleksi 'innovations' -->",
    "  </section>",
    "",
    "  <!-- ========== PRESTASI ========== -->",
    "  <section id=\"prestasi\" class=\"achievements\">",
    "    <h2>Prestasi Kebanggaan Sekolah</h2>",
    "    <p>Pencapaian siswa di tingkat regional dan nasional.</p>",
    "    <!-- Konten prestasi dimuat dari koleksi 'achievements' -->",
    "  </section>",
    "",
    "  <!-- ========== BERITA ========== -->",
    "  <section id=\"berita\" class=\"news\">",
    "    <h2>Berita & Informasi Terbaru</h2>",
    "    <p>Kabar terkini seputar kegiatan dan perkembangan sekolah.</p>",
    "    <!-- Konten berita dimuat dari koleksi 'news' -->",
    "  </section>",
    "",
    "  <!-- ========== AGENDA ========== -->",
    "  <section id=\"agenda\" class=\"agenda\">",
    "    <h2>Agenda Kegiatan Mendatang</h2>",
    "    <p>Jadwal penting dan kegiatan sekolah.</p>",
    "    <!-- Konten agenda dimuat dari koleksi 'agendas' -->",
    "  </section>",
    "",
    "  <!-- ========== GALERI ========== -->",
    "  <section id=\"galeri\" class=\"gallery\">",
    "    <h2>Galeri Foto Pembelajaran & Fasilitas</h2>",
    "    <p>Dokumentasi kegiatan belajar dan fasilitas sekolah.</p>",
    "    <!-- Konten galeri dimuat dari koleksi 'gallery' -->",
    "  </section>",
    "",
    "  <!-- ========== TESTIMONI ========== -->",
    "  <section id=\"testimoni\" class=\"testimonials\">",
    "    <h2>Testimoni Wali Murid</h2>",
    "    <p>Apa kata wali murid tentang SDN 3 Purwosari.</p>",
    "    <!-- Konten testimoni dimuat dari koleksi 'testimonials' -->",
    "  </section>",
    "",
    "  <!-- ========== PUSAT UNDUHAN ========== -->",
    "  <section id=\"download\" class=\"downloads\">",
    "    <h2>Pusat Unduhan SDN 3</h2>",
    "    <p>Brosur, formulir, dan dokumen penting sekolah.</p>",
    "    <!-- Konten unduhan dimuat dari koleksi 'downloads' -->",
    "  </section>",
    "",
    "  <!-- ========== PETA & KONTAK ========== -->",
    "  <section id=\"kontak\" class=\"contact\">",
    "    <h2>Peta Lokasi & Kontak</h2>",
    "    <p>Alamat: ${f.address || ''}</p>",
    "    <p>Telepon: ${f.phone || ''}</p>",
    "    <p>Email: ${f.email || ''}</p>",
    "    <!-- Google Maps / Video profil -->",
    "  </section>",
    "",
    "  <!-- ========== TICKER / PENGUMUMAN ========== -->",
    "  <div class=\"ticker\">",
    "    <strong>${ticker.title || 'Pengumuman Penting'}</strong>",
    "    <marquee>${(ticker.items || []).join(' | ')}</marquee>",
    "  </div>",
    "",
    "  <!-- ========== FOOTER ========== -->",
    "  <footer>",
    "    <div class=\"brand\">",
    "      <h3>${f.brandTitle || ''}</h3>",
    "      <p>${f.tagline || ''}</p>",
    "    </div>",
    "    <nav>",
    "      <h4>${f.quickLinksTitle || 'Akses Cepat'}</h4>",
    "      <ul>",
    "        ${(f.links || []).map((l: any) => `<li><a href=\"#${l.id}\">${l.label}</a></li>`).join('\n        ')}",
    "      </ul>",
    "    </nav>",
    "    <div class=\"contact\">",
    "      <h4>${f.mediaTitle || 'Media Sosial'}</h4>",
    "      <p>${f.address || ''}</p>",
    "      <p>${f.phone || ''}</p>",
    "      <p>${f.email || ''}</p>",
    "    </div>",
    "    <div class=\"bottom\">",
    "      <p>${f.copyright || ''}</p>",
    "      <p>${f.bottomBrand || ''} | NPSN: ${f.npsnInfo || ''}</p>",
    "    </div>",
    "  </footer>",
    "",
    "</body>",
    "</html>"
  ].join("\n");
}

export default function FullPageHtmlEditor({ onClose }: { onClose: () => void }) {
  const { customHTML, updateCustomHTML, siteContent } = useAdmin();
  const initialValue = useMemo(() => (customHTML && customHTML.trim().length > 0 ? customHTML : buildDefaultHtml(siteContent)), [customHTML, siteContent]);
  const [htmlValue, setHtmlValue] = useState(initialValue);
  const [success, setSuccess] = useState(false);

  useLayoutEffect(() => {
    setHtmlValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    updateCustomHTML(htmlValue);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
        <h3 className="font-heading font-extrabold">Full‑Page HTML Editor</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <textarea
          value={htmlValue}
          onChange={e => setHtmlValue(e.target.value)}
          className="w-full h-full border border-slate-200 rounded-xl p-3 text-xs font-medium"
          placeholder="Edit full HTML here..."
        />
      </div>
      <div className="p-4 flex justify-end gap-2 bg-slate-100">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
        >
          Simpan
        </button>
      </div>
      {success && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded">
          Berhasil
        </div>
      )}
    </div>
  );
}
