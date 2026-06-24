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

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAdminMode } = useAdmin();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      <Topbar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer onOpenAdmin={() => setIsAdminPanelOpen(true)} />
      <AnnouncementsTicker />
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </div>
  );
}
