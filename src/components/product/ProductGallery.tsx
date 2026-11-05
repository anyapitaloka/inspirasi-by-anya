"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  mainImage: string;
  additionalImages?: string[];
  productName: string;
}

export function ProductGallery({
  mainImage,
  additionalImages = [],
  productName,
}: ProductGalleryProps) {
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = allImages[selectedIndex] || mainImage;

  return (
    <div className="space-y-4">
      {/* Active Main Image */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-ivory border border-bordergray shadow-sm">
        <Image
          src={activeImage}
          alt={`${productName} view ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? "border-ink scale-102 shadow-sm"
                  : "border-bordergray opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
