import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { getSiteSettings } from "@/lib/db";

export const metadata = {
  title: "Affiliate Disclosure & Transparansi Kemitraan",
  description: "Penjelasan keterbukaan program affiliate Shopee resmi pada INSPIRASI BY ANYA.",
};

export default async function DisclosurePage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-ink text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-ink" />
          <span>Keterbukaan Informasi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          Affiliate Disclosure
        </h1>
        <p className="text-xs sm:text-sm text-coolgray">
          Pembaruan Terakhir: 23 Oktober 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-bordergray shadow-sm space-y-6 text-sm text-ink-subtle leading-relaxed">
        <div className="p-4 rounded-xl bg-ivory border border-bordergray text-xs text-ink">
          <strong>Pernyataan Utama:</strong> {settings.affiliate_disclosure_text}
        </div>

        <h3 className="font-extrabold text-base text-ink">
          1. Bagaimana Model Bisnis Website Ini Bekerja?
        </h3>
        <p>
          INSPIRASI BY ANYA adalah platform kurasi dan penemuan fashion independen. 
          Website ini <strong>tidak menjual pakaian secara langsung</strong>, tidak mengoperasikan keranjang belanja internal, 
          dan tidak memproses transaksi pembayaran maupun pengiriman barang.
        </p>
        <p>
          Ketika kamu mengklik tombol seperti <em>"Cek Produk di Shopee"</em> atau <em>"Cek di Shopee"</em>, 
          kamu akan diarahkan menuju halaman penjual resmi di platform Shopee melalui tautan affiliate resmi.
        </p>

        <h3 className="font-extrabold text-base text-ink">
          2. Apakah Kamu Dikenakan Biaya Tambahan?
        </h3>
        <p>
          <strong>Sama sekali tidak.</strong> Harga produk yang kamu bayar di Shopee persis sama dengan harga yang berlaku di toko penjual yang bersangkutan. 
          Komisi affiliate yang kami terima dibayarkan langsung oleh penyedia program affiliate Shopee sebagai bentuk apresiasi atas rekomendasi konten, tanpa memotong atau menaikkan harga belanja kamu.
        </p>

        <h3 className="font-extrabold text-base text-ink">
          3. Independensi Kurasi
        </h3>
        <p>
          Semua produk yang kami tampilkan dipilih berdasarkan standar selera, estetika gaya, dan penilaian kualitas bahan tim editorial. 
          Kami tidak menerima pembayaran tersembunyi untuk merekomendasikan produk berkualitas buruk.
        </p>

        <h3 className="font-extrabold text-base text-ink">
          4. Perubahan Harga dan Ketersediaan Stok
        </h3>
        <p>
          Harga dan ketersediaan stok produk ditentukan sepenuhnya oleh masing-masing penjual di Shopee. 
          Meskipun tim kami secara rutin memperbarui katalog, harga aktual saat kamu bertransaksi adalah harga yang tertera pada aplikasi atau situs resmi Shopee.
        </p>
      </div>
    </div>
  );
}
