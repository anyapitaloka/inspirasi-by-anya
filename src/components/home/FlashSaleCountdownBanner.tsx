"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Flame, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export function FlashSaleCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    // Calculate countdown towards tonight midnight WIB (UTC+7)
    const updateCountdown = () => {
      const now = new Date();
      // Target midnight tonight
      const target = new Date();
      target.setHours(23, 59, 59, 999);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigit = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink text-white p-5 sm:p-7 border border-ink/20 shadow-xl">
      {/* Background Glow Accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-lime/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#EE4D2D]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Campaign Info */}
        <div className="space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-lime text-ink">
              <Zap className="w-3.5 h-3.5 fill-ink" />
              Anya's Flash Drop & Voucher Hunt
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/20">
              <Flame className="w-3.5 h-3.5 text-[#EE4D2D] fill-[#EE4D2D]" />
              Shopee Live & TikTok Shop Promo
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
            Klaim Diskon s.d 50% & Gratis Ongkir Ekstra
          </h2>

          <p className="text-xs sm:text-sm text-coolgray-light leading-relaxed">
            Promo voucher terbatas di official store Shopee & TikTok Shop. Gunakan sebelum slot promo habis malam ini!
          </p>
        </div>

        {/* Right Side: Ticking Timer & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          {/* Countdown Boxes */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-12 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-lg sm:text-xl font-black text-lime font-mono">
                {formatDigit(timeLeft.hours)}
              </div>
              <span className="text-[10px] uppercase font-bold text-coolgray mt-1">Jam</span>
            </div>

            <span className="text-lg font-black text-coolgray -mt-4">:</span>

            <div className="flex flex-col items-center">
              <div className="w-12 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-lg sm:text-xl font-black text-lime font-mono">
                {formatDigit(timeLeft.minutes)}
              </div>
              <span className="text-[10px] uppercase font-bold text-coolgray mt-1">Menit</span>
            </div>

            <span className="text-lg font-black text-coolgray -mt-4">:</span>

            <div className="flex flex-col items-center">
              <div className="w-12 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-lg sm:text-xl font-black text-[#25F4EE] font-mono">
                {formatDigit(timeLeft.seconds)}
              </div>
              <span className="text-[10px] uppercase font-bold text-coolgray mt-1">Detik</span>
            </div>
          </div>

          {/* Quick CTA */}
          <Link
            href="/shop?maxPrice=100000"
            className="px-6 py-3.5 bg-lime text-ink font-black text-xs sm:text-sm rounded-2xl hover:bg-lime/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-lime/20 active:scale-98"
          >
            <span>Serbu Fit Under 100K</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
