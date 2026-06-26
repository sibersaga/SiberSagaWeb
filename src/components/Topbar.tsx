/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, Phone, Instagram, Youtube } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import EditableText from "./editor/EditableText";

interface TopbarProps {
  contactEmail?: string;
  announcement?: string;
  socialUrls?: {
    instagram?: string;
    youtube?: string;
  };
}

export default function Topbar(props: TopbarProps) {
  const { siteContent, updateSiteContent } = useAdmin();
  const topbar = siteContent.topbar;

  const updateTopbar = (key: string, value: string) => {
    updateSiteContent({
      ...siteContent,
      topbar: { ...topbar, [key]: value }
    });
  };

  return (
    <div className="bg-brand-navy text-white text-[11px] py-2 border-b border-white/5 hidden md:block">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Contact Info */}
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${props.contactEmail ?? siteContent.topbar.contactEmail}`}
            className="flex items-center gap-2 hover:text-amber-400 transition"
          >
            <Mail size={14} className="text-amber-400" />
            <span>
              <EditableText value={props.contactEmail ?? topbar.contactEmail} onChange={(v) => updateTopbar('contactEmail', v)} />
            </span>
          </a>
        </div>

        {/* Social media and local time */}
        <div className="flex items-center gap-4">
          <span className="text-white/50 border-r border-white/20 pr-4">
            <EditableText value={props.announcement ?? topbar.location} onChange={(v) => updateTopbar('location', v)} />
          </span>
          <div className="flex items-center gap-2">
            <a href={props.socialUrls?.instagram ?? siteContent.footer.socialUrls.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
              <Instagram size={14} />
            </a>
            <a href={props.socialUrls?.youtube ?? siteContent.footer.socialUrls.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
              <Youtube size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
