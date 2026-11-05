import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, CheckCircle2, Heart, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About INSPIRASI BY ANYA",
  description: "Cerita, visi, dan filosofi kurasi fashion Gen Z di balik INSPIRASI BY ANYA.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/50 border border-mint text-xs font-bold text-ink">
          <Sparkles className="w-3.5 h-3.5 fill-ink" />
          <span>Our Story & Vibe</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
          Kurasi Fashion Tanpa Bikin Pusing.
        </h1>
        <p className="text-coolgray text-base max-w-xl mx-auto">
          Menemukan outfit yang bagus, estetik, dan ramah kantong di Shopee seharusnya tidak memakan waktu berjam-jam.
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-ivory border border-bordergray shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80"
          alt="Fashion curation by Anya"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover object-center"
        />
      </div>

      <div className="prose prose-neutral max-w-none text-ink text-base sm:text-lg leading-relaxed space-y-6">
        <h2 className="text-2xl font-black text-ink">Siapa Kami?</h2>
        <p>
          <strong>INSPIRASI BY ANYA</strong> lahir dari keresahan nyata anak muda urban Indonesia: 
          kita ingin tampil percaya diri dengan gaya <em>clean fit</em>, <em>streetwear</em>, 
          atau <em>Korean casual</em>, tetapi sering kali kebingungan saat mencari barang di marketplace karena banjirnya jutaan pilihan produk tanpa filter selera yang jelas.
        </p>
        <p>
          Kami hadir bukan sebagai penjual baju, melainkan sebagai <strong>kurator dan teman styling kamu</strong>. 
          Setiap produk yang masuk ke dalam website ini sudah melewati proses kurasi manual oleh tim editorial: mulai dari kesesuaian potongan siluet, ulasan bahan, hingga rasio harga berbanding kualitas.
        </p>

        <h2 className="text-2xl font-black text-ink mt-8">3 Prinsip Kurasi Anya</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-5 rounded-2xl bg-white border border-bordergray space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-lime-dark block">
              01. EFFORTLESS
            </span>
            <h3 className="font-bold text-base text-ink">Mudah Dipadukan</h3>
            <p className="text-xs text-coolgray leading-relaxed">
              Kami memprioritaskan pakaian yang bisa kamu pakai berulang kali dengan berbagai kombinasi outfit lain di lemarimu.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-bordergray space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-lime-dark block">
              02. BUDGET SENSE
            </span>
            <h3 className="font-bold text-base text-ink">Harga Masuk Akal</h3>
            <p className="text-xs text-coolgray leading-relaxed">
              Gaya bagus tidak harus mahal. Banyak temuan terbaik kami berada di rentang harga di bawah Rp100.000 hingga Rp250.000.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-bordergray space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-lime-dark block">
              03. TRANSPARENCY
            </span>
            <h3 className="font-bold text-base text-ink">Jujur & Terverifikasi</h3>
            <p className="text-xs text-coolgray leading-relaxed">
              Tautan kami langsung terhubung secara resmi ke Shopee tanpa mark-up harga tersembunyi atau biaya tambahan.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-ink text-white text-center space-y-4 not-prose mt-12">
          <h2 className="text-2xl font-black">Siap Menemukan Outfit Barumu?</h2>
          <p className="text-xs sm:text-sm text-coolgray max-w-md mx-auto">
            Jelajahi ratusan kurasi outfit terbaru yang sudah siap kamu checkout di Shopee.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime text-ink font-bold text-xs hover:bg-lime-dark transition-colors"
          >
            <span>Explore The Edit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
