/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Cari...",
  value,
  onChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <div className="relative">
      <div className="relative flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition">
        <Search size={18} className="text-slate-400 ml-3 flex-shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) {
              onSubmit(value);
            }
          }}
          className="flex-1 bg-transparent border-none outline-none px-3 py-2.5 text-sm"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="text-slate-400 hover:text-slate-600 mr-3 p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
