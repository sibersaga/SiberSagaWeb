/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-slate-50 border-b border-slate-200 py-3">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-sm">
        <Link to="/" className="flex items-center gap-1 text-brand-sky hover:text-brand-navy transition">
          <Home size={16} />
          <span>Home</span>
        </Link>

        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={16} className="text-slate-400" />
            {item.href ? (
              <Link to={item.href} className="text-brand-sky hover:text-brand-navy transition font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-600 font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
