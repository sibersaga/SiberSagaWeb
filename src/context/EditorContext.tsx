// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useContext, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Tipe konteks editor visual
// ---------------------------------------------------------------------------

interface EditorContextType {
  // Status inti
  isEditMode: boolean;
  toggleEditMode: () => void;

  // Manajemen bagian
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  sidebarSection: string | null;
  openSidebar: (sectionId: string) => void;
  closeSidebar: () => void;

  // Pelacakan perubahan yang belum disimpan
  hasUnsavedChanges: boolean;
  markChanged: () => void;
  markSaved: () => void;

  // Modal pemilih gambar
  imagePickerOpen: boolean;
  imagePickerCallback: ((url: string) => void) | null;
  openImagePicker: (callback: (url: string) => void) => void;
  closeImagePicker: () => void;
}

const STORAGE_KEY = 'sdn3_editor_mode';

function readPersistedEditMode(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function persistEditMode(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // localStorage mungkin tidak tersedia (SSR / incognito penuh)
  }
}

// ---------------------------------------------------------------------------
// Konteks & Provider
// ---------------------------------------------------------------------------

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  // -- Status inti -----------------------------------------------------------
  const [isEditMode, setIsEditMode] = useState<boolean>(readPersistedEditMode);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => {
      const next = !prev;
      persistEditMode(next);

      // Ketika mode edit dinonaktifkan, tutup sidebar & reset bagian aktif
      if (!next) {
        setSidebarOpen(false);
        setSidebarSection(null);
        setActiveSection(null);
      }

      return next;
    });
  }, []);

  // -- Manajemen bagian ------------------------------------------------------
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // -- Sidebar ---------------------------------------------------------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSection, setSidebarSection] = useState<string | null>(null);

  const openSidebar = useCallback((sectionId: string) => {
    setSidebarSection(sectionId);
    setSidebarOpen(true);
    setActiveSection(sectionId);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setSidebarSection(null);
  }, []);

  // -- Pelacakan perubahan ---------------------------------------------------
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const markChanged = useCallback(() => setHasUnsavedChanges(true), []);
  const markSaved = useCallback(() => setHasUnsavedChanges(false), []);

  // -- Modal pemilih gambar --------------------------------------------------
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerCallback, setImagePickerCallback] = useState<
    ((url: string) => void) | null
  >(null);

  const openImagePicker = useCallback((callback: (url: string) => void) => {
    // Simpan callback di dalam fungsi agar React tidak memanggilnya sebagai
    // lazy initializer.
    setImagePickerCallback(() => callback);
    setImagePickerOpen(true);
  }, []);

  const closeImagePicker = useCallback(() => {
    setImagePickerOpen(false);
    setImagePickerCallback(null);
  }, []);

  // -- Nilai konteks ---------------------------------------------------------
  const value: EditorContextType = {
    isEditMode,
    toggleEditMode,

    activeSection,
    setActiveSection,

    sidebarOpen,
    sidebarSection,
    openSidebar,
    closeSidebar,

    hasUnsavedChanges,
    markChanged,
    markSaved,

    imagePickerOpen,
    imagePickerCallback,
    openImagePicker,
    closeImagePicker,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook konsumen
// ---------------------------------------------------------------------------

export function useEditor(): EditorContextType {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error(
      'useEditor harus digunakan di dalam <EditorProvider>. ' +
        'Pastikan komponen Anda dibungkus oleh EditorProvider.',
    );
  }
  return ctx;
}
