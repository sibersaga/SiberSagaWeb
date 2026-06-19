import re

path = r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with "/* ADMIN DASHBOARD WORKSPACE */"
dashboard_start = None
for i, line in enumerate(lines):
    if 'ADMIN DASHBOARD WORKSPACE' in line:
        dashboard_start = i
        break

if dashboard_start is None:
    print('ERROR: Dashboard start not found')
    exit(1)

# Find the end of the component
# Look for the last </div>\n    </>\n  );\n} pattern
end_idx = None
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == '}':
        # Check if this is the final closing brace of the component
        if i+1 < len(lines) and lines[i+1].strip() == '':
            end_idx = i
            break

print(f'Dashboard starts at line {dashboard_start+1}')
print(f'Component ends at line {end_idx+1}')

# Build new dashboard content
new_dashboard = '''        ) : (
          /* FULLPAGE ADMIN WORKSPACE */
          <div className="fixed inset-0 top-[108px] bg-slate-50 overflow-y-auto scroll-smooth" id="admin-fullpage">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8 pb-24">

              {/* ===== TOPBAR ===== */}
              <section id="admin-section-topbar" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Globe size={18}/> Kelola Topbar</h3>
                </div>
                <p className="text-[11px] text-slate-500">Atur informasi kontak dan tautan media sosial di bagian atas website.</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Email Kontak</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.topbar.contactEmail} onChange={e => setSiteContent({...siteContent, topbar: {...siteContent.topbar, contactEmail: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Lokasi</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.topbar.location} onChange={e => setSiteContent({...siteContent, topbar: {...siteContent.topbar, location: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Instagram URL</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.topbar.instagramUrl} onChange={e => setSiteContent({...siteContent, topbar: {...siteContent.topbar, instagramUrl: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">YouTube URL</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.topbar.youtubeUrl} onChange={e => setSiteContent({...siteContent, topbar: {...siteContent.topbar, youtubeUrl: e.target.value}})} />
                  </div>
                </div>
              </section>

              {/* ===== HEADER ===== */}
              <section id="admin-section-header" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Menu size={18}/> Kelola Header</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Brand Title</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.header.brandTitle} onChange={e => setSiteContent({...siteContent, header: {...siteContent.header, brandTitle: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Tagline</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.header.tagline} onChange={e => setSiteContent({...siteContent, header: {...siteContent.header, tagline: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Search Placeholder</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.header.searchPlaceholder} onChange={e => setSiteContent({...siteContent, header: {...siteContent.header, searchPlaceholder: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Share Text</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.header.shareText} onChange={e => setSiteContent({...siteContent, header: {...siteContent.header, shareText: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Share Title</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.header.shareTitle} onChange={e => setSiteContent({...siteContent, header: {...siteContent.header, shareTitle: e.target.value}})} />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-[10px] uppercase font-extrabold text-slate-500 mb-2">Menu Navigasi</p>
                  <div className="space-y-2">
                    {(siteContent.header.menu || []).map((m, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-32" value={m.label} onChange={e => { const next = [...siteContent.header.menu]; next[i] = {...next[i], label: e.target.value}; setSiteContent({...siteContent, header: {...siteContent.header, menu: next}}); }} />
                        <input className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs flex-1" value={m.id} onChange={e => { const next = [...siteContent.header.menu]; next[i] = {...next[i], id: e.target.value}; setSiteContent({...siteContent, header: {...siteContent.header, menu: next}}); }} />
                        <button onClick={() => setSiteContent({...siteContent, header: {...siteContent.header, menu: siteContent.header.menu.filter((_,x) => x!==i)}})} className="text-red-500"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    <button onClick={() => setSiteContent({...siteContent, header: {...siteContent.header, menu: [...(siteContent.header.menu || []), {id: 'new-'+Date.now(), label: 'Menu Baru'}]}})} className="text-xs text-blue-600 font-bold flex items-center gap-1"><Plus size={14}/> Tambah Menu</button>
                  </div>
                </div>
              </section>

              {/* ===== HERO ===== */}
              <section id="admin-section-hero" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Star size={18}/> Kelola Judul & Hero</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Badge</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.hero.badge} onChange={e => setSiteContent({...siteContent, hero: {...siteContent.hero, badge: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Nama Sekolah</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.hero.schoolName} onChange={e => setSiteContent({...siteContent, hero: {...siteContent.hero, schoolName: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Judul Utama</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.hero.titlePrimary} onChange={e => setSiteContent({...siteContent, hero: {...siteContent.hero, titlePrimary: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Judul Kedua</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.hero.titleSecondary} onChange={e => setSiteContent({...siteContent, hero: {...siteContent.hero, titleSecondary: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Deskripsi</label>
                    <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.hero.description} onChange={e => setSiteContent({...siteContent, hero: {...siteContent.hero, description: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Tombol Utama</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.hero.primaryButton} onChange={e => setSiteContent({...siteContent, hero: {...siteContent.hero, primaryButton: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Tombol Kedua</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.hero.secondaryButton} onChange={e => setSiteContent({...siteContent, hero: {...siteContent.hero, secondaryButton: e.target.value}})} />
                  </div>
                </div>
              </section>

              {/* ===== SAMBUTAN/VISI/MISI/TUJUAN ===== */}
              <section id="admin-section-welcome" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><BookOpen size={18}/> Kelola Sambutan, Visi, Misi & Tujuan</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Eyebrow</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.eyebrow} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, eyebrow: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Judul Section</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, title: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Deskripsi</label>
                    <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.description} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, description: e.target.value}})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Sambutan</p>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.tabs.sambutan.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, sambutan: {...siteContent.welcome.tabs.sambutan, title: e.target.value}}}})} />
                  <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.tabs.sambutan.paragraphs.join("\\n")} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, sambutan: {...siteContent.welcome.tabs.sambutan, paragraphs: e.target.value.split("\\n")}}}})} />

                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Visi</p>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.tabs.visi.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, visi: {...siteContent.welcome.tabs.visi, title: e.target.value}}}})} />
                  <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.tabs.visi.description} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, visi: {...siteContent.welcome.tabs.visi, description: e.target.value}}}})} />

                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Misi</p>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.tabs.misi.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, misi: {...siteContent.welcome.tabs.misi, title: e.target.value}}}})} />
                  <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.tabs.misi.items.join("\\n")} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, misi: {...siteContent.welcome.tabs.misi, items: e.target.value.split("\\n")}}}})} />

                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Tujuan</p>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.tabs.tujuan.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, tujuan: {...siteContent.welcome.tabs.tujuan, title: e.target.value}}}})} />
                  <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.tabs.tujuan.goals.map(g => g.title + ': ' + g.desc).join("\\n")} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, tujuan: {...siteContent.welcome.tabs.tujuan, goals: e.target.value.split("\\n").map(line => { const [title, ...rest] = line.split(': '); return { title: title || line, desc: rest.join(': ') || '' }; })}}}})} />
                </div>
              </section>

              {/* ===== GURU & TENAGA KEPENDIDIKAN ===== */}
              <section id="admin-section-teachers" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Users size={18}/> Kelola Guru & Tenaga Kependidikan</h3>
                <p className="text-[11px] text-slate-500">Kelola daftar pendidik dan staf. Gunakan tombol edit/hapus pada komponen Teachers halaman depan, atau kelola di sini.</p>
                <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  Pengelolaan data guru dilakukan melalui komponen <strong>Teachers</strong> di halaman utama. Data tersimpan di koleksi <code>teachers</code>.
                </div>
              </section>

              {/* ===== SARANA & PRASARANA ===== */}
              <section id="admin-section-facilities" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Building2 size={18}/> Kelola Sarana & Prasarana Unggulan</h3>
                <p className="text-[11px] text-slate-500">Data fasilitas sekolah dikelola melalui komponen <strong>SchoolFacilities</strong> di halaman utama. Koleksi: <code>facilities</code>.</p>
                <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  Untuk menambah/mengubah fasilitas, gunakan panel admin pada komponen Sarana & Prasarana di website.
                </div>
              </section>

              {/* ===== KONDISI MURID & ROMBONGAN ===== */}
              <section id="admin-section-conditions" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><UserCheck size={18}/> Kelola Kondisi Murid & Rombongan Belajar</h3>
                <p className="text-[11px] text-slate-500">Data kondisi siswa dan rombongan belajar ditampilkan otomatis dari <strong>SchoolConditions</strong>.</p>
                <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  Data ini bersifat statik terkait kondisi aktual. Hubungi administrator untuk pembaruan data.
                </div>
              </section>

              {/* ===== INTRAKURIKULER ===== */}
              <section id="admin-section-intrakurikuler" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><BookMarked size={18}/> Kelola Intrakurikuler</h3>
                <p className="text-[11px] text-slate-500">Program intrakurikuler adalah kurikulum wajib kelas. Kelola via koleksi <code>programs</code> dengan kategori <strong>Intrakurikuler</strong>.</p>
              </section>

              {/* ===== KOKURIKULER ===== */}
              <section id="admin-section-kokurikuler" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Puzzle size={18}/> Kelola Kokurikuler</h3>
                <p className="text-[11px] text-slate-500">Program kokurikuler (P5 / Projek Penguatan Profil Pelajar Pancasila). Kelola via koleksi <code>programs</code> dengan kategori <strong>Kokurikuler</strong>.</p>
              </section>

              {/* ===== PROGRAM UNGGULAN ===== */}
              <section id="admin-section-program-unggulan" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Trophy size={18}/> Kelola Program Unggulan</h3>
                <p className="text-[11px] text-slate-500">Program unggulan sekolah. Kelola via koleksi <code>programs</code> dengan kategori <strong>Unggulan</strong>.</p>
              </section>

              {/* ===== EKSTRAKURIKULER ===== */}
              <section id="admin-section-ekstrakurikuler" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Sparkles size={18}/> Kelola Ekstrakurikuler</h3>
                <p className="text-[11px] text-slate-500">Klub ekstrakurikuler (olahraga, seni, pramuka, dll). Kelola via koleksi <code>programs</code> dengan kategori <strong>Ekstrakurikuler</strong>.</p>
              </section>

              {/* ===== PRESTASI ===== */}
              <section id="admin-section-achievements" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Award size={18}/> Kelola Prestasi Kebanggaan Sekolah</h3>
                <p className="text-[11px] text-slate-500">Tambah, edit, atau hapus data prestasi siswa.</p>
                <div className="space-y-3">
                  {achievements.map(ach => (
                    <div key={ach.id} className="flex items-start justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{ach.title}</p>
                        <p className="text-[10px] text-slate-500">{ach.rank} • {ach.year} • {ach.level}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleAchievementEditInit(ach)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={12}/></button>
                        <button onClick={() => handleAchievementDelete(ach.id, ach.title)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                  {!isAdding ? (
                    <button onClick={() => { setIsAdding(true); setEditingId(null); setAchievementForm({title:'', rank:'', level:'', year:new Date().getFullYear().toString(), category:'Akademik', image:''}); }} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer">
                      + Tambah Prestasi
                    </button>
                  ) : (
                    <form onSubmit={handleAchievementSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                      <input className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Judul Prestasi" value={achievementForm.title} onChange={e => setAchievementForm({...achievementForm, title: e.target.value})} required />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Peringkat" value={achievementForm.rank} onChange={e => setAchievementForm({...achievementForm, rank: e.target.value})} />
                        <input className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Tingkat" value={achievementForm.level} onChange={e => setAchievementForm({...achievementForm, level: e.target.value})} />
                      </div>
                      <input className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Tahun" value={achievementForm.year} onChange={e => setAchievementForm({...achievementForm, year: e.target.value})} />
                      <input className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs" placeholder="URL Gambar (opsional)" value={achievementForm.image} onChange={e => setAchievementForm({...achievementForm, image: e.target.value})} />
                      <div className="flex gap-2">
                        <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Simpan</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Batal</button>
                      </div>
                    </form>
                  )}
                </div>
              </section>

              {/* ===== INOVASI SEKOLAH ===== */}
              <section id="admin-section-innovations" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Lightbulb size={18}/> Kelola Portal Inovasi Sekolah</h3>
                <p className="text-[11px] text-slate-500">Tambah, edit, atau hapus inovasi unggulan sekolah.</p>
                <div className="space-y-3">
                  {innovations.map(inno => (
                    <div key={inno.id} className="flex items-start justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{inno.title}</p>
                        <p className="text-[10px] text-slate-500">{inno.badge}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => {/* edit innovation */}} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={12}/></button>
                        <button onClick={() => deleteInnovation(inno.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => {/* add innovation */}} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer">
                    + Tambah Inovasi
                  </button>
                </div>
              </section>

              {/* ===== BERITA ===== */}
              <section id="admin-section-news" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Newspaper size={18}/> Kelola Berita & Informasi Terbaru</h3>
                <div className="space-y-3">
                  {news.map(n => (
                    <div key={n.id} className="flex items-start justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[10px] text-slate-500">{n.date} • {n.category} • {n.author}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleNewsEditInit(n)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={12}/></button>
                        <button onClick={() => handleNewsDelete(n.id, n.title)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ===== AGENDA ===== */}
              <section id="admin-section-agenda" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Calendar size={18}/> Kelola Agenda Kegiatan Mendatang</h3>
                <div className="space-y-3">
                  {agendas.map(ag => (
                    <div key={ag.id} className="flex items-start justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{ag.title}</p>
                        <p className="text-[10px] text-slate-500">{ag.day}, {ag.date} • {ag.time} • {ag.location}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleAgendaEditInit(ag)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={12}/></button>
                        <button onClick={() => handleAgendaDelete(ag.id, ag.title)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ===== GALERI ===== */}
              <section id="admin-section-gallery" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Image size={18}/> Kelola Galeri Foto Pembelajaran & Fasilitas</h3>
                <p className="text-[11px] text-slate-500">Kelola foto dokumentasi via JSON editor atau komponen Gallery.</p>
                <button onClick={() => setActiveTab('dev')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Buka Editor JSON Galeri</button>
              </section>

              {/* ===== TESTIMONI ===== */}
              <section id="admin-section-testimonials" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><MessageSquare size={18}/> Kelola Testimoni Wali Murid</h3>
                <p className="text-[11px] text-slate-500">Testimoni wali murid ditampilkan otomatis. Untuk mengedit, gunakan komponen Testimonials di halaman utama atau edit JSON di tab Developer.</p>
                <button onClick={() => setActiveTab('dev')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Buka Editor JSON Testimoni</button>
              </section>

              {/* ===== UNDUHAN ===== */}
              <section id="admin-section-downloads" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Download size={18}/> Kelola Pusat Unduhan SDN 3</h3>
                <p className="text-[11px] text-slate-500">Kelola berkas unduhan (brosur, formulir, kalender) via JSON editor.</p>
                <button onClick={() => setActiveTab('dev')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Buka Editor JSON Unduhan</button>
              </section>

              {/* ===== KONTAK ===== */}
              <section id="admin-section-contact" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><MapPin size={18}/> Kelola Peta Lokasi & Kontak</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Alamat</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.footer.address} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, address: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Telepon</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.footer.phone} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, phone: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Email</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.footer.email} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, email: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Website</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.footer.adminButton} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, adminButton: e.target.value}})} />
                  </div>
                </div>
              </section>

              {/* ===== FOOTER / BRAND ===== */}
              <section id="admin-section-footer" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-4">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><LayoutTemplate size={18}/> Kelola Footer</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Brand Title</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.footer.brandTitle} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, brandTitle: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Tagline</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.footer.tagline} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, tagline: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Deskripsi</label>
                    <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.footer.description} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, description: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">Copyright</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.footer.copyright} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, copyright: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block mb-1">NPSN Info</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.footer.npsnInfo} onChange={e => setSiteContent({...siteContent, footer: {...siteContent.footer, npsnInfo: e.target.value}})} />
                  </div>
                </div>
              </section>

            </div>
          </div>
'''

# Replace everything from dashboard_start to end_idx
new_lines = lines[:dashboard_start] + [new_dashboard] + lines[end_idx:]
content = ''.join(new_lines)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Replaced lines {dashboard_start+1} to {end_idx+1} with fullpage layout')
