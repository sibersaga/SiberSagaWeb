import re

path = r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the old sidebar start
old_sidebar_start = '              <nav className="p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">'
idx_sidebar = content.find(old_sidebar_start)

# Find the end of the old dashboard (before the final closing divs)
# Look for the pattern that closes the old dashboard structure
old_dash_end_pattern = '            </div>\n          </div>\n        </div>\n      </div>\n    </>\n  );'
idx_end = content.rfind('            </div>\n          </div>\n        </div>\n      </div>\n    </>\n  );')

if idx_sidebar == -1 or idx_end == -1:
    print('ERROR: Could not find markers')
    print('Sidebar:', idx_sidebar)
    print('End:', idx_end)
    exit(1)

print(f'Replacing from {idx_sidebar} to {idx_end}')

# Build new fullpage dashboard
new_dashboard = '''              <nav className="p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                <button
                  onClick={() => { setActiveTab("admins"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "admins"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Shield size={14} />
                  Kelola Admin
                </button>

                <button
                  onClick={() => { setActiveTab("programs"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "programs"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Layers size={14} />
                  Kelola Program
                </button>

                <button
                  onClick={() => { setActiveTab("achievements"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "achievements"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Award size={14} />
                  Kelola Prestasi
                </button>

                <button
                  onClick={() => { setActiveTab("agendas"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "agendas"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Calendar size={14} />
                  Kelola Agenda
                </button>

                <button
                  onClick={() => { setActiveTab("news"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "news"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Newspaper size={14} />
                  Kelola Berita
                </button>

                <button
                  onClick={() => { setActiveTab("registrations"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "registrations"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Users size={14} />
                  Pendaftar PPDB
                </button>

                <button
                  onClick={() => { setActiveTab("dev"); setIsAdding(false); setEditingId(null); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap min-w-max transition-all ${
                    activeTab === "dev"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Code size={14} />
                  Editor HTML & JSON
                </button>
                {/* Full‑Page HTML Editor Button */}
                <button
                  onClick={() => setShowFullPageHtmlEditor(true)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                >
                  <Code size={14} />
                  Full‑Page HTML Editor
                </button>
              </nav>

              <div className="mt-auto p-3 border-t border-slate-800 hidden md:block">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  Keluar Akun
                </button>
              </div>
            </div>

            {/* Main Action Working Canvas Workspace */}
            <div className="flex-1 bg-slate-50 p-4 md:p-6 overflow-y-auto flex flex-col gap-5">
'''

content = content[:idx_sidebar] + new_dashboard + content[idx_end:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done - replaced old dashboard with preserved sidebar + scrollable content')
