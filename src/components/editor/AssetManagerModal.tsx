import React, { useState, useEffect, useRef, useCallback } from "react";
import { isSupabaseConfigured, getSupabase } from "../../supabase";
import {
  X, Upload, Image, Video, Search, FolderPlus, Folder, Trash2,
  Copy, Check, Grid, List, ChevronLeft, RefreshCw, FileText
} from "lucide-react";

const BUCKET_NAME = "assets";

interface AssetFile {
  name: string;
  id: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

interface AssetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AssetManagerModal({ isOpen, onClose, onSelect }: AssetManagerProps) {
  const [files, setFiles] = useState<AssetFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<AssetFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [mode, setMode] = useState<"supabase" | "local">(isSupabaseConfigured ? "supabase" : "local");
  const [localFiles, setLocalFiles] = useState<AssetFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Load files ───────────────────────────────────────────────────
  const loadFiles = useCallback(async () => {
    setLoading(true);
    if (mode === "supabase") {
      try {
        const { data, error } = await getSupabase().storage
          .from(BUCKET_NAME)
          .list(currentPath || undefined, {
            limit: 200,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (error) {
          console.error("Storage error:", error);
          setFiles([]);
          setFolders([]);
        } else {
          const folderList: string[] = [];
          const fileList: AssetFile[] = [];

          for (const item of data || []) {
            if (item.id === null) {
              // It's a folder
              folderList.push(item.name);
            } else {
              const path = currentPath ? `${currentPath}/${item.name}` : item.name;
              const { data: urlData } = getSupabase().storage
                .from(BUCKET_NAME)
                .getPublicUrl(path);

              fileList.push({
                name: item.name,
                id: item.id || item.name,
                url: urlData.publicUrl,
                size: (item.metadata as any)?.size || 0,
                type: (item.metadata as any)?.mimetype || "unknown",
                createdAt: item.created_at || "",
              });
            }
          }

          setFolders(folderList);
          setFiles(fileList);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Local mode — use savedURLs
      const saved = JSON.parse(localStorage.getItem("asset_manager_urls") || "[]");
      setLocalFiles(saved);
    }
    setLoading(false);
  }, [currentPath, mode]);

  useEffect(() => {
    if (isOpen) loadFiles();
  }, [isOpen, loadFiles]);

  // ─── Upload ───────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;

    setUploading(true);
    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const path = currentPath ? `${currentPath}/${file.name}` : file.name;

      if (mode === "supabase") {
        const { error } = await getSupabase().storage
          .from(BUCKET_NAME)
          .upload(path, file, { cacheControl: "3600", upsert: true });
        if (error) console.error("Upload error:", error);
      } else {
        // Local mode — save URL
        const reader = new FileReader();
        reader.onload = () => {
          const saved = JSON.parse(localStorage.getItem("asset_manager_urls") || "[]");
          saved.push({
            name: file.name,
            id: Date.now().toString(),
            url: reader.result as string,
            size: file.size,
            type: file.type,
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("asset_manager_urls", JSON.stringify(saved));
          setLocalFiles(saved);
        };
        reader.readAsDataURL(file);
      }
    }
    setUploading(false);
    loadFiles();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (file: AssetFile) => {
    if (!confirm(`Hapus "${file.name}"?`)) return;

    if (mode === "supabase") {
      const path = currentPath ? `${currentPath}/${file.name}` : file.name;
      await getSupabase().storage.from(BUCKET_NAME).remove([path]);
    } else {
      const saved = JSON.parse(localStorage.getItem("asset_manager_urls") || "[]");
      const filtered = saved.filter((f: AssetFile) => f.id !== file.id);
      localStorage.setItem("asset_manager_urls", JSON.stringify(filtered));
    }
    setSelectedFile(null);
    loadFiles();
  };

  // ─── Create Folder ────────────────────────────────────────────────
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    if (mode === "supabase") {
      const path = currentPath
        ? `${currentPath}/${newFolderName}/.keep`
        : `${newFolderName}/.keep`;
      await getSupabase().storage.from(BUCKET_NAME).upload(path, new Blob([""]), { upsert: true });
    }
    setNewFolderName("");
    setShowNewFolder(false);
    loadFiles();
  };

  // ─── Copy URL ─────────────────────────────────────────────────────
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Filter ───────────────────────────────────────────────────────
  const displayFiles = (mode === "supabase" ? files : localFiles).filter((f) =>
    search ? f.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const isImage = (type: string) => type.startsWith("image/");
  const isVideo = (type: string) => type.startsWith("video/");
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "90vw", maxWidth: "1100px", height: "80vh", animation: "zoomIn 0.25s ease-out" }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#f8fafc",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Image size={20} style={{ color: "#6366f1" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
              Asset Manager
            </h2>
            {mode === "local" && (
              <span style={{
                fontSize: "0.65rem",
                backgroundColor: "#fef3c7",
                color: "#92400e",
                padding: "2px 8px",
                borderRadius: "999px",
                fontWeight: 600,
              }}>
                Mode Lokal
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Cari file..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "0.4rem 0.75rem 0.4rem 2rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "0.8rem",
                  width: "200px",
                }}
              />
            </div>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              style={iconBtnStyle}
              title={viewMode === "grid" ? "Tampilan List" : "Tampilan Grid"}
            >
              {viewMode === "grid" ? <List size={16} /> : <Grid size={16} />}
            </button>
            <button onClick={() => loadFiles()} style={iconBtnStyle} title="Refresh">
              <RefreshCw size={16} />
            </button>
            <button onClick={onClose} style={{ ...iconBtnStyle, color: "#ef4444" }} title="Tutup">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          borderBottom: "1px solid #f1f5f9",
        }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1, fontSize: "0.8rem" }}>
            <button
              onClick={() => setCurrentPath("")}
              style={{ cursor: "pointer", color: "#6366f1", fontWeight: 600, background: "none", border: "none" }}
            >
              Root
            </button>
            {currentPath.split("/").filter(Boolean).map((part, i, arr) => (
              <React.Fragment key={i}>
                <span style={{ color: "#94a3b8" }}>/</span>
                <button
                  onClick={() => setCurrentPath(arr.slice(0, i + 1).join("/"))}
                  style={{ cursor: "pointer", color: "#475569", fontWeight: 500, background: "none", border: "none" }}
                >
                  {part}
                </button>
              </React.Fragment>
            ))}
          </div>

          {currentPath && (
            <button
              onClick={() => {
                const parts = currentPath.split("/").filter(Boolean);
                parts.pop();
                setCurrentPath(parts.join("/"));
              }}
              style={smallBtnStyle}
            >
              <ChevronLeft size={14} />
              Kembali
            </button>
          )}

          {mode === "supabase" && (
            <button onClick={() => setShowNewFolder(true)} style={smallBtnStyle}>
              <FolderPlus size={14} />
              Folder Baru
            </button>
          )}

          <label style={{ ...smallBtnStyle, backgroundColor: "#6366f1", color: "white", cursor: "pointer" }}>
            <Upload size={14} />
            {uploading ? "Mengunggah..." : "Upload"}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleUpload}
              style={{ display: "none" }}
              accept="image/*,video/*,.pdf,.svg"
            />
          </label>
        </div>

