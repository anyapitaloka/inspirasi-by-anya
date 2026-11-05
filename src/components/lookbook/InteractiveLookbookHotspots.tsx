"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShoppingBag, ArrowUpRight, X, Tag } from "lucide-react";
import { Product, LookbookHotspot } from "@/lib/types";
import { formatIDR } from "@/lib/utils/formatters";
import { AffiliateButton } from "@/components/product/AffiliateButton";

interface InteractiveLookbookHotspotsProps {
  coverImage: string;
  title: string;
  hotspots?: LookbookHotspot[];
  products: Product[];
  className?: string;
}

export function InteractiveLookbookHotspots({
  coverImage,
  title,
  hotspots = [],
  products,
  className = "",
}: InteractiveLookbookHotspotsProps) {
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveSpotId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProductForHotspot = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl select-none group/container ${className}`}
    >
      {/* Background Image */}
      <Image
        src={coverImage}
        alt={title}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 500px"
        className="object-cover object-center"
      />

      {/* Guide Pill Overlay */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-ink/80 text-white backdrop-blur-md shadow-md border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-lime" />
          Shop The Look: Tap Titik Pin
        </span>
      </div>

      {/* Hotspots Loop */}
      {hotspots.map((spot, index) => {
        const product = getProductForHotspot(spot.productId);
        if (!product) return null;

        const isActive = activeSpotId === spot.productId;
        // Determine whether to show popover above or below, left or right
        const isNearRight = spot.x > 60;
        const isNearBottom = spot.y > 65;

        return (
          <div
            key={spot.productId}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
          >
            {/* Pulsing Pin Button */}
            <button
              type="button"
              onClick={() => setActiveSpotId(isActive ? null : spot.productId)}
              aria-label={`Hotspot ${product.name}`}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform duration-200 focus:outline-none ${
                isActive
                  ? "bg-ink scale-125 ring-4 ring-lime"
                  : "bg-white hover:scale-110 hover:ring-2 hover:ring-lime"
              }`}
            >
              {/* Outer Ping Animation */}
              {!isActive && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-lime opacity-75 animate-ping" />
              )}
              {/* Inner Label or Code */}
              <span
                className={`relative text-[10px] font-black ${
                  isActive ? "text-lime" : "text-ink"
                }`}
              >
                #{product.product_code || index + 1}
              </span>
            </button>

            {/* Popover Product Card */}
            {isActive && (
              <div
                className={`absolute z-40 w-64 bg-white text-ink p-3.5 rounded-2xl shadow-2xl border border-bordergray animate-in fade-in zoom-in-95 duration-200 ${
                  isNearBottom ? "bottom-10" : "top-10"
                } ${isNearRight ? "right-0" : "left-0"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-ink text-lime">
                    <Tag className="w-2.5 h-2.5" />
                    KODE #{product.product_code}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSpotId(null);
                    }}
                    className="p-1 rounded-full text-coolgray hover:text-ink hover:bg-ivory"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Product Thumbnail & Basic Info */}
                <div className="flex gap-2.5 items-center mb-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-ivory shrink-0 border border-bordergray">
                    <Image
                      src={product.main_image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-coolgray uppercase truncate block">
                      {product.brand}
                    </span>
                    <h4 className="text-xs font-bold text-ink leading-tight line-clamp-2">
                      {product.name}
                    </h4>
                    <span className="text-xs font-black text-ink mt-0.5 block">
                      {formatIDR(product.price)}
                    </span>
                  </div>
                </div>

                {/* CTAs inside popover: Shopee & TikTok Shop */}
                <div className="space-y-2 pt-2 border-t border-bordergray">
                  <div className="grid grid-cols-2 gap-1.5">
                    <AffiliateButton
                      productSlug={product.slug}
                      platform="shopee"
                      sourcePage="lookbook_hotspot"
                      size="sm"
                      label="Shopee"
                      variant="shopee"
                      className="w-full text-xs py-1.5 justify-center"
                    />
                    <AffiliateButton
                      productSlug={product.slug}
                      platform="tiktok"
                      sourcePage="lookbook_hotspot"
                      size="sm"
                      label="TikTok"
                      variant="tiktok"
                      className="w-full text-xs py-1.5 justify-center"
                    />
                  </div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="block text-center text-[11px] font-bold text-coolgray hover:text-ink py-0.5 transition-colors"
                  >
                    Lihat Detail Outfit &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
