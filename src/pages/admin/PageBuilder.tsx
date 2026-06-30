import React, { useState, useEffect, useCallback, useRef } from "react";
import { Puck, usePuck, Render, ActionBar } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import { config } from "../../puck/config";
import { EditorProvider } from "../../context/EditorContext";
import { InlineEditProvider } from "../../context/InlineEditContext";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import { getPuckDraftData, getPuckPublishedData, savePuckDraft, publishPuckData } from "../../puck/puckSupabase";
import RevisionHistoryModal from "../../components/editor/RevisionHistoryModal";
import TemplateLibraryModal from "../../components/editor/TemplateLibraryModal";
import AssetManagerModal from "../../components/editor/AssetManagerModal";
import { SmartToolbar } from "../../components/editor/SmartToolbar";
import RoleGuard from "../../components/admin/RoleGuard";
import { getPuckTemplates } from "../../puck/puckTemplates";
import { buildDynamicLayout } from "../../puck/puckUtils";
import { Clock, Save, Layout, Download, ImageIcon, Check, AlertCircle, Eye, Pencil, X } from "lucide-react";


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
  setShowPreview,
  canvasZoom,
  setCanvasZoom
}: { 
  children: React.ReactNode, 
  onOpenHistory: () => void,
  isTemplatesOpen: boolean,
  setIsTemplatesOpen: (open: boolean) => void,
  isAssetsOpen: boolean,
  setIsAssetsOpen: (open: boolean) => void,
  loadTemplates: () => void,
  showPreview: boolean,
  setShowPreview: (show: boolean) => void,
  canvasZoom: number,
  setCanvasZoom: (zoom: number) => void
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
      {/* Zoom Controls */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-md px-2 py-1 mr-2">
        <button type="button" onClick={() => setCanvasZoom(Math.max(0.25, canvasZoom - 0.1))} className="p-1 hover:bg-slate-200 rounded text-slate-600">-</button>
        <span className="text-xs font-bold text-slate-700 min-w-[40px] text-center">{Math.round(canvasZoom * 100)}%</span>
        <button type="button" onClick={() => setCanvasZoom(Math.min(2, canvasZoom + 0.1))} className="p-1 hover:bg-slate-200 rounded text-slate-600">+</button>
        <button type="button" onClick={() => setCanvasZoom(1)} className="text-[10px] ml-1 px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-600 font-bold">Reset</button>
      </div>

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

// ─── Utilities shared between CustomActionBar and PageBuilder ─────────────────

/** Recursively update a single prop on a component anywhere in the Puck content tree */
function updatePropInTree(
  items: any[],
  targetId: string,
  key: string,
  value: any
): any[] {
  return items.map((item) => {
    if (item.props?.id === targetId) {
      return { ...item, props: { ...item.props, [key]: value } };
    }
    // Puck DropZone zones stored as arrays of zone keys
    const zoneKeys = Object.keys(item.props ?? {}).filter(
      (k) => Array.isArray(item.props[k]) && item.props[k][0]?.props
    );
    if (zoneKeys.length > 0) {
      const updatedProps = { ...item.props };
      for (const zone of zoneKeys) {
        updatedProps[zone] = updatePropInTree(item.props[zone], targetId, key, value);
      }
      return { ...item, props: updatedProps };
    }
    return item;
  });
}

/** Find a component anywhere in the Puck content tree */
function findInTree(items: any[], targetId: string): any {
  for (const item of items) {
    if (item.props?.id === targetId) return item;
    const zoneKeys = Object.keys(item.props ?? {}).filter(
      (k) => Array.isArray(item.props[k]) && item.props[k][0]?.props
    );
    for (const zone of zoneKeys) {
      const found = findInTree(item.props[zone], targetId);
      if (found) return found;
    }
  }
  return null;
}

// ─── PropFieldRenderer — renders one prop field in the full edit modal ────────

function guessInputType(key: string, val: any): string {
  if (typeof val === "boolean") return "checkbox";
  if (typeof val === "number") return "number";
  if (
    key.toLowerCase().includes("color") ||
    key.toLowerCase().includes("background") ||
    (typeof val === "string" && /^#[0-9a-fA-F]{3,8}$/.test(val))
  ) return "color";
  if (typeof val === "string" && val.length > 100) return "textarea";
  if (
    key.toLowerCase().includes("url") ||
    key.toLowerCase().includes("href") ||
    key.toLowerCase().includes("src") ||
    key.toLowerCase().includes("link")
  ) return "url";
  if (typeof val === "object" && val !== null && !Array.isArray(val)) return "object";
  if (Array.isArray(val)) return "array";
  return "text";
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  fontSize: "0.82rem",
  outline: "none",
  background: "#f8fafc",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

interface PropFieldProps {
  propKey: string;
  value: any;
  onChange: (key: string, value: any) => void;
  depth?: number;
}

const PropField: React.FC<PropFieldProps> = ({ propKey, value, onChange, depth = 0 }) => {
  const [collapsed, setCollapsed] = useState(depth > 0);
  const type = guessInputType(propKey, value);
  const labelText = propKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  const badgeColor: Record<string, string> = {
    text: "#3b82f6", textarea: "#8b5cf6", number: "#f59e0b",
    color: value as string, checkbox: "#10b981", url: "#06b6d4",
    object: "#6366f1", array: "#ec4899",
  };

  if (type === "array") {
    return (
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            width: "100%", display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "8px 12px",
            background: "#f1f5f9", border: "none", cursor: "pointer",
            fontSize: "0.78rem", fontWeight: 600, color: "#374151",
          }}
        >
          <span>📋 {labelText} ({(value as any[]).length} items)</span>
          <span>{collapsed ? "▶" : "▼"}</span>
        </button>
        {!collapsed && (
          <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {(value as any[]).map((item: any, idx: number) => (
              <div key={idx} style={{ padding: 8, background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                  Item {idx + 1}
                </div>
                {typeof item === "object" && item !== null
                  ? Object.entries(item).map(([k, v]) => (
                      <PropField
                        key={k}
                        propKey={k}
                        value={v}
                        depth={depth + 1}
                        onChange={(subKey, newVal) => {
                          const newArr = [...(value as any[])];
                          newArr[idx] = { ...newArr[idx], [subKey]: newVal };
                          onChange(propKey, newArr);
                        }}
                      />
                    ))
                  : (
                    <input
                      type="text"
                      value={String(item)}
                      onChange={(e) => {
                        const newArr = [...(value as any[])];
                        newArr[idx] = e.target.value;
                        onChange(propKey, newArr);
                      }}
                      style={fieldStyle}
                    />
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === "object") {
    return (
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            width: "100%", display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "8px 12px",
            background: "#f1f5f9", border: "none", cursor: "pointer",
            fontSize: "0.78rem", fontWeight: 600, color: "#374151",
          }}
        >
          <span>🗂 {labelText}</span>
          <span>{collapsed ? "▶" : "▼"}</span>
        </button>
        {!collapsed && (
          <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(value as object).map(([k, v]) => (
              <PropField
                key={k}
                propKey={k}
                value={v}
                depth={depth + 1}
                onChange={(subKey, newVal) =>
                  onChange(propKey, { ...(value as object), [subKey]: newVal })
                }
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{
        fontSize: "0.75rem", fontWeight: 600, color: "#374151",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: badgeColor[type] || "#3b82f6",
          display: "inline-block", flexShrink: 0,
        }} />
        {labelText}
        <span style={{
          fontSize: "0.6rem", fontWeight: 400, color: "#94a3b8",
          background: "#f1f5f9", padding: "1px 5px", borderRadius: 99,
        }}>
          {type}
        </span>
      </label>

      {type === "checkbox" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{
            position: "relative", display: "inline-flex",
            alignItems: "center", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(propKey, e.target.checked)}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              width: 40, height: 22, borderRadius: 11,
              background: value ? "#3b82f6" : "#cbd5e1",
              position: "relative", transition: "background 0.2s",
              display: "inline-block",
            }}>
              <span style={{
                position: "absolute", top: 2,
                left: value ? 20 : 2,
                width: 18, height: 18, borderRadius: 9,
                background: "white", transition: "left 0.2s",
              }} />
            </span>
          </label>
          <span style={{ fontSize: "0.8rem", color: value ? "#3b82f6" : "#94a3b8" }}>
            {value ? "Aktif" : "Nonaktif"}
          </span>
        </div>
      ) : type === "color" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(propKey, e.target.value)}
            style={{ width: 44, height: 36, border: "1px solid #e2e8f0", borderRadius: 8, padding: 2, cursor: "pointer" }}
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(propKey, e.target.value)}
            placeholder="e.g. #3b82f6 or rgba(59,130,246,0.5)"
            style={{ ...fieldStyle, flex: 1, fontFamily: "monospace", fontSize: "0.75rem" }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>
      ) : type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(propKey, e.target.value)}
          rows={4}
          style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }}
          onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
      ) : type === "number" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(propKey, Number(e.target.value))}
            style={{ ...fieldStyle, width: 80, flex: "none" }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
          <input
            type="range"
            min={0} max={200}
            value={value ?? 0}
            onChange={(e) => onChange(propKey, Number(e.target.value))}
            style={{ flex: 1, accentColor: "#3b82f6" }}
          />
        </div>
      ) : (
        <input
          type={type === "url" ? "url" : "text"}
          value={value ?? ""}
          onChange={(e) => onChange(propKey, e.target.value)}
          style={fieldStyle}
          onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
      )}
    </div>
  );
};

// ─── CustomActionBar ───────────────────────────────────────────────────────────

const CustomActionBar = ({ children, label }: { children: React.ReactNode; label?: string }) => {
  const { appState, dispatch } = usePuck();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Listen for inline text edits from BasicText component
  useEffect(() => {
    const handleInlineTextEdit = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { id, text } = customEvent.detail || {};
      if (id && text !== undefined) {
        dispatch({
          type: "setData",
          data: {
            ...appState.data,
            content: updatePropInTree(appState.data?.content ?? [], id, "text", text),
          },
        } as any);
      }
    };
    window.addEventListener("puck:inlineTextEdit", handleInlineTextEdit);
    return () => window.removeEventListener("puck:inlineTextEdit", handleInlineTextEdit);
  }, [appState.data, dispatch]);

  const selectedId = (appState.ui as any).selectedItem?.props?.id ?? null;
  const selectedComponent = selectedId
    ? findInTree(appState.data?.content ?? [], selectedId)
    : null;

  const componentType: string = selectedComponent?.type ?? label ?? "Component";
  const props: Record<string, any> = selectedComponent?.props ?? {};

  const updateProp = useCallback(
    (key: string, value: any) => {
      if (!selectedId) return;
      dispatch({
        type: "setData",
        data: {
          ...appState.data,
          content: updatePropInTree(appState.data?.content ?? [], selectedId, key, value),
        },
      } as any);
    },
    [selectedId, appState.data, dispatch]
  );

  const editableProps = Object.entries(props).filter(
    ([key]) => key !== "id" && !key.startsWith("_")
  );

  return (
    <>
      {/* SmartToolbar inside Puck ActionBar */}
      <ActionBar label={label}>
        {children}
        <div style={{ display: "flex", alignItems: "center" }}>
          <SmartToolbar
            componentType={componentType}
            label={label}
            props={props}
            updateProp={updateProp}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      </ActionBar>

      {/* Full Props Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: 64,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(3px)",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div
            style={{
              background: "#fff", borderRadius: 16,
              boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
              width: "min(680px, 96vw)", maxHeight: "82vh",
              display: "flex", flexDirection: "column",
              overflow: "hidden", border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
              padding: "18px 22px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: "1px solid #1e40af",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "rgba(59,130,246,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Pencil size={18} color="#93c5fd" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", color: "#f1f5f9" }}>
                    Edit Semua Props
                  </div>
                  <div style={{
                    fontSize: "0.72rem", color: "#93c5fd",
                    display: "flex", alignItems: "center", gap: 6, marginTop: 2,
                  }}>
                    <span style={{
                      background: "#1e3a8a", border: "1px solid #3b82f6",
                      borderRadius: 4, padding: "1px 6px", fontWeight: 700,
                    }}>
                      {componentType}
                    </span>
                    <span style={{ color: "#64748b" }}>·</span>
                    <span style={{ color: "#64748b" }}>{editableProps.length} props</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, width: 34, height: 34,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#94a3b8",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              >
                <X size={18} />
              </button>
            </div>

            {/* Fields */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
              {editableProps.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 0", color: "#94a3b8" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Tidak ada prop yang bisa diedit</div>
                  <div style={{ fontSize: "0.8rem", marginTop: 6 }}>
                    Pilih komponen di kanvas terlebih dahulu.
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {editableProps.map(([key, val]) => (
                    <PropField
                      key={key}
                      propKey={key}
                      value={val}
                      onChange={updateProp}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: "14px 22px", borderTop: "1px solid #e2e8f0",
              background: "#f8fafc", borderRadius: "0 0 16px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: "0.73rem", color: "#94a3b8" }}>
                ⚡ Perubahan diterapkan langsung ke kanvas
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "#1e40af", color: "white",
                    border: "none", borderRadius: 8,
                    padding: "8px 22px", cursor: "pointer",
                    fontWeight: 700, fontSize: "0.82rem",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#1e40af")}
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
  
  // Builder Canvas Zoom & Pan
  const [canvasZoom, setCanvasZoom] = useState(1);

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
      <InlineEditProvider>
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
                ),
                actionBar: ({ children, label }) => (
                  <CustomActionBar label={label}>{children}</CustomActionBar>
                ),
                preview: ({ children }) => (
                  <div 
                    style={{ 
                      transform: `scale(${canvasZoom})`, 
                      transformOrigin: "top center",
                      transition: "transform 0.2s ease",
                      width: "100%",
                      height: "100%",
                      resize: "both",
                      overflow: "auto"
                    }}
                  >
                    {children}
                  </div>
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
                <div className="flex flex-col h-full">
                  <div className="flex-1 border-b border-slate-800 overflow-y-auto bg-white min-h-[50%]">
                    <Render config={dynamicConfig} data={previewData || initialData} />
                  </div>
                  <div className="flex-1 p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-y-auto select-all leading-relaxed whitespace-pre-wrap min-h-[50%]">
                    {renderedHtml || "Memuat HTML..."}
                  </div>
                </div>
              )}

              {rightPanelTab === "json" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 border-b border-slate-800 overflow-y-auto bg-white min-h-[50%]">
                    <Render config={dynamicConfig} data={previewData || initialData} />
                  </div>
                  <div className="flex-1 flex flex-col bg-slate-950 p-4 min-h-[50%]">
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
      </InlineEditProvider>
    </EditorProvider>
  );
}