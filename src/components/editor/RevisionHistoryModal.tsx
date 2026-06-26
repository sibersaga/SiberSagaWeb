import React, { useEffect, useState } from "react";
import { X, Clock, RotateCcw, CheckCircle2 } from "lucide-react";
import { PageRevision, getPuckRevisions } from "../../puck/puckSupabase";

interface RevisionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (data: any) => void;
}

export default function RevisionHistoryModal({ isOpen, onClose, onRestore }: RevisionHistoryModalProps) {
  const [revisions, setRevisions] = useState<PageRevision[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getPuckRevisions().then((data) => {
        setRevisions(data);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800">
            <Clock size={20} className="text-blue-500" />
            <h2 className="font-bold text-lg">Riwayat Versi (Revision History)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">Memuat riwayat...</div>
          ) : revisions.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              Belum ada riwayat versi yang diterbitkan.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {revisions.map((rev, idx) => (
                <div
                  key={rev.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                      Versi {formatDate(rev.timestamp)}
                      {idx === 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider font-bold">
                          <CheckCircle2 size={10} /> Terbaru
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {Object.keys(rev.data?.zones || {}).length} zona tersimpan
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Apakah Anda yakin ingin mengembalikan layout ke versi ini? Draft saat ini akan diganti.")) {
                        onRestore(rev.data);
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    Pulihkan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
