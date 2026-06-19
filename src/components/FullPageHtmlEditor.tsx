import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { X } from "lucide-react";

export default function FullPageHtmlEditor({ onClose }: { onClose: () => void }) {
  const { customHTML, updateCustomHTML } = useAdmin();
  const [htmlValue, setHtmlValue] = useState(customHTML);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setHtmlValue(customHTML);
  }, [customHTML]);

  const handleSave = () => {
    updateCustomHTML(htmlValue);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
        <h3 className="font-heading font-extrabold">Full‑Page HTML Editor</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <textarea
          value={htmlValue}
          onChange={e => setHtmlValue(e.target.value)}
          className="w-full h-full border border-slate-200 rounded-xl p-3 text-xs font-medium"
          placeholder="Edit full HTML here..."
        />
      </div>
      <div className="p-4 flex justify-end gap-2 bg-slate-100">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
        >
          Simpan
        </button>
      </div>
      {success && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded">
          Berhasil
        </div>
      )}
    </div>
  );
}
