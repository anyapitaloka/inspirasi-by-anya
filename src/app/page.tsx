import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Layers,
  Heart,
  TrendingUp,
  Tag,
} from "lucide-react";
import {
  getProducts,
  getCategories,
  getCollections,
  getLookbooks,
  getArticles,
  getBanners,
  getHomepageSections,
} from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { LookbookCard } from "@/components/lookbook/LookbookCard";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { FlashSaleCountdownBanner } from "@/components/home/FlashSaleCountdownBanner";

export default async function HomePage() {
  const [
    products,
    categories,
    collections,
    lookbooks,
    articles,
    banners,
    sections,
  ] = await Promise.all([
    getProducts({ status: "published" }),
    getCategories(),
    getCollections(),
    getLookbooks(),
    getArticles(),
    getBanners(),
    getHomepageSections(),
  ]);

  const heroBanner = banners[0];
  const editorsPicks = products.filter((p) => p.is_editors_pick);
  const newArrivals = products.filter((p) => p.is_new_arrival);
  const under100k = products.filter((p) => p.price <= 100000);
  const generalCategories = categories.filter((c) => c.type === "general" && c.is_active);
  const styleCategories = categories.filter((c) => c.type === "style" && c.is_active);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO EDITORIAL SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-white border border-bordergray overflow-hidden p-6 sm:p-12 lg:p-16 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Copy */}
            <div className="lg:col-span-7 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/50 border border-mint text-xs font-bold text-ink">
                <Sparkles className="w-3.5 h-3.5 text-ink fill-ink" />
                <span>The Daily Curated Edit • 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ink leading-[1.08]">
                Your Next Fit <br />
                <span className="relative inline-block">
                  Starts Here.
                  <span className="absolute left-0 bottom-1 w-full h-3 bg-lime -z-10 rounded-sm opacity-80" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-coolgray max-w-lg leading-relaxed">
                Outfit inspo, curated Shopee fashion finds, and pieces that just
                make sense. No gatekeeping, just good fits.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="px-7 py-3.5 bg-ink text-white font-bold text-sm rounded-full hover:bg-ink-light transition-all flex items-center gap-2 shadow-sm active:scale-98"
                >
                  <span>Explore the Edit</span>
                  <ArrowRight className="w-4 h-4 text-lime" />
                </Link>

                <Link
                  href="/lookbook"
                  className="px-6 py-3.5 bg-ivory text-ink font-semibold text-sm rounded-full border border-bordergray hover:bg-white transition-all flex items-center gap-2"
                >
                  <span>Lookbook OOTD</span>
                  <ArrowUpRight className="w-4 h-4 text-coolgray" />
                </Link>
              </div>

              {/* Editorial trust badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-coolgray font-medium border-t border-bordergray/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-ink" />
                  <span>Verified Shopee Links</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-ink" />
                  <span>Student & First-Jobber Friendly</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-ink" />
                  <span>Unisex & Modest Inclusive</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={
                    heroBanner?.desktop_image ||
                    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80"
                  }
                  alt="Anya Curated Outfit Editorial"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                
                {/* Floating pill badge on hero image */}
                <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-bordergray flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-coolgray block">
                      Featured OOTD by Anya
                    </span>
                    <span className="text-xs font-bold text-ink">
                      Blok M Chill • Sage Midi Dress & Bag
                    </span>
                  </div>
                  <Link
                    href="/lookbook/blok-m-cafe-chill"
                    className="p-2 bg-lime rounded-full text-ink hover:scale-105 transition-transform"
                    aria-label="Lihat OOTD Anya"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK CATEGORY PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-coolgray">
            Quick Categories
          </h2>
          <Link
            href="/shop"
            className="text-xs font-bold text-ink hover:underline flex items-center gap-1"
          >
            Semua Kategori <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/shop"
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-ink text-white hover:bg-ink-light shrink-0 transition-colors"
          >
            All Pieces ({products.length})
          </Link>
          {generalCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold shrink-0 transition-all shadow-sm ${
                cat.slug === "ootd-by-anya"
                  ? "bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/15 text-rose-900 border border-rose-300 font-extrabold shadow-xs"
                  : "bg-white text-ink border border-bordergray hover:bg-ivory hover:border-coolgray"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH SALE & VOUCHER HUNT COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FlashSaleCountdownBanner />
      </section>

      {/* 3. TRENDING FINDS / ANYA'S PICKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-ink bg-lime px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3 h-3 fill-ink" />
              <span>Anya's Personal Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Fits Worth Saving
            </h2>
            <p className="text-xs sm:text-sm text-coolgray mt-1">
              Potongan outfit favorit pilihan tim editorial yang paling gampang di-styling.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-ink hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            Lihat Semua Picks <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {editorsPicks.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sourcePage="home_editors_picks"
            />
          ))}
        </div>
      </section>

      {/* 4. SHOP BY STYLE & VIBE */}
      <section className="bg-white py-14 sm:py-20 border-y border-bordergray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-coolgray">
              Style It Your Way
            </span>
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">
              Shop by Vibe
            </h2>
            <p className="text-xs sm:text-sm text-coolgray">
              Temukan referensi outfit berdasarkan gaya berpakaian yang paling kamu sukai.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {styleCategories.map((style) => (
              <Link
                key={style.id}
                href={`/shop?style=${encodeURIComponent(style.name)}`}
                className="group p-5 rounded-2xl bg-ivory border border-bordergray hover:border-ink hover:bg-white transition-all text-center flex flex-col items-center justify-center gap-2 hover:shadow-card"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-bordergray flex items-center justify-center group-hover:bg-lime transition-colors">
                  <Sparkles className="w-4 h-4 text-ink" />
                </div>
                <span className="font-bold text-xs sm:text-sm text-ink group-hover:underline">
                  {style.name}
                </span>
                <span className="text-[10px] text-coolgray line-clamp-1">
                  {style.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SHOP BY BUDGET (UNDER 100K HIGHLIGHT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-mint/40 border border-mint p-6 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-ink text-lime text-xs font-black uppercase tracking-wider mb-2">
                Budget Smart
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Curated Under 100K Finds
              </h2>
              <p className="text-xs sm:text-sm text-coolgray mt-1">
                Koleksi outfit bagus, bahan nyaman, dan ramah kantong mahasiswa.
              </p>
            </div>
            <Link
              href="/shop?category=under-100k"
              className="px-5 py-2.5 rounded-full bg-ink text-white font-bold text-xs hover:bg-ink-light transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore All Under 100K</span>
              <ArrowRight className="w-3.5 h-3.5 text-lime" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(under100k.length > 0 ? under100k : products).slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sourcePage="home_under_100k"
            />
          ))}
        </div>
      </section>

      {/* 6. OUTFIT INSPIRATION & LOOKBOOK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coolgray block mb-1">
              Complete Outfits
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              The Lookbook
            </h2>
            <p className="text-xs sm:text-sm text-coolgray mt-1">
              Inspirasi OOTD lengkap dari atasan, bawahan, tas, sampai sneakers.
            </p>
          </div>
          <Link
            href="/lookbook"
            className="text-xs font-bold text-ink hover:underline inline-flex items-center gap-1"
          >
            Semua Lookbook <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbooks.map((look) => (
            <LookbookCard key={look.id} lookbook={look} />
          ))}
        </div>
      </section>

      {/* 7. FEATURED COLLECTIONS */}
      <section className="bg-white py-14 sm:py-20 border-y border-bordergray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-coolgray block mb-1">
                The Curations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Featured Collections
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-ink hover:underline inline-flex items-center gap-1"
            >
              Explore Shop <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/shop`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-ivory border border-bordergray shadow-sm hover:shadow-hover transition-all"
              >
                <Image
                  src={col.cover_image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-lime block">
                    {col.product_ids.length} ITEMS
                  </span>
                  <h3 className="font-extrabold text-xl leading-snug group-hover:underline">
                    {col.title}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STYLE JOURNAL ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coolgray block mb-1">
              Style Notes & Guides
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              The Style Journal
            </h2>
            <p className="text-xs sm:text-sm text-coolgray mt-1">
              Panduan mix-and-match, tips capsule wardrobe, dan trik tampil keren.
            </p>
          </div>
          <Link
            href="/journal"
            className="text-xs font-bold text-ink hover:underline inline-flex items-center gap-1"
          >
            Baca Semua Artikel <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* 9. STYLE DROP NEWSLETTER / COMMUNITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-ink text-white p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-lime text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-lime" />
            <span>Weekly Style Drop</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            New Finds, No Gatekeeping.
          </h2>
          <p className="text-sm text-coolgray max-w-md mx-auto leading-relaxed">
            Dapatkan kurasi outfit mingguan, diskon Shopee tersembunyi, dan OOTD inspo 
            langsung di inbox kamu setiap hari Jumat.
          </p>
          <NewsletterForm />
          <span className="text-[11px] text-coolgray block">
            No spam. Unsubscribe kapan saja.
          </span>
        </div>
      </section>
    </div>
  );
}
