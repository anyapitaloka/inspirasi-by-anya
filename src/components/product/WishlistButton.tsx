"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/context";

interface WishlistButtonProps {
  product: { id: string; name: string };
  className?: string;
  variant?: "icon" | "button";
}

export function WishlistButton({
  product,
  className = "",
  variant = "icon",
}: WishlistButtonProps) {
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(product.id);
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleWishlist(product);
    setTimeout(() => setAnimating(false), 300);
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-bordergray text-sm font-semibold transition-all ${
          saved
            ? "bg-lavender text-ink border-lavender"
            : "bg-white text-ink hover:bg-ivory"
        } ${className}`}
        aria-label={saved ? "Hapus dari wishlist" : "Simpan outfit ke wishlist"}
      >
        <Heart
          className={`w-4 h-4 transition-transform ${
            saved ? "fill-ink stroke-ink" : "stroke-ink"
          } ${animating ? "scale-125" : ""}`}
        />
        <span>{saved ? "Saved in Wishlist" : "Save This Fit"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-ink transition-all ${
        animating ? "scale-115" : "hover:scale-105"
      } ${className}`}
      aria-label={saved ? "Hapus dari wishlist" : "Simpan ke wishlist"}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          saved ? "fill-red-500 text-red-500" : "text-ink"
        }`}
      />
    </button>
  );
}
