/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '../../supabase';

export default function ImagePickerModal() {
  const { imagePickerOpen, closeImagePicker, imagePickerCallback } = useEditor();
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!imagePickerOpen) return null;

  const handleSelect = (url: string) => {
    if (imagePickerCallback && url.trim()) {
      imagePickerCallback(url.trim());
    }
    closeImagePicker();
    setUrlInput('');
    setError(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured) {
      setError('Upload tidak tersedia. Konfigurasi Supabase diperlukan.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await getSupabase()
        .storage
        .from('SiberSagaWeb')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = getSupabase()
        .storage
        .from('SiberSagaWeb')
        .getPublicUrl(filePath);

      handleSelect(data.publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Gagal mengupload gambar.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="text-blue-600" size={20} />
            Pilih Gambar
          </h3>
          <button onClick={closeImagePicker} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-4 border-b border-slate-100">
          <button 
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'url' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('url')}
          >
            <LinkIcon size={16} /> URL Gambar
          </button>
          <button 
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={16} /> Upload File
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {activeTab === 'url' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Masukkan URL Gambar</label>
                <input 
                  type="text" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>
              {urlInput && (
                <div className="mt-4 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video flex items-center justify-center relative">
                  <img src={urlInput} alt="Preview" className="w-full h-full object-contain" onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NDBhMWUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIi8+PHBhdGggZD0ibTIxIDE1LTMuMDgtMy4wOGExLjIgMS4yIDAgMDAtMS42NiAwaC0uMTdsLTEuNzQtMS43NGExLjIgMS4yIDAgMDAtMS42NiAwaC0uMDhMMiAyMiIvPjwvc3ZnPg==';
                  }} />
                </div>
              )}
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => handleSelect(urlInput)}
                  disabled={!urlInput}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gunakan Gambar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!isSupabaseConfigured ? (
                <div className="text-center py-8 px-4 bg-slate-50 border border-slate-200 rounded-xl border-dashed">
                  <div className="text-amber-500 mb-3 flex justify-center"><Upload size={32} /></div>
                  <h4 className="font-bold text-slate-800 mb-1">Upload Tidak Tersedia</h4>
                  <p className="text-sm text-slate-500">Konfigurasi Supabase Storage diperlukan untuk menggunakan fitur upload. Gunakan tab URL sebagai alternatif.</p>
                </div>
              ) : (
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${uploading ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}`}>
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                        <p className="font-medium text-blue-600">Mengupload gambar...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-full mb-3">
                          <Upload size={24} />
                        </div>
                        <p className="font-medium text-slate-800">Klik atau Drag & Drop gambar</p>
                        <p className="text-sm text-slate-500 mt-1">PNG, JPG, WEBP maks 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
