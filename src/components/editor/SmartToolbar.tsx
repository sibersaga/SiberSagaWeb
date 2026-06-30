/**
 * SmartToolbar — Floating per-component toolbar for the Puck canvas.
 * Renders context-sensitive controls based on the selected component type.
 * All changes are dispatched live to Puck state.
 */
import React, { useState, useRef, useEffect } from "react";
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, Palette, Maximize2, Columns, Rows, Move, Link, Image as ImageIcon,
  ChevronDown, X, Minus, Plus, RotateCcw, Eye
} from "lucide-react";

// ─── Shared mini UI primitives ──────────────────────────────────────────────

const TB = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "4px 6px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    flexWrap: "wrap" as const,
    maxWidth: "480px",
  } as React.CSSProperties,
  sep: {
    width: 1,
    height: 20,
    background: "#334155",
    margin: "0 4px",
    flexShrink: 0,
  } as React.CSSProperties,
  btn: (active?: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: active ? "#3b82f6" : "transparent",
    color: active ? "white" : "#94a3b8",
    transition: "all 0.15s",
    flexShrink: 0,
  }),
  label: {
    fontSize: "0.62rem",
    color: "#64748b",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    padding: "0 4px",
    flexShrink: 0,
  } as React.CSSProperties,
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 6,
    color: "#e2e8f0",
    fontSize: "0.75rem",
    padding: "3px 6px",
    outline: "none",
    width: 60,
    flexShrink: 0,
  } as React.CSSProperties,
  select: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 6,
    color: "#e2e8f0",
    fontSize: "0.75rem",
    padding: "3px 4px",
    outline: "none",
    cursor: "pointer",
    flexShrink: 0,
  } as React.CSSProperties,
  colorBtn: (color: string): React.CSSProperties => ({
    width: 22,
    height: 22,
    borderRadius: 4,
    border: "2px solid #475569",
    background: color || "#ffffff",
    cursor: "pointer",
    flexShrink: 0,
    position: "relative",
  }),
};

// Number stepper (e.g., column count)
const Stepper = ({ value, onChange, min = 1, max = 12, label }: any) => (
  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
    {label && <span style={TB.label}>{label}</span>}
    <button
      style={TB.btn()}
      onClick={() => onChange(Math.max(min, Number(value) - 1))}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1e40af")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Minus size={11} />
    </button>
    <span style={{ ...TB.input, width: 28, textAlign: "center", padding: "3px 2px" }}>
      {value}
    </span>
    <button
      style={TB.btn()}
      onClick={() => onChange(Math.min(max, Number(value) + 1))}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1e40af")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Plus size={11} />
    </button>
  </div>
);

// Compact color picker
const ColorPicker = ({ value, onChange, label }: any) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {label && <span style={TB.label}>{label}</span>}
      <button
        style={TB.colorBtn(value)}
        onClick={() => setOpen((o) => !o)}
        title={value || "Pick color"}
      />
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          marginTop: 4,
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: 8,
          padding: 8,
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: 120, height: 80, border: "none", background: "none", cursor: "pointer" }}
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#hex atau rgba(...)"
            style={{ ...TB.input, width: "100%", boxSizing: "border-box" }}
          />
        </div>
      )}
    </div>
  );
};

// ─── Toolbar definitions per component type ──────────────────────────────────

interface ToolbarProps {
  componentType: string;
  props: Record<string, any>;
  updateProp: (key: string, value: any) => void;
}

