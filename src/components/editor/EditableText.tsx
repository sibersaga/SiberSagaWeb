/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
  children?: React.ReactNode;
}

export default function EditableText({
  value,
  onChange,
  tag = 'span',
  className = '',
  multiline = false,
  children
}: EditableTextProps) {
  const { isEditMode, markChanged } = useEditor();
  const Tag = tag as any;
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== value) {
      contentRef.current.innerText = value;
    }
  }, [value, isEditMode]);

  if (!isEditMode) {
    return <Tag className={className}>{children || value}</Tag>;
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.innerText;
    if (newValue !== value) {
      onChange(newValue);
      markChanged();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <Tag
      ref={contentRef}
      className={`relative cursor-text outline-none transition-all duration-200 border border-transparent hover:border-dashed hover:border-blue-300 hover:bg-blue-50/50 focus:border-solid focus:border-blue-500 focus:bg-blue-50/80 rounded px-1 -mx-1 group ${className}`}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {value}
      <div contentEditable={false} className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white p-1 rounded-full shadow-sm pointer-events-none z-10">
        <Pencil size={12} />
      </div>
    </Tag>
  );
}
