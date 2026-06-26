import React, { useState, useEffect } from "react";
import { Render, usePuck } from "@puckeditor/core";
import { Globe, Unlink, RefreshCw } from "lucide-react";
import { PuckTemplate, getPuckTemplates } from "../puckTemplates";
import { config } from "../config";

// Component for rendering inside the Puck Editor (calls usePuck hook safely)
function GlobalTemplateEditorRender({ templateId, title, id, templates, isLoading, handleDetach }: any) {
  const { appState, dispatch } = usePuck();
  const matchedTemplate = templates.find((t: any) => t.id === templateId);

  const onDetachClick = () => {
    if (!matchedTemplate) return;
    if (!window.confirm(`Pecah blok sinkron "${matchedTemplate.name}" menjadi blok-blok biasa? Perubahan selanjutnya tidak akan tersinkron.`)) return;

    const currentContent = appState.data.content || [];
    const currentIndex = currentContent.findIndex((b: any) => b.props.id === id);

    if (currentIndex !== -1) {
      // Map templates blocks with new IDs to avoid conflicts
      const templateBlocks = matchedTemplate.data.map((block: any) => ({
        ...block,
        props: {
          ...block.props,
          id: `${block.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        }
      }));

      const newContent = [...currentContent];
      newContent.splice(currentIndex, 1, ...templateBlocks);

      dispatch({
        type: "setData",
        data: {
          ...appState.data,
          content: newContent
        }
      });
    }
  };

  if (!templateId) {
    return (
      <div className="p-8 border border-dashed border-slate-350 bg-slate-50 text-center rounded-2xl my-4">
        <Globe className="mx-auto text-slate-400 mb-2 animate-pulse" size={24} />
        <h4 className="font-bold text-slate-700 text-sm">Blok Sinkron (Global Template)</h4>
        <p className="text-xs text-slate-500 mt-1 font-normal">Pilih templat global pada panel pengaturan di samping kanan.</p>
      </div>
    );
  }

  if (isLoading && templates.length === 0) {
    return (
      <div className="p-8 border border-slate-200 bg-slate-50/50 text-center rounded-2xl my-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
        <RefreshCw className="animate-spin text-blue-500" size={16} />
        <span>Memuat templat global...</span>
      </div>
    );
  }

  if (!matchedTemplate) {
    return (
      <div className="p-8 border border-dashed border-red-300 bg-red-50 text-center rounded-2xl my-4 text-red-700 text-sm">
        <Globe className="mx-auto mb-2 text-red-400" size={24} />
        <h4 className="font-bold">Templat Global Tidak Ditemukan</h4>
        <p className="text-xs mt-1 font-normal">Templat dengan ID "{templateId}" mungkin telah dihapus.</p>
      </div>
    );
  }

  const templateData = {
    content: matchedTemplate.data || [],
    root: {}
  };

  return (
    <div className="relative group/global-wrapper border border-dashed border-blue-300 hover:border-blue-500 rounded-2xl transition-all p-1 bg-blue-50/5">
      {/* Editor Info Overlay */}
      <div className="absolute top-3 left-3 z-[20] flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover/global-wrapper:opacity-100 transition-opacity">
        <Globe size={12} />
        <span>Sinkron: {matchedTemplate.name}</span>
        <button
          onClick={onDetachClick}
          className="ml-2 pl-2 border-l border-blue-500 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-bold"
          title="Pecah menjadi blok-blok biasa"
        >
          <Unlink size={12} />
          <span>Pecah (Detach)</span>
        </button>
      </div>

      <div className="pointer-events-none select-none opacity-80">
        <Render config={config} data={templateData} />
      </div>
    </div>
  );
}

// Component for rendering in Frontend/Preview (Static, does NOT call usePuck hook)
function GlobalTemplateStaticRender({ templateId, templates, isLoading }: any) {
  if (!templateId) return null;

  const matchedTemplate = templates.find((t: any) => t.id === templateId);

  if (!matchedTemplate) return null;

  const templateData = {
    content: matchedTemplate.data || [],
    root: {}
  };

  return <Render config={config} data={templateData} />;
}

export const GlobalTemplateBlockConfig = {
  fields: {
    templateId: {
      type: "text" as const,
      label: "ID Templat Global"
    },
    title: {
      type: "text" as const,
      label: "Judul Blok"
    }
  },
  defaultProps: {
    templateId: "",
    title: "Global Template"
  },
  render: function GlobalTemplateBlock({ templateId, title, id }: any) {
    const [templates, setTemplates] = useState<PuckTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadTemplates = async () => {
      setIsLoading(true);
      const data = await getPuckTemplates();
      setTemplates(data.filter(t => t.type === "global"));
      setIsLoading(false);
    };

    useEffect(() => {
      loadTemplates();
      // Setup focus synchronization
      const handleFocus = () => loadTemplates();
      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const isEditMode = typeof window !== "undefined" && window.location.pathname.includes("/admin");

    if (isEditMode) {
      return (
        <GlobalTemplateEditorRender
          templateId={templateId}
          title={title}
          id={id}
          templates={templates}
          isLoading={isLoading}
        />
      );
    } else {
      return (
        <GlobalTemplateStaticRender
          templateId={templateId}
          templates={templates}
          isLoading={isLoading}
        />
      );
    }
  }
};
