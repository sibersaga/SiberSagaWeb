/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition w-full"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          <span className="font-semibold text-sm">Filter & Cari</span>
        </button>
      </div>

      {/* Sidebar - Desktop visible, Mobile animated */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          x: isMobileOpen ? 0 : -300,
        }}
        className="hidden lg:block lg:col-span-1"
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="lg:hidden fixed left-0 top-16 bottom-0 w-72 bg-white shadow-xl z-50 overflow-y-auto"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
