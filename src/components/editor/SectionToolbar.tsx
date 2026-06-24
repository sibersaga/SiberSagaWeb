/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Pencil, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical } from 'lucide-react';

interface SectionToolbarProps {
  sectionId: string;
  sectionLabel: string;
  children: React.ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
}

export default function SectionToolbar({
  sectionId,
  sectionLabel,
  children,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  isVisible = true
}: SectionToolbarProps) {
  const { isEditMode, openSidebar } = useEditor();

  if (!isEditMode) {
    return isVisible ? <>{children}</> : null;
  }

  const handleEdit = () => {
    openSidebar(sectionId);
  };

  return (
    <div className={`relative group transition-all duration-300 ${!isVisible ? 'opacity-50 grayscale' : ''}`}>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-dashed group-hover:border-blue-300 pointer-events-none z-10 transition-colors duration-300 rounded-2xl"></div>
      
      <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto flex items-center gap-2 bg-white shadow-xl rounded-xl border border-slate-200 px-2 py-1.5">
        <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100 mr-1 select-none">
          <GripVertical size={14} className="opacity-50" />
          {sectionLabel}
        </div>
        
        <button onClick={handleEdit} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors tooltip" title="Edit Konten" type="button">
          <Pencil size={16} />
        </button>
        
        {onMoveUp && (
          <button onClick={onMoveUp} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors tooltip" title="Geser ke Atas" type="button">
            <ArrowUp size={16} />
          </button>
        )}
        
        {onMoveDown && (
          <button onClick={onMoveDown} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors tooltip" title="Geser ke Bawah" type="button">
            <ArrowDown size={16} />
          </button>
        )}
        
        {onToggleVisibility && (
          <button onClick={onToggleVisibility} className={`p-1.5 rounded-md transition-colors tooltip ${!isVisible ? 'text-red-500 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-100'}`} title={isVisible ? "Sembunyikan" : "Tampilkan"} type="button">
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
