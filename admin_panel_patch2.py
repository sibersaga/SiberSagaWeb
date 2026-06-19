import re

path = r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the old dashboard workspace (after login form closing div)
old_dashboard_start_marker = '        ) : (\n          /* ADMIN DASHBOARD WORKSPACE */'
idx_start = content.find(old_dashboard_start_marker)
if idx_start == -1:
    print('ERROR: Dashboard start marker not found')
    exit(1)

# Find the end of the component (last lines: </div>\n      </div>\n    </>\n  );\n})
idx_end = content.rfind('    </>\n  );\n}')
if idx_end == -1:
    print('ERROR: Component end marker not found')
    exit(1)

print(f'Replacing from index {idx_start} to {idx_end}')
print('Old dashboard length:', idx_end - idx_start)

# Build new fullpage sections
new_dashboard = '''        ) : (
          /* FULLPAGE ADMIN WORKSPACE */
          <div className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-10 pb-24">

              {/* ===== TOPBAR ===== */}
              <section id="admin-section-topbar" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-2">
                <h3 className="font-heading font-extrabold text-slate-800 flex items-center gap-2"><Globe size={18}/> Kelola Topbar</h3>
                <p className="text-[11px] text-slate-500">Atur informasi kontak dan tautan media sosial yang ditampilkan di bagian atas website.</p>
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
              <section id="admin-section-header" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-2">
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
              <section id="admin-section-hero" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-2">
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

              {/* ===== WELCOME (SAMBUTAN/VISI/MISI/TUJUAN) ===== */}
              <section id="admin-section-welcome" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 scroll-mt-2">
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
                {/* Tabs editor */}
                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Sambutan</p>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.tabs.sambutan.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, sambutan: {...siteContent.welcome.tabs.sambutan, title: e.target.value}}}})} placeholder="Judul Sambutan"/>
                  <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.tabs.sambutan.paragraphs.join('\\n')} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, sambutan: {...siteContent.welcome.tabs.sambutan, paragraphs: e.target.value.split('\\n')}}}})} />

                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Visi</p>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.tabs.visi.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, visi: {...siteContent.welcome.tabs.visi, title: e.target.value}}}})} placeholder="Judul Visi"/>
                  <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.tabs.visi.description} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, visi: {...siteContent.welcome.tabs.visi, description: e.target.value}}}})} />

                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Misi</p>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.tabs.misi.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, misi: {...siteContent.welcome.tabs.misi, title: e.target.value}}}})} placeholder="Judul Misi"/>
                  <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.tabs.misi.items.join('\\n')} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, misi: {...siteContent.welcome.tabs.misi, items: e.target.value.split('\\n')}}}})} />

                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Tujuan</p>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" value={siteContent.welcome.tabs.tujuan.title} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, tujuan: {...siteContent.welcome.tabs.tujuan, title: e.target.value}}}})} placeholder="Judul Tujuan"/>
                  <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-20" value={siteContent.welcome.tabs.tujuan.goals.map(g => g.title + ': ' + g.desc).join('\\n')} onChange={e => setSiteContent({...siteContent, welcome: {...siteContent.welcome, tabs: {...siteContent.welcome.tabs, tujuan: {...siteContent.welcome.tabs.tujuan, goals: e.target.value.split('\\n').map(line => { const [title, ...rest] = line.split(': '); return { title: title || line, desc: rest.join(': ') || '' }; })}}}})} />
                </div>
              </section>
'''

content = content[:idx_start] + new_dashboard + content[idx_end:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched dashboard up to welcome section')