        {/* New Folder Dialog */}
        {showNewFolder && (
          <div style={{
            padding: "0.75rem 1.5rem",
            display: "flex",
            gap: "0.5rem",
            backgroundColor: "#faf5ff",
            borderBottom: "1px solid #e9d5ff",
          }}>
            <input
              type="text"
              placeholder="Nama folder..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              style={{ flex: 1, padding: "0.4rem 0.75rem", border: "1px solid #c084fc", borderRadius: "0.375rem", fontSize: "0.8rem" }}
              autoFocus
            />
            <button onClick={handleCreateFolder} style={{ ...smallBtnStyle, backgroundColor: "#7c3aed", color: "white" }}>
              Buat
            </button>
            <button onClick={() => setShowNewFolder(false)} style={smallBtnStyle}>
              Batal
            </button>
          </div>
        )}

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: "1rem 1.5rem", display: "flex", gap: "1rem" }}>
          {/* File Grid/List */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>Memuat...</div>
            ) : (
              <>
                {/* Folders */}
                {folders.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem", letterSpacing: "0.04em" }}>
                      Folder
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {folders.map((folder) => (
                        <button
                          key={folder}
                          onClick={() => setCurrentPath(currentPath ? `${currentPath}/${folder}` : folder)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          <Folder size={16} style={{ color: "#fbbf24" }} />
                          {folder}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files */}
                {displayFiles.length === 0 && folders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                    <Image size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                    <p>Belum ada file. Klik Upload untuk mulai.</p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: "0.75rem",
                  }}>
                    {displayFiles.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        style={{
                          border: selectedFile?.id === file.id ? "2px solid #6366f1" : "1px solid #e5e7eb",
                          borderRadius: "0.75rem",
                          overflow: "hidden",
                          cursor: "pointer",
                          backgroundColor: "white",
                          transition: "all 0.15s ease",
                          boxShadow: selectedFile?.id === file.id ? "0 0 0 3px #6366f144" : "none",
                        }}
                      >
                        <div style={{
                          height: "100px",
                          backgroundColor: "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}>
                          {isImage(file.type) ? (
                            <img src={file.url} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : isVideo(file.type) ? (
                            <Video size={32} style={{ color: "#94a3b8" }} />
                          ) : (
                            <FileText size={32} style={{ color: "#94a3b8" }} />
                          )}
                        </div>
                        <div style={{ padding: "0.5rem", fontSize: "0.7rem", color: "#475569", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {displayFiles.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          backgroundColor: selectedFile?.id === file.id ? "#eef2ff" : "transparent",
                          border: selectedFile?.id === file.id ? "1px solid #6366f1" : "1px solid transparent",
                        }}
                      >
                        {isImage(file.type) ? (
                          <img src={file.url} alt="" style={{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover" }} />
                        ) : (
                          <FileText size={20} style={{ color: "#94a3b8" }} />
                        )}
                        <div style={{ flex: 1, fontSize: "0.8rem", fontWeight: 500 }}>{file.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{formatSize(file.size)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* File Detail Sidebar */}
          {selectedFile && (
            <div style={{
              width: "280px",
              flexShrink: 0,
              borderLeft: "1px solid #e5e7eb",
              paddingLeft: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}>
              {/* Preview */}
              <div style={{
                height: "180px",
                backgroundColor: "#f1f5f9",
                borderRadius: "0.75rem",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {isImage(selectedFile.type) ? (
                  <img src={selectedFile.url} alt={selectedFile.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                ) : isVideo(selectedFile.type) ? (
                  <video src={selectedFile.url} controls style={{ maxWidth: "100%", maxHeight: "100%" }} />
                ) : (
                  <FileText size={48} style={{ color: "#94a3b8" }} />
                )}
              </div>

              {/* Info */}
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", wordBreak: "break-all" }}>
                  {selectedFile.name}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                  {formatSize(selectedFile.size)} • {selectedFile.type}
                </div>
              </div>

              {/* URL */}
              <div>
                <label style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>URL</label>
                <div style={{
                  display: "flex",
                  gap: "0.25rem",
                  marginTop: "0.25rem",
                }}>
                  <input
                    type="text"
                    value={selectedFile.url}
                    readOnly
                    style={{
                      flex: 1,
                      padding: "0.35rem 0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "0.7rem",
                      color: "#475569",
                    }}
                  />
                  <button onClick={() => copyUrl(selectedFile.url)} style={iconBtnStyle} title="Copy URL">
                    {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
                {onSelect && (
                  <button
                    onClick={() => {
                      onSelect(selectedFile.url);
                      onClose();
                    }}
                    style={{
                      padding: "0.6rem",
                      backgroundColor: "#6366f1",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    Pilih File Ini
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedFile)}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "transparent",
                    color: "#ef4444",
                    border: "1px solid #fecaca",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                  }}
                >
                  <Trash2 size={14} />
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  backgroundColor: "white",
  cursor: "pointer",
  color: "#64748b",
};

const smallBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.4rem 0.75rem",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  backgroundColor: "white",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#475569",
};
