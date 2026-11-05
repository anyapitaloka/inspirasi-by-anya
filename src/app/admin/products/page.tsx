"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  Check,
  AlertCircle,
  X,
  ShieldCheck,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Product, Category, Audience } from "@/lib/types";
import { formatIDR, slugify } from "@/lib/utils/formatters";
import { validateAffiliateUrl } from "@/lib/affiliate/tracker";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortByFilter, setSortByFilter] = useState<"mixed" | "code_asc" | "newest" | "price_asc" | "price_desc" | "editors_pick">("mixed");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Product Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [audience, setAudience] = useState<Audience>("unisex");
  const [primaryCategoryId, setPrimaryCategoryId] = useState("");
  const [price, setPrice] = useState<number>(100000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [mainImage, setMainImage] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [tiktokAffiliateUrl, setTiktokAffiliateUrl] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [styleTags, setStyleTags] = useState("Clean Fit, Minimalist");
  const [occasionTags, setOccasionTags] = useState("Campus, Casual");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [isEditorsPick, setIsEditorsPick] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Delete confirm modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch products and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products?status=all"),
        fetch("/api/categories"),
      ]);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        const cats = catData.categories || [];
        setCategories(cats);
        if (cats.length > 0 && !primaryCategoryId) {
          setPrimaryCategoryId(cats[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setBrand("");
    setAudience("unisex");
    setPrimaryCategoryId(categories[0]?.id || "");
    setPrice(100000);
    setOriginalPrice(undefined);
    setMainImage("");
    setAffiliateUrl("");
    setTiktokAffiliateUrl("");
    setShortDesc("");
    setFullDesc("");
    setStyleTags("Clean Fit, Minimalist");
    setOccasionTags("Campus, Casual");
    setStatus("published");
    setIsEditorsPick(false);
    setIsFeatured(false);
    setIsNewArrival(true);
    setFormError("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setBrand(p.brand);
    setAudience(p.audience);
    setPrimaryCategoryId(p.primary_category_id);
    setPrice(p.price);
    setOriginalPrice(p.original_price);
    setMainImage(p.main_image);
    setAffiliateUrl(p.affiliate_url);
    setTiktokAffiliateUrl(p.tiktok_affiliate_url || "");
    setShortDesc(p.short_description);
    setFullDesc(p.full_description);
    setStyleTags(p.style_tags.join(", "));
    setOccasionTags(p.occasion_tags.join(", "));
    setStatus(p.status);
    setIsEditorsPick(p.is_editors_pick);
    setIsFeatured(p.is_featured);
    setIsNewArrival(p.is_new_arrival);
    setFormError("");
    setModalOpen(true);
  };

  const handleDuplicate = async (p: Product) => {
    try {
      const duplicated = {
        ...p,
        name: `${p.name} (Copy)`,
        slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
        status: "draft" as const,
      };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicated),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert("Gagal menduplikasi produk.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      }
    } catch {
      alert("Gagal menghapus produk.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate affiliate URL (Shopee)
    const urlCheck = validateAffiliateUrl(affiliateUrl);
    if (!urlCheck.isValid) {
      setFormError(urlCheck.error || "Tautan affiliate Shopee tidak valid.");
      return;
    }

    // Validate affiliate URL (TikTok Shop if provided)
    let tiktokSanitizedUrl: string | undefined = undefined;
    if (tiktokAffiliateUrl && tiktokAffiliateUrl.trim()) {
      const tiktokCheck = validateAffiliateUrl(tiktokAffiliateUrl.trim());
      if (!tiktokCheck.isValid) {
        setFormError(tiktokCheck.error || "Tautan affiliate TikTok Shop tidak valid.");
        return;
      }
      tiktokSanitizedUrl = tiktokCheck.sanitizedUrl;
    }

    setFormLoading(true);

    const payload = {
      name,
      slug: slug || slugify(name),
      brand,
      audience,
      primary_category_id: primaryCategoryId,
      price: Number(price),
      original_price: originalPrice ? Number(originalPrice) : undefined,
      main_image: mainImage,
      affiliate_url: urlCheck.sanitizedUrl,
      tiktok_affiliate_url: tiktokSanitizedUrl,
      short_description: shortDesc,
      full_description: fullDesc,
      style_tags: styleTags.split(",").map((s) => s.trim()).filter(Boolean),
      occasion_tags: occasionTags.split(",").map((s) => s.trim()).filter(Boolean),
      status,
      is_editors_pick: isEditorsPick,
      is_featured: isFeatured,
      is_new_arrival: isNewArrival,
    };

    try {
      const endpoint = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Gagal menyimpan produk.");
        return;
      }

      setModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      setFormError("Terjadi kesalahan jaringan.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    setProducts(shuffled);
    setSortByFilter("mixed");
    setCurrentPage(1);
  };

  const sortedProducts = [...products];
  if (sortByFilter === "code_asc") {
    sortedProducts.sort((a, b) => a.product_code - b.product_code);
  } else if (sortByFilter === "price_asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortByFilter === "price_desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortByFilter === "editors_pick") {
    sortedProducts.sort((a, b) => (b.is_editors_pick ? 1 : 0) - (a.is_editors_pick ? 1 : 0));
  } else if (sortByFilter === "newest") {
    sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const filteredProducts = sortedProducts.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.primary_category_id !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase().replace("#", "").trim();
      const codeMatch = String(p.product_code) === q;
      return (
        codeMatch ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">
            Manajemen Produk Outfit
          </h1>
          <p className="text-xs text-coolgray mt-0.5">
            Kelola katalog pakaian, harga IDR, affiliate link Shopee, dan kurasi editor.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-xs font-bold rounded-xl hover:bg-ink-light transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-lime" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-bordergray shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, brand, slug..."
            className="w-full pl-9 pr-4 py-2 bg-ivory rounded-xl border border-bordergray text-xs focus:outline-none focus:border-ink"
          />
          <Search className="w-3.5 h-3.5 text-coolgray absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-ivory rounded-xl border border-bordergray text-xs font-bold text-ink"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-ivory rounded-xl border border-bordergray text-xs font-bold text-ink"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sortByFilter}
            onChange={(e) => {
              setSortByFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-ivory rounded-xl border border-bordergray text-xs font-bold text-ink"
          >
            <option value="mixed">🎲 Urutan Acak (Mixed)</option>
            <option value="code_asc">Nomor Tag (#1 - #899)</option>
            <option value="newest">Terbaru Ditambahkan</option>
            <option value="price_asc">Harga Termurah</option>
            <option value="price_desc">Harga Termahal</option>
            <option value="editors_pick">Anya's Pick</option>
          </select>

          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-lime text-ink rounded-xl text-xs font-black hover:bg-lime/80 transition-all active:scale-95 shadow-xs"
            title="Acak Ulang Urutan Produk di Dashboard"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Urutan</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-bordergray shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-bordergray text-[10px] uppercase font-bold text-coolgray">
              <tr>
                <th className="py-3 px-4">Item & Info</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4">Harga (IDR)</th>
                <th className="py-3 px-4">Affiliate Links</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordergray font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-coolgray">
                    Memuat data produk...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-coolgray">
                    Tidak ada produk yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-ivory/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-ivory shrink-0 border border-bordergray">
                          <Image
                            src={p.main_image}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-coolgray block">
                            {p.brand}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-ink text-lime shrink-0">
                              #{p.product_code}
                            </span>
                            <span className="font-bold text-ink block truncate max-w-[200px]">
                              {p.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {p.is_editors_pick && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-lime text-ink">
                                Anya's Pick
                              </span>
                            )}
                            <span className="text-[10px] text-coolgray font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-ivory text-ink border border-bordergray uppercase">
                        {p.audience}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-extrabold text-ink">
                        {formatIDR(p.price)}
                      </span>
                      {p.original_price && (
                        <span className="text-[10px] text-coolgray line-through block">
                          {formatIDR(p.original_price)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`/go/${p.slug}?platform=shopee`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EE4D2D] hover:underline"
                          title={`Shopee: ${p.affiliate_url}`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Shopee</span>
                          <ExternalLink className="w-3 h-3 text-coolgray" />
                        </a>
                        {p.tiktok_affiliate_url && (
                          <a
                            href={`/go/${p.slug}?platform=tiktok`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-ink hover:underline"
                            title={`TikTok Shop: ${p.tiktok_affiliate_url}`}
                          >
                            <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"></span>
                            <span>TikTok Shop</span>
                            <ExternalLink className="w-3 h-3 text-coolgray" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-coolgray hover:text-ink rounded-lg hover:bg-ivory"
                          title="Lihat di Web Publik"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-coolgray hover:text-ink rounded-lg hover:bg-ivory"
                          title="Duplikat Produk"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-ink hover:text-ink-light rounded-lg hover:bg-ivory"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                          title="Hapus Produk"
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

        {/* Pagination Bar */}
        {filteredProducts.length > pageSize && (
          <div className="p-4 bg-ivory/50 border-t border-bordergray flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-coolgray font-medium">
              Menampilkan{" "}
              <span className="font-bold text-ink">
                {(currentPage - 1) * pageSize + 1} -{" "}
                {Math.min(currentPage * pageSize, filteredProducts.length)}
              </span>{" "}
              dari <span className="font-bold text-ink">{filteredProducts.length}</span> produk
              {sortByFilter === "mixed" && " (Urutan Acak)"}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-bordergray bg-white text-ink hover:bg-ivory disabled:opacity-30 disabled:pointer-events-none"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 font-bold text-xs">
                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pageNum = idx + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + idx;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
                  }
                  if (pageNum < 1) pageNum = 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === pageNum
                          ? "bg-ink text-lime"
                          : "bg-white border border-bordergray text-coolgray hover:text-ink hover:bg-ivory"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-bordergray bg-white text-ink hover:bg-ivory disabled:opacity-30 disabled:pointer-events-none"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-bordergray fade-in space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-bordergray">
              <h2 className="text-xl font-black text-ink">
                {editingId ? "Edit Produk Outfit" : "Tambah Produk Outfit Baru"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-coolgray hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingId) setSlug(slugify(e.target.value));
                    }}
                    placeholder="Heavyweight Boxy Tee..."
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="STUDIO DRAPE / RAW BASIC LAB..."
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Slug URL
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
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Kategori Utama
                  </label>
                  <select
                    value={primaryCategoryId}
                    onChange={(e) => setPrimaryCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Harga (IDR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Harga Coret (Opsional)
                  </label>
                  <input
                    type="number"
                    value={originalPrice || ""}
                    onChange={(e) =>
                      setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Contoh: 150000"
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-coolgray uppercase font-bold text-[10px]">
                  URL Affiliate Shopee Resmi *
                </label>
                <input
                  type="url"
                  required
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="https://s.shopee.co.id/... atau https://shopee.co.id/..."
                  className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-mono text-[11px]"
                />
                <span className="text-[10px] text-coolgray block">
                  Harus domain resmi Shopee (shopee.co.id, s.shopee.co.id, shope.ee) dengan HTTPS.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-coolgray uppercase font-bold text-[10px]">
                  URL Affiliate TikTok Shop (Opsional)
                </label>
                <input
                  type="url"
                  value={tiktokAffiliateUrl}
                  onChange={(e) => setTiktokAffiliateUrl(e.target.value)}
                  placeholder="https://vt.tiktok.com/... atau https://shop.tiktok.com/..."
                  className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-mono text-[11px]"
                />
                <span className="text-[10px] text-coolgray block">
                  Domain resmi TikTok Shop / Tokopedia (vt.tiktok.com, shop.tiktok.com, shop-id.tokopedia.com, tokopedia.link).
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-coolgray uppercase font-bold text-[10px]">
                  Gambar Utama (URL Gambar) *
                </label>
                <input
                  type="url"
                  required
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-coolgray uppercase font-bold text-[10px]">
                  Deskripsi Singkat (Ringkasan Siluet & Bahan)
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Kaos siluet boxy bahan katun combed 24s premium..."
                  className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Style Tags (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={styleTags}
                    onChange={(e) => setStyleTags(e.target.value)}
                    placeholder="Clean Fit, Streetwear, Minimalist"
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-coolgray uppercase font-bold text-[10px]">
                    Occasion Tags
                  </label>
                  <input
                    type="text"
                    value={occasionTags}
                    onChange={(e) => setOccasionTags(e.target.value)}
                    placeholder="Campus, Casual Hangout, Date Night"
                    className="w-full p-2.5 bg-ivory rounded-xl border border-bordergray text-ink"
                  />
                </div>
              </div>

              {/* Status & Badges Toggles */}
              <div className="p-4 rounded-xl bg-ivory border border-bordergray flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status === "published"}
                    onChange={(e) => setStatus(e.target.checked ? "published" : "draft")}
                    className="w-4 h-4 accent-ink"
                  />
                  <span>Publish ke Website Publik</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditorsPick}
                    onChange={(e) => setIsEditorsPick(e.target.checked)}
                    className="w-4 h-4 accent-lime"
                  />
                  <span>Anya's Pick (Editor's Pick)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4 h-4 accent-lavender"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-bordergray flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-bordergray text-coolgray hover:text-ink font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-ink text-white font-bold rounded-xl hover:bg-ink-light transition-colors"
                >
                  {formLoading ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-bordergray text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-ink">Hapus Produk Ini?</h3>
            <p className="text-xs text-coolgray">
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus dari katalog publik dan database.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-bordergray text-xs font-bold text-coolgray hover:text-ink"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
