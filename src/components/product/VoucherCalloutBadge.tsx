"use client";

import React, { useState } from "react";
import { Ticket, Truck, Check, Sparkles, HelpCircle } from "lucide-react";

export function VoucherCalloutBadge() {
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2500);
  };

  return (
    <div className="rounded-2xl bg-white border border-bordergray p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-coolgray flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-[#EE4D2D]" />
          Promo & Voucher Aktif Hari Ini
        </span>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Live Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Shopee Voucher Card */}
        <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#EE4D2D] uppercase tracking-wide">
              Shopee Live
            </span>
            <span className="text-[10px] font-extrabold text-orange-800 bg-white px-1.5 py-0.2 rounded border border-orange-200">
              Diskon 50%
            </span>
          </div>
          <p className="text-[11px] text-ink font-medium leading-tight">
            Klaim voucher live setiap jam 12:00 & 20:00 WIB di checkout.
          </p>
        </div>

        {/* TikTok Shop Voucher Card */}
        <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200/80 flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-ink uppercase tracking-wide">
              TikTok Shop
            </span>
            <span className="text-[10px] font-extrabold text-cyan-900 bg-white px-1.5 py-0.2 rounded border border-cyan-200">
              Gratis Ongkir
            </span>
          </div>
          <p className="text-[11px] text-ink font-medium leading-tight">
            Kupon gratis ongkir ekstra + diskon belanja pertama di TikTok Shop.
          </p>
        </div>
      </div>

      <p className="text-[10px] text-coolgray italic">
        *Voucher otomatis terpasang saat diarahkan ke aplikasi Shopee & TikTok Shop resmi.
      </p>
    </div>
  );
}
