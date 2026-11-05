"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-mint/50 border border-mint text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-ink mx-auto" />
        <h3 className="font-bold text-base text-ink">Pesan Terkirim!</h3>
        <p className="text-xs text-coolgray">
          Terima kasih telah menghubungi kami. Tim editorial Anya akan segera meninjau pesan kamu.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ink block">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            placeholder="Anya / Nama Brand"
            className="w-full px-4 py-3 rounded-xl bg-ivory border border-bordergray text-sm focus:outline-none focus:border-ink"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ink block">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="kamu@domain.com"
            className="w-full px-4 py-3 rounded-xl bg-ivory border border-bordergray text-sm focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink block">
          Subjek
        </label>
        <input
          type="text"
          required
          placeholder="Rekomendasi Produk / Kolaborasi Curation"
          className="w-full px-4 py-3 rounded-xl bg-ivory border border-bordergray text-sm focus:outline-none focus:border-ink"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink block">
          Pesan atau Tautan Shopee
        </label>
        <textarea
          rows={5}
          required
          placeholder="Ceritakan tentang koleksi pakaian atau brand kamu..."
          className="w-full px-4 py-3 rounded-xl bg-ivory border border-bordergray text-sm focus:outline-none focus:border-ink"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-ink text-white font-bold text-sm rounded-xl hover:bg-ink-light transition-colors flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4 text-lime" />
        <span>Kirim Pesan</span>
      </button>
    </form>
  );
}
