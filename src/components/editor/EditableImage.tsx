/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Camera } from 'lucide-react';

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (newSrc: string) => void;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function EditableImage({ src, alt, onChange, className = '', width, height }: EditableImageProps) {
  const { isEditMode, openImagePicker, markChanged } = useEditor();

  if (!isEditMode) {
    return <img src={src} alt={alt} className={className} width={width} height={height} loading="lazy" decoding="async" />;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openImagePicker((newUrl) => {
      onChange(newUrl);
      markChanged();
    });
  };

  return (
    <div className={`relative inline-block group cursor-pointer ${className}`} onClick={handleClick} style={{ width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto', height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto' }}>
      <img src={src} alt={alt} className={`w-full h-full object-cover transition-opacity group-hover:opacity-70 rounded-[inherit]`} width={width} height={height} loading="lazy" decoding="async" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-[inherit]">
        <div className="bg-white/90 text-slate-800 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium text-sm backdrop-blur-sm">
          <Camera size={16} className="text-blue-600" />
          Ganti Gambar
        </div>
      </div>
    </div>
  );
}
