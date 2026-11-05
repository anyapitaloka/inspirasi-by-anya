# INSPIRASI BY ANYA — PREMIUM GEN Z FASHION AFFILIATE MARKETPLACE

> **A Gen Z Fashion Discovery & Outfit Inspiration Platform**  
> Operating in `Asia/Jakarta` (WIB) • Built with Next.js 15 App Router, React 19, TypeScript Strict Mode, Tailwind CSS, Supabase PostgreSQL & Local Persistent Engine.

---

## 🌟 Executive Overview

**INSPIRASI BY ANYA** adalah platform kurasi fashion dan penemuan outfit harian (OOTD) untuk Gen Z Indonesia berusia 18–27 tahun (mahasiswa, first-jobbers, dan urban fashion enthusiasts).

### Karakter & Visi Desain:
*"Urban Editorial Meets Playful Gen Z Fashion"*
- **Design Tokens**:
  - Ink (`#1B1B1F`): Teks utama, logo, high-contrast borders
  - Soft Ivory (`#F7F6F2`): Background dominan yang hangat dan natural
  - Pure White (`#FFFFFF`): Surface cards dan product containers
  - Muted Lavender (`#B9A7F2`): Aksen editorial sekunder
  - Soft Mint (`#BFE7DC`): Aksen kesegaran dan badge verified
  - Electric Lime (`#D8F36A`): Highlight CTAs dan Anya's Picks
  - Cool Gray (`#85858D`): Micro-copy, metadata, dan secondary text
  - Border Gray (`#E7E5E1`): Pembatas layout halus
- **Unisex & Inclusive**: Menemukan pakaian pria, wanita, maupun unisex essentials (streetwear, clean fit, Korean-inspired, modest dailywear, casual).

---

## 🏛️ Arsitektur Sistem & Fitur Utama

