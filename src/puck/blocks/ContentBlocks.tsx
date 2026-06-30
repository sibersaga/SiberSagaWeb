import React from "react";
import * as LucideIcons from "lucide-react";

export const IconBlockConfig = {
  fields: {
    iconName: { type: "text" as const }, // e.g. "ArrowRight"
    size: { type: "number" as const },
    color: { type: "text" as const },
    alignment: {
      type: "radio" as const,
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    iconName: "Star",
    size: 24,
    color: "#000000",
    alignment: "center",
  },
  render: ({ iconName, size, color, alignment }: any) => {
    // Dynamically get the icon from lucide-react
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

    const wrapperStyle: React.CSSProperties = {
      display: "flex",
      justifyContent:
        alignment === "left"
          ? "flex-start"
          : alignment === "right"
          ? "flex-end"
          : "center",
      width: "100%",
    };

    return (
      <div style={wrapperStyle}>
        <IconComponent size={size} color={color} />
      </div>
    );
  },
};

export const DividerBlockConfig = {
  fields: {
    width: { type: "text" as const },
    thickness: { type: "number" as const },
    color: { type: "text" as const },
    style: {
      type: "select" as const,
      options: [
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
        { label: "Dotted", value: "dotted" },
      ],
    },
    alignment: {
      type: "radio" as const,
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    margin: { type: "text" as const },
  },
  defaultProps: {
    width: "100%",
    thickness: 1,
    color: "#e2e8f0",
    style: "solid",
    alignment: "center",
    margin: "1rem 0",
  },
  render: ({ width, thickness, color, style, alignment, margin }: any) => {
    const wrapperStyle: React.CSSProperties = {
      display: "flex",
      justifyContent:
        alignment === "left"
          ? "flex-start"
          : alignment === "right"
          ? "flex-end"
          : "center",
      width: "100%",
      margin: margin || undefined,
    };

    const lineStyle: React.CSSProperties = {
      width: width,
      borderBottomWidth: `${thickness}px`,
      borderBottomStyle: style,
      borderBottomColor: color,
    };

    return (
      <div style={wrapperStyle}>
        <div style={lineStyle} />
      </div>
    );
  },
};

export const SpacerBlockConfig = {
  fields: {
    height: { type: "text" as const },
  },
  defaultProps: {
    height: "50px",
  },
  render: ({ height }: any) => {
    return <div style={{ height: height, width: "100%" }} />;
  },
};

export const RawHTMLBlockConfig = {
  fields: {
    htmlContent: {
      type: "textarea" as const,
      label: "Raw HTML Code"
    }
  },
  defaultProps: {
    htmlContent: "<div style=\"padding: 20px; background: #f0fdf4; border: 1px dashed #22c55e;\">Tulis kode HTML Anda di sini</div>"
  },
  render: ({ htmlContent }: any) => {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
        className="w-full relative"
      />
    );
  }
};
