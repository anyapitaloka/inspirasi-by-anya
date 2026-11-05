import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  Sparkles,
  ShieldCheck,
  Check,
  Share2,
  ChevronRight,
  ShoppingBag,
  Info,
  Tag,
} from "lucide-react";
import { getProductBySlug, getProducts, getCategories, getSiteSettings } from "@/lib/db";
import { formatIDR, formatDateIndo } from "@/lib/utils/formatters";
import { ProductGallery } from "@/components/product/ProductGallery";
import { WishlistButton } from "@/components/product/WishlistButton";
import { AffiliateButton } from "@/components/product/AffiliateButton";
import { ProductCard } from "@/components/product/ProductCard";
import { ShareButtons } from "@/components/product/ShareButtons";
import { ProductSocialProof } from "@/components/product/ProductSocialProof";
import { VoucherCalloutBadge } from "@/components/product/VoucherCalloutBadge";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const settings = await getSiteSettings();

  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }

  return {
    title: product.seo_title || `${product.name} | ${product.brand}`,
    description: product.seo_description || product.short_description,
    openGraph: {
      title: `${product.name} — ${settings.brand_name}`,
      description: product.short_description,
      images: [{ url: product.main_image }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts, categories] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ status: "published" }),
    getCategories(),
  ]);

  if (!product || product.status !== "published") {
    notFound();
  }

  const primaryCategory = categories.find((c) => c.id === product.primary_category_id);

  // Related products
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.primary_category_id === product.primary_category_id ||
          product.related_product_ids?.includes(p.id) ||
          p.audience === product.audience)
    )
    .slice(0, 4);

  const jsonLdProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.main_image, ...(product.additional_images || [])],
    description: product.short_description,
    sku: `INSP-${product.product_code || product.id}`,
    mpn: `#${product.product_code}`,
    brand: {
      "@type": "Brand",
      name: product.brand || "INSPIRASI BY ANYA",
    },
    offers: {
      "@type": "Offer",
      url: `https://inspirasibyanya.id/product/${product.slug}`,
      priceCurrency: "IDR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Shopee Indonesia",
      },
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://inspirasibyanya.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://inspirasibyanya.id/shop",
      },
      ...(primaryCategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: primaryCategory.name,
              item: `https://inspirasibyanya.id/shop?category=${primaryCategory.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: product.name,
              item: `https://inspirasibyanya.id/product/${product.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `https://inspirasibyanya.id/product/${product.slug}`,
            },
          ]),
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* JSON-LD Structured Data for Organic Search & Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-coolgray mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        {primaryCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?category=${primaryCategory.slug}`} className="hover:text-ink">
              {primaryCategory.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-bold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Grid: Gallery + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            mainImage={product.main_image}
            additionalImages={product.additional_images}
            productName={product.name}
          />
        </div>

        {/* Right Column: Product Info & Affiliate CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            {/* Badges & Product Code */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider bg-ink text-lime border border-lime/40 shadow-sm">
                <Tag className="w-3.5 h-3.5" />
                KODE #{product.product_code}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-ink text-white">
                {product.audience}
              </span>
              {product.is_editors_pick && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-lime text-ink">
                  <Sparkles className="w-3 h-3 fill-ink" />
                  Anya's Pick
                </span>
              )}
              {product.brand && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-mint text-ink">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-white border border-bordergray flex items-baseline justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-coolgray block">
                  Harga Catatan Tim Editor
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-ink">
                    {formatIDR(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-coolgray line-through">
                      {formatIDR(product.original_price)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-coolgray font-medium text-right max-w-[120px]">
                *Harga dapat berubah sewaktu-waktu di Shopee
              </span>
            </div>

            {/* Social Proof & Live FOMO Indicator */}
            <ProductSocialProof
              productId={product.id}
              productCode={product.product_code}
            />

            {/* Quick #Code Reminder Banner */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium">
              <Tag className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Mau belanja cepat nanti? Cukup ketik kode <strong>#{product.product_code}</strong> di kolom pencarian website.
              </span>
            </div>
          </div>

          {/* Primary Marketplace Affiliate CTAs (Shopee & TikTok Shop) */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-coolgray block">
              Beli di Marketplace Resmi:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AffiliateButton
                productSlug={product.slug}
                platform="shopee"
                sourcePage="pdp"
                label="Beli di Shopee"
                size="lg"
                variant="shopee"
                className="w-full py-3.5 text-sm sm:text-base justify-center shadow-sm"
              />
              <AffiliateButton
                productSlug={product.slug}
                platform="tiktok"
                sourcePage="pdp"
                label="Beli di TikTok Shop"
                size="lg"
                variant="tiktok"
                className="w-full py-3.5 text-sm sm:text-base justify-center shadow-sm"
              />
            </div>

            {/* Voucher & Promo Callout Banner */}
            <VoucherCalloutBadge />

            <div className="pt-1">
              <WishlistButton
                product={{ id: product.id, name: product.name }}
                variant="button"
                className="w-full py-3"
              />
            </div>
            <p className="text-[11px] text-center text-coolgray">
              Tautan aman terverifikasi menuju toko resmi di Shopee & TikTok Shop.
            </p>

            {/* Quick Share to WhatsApp & Instagram Stories */}
            <div className="pt-2">
              <ShareButtons
                title={product.name}
                productCode={product.product_code}
                priceFormatted={formatIDR(product.price)}
              />
            </div>
          </div>

          {/* Product Attributes (Sizes, Colors, Materials) */}
          <div className="p-5 rounded-2xl bg-white border border-bordergray space-y-4">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-coolgray block mb-1.5">
                  Pilihan Ukuran
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-ivory text-ink border border-bordergray"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-coolgray block mb-1.5">
                  Varian Warna
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-ivory text-ink border border-bordergray"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.materials && product.materials.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-coolgray block mb-1">
                  Bahan & Material
                </span>
                <p className="text-xs font-medium text-ink">
                  {product.materials.join(" • ")}
                </p>
              </div>
            )}
          </div>

          {/* Style & Occasion Tags */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-coolgray block">
              Style & Occasion
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.style_tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/shop?style=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-lavender/40 text-ink hover:bg-lavender transition-colors"
                >
                  #{tag}
                </Link>
              ))}
              {product.occasion_tags.map((occ) => (
                <span
                  key={occ}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-ivory border border-bordergray text-coolgray"
                >
                  {occ}
                </span>
              ))}
            </div>
          </div>

          {/* Editorial Description */}
          <div className="pt-4 border-t border-bordergray space-y-2">
            <h3 className="font-extrabold text-sm text-ink">
              Catatan Styling dari Anya
            </h3>
            <p className="text-xs sm:text-sm text-coolgray leading-relaxed">
              {product.full_description || product.short_description}
            </p>
          </div>

          {/* Affiliate Disclosure Box */}
          <div className="p-4 rounded-xl bg-ivory border border-bordergray flex items-start gap-3 text-xs text-coolgray">
            <Info className="w-4 h-4 text-ink shrink-0 mt-0.5" />
            <p>
              Kami mengurasi outfit ini secara independen. Jika kamu membeli lewat tautan di atas,
              kami dapat menerima komisi affiliate Shopee tanpa ada biaya tambahan buat kamu.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products: Mix & Match */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-bordergray space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-coolgray block mb-1">
                Cocok Dipadukan
              </span>
              <h2 className="text-2xl font-extrabold text-ink tracking-tight">
                Complete Your Look
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-ink hover:underline"
            >
              Lihat Koleksi Lainnya &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                sourcePage="product_detail_related"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
