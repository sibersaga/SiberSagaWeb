import React, { useEffect, useState } from "react";
import { Render } from "@puckeditor/core";
import { config } from "../puck/config";

// In a real application, you would fetch this from Supabase.
// For now, we will try to read from localStorage or use a default.

export default function DynamicPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // You would typically fetch page data based on the route slug
    // Example: const { data } = await supabase.from('pages').select('content').eq('slug', slug);
    const saved = localStorage.getItem("puck-page-data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse page data", e);
      }
    } else {
      // Default empty data
      setData({ content: [], root: {} });
    }
  }, []);

  if (!data) return <div className="p-8 text-center">Loading...</div>;

  return <Render config={config} data={data} />;
}
