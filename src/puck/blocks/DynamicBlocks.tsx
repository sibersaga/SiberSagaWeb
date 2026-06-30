import React, { useState, useEffect } from "react";
import { isSupabaseConfigured, getSupabase } from "../../supabase";
import { Calendar, User, Database, Globe, Type } from "lucide-react";
import { NumberStepperField, UnitSliderField, ColorPickerField, ToggleField } from "../CustomFields";
// ─── Helper: Editor Detection ─────────────────────────────────────────────────
const isEditorMode = () =>
  typeof window !== "undefined" && window.location.pathname.includes("/admin");

// ─── Editor Placeholder ───────────────────────────────────────────────────────
function EditorPlaceholder({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        backgroundColor: "#faf5ff",
        border: "1px dashed #c084fc",
        borderRadius: "0.5rem",
        fontSize: "0.8rem",
        color: "#7c3aed",
        fontWeight: 500,
      }}
    >
      <Icon size={14} />
      <span>{label}:</span>
      <span style={{ color: "#a78bfa", fontStyle: "italic" }}>{value}</span>
    </div>
  );
}

// ─── Dynamic Text Block ───────────────────────────────────────────────────────
export const DynamicTextBlockConfig = {
  fields: {
    source: {
      type: "select" as const,
      label: "Sumber Data",
      options: [
        { label: "Tanggal Saat Ini", value: "date" },
        { label: "Nama User Login", value: "user-name" },
        { label: "Email User Login", value: "user-email" },
        { label: "Teks dari Pengaturan Situs", value: "setting" },
        { label: "Teks Kustom (Placeholder)", value: "custom" },
      ],
    },
    settingKey: { type: "text" as const, label: "Key Pengaturan (untuk mode Setting)" },
    customText: { type: "text" as const, label: "Teks Kustom / Fallback" },
    dateFormat: {
      type: "select" as const,
      label: "Format Tanggal",
      options: [
        { label: "Penuh (e.g. Kamis, 26 Juni 2025)", value: "full" },
        { label: "Panjang (e.g. 26 Juni 2025)", value: "long" },
        { label: "Sedang (e.g. 26 Jun 2025)", value: "medium" },
        { label: "Pendek (e.g. 26/06/2025)", value: "short" },
      ],
    },
    prefix: { type: "text" as const, label: "Prefix (e.g. Halo, )" },
    suffix: { type: "text" as const, label: "Suffix (e.g. !)" },
    tag: {
      type: "select" as const,
      label: "Tag HTML",
      options: [
        { label: "Paragraf (p)", value: "p" },
        { label: "Heading 1 (h1)", value: "h1" },
        { label: "Heading 2 (h2)", value: "h2" },
        { label: "Heading 3 (h3)", value: "h3" },
        { label: "Span", value: "span" },
      ],
    },
    fontSize: { 
      type: "custom" as const,
      label: "Ukuran Font (px)",
      render: (props: any) => <UnitSliderField {...props} min={8} max={72} unit="px" />
    },
    fontWeight: { 
      type: "select" as const,
      label: "Tebal Font",
      options: [
        { label: "Normal (400)", value: "400" },
        { label: "Medium (500)", value: "500" },
        { label: "Bold (700)", value: "700" },
      ]
    },
    color: { 
      type: "custom" as const,
      label: "Warna Teks",
      render: (props: any) => <ColorPickerField {...props} />
    },
  },
  defaultProps: {
    source: "date",
    settingKey: "",
    customText: "Teks dinamis",
    dateFormat: "full",
    prefix: "",
    suffix: "",
    tag: "p",
    fontSize: "",
    fontWeight: "",
    color: "",
  },
  render: function DynamicTextRender({
    source,
    settingKey,
    customText,
    dateFormat,
    prefix,
    suffix,
    tag,
    fontSize,
    fontWeight,
    color,
  }: any) {
    const [text, setText] = useState("");

    useEffect(() => {
      (async () => {
        switch (source) {
          case "date": {
            const formatMap: Record<string, Intl.DateTimeFormatOptions> = {
              full: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
              long: { year: "numeric", month: "long", day: "numeric" },
              medium: { year: "numeric", month: "short", day: "numeric" },
              short: { year: "numeric", month: "2-digit", day: "2-digit" },
            };
            setText(new Date().toLocaleDateString("id-ID", formatMap[dateFormat] || formatMap.full));
            break;
          }
          case "user-name":
          case "user-email": {
            if (isSupabaseConfigured) {
              try {
                const { data } = await getSupabase().auth.getUser();
                if (data?.user) {
                  setText(
                    source === "user-email"
                      ? data.user.email || "Tidak diketahui"
                      : data.user.user_metadata?.full_name || data.user.email || "User"
                  );
                } else {
                  setText(customText || "Belum login");
                }
              } catch {
                setText(customText || "Belum login");
              }
            } else {
              setText(customText || "Belum login");
            }
            break;
          }
          case "setting": {
            if (isSupabaseConfigured && settingKey) {
              try {
                const { data } = await getSupabase()
                  .from("settings")
                  .select("value")
                  .eq("key", settingKey)
                  .maybeSingle();
                setText(data?.value ? String(data.value) : customText || "—");
              } catch {
                setText(customText || "—");
              }
            } else {
              setText(customText || "—");
            }
            break;
          }
          case "custom":
          default:
            setText(customText || "Teks kustom");
        }
      })();
    }, [source, settingKey, customText, dateFormat]);

    if (isEditorMode()) {
      return <EditorPlaceholder icon={Type} label="Dynamic Text" value={`${source}: ${text || "..."}`} />;
    }

    const Tag = (tag || "p") as keyof JSX.IntrinsicElements;
    const style: React.CSSProperties = {};
    if (fontSize) style.fontSize = fontSize;
    if (fontWeight) style.fontWeight = fontWeight;
    if (color) style.color = color;

    return <Tag style={style}>{prefix}{text}{suffix}</Tag>;
  },
};

