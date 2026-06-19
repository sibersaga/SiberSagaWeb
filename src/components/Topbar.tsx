/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, Phone, Instagram, Youtube } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function Topbar() {
  const { siteContent } = useAdmin();

  return (
    <div className="bg-brand-navy text-white text-[11px] py-2 border-b border-white/5 hidden md:block">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Contact Info */}
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${siteContent.topbar.contactEmail}`}
            className="flex items-center gap-2 hover:text-amber-400 transition"
          >
            <Mail size={14} className="text-amber-400" />
            <span>{siteContent.topbar.contactEmail}</span>
          </a>
        </div>

        {/* Social media and local time */}
        <div className="flex items-center gap-4">
          <span className="text-white/50 border-r border-white/20 pr-4">{siteContent.topbar.location}</span>
          <a
            href={siteContent.topbar.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition p-1"
            title="Instagram"
          >
            <Instagram size={14} />
          </a>
          <a
            href={siteContent.topbar.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition p-1"
            title="YouTube"
          >
            <Youtube size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
