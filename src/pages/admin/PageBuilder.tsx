import React, { useState, useEffect } from "react";
import { Puck, usePuck, Render } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import { config } from "../../puck/config";
import { EditorProvider } from "../../context/EditorContext";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import { getPuckDraftData, getPuckPublishedData, savePuckDraft, publishPuckData } from "../../puck/puckSupabase";
import RevisionHistoryModal from "../../components/editor/RevisionHistoryModal";
import TemplateLibraryModal from "../../components/editor/TemplateLibraryModal";
import AssetManagerModal from "../../components/editor/AssetManagerModal";
import RoleGuard from "../../components/admin/RoleGuard";
import { getPuckTemplates } from "../../puck/puckTemplates";
import { buildDynamicLayout } from "../../puck/puckUtils";
import { Clock, Save, Layout, Download, ImageIcon, Check, AlertCircle, Eye } from "lucide-react";

// defaultLayout is now built dynamically from AdminContext data in the PageBuilder component below.

// ─── Role Indicator Component ───────────────────────────────────────────────────
function RoleIndicator() {
  const { role, loading } = useAuth();
  const [showHint, setShowHint] = useState(false);

  if (loading) return null;

  const roleLabels: Record<string, { label: string; color: string; icon: any }> = {
    admin: { label: "Admin", color: "bg-purple-100 text-purple-700", icon: Check },
    editor: { label: "Editor", color: "bg-blue-100 text-blue-700", icon: Check },
    designer: { label: "Designer", color: "bg-emerald-100 text-emerald-700", icon: AlertCircle },
    viewer: { label: "Viewer", color: "bg-slate-100 text-slate-700", icon: AlertCircle },
  };

  const roleInfo = role ? roleLabels[role as string] : null;

  if (!roleInfo) return null;

  return (
    <div 
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.25rem 0.6rem",
        borderRadius: "999px",
        fontSize: "0.7rem",
        fontWeight: 600,
        cursor: "pointer",
        position: "relative",
      }}
      className={roleInfo.color}
      onMouseEnter={() => setShowHint(true)}
      onMouseLeave={() => setShowHint(false)}
    >
      <roleInfo.icon size={12} />
      <span>{roleInfo.label}</span>
      {showHint && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: "0",
          marginTop: "0.25rem",
          padding: "0.5rem 0.75rem",
          backgroundColor: "#1e293b",
          color: "white",
          borderRadius: "0.5rem",
          fontSize: "0.7rem",
          zIndex: 100,
          maxWidth: "280px",
          whiteSpace: "nowrap",
        }}>
          {role === "admin" && "Akses penuh: edit, publish, kelola user, kelola aset"}
          {role === "editor" && "Bisa mengedit dan menyimpan draft, tidak bisa publish"}
          {role === "designer" && "Hanya bisa mengedit tampilan (styling)"}
          {role === "viewer" && "Hanya bisa melihat preview, tidak bisa mengedit"}
        </div>
      )}
    </div>
  );
}