// Text toolbar
const TextToolbar = ({ props, updateProp }: ToolbarProps) => {
  const fontSizes = ["0.75rem","0.875rem","1rem","1.125rem","1.25rem","1.5rem","1.875rem","2.25rem","3rem","3.75rem"];
  const weights = ["400","500","600","700","800","900"];

  return (
    <>
      {/* Font size */}
      <span style={TB.label}>Size</span>
      <input
        type="text"
        value={props.fontSize || ""}
        onChange={(e) => updateProp("fontSize", e.target.value)}
        placeholder="1rem"
        style={TB.input}
      />
      <button style={TB.btn()} title="Decrease font">
        <span style={{ fontSize: 9, color: "#94a3b8" }}>A</span>
      </button>
      <button style={TB.btn()} title="Increase font">
        <span style={{ fontSize: 13, color: "#e2e8f0" }}>A</span>
      </button>

      <div style={TB.sep} />

      {/* Font weight */}
      <select
        value={props.fontWeight || "400"}
        onChange={(e) => updateProp("fontWeight", e.target.value)}
        style={TB.select}
        title="Font weight"
      >
        {weights.map((w) => <option key={w} value={w}>{w}</option>)}
      </select>

      <div style={TB.sep} />

      {/* HTML Tag */}
      <select
        value={props.tag || "p"}
        onChange={(e) => updateProp("tag", e.target.value)}
        style={TB.select}
        title="HTML Tag"
      >
        {["h1","h2","h3","h4","h5","h6","p","span"].map((t) => (
          <option key={t} value={t}>{t.toUpperCase()}</option>
        ))}
      </select>

      <div style={TB.sep} />

      {/* Text alignment */}
      {[
        { icon: <AlignLeft size={13} />, val: "left" },
        { icon: <AlignCenter size={13} />, val: "center" },
        { icon: <AlignRight size={13} />, val: "right" },
        { icon: <AlignJustify size={13} />, val: "justify" },
      ].map(({ icon, val }) => (
        <button
          key={val}
          style={TB.btn(props.textAlign === val)}
          onClick={() => updateProp("textAlign", val)}
          onMouseEnter={(e) => { if (props.textAlign !== val) e.currentTarget.style.background = "#1e40af"; }}
          onMouseLeave={(e) => { if (props.textAlign !== val) e.currentTarget.style.background = "transparent"; }}
          title={`Align ${val}`}
        >
          {icon}
        </button>
      ))}

      <div style={TB.sep} />

      {/* Color */}
      <ColorPicker
        label="Color"
        value={props.color}
        onChange={(v: string) => updateProp("color", v)}
      />

      <div style={TB.sep} />

      {/* Margin */}
      <span style={TB.label}>Margin</span>
      <input
        type="text"
        value={props.margin || ""}
        onChange={(e) => updateProp("margin", e.target.value)}
        placeholder="0"
        style={TB.input}
      />
    </>
  );
};

// Button toolbar
const ButtonToolbar = ({ props, updateProp }: ToolbarProps) => (
  <>
    <span style={TB.label}>Label</span>
    <input
      type="text"
      value={props.label || ""}
      onChange={(e) => updateProp("label", e.target.value)}
      style={{ ...TB.input, width: 90 }}
    />

    <div style={TB.sep} />

    <Link size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
    <input
      type="text"
      value={props.href || ""}
      onChange={(e) => updateProp("href", e.target.value)}
      placeholder="https://..."
      style={{ ...TB.input, width: 110 }}
    />

    <div style={TB.sep} />

    <select
      value={props.variant || "primary"}
      onChange={(e) => updateProp("variant", e.target.value)}
      style={TB.select}
      title="Variant"
    >
      <option value="primary">Solid</option>
      <option value="secondary">Outline</option>
      <option value="text">Text</option>
    </select>

    <div style={TB.sep} />

    <select
      value={props.size || "md"}
      onChange={(e) => updateProp("size", e.target.value)}
      style={TB.select}
      title="Size"
    >
      <option value="sm">SM</option>
      <option value="md">MD</option>
      <option value="lg">LG</option>
    </select>

    <div style={TB.sep} />

    <span style={TB.label}>Width</span>
    <input
      type="text"
      value={props.width || ""}
      onChange={(e) => updateProp("width", e.target.value)}
      placeholder="auto"
      style={TB.input}
    />
  </>
);

// Image toolbar
const ImageToolbar = ({ props, updateProp }: ToolbarProps) => (
  <>
    <ImageIcon size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
    <input
      type="text"
      value={props.url || ""}
      onChange={(e) => updateProp("url", e.target.value)}
      placeholder="https://..."
      style={{ ...TB.input, width: 130 }}
    />

    <div style={TB.sep} />

    <span style={TB.label}>Alt</span>
    <input
      type="text"
      value={props.alt || ""}
      onChange={(e) => updateProp("alt", e.target.value)}
      placeholder="Alt text"
      style={{ ...TB.input, width: 70 }}
    />

    <div style={TB.sep} />

    <span style={TB.label}>W</span>
    <input
      type="text"
      value={props.width || ""}
      onChange={(e) => updateProp("width", e.target.value)}
      placeholder="100%"
      style={TB.input}
    />

    <span style={TB.label}>H</span>
    <input
      type="text"
      value={props.height || ""}
      onChange={(e) => updateProp("height", e.target.value)}
      placeholder="auto"
      style={TB.input}
    />

    <div style={TB.sep} />

    <select
      value={props.objectFit || "cover"}
      onChange={(e) => updateProp("objectFit", e.target.value)}
      style={TB.select}
    >
      <option value="cover">Cover</option>
      <option value="contain">Contain</option>
      <option value="fill">Fill</option>
    </select>

    <div style={TB.sep} />

    <span style={TB.label}>Radius</span>
    <input
      type="text"
      value={props.borderRadius || ""}
      onChange={(e) => updateProp("borderRadius", e.target.value)}
      placeholder="0"
      style={TB.input}
    />
  </>
);

