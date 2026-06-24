/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Pencil, X } from 'lucide-react';

interface EditorToggleProps {
  isAdmin: boolean;
}

export default function EditorToggle({ isAdmin }: EditorToggleProps) {
  const { isEditMode, toggleEditMode, hasUnsavedChanges } = useEditor();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isEditMode ? (
        <div className="flex items-center gap-3 bg-white border-2 border-blue-500 rounded-full shadow-xl pl-4 pr-1 py-1 transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-sm font-bold text-blue-700 select-none mr-2">Mode Edit Aktif</span>
            {hasUnsavedChanges && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full select-none" title="Ada perubahan belum disimpan">Belum Disimpan</span>
            )}
          </div>
          <button 
            onClick={toggleEditMode}
            className="p-2 bg-blue-50 text-blue-600 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
            title="Keluar Mode Edit"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <button
          onClick={toggleEditMode}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl px-5 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Pencil size={18} />
          Edit Mode
        </button>
      )}
    </div>
  );
}