// ─── Dynamic Image Block ──────────────────────────────────────────────────────
export const DynamicImageBlockConfig = {
  fields: {
    source: {
      type: "select" as const,
      label: "Sumber Gambar",
      options: [
        { label: "URL dari Pengaturan Situs", value: "setting" },
        { label: "Avatar User Login", value: "user-avatar" },
        { label: "URL Kustom", value: "custom" },
      ],
    },
    settingKey: { type: "text" as const, label: "Key Pengaturan (untuk mode Setting)" },
    customUrl: { type: "text" as const, label: "URL Gambar Kustom / Fallback" },
    alt: { type: "text" as const, label: "Teks Alt" },
    width: { type: "text" as const, label: "Lebar (e.g. 200px, 100%)" },
    height: { type: "text" as const, label: "Tinggi (e.g. 200px, auto)" },
    borderRadius: { type: "text" as const, label: "Border Radius (e.g. 50%, 8px)" },
    objectFit: {
      type: "select" as const,
      label: "Object Fit",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
        { label: "None", value: "none" },
      ],
    },
  },
  defaultProps: {
    source: "custom",
    settingKey: "",
    customUrl: "https://placehold.co/300x200/e2e8f0/475569?text=Dynamic+Image",
    alt: "Dynamic Image",
    width: "100%",
    height: "auto",
    borderRadius: "0.5rem",
    objectFit: "cover",
  },
  render: function DynamicImageRender({
    source,
    settingKey,
    customUrl,
    alt,
    width,
    height,
    borderRadius,
    objectFit,
  }: any) {
    const [src, setSrc] = useState(customUrl || "");

    useEffect(() => {
      (async () => {
        switch (source) {
          case "user-avatar": {
            if (isSupabaseConfigured) {
              try {
                const { data } = await getSupabase().auth.getUser();
                setSrc(data?.user?.user_metadata?.avatar_url || customUrl || "");
              } catch {
                setSrc(customUrl || "");
              }
            } else {
              setSrc(customUrl || "");
            }
            break;
          }
          case "setting": {
            if (isSupabaseConfigured && settingKey) {
              try {
                const { data } = await getSupabase()
                  .from("settings")
                  .select("value")
                  .eq("key", settingKey)
                  .maybeSingle();
                setSrc(data?.value ? String(data.value) : customUrl || "");
              } catch {
                setSrc(customUrl || "");
              }
            } else {
              setSrc(customUrl || "");
            }
            break;
          }
          case "custom":
          default:
            setSrc(customUrl || "");
        }
      })();
    }, [source, settingKey, customUrl]);

    if (isEditorMode()) {
      return (
        <div style={{ position: "relative" }}>
          <EditorPlaceholder icon={Globe} label="Dynamic Image" value={source} />
          {src && (
            <img
              src={src}
              alt={alt}
              style={{
                marginTop: "0.5rem",
                width: width || "100%",
                height: height || "auto",
                borderRadius: borderRadius || "0.5rem",
                objectFit: (objectFit || "cover") as any,
              }}
            />
          )}
        </div>
      );
    }

    if (!src) return null;
    return (
      <img
        src={src}
        alt={alt}
        style={{
          width: width || "100%",
          height: height || "auto",
          borderRadius: borderRadius || "0.5rem",
          objectFit: (objectFit || "cover") as any,
        }}
      />
    );
  },
};

