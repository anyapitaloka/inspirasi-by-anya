import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, User, ArrowLeft } from "lucide-react";
import { getArticleBySlug, getProducts } from "@/lib/db";
import { formatDateIndo } from "@/lib/utils/formatters";
import { ProductCard } from "@/components/product/ProductCard";
import { ShareButtons } from "@/components/product/ShareButtons";

interface ArticleDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailProps) {
  const { slug } = await params;
  const [article, allProducts] = await Promise.all([
    getArticleBySlug(slug),
    getProducts({ status: "published" }),
  ]);

  if (!article) {
    notFound();
  }

  const linkedProducts = allProducts.filter((p) =>
    article.related_product_ids?.includes(p.id)
  );

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.cover_image],
    datePublished: article.published_at,
    author: {
      "@type": "Person",
      name: article.author || "Anya Pitaloka",
    },
    publisher: {
      "@type": "Organization",
      name: "INSPIRASI BY ANYA",
      logo: {
        "@type": "ImageObject",
        url: "https://inspirasibyanya.id/logo.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://inspirasibyanya.id/journal/${article.slug}`,
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
        name: "Journal",
        item: "https://inspirasibyanya.id/journal",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://inspirasibyanya.id/journal/${article.slug}`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* Back & Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-coolgray">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/journal" className="hover:text-ink">
          Journal
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-bold truncate max-w-[200px]">
          {article.title}
        </span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-lavender text-ink text-xs font-bold uppercase tracking-wider">
          {article.category}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-coolgray pt-2 border-b border-bordergray pb-6">
          <div className="flex items-center gap-1.5 font-bold text-ink">
            <User className="w-4 h-4" />
            <span>{article.author}</span>
          </div>
          <span>•</span>
          <span>{formatDateIndo(article.published_at)}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.read_time_minutes} min read</span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-ivory border border-bordergray shadow-sm">
        <Image
          src={article.cover_image}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover object-center"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-neutral max-w-none text-ink text-base sm:text-lg leading-relaxed space-y-6">
        {article.body.split("\n\n").map((para, i) => {
          if (para.startsWith("# ")) {
            return (
              <h2 key={i} className="text-2xl font-black text-ink mt-8 mb-4">
                {para.replace("# ", "")}
              </h2>
            );
          }
          if (para.startsWith("## ")) {
            return (
              <h3 key={i} className="text-xl font-bold text-ink mt-6 mb-3">
                {para.replace("## ", "")}
              </h3>
            );
          }
          if (para.startsWith("### ")) {
            return (
              <h4 key={i} className="text-base font-bold text-ink mt-4 mb-2">
                {para.replace("### ", "")}
              </h4>
            );
          }
          return (
            <p key={i} className="text-ink-light">
              {para}
            </p>
          );
        })}
      </div>

      {/* Share Buttons for Article */}
      <div className="p-4 rounded-2xl bg-white border border-bordergray shadow-sm">
        <ShareButtons title={article.title} />
      </div>

      {/* Featured Pieces in this Article */}
      {linkedProducts.length > 0 && (
        <section className="pt-10 border-t border-bordergray space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coolgray block mb-1">
              Curated Finds Mentioned
            </span>
            <h3 className="text-xl font-extrabold text-ink">
              Rekomendasi Produk Shopee dalam Artikel Ini
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {linkedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                sourcePage={`article_${article.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
