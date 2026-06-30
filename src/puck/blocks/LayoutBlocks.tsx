import React, { useRef, useState, useCallback, useEffect } from "react";
import { DropZone } from "@puckeditor/core";
import { NumberStepperField, UnitSliderField, ColorPickerField, ToggleField } from "../CustomFields";

export const FlexContainerConfig = {
  fields: {
    layoutType: {
      type: "radio" as const,
      options: [
        { label: "Block", value: "block" },
        { label: "Flex", value: "flex" },
        { label: "Grid", value: "grid" },
      ],
    },
    flexDirection: {
      type: "radio" as const,
      options: [
        { label: "Row", value: "row" },
        { label: "Column", value: "column" },
      ],
    },
    alignItems: {
      type: "select" as const,
      options: [
        { label: "Stretch", value: "stretch" },
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
      ],
    },
    justifyContent: {
      type: "select" as const,
      options: [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
      ],
    },
    flexWrap: {
      type: "radio" as const,
      options: [
        { label: "No Wrap", value: "nowrap" },
        { label: "Wrap", value: "wrap" },
      ],
    },
    // Flex Child Properties (for arrangement relative to parent container)
    flexGrow: { 
      type: "custom" as const,
      render: (props: any) => <NumberStepperField {...props} min={0} max={10} step={1} />
    },
    flexShrink: { 
      type: "custom" as const,
      render: (props: any) => <NumberStepperField {...props} min={0} max={10} step={1} />
    },
    flexBasis: { type: "text" as const },
    alignSelf: {
      type: "select" as const,
      options: [
        { label: "Auto", value: "auto" },
        { label: "Stretch", value: "stretch" },
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
      ],
    },
    justifySelf: {
      type: "select" as const,
      options: [
        { label: "Auto", value: "auto" },
        { label: "Stretch", value: "stretch" },
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
      ],
    },
    gridTemplateColumns: {
      type: "text" as const, // e.g., "1fr 1fr", "repeat(3, 1fr)"
    },
    gap: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={100} unit="px" />
    },
    padding: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={120} unit="px" />
    },
    margin: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={120} unit="px" />
    },
    position: {
      type: "select" as const,
      options: [
        { label: "Static", value: "static" },
        { label: "Relative", value: "relative" },
        { label: "Absolute", value: "absolute" },
        { label: "Fixed", value: "fixed" },
        { label: "Sticky", value: "sticky" },
      ],
    },
    top: { type: "text" as const },
    right: { type: "text" as const },
    bottom: { type: "text" as const },
    left: { type: "text" as const },
    zIndex: { type: "number" as const },
    backgroundColor: { 
      type: "custom" as const,
      render: (props: any) => <ColorPickerField {...props} />
    },
    borderRadius: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={100} unit="px" />
    },
    minHeight: { type: "text" as const },
    width: { type: "text" as const },
    maxWidth: { type: "text" as const },
  },
  defaultProps: {
    layoutType: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    gap: "1rem",
    padding: "1rem",
    margin: "0",
    position: "relative",
    width: "100%",
    backgroundColor: "transparent",
  },
  render: ({
    layoutType,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    flexGrow,
    flexShrink,
    flexBasis,
    alignSelf,
    justifySelf,
    gridTemplateColumns,
    gap,
    padding,
    margin,
    position,
    top,
    right,
    bottom,
    left,
    zIndex,
    backgroundColor,
    borderRadius,
    minHeight,
    width,
    maxWidth,
  }: any) => {
    const style: React.CSSProperties = {
      display: layoutType,
      gap: gap || undefined,
      padding: padding || undefined,
      margin: margin || undefined,
      position: position as any,
      top: top || undefined,
      right: right || undefined,
      bottom: bottom || undefined,
      left: left || undefined,
      zIndex: zIndex !== undefined ? zIndex : 1,
      backgroundColor: backgroundColor || undefined,
      borderRadius: borderRadius || undefined,
      minHeight: minHeight || undefined,
      width: width || undefined,
      maxWidth: maxWidth || undefined,
      flexGrow: flexGrow !== undefined ? flexGrow : undefined,
      flexShrink: flexShrink !== undefined ? flexShrink : undefined,
      flexBasis: flexBasis || undefined,
      alignSelf: alignSelf !== "auto" ? alignSelf : undefined,
      justifySelf: justifySelf !== "auto" ? justifySelf : undefined,
    };

    if (layoutType === "flex") {
      style.flexDirection = flexDirection;
      style.alignItems = alignItems;
      style.justifyContent = justifyContent;
      style.flexWrap = flexWrap;
    } else if (layoutType === "grid") {
      style.gridTemplateColumns = gridTemplateColumns || "1fr";
    }

    return (
      <div style={style} className="relative group/container">
        {/* Helper overlay for empty containers in edit mode */}
        <div className="absolute inset-0 border border-dashed border-slate-300 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity z-10" />
        <DropZone zone="content" />
      </div>
    );
  },
};