// FlexContainer toolbar
const FlexToolbar = ({ props, updateProp }: ToolbarProps) => (
  <>
    <select
      value={props.layoutType || "flex"}
      onChange={(e) => updateProp("layoutType", e.target.value)}
      style={TB.select}
      title="Layout type"
    >
      <option value="block">Block</option>
      <option value="flex">Flex</option>
      <option value="grid">Grid</option>
    </select>

    {props.layoutType !== "grid" && (
      <>
        <div style={TB.sep} />
        {[
          { icon: <Rows size={13} />, val: "column", title: "Column" },
          { icon: <Columns size={13} />, val: "row", title: "Row" },
        ].map(({ icon, val, title }) => (
          <button
            key={val}
            style={TB.btn(props.flexDirection === val)}
            onClick={() => updateProp("flexDirection", val)}
            title={title}
            onMouseEnter={(e) => { if (props.flexDirection !== val) e.currentTarget.style.background = "#1e40af"; }}
            onMouseLeave={(e) => { if (props.flexDirection !== val) e.currentTarget.style.background = "transparent"; }}
          >
            {icon}
          </button>
        ))}
      </>
    )}

    {props.layoutType === "grid" && (
      <>
        <div style={TB.sep} />
        <span style={TB.label}>Template</span>
        <input
          type="text"
          value={props.gridTemplateColumns || ""}
          onChange={(e) => updateProp("gridTemplateColumns", e.target.value)}
          placeholder="1fr 1fr"
          style={{ ...TB.input, width: 90 }}
        />
      </>
    )}

    <div style={TB.sep} />

    <span style={TB.label}>Gap</span>
    <input
      type="text"
      value={props.gap || ""}
      onChange={(e) => updateProp("gap", e.target.value)}
      placeholder="1rem"
      style={TB.input}
    />

    <div style={TB.sep} />

    <span style={TB.label}>Pad</span>
    <input
      type="text"
      value={props.padding || ""}
      onChange={(e) => updateProp("padding", e.target.value)}
      placeholder="1rem"
      style={TB.input}
    />

    <div style={TB.sep} />

    <ColorPicker
      label="BG"
      value={props.backgroundColor}
      onChange={(v: string) => updateProp("backgroundColor", v)}
    />

    <div style={TB.sep} />

    <span style={TB.label}>W</span>
    <input
      type="text"
      value={props.width || ""}
      onChange={(e) => updateProp("width", e.target.value)}
      placeholder="100%"
      style={TB.input}
    />

    <span style={TB.label}>MinH</span>
    <input
      type="text"
      value={props.minHeight || ""}
      onChange={(e) => updateProp("minHeight", e.target.value)}
      placeholder="auto"
      style={TB.input}
    />
  </>
);

// GridColumns toolbar
const GridToolbar = ({ props, updateProp }: ToolbarProps) => (
  <>
    <Stepper
      label="Cols"
      value={props.columns || 2}
      onChange={(v: number) => updateProp("columns", v)}
      min={1}
      max={6}
    />

    <div style={TB.sep} />

    <span style={TB.label}>Gap</span>
    <input
      type="text"
      value={props.gap || ""}
      onChange={(e) => updateProp("gap", e.target.value)}
      placeholder="1.5rem"
      style={TB.input}
    />

    <div style={TB.sep} />

    <span style={TB.label}>Pad</span>
    <input
      type="text"
      value={props.padding || ""}
      onChange={(e) => updateProp("padding", e.target.value)}
      placeholder="0"
      style={TB.input}
    />

    <div style={TB.sep} />

    <select
      value={props.alignItems || "stretch"}
      onChange={(e) => updateProp("alignItems", e.target.value)}
      style={TB.select}
      title="Align items"
    >
      <option value="stretch">Stretch</option>
      <option value="start">Start</option>
      <option value="center">Center</option>
      <option value="end">End</option>
    </select>

    <div style={TB.sep} />

    <ColorPicker
      label="BG"
      value={props.backgroundColor}
      onChange={(v: string) => updateProp("backgroundColor", v)}
    />
  </>
);

// Spacer toolbar
const SpacerToolbar = ({ props, updateProp }: ToolbarProps) => (
  <>
    <span style={TB.label}>Height</span>
    <input
      type="text"
      value={props.height || ""}
      onChange={(e) => updateProp("height", e.target.value)}
      placeholder="2rem"
      style={{ ...TB.input, width: 70 }}
    />
    <input
      type="range"
      min={4}
      max={256}
      value={parseInt(props.height) || 32}
      onChange={(e) => updateProp("height", `${e.target.value}px`)}
      style={{ width: 80, accentColor: "#3b82f6", flexShrink: 0 }}
    />
  </>
);

