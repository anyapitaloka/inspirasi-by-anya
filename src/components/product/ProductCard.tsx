"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight, Flame, Tag } from "lucide-react";
import { Product } from "@/lib/types";
import { formatIDR } from "@/lib/utils/formatters";
import { WishlistButton } from "./WishlistButton";
import { AffiliateButton } from "./AffiliateButton";

interface ProductCardProps {
  product: Product;
  className?: string;
  sourcePage?: string;
}

export function ProductCard({
  product,
  className = "",
  sourcePage = "grid",
}: ProductCardProps) {
  const detailUrl = `/product/${product.slug}`;

  return (
    <article
      aria-label={product.name}
      className={`group relative bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-stone-400 ${className}`}
    >
      <div>
        {/* Image Container with Badges & Wishlist */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
          <Link href={detailUrl} className="block w-full h-full">
            <Image
              src={product.main_image}
              alt={product.image_alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.is_editors_pick && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white shadow-sm">
                <Sparkles className="w-3 h-3 fill-white" />
                Anya's Pick
              </span>
            )}
            {product.is_new_arrival && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white shadow-sm">
                New Find
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton product={{ id: product.id, name: product.name }} />
          </div>

          {/* High-Contrast Product Code Badge */}
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-xs font-black tracking-wider bg-stone-950/90 text-lime border border-lime/50 shadow-md backdrop-blur-sm flex items-center gap-1">
              <Tag className="w-3 h-3 text-lime" />
              <span>#{product.product_code}</span>
            </span>
          </div>

          {/* Audience pill */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-stone-900/80 text-white backdrop-blur-sm uppercase">
              {product.audience}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          {/* Brand & Code Info */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
            <div className="flex items-center gap-1.5 truncate max-w-[70%]">
              <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 font-black text-[10px] border border-stone-200 shrink-0">
                #{product.product_code}
              </span>
              <span className="uppercase tracking-wider truncate">
                {product.brand}
              </span>
            </div>
            {product.style_tags?.[0] && (
              <span className="text-stone-400 text-[10px]">
                {product.style_tags[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={detailUrl} className="block group-hover:text-stone-900">
            <h3 className="font-bold text-sm text-stone-900 leading-snug line-clamp-2 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-black text-base text-stone-950">
                {formatIDR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatIDR(product.original_price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA: Shopee Affiliate Button */}
      <div className="p-4 pt-0">
        <AffiliateButton
          productSlug={product.slug}
          platform="shopee"
          sourcePage={sourcePage}
          label="Beli di Shopee"
          size="sm"
        />
      </div>
    </article>
  );
}
