"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { Product, Category } from "@/lib/types";
import { formatIDR } from "@/lib/utils/formatters";
import { ProductCard } from "@/components/product/ProductCard";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search & Filter state derived from URL or local
  const currentSearch = searchParams.get("search") || searchParams.get("q") || "";
  const currentAudience = searchParams.get("audience") || "all";
  const currentCategory = searchParams.get("category") || "all";
  const currentStyle = searchParams.get("style") || "all";
  const currentSort = searchParams.get("sort") || "mixed";
  const currentMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : 500000;

  // Local filter inputs
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [selectedAudience, setSelectedAudience] = useState(currentAudience);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [selectedStyle, setSelectedStyle] = useState(currentStyle);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  // Fetch products and categories on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
      } catch (err) {
        console.error("Failed to load catalog data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update URL query parameters on filter change
  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === "all" || (k === "maxPrice" && Number(v) >= 500000)) {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSelectedAudience("all");
    setSelectedCategory("all");
    setSelectedStyle("all");
    setSelectedSort("newest");
    setMaxPrice(500000);
    router.replace(pathname);
  };

  // Filter products client-side
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== "published") return false;

      // Audience
      if (currentAudience !== "all") {
        if (p.audience !== currentAudience && p.audience !== "unisex") {
          return false;
        }
      }

      // Category
      if (currentCategory !== "all") {
        const cat = categories.find((c) => c.slug === currentCategory);
        if (cat) {
          const matchPrimary = p.primary_category_id === cat.id;
          const matchAdditional = p.additional_category_ids?.includes(cat.id);
          if (!matchPrimary && !matchAdditional) return false;
        }
      }

      // Style
      if (currentStyle !== "all") {
        if (!p.style_tags.some((s) => s.toLowerCase() === currentStyle.toLowerCase())) {
          return false;
        }
      }

      // Max price
      if (p.price > currentMaxPrice) {
        return false;
      }

      // Search keyword
      if (currentSearch) {
        const raw = currentSearch.trim().toLowerCase();
        const codeMatch = raw.match(/^#?\s*(\d+)$/);
        const targetCode = codeMatch ? parseInt(codeMatch[1], 10) : null;

        const matchCode = targetCode !== null && p.product_code === targetCode;
        const matchExactTag = `#${p.product_code}` === raw;
        const matchName = p.name.toLowerCase().includes(raw);
        const matchBrand = p.brand.toLowerCase().includes(raw);
        const matchDesc = p.short_description.toLowerCase().includes(raw);
        const matchTag = p.style_tags.some((t) => t.toLowerCase().includes(raw));
        if (!matchCode && !matchExactTag && !matchName && !matchBrand && !matchDesc && !matchTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (currentSearch) {
        const raw = currentSearch.trim().toLowerCase();
        const codeMatch = raw.match(/^#?\s*(\d+)$/);
        const targetCode = codeMatch ? parseInt(codeMatch[1], 10) : null;
        if (targetCode !== null) {
          if (a.product_code === targetCode && b.product_code !== targetCode) return -1;
          if (b.product_code === targetCode && a.product_code !== targetCode) return 1;
        }
      }
      if (currentSort === "price_asc") return a.price - b.price;
      if (currentSort === "price_desc") return b.price - a.price;
      if (currentSort === "editors_pick") {
        return (b.is_editors_pick ? 1 : 0) - (a.is_editors_pick ? 1 : 0);
      }
      if (currentSort === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0; // "mixed" default preserves the shuffled/interleaved organic order
    });
  }, [
    products,
    categories,
    currentAudience,
    currentCategory,
    currentStyle,
    currentMaxPrice,
    currentSearch,
    currentSort,
  ]);

  const activeFiltersCount =
    (currentAudience !== "all" ? 1 : 0) +
    (currentCategory !== "all" ? 1 : 0) +
    (currentStyle !== "all" ? 1 : 0) +
    (currentMaxPrice < 500000 ? 1 : 0) +
    (currentSearch ? 1 : 0);

  const styleList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.style_tags.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Title & Subtitle */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coolgray">
          <span>Catalog & Fits</span>
          <span>•</span>
          <span className="text-ink">{filteredProducts.length} Pieces Found</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          Explore Curated Fits
        </h1>
        <p className="text-xs sm:text-sm text-coolgray max-w-xl">
          Kurasi fashion OOTD, clean fit, streetwear, dan outfit harian pilihan Anya.
          Semua produk langsung mengarah ke penjual terpercaya di Shopee.
        </p>
      </div>

      {/* Top Search Bar & Sort Dropdown */}
      <div className="bg-white p-4 rounded-2xl border border-bordergray shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari outfit atau ketik kode produk (misal: #1, #2)..."
            className="w-full pl-10 pr-20 py-2.5 bg-ivory rounded-xl border border-bordergray text-sm focus:outline-none focus:border-ink font-medium"
          />
          <Search className="w-4 h-4 text-coolgray absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-ink text-white rounded-lg text-xs font-bold hover:bg-ink-light transition-colors"
          >
            Cari
          </button>
        </form>

        {/* Sort & Mobile Filter Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-bordergray bg-ivory text-xs font-bold text-ink"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-lime text-ink text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-coolgray font-semibold hidden sm:inline">
              Urutkan:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                updateFilters({ sort: e.target.value });
              }}
              className="px-3 py-2 bg-ivory rounded-xl border border-bordergray text-xs font-bold text-ink focus:outline-none focus:border-ink"
            >
              <option value="mixed">🎲 Urutan Acak (Default)</option>
              <option value="newest">Terbaru</option>
              <option value="editors_pick">Pilihan Anya (Editor's Pick)</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-bordergray">
              <span className="font-extrabold text-sm text-ink flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-ink" />
                Filter Outfit
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-coolgray hover:text-ink font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Audience / Gender */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-coolgray block">
                Target Audience
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "Women", value: "women" },
                  { label: "Men", value: "men" },
                  { label: "Unisex", value: "unisex" },
                ].map((aud) => (
                  <button
                    key={aud.value}
                    onClick={() => {
                      setSelectedAudience(aud.value);
                      updateFilters({ audience: aud.value });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      currentAudience === aud.value
                        ? "bg-ink text-white shadow-sm"
                        : "bg-ivory text-coolgray hover:text-ink"
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-coolgray block">
                Kategori Produk
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    updateFilters({ category: null });
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    currentCategory === "all"
                      ? "bg-ivory text-ink font-bold"
                      : "text-coolgray hover:text-ink"
                  }`}
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      updateFilters({ category: cat.slug });
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      currentCategory === cat.slug
                        ? "bg-ivory text-ink font-bold"
                        : "text-coolgray hover:text-ink"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.type === "budget" && (
                      <span className="text-[10px] text-lime-dark font-bold">★</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Vibe */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-coolgray block">
                Style / Vibe
              </label>
              <div className="flex flex-wrap gap-1.5">
                {styleList.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      const next = currentStyle === st ? "all" : st;
                      setSelectedStyle(next);
                      updateFilters({ style: next === "all" ? null : next });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      currentStyle === st
                        ? "bg-lime text-ink font-bold"
                        : "bg-ivory text-coolgray hover:text-ink"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold uppercase tracking-wider text-coolgray">
                  Maksimal Harga
                </label>
                <span className="font-extrabold text-ink">
                  {maxPrice >= 500000 ? "Tanpa Batas" : formatIDR(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="25000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                onMouseUp={() => updateFilters({ maxPrice: String(maxPrice) })}
                onTouchEnd={() => updateFilters({ maxPrice: String(maxPrice) })}
                className="w-full accent-ink cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-coolgray">
                <span>Rp50K</span>
                <span>Rp250K</span>
                <span>Rp500K+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs text-coolgray font-semibold">Filter aktif:</span>
              {currentSearch && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ivory border border-bordergray text-xs font-medium text-ink">
                  Cari: "{currentSearch}"
                  <button onClick={() => updateFilters({ search: null })}>
                    <X className="w-3 h-3 text-coolgray hover:text-ink" />
                  </button>
                </span>
              )}
              {currentAudience !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ivory border border-bordergray text-xs font-medium text-ink">
                  Audience: {currentAudience}
                  <button onClick={() => updateFilters({ audience: null })}>
                    <X className="w-3 h-3 text-coolgray hover:text-ink" />
                  </button>
                </span>
              )}
              {currentCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ivory border border-bordergray text-xs font-medium text-ink">
                  Kategori: {currentCategory}
                  <button onClick={() => updateFilters({ category: null })}>
                    <X className="w-3 h-3 text-coolgray hover:text-ink" />
                  </button>
                </span>
              )}
              {currentStyle !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ivory border border-bordergray text-xs font-medium text-ink">
                  Style: {currentStyle}
                  <button onClick={() => updateFilters({ style: null })}>
                    <X className="w-3 h-3 text-coolgray hover:text-ink" />
                  </button>
                </span>
              )}
              {currentMaxPrice < 500000 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ivory border border-bordergray text-xs font-medium text-ink">
                  Harga &le; {formatIDR(currentMaxPrice)}
                  <button onClick={() => updateFilters({ maxPrice: null })}>
                    <X className="w-3 h-3 text-coolgray hover:text-ink" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-500 hover:underline font-bold ml-1"
              >
                Hapus Semua
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-bordergray bg-white p-4 space-y-3"
                >
                  <div className="aspect-[3/4] w-full rounded-xl bg-bordergray shimmer" />
                  <div className="h-4 w-3/4 rounded bg-bordergray shimmer" />
                  <div className="h-4 w-1/2 rounded bg-bordergray shimmer" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-bordergray p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center mx-auto text-coolgray">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-xl text-ink">
                Tidak ada outfit yang cocok
              </h3>
              <p className="text-xs sm:text-sm text-coolgray">
                Coba ubah kata kunci pencarian atau reset filter untuk melihat katalog lengkap.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-full bg-ink text-white font-bold text-xs hover:bg-ink-light transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sourcePage="shop_catalog"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="bg-white w-4/5 max-w-sm h-full flex flex-col justify-between p-6 shadow-2xl fade-in overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-bordergray">
                <span className="font-extrabold text-base text-ink">Filter</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-coolgray hover:text-ink"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Audience */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-coolgray block">
                  Audience
                </span>
                <div className="flex flex-wrap gap-2">
                  {["all", "women", "men", "unisex"].map((aud) => (
                    <button
                      key={aud}
                      onClick={() => setSelectedAudience(aud)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        selectedAudience === aud
                          ? "bg-ink text-white"
                          : "bg-ivory text-coolgray"
                      }`}
                    >
                      {aud}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-coolgray block">
                  Kategori
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-xs font-bold"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-coolgray">Max Harga</span>
                  <span className="font-bold text-ink">{formatIDR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="25000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-ink"
                />
              </div>
            </div>

            {/* Drawer Apply Button */}
            <div className="pt-6 border-t border-bordergray space-y-2">
              <button
                onClick={() => {
                  updateFilters({
                    audience: selectedAudience,
                    category: selectedCategory,
                    maxPrice: String(maxPrice),
                  });
                  setMobileFilterOpen(false);
                }}
                className="w-full py-3 bg-ink text-white font-bold text-sm rounded-xl"
              >
                Terapkan Filter
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-coolgray text-xs font-semibold hover:text-ink"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-coolgray">Memuat Katalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
