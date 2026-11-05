import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Lookbook } from "@/lib/types";

export function LookbookCard({ lookbook }: { lookbook: Lookbook }) {
  return (
    <article
      aria-label={lookbook.title}
      className="group relative bg-white rounded-2xl border border-bordergray overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-hover hover:border-coolgray/30"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory">
        <Image
          src={lookbook.cover_image}
          alt={lookbook.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        
        {/* Badges on top */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-ink backdrop-blur-sm">
            {lookbook.occasion}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-mint text-ink">
            {lookbook.audience}
          </span>
        </div>

        {/* Text inside overlay bottom */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-1.5 text-lime text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lookbook.style_tags.join(" • ")}</span>
          </div>
          <h3 className="font-extrabold text-lg leading-snug line-clamp-2">
            {lookbook.title}
          </h3>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between bg-white border-t border-bordergray">
        <span className="text-xs text-coolgray font-medium">
          {lookbook.product_ids.length} pieces curated
        </span>
        <Link
          href={`/lookbook/${lookbook.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-ink hover:text-ink-light transition-colors"
        >
          <span>Shop The Fit</span>
          <ArrowUpRight className="w-4 h-4 text-lime-dark" />
        </Link>
      </div>
    </article>
  );
}
