import React from "react";

export const metadata = {
  title: "Syarat & Ketentuan Penggunaan",
  description: "Syarat dan ketentuan penggunaan platform INSPIRASI BY ANYA.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          Syarat & Ketentuan
        </h1>
        <p className="text-xs sm:text-sm text-coolgray">
          Pembaruan Terakhir: 23 Oktober 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-bordergray shadow-sm space-y-6 text-sm text-ink-subtle leading-relaxed">
        <h3 className="font-extrabold text-base text-ink">1. Penerimaan Ketentuan</h3>
        <p>
          Dengan mengakses atau menggunakan platform INSPIRASI BY ANYA, kamu setuju untuk terikat oleh syarat dan ketentuan penggunaan ini. Jika kamu tidak menyetujui ketentuan ini, kamu dipersilakan untuk tidak menggunakan platform ini.
        </p>

        <h3 className="font-extrabold text-base text-ink">2. Sifat Layanan Kurasi</h3>
        <p>
          INSPIRASI BY ANYA adalah portal kurasi dan inspirasi gaya. Kami tidak memiliki toko ritel, tidak mengelola stok pakaian, dan tidak menjadi pihak dalam kontrak jual beli antara kamu dan penjual di Shopee.
        </p>

        <h3 className="font-extrabold text-base text-ink">3. Hak Kekayaan Intelektual</h3>
        <p>
          Seluruh nama brand, desain logo, artikel gaya, kurasi lookbook, dan layout tampilan INSPIRASI BY ANYA merupakan milik pengelola website dan dilindungi undang-undang hak cipta.
        </p>
      </div>
    </div>
  );
}