// Custom action buttons in the Puck header
const CustomHeaderActions = ({ 
  children, 
  onOpenHistory,
  isTemplatesOpen,
  setIsTemplatesOpen,
  isAssetsOpen,
  setIsAssetsOpen,
  loadTemplates,
  showPreview,
  setShowPreview
}: { 
  children: React.ReactNode, 
  onOpenHistory: () => void,
  isTemplatesOpen: boolean,
  setIsTemplatesOpen: (open: boolean) => void,
  isAssetsOpen: boolean,
  setIsAssetsOpen: (open: boolean) => void,
  loadTemplates: () => void,
  showPreview: boolean,
  setShowPreview: (show: boolean) => void
}) => {
  const { appState, dispatch } = usePuck();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const success = await savePuckDraft(appState.data);
    setIsSaving(false);
    if (success) {
      alert("Draft berhasil disimpan!");
    } else {
      alert("Gagal menyimpan draft!");
    }
  };

  const handleExportPage = () => {
    const fileName = `page-export-${Date.now()}.json`;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(appState.data, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        type="button"
        onClick={onOpenHistory}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer font-medium"
      >
        <Clock size={16} />
        <span className="hidden md:inline">Riwayat</span>
      </button>

      <button 
        type="button"
        onClick={() => setIsTemplatesOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer font-medium"
      >
        <Layout size={16} className="text-blue-500" />
        <span className="hidden md:inline">Templates</span>
      </button>

      <button 
        type="button"
        onClick={handleExportPage}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer font-medium"
      >
        <Download size={16} />
        <span className="hidden md:inline">Export Page</span>
      </button>

      <button 
        type="button"
        onClick={() => setIsAssetsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer font-medium"
      >
        <ImageIcon size={16} className="text-emerald-500" />
        <span className="hidden md:inline">Assets</span>
      </button>

      <button 
        type="button"
        onClick={() => setShowPreview(!showPreview)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer font-medium ${
          showPreview 
            ? "bg-slate-800 text-white hover:bg-slate-700" 
            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
        }`}
      >
        <Eye size={16} className={showPreview ? "text-blue-400" : ""} />
        <span className="hidden md:inline">{showPreview ? "Sembunyikan Preview" : "Live Preview"}</span>
      </button>
      
      <button 
        type="button"
        onClick={handleSaveDraft}
        disabled={isSaving}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors cursor-pointer font-medium disabled:opacity-50"
      >
        <Save size={16} />
        <span className="hidden md:inline">{isSaving ? "Menyimpan..." : "Save Draft"}</span>
      </button>

      {/* Render the default Publish button inside RoleGuard - only Admin can publish */}
      <RoleGuard requiredRole="admin" silent>
        {children}
      </RoleGuard>

      {/* Role indicator for non-admin users */}
      <RoleIndicator />

      <TemplateLibraryModal 
        isOpen={isTemplatesOpen} 
        onClose={() => {
          setIsTemplatesOpen(false);
          loadTemplates();
        }}
        appState={appState}
        dispatch={dispatch}
      />
      <AssetManagerModal
        isOpen={isAssetsOpen}
        onClose={() => setIsAssetsOpen(false)}
      />
    </div>
  );
};

export default function PageBuilder() {
  const [initialData, setInitialData] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [puckKey, setPuckKey] = useState(0); // Used to force remount Puck on restore
  const [dynamicConfig, setDynamicConfig] = useState(config);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"preview" | "html" | "json">("preview");
  const [jsonText, setJsonText] = useState("");
  const [renderedHtml, setRenderedHtml] = useState("");
  const previewRef = React.useRef<HTMLDivElement>(null);

  // Get live data from AdminContext as fallback layout source
  const { siteContent, programs, teachers, stats, achievements, innovations, news } = useAdmin();

  const loadTemplates = async () => {
    try {
      const list = await getPuckTemplates();
      const globalTemplates = list.filter(t => t.type === "global");
      const options = globalTemplates.map(t => ({
        label: t.name,
        value: t.id
      }));

      setDynamicConfig(prev => ({
        ...prev,
        components: {
          ...prev.components,
          GlobalTemplate: {
            ...prev.components.GlobalTemplate,
            fields: {
              ...prev.components.GlobalTemplate.fields,
              templateId: {
                type: "select" as const,
                label: "Pilih Templat Global",
                options: [
                  { label: "-- Pilih Templat --", value: "" },
                  ...options
                ]
              }
            }
          }
        }
      }));
    } catch (e) {
      console.warn("Failed to load templates dynamic field config:", e);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    async function loadData() {
      const draft = await getPuckDraftData();
      if (draft && draft.content) {
        setInitialData(draft);
        setPreviewData(draft);
        return;
      }
      const published = await getPuckPublishedData();
      if (published && published.content) {
        setInitialData(published);
        setPreviewData(published);
        return;
      }
      
      // Fallback to local storage
      const localDraft = localStorage.getItem("puck_draft");
      if (localDraft) {
        try {
          const parsed = JSON.parse(localDraft);
          if (parsed && parsed.content && parsed.content.length > 0) {
            setInitialData(parsed);
            setPreviewData(parsed);
            return;
          }
        } catch (e) {}
      }

      const saved = localStorage.getItem("puck-page-data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.content && parsed.content.length > 0) {
            setInitialData(parsed);
            setPreviewData(parsed);
            return;
          }
        } catch (e) {}
      }

      // Ultimate fallback: build layout from live AdminContext data
      const dynamicLayout = buildDynamicLayout(
        siteContent,
        programs,
        teachers,
        stats,
        achievements,
        innovations,
        news
      );
      setInitialData(dynamicLayout);
      setPreviewData(dynamicLayout);
    }
    loadData();
  }, [siteContent, programs, teachers, stats, achievements, innovations, news]);

  // Sync JSON text representation when preview data changes
  useEffect(() => {
    if (previewData) {
      setJsonText(JSON.stringify(previewData, null, 2));
    }
  }, [previewData]);

  // Format and extract raw HTML from previewRef
  const formatHTML = (html: string) => {
    let formatted = "";
    let indent = "";
    html.split(/>\s*</).forEach((char) => {
      if (char.match(/^\/\w/)) {
        indent = indent.substring(2);
      }
      formatted += indent + "<" + char + ">\n";
      if (char.match(/^<?\w[^>]*[^\/]$/) && !char.startsWith("input") && !char.startsWith("img") && !char.startsWith("br") && !char.startsWith("hr")) {
        indent += "  ";
      }
    });
    return formatted.substring(1, formatted.length - 2);
  };

  useEffect(() => {
    if (showPreview && rightPanelTab === "html") {
      // Delay slightly for React to mount elements in DOM
      const timer = setTimeout(() => {
        if (previewRef.current) {
          setRenderedHtml(formatHTML(previewRef.current.innerHTML));
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [previewData, showPreview, rightPanelTab]);

  const save = async (data: any) => {
    const success = await publishPuckData(data);
    if (success) {
      alert("Layout berhasil dipublish! Perubahan sudah tayang di website utama.");
      loadTemplates();
    } else {
      alert("Gagal mempublish layout.");
    }
  };

  const handleRestore = (data: any) => {
    setInitialData(data);
    setPreviewData(data);
    setPuckKey(prev => prev + 1); // Force Puck to remount with new data
  };

  const handleApplyJson = (newJsonStr: string) => {
    try {
      const parsed = JSON.parse(newJsonStr);
      setInitialData(parsed);
      setPreviewData(parsed);
      setPuckKey(prev => prev + 1);
      alert("JSON berhasil diterapkan ke builder!");
    } catch (e: any) {
      alert("JSON tidak valid: " + e.message);
    }
  };

  if (!initialData) return <div className="p-8 text-center flex items-center justify-center h-screen">Loading editor...</div>;

  return (
    <EditorProvider>
      <div className="flex w-screen h-screen overflow-hidden">
        {/* Puck Editor Pane */}
        <div className="flex-1 h-full overflow-hidden flex flex-col min-w-0">
          <Puck 
            key={puckKey}
            config={dynamicConfig} 
            data={initialData} 
            onChange={(data) => setPreviewData(data)}
            onPublish={save} 
            viewports={[
              { width: 375, label: "Mobile View", height: "auto" },
              { width: 768, label: "Tablet View", height: "auto" },
              { width: 1280, label: "Desktop View", height: "auto" }
            ]}
            overrides={{
              headerActions: ({ children }) => (
                <CustomHeaderActions 
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  isTemplatesOpen={isTemplatesOpen}
                  setIsTemplatesOpen={setIsTemplatesOpen}
                  isAssetsOpen={isAssetsOpen}
                  setIsAssetsOpen={setIsAssetsOpen}
                  loadTemplates={loadTemplates}
                  showPreview={showPreview}
                  setShowPreview={setShowPreview}
                >
                  {children}
                </CustomHeaderActions>
              )
            }}
          />
        </div>

        {/* Hidden preview div for HTML snapshot if not in preview tab */}
        {showPreview && rightPanelTab !== "preview" && (
          <div ref={previewRef} style={{ display: "none" }}>
            <Render config={dynamicConfig} data={previewData || initialData} />
          </div>
        )}

        {/* Live Preview Pane */}
        {showPreview && (
          <div className="w-[500px] xl:w-[600px] 2xl:w-[700px] h-full flex flex-col bg-slate-900 text-white border-l border-slate-700 shrink-0">
            {/* Header with Tabs */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setRightPanelTab("preview")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === "preview" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Pratinjau
                </button>
                <button
                  onClick={() => setRightPanelTab("html")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === "html" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setRightPanelTab("json")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === "json" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  JSON
                </button>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-300 font-bold cursor-pointer"
              >
                Sembunyikan
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto bg-white text-slate-800 relative">
              {rightPanelTab === "preview" && (
                <div ref={previewRef} className="h-full overflow-y-auto">
                  <Render config={dynamicConfig} data={previewData || initialData} />
                </div>
              )}

              {rightPanelTab === "html" && (
                <div className="p-4 h-full bg-slate-950 text-emerald-400 font-mono text-xs overflow-y-auto select-all leading-relaxed whitespace-pre-wrap">
                  {renderedHtml || "Memuat HTML..."}
                </div>
              )}

              {rightPanelTab === "json" && (
                <div className="h-full flex flex-col bg-slate-950 p-4">
                  <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="flex-1 w-full bg-slate-900 border border-slate-850 border-slate-800 rounded-lg p-3 font-mono text-xs text-blue-300 outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    spellCheck={false}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleApplyJson(jsonText)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Terapkan JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <RevisionHistoryModal 
          isOpen={isHistoryOpen} 
          onClose={() => setIsHistoryOpen(false)} 
          onRestore={handleRestore}
        />
      </div>
    </EditorProvider>
  );
}