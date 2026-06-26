import React, { useState, useEffect } from "react";
import { Puck, usePuck } from "@puckeditor/core";
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
import { Clock, Save, Layout, Download, ImageIcon, Check, AlertCircle } from "lucide-react";

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
  loadTemplates
}: { 
  children: React.ReactNode, 
  onOpenHistory: () => void,
  isTemplatesOpen: boolean,
  setIsTemplatesOpen: (open: boolean) => void,
  isAssetsOpen: boolean,
  setIsAssetsOpen: (open: boolean) => void,
  loadTemplates: () => void
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
        return;
      }
      const published = await getPuckPublishedData();
      if (published && published.content) {
        setInitialData(published);
        return;
      }
      
      // Fallback to local storage
      const localDraft = localStorage.getItem("puck_draft");
      if (localDraft) {
        try {
          const parsed = JSON.parse(localDraft);
          if (parsed && parsed.content && parsed.content.length > 0) {
            setInitialData(parsed);
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
    }
    loadData();
  }, [siteContent, programs, teachers, stats, achievements, innovations, news]);

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
    setPuckKey(prev => prev + 1); // Force Puck to remount with new data
  };

  if (!initialData) return <div className="p-8 text-center flex items-center justify-center h-screen">Loading editor...</div>;

  return (
    <EditorProvider>
      <div style={{ height: "100vh", margin: 0, padding: 0 }}>
        <Puck 
          key={puckKey}
          config={dynamicConfig} 
          data={initialData} 
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
              >
                {children}
              </CustomHeaderActions>
            )
          }}
        />
        
        <RevisionHistoryModal 
          isOpen={isHistoryOpen} 
          onClose={() => setIsHistoryOpen(false)} 
          onRestore={handleRestore}
        />
      </div>
    </EditorProvider>
  );
}