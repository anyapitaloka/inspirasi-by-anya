import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles, ShoppingBag } from "lucide-react";
import { getLookbookBySlug, getProducts } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { InteractiveLookbookHotspots } from "@/components/lookbook/InteractiveLookbookHotspots";
import { ShareButtons } from "@/components/product/ShareButtons";

interface LookbookDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function LookbookDetailPage({ params }: LookbookDetailProps) {
  const { slug } = await params;
  const [lookbook, allProducts] = await Promise.all([
    getLookbookBySlug(slug),
    getProducts({ status: "published" }),
  ]);

  if (!lookbook) {
    notFound();
  }

  const linkedProducts = allProducts.filter((p) =>
    lookbook.product_ids.includes(p.id)
  );

  const jsonLdLookbook = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: lookbook.title,
    description: lookbook.summary,
    image: [lookbook.cover_image],
    publisher: {
      "@type": "Organization",
      name: "INSPIRASI BY ANYA",
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
        name: "Lookbook",
        item: "https://inspirasibyanya.id/lookbook",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: lookbook.title,
        item: `https://inspirasibyanya.id/lookbook/${lookbook.slug}`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLookbook) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-coolgray">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/lookbook" className="hover:text-ink">
          Lookbook
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-bold">{lookbook.title}</span>
      </nav>

      {/* Header Editorial Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-ink text-white p-8 sm:p-14 border border-bordergray shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-lime text-ink">
                {lookbook.occasion}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white">
                {lookbook.audience}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {lookbook.title}
            </h1>
            <p className="text-base text-gray-300 leading-relaxed max-w-xl">
              {lookbook.summary}
            </p>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-lime">
              <span className="font-bold text-white block mb-0.5">Vibe Notes:</span>
              {lookbook.vibe_description}
            </div>

            {/* Quick Share to WhatsApp & Instagram */}
            <div className="pt-2">
              <ShareButtons
                title={`Lookbook: ${lookbook.title}`}
                className="text-white"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <InteractiveLookbookHotspots
              coverImage={lookbook.cover_image}
              title={lookbook.title}
              hotspots={lookbook.hotspots}
              products={linkedProducts}
            />
          </div>
        </div>
      </div>

      {/* Linked Pieces Section */}
      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-bordergray pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coolgray block mb-1">
              Shop The Fit
            </span>
            <h2 className="text-2xl font-black text-ink tracking-tight">
              Semua Item dalam Look Ini ({linkedProducts.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {linkedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              sourcePage={`lookbook_${lookbook.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
