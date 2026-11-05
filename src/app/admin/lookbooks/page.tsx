"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Check,
  AlertCircle,
  X,
  Upload,
  ImageIcon,
  MapPin,
  Tag,
  RefreshCw,
  Eye,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { Lookbook, LookbookHotspot, Product } from "@/lib/types";
import { formatIDR, slugify } from "@/lib/utils/formatters";

export default function AdminLookbooksPage() {
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Editor Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [occasion, setOccasion] = useState("Cafe & Coffee Date");
  const [audience, setAudience] = useState<"women" | "all">("women");
  const [styleTags, setStyleTags] = useState("Clean Fit, Korean-Inspired, Daily Wear");
  const [vibeDescription, setVibeDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [hotspots, setHotspots] = useState<LookbookHotspot[]>([]);

  // Image Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pin Placement State
  const [pendingPinCoord, setPendingPinCoord] = useState<{ x: number; y: number } | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [pinPickerOpen, setPinPickerOpen] = useState(false);

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch lookbooks and products
  const fetchData = async () => {
    try {
      setLoading(true);
      const [lookRes, prodRes] = await Promise.all([
        fetch("/api/admin/lookbooks"),
        fetch("/api/products?status=all"),
      ]);

      if (lookRes.ok) {
        const lookData = await lookRes.json();
        setLookbooks(lookData.lookbooks || []);
      }

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setAllProducts(prodData.products || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Photo Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress("Mengunggah foto OOTD...");
      setFormError("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah foto");
      }

      setCoverImage(data.url);
      setUploadProgress("Foto berhasil diunggah!");
      setTimeout(() => setUploadProgress(""), 3000);
    } catch (err: any) {
      setFormError(err.message || "Gagal mengunggah foto.");
    } finally {
      setUploading(false);
    }
  };

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setCoverImage("");
    setOccasion("Cafe & Coffee Date");
    setAudience("women");
    setStyleTags("Clean Fit, Korean-Inspired, Daily Wear");
    setVibeDescription("");
    setIsPublished(true);
    setHotspots([]);
    setPendingPinCoord(null);
    setFormError("");
    setFormSuccess("");
    setModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (look: Lookbook) => {
    setEditingId(look.id);
    setTitle(look.title);
    setSlug(look.slug);
    setSummary(look.summary);
    setCoverImage(look.cover_image);
    setOccasion(look.occasion || "Cafe & Coffee Date");
    setAudience((look.audience as any) || "women");
    setStyleTags(look.style_tags?.join(", ") || "Clean Fit");
    setVibeDescription(look.vibe_description || "");
    setIsPublished(look.is_published ?? true);
    setHotspots(look.hotspots || []);
    setPendingPinCoord(null);
    setFormError("");
    setFormSuccess("");
    setModalOpen(true);
  };

  // Title change with auto-slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  // Interactive Image Click to Add Pin
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setPendingPinCoord({ x, y });
    setProductSearch("");
    setPinPickerOpen(true);
  };

  // Assign product to pending pin
  const handleSelectProductForPin = (product: Product) => {
    if (!pendingPinCoord) return;

    // Check if product already pinned
    const existingIndex = hotspots.findIndex((h) => h.productId === product.id);
    const tagCode = product.product_code ? `#${product.product_code} ` : "";
    const shortName = product.name.slice(0, 24);
    const label = `${tagCode}${shortName}`;

    if (existingIndex >= 0) {
      // Update coordinate
      const updated = [...hotspots];
      updated[existingIndex] = {
        productId: product.id,
        x: pendingPinCoord.x,
        y: pendingPinCoord.y,
        label,
      };
      setHotspots(updated);
    } else {
      setHotspots([
        ...hotspots,
        {
          productId: product.id,
          x: pendingPinCoord.x,
          y: pendingPinCoord.y,
          label,
        },
      ]);
    }

    setPendingPinCoord(null);
    setPinPickerOpen(false);
  };

  // Remove a pin
  const handleRemovePin = (productId: string) => {
    setHotspots(hotspots.filter((h) => h.productId !== productId));
  };

  // Save Lookbook (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");

    if (!title.trim()) {
      setFormError("Judul Lookbook wajib diisi.");
      setFormLoading(false);
      return;
    }

    if (!coverImage.trim()) {
      setFormError("Foto Lookbook wajib diunggah atau diisi URL-nya.");
      setFormLoading(false);
      return;
    }

    const tagsArray = styleTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const productIds = Array.from(new Set(hotspots.map((h) => h.productId)));

    const payload = {
      title,
      slug: slug || slugify(title),
      summary: summary || title,
      cover_image: coverImage,
      audience,
      style_tags: tagsArray,
      occasion,
      vibe_description: vibeDescription || summary || title,
      product_ids: productIds,
      hotspots,
      is_published: isPublished,
    };

    try {
      const url = editingId
        ? `/api/admin/lookbooks/${editingId}`
        : "/api/admin/lookbooks";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan lookbook.");
      }

      setFormSuccess(editingId ? "Lookbook berhasil diperbarui!" : "Lookbook baru berhasil dibuat!");
      await fetchData();
      setTimeout(() => {
        setModalOpen(false);
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Lookbook
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/lookbooks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Gagal menghapus lookbook");
        return;
      }
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // Filtered products for search inside pin picker
  const filteredProducts = allProducts
    .filter((p) => {
      if (!productSearch) return true;
      const term = productSearch.toLowerCase().replace("#", "");
      const matchName = p.name.toLowerCase().includes(term);
      const matchBrand = p.brand.toLowerCase().includes(term);
      const matchCode = String(p.product_code || "").toLowerCase().includes(term);
      return matchName || matchBrand || matchCode;
    })
    .slice(0, 30); // show top 30 matches

  const totalHotspots = lookbooks.reduce((acc, curr) => acc + (curr.hotspots?.length || 0), 0);

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-lime/20 text-ink">
              <Sparkles className="w-5 h-5 text-ink" />
            </span>
            <h1 className="text-2xl font-black text-ink tracking-tight">
              Lookbook & OOTD by Anya
            </h1>
          </div>
          <p className="text-xs text-coolgray">
            Kelola foto inspirasi gaya Anya Pitaloka, upload foto real dari HP/kamera, dan pasang pin produk Shopee/TikTok Shop interaktif.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white text-xs font-bold shadow-sm hover:bg-ink-light transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-lime" />
          <span>+ Tambah Lookbook / OOTD</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-bordergray shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-coolgray block">
              Total Lookbook OOTD
            </span>
            <span className="text-2xl font-black text-ink">{lookbooks.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-lime/20 flex items-center justify-center text-ink font-black">
            {lookbooks.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-bordergray shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-coolgray block">
              Status Published (Live)
            </span>
            <span className="text-2xl font-black text-green-600">
              {lookbooks.filter((l) => l.is_published).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-bordergray shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-coolgray block">
              Total Pin Produk Terhubung
            </span>
            <span className="text-2xl font-black text-ink">{totalHotspots}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-bordergray shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-coolgray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari lookbook berdasarkan judul atau suasana..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-ivory border border-bordergray focus:outline-none focus:border-ink font-medium"
          />
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-bordergray text-xs font-bold text-coolgray hover:text-ink hover:bg-ivory"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Lookbooks Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-coolgray font-medium">Memuat koleksi lookbook...</p>
        </div>
      ) : lookbooks.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-bordergray p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-ivory flex items-center justify-center mx-auto text-coolgray">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-ink">Belum ada lookbook tersimpan</h3>
            <p className="text-xs text-coolgray mt-1 max-w-sm mx-auto">
              Mulai upload foto OOTD pertama Anya dan hubungkan produk Shopee untuk fitur Shop The Look!
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lime text-ink text-xs font-bold hover:bg-lime/80"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Foto OOTD Baru</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lookbooks
            .filter((l) =>
              searchTerm
                ? l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  l.occasion.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((look) => {
              const pinCount = look.hotspots?.length || 0;
              return (
                <div
                  key={look.id}
                  className="group bg-white rounded-3xl border border-bordergray overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Thumbnail with Overlay Badges */}
                    <div className="relative aspect-[4/5] bg-ivory overflow-hidden">
                      <Image
                        src={look.cover_image}
                        alt={look.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-ink/80 text-white backdrop-blur-md">
                          {look.occasion}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            look.is_published
                              ? "bg-lime text-ink"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {look.is_published ? "Published" : "Draft"}
                        </span>
                      </div>

                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md mb-1.5">
                          <MapPin className="w-3 h-3 text-lime" />
                          <span>{pinCount} Produk Terpasang</span>
                        </div>
                        <h3 className="font-black text-base line-clamp-1 drop-shadow-sm">
                          {look.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <p className="text-xs text-coolgray line-clamp-2 leading-relaxed">
                        {look.summary}
                      </p>

                      {/* Tagged Hotspots Preview */}
                      {look.hotspots && look.hotspots.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-bordergray">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-coolgray block">
                            Item Terpasang:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {look.hotspots.map((spot, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-ivory border border-bordergray text-[10px] font-bold text-ink"
                              >
                                {spot.label || `Pin #${idx + 1}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 border-t border-bordergray/60 flex items-center justify-between gap-2 mt-4">
                    <Link
                      href={`/lookbook/${look.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-coolgray hover:text-ink hover:bg-ivory transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(look)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-ivory text-ink hover:bg-lime hover:text-ink transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit & Pin</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(look.id)}
                        className="p-2 rounded-xl text-coolgray hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Hapus Lookbook"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE / EDIT LOOKBOOK MODAL                            */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-bordergray flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-bordergray flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-lime text-ink">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-ink">
                    {editingId ? "Edit Lookbook OOTD Anya" : "Buat Lookbook OOTD Baru"}
                  </h2>
                  <p className="text-xs text-coolgray">
                    Upload foto asli Anya, atur cerita outfit, dan pasang titik pin produk.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-ivory text-coolgray hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-8 flex-1">
              {/* Error / Success Alerts */}
              {formError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* STEP 1: UPLOAD FOTO ANYA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-ink block">
                      1. Foto OOTD (Wajib)
                    </span>
                    <span className="text-[11px] text-coolgray">
                      Upload foto OOTD asli resolusi tinggi langsung dari galeri HP atau laptop.
                    </span>
                  </div>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-bordergray text-xs font-bold text-ink hover:bg-ivory"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Ganti Foto</span>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {!coverImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-bordergray rounded-3xl p-10 text-center hover:border-ink cursor-pointer bg-ivory/50 transition-all space-y-3 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-bordergray flex items-center justify-center mx-auto text-coolgray group-hover:text-ink group-hover:scale-110 transition-transform">
                      {uploading ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-ink" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-ink">
                        {uploading ? uploadProgress : "Klik di sini untuk upload foto dari HP / Komputer"}
                      </p>
                      <p className="text-[11px] text-coolgray mt-1">
                        Format JPG, PNG, atau WEBP (Maksimal 10MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* INTERACTIVE PIN PLACEMENT CONTAINER */}
                    <div className="rounded-2xl border border-bordergray bg-ink p-4 text-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
                          <span className="text-xs font-bold text-lime">
                            Mode Pemasangan Pin Interaktif:
                          </span>
                          <span className="text-xs text-gray-300">
                            Klik di bagian mana saja pada foto untuk menandai produk (baju, celana, dll).
                          </span>
                        </div>
                        <span className="text-[11px] text-coolgray">
                          {hotspots.length} Pin Terpasang
                        </span>
                      </div>

                      {/* Photo Container for Pinning */}
                      <div
                        onClick={handleImageClick}
                        className="relative max-w-md mx-auto aspect-[4/5] rounded-xl overflow-hidden cursor-crosshair border-2 border-white/20 select-none shadow-lg group/canvas"
                      >
                        <Image
                          src={coverImage}
                          alt="Lookbook Anya"
                          fill
                          sizes="500px"
                          className="object-cover object-center pointer-events-none"
                        />

                        {/* Existing Pins */}
                        {hotspots.map((spot, index) => (
                          <div
                            key={spot.productId}
                            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group/pin"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-ink text-lime border-2 border-lime shadow-md font-black text-[10px] hover:scale-125 transition-transform">
                              <span>{index + 1}</span>

                              {/* Hover delete button */}
                              <button
                                type="button"
                                onClick={() => handleRemovePin(spot.productId)}
                                className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/pin:opacity-100 transition-opacity"
                                title="Hapus Pin"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            {/* Label Tag */}
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 text-white text-[10px] font-bold pointer-events-none shadow">
                              {spot.label}
                            </div>
                          </div>
                        ))}

                        {/* Hint Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/70 text-lime backdrop-blur-sm border border-white/10">
                            Tap di foto untuk pasang pin baru 📍
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Image URL input fallback */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-coolgray shrink-0">
                        Path Foto:
                      </span>
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="Contoh: /images/lookbook/model-look-1.jpg atau https://..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-ivory border border-bordergray font-mono"
                      />
                    </div>

                    {/* LIST OF CURRENTLY TAGGED PRODUCTS */}
                    {hotspots.length > 0 && (
                      <div className="space-y-2 p-4 rounded-2xl bg-ivory border border-bordergray">
                        <span className="text-xs font-black uppercase tracking-wider text-ink block">
                          Daftar Pin Terpasang ({hotspots.length})
                        </span>
                        <div className="space-y-2">
                          {hotspots.map((spot, idx) => {
                            const prod = allProducts.find((p) => p.id === spot.productId);
                            return (
                              <div
                                key={spot.productId}
                                className="p-2.5 rounded-xl bg-white border border-bordergray flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-ink text-lime flex items-center justify-center font-black text-xs shrink-0">
                                    {idx + 1}
                                  </div>
                                  {prod?.main_image && (
                                    <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 border border-bordergray">
                                      <Image
                                        src={prod.main_image}
                                        alt={prod.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-bold text-ink block line-clamp-1">
                                      {prod ? `#${prod.product_code} - ${prod.name}` : spot.label}
                                    </span>
                                    <span className="text-[10px] text-coolgray font-mono">
                                      Koordinat: X={spot.x}% | Y={spot.y}%
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemovePin(spot.productId)}
                                  className="p-1.5 rounded-lg text-coolgray hover:text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 2: METADATA & CERITA OOTD */}
              <div className="space-y-4 pt-4 border-t border-bordergray">
                <span className="text-xs font-black uppercase tracking-wider text-ink block">
                  2. Informasi & Cerita Outfit
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-ink">Judul Lookbook / OOTD *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Senopati Golden Hour & Cozy Knit"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-ivory border border-bordergray focus:outline-none focus:border-ink font-bold"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">Slug URL</label>
                    <input
                      type="text"
                      placeholder="senopati-golden-hour"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-ivory border border-bordergray focus:outline-none focus:border-ink font-mono"
                    />
                  </div>

                  {/* Occasion */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">Occasion / Suasana</label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-ivory border border-bordergray focus:outline-none focus:border-ink font-bold"
                    >
                      <option value="Cafe & Coffee Date">Cafe & Coffee Date</option>
                      <option value="Kampus & Kuliah">Kampus & Kuliah</option>
                      <option value="City Commute & Work">City Commute & Work</option>
                      <option value="Weekend Hangout & Dinner">Weekend Hangout & Dinner</option>
                      <option value="Casual Daily Wear">Casual Daily Wear</option>
                      <option value="Streetwear & Mall">Streetwear & Mall</option>
                      <option value="Formal & Kondangan">Formal & Kondangan</option>
                    </select>
                  </div>

                  {/* Style Tags */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-ink">
                      Style Tags (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Clean Fit, Korean-Inspired, Casual"
                      value={styleTags}
                      onChange={(e) => setStyleTags(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-ivory border border-bordergray focus:outline-none focus:border-ink font-medium"
                    />
                  </div>

                  {/* Caption / Summary */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-ink">
                      Deskripsi Ringkas Outfit (Summary)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Anya mengenakan scoop-neck top putih dipadukan flowy skirt..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-ivory border border-bordergray focus:outline-none focus:border-ink font-medium"
                    />
                  </div>

                  {/* Vibe Description */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-ink">
                      Catatan Vibe & Cerita Foto (Vibe Notes)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Candid foto smartphone saat golden hour nongkrong sore di coffee shop..."
                      value={vibeDescription}
                      onChange={(e) => setVibeDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-ivory border border-bordergray focus:outline-none focus:border-ink font-medium"
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-ink focus:ring-lime"
                    />
                    <label htmlFor="isPublished" className="text-xs font-bold text-ink cursor-pointer">
                      Publikasikan Sekarang (Tampil langsung di website inspirasi by anya)
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-bordergray flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur z-20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-bordergray text-xs font-bold text-coolgray hover:text-ink hover:bg-ivory"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ink text-white text-xs font-bold hover:bg-ink-light transition-all disabled:opacity-50"
                >
                  {formLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-lime" />}
                  <span>{editingId ? "Simpan Perubahan" : "Simpan & Terbitkan Lookbook"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PIN PICKER MODAL (Choose which product to pin)         */}
      {/* ======================================================== */}
      {pinPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-bordergray flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-bordergray flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-ink">
                  Pilih Produk untuk Pin Ini
                </h3>
                <p className="text-[11px] text-coolgray">
                  Titik letak: X={pendingPinCoord?.x}% | Y={pendingPinCoord?.y}%
                </p>
              </div>
              <button
                onClick={() => setPinPickerOpen(false)}
                className="p-1.5 rounded-full hover:bg-ivory text-coolgray"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-4 border-b border-bordergray">
              <div className="relative">
                <Search className="w-4 h-4 text-coolgray absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Ketik nomor tag (misal: 1, 401) atau nama produk..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-ivory border border-bordergray focus:outline-none focus:border-ink font-medium"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-coolgray">
                  Tidak ditemukan produk dengan kata kunci tersebut.
                </div>
              ) : (
                filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProductForPin(prod)}
                    className="p-3 rounded-2xl border border-bordergray hover:border-ink hover:bg-ivory cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-bordergray">
                        <Image
                          src={prod.main_image}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-lime text-ink font-black text-[10px]">
                            #{prod.product_code}
                          </span>
                          <span className="text-[10px] text-coolgray font-bold uppercase">
                            {prod.brand}
                          </span>
                        </div>
                        <p className="font-bold text-xs text-ink line-clamp-1 group-hover:text-ink-light">
                          {prod.name}
                        </p>
                        <p className="text-[11px] font-black text-ink">
                          {formatIDR(prod.price)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-ink text-white text-[11px] font-bold group-hover:bg-lime group-hover:text-ink transition-colors shrink-0"
                    >
                      Pilih
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION DIALOG                             */}
      {/* ======================================================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-ink">Hapus Lookbook Ini?</h3>
              <p className="text-xs text-coolgray mt-1">
                Tindakan ini tidak dapat dibatalkan. Foto dan titik pin yang sudah dibuat akan terhapus.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-bordergray text-xs font-bold text-coolgray hover:bg-ivory"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600"
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