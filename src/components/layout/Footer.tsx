import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Logo } from "../brand/Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-white pt-16 pb-12 border-t border-ink-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Logo variant="compact" linkToHome={false} />
              <span className="font-extrabold text-xl tracking-wider text-white">
                INSPIRASI <span className="text-lime font-bold">BY ANYA</span>
              </span>
            </div>
            <p className="text-coolgray text-sm leading-relaxed max-w-sm">
              Platform kurasi outfit dan fashion discovery untuk Gen Z Indonesia. 
              Membantumu menemukan gaya terbaik, estetik, dan ramah kantong di Shopee 
              tanpa pusing browsing berjam-jam.
            </p>
            <div className="flex items-center gap-2 text-xs text-lime font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>No gatekeeping. Pure curated fits.</span>
            </div>
          </div>

          {/* Col 3: Shop Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Koleksi & Kategori
            </h4>
            <ul className="space-y-2.5 text-sm text-coolgray">
              <li>
                <Link href="/shop?audience=women" className="hover:text-white transition-colors">
                  Women's Edit
                </Link>
              </li>
              <li>
                <Link href="/shop?audience=men" className="hover:text-white transition-colors">
                  Men's Edit
                </Link>
              </li>
              <li>
                <Link href="/shop?audience=unisex" className="hover:text-white transition-colors">
                  Unisex Essentials
                </Link>
              </li>
              <li>
                <Link href="/shop?category=under-100k" className="hover:text-lime transition-colors">
                  Under 100K Finds ✨
                </Link>
              </li>
              <li>
                <Link href="/shop?category=under-250k" className="hover:text-white transition-colors">
                  Under 250K
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-white transition-colors">
                  Lookbook OOTD
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Style Vibe */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Shop by Style
            </h4>
            <ul className="space-y-2.5 text-sm text-coolgray">
              <li>
                <Link href="/shop?style=Clean+Fit" className="hover:text-white transition-colors">
                  Clean Fit
                </Link>
              </li>
              <li>
                <Link href="/shop?style=Korean-Inspired" className="hover:text-white transition-colors">
                  Korean Look
                </Link>
              </li>
              <li>
                <Link href="/shop?style=Streetwear" className="hover:text-white transition-colors">
                  Streetwear
                </Link>
              </li>
              <li>
                <Link href="/shop?style=Old+Money" className="hover:text-white transition-colors">
                  Old Money / Smart Casual
                </Link>
              </li>
              <li>
                <Link href="/shop?style=Campus+Outfit" className="hover:text-white transition-colors">
                  Campus Core
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white transition-colors">
                  The Style Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Informasi & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-coolgray">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Tentang Anya
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Kontak & Kolaborasi
                </Link>
              </li>
              <li>
                <Link href="/disclosure" className="hover:text-white transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-xs text-white/40 hover:text-white transition-colors">
                  Admin Portal 🔐
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Box */}
        <div className="my-8 p-4 rounded-xl bg-ink-light border border-white/5 flex items-start gap-3 text-xs text-coolgray leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-mint shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-semibold block mb-0.5">
              Transparansi Affiliate Shopee
            </span>
            Sebagian tautan pada website ini merupakan tautan affiliate Shopee resmi. 
            Jika kamu melakukan pembelian melalui tautan tersebut, kami dapat menerima 
            komisi kecil tanpa biaya tambahan apa pun yang dibebankan kepada kamu. 
            Seluruh transaksi, pembayaran, dan pengiriman barang diproses langsung oleh platform Shopee.
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coolgray pt-4">
          <p>© {new Date().getFullYear()} INSPIRASI BY ANYA. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Curated with <Heart className="w-3.5 h-3.5 text-lavender fill-lavender" /> for Indonesian Gen Z.
          </p>
        </div>
      </div>
    </footer>
  );
}
