"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, AlertCircle, CheckCircle } from "lucide-react";
import { Category, Audience } from "@/lib/types";
import { slugify } from "@/lib/utils/formatters";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"general" | "style" | "budget">("general");
  const [audience, setAudience] = useState<Audience | "all">("all");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setType("general");
    setAudience("all");
    setDescription("");
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setFormError("");
    setFormSuccess("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setType(c.type);
    setAudience(c.audience || "all");
    setDescription(c.description || "");
    setDisplayOrder(c.display_order);
    setIsActive(c.is_active);
    setFormError("");
    setFormSuccess("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const payload = {
      name,
      slug: slug || slugify(name),
      type,
      audience,
      description,
      display_order: Number(displayOrder),
      is_active: isActive,
    };

    try {
      const endpoint = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Gagal menyimpan kategori.");
        return;
      }

      setModalOpen(false);
      resetForm();
      loadCategories();
    } catch {
      setFormError("Terjadi kesalahan jaringan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah kamu yakin ingin menghapus kategori ini?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Gagal menghapus kategori.");
        return;
      }

      loadCategories();
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus kategori.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">
            Manajemen Kategori
          </h1>
          <p className="text-xs text-coolgray mt-0.5">
            Atur struktur kategori Women, Men, Unisex, Style vibe, dan Budget filter.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-xs font-bold rounded-xl hover:bg-ink-light transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-lime" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-bordergray shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs font-medium">
          <thead className="bg-ivory border-b border-bordergray text-[10px] uppercase font-bold text-coolgray">
            <tr>
              <th className="py-3 px-4">Nama & Slug</th>
              <th className="py-3 px-4">Tipe</th>
              <th className="py-3 px-4">Audience</th>
              <th className="py-3 px-4">Urutan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bordergray font-medium">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-coolgray">
                  Memuat data kategori...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-coolgray">
                  Belum ada kategori.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-ivory/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-ink block">{c.name}</span>
                    <span className="text-[10px] text-coolgray font-mono">
                      /{c.slug}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-ivory text-ink border border-bordergray capitalize">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] font-bold text-coolgray">
                      {c.audience || "all"}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{c.display_order}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {c.is_active ? "Aktif" : "Non-aktif"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-ink hover:text-ink-light"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CATEGORY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-bordergray space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-bordergray">
              <h3 className="font-black text-lg text-ink">
                {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-coolgray hover:text-ink" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-coolgray uppercase font-bold text-[10px]">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(slugify(e.target.value));
                  }}
                  placeholder="Contoh: Women's Tops & Blouses"
                  className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Tipe Kategori
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
                  >
                    <option value="general">General (Jenis Pakaian)</option>
                    <option value="style">Style / Vibe</option>
                    <option value="budget">Budget Category</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
                  >
                    <option value="all">Semua (All)</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-coolgray uppercase font-bold text-[10px]">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi untuk banner dan SEO..."
                  className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-medium"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-ink"
                />
                <span>Kategori Aktif & Ditampilkan</span>
              </label>

              <div className="pt-4 border-t border-bordergray flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-bordergray text-coolgray"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-ink text-white font-bold rounded-xl"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
