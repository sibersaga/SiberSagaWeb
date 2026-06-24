/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Topbar from "../Topbar";
import Header from "../Header";
import Footer from "../Footer";
import AnnouncementsTicker from "../AnnouncementsTicker";
import AdminPanel from "../AdminPanel";
import { useAdmin } from "../../context/AdminContext";
import { EditorProvider } from "../../context/EditorContext";
import EditorToggle from "../editor/EditorToggle";
import EditorSidebar from "../editor/EditorSidebar";
import ImagePickerModal from "../editor/ImagePickerModal";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAdminMode } = useAdmin();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = React.useState(false);

  return (
    <EditorProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white flex flex-col relative">
        <Topbar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer onOpenAdmin={() => setIsAdminPanelOpen(true)} />
        <AnnouncementsTicker />
        <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
        
        {isAdminMode && (
          <>
            <EditorToggle isAdmin={isAdminMode} />
            <EditorSidebar />
            <ImagePickerModal />
          </>
        )}
      </div>
    </EditorProvider>
  );
}
