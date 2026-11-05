"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="p-4 rounded-full bg-lime text-ink font-bold text-xs inline-flex items-center gap-2 max-w-md mx-auto">
        <Check className="w-4 h-4 stroke-[3]" />
        <span>Terima kasih! Kamu sudah terdaftar di Style Drop Anya.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Masukkan email kamu..."
        className="w-full px-5 py-3 rounded-full bg-ink-light text-white placeholder-coolgray border border-white/20 focus:outline-none focus:border-lime text-sm"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 rounded-full bg-lime text-ink font-bold text-sm hover:bg-lime-dark transition-colors shrink-0 shadow-sm cursor-pointer"
      >
        Subscribe
      </button>
    </form>
  );
}
