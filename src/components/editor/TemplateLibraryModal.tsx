import React, { useState, useEffect, useRef } from "react";
import { X, Layout, Box, Globe, Download, Trash2, Upload, FileJson, Save, Plus, AlertCircle, Check } from "lucide-react";
import { PuckTemplate, getPuckTemplates, savePuckTemplate, deletePuckTemplate, downloadJsonFile } from "../../puck/puckTemplates";

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: any;
  dispatch: any;
}

export default function TemplateLibraryModal({ isOpen, onClose, appState, dispatch }: TemplateLibraryModalProps) {
  const [templates, setTemplates] = useState<PuckTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<"full" | "block" | "global">("full");
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);

  // Form states
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [templateCategory, setTemplateCategory] = useState("General");
  const [templateType, setTemplateType] = useState<"full" | "block" | "global">("full");
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      setShowSaveForm(false);
      resetForm();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setIsLoading(true);
    const data = await getPuckTemplates();
    setTemplates(data);
    setIsLoading(false);
  };

  const resetForm = () => {
    setTemplateName("");
    setTemplateDesc("");
    setTemplateCategory("General");
    setTemplateType("full");
    setSelectedBlockIds([]);
  };

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      alert("Nama templat harus diisi!");
      return;
    }

    let templateData: any = null;

    if (templateType === "full") {
      templateData = appState.data;
    } else {
      // Save only selected blocks
      if (selectedBlockIds.length === 0) {
        alert("Pilih setidaknya satu blok untuk disimpan!");
        return;
      }
      // Filter blocks from appState.data.content that are selected
      templateData = appState.data.content.filter((block: any) =>
        selectedBlockIds.includes(block.props.id)
      );
    }

    setIsLoading(true);
    const success = await savePuckTemplate({
      name: templateName,
      type: templateType,
      description: templateDesc,
      category: templateCategory,
      data: templateData,
    });
    setIsLoading(false);

    if (success) {
      alert("Templat berhasil disimpan!");
      resetForm();
      setShowSaveForm(false);
      loadTemplates();
    } else {
      alert("Gagal menyimpan templat!");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus templat ini secara permanen?")) {
      setIsLoading(true);
      const success = await deletePuckTemplate(id);
      setIsLoading(false);
      if (success) {
        loadTemplates();
      } else {
        alert("Gagal menghapus templat!");
      }
    }
  };

  const handleInsert = (template: PuckTemplate) => {
    if (template.type === "full") {
      if (window.confirm("Peringatan: Memasukkan templat Halaman Penuh akan mengganti seluruh tata letak saat ini. Lanjutkan?")) {
        dispatch({ type: "setData", data: template.data });
        onClose();
      }
    } else if (template.type === "block") {
      // Append block(s) to current content
      const currentContent = appState.data.content || [];
      // Generate new IDs for the imported blocks to avoid duplicates
      const newBlocks = template.data.map((block: any) => ({
        ...block,
        props: {
          ...block.props,
          id: `${block.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        }
      }));

      dispatch({
        type: "setData",
        data: {
          ...appState.data,
          content: [...currentContent, ...newBlocks]
        }
      });
      alert("Blok templat berhasil dimasukkan di bagian bawah!");
      onClose();
    } else if (template.type === "global") {
      // Insert GlobalTemplate block referencing this global template ID
      const currentContent = appState.data.content || [];
      const globalBlock = {
        type: "GlobalTemplate",
        props: {
          id: `GlobalTemplate_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          templateId: template.id,
          title: template.name
        }
      };

      dispatch({
        type: "setData",
        data: {
          ...appState.data,
          content: [...currentContent, globalBlock]
        }
      });
      alert("Blok Sinkron (Global) berhasil dimasukkan di bagian bawah!");
      onClose();
    }
  };

  const handleExport = (template: PuckTemplate) => {
    downloadJsonFile(template, `template-${template.type}-${template.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`);
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        // Validate template structure
        if (!parsed.name || !parsed.type || !parsed.data) {
          alert("Format file JSON tidak valid. Pastikan file adalah templat Puck.");
          return;
        }

        setIsLoading(true);
        const success = await savePuckTemplate({
          name: parsed.name,
          type: parsed.type,
          description: parsed.description || "Imported from file",
          category: parsed.category || "Imported",
          data: parsed.data,
        });
        setIsLoading(false);

        if (success) {
          alert("Templat berhasil diimpor ke pustaka!");
          loadTemplates();
        } else {
          alert("Gagal menyimpan templat hasil impor!");
        }
      } catch (err) {
        alert("Gagal membaca file JSON: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredTemplates = templates.filter(t => t.type === activeTab);
  const pageBlocks = appState.data?.content || [];

  const toggleBlockSelection = (id: string) => {
    setSelectedBlockIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllBlocks = () => {
    if (selectedBlockIds.length === pageBlocks.length) {
      setSelectedBlockIds([]);
    } else {
      setSelectedBlockIds(pageBlocks.map((b: any) => b.props.id));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[85vh] border border-slate-100 max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Layout size={22} className="text-blue-600" />
            <div>
              <h2 className="font-bold text-lg text-slate-800">Pustaka Templat (Template Library)</h2>
              <p className="text-xs text-slate-500">Kelola, ekspor, dan impor tata letak halaman & blok</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleJsonImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Upload size={14} />
              <span>Impor JSON</span>
            </button>
            <button
              onClick={() => setShowSaveForm(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Plus size={14} />
              <span>Simpan Templat Baru</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Form Save Template Overlay */}
          {showSaveForm && (
            <div className="absolute inset-0 bg-white z-20 p-6 overflow-y-auto animate-slideUp">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Save className="text-blue-600" size={20} />
                    <h3 className="font-bold text-lg text-slate-800">Simpan Tata Letak Sebagai Templat</h3>
                  </div>
                  <button
                    onClick={() => setShowSaveForm(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Templat *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Header Keren, Landing Page V1"
                        value={templateName}
                        onChange={e => setTemplateName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Kategori</label>
                      <input
                        type="text"
                        placeholder="Contoh: Hero, Footer, Landing"
                        value={templateCategory}
                        onChange={e => setTemplateCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Jenis Templat</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setTemplateType("full")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          templateType === "full"
                            ? "border-blue-600 bg-blue-50/50 text-blue-700"
                            : "border-slate-150 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <Layout size={24} />
                        <span className="text-xs font-bold">Halaman Penuh</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTemplateType("block")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          templateType === "block"
                            ? "border-blue-600 bg-blue-50/50 text-blue-700"
                            : "border-slate-150 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <Box size={24} />
                        <span className="text-xs font-bold">Bagian / Blok</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTemplateType("global")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          templateType === "global"
                            ? "border-blue-600 bg-blue-50/50 text-blue-700"
                            : "border-slate-150 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <Globe size={24} />
                        <span className="text-xs font-bold">Templat Global</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Deskripsi Singkat</label>
                    <textarea
                      placeholder="Masukkan penjelasan singkat mengenai kegunaan templat ini..."
                      value={templateDesc}
                      onChange={e => setTemplateDesc(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    />
                  </div>

                  {/* Checklist Blok Halaman (Hanya jika tipe Blok atau Global) */}
                  {(templateType === "block" || templateType === "global") && (
                    <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-700">Pilih Blok yang Ingin Dimasukkan ({selectedBlockIds.length}/{pageBlocks.length})</span>
                        <button
                          type="button"
                          onClick={selectAllBlocks}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                        >
                          {selectedBlockIds.length === pageBlocks.length ? "Batal Pilih Semua" : "Pilih Semua"}
                        </button>
                      </div>

                      {pageBlocks.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-500">
                          Tidak ada blok yang ditemukan di editor. Silakan tambahkan beberapa blok terlebih dahulu.
                        </div>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                          {pageBlocks.map((block: any) => {
                            const isSelected = selectedBlockIds.includes(block.props.id);
                            return (
                              <div
                                key={block.props.id}
                                onClick={() => toggleBlockSelection(block.props.id)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-white border-blue-500 shadow-sm"
                                    : "bg-white/50 border-slate-200 hover:bg-white hover:border-slate-350"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                  isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                                }`}>
                                  {isSelected && <Check size={12} />}
                                </div>
                                <span className="font-semibold text-slate-700">{block.type}</span>
                                <span className="text-xs text-slate-400 truncate max-w-[200px]">ID: {block.props.id}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {templateType === "global" && (
                    <div className="flex gap-2 items-start text-xs text-amber-700 bg-amber-50 p-3.5 rounded-xl border border-amber-100">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Informasi Templat Global:</span> Templat global akan bertindak sebagai blok sinkron. Jika Anda merubah isi templat global ini di kemudian hari, semua halaman yang memuat blok global ini akan ter-update secara otomatis.
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowSaveForm(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? "Menyimpan..." : "Simpan Templat"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Left Sidebar (Categories Tabs) */}
          <div className="w-56 border-r border-slate-100 bg-slate-50/50 flex flex-col p-4 gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Jenis Templat</span>
            
            <button
              onClick={() => setActiveTab("full")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "full"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Layout size={18} />
              <span>Halaman Penuh</span>
            </button>

            <button
              onClick={() => setActiveTab("block")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "block"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Box size={18} />
              <span>Bagian / Blok</span>
            </button>

            <button
              onClick={() => setActiveTab("global")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "global"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Globe size={18} />
              <span>Templat Global</span>
            </button>
          </div>

          {/* Main List Grid */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/20">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-500 font-semibold">
                Memuat data templat...
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <FileJson size={48} className="text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">Tidak Ada Templat</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Belum ada templat jenis {activeTab === "full" ? "Halaman Penuh" : activeTab === "block" ? "Bagian/Blok" : "Global"} yang disimpan.
                </p>
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="mt-4 px-4 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Buat Pertama Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTemplates.map(tpl => (
                  <div
                    key={tpl.id}
                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex flex-col overflow-hidden group"
                  >
                    {/* Visual Card Representation */}
                    <div className="h-28 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative group-hover:bg-blue-50/20 transition-all">
                      {tpl.type === "full" ? (
                        <Layout className="text-slate-300 group-hover:text-blue-400 transition-colors" size={40} />
                      ) : tpl.type === "block" ? (
                        <Box className="text-slate-300 group-hover:text-blue-400 transition-colors" size={40} />
                      ) : (
                        <Globe className="text-slate-300 group-hover:text-blue-400 transition-colors" size={40} />
                      )}
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-bold uppercase">
                        {tpl.category}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{tpl.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 h-8 font-normal">
                          {tpl.description || "Tidak ada deskripsi."}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-[10px] text-slate-400">
                          {new Date(tpl.createdAt).toLocaleDateString("id-ID", { dateStyle: "short" })}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(tpl.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Templat"
                          >
                            <Trash2 size={15} />
                          </button>
                          <button
                            onClick={() => handleExport(tpl)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Ekspor sebagai JSON"
                          >
                            <Download size={15} />
                          </button>
                          <button
                            onClick={() => handleInsert(tpl)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Sisipkan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
