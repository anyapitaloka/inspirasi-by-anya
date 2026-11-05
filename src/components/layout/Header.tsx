"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Lock,
  Tag,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { Logo } from "../brand/Logo";
import { useWishlist } from "@/lib/wishlist/context";

export function Header() {
  const pathname = usePathname();
  const { count } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mainCategories = [
    {
      label: "✨ OOTD by Anya",
      href: "/shop?category=ootd-by-anya",
      isSpecial: true,
    },
    { label: "Semua", href: "/shop" },
    { label: "Dresses", href: "/shop?category=dresses" },
    { label: "Atasan", href: "/shop?category=atasan-blouse" },
    { label: "Bawahan", href: "/shop?category=bawahan-rok" },
    { label: "Sepatu", href: "/shop?category=sepatu-sandal" },
    { label: "Tas", href: "/shop?category=tas-aksesoris" },
    { label: "Lookbook", href: "/lookbook" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <>
      {/* 1. Top Editorial Micro-Ticker */}
      <div className="bg-gradient-to-r from-stone-900 via-neutral-900 to-stone-950 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] uppercase tracking-wider border border-rose-500/30">
              <Sparkles className="w-2.5 h-2.5" /> Curated
            </span>
            <span className="text-stone-300 text-[11px] sm:text-xs">
              <strong>INSPIRASI BY ANYA</strong> — Temukan outfit pilihan Anya & belanja kilat via kode <strong>#1, #2...</strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] shrink-0 font-medium text-stone-300">
            <Link
              href="/shop?category=ootd-by-anya"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition-colors"
            >
              <span>Explore OOTD by Anya</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-stone-600">|</span>
            <Link
              href="/admin/login"
              className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex flex-col">
              <Logo variant="primary" />
              <span className="hidden sm:block text-[9px] font-black tracking-widest text-stone-400 uppercase -mt-1 ml-10">
                Curated Fashion & OOTD
              </span>
            </div>
          </div>

          {/* Center: Integrated Live Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama outfit atau ketik kode #1, #2..."
                className="w-full pl-10 pr-20 py-2.5 bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-stone-900 rounded-full border border-stone-200 focus:border-stone-400 text-xs sm:text-sm font-medium focus:outline-none transition-all placeholder:text-stone-400 shadow-inner"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-stone-900 text-stone-100 text-[11px] font-bold rounded-full hover:bg-stone-800 transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Cari</span>
              </button>
            </form>
          </div>

          {/* Right: Actions (Search Mobile, Wishlist, CTA) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Cari produk"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link with Live Counter */}
            <Link
              href="/wishlist"
              className="relative p-2 text-stone-800 hover:bg-stone-100 rounded-full transition-colors group"
              aria-label={`Wishlist tersimpan (${count} item)`}
            >
              <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${count > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {count > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {/* Quick Code Finder CTA Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 text-stone-800 text-xs font-bold rounded-full hover:bg-stone-200 transition-all border border-stone-200/80"
            >
              <Tag className="w-3.5 h-3.5 text-stone-500" />
              <span>Ketik #Kode</span>
            </button>

            {/* Fit Check CTA */}
            <Link
              href="/shop?category=ootd-by-anya"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-stone-900 to-neutral-800 text-white text-xs font-bold rounded-full hover:opacity-95 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">OOTD Anya</span>
              <span className="sm:hidden">OOTD</span>
            </Link>
          </div>
        </div>

        {/* 3. Sub-Header Navigation Bar: Categories & OOTD by Anya */}
        <div className="border-t border-stone-100 bg-white/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
            {mainCategories.map((cat) => {
              const isActive =
                cat.href === "/shop"
                  ? pathname === "/shop" && typeof window !== "undefined" && !window.location.search
                  : pathname === "/shop" && typeof window !== "undefined" && window.location.search.includes(cat.href.split("?")[1]);

              if (cat.isSpecial) {
                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/15 text-rose-900 border border-rose-300/80 hover:border-rose-400 hover:scale-105 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{cat.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  </Link>
                );
              }

              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-stone-900 text-white font-bold shadow-xs"
                      : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}

            {/* Quick Under 100K Badge */}
            <Link
              href="/shop?category=under-100k"
              className="shrink-0 ml-auto hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <span>Under 100K 🔥</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 4. Quick Search & #Code Finder Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                  Cari Produk / Ketik #Kode
                </span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama produk atau nomor kode (contoh: #1, #25, #60)..."
                className="w-full pl-11 pr-24 py-3.5 bg-stone-50 text-stone-900 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:bg-white font-medium text-sm transition-all shadow-inner"
                autoFocus
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-4" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-xs"
              >
                Cari Sekarang
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-stone-100 space-y-3">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Pencarian Kode Cepat:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Link
                  href="/shop?search=%231"
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 font-extrabold hover:bg-rose-100 transition-colors border border-rose-200/80"
                >
                  #1 (Dress Rekomendasi)
                </Link>
                <Link
                  href="/shop?search=%2331"
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-800 font-extrabold hover:bg-stone-200 transition-colors"
                >
                  #31 (Atasan & Blouse)
                </Link>
                <Link
                  href="/shop?search=%2361"
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-800 font-extrabold hover:bg-stone-200 transition-colors"
                >
                  #61 (Bawahan & Skirt)
                </Link>
                <Link
                  href="/shop?search=%2391"
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-800 font-extrabold hover:bg-stone-200 transition-colors"
                >
                  #91 (Sepatu Korean)
                </Link>
                <Link
                  href="/shop?search=%23121"
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-800 font-extrabold hover:bg-stone-200 transition-colors"
                >
                  #121 (Tas Bahu)
                </Link>
                <Link
                  href="/shop?category=ootd-by-anya"
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 font-black hover:bg-amber-100 transition-colors border border-amber-200"
                >
                  ✨ OOTD by Anya
                </Link>
                <Link
                  href="/shop?category=under-100k"
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 transition-colors"
                >
                  Under 100K 🔥
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
          <div className="bg-white w-4/5 max-w-sm h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                <Logo variant="primary" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100"
                  aria-label="Tutup menu navigasi"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mt-5 mb-4">
                <form
                  onSubmit={(e) => {
                    handleSearchSubmit(e);
                    setMobileMenuOpen(false);
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik nama atau #kode (#1, #2)..."
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-100 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </form>
              </div>

              {/* Navigation Items */}
              <div className="flex flex-col gap-1">
                <Link
                  href="/shop?category=ootd-by-anya"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-rose-50 to-amber-50 text-rose-900 border border-rose-200 flex items-center justify-between shadow-xs mb-1"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>✨ OOTD by Anya</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                </Link>

                {mainCategories
                  .filter((c) => !c.isSpecial)
                  .map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-stone-50 transition-colors flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                    </Link>
                  ))}
              </div>

              <div className="mt-6 pt-5 border-t border-stone-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2.5">
                  Koleksi & Budget
                </span>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/shop?category=under-100k"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Under 100K Finds</span>
                    <span>🔥</span>
                  </Link>
                  <Link
                    href="/shop?category=under-150k"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 rounded-lg"
                  >
                    Under 150K
                  </Link>
                  <Link
                    href="/lookbook"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 rounded-lg"
                  >
                    Interactive Lookbook
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-stone-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
              >
                <span>Jelajahi Semua Produk</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-stone-100 text-stone-600 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-stone-200 transition-colors"
              >
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
