import React, { useState, useEffect, useRef, useCallback } from "react";
import { DropZone } from "@puckeditor/core";
import { X, MousePointerClick, Clock, ArrowDown, Maximize2, PanelRightOpen } from "lucide-react";

// ─── Shared Trigger Fields ────────────────────────────────────────────────────
const triggerFields = {
  triggerType: {
    type: "select" as const,
    label: "Trigger (Kapan Muncul)",
    options: [
      { label: "Manual (via Tombol)", value: "manual" },
      { label: "Exit Intent (Mouse Keluar)", value: "exit-intent" },
      { label: "Time Delay (Setelah N Detik)", value: "time-delay" },
      { label: "Scroll Trigger (Setelah Scroll %)", value: "scroll" },
    ],
  },
  triggerDelay: { type: "number" as const, label: "Time Delay (Detik)" },
  triggerScrollPercent: { type: "number" as const, label: "Scroll Trigger (%)" },
  triggerId: { type: "text" as const, label: "ID Trigger (untuk tombol manual)" },
  showOnce: { type: "boolean" as const, label: "Hanya Tampil Sekali Per Sesi" },
  overlayColor: { type: "text" as const, label: "Warna Overlay (e.g. rgba(0,0,0,0.6))" },
};

// ─── Shared Trigger Hook ──────────────────────────────────────────────────────
function usePopupTrigger({
  triggerType,
  triggerDelay,
  triggerScrollPercent,
  triggerId,
  showOnce,
  isEditor,
}: {
  triggerType: string;
  triggerDelay?: number;
  triggerScrollPercent?: number;
  triggerId?: string;
  showOnce?: boolean;
  isEditor: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const hasFiredRef = useRef(false);
  const storageKey = `popup_shown_${triggerId || "default"}`;

  const show = useCallback(() => {
    if (hasFiredRef.current && showOnce) return;
    if (showOnce) {
      try {
        if (sessionStorage.getItem(storageKey)) return;
        sessionStorage.setItem(storageKey, "1");
      } catch {}
    }
    hasFiredRef.current = true;
    setIsVisible(true);
  }, [showOnce, storageKey]);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    // In editor mode, always show so the user can edit
    if (isEditor) {
      setIsVisible(true);
      return;
    }

    if (triggerType === "manual") {
      // Listen for custom event from any button that targets this popup
      const handler = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail?.popupId === triggerId) show();
      };
      window.addEventListener("open-popup", handler);
      return () => window.removeEventListener("open-popup", handler);
    }

    if (triggerType === "exit-intent") {
      const handler = (e: MouseEvent) => {
        if (e.clientY <= 5) show();
      };
      document.addEventListener("mouseleave", handler);
      return () => document.removeEventListener("mouseleave", handler);
    }

    if (triggerType === "time-delay") {
      const delay = (triggerDelay || 3) * 1000;
      const timer = setTimeout(show, delay);
      return () => clearTimeout(timer);
    }

    if (triggerType === "scroll") {
      const percent = triggerScrollPercent || 50;
      const handler = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        if (scrolled >= percent) show();
      };
      window.addEventListener("scroll", handler, { passive: true });
      return () => window.removeEventListener("scroll", handler);
    }
  }, [triggerType, triggerDelay, triggerScrollPercent, triggerId, isEditor, show]);

  return { isVisible, show, hide };
}

// ─── Popup Modal Block ────────────────────────────────────────────────────────
export const PopupModalBlockConfig = {
  fields: {
    ...triggerFields,
    modalSize: {
      type: "select" as const,
      label: "Ukuran Modal",
      options: [
        { label: "Kecil (400px)", value: "sm" },
        { label: "Sedang (600px)", value: "md" },
        { label: "Besar (800px)", value: "lg" },
        { label: "Extra Besar (1000px)", value: "xl" },
        { label: "Layar Penuh", value: "full" },
      ],
    },
    modalPosition: {
      type: "select" as const,
      label: "Posisi Modal",
      options: [
        { label: "Tengah", value: "center" },
        { label: "Atas", value: "top" },
        { label: "Bawah", value: "bottom" },
      ],
    },
    showCloseButton: { type: "boolean" as const, label: "Tampilkan Tombol Tutup (X)" },
    closeOnOverlay: { type: "boolean" as const, label: "Tutup Saat Klik Overlay" },
    borderRadius: { type: "text" as const, label: "Border Radius (e.g. 16px)" },
    padding: { type: "text" as const, label: "Padding Konten (e.g. 2rem)" },
  },
  defaultProps: {
    triggerType: "time-delay",
    triggerDelay: 5,
    triggerScrollPercent: 50,
    triggerId: "popup-1",
    showOnce: true,
    overlayColor: "rgba(0,0,0,0.6)",
    modalSize: "md",
    modalPosition: "center",
    showCloseButton: true,
    closeOnOverlay: true,
    borderRadius: "16px",
    padding: "2rem",
  },
  render: function PopupModalRender({
    triggerType,
    triggerDelay,
    triggerScrollPercent,
    triggerId,
    showOnce,
    overlayColor,
    modalSize,
    modalPosition,
    showCloseButton,
    closeOnOverlay,
    borderRadius,
    padding,
  }: any) {
    const isEditor = typeof window !== "undefined" && window.location.pathname.includes("/admin");
    const { isVisible, hide } = usePopupTrigger({
      triggerType,
      triggerDelay,
      triggerScrollPercent,
      triggerId,
      showOnce,
      isEditor,
    });

    if (!isVisible) return null;

    const sizeMap: Record<string, string> = {
      sm: "400px",
      md: "600px",
      lg: "800px",
      xl: "1000px",
      full: "100vw",
    };

    const alignMap: Record<string, string> = {
      center: "center",
      top: "flex-start",
      bottom: "flex-end",
    };

    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          backgroundColor: overlayColor || "rgba(0,0,0,0.6)",
          alignItems: alignMap[modalPosition] || "center",
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={(e) => {
          if (closeOnOverlay && e.target === e.currentTarget && !isEditor) hide();
        }}
      >
        <div
          className="bg-white shadow-2xl overflow-hidden relative"
          style={{
            maxWidth: modalSize === "full" ? "100%" : sizeMap[modalSize] || "600px",
            width: "100%",
            maxHeight: modalSize === "full" ? "100vh" : "90vh",
            borderRadius: modalSize === "full" ? "0" : borderRadius || "16px",
            padding: padding || "2rem",
            overflowY: "auto",
            animation: "zoomIn 0.3s ease-out",
          }}
        >
          {showCloseButton && (
            <button
              onClick={() => { if (!isEditor) hide(); }}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          )}

          {/* Editor Label */}
          {isEditor && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-purple-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">
              <Maximize2 size={10} />
              <span>Popup Modal — {triggerType}</span>
            </div>
          )}

          <DropZone zone="popup-content" />
        </div>
      </div>
    );
  },
};

