"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Save, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";
import { HomepageSection, Banner, SiteSettings } from "@/lib/types";

export default function AdminHomepageCMSPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadCMS() {
      try {
        setLoading(true);
        const [cmsRes, settingsRes] = await Promise.all([
          fetch("/api/admin/homepage-cms"),
          fetch("/api/admin/settings"),
        ]);
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          setSections(cmsData.sections || []);
          setBanner(cmsData.banners?.[0] || null);
        }
        if (settingsRes.ok) {
          const setttingsData = await settingsRes.json();
          setSettings(setttingsData.settings || null);
        }
      } finally {
        setLoading(false);
      }
    }
    loadCMS();
  }, []);

  const handleToggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_enabled: !s.is_enabled } : s))
    );
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(nextIndex, 0, moved);
    setSections(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMsg("");

    try {
      // Save sections & banner
      await fetch("/api/admin/homepage-cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: sections.map((s, idx) => ({ ...s, display_order: idx + 1 })),
          banners: banner ? [banner] : [],
        }),
      });

      // Save announcement bar in site settings
      if (settings) {
        await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
      }

      setSuccessMsg("Perubahan Homepage CMS berhasil disimpan!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      alert("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">
            Homepage CMS & Content Orchestrator
          </h1>
          <p className="text-xs text-coolgray mt-0.5">
            Susun dan aktifkan section homepage, hero editorial, dan announcement bar tanpa koding.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-ink text-white text-xs font-bold rounded-xl hover:bg-ink-light transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-lime" />
          <span>{saving ? "Menyimpan..." : "Simpan Perubahan CMS"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Announcement Bar Settings */}
      {settings && (
        <div className="bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-dark" />
            Announcement Bar (Header Paling Atas)
          </h2>

          <div className="space-y-3 text-xs font-semibold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcement_bar_enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement_bar_enabled: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-ink"
              />
              <span>Tampilkan Announcement Bar</span>
            </label>

            <div className="space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Teks Pengumuman
              </label>
              <input
                type="text"
                value={settings.announcement_bar_text}
                onChange={(e) =>
                  setSettings({ ...settings, announcement_bar_text: e.target.value })
                }
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Tautan Tujuan (Link CTA)
              </label>
              <input
                type="text"
                value={settings.announcement_bar_link}
                onChange={(e) =>
                  setSettings({ ...settings, announcement_bar_link: e.target.value })
                }
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner CMS */}
      {banner && (
        <div className="bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-ink">
            Hero Editorial Banner
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Headline
              </label>
              <input
                type="text"
                value={banner.title}
                onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
              />
            </div>

            <div className="space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Subheadline
              </label>
              <input
                type="text"
                value={banner.subtitle}
                onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
              />
            </div>

            <div className="space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Label Tombol CTA
              </label>
              <input
                type="text"
                value={banner.cta_label}
                onChange={(e) => setBanner({ ...banner, cta_label: e.target.value })}
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
              />
            </div>

            <div className="space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Link Tujuan CTA
              </label>
              <input
                type="text"
                value={banner.cta_url}
                onChange={(e) => setBanner({ ...banner, cta_url: e.target.value })}
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-coolgray text-[10px] uppercase font-bold">
                Gambar Hero (URL)
              </label>
              <input
                type="url"
                value={banner.desktop_image}
                onChange={(e) => setBanner({ ...banner, desktop_image: e.target.value })}
                className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sections Reordering & Toggle List */}
      <div className="bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-ink">
          Urutan & Aktivasi Section Homepage
        </h2>
        <p className="text-xs text-coolgray">
          Gunakan tombol panah untuk memindahkan urutan section, atau hilangkan centang untuk menyembunyikan section.
        </p>

        <div className="space-y-2 pt-2">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-ivory border border-bordergray text-xs"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={sec.is_enabled}
                  onChange={() => handleToggleSection(sec.id)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
                <div>
                  <span className="font-bold text-ink block">{sec.title}</span>
                  <span className="text-[10px] text-coolgray font-mono">
                    type: {sec.section_type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, "up")}
                  className="p-1 rounded text-coolgray hover:text-ink disabled:opacity-30"
                  title="Pindah ke atas"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === sections.length - 1}
                  onClick={() => moveSection(idx, "down")}
                  className="p-1 rounded text-coolgray hover:text-ink disabled:opacity-30"
                  title="Pindah ke bawah"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
