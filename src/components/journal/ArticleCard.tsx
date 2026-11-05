import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import { Article } from "@/lib/types";
import { formatDateIndo } from "@/lib/utils/formatters";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article
      aria-label={article.title}
      className="group bg-white rounded-2xl border border-bordergray overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-hover hover:border-coolgray/30"
    >
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ivory">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lavender text-ink shadow-sm">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-coolgray font-medium">
            <span>{formatDateIndo(article.published_at)}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.read_time_minutes} min read
            </span>
          </div>

          <Link href={`/journal/${article.slug}`}>
            <h3 className="font-bold text-base text-ink leading-snug group-hover:text-ink-light transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-coolgray leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          href={`/journal/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:underline"
        >
          <span>Baca Selengkapnya</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-lime-dark" />
        </Link>
      </div>
    </article>
  );
}