// Divider toolbar
const DividerToolbar = ({ props, updateProp }: ToolbarProps) => (
  <>
    <ColorPicker
      label="Color"
      value={props.color}
      onChange={(v: string) => updateProp("color", v)}
    />

    <div style={TB.sep} />

    <span style={TB.label}>Thickness</span>
    <input
      type="number"
      min={1}
      max={20}
      value={props.thickness || 1}
      onChange={(e) => updateProp("thickness", Number(e.target.value))}
      style={{ ...TB.input, width: 42 }}
    />

    <div style={TB.sep} />

    <span style={TB.label}>Margin</span>
    <input
      type="text"
      value={props.margin || ""}
      onChange={(e) => updateProp("margin", e.target.value)}
      placeholder="1rem 0"
      style={TB.input}
    />
  </>
);

// Generic fallback toolbar — renders inputs for all flat primitive props
const GenericToolbar = ({ props, updateProp, componentType }: ToolbarProps) => {
  const primitiveEntries = Object.entries(props).filter(
    ([k, v]) =>
      k !== "id" &&
      !k.startsWith("_") &&
      (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
  );

  if (primitiveEntries.length === 0) return (
    <span style={{ ...TB.label, fontSize: "0.7rem", color: "#475569" }}>
      {componentType} — use modal for nested props
    </span>
  );

  return (
    <>
      {primitiveEntries.slice(0, 5).map(([key, val]) => {
        const labelText = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim().slice(0, 8);
        const isColor = key.toLowerCase().includes("color") || (typeof val === "string" && /^#[0-9a-fA-F]{3,8}$/.test(val as string));
        const isBool = typeof val === "boolean";

        return (
          <React.Fragment key={key}>
            {isColor ? (
              <ColorPicker label={labelText} value={val as string} onChange={(v: string) => updateProp(key, v)} />
            ) : isBool ? (
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <span style={TB.label}>{labelText}</span>
                <button
                  style={TB.btn(!!val)}
                  onClick={() => updateProp(key, !val)}
                  onMouseEnter={(e) => { if (!val) e.currentTarget.style.background = "#1e40af"; }}
                  onMouseLeave={(e) => { if (!val) e.currentTarget.style.background = "transparent"; }}
                >
                  <Eye size={12} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                <span style={TB.label}>{labelText}</span>
                <input
                  type={typeof val === "number" ? "number" : "text"}
                  value={val as any}
                  onChange={(e) => updateProp(key, typeof val === "number" ? Number(e.target.value) : e.target.value)}
                  style={TB.input}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ─── SmartToolbar — main export ──────────────────────────────────────────────

interface SmartToolbarProps {
  componentType: string;
  label?: string;
  props: Record<string, any>;
  updateProp: (key: string, value: any) => void;
  onOpenModal: () => void;
  onClose?: () => void;
}

const COMPONENT_MAP: Record<string, React.FC<ToolbarProps>> = {
  BasicText: TextToolbar,
  BasicButton: ButtonToolbar,
  BasicImage: ImageToolbar,
  FlexContainer: FlexToolbar,
  GridColumns: GridToolbar,
  Spacer: SpacerToolbar,
  Divider: DividerToolbar,
};

export const SmartToolbar: React.FC<SmartToolbarProps> = ({
  componentType,
  label,
  props,
  updateProp,
  onOpenModal,
  onClose,
}) => {
  const SpecificToolbar = COMPONENT_MAP[componentType];

  return (
    <div style={TB.wrap}>
      {/* Component type badge */}
      <span style={{
        fontSize: "0.62rem",
        fontWeight: 700,
        color: "#38bdf8",
        background: "#0c4a6e",
        borderRadius: 4,
        padding: "2px 6px",
        flexShrink: 0,
        maxWidth: 80,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {componentType || label || "?"}
      </span>

      <div style={TB.sep} />

      {/* Specific or generic controls */}
      {SpecificToolbar ? (
        <SpecificToolbar componentType={componentType} props={props} updateProp={updateProp} />
      ) : (
        <GenericToolbar componentType={componentType} props={props} updateProp={updateProp} />
      )}

      <div style={TB.sep} />

      {/* Open full modal */}
      <button
        style={{
          ...TB.btn(),
          background: "#1e3a5f",
          color: "#93c5fd",
          fontSize: "0.62rem",
          width: "auto",
          padding: "4px 8px",
          gap: 4,
          display: "flex",
          alignItems: "center",
        }}
        onClick={onOpenModal}
        title="Edit semua props"
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1e40af")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#1e3a5f")}
      >
        <ChevronDown size={11} />
        <span>All Props</span>
      </button>
    </div>
  );
};

export default SmartToolbar;
