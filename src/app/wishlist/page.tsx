"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Trash2, Share2, Sparkles, Check } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/context";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { wishlistIds, count } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadSavedProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const all: Product[] = data.products || [];
          setProducts(all.filter((p) => wishlistIds.includes(p.id)));
        }
      } catch (err) {
        console.error("Failed to load wishlist products", err);
      } finally {
        setLoading(false);
      }
    }
    loadSavedProducts();
  }, [wishlistIds]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-bordergray mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coolgray mb-2">
            <Heart className="w-3.5 h-3.5 fill-ink text-ink" />
            <span>Saved Outfits ({count})</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            My Wishlist & Inspo Fits
          </h1>
          <p className="text-xs sm:text-sm text-coolgray mt-1">
            Kumpulan outfit pilihanmu yang disimpan di browser ini untuk referensi belanja Shopee.
          </p>
        </div>

        {count > 0 && (
          <button
            onClick={handleShare}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-bordergray text-xs font-bold text-ink hover:bg-ivory transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span>Link Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-coolgray" />
                <span>Bagikan Wishlist</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Notice on Local Storage Persistence */}
      <div className="mb-8 p-4 rounded-2xl bg-white border border-bordergray text-xs text-coolgray flex items-center justify-between">
        <span>
          💡 <strong>Info:</strong> Wishlist tersimpan di browser perangkat ini secara lokal
          sehingga kamu tidak perlu repot membuat akun.
        </span>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-bordergray bg-white p-4 space-y-3"
            >
              <div className="aspect-[3/4] w-full rounded-xl bg-bordergray shimmer" />
              <div className="h-4 w-3/4 rounded bg-bordergray shimmer" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-bordergray p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center mx-auto text-coolgray">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-ink">
            Wishlist Kamu Masih Kosong
          </h2>
          <p className="text-xs sm:text-sm text-coolgray leading-relaxed">
            Belum ada outfit yang disimpan. Cari pakaian yang kamu suka di katalog lalu klik
            ikon hati untuk menyimpannya di sini.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white font-bold text-xs hover:bg-ink-light transition-colors"
          >
            <span>Jelajahi Outfit Sekarang</span>
            <ArrowRight className="w-4 h-4 text-lime" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sourcePage="wishlist_page"
            />
          ))}
        </div>
      )}
    </div>
  );
}
