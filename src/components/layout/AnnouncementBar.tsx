"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X } from "lucide-react";

interface AnnouncementBarProps {
  text?: string;
  link?: string;
  enabled?: boolean;
}

export function AnnouncementBar({
  text = "⚡ The Daily Edit is live • Curated Shopee Fashion Finds • Updated Daily",
  link = "/shop",
  enabled = true,
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!enabled || !visible) return null;

  return (
    <aside aria-label="Pengumuman" className="bg-ink text-white py-2 px-4 text-xs font-medium border-b border-ink-light transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-lime shrink-0 animate-pulse" />
          <span className="text-gray-200">{text}</span>
          {link && (
            <Link
              href={link}
              className="inline-flex items-center gap-1 text-lime font-bold hover:underline ml-1"
            >
              Cek Sekarang <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-coolgray hover:text-white p-1 rounded transition-colors"
          aria-label="Tutup pengumuman"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