### 1. Website Publik
- **Homepage Dinamis**: Hero editorial, quick category navigation pills, Anya's Picks / Trending Finds, Shop by Vibe & Style, Curated Under 100K Finds, The Lookbook, Featured Collections, The Style Journal, dan Weekly Style Drop newsletter.
- **Katalog & Filter Interaktif (`/shop`)**:
  - Multi-dimensional filters: Kategori, Target Audience (Women/Men/Unisex), Slider Rentang Harga (Rp50K - Rp500K+), Style Tag, dan Keyword Search.
  - Sorting: Terbaru, Pilihan Anya (Editor's Pick), Harga Terendah, dan Harga Tertinggi.
  - Sinkronisasi URL query params untuk memudahkan sharing hasil pencarian.
  - Mobile responsive drawer filter dengan counter badge dan reset.
- **Halaman Detail Produk (`/product/[slug]`)**:
  - Multi-image gallery dengan thumbnail switcher.
  - Detail bahan, ukuran, warna, style tags, dan occasion tags.
  - Primary CTA: **"Cek Produk di Shopee"** terhubung ke engine `/go/[slug]`.
  - Secondary CTA: **"Save This Fit"** (Wishlist toggle).
  - Cross-selling: *"Cocok Dipadukan (Complete Your Look)"*.
  - Catatan transparansi harga & komisi affiliate Shopee.
- **Wishlist Lokal (`/wishlist`)**:
  - Penyimpanan instan di browser via `localStorage` (tanpa repot login).
  - Shareable wishlist link generator.
- **Lookbook OOTD (`/lookbook` & `/lookbook/[slug]`)**:
  - Kurasi lengkap dari atasan, celana, tas, hingga sepatu dengan tautan langsung ke Shopee.
- **The Style Journal (`/journal` & `/journal/[slug]`)**:
  - Artikel editorial SEO-friendly dengan rekomendasi produk Shopee terkait.
- **Halaman Legal & Informasi**:
  - `/about`, `/contact`, `/disclosure`, `/privacy`, `/terms`.

### 2. Shopee Affiliate Engine & Outbound Redirect Tracker (`/go/[slug]`)
- **Anti-Open Redirect**: URL tujuan TIDAK PERNAH diterima langsung dari query parameter; tujuan wajib bersumber dari data produk tersimpan yang berstatus *published*.
- **Domain Allowlist Security**: Hanya mengizinkan protokol `https://` dan domain resmi Shopee:
  - `shopee.co.id`
  - `s.shopee.co.id`
  - `shope.ee`
  - Domain kustom tambahan yang diizinkan oleh superadmin.
- **Click Telemetry**: Mencatat product ID, product slug, timestamp, source page, referrer, user agent, jenis perangkat (mobile/desktop), dan UTM tags.
- **Resilient Fallback**: Kegagalan sistem logging tidak menghambat redirect pengunjung menuju Shopee.

### 3. Admin Dashboard (`/admin`)
- **Autentikasi Terproteksi**: Sesi berbasis HTTP-Only cookie bertanda tangan HMAC-SHA256 (`admin_session`).
- **Dashboard Overview**: Metrik real-time produk published/draft, kategori aktif, total klik Shopee 30 hari, klik hari ini, top-performing products, grafik tren 7 hari, dan audit log pembaruan.
- **Manajemen Produk (CRUD)**: Create, Edit, Duplicate, Delete (dengan konfirmasi), pencarian, filter status/kategori, dan validasi domain Shopee otomatis saat pengisian form.
- **Manajemen Kategori**: Pengelolaan kategori umum, style vibe, dan budget categories dengan validasi relasi produk sebelum penghapusan.
- **Homepage CMS**: Pengaturan teks dan link announcement bar, hero banner (headline, subtitle, image, CTA), serta urutan/aktivasi section homepage.
- **Site Settings & Allowlist**: Pengaturan identitas brand, deskripsi SEO, teks disclosure affiliate, dan domain allowlist Shopee.

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### 1. Prasyarat
- Node.js v20 atau v24+
- npm v10+

### 2. Pemasangan Dependensi
```bash
cd C:\Users\ASUS\.gemini\antigravity\scratch\inspirasi-by-anya
npm install
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

### 4. Menjalankan Unit Tests
```bash
npm test
```
*Menjalankan 8 pengujian otomatis untuk validator affiliate, pencegahan open-redirect, format mata uang IDR, dan slug generator.*

### 5. Kredensial Login Admin Default
- URL Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@inspirasibyanya.id`
- **Password**: `admin123!`

---

## 🗄️ Database & Supabase Integration

Website ini dilengkapi arsitektur data ganda:
1. **Local Persistent Engine (`data/store.json`)**: Memungkinkan seluruh fungsi aplikasi (CRUD produk, kategori, CMS, settings, tracking klik `/go/[slug]`) berjalan 100% secara offline/lokal tanpa ketergantungan koneksi Supabase.
2. **Production Supabase PostgreSQL**: Siap untuk deployment skala produksi.
   - File DDL Migrasi: `supabase/migrations/20261023_init_inspirasi_by_anya.sql`
   - Berisi 14 tabel relasional, foreign keys, constraints, indexes berkinerja tinggi, dan Row Level Security (RLS) policies.

### Menghubungkan Supabase Cloud:
Isi file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```
Jalankan file SQL `supabase/migrations/20261023_init_inspirasi_by_anya.sql` melalui Supabase SQL Editor.

---

## 📦 Struktur Direktori Proyek

```
inspirasi-by-anya/
├── data/
│   └── store.json                   # Local persistent database
├── public/
│   ├── logo.svg                     # Primary vector wordmark logo
│   └── logo-compact.svg             # Monogram compact icon
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── categories/page.tsx  # Admin Category management
│   │   │   ├── homepage-cms/page.tsx# Admin Homepage CMS orchestrator
│   │   │   ├── login/page.tsx       # Secure admin login
│   │   │   ├── products/page.tsx    # Admin Product CRUD & validation
│   │   │   ├── settings/page.tsx    # Admin Site settings & allowlist
│   │   │   ├── layout.tsx           # Admin layout & auth guard
│   │   │   └── page.tsx             # Admin Dashboard overview & analytics
│   │   ├── api/
│   │   │   ├── admin/               # Admin auth, analytics, settings APIs
│   │   │   ├── categories/          # Category CRUD endpoints
│   │   │   └── products/            # Product CRUD endpoints
│   │   ├── go/[slug]/route.ts       # Secure Shopee affiliate redirect & telemetry
│   │   ├── journal/                 # The Style Journal articles
│   │   ├── lookbook/                # Lookbook & OOTD complete fits
│   │   ├── product/[slug]/page.tsx  # Product detail page & mix-and-match
│   │   ├── shop/page.tsx            # Shop catalog with multi-filters & search
│   │   ├── wishlist/page.tsx        # Saved fits with localStorage sync
│   │   ├── about/, contact/, disclosure/, privacy/, terms/ # Legal & info
│   │   ├── layout.tsx               # Root layout & providers
│   │   ├── page.tsx                 # Dynamic Homepage
│   │   ├── robots.ts                # SEO robots directive
│   │   └── sitemap.ts               # XML sitemap generator
│   ├── components/
│   │   ├── admin/                   # Admin sidebar & UI widgets
│   │   ├── brand/Logo.tsx           # Scalable vector logo component
│   │   ├── layout/                  # Header, AnnouncementBar, Footer, MobileNav
│   │   └── product/                 # ProductCard, Gallery, AffiliateButton, WishlistButton
│   └── lib/
│       ├── affiliate/tracker.ts     # Domain allowlist & anti open-redirect engine
│       ├── auth/admin.ts            # Password hash & HMAC session token logic
│       ├── db/                      # DB store repository & initial seed
│       ├── types.ts                 # Strict TypeScript schemas
│       ├── utils/formatters.ts      # IDR currency, dates, and slug utilities
│       └── wishlist/context.tsx     # Client-side Wishlist provider
├── supabase/
│   └── migrations/
│       └── 20261023_init_inspirasi_by_anya.sql # Production Supabase SQL
├── tests/
│   └── affiliate.test.mjs           # Unit tests
└── README.md
```

---

## 🔒 Standar Keamanan & Kepatuhan
1. **Tidak Ada Open Redirect**: Endpoint redirect `/go/[slug]` mencocokkan slug dengan database sebelum mengalihkan pengunjung. Parameter query URL arbitrary selalu diabaikan.
2. **Kepatuhan Transparansi Konsumen**: Teks affiliate disclosure resmi dipasang jelas di footer dan halaman detail produk.
3. **Session Authentication**: Token admin menggunakan enkripsi tanda tangan SHA-256 dan disimpan dalam cookie `HttpOnly`, `SameSite=Lax`.
4. **Zero-Trust Input Sanitization**: Seluruh input URL diperiksa skema HTTPS dan domain allowlist sebelum diizinkan masuk ke database.
