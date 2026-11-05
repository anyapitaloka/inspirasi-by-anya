import React from "react";

export const metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi dan perlindungan data pengunjung INSPIRASI BY ANYA.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          Kebijakan Privasi
        </h1>
        <p className="text-xs sm:text-sm text-coolgray">
          Pembaruan Terakhir: 23 Oktober 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-bordergray shadow-sm space-y-6 text-sm text-ink-subtle leading-relaxed">
        <p>
          Privasi kamu sangat penting bagi kami. Kebijakan ini menjelaskan bagaimana INSPIRASI BY ANYA mengelola data saat kamu mengunjungi website kami.
        </p>

        <h3 className="font-extrabold text-base text-ink">1. Data yang Kami Kumpulkan</h3>
        <p>
          Kami menganut prinsip minimalisasi data:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Data Wishlist:</strong> Disimpan hanya pada browser perangkat kamu (localStorage) dan tidak dikirimkan ke server kami.</li>
          <li><strong>Outbound Redirect Telemetry:</strong> Saat kamu mengklik tautan affiliate menuju Shopee, sistem kami mencatat data agregat anonim seperti produk yang diklik, waktu, jenis perangkat secara umum, dan halaman sumber untuk keperluan evaluasi tren outfit. Kami tidak merekam data identitas pribadi atau alamat IP lengkap.</li>
        </ul>

        <h3 className="font-extrabold text-base text-ink">2. Penggunaan Cookie</h3>
        <p>
          Website ini hanya menggunakan cookie teknis esensial (misalnya sesi autentikasi khusus admin) dan penyimpanan lokal (localStorage) untuk fitur wishlist pengguna. Kami tidak menjual data pengguna kepada pihak ketiga mana pun.
        </p>

        <h3 className="font-extrabold text-base text-ink">3. Tautan Pihak Ketiga (Shopee)</h3>
        <p>
          Ketika kamu diarahkan ke Shopee, aktivitas transaksi dan pengumpulan data kamu selanjutnya tunduk pada kebijakan privasi platform Shopee. Kami menyarankan kamu membaca kebijakan privasi Shopee sebelum melakukan transaksi.
        </p>
      </div>
    </div>
  );
}
