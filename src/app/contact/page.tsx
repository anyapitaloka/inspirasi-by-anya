import React from "react";
import { Mail, MessageSquare, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Kontak & Kolaborasi",
  description: "Hubungi tim editorial INSPIRASI BY ANYA untuk kurasi brand, masukan, atau kolaborasi.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-coolgray block">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          Kontak & Kolaborasi Brand
        </h1>
        <p className="text-xs sm:text-sm text-coolgray max-w-md mx-auto">
          Punya brand lokal berkualitas di Shopee atau ingin memberikan rekomendasi outfit?
          Kirimkan pesan ke tim Anya.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-bordergray shadow-card space-y-6">
        <ContactForm />
      </div>

      <div className="text-center text-xs text-coolgray">
        Email resmi: <a href="mailto:contact@inspirasibyanya.id" className="text-ink font-bold hover:underline">contact@inspirasibyanya.id</a>
      </div>
    </div>
  );
}
