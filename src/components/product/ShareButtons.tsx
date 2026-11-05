"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  productCode?: number;
  priceFormatted?: string;
  url?: string;
  className?: string;
}

export function ShareButtons({
  title,
  productCode,
  priceFormatted,
  url,
  className = "",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "https://inspirasibyanya.id";
  };

  const codeText = productCode ? `(Kode: #${productCode})` : "";
  const priceText = priceFormatted ? ` | ${priceFormatted}` : "";

  const handleWhatsAppShare = () => {
    const fullUrl = getShareUrl();
    const message = `✨ Cek outfit keren ini di INSPIRASI BY ANYA!\n\n${title} ${codeText}${priceText}\n\n👉 Buka di sini: ${fullUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyForIG = async () => {
    const fullUrl = getShareUrl();

    // If native Web Share API is available (e.g. mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `INSPIRASI BY ANYA - ${title}`,
          text: `Cek outfit ${title} ${codeText} di INSPIRASI BY ANYA`,
          url: fullUrl,
        });
        return;
      } catch (err) {
        // User cancelled or fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-coolgray flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" />
          Bagikan Outfit:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* WhatsApp Button */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/30"
          title="Share ke WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          Share ke WhatsApp
        </button>

        {/* IG Stories / Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyForIG}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-lavender/30 text-ink hover:bg-lavender/50 transition-all border border-lavender"
          title="Salin tautan untuk stiker IG Stories"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Link Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Link (IG Stories)</span>
            </>
          )}
        </button>
      </div>

      {copied && (
        <div className="p-2.5 rounded-xl bg-ink text-white text-[11px] leading-tight flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <Check className="w-3.5 h-3.5 text-lime shrink-0" />
          <span>
            Tautan siap ditempel di <strong>Stiker Link IG Stories</strong> kamu! 📸✨
          </span>
        </div>
      )}
    </div>
  );
}
