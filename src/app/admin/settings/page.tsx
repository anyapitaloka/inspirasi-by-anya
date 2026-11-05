"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, ShieldCheck, Sliders, Globe } from "lucide-react";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [domainsText, setDomainsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          const s = data.settings;
          setSettings(s);
          if (s?.approved_affiliate_domains) {
            setDomainsText(s.approved_affiliate_domains.join(", "));
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccessMsg("");

    const parsedDomains = domainsText
      .split(",")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      ...settings,
      approved_affiliate_domains: parsedDomains,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Pengaturan situs berhasil diperbarui!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert("Gagal memperbarui pengaturan situs.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-coolgray text-xs">Memuat pengaturan situs...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">
            Site Settings & Security Allowlist
          </h1>
          <p className="text-xs text-coolgray mt-0.5">
            Konfigurasi identitas brand, teks keterbukaan affiliate, dan domain redirect yang diizinkan.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-ink text-white text-xs font-bold rounded-xl hover:bg-ink-light transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-lime" />
          <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Identity */}
        <div className="bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-ink flex items-center gap-2">
            <Globe className="w-4 h-4 text-ink" />
            Identitas Brand & SEO
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Nama Brand
              </label>
              <input
                type="text"
                value={settings.brand_name}
                onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
              />
            </div>

            <div className="space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Tagline Brand
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Deskripsi Meta Website
              </label>
              <textarea
                rows={2}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
              />
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure Text */}
        <div className="bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-ink flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-mint-dark" />
            Teks Keterbukaan Affiliate (Affiliate Disclosure)
          </h2>
          <p className="text-xs text-coolgray">
            Teks ini muncul di footer dan halaman produk untuk kepatuhan transparansi konsumen.
          </p>

          <div className="space-y-1 text-xs font-semibold">
            <textarea
              rows={3}
              value={settings.affiliate_disclosure_text}
              onChange={(e) =>
                setSettings({ ...settings, affiliate_disclosure_text: e.target.value })
              }
              className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
            />
          </div>
        </div>

        {/* Security Allowlist */}
        <div className="bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-ink flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lime-dark" />
            Shopee Affiliate Domain Allowlist (Anti-Open Redirect)
          </h2>
          <p className="text-xs text-coolgray">
            Hanya domain yang terdaftar di bawah ini yang diizinkan sebagai tujuan redirect `/go/[slug]`. 
            Pisahkan dengan koma.
          </p>

          <div className="space-y-1 text-xs font-semibold">
            <input
              type="text"
              value={domainsText}
              onChange={(e) => setDomainsText(e.target.value)}
              placeholder="shopee.co.id, s.shopee.co.id, shope.ee"
              className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-mono text-[11px]"
            />
            <span className="text-[10px] text-coolgray block">
              Default aman: shopee.co.id, s.shopee.co.id, shope.ee
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
