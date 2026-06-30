import React from "react";

// Number Stepper Field
export const NumberStepperField = ({ value, onChange, min = 0, max = 100, step = 1 }: any) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <button
      onClick={() => onChange(Math.max(min, (Number(value) || 0) - step))}
      style={{ width: 28, height: 28, borderRadius: 6, background: "#f1f5f9", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: "bold" }}
    >
      -
    </button>
    <input
      type="number"
      value={value ?? min}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ flex: 1, height: 28, textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 6, outline: "none" }}
    />
    <button
      onClick={() => onChange(Math.min(max, (Number(value) || 0) + step))}
      style={{ width: 28, height: 28, borderRadius: 6, background: "#f1f5f9", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: "bold" }}
    >
      +
    </button>
  </div>
);

// Slider Field for Units (e.g. 1rem, 20px)
export const UnitSliderField = ({ value, onChange, min = 0, max = 100, unit = "px" }: any) => {
  const numericValue = parseFloat(value) || 0;
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="range"
          min={min}
          max={max}
          value={numericValue}
          onChange={(e) => onChange(`${e.target.value}${unit}`)}
          style={{ flex: 1, accentColor: "#3b82f6" }}
        />
        <input
          type="text"
          value={value ?? `0${unit}`}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 60, height: 26, padding: "0 6px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: "0.75rem", outline: "none" }}
        />
      </div>
    </div>
  );
};

// Checkbox Toggle Field
export const ToggleField = ({ value, onChange }: any) => (
  <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 8 }}>
    <div style={{ position: "relative", width: 36, height: 20, borderRadius: 10, background: value ? "#3b82f6" : "#cbd5e1", transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 2, left: value ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
    </div>
    <span style={{ fontSize: "0.75rem", color: value ? "#3b82f6" : "#64748b", fontWeight: 600 }}>
      {value ? "Aktif" : "Nonaktif"}
    </span>
    <input
      type="checkbox"
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
      style={{ display: "none" }}
    />
  </label>
);

// Color Picker Field
export const ColorPickerField = ({ value, onChange }: any) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <input
      type="color"
      value={value || "#000000"}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: 36, height: 28, border: "1px solid #e2e8f0", borderRadius: 6, padding: 2, cursor: "pointer" }}
    />
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="#000000"
      style={{ flex: 1, height: 28, padding: "0 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.75rem", fontFamily: "monospace", outline: "none" }}
    />
  </div>
);
