import React, { useEffect, useState } from "react";
import { Render } from "@puckeditor/core";
import { config } from "../puck/config";
import { EditorProvider } from "../context/EditorContext";
import { getPuckPublishedData } from "../puck/puckSupabase";
import { useAdmin } from "../context/AdminContext";
import { buildDynamicLayout } from "../puck/puckUtils";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { siteContent, programs, teachers, stats, achievements, innovations, news } = useAdmin();

  useEffect(() => {
    async function loadData() {
      // 1. Try to load from Supabase Published Data
      const published = await getPuckPublishedData();
      if (published && published.content && published.content.length > 0) {
        setData(published);
        setIsLoaded(true);
        return;
      }

      // 2. Fallback to local storage (legacy compatibility)
      const saved = localStorage.getItem("puck-page-data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.content && parsed.content.length > 0) {
            setData(parsed);
            setIsLoaded(true);
            return;
          }
        } catch (e) {
          console.error("Failed to parse local page data", e);
        }
      }

      // 3. Build layout dynamically from AdminContext data
      const dynamicLayout = buildDynamicLayout(
        siteContent,
        programs,
        teachers,
        stats,
        achievements,
        innovations,
        news
      );
      setData(dynamicLayout);
      setIsLoaded(true);
    }
    loadData();
  }, [siteContent, programs, teachers, stats, achievements, innovations, news]);

  if (!isLoaded) return <div className="p-8 text-center flex items-center justify-center min-h-screen">Loading...</div>;

  // Render the Puck page (either from DB, local storage, or dynamically built)
  return (
    <EditorProvider>
      <Render config={config} data={data} />
    </EditorProvider>
  );
}