export const GridColumnsConfig = {
  fields: {
    columns: {
      type: "custom" as const,
      render: (props: any) => <NumberStepperField {...props} min={1} max={12} step={1} />
    },
    gap: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={100} unit="px" />
    },
    padding: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={120} unit="px" />
    },
    margin: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={120} unit="px" />
    },
    alignItems: {
      type: "select" as const,
      options: [
        { label: "Stretch", value: "stretch" },
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
      ],
    },
    backgroundColor: { 
      type: "custom" as const,
      render: (props: any) => <ColorPickerField {...props} />
    },
  },
  defaultProps: {
    columns: 2,
    gap: "1.5rem",
    padding: "0",
    margin: "0",
    alignItems: "stretch",
    backgroundColor: "transparent",
  },
  render: ({ columns, gap, padding, margin, alignItems, backgroundColor }: any) => {
    const style: React.CSSProperties = {
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gap || undefined,
      padding: padding || undefined,
      margin: margin || undefined,
      alignItems: alignItems as any,
      backgroundColor: backgroundColor || undefined,
      width: "100%",
    };

    return (
      <div style={style} className="relative group/gridcols">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex flex-col min-h-[50px] relative">
             <div className="absolute inset-0 border border-dashed border-slate-300 pointer-events-none opacity-0 group-hover/gridcols:opacity-100 transition-opacity z-10" />
             <DropZone zone={`col-${i}`} />
          </div>
        ))}
      </div>
    );
  }
};