// ─── Popup Slide-In Block ─────────────────────────────────────────────────────
export const PopupSlideInBlockConfig = {
  fields: {
    ...triggerFields,
    slideFrom: {
      type: "select" as const,
      label: "Geser Dari",
      options: [
        { label: "Kanan", value: "right" },
        { label: "Kiri", value: "left" },
        { label: "Bawah", value: "bottom" },
      ],
    },
    panelWidth: { type: "text" as const, label: "Lebar Panel (e.g. 400px, 50vw)" },
    showCloseButton: { type: "boolean" as const, label: "Tampilkan Tombol Tutup (X)" },
    closeOnOverlay: { type: "boolean" as const, label: "Tutup Saat Klik Overlay" },
    borderRadius: { type: "text" as const, label: "Border Radius (e.g. 16px 0 0 16px)" },
    padding: { type: "text" as const, label: "Padding Konten (e.g. 2rem)" },
  },
  defaultProps: {
    triggerType: "time-delay",
    triggerDelay: 5,
    triggerScrollPercent: 50,
    triggerId: "slide-1",
    showOnce: true,
    overlayColor: "rgba(0,0,0,0.4)",
    slideFrom: "right",
    panelWidth: "400px",
    showCloseButton: true,
    closeOnOverlay: true,
    borderRadius: "16px 0 0 16px",
    padding: "2rem",
  },
  render: function PopupSlideInRender({
    triggerType,
    triggerDelay,
    triggerScrollPercent,
    triggerId,
    showOnce,
    overlayColor,
    slideFrom,
    panelWidth,
    showCloseButton,
    closeOnOverlay,
    borderRadius,
    padding,
  }: any) {
    const isEditor = typeof window !== "undefined" && window.location.pathname.includes("/admin");
    const { isVisible, hide } = usePopupTrigger({
      triggerType,
      triggerDelay,
      triggerScrollPercent,
      triggerId,
      showOnce,
      isEditor,
    });

    if (!isVisible) return null;

    // Compute positioning
    const isHorizontal = slideFrom === "right" || slideFrom === "left";
    const panelStyle: React.CSSProperties = {
      position: "fixed",
      backgroundColor: "white",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      padding: padding || "2rem",
      overflowY: "auto",
      zIndex: 10000,
      borderRadius: borderRadius || undefined,
    };

    const animName = `slide-in-${slideFrom}`;

    if (isHorizontal) {
      panelStyle.top = "0";
      panelStyle.bottom = "0";
      panelStyle.width = panelWidth || "400px";
      panelStyle.maxWidth = "90vw";
      if (slideFrom === "right") {
        panelStyle.right = "0";
        panelStyle.animation = `slideLeft 0.35s ease-out`;
      } else {
        panelStyle.left = "0";
        panelStyle.animation = `slideRight 0.35s ease-out`;
      }
    } else {
      // Bottom
      panelStyle.left = "0";
      panelStyle.right = "0";
      panelStyle.bottom = "0";
      panelStyle.maxHeight = "70vh";
      panelStyle.animation = `slideUp 0.35s ease-out`;
    }

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-[9998]"
          style={{
            backgroundColor: overlayColor || "rgba(0,0,0,0.4)",
            animation: "fadeIn 0.3s ease-out",
          }}
          onClick={() => {
            if (closeOnOverlay && !isEditor) hide();
          }}
        />

        {/* Slide-In Panel */}
        <div style={panelStyle} className="relative">
          {showCloseButton && (
            <button
              onClick={() => { if (!isEditor) hide(); }}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          )}

          {/* Editor Label */}
          {isEditor && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">
              <PanelRightOpen size={10} />
              <span>Slide-In ({slideFrom}) — {triggerType}</span>
            </div>
          )}

          <DropZone zone="slidein-content" />
        </div>
      </>
    );
  },
};
