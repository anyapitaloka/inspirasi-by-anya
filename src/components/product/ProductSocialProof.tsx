"use client";

import React, { useState, useEffect } from "react";
import { Flame, Eye, Sparkles, TrendingUp, AlertCircle } from "lucide-react";

interface ProductSocialProofProps {
  productId: string;
  productCode: number;
}

export function ProductSocialProof({
  productId,
  productCode,
}: ProductSocialProofProps) {
  // Deterministic seed based on productCode
  const baseActive = 9 + ((productCode * 7) % 15); // e.g. 9 - 23 viewers
  const baseDaily = 120 + ((productCode * 37) % 95); // e.g. 120 - 215 daily views

  const [activeViewers, setActiveViewers] = useState(baseActive);

  // Micro-fluctuation to give realistic live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveViewers((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 6 ? 6 : next > 28 ? 28 : next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 space-y-2.5">
      {/* Live Active Viewers */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-ink">
            <strong className="text-emerald-700 font-extrabold">{activeViewers} orang</strong> sedang melihat outfit ini
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded-full">
          <Flame className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
          High Demand
        </span>
      </div>

      {/* 24-Hour Metric & Urgency Text */}
      <div className="text-xs text-coolgray flex items-start gap-2 pt-1 border-t border-amber-500/15">
        <TrendingUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          Lebih dari <strong className="text-ink font-extrabold">{baseDaily} pengunjung</strong> mengecek outfit ini hari ini. Stok ukuran favorit cepat menipis di official store.
        </p>
      </div>
    </div>
  );
}
