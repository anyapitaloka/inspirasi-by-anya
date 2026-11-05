import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getLookbooks } from "@/lib/db";
import { LookbookCard } from "@/components/lookbook/LookbookCard";

export const metadata = {
  title: "Outfit Inspiration & Lookbook",
  description: "Kurasi OOTD lengkap harian, kampus, date night, dan streetwear pilihan Anya.",
};

export default async function LookbookPage() {
  const lookbooks = await getLookbooks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/50 border border-mint text-xs font-bold text-ink">
          <Sparkles className="w-3.5 h-3.5 fill-ink" />
          <span>Complete Outfit Inspiration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          The Lookbook & Fit Checks
        </h1>
        <p className="text-xs sm:text-sm text-coolgray max-w-xl">
          Inspirasi padu padan busana lengkap dari ujung kepala sampai kaki.
          Klik salah satu lookbook untuk melihat seluruh produk Shopee yang dipakai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {lookbooks.map((lookbook) => (
          <LookbookCard key={lookbook.id} lookbook={lookbook} />
        ))}
      </div>
    </div>
  );
}
