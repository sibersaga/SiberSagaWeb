import React from "react";

// Global presets
export const globalColors = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  info: "var(--color-info)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
  dark: "var(--color-dark)",
  light: "var(--color-light)",
};

const colorOptions = [
  { label: "Default (None)", value: "" },
  { label: "Primary (Navy)", value: "var(--color-primary)" },
  { label: "Secondary (Sky Blue)", value: "var(--color-secondary)" },
  { label: "Accent (Amber)", value: "var(--color-accent)" },
  { label: "Success (Green)", value: "var(--color-success)" },
  { label: "Info (Blue)", value: "var(--color-info)" },
  { label: "Warning (Yellow)", value: "var(--color-warning)" },
  { label: "Danger (Red)", value: "var(--color-danger)" },
  { label: "Dark (Slate)", value: "var(--color-dark)" },
  { label: "Light (Slate Light)", value: "var(--color-light)" },
];

const fontOptions = [
  { label: "Default (Poppins)", value: "" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
];

const typographyPresets = {
  h1: { fontSize: "2.5rem", fontWeight: "800", lineHeight: "1.2" },
  h2: { fontSize: "2rem", fontWeight: "700", lineHeight: "1.3" },
  h3: { fontSize: "1.75rem", fontWeight: "600", lineHeight: "1.4" },
  h4: { fontSize: "1.25rem", fontWeight: "600", lineHeight: "1.4" },
  body: { fontSize: "1rem", fontWeight: "400", lineHeight: "1.6" },
  subtitle: { fontSize: "1.125rem", fontWeight: "500", lineHeight: "1.5" },
  caption: { fontSize: "0.875rem", fontWeight: "400", lineHeight: "1.4" },
};

// Define all advanced fields that will be merged into each component config
export const advancedFields = {
  // Spacing
  advMargin: { type: "text" as const, label: "Margin (e.g. 10px 0, 2rem)" },
  advPadding: { type: "text" as const, label: "Padding (e.g. 15px, 1rem)" },
  
  // Typography
  advTypographyPreset: {
    type: "select" as const,
    label: "Typography Preset",
    options: [
      { label: "Custom / None", value: "" },
      { label: "H1 - Extra Large Title", value: "h1" },
      { label: "H2 - Large Title", value: "h2" },
      { label: "H3 - Medium Title", value: "h3" },
      { label: "H4 - Small Title", value: "h4" },
      { label: "Body Text", value: "body" },
      { label: "Subtitle", value: "subtitle" },
      { label: "Caption / Small", value: "caption" },
    ]
  },
  advFontFamily: {
    type: "select" as const,
    label: "Font Family",
    options: fontOptions
  },
  advFontSize: { type: "text" as const, label: "Font Size (e.g. 16px, 1.25rem)" },
  advColor: {
    type: "select" as const,
    label: "Font Color (Global)",
    options: colorOptions
  },
  advCustomColor: { type: "text" as const, label: "Font Color (Hex / Custom)" },
  advFontWeight: {
    type: "select" as const,
    label: "Font Weight",
    options: [
      { label: "Default", value: "" },
      { label: "Light (300)", value: "300" },
      { label: "Regular (400)", value: "400" },
      { label: "Medium (500)", value: "500" },
      { label: "Semi Bold (600)", value: "600" },
      { label: "Bold (700)", value: "700" },
      { label: "Black (900)", value: "900" },
    ]
  },
  advDisplay: {
    type: "select" as const,
    label: "Display Layout",
    options: [
      { label: "Default", value: "" },
      { label: "Block", value: "block" },
      { label: "Flex", value: "flex" },
      { label: "Grid", value: "grid" },
      { label: "Inline-Block", value: "inline-block" },
      { label: "None (Hidden)", value: "none" },
    ]
  },

  // Responsive Hiding
  advHideDesktop: { 
    type: "select" as const, 
    label: "Sembunyikan di Desktop",
    options: [{ label: "Tidak", value: "false" }, { label: "Ya", value: "true" }],
  },
  advHideTablet: { 
    type: "select" as const, 
    label: "Sembunyikan di Tablet",
    options: [{ label: "Tidak", value: "false" }, { label: "Ya", value: "true" }],
  },
  advHideMobile: { 
    type: "select" as const, 
    label: "Sembunyikan di Mobile",
    options: [{ label: "Tidak", value: "false" }, { label: "Ya", value: "true" }],
  },

  // Motion Effects
  advAnimation: {
    type: "select" as const,
    label: "Animasi Masuk (Motion Effect)",
    options: [
      { label: "None", value: "" },
      { label: "Fade In", value: "fadeIn" },
      { label: "Zoom In", value: "zoomIn" },
      { label: "Slide Up", value: "slideUp" },
      { label: "Slide Left", value: "slideLeft" },
      { label: "Slide Right", value: "slideRight" },
      { label: "Rotate In", value: "rotateIn" },
    ]
  },
  advSticky: {
    type: "select" as const,
    label: "Sticky Effect",
    options: [
      { label: "None", value: "" },
      { label: "Sticky Top", value: "top" },
      { label: "Sticky Bottom", value: "bottom" },
    ]
  },
  advParallax: { type: "text" as const, label: "Parallax Speed (e.g. -0.2, 0.5)" },

  // Advanced Styling - Background
  advBgType: {
    type: "select" as const,
    label: "Background Type",
    options: [
      { label: "Transparent / Default", value: "" },
      { label: "Solid Color", value: "color" },
      { label: "Gradient", value: "gradient" },
      { label: "Background Image", value: "image" },
    ]
  },
  advBgColor: {
    type: "select" as const,
    label: "BG Color (Global)",
    options: colorOptions
  },
  advCustomBgColor: { type: "text" as const, label: "BG Color (Hex / Custom)" },
  advBgGradient: { type: "text" as const, label: "CSS Gradient (e.g. linear-gradient(45deg, #1e3a8a, #3b82f6))" },
  advBgImage: { type: "text" as const, label: "Background Image URL" },
  advBgOverlay: { type: "text" as const, label: "Overlay Color (e.g. rgba(0,0,0,0.4))" },

  // Borders & Shadows
  advBorderStyle: {
    type: "select" as const,
    label: "Border Style",
    options: [
      { label: "None", value: "none" },
      { label: "Solid", value: "solid" },
      { label: "Dashed", value: "dashed" },
      { label: "Dotted", value: "dotted" },
      { label: "Double", value: "double" },
    ]
  },
  advBorderWidth: { type: "text" as const, label: "Border Width (e.g. 1px, 4px)" },
  advBorderColor: {
    type: "select" as const,
    label: "Border Color (Global)",
    options: colorOptions
  },
  advCustomBorderColor: { type: "text" as const, label: "Border Color (Hex / Custom)" },
  advBorderRadius: { type: "text" as const, label: "Border Radius (e.g. 12px, 50%)" },
  advBoxShadow: { type: "text" as const, label: "Box Shadow (CSS syntax or Tailwind-like)" },

  // CSS Effects
  advOpacity: { type: "text" as const, label: "Opacity (0.0 - 1.0)" },
  advTransformScale: { type: "text" as const, label: "Scale Factor (e.g. 1.05, 0.95)" },
  advTransformRotate: { type: "text" as const, label: "Rotation (Degrees, e.g. 5, -5)" },
  advFilterBlur: { type: "text" as const, label: "Blur Filter (e.g. 4px, 8px)" },
  advFilterBrightness: { type: "text" as const, label: "Brightness Filter (e.g. 1.1, 0.9)" },
  advFilterContrast: { type: "text" as const, label: "Contrast Filter (e.g. 1.2, 0.8)" },
};

interface AdvancedWrapperProps {
  children: React.ReactNode;
  props: any;
}

export function AdvancedWrapper({ children, props }: AdvancedWrapperProps) {
  // Extract all parameters with defaults
  const {
    advMargin,
    advPadding,
    advTypographyPreset,
    advFontFamily,
    advFontSize,
    advColor,
    advCustomColor,
    advFontWeight,
    advDisplay,
    advHideDesktop,
    advHideTablet,
    advHideMobile,
    advAnimation,
    advSticky,
    advParallax,
    advBgType,
    advBgColor,
    advCustomBgColor,
    advBgGradient,
    advBgImage,
    advBgOverlay,
    advBorderStyle,
    advBorderWidth,
    advBorderColor,
    advCustomBorderColor,
    advBorderRadius,
    advBoxShadow,
    advOpacity,
    advTransformScale,
    advTransformRotate,
    advFilterBlur,
    advFilterBrightness,
    advFilterContrast,
  } = props;

  // 1. Build classnames
  const classes: string[] = [];

  // Responsive hide classes
  if (advHideDesktop === "true") classes.push("hide-desktop");
  if (advHideTablet === "true") classes.push("hide-tablet");
  if (advHideMobile === "true") classes.push("hide-mobile");

  // Animations classes
  if (advAnimation) {
    if (advAnimation === "fadeIn") classes.push("animate-fade-in");
    else if (advAnimation === "zoomIn") classes.push("animate-zoom-in");
    else if (advAnimation === "slideUp") classes.push("animate-slide-up");
    else if (advAnimation === "slideLeft") classes.push("animate-slide-left");
    else if (advAnimation === "slideRight") classes.push("animate-slide-right");
    else if (advAnimation === "rotateIn") classes.push("animate-rotate-in");
  }

  // Sticky wrapper styling
  const isSticky = advSticky === "top" || advSticky === "bottom";

  // 2. Build CSS Styles
  const style: React.CSSProperties = {
    margin: advMargin || undefined,
    padding: advPadding || undefined,
    display: advDisplay || undefined,
  };

  // Apply Typography Preset or custom typography
  if (advTypographyPreset && advTypographyPreset in typographyPresets) {
    const preset = typographyPresets[advTypographyPreset as keyof typeof typographyPresets];
    style.fontSize = preset.fontSize;
    style.fontWeight = preset.fontWeight as any;
    style.lineHeight = preset.lineHeight;
  }

  if (advFontFamily) style.fontFamily = advFontFamily;
  if (advFontSize) style.fontSize = advFontSize;
  
  // Font Color resolving
  const finalColor = advCustomColor || advColor;
  if (finalColor) style.color = finalColor;

  if (advFontWeight) style.fontWeight = advFontWeight as any;

  // Background styling
  if (advBgType === "color") {
    style.backgroundColor = advCustomBgColor || advBgColor || "transparent";
  } else if (advBgType === "gradient" && advBgGradient) {
    style.background = advBgGradient;
  } else if (advBgType === "image" && advBgImage) {
    style.backgroundImage = `url(${advBgImage})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundRepeat = "no-repeat";
  }

  // Border & Shadows
  if (advBorderStyle && advBorderStyle !== "none") {
    style.borderStyle = advBorderStyle as any;
    style.borderWidth = advBorderWidth || "1px";
    style.borderColor = advCustomBorderColor || advBorderColor || "transparent";
  }
  if (advBorderRadius) style.borderRadius = advBorderRadius;
  if (advBoxShadow) style.boxShadow = advBoxShadow;

  // CSS Effects
  if (advOpacity) style.opacity = parseFloat(advOpacity);

  // Transform styling
  const transforms: string[] = [];
  if (advTransformScale) transforms.push(`scale(${advTransformScale})`);
  if (advTransformRotate) transforms.push(`rotate(${advTransformRotate}deg)`);
  if (transforms.length > 0) style.transform = transforms.join(" ");

  // Filter styling
  const filters: string[] = [];
  if (advFilterBlur) filters.push(`blur(${advFilterBlur})`);
  if (advFilterBrightness) filters.push(`brightness(${advFilterBrightness})`);
  if (advFilterContrast) filters.push(`contrast(${advFilterContrast})`);
  if (filters.length > 0) style.filter = filters.join(" ");

  // Sticky positioning
  if (isSticky) {
    style.position = "sticky";
    style.zIndex = 100;
    if (advSticky === "top") {
      style.top = "0px";
    } else {
      style.bottom = "0px";
    }
  }

  // 3. Render
  // If parallax is configured, we can apply custom data attributes or transition
  const dataAttrs: Record<string, string> = {};
  if (advParallax) {
    dataAttrs["data-parallax-speed"] = advParallax;
    style.transition = "transform 0.1s ease-out";
  }

  return (
    <div className={`relative ${classes.join(" ")}`} style={style} {...dataAttrs}>
      {/* Background Overlay */}
      {advBgType === "image" && advBgOverlay && (
        <div
          className="absolute inset-0 z-0 pointer-events-none rounded-[inherit]"
          style={{ backgroundColor: advBgOverlay }}
        />
      )}
      {/* Actual Component Content */}
      <div className="relative z-10 w-full h-full rounded-[inherit]">{children}</div>
    </div>
  );
}