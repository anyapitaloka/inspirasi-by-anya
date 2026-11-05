import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { getArticles } from "@/lib/db";
import { ArticleCard } from "@/components/journal/ArticleCard";

export const metadata = {
  title: "The Style Journal",
  description: "Artikel, tips mix and match outfit basic, capsule wardrobe, dan panduan belanja cerdas di Shopee.",
};

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender/50 border border-lavender text-xs font-bold text-ink">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Editorial Style Notes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          The Style Journal
        </h1>
        <p className="text-xs sm:text-sm text-coolgray max-w-xl">
          Panduan berpakaian, tips fashion mahasiswa, dan trik memadukan basic outfit
          agar terlihat aesthetic tanpa perlu boros.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