export const BasicTextConfig = {
  fields: {
    tag: {
      type: "select" as const,
      options: [
        { label: "Heading 1", value: "h1" },
        { label: "Heading 2", value: "h2" },
        { label: "Heading 3", value: "h3" },
        { label: "Heading 4", value: "h4" },
        { label: "Heading 5", value: "h5" },
        { label: "Heading 6", value: "h6" },
        { label: "Paragraph", value: "p" },
        { label: "Span", value: "span" },
      ],
    },
    text: { type: "textarea" as const },
    color: { 
      type: "custom" as const,
      render: (props: any) => <ColorPickerField {...props} />
    },
    fontSize: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={8} max={72} unit="px" />
    },
    fontWeight: {
      type: "select" as const,
      options: [
        { label: "Normal (400)", value: "400" },
        { label: "Medium (500)", value: "500" },
        { label: "Semi Bold (600)", value: "600" },
        { label: "Bold (700)", value: "700" },
        { label: "Extra Bold (800)", value: "800" },
      ],
    },
    textAlign: {
      type: "radio" as const,
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
        { label: "Justify", value: "justify" },
      ],
    },
    margin: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={100} unit="px" />
    },
  },
  defaultProps: {
    tag: "p",
    text: "Teks baru...",
    textAlign: "left",
  },
  render: ({ tag, text, color, fontSize, fontWeight, textAlign, margin, id, puck }: any) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    const ref = useRef<HTMLElement>(null);
    const [editing, setEditing] = useState(false);
    const isEditorEnv = typeof window !== "undefined" && (window as any).__PUCK_EDITOR__ === true;

    const style: React.CSSProperties = {
      color: color || undefined,
      fontSize: fontSize || undefined,
      fontWeight: fontWeight || undefined,
      textAlign: textAlign as any,
      margin: margin || undefined,
      whiteSpace: "pre-wrap",
      outline: editing ? "2px solid #3b82f6" : "none",
      borderRadius: 4,
      cursor: isEditorEnv ? (editing ? "text" : "default") : undefined,
      minHeight: "1em",
      transition: "outline 0.15s",
    };

    const handleDoubleClick = useCallback(() => {
      if (!isEditorEnv) return;
      setEditing(true);
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
          // Place cursor at end
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(ref.current);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 10);
    }, [isEditorEnv]);

    const handleBlur = useCallback(() => {
      setEditing(false);
      // Dispatch custom event so PageBuilder can pick up the new text
      if (ref.current && id) {
        const newText = ref.current.innerText;
        window.dispatchEvent(new CustomEvent("puck:inlineTextEdit", {
          detail: { id, text: newText },
        }));
      }
    }, [id]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      // Escape or Shift+Enter to finish editing
      if (e.key === "Escape") {
        e.preventDefault();
        (e.target as HTMLElement).blur();
      }
    }, []);

    return (
      <Tag
        ref={ref as any}
        style={style}
        contentEditable={editing}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        data-puck-inline-edit="true"
        data-component-id={id}
        title={isEditorEnv ? "Double-click to edit text" : undefined}
      >
        {text}
      </Tag>
    );
  },
};


export const BasicImageConfig = {
  fields: {
    url: { type: "text" as const },
    alt: { type: "text" as const },
    width: { type: "text" as const },
    height: { type: "text" as const },
    objectFit: {
      type: "select" as const,
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
      ],
    },
    borderRadius: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={100} unit="px" />
    },
    margin: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={100} unit="px" />
    },
  },
  defaultProps: {
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    alt: "Image",
    width: "100%",
    objectFit: "cover",
  },
  render: ({ url, alt, width, height, objectFit, borderRadius, margin }: any) => {
    const style: React.CSSProperties = {
      width: width || undefined,
      height: height || undefined,
      objectFit: objectFit as any,
      borderRadius: borderRadius || undefined,
      margin: margin || undefined,
      display: "block",
    };
    return <img src={url} alt={alt} style={style} />;
  },
};

export const BasicButtonConfig = {
  fields: {
    label: { type: "text" as const },
    href: { type: "text" as const },
    variant: {
      type: "select" as const,
      options: [
        { label: "Primary (Solid)", value: "primary" },
        { label: "Secondary (Outline)", value: "secondary" },
        { label: "Text", value: "text" },
      ],
    },
    size: {
      type: "select" as const,
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    margin: { 
      type: "custom" as const,
      render: (props: any) => <UnitSliderField {...props} min={0} max={100} unit="px" />
    },
    width: { type: "text" as const },
  },
  defaultProps: {
    label: "Click Me",
    href: "#",
    variant: "primary",
    size: "md",
  },
  render: ({ label, href, variant, size, margin, width }: any) => {
    let baseClass = "inline-flex items-center justify-center font-bold rounded-xl transition-all cursor-pointer text-center ";
    
    if (variant === "primary") baseClass += "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg ";
    else if (variant === "secondary") baseClass += "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 ";
    else if (variant === "text") baseClass += "text-blue-600 hover:text-blue-700 hover:bg-blue-50 ";
    
    if (size === "sm") baseClass += "px-4 py-2 text-sm ";
    else if (size === "md") baseClass += "px-6 py-3 text-base ";
    else if (size === "lg") baseClass += "px-8 py-4 text-lg ";

    const style: React.CSSProperties = {
      margin: margin || undefined,
      width: width || undefined,
    };
    
    return (
      <a href={href} className={baseClass} style={style}>
        {label}
      </a>
    );
  }
};