// ─── User Data Block ──────────────────────────────────────────────────────────
export const UserDataBlockConfig = {
  fields: {
    layout: {
      type: "select" as const,
      label: "Tampilan",
      options: [
        { label: "Kartu Profil (Avatar + Nama + Email)", value: "card" },
        { label: "Inline (Nama saja)", value: "inline" },
        { label: "Status Login/Logout", value: "status" },
      ],
    },
    avatarSize: { type: "text" as const, label: "Ukuran Avatar (e.g. 48px)" },
    showEmail: { type: "boolean" as const, label: "Tampilkan Email" },
    showAvatar: { type: "boolean" as const, label: "Tampilkan Avatar" },
    loginText: { type: "text" as const, label: "Teks saat Belum Login" },
    borderRadius: { type: "text" as const, label: "Border Radius Kartu (e.g. 12px)" },
  },
  defaultProps: {
    layout: "card",
    avatarSize: "48px",
    showEmail: true,
    showAvatar: true,
    loginText: "Silakan login untuk melihat data Anda.",
    borderRadius: "12px",
  },
  render: function UserDataRender({ layout, avatarSize, showEmail, showAvatar, loginText, borderRadius }: any) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        if (isSupabaseConfigured) {
          try {
            const { data } = await getSupabase().auth.getUser();
            setUser(data?.user || null);
          } catch {
            setUser(null);
          }
        }
        setLoading(false);
      })();
    }, []);

    if (isEditorMode()) {
      return <EditorPlaceholder icon={User} label="User Data" value={layout} />;
    }

    if (loading) {
      return (
        <div style={{ padding: "0.75rem", color: "#94a3b8", fontSize: "0.875rem" }}>
          Memuat data pengguna...
        </div>
      );
    }

    if (!user) {
      return (
        <div style={{
          padding: "0.75rem 1rem",
          backgroundColor: "#fef3c7",
          border: "1px solid #fcd34d",
          borderRadius: borderRadius || "12px",
          color: "#92400e",
          fontSize: "0.875rem",
        }}>
          {loginText}
        </div>
      );
    }

    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const email = user.email || "";
    const avatar = user.user_metadata?.avatar_url || "";

    if (layout === "inline") {
      return <span style={{ fontWeight: 600 }}>{name}</span>;
    }

    if (layout === "status") {
      return (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#ecfdf5",
          borderRadius: "999px",
          color: "#065f46",
          fontSize: "0.8rem",
          fontWeight: 600,
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
          Online — {name}
        </div>
      );
    }

    // Card layout
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        backgroundColor: "#f8fafc",
        borderRadius: borderRadius || "12px",
        border: "1px solid #e2e8f0",
      }}>
        {showAvatar && (
          avatar ? (
            <img
              src={avatar}
              alt={name}
              style={{
                width: avatarSize || "48px",
                height: avatarSize || "48px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div style={{
              width: avatarSize || "48px",
              height: avatarSize || "48px",
              borderRadius: "50%",
              backgroundColor: "#6366f1",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
          )
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>{name}</div>
          {showEmail && email && (
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{email}</div>
          )}
        </div>
      </div>
    );
  },
};

// ─── Database Data Block ──────────────────────────────────────────────────────
export const DatabaseDataBlockConfig = {
  fields: {
    tableName: { type: "text" as const, label: "Nama Tabel Supabase (e.g. news, programs)" },
    columns: { type: "text" as const, label: "Kolom (comma-separated, e.g. title,description)" },
    limit: { type: "number" as const, label: "Batas Jumlah Data" },
    orderBy: { type: "text" as const, label: "Urut Berdasarkan (e.g. created_at)" },
    orderDir: {
      type: "select" as const,
      label: "Arah Urut",
      options: [
        { label: "Terbaru Dulu (desc)", value: "desc" },
        { label: "Terlama Dulu (asc)", value: "asc" },
      ],
    },
    displayStyle: {
      type: "select" as const,
      label: "Tampilan",
      options: [
        { label: "Tabel", value: "table" },
        { label: "List Sederhana", value: "list" },
        { label: "JSON (Debug)", value: "json" },
      ],
    },
  },
  defaultProps: {
    tableName: "news",
    columns: "*",
    limit: 5,
    orderBy: "",
    orderDir: "desc",
    displayStyle: "table",
  },
  render: function DatabaseDataRender({
    tableName,
    columns,
    limit,
    orderBy,
    orderDir,
    displayStyle,
  }: any) {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        if (!isSupabaseConfigured) {
          setError("Supabase belum dikonfigurasi.");
          setLoading(false);
          return;
        }
        if (!tableName) {
          setError("Nama tabel belum diatur.");
          setLoading(false);
          return;
        }

        try {
          let query = getSupabase()
            .from(tableName)
            .select(columns || "*")
            .limit(limit || 5);

          if (orderBy) {
            query = query.order(orderBy, { ascending: orderDir === "asc" });
          }

          const result = await query;
          if (result.error) {
            setError(result.error.message);
          } else {
            setData(result.data || []);
          }
        } catch (e: any) {
          setError(e.message || "Gagal memuat data.");
        }
        setLoading(false);
      })();
    }, [tableName, columns, limit, orderBy, orderDir]);

    if (isEditorMode()) {
      return <EditorPlaceholder icon={Database} label="Database Data" value={`${tableName} (limit: ${limit})`} />;
    }

    if (loading) return <div style={{ color: "#94a3b8", padding: "1rem" }}>Memuat data...</div>;
    if (error) return <div style={{ color: "#ef4444", padding: "1rem" }}>⚠ {error}</div>;
    if (data.length === 0) return <div style={{ color: "#94a3b8", padding: "1rem" }}>Tidak ada data.</div>;

    if (displayStyle === "json") {
      return (
        <pre style={{
          padding: "1rem",
          backgroundColor: "#1e293b",
          color: "#e2e8f0",
          borderRadius: "0.5rem",
          fontSize: "0.75rem",
          overflowX: "auto",
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    }

    if (displayStyle === "list") {
      return (
        <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", margin: 0 }}>
          {data.map((row, i) => {
            const displayValue = row.payload
              ? JSON.stringify(row.payload).substring(0, 100)
              : Object.values(row).filter(v => typeof v === "string").join(" — ");
            return <li key={i} style={{ padding: "0.25rem 0", fontSize: "0.875rem" }}>{displayValue}</li>;
          })}
        </ul>
      );
    }

    // Table display
    const headers = Object.keys(data[0] || {});
    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.5rem 0.75rem",
                    textAlign: "left",
                    borderBottom: "2px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {headers.map((h) => (
                  <td
                    key={h}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderBottom: "1px solid #f1f5f9",
                      color: "#334155",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {typeof row[h] === "object" ? JSON.stringify(row[h]).substring(0, 60) : String(row[h] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

// ─── API Data Block ───────────────────────────────────────────────────────────
export const ApiDataBlockConfig = {
  fields: {
    apiUrl: { type: "text" as const, label: "API URL (REST GET)" },
    jsonPath: { type: "text" as const, label: "JSON Path (e.g. data.items, results)" },
    displayStyle: {
      type: "select" as const,
      label: "Tampilan",
      options: [
        { label: "Tabel", value: "table" },
        { label: "List", value: "list" },
        { label: "JSON (Debug)", value: "json" },
        { label: "Teks Tunggal", value: "text" },
      ],
    },
    refreshInterval: { type: "number" as const, label: "Auto Refresh (detik, 0 = sekali)" },
    fallbackText: { type: "text" as const, label: "Teks Fallback Jika Gagal" },
  },
  defaultProps: {
    apiUrl: "",
    jsonPath: "",
    displayStyle: "json",
    refreshInterval: 0,
    fallbackText: "Data tidak tersedia.",
  },
  render: function ApiDataRender({
    apiUrl,
    jsonPath,
    displayStyle,
    refreshInterval,
    fallbackText,
  }: any) {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!apiUrl) {
        setError("API URL belum diatur.");
        setLoading(false);
        return;
      }

      const fetchData = async () => {
        try {
          const res = await fetch(apiUrl);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          let json = await res.json();

          // Navigate JSON path
          if (jsonPath) {
            const parts = jsonPath.split(".");
            for (const part of parts) {
              if (json && typeof json === "object") {
                json = json[part];
              } else {
                json = null;
                break;
              }
            }
          }

          setData(json);
          setError("");
        } catch (e: any) {
          setError(e.message || "Gagal mengambil data.");
        }
        setLoading(false);
      };

      fetchData();

      if (refreshInterval && refreshInterval > 0) {
        const interval = setInterval(fetchData, refreshInterval * 1000);
        return () => clearInterval(interval);
      }
    }, [apiUrl, jsonPath, refreshInterval]);

    if (isEditorMode()) {
      return <EditorPlaceholder icon={Globe} label="API Data" value={apiUrl || "(belum diatur)"} />;
    }

    if (loading) return <div style={{ color: "#94a3b8", padding: "1rem" }}>Memuat API data...</div>;
    if (error) return <div style={{ color: "#ef4444", padding: "1rem" }}>⚠ {error}</div>;
    if (data === null || data === undefined) return <div style={{ color: "#94a3b8", padding: "1rem" }}>{fallbackText}</div>;

    // Text display (for single values)
    if (displayStyle === "text") {
      return <p>{String(data)}</p>;
    }

    // JSON display
    if (displayStyle === "json") {
      return (
        <pre style={{
          padding: "1rem",
          backgroundColor: "#1e293b",
          color: "#e2e8f0",
          borderRadius: "0.5rem",
          fontSize: "0.75rem",
          overflowX: "auto",
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    }

    // Array-based displays
    const items = Array.isArray(data) ? data : [data];

    if (displayStyle === "list") {
      return (
        <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
          {items.map((item, i) => (
            <li key={i} style={{ padding: "0.25rem 0", fontSize: "0.875rem" }}>
              {typeof item === "object" ? JSON.stringify(item).substring(0, 120) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Table
    if (items.length > 0 && typeof items[0] === "object") {
      const headers = Object.keys(items[0]);
      return (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} style={{
                    padding: "0.5rem",
                    textAlign: "left",
                    borderBottom: "2px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={i}>
                  {headers.map((h) => (
                    <td key={h} style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #f1f5f9",
                      color: "#334155",
                    }}>
                      {typeof row[h] === "object" ? JSON.stringify(row[h]).substring(0, 60) : String(row[h] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <p>{fallbackText}</p>;
  },
};
