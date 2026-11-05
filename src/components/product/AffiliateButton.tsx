"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface AffiliateButtonProps {
  productSlug: string;
  platform?: "shopee" | "tiktok";
  sourcePage?: string;
  className?: string;
  label?: string;
  variant?: "primary" | "secondary" | "shopee" | "tiktok" | "card";
  size?: "sm" | "md" | "lg";
}

export function ShopeeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.7 7.7a.8.8 0 0 0-.8-.7h-2.2C16.3 4.2 14.4 2 12 2S7.7 4.2 7.3 7H5.1a.8.8 0 0 0-.8.7l-1 12.5a2.5 2.5 0 0 0 2.5 2.7h12.4a2.5 2.5 0 0 0 2.5-2.7l-1-12.5zm-7.7-4.2c1.6 0 2.9 1.6 3.2 3.5H8.8c.3-1.9 1.6-3.5 3.2-3.5zm2.7 10.6c-.4.5-1 .8-1.7.9v.9h-1.6v-.9c-1.3-.2-2.3-.9-2.5-2.2l1.6-.3c.1.7.6 1.1 1.4 1.2.6.1 1.2-.1 1.4-.4.2-.3.1-.7-.2-.9-.4-.3-1.2-.5-2-1-.9-.5-1.4-1.2-1.3-2.1 0-.9.6-1.7 1.6-2v-.8h1.6v.8c1 .2 1.8.8 2.1 1.7l-1.5.5c-.2-.5-.5-.8-1.1-.9-.6-.1-1.1.1-1.3.4-.2.2-.2.5 0 .7.3.3 1 .5 1.8.9 1.1.6 1.7 1.3 1.5 2.3 0 .5-.3 1-.7 1.2z" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.36a6.34 6.34 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 15.64a6.34 6.34 0 0 0 10.74 4.54 6.3 6.3 0 0 0 1.95-4.51V8.6a8.16 8.16 0 0 0 4.77 1.54V6.69h-.97z" />
    </svg>
  );
}

export function AffiliateButton({
  productSlug,
  platform = "shopee",
  sourcePage = "catalog",
  className = "",
  label,
  variant,
  size = "md",
}: AffiliateButtonProps) {
  const isTikTok = platform === "tiktok";
  const defaultLabel = isTikTok ? "TikTok Shop" : "Cek di Shopee";
  const displayLabel = label || defaultLabel;

  const redirectUrl = `/go/${productSlug}?platform=${platform}&source=${encodeURIComponent(
    sourcePage
  )}`;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "px-6 py-3.5 text-sm sm:text-base font-bold gap-2.5",
  };

  // Determine variant styling
  let resolvedVariant = variant;
  if (!resolvedVariant) {
    resolvedVariant = isTikTok ? "tiktok" : "shopee";
  }

  const variantClasses = {
    primary:
      "bg-ink text-white hover:bg-ink-light shadow-sm active:scale-98 transition-all font-semibold",
    secondary:
      "bg-lime text-ink hover:bg-lime-dark shadow-sm active:scale-98 transition-all font-bold",
    shopee:
      "bg-[#EE4D2D] text-white hover:bg-[#D73211] shadow-sm active:scale-98 transition-all font-bold border border-[#EE4D2D]",
    tiktok:
      "bg-[#000000] text-white hover:bg-[#1C1C1F] shadow-sm active:scale-98 transition-all font-bold border border-white/20 hover:border-[#25F4EE]/50",
    card: "bg-ivory text-ink hover:bg-mint hover:text-ink transition-all font-bold border border-bordergray",
  };

  return (
    <a
      href={redirectUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`inline-flex items-center justify-center rounded-xl transition-all ${sizeClasses[size]} ${variantClasses[resolvedVariant]} ${className}`}
    >
      {isTikTok ? (
        <TikTokIcon
          className={
            size === "lg"
              ? "w-4 h-4 text-[#25F4EE]"
              : "w-3.5 h-3.5 text-[#25F4EE] shrink-0"
          }
        />
      ) : (
        <ShopeeIcon
          className={
            size === "lg" ? "w-5 h-5 text-white" : "w-4 h-4 text-white shrink-0"
          }
        />
      )}
      <span className="truncate">{displayLabel}</span>
      <ArrowUpRight
        className={
          size === "lg"
            ? "w-4 h-4 opacity-80"
            : "w-3.5 h-3.5 opacity-70 shrink-0"
        }
      />
    </a>
  );
}
