-- ==============================================================================
-- INSPIRASI BY ANYA — SUPABASE POSTGRESQL PRODUCTION SCHEMA MIGRATION
-- Date: 2026-10-23
-- Description: Complete relational schema with RLS, indexes, and audit logs.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ADMIN ROLES
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'editor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    audience TEXT CHECK (audience IN ('women', 'men', 'unisex', 'all')),
    type TEXT NOT NULL CHECK (type IN ('general', 'style', 'budget')),
    description TEXT,
    icon TEXT,
    cover_image TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    brand TEXT NOT NULL,
    audience TEXT NOT NULL CHECK (audience IN ('women', 'men', 'unisex')),
    primary_category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    price NUMERIC(14, 2) NOT NULL,
    original_price NUMERIC(14, 2),
    currency TEXT NOT NULL DEFAULT 'IDR',
    sizes JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    materials JSONB DEFAULT '[]'::jsonb,
    style_tags JSONB DEFAULT '[]'::jsonb,
    occasion_tags JSONB DEFAULT '[]'::jsonb,
    main_image TEXT NOT NULL,
    additional_images JSONB DEFAULT '[]'::jsonb,
    image_alt TEXT NOT NULL,
    shopee_product_url TEXT,
    affiliate_url TEXT NOT NULL,
    internal_notes TEXT,
    seo_title TEXT,
    seo_description TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_editors_pick BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    price_verified_at TIMESTAMPTZ,
    affiliate_url_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PRODUCT CATEGORIES (MANY-TO-MANY)
CREATE TABLE IF NOT EXISTS public.product_categories (
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- 5. COLLECTIONS
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    audience TEXT DEFAULT 'all',
    style_tags JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. COLLECTION PRODUCTS (MANY-TO-MANY)
CREATE TABLE IF NOT EXISTS public.collection_products (
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, product_id)
);

-- 7. LOOKBOOKS
CREATE TABLE IF NOT EXISTS public.lookbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    audience TEXT DEFAULT 'all',
    style_tags JSONB DEFAULT '[]'::jsonb,
    occasion TEXT NOT NULL,
    vibe_description TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. LOOKBOOK PRODUCTS
CREATE TABLE IF NOT EXISTS public.lookbook_products (
    lookbook_id UUID REFERENCES public.lookbooks(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (lookbook_id, product_id)
);

-- 9. ARTICLES / STYLE JOURNAL
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    read_time_minutes INTEGER NOT NULL DEFAULT 3,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    cta_label TEXT NOT NULL,
    cta_url TEXT NOT NULL,
    desktop_image TEXT NOT NULL,
    mobile_image TEXT,
    alt_text TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. HOMEPAGE SECTIONS
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_type TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    config JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. SITE SETTINGS (SINGLETON ROW)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    brand_name TEXT NOT NULL DEFAULT 'INSPIRASI BY ANYA',
    tagline TEXT NOT NULL DEFAULT 'Your Next Fit Starts Here',
    description TEXT NOT NULL,
    primary_logo_url TEXT,
    compact_logo_url TEXT,
    favicon_url TEXT,
    announcement_bar_enabled BOOLEAN DEFAULT true,
    announcement_bar_text TEXT,
    announcement_bar_link TEXT,
    footer_bio TEXT,
    instagram_url TEXT,
    tiktok_url TEXT,
    youtube_url TEXT,
    affiliate_disclosure_text TEXT NOT NULL,
    approved_affiliate_domains JSONB DEFAULT '["shopee.co.id", "s.shopee.co.id", "shope.ee"]'::jsonb,
    default_currency TEXT DEFAULT 'IDR',
    products_per_page INTEGER DEFAULT 12,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. AFFILIATE CLICKS (ANALYTICS)
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_slug TEXT NOT NULL,
    source_page TEXT,
    referrer TEXT,
    user_agent TEXT,
    device TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    destination_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR HIGH-EFFICIENCY SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_audience ON public.products(audience);
CREATE INDEX IF NOT EXISTS idx_products_primary_category ON public.products(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_timestamp ON public.affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product ON public.affiliate_clicks(product_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Only published content)
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published collections" ON public.collections FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published lookbooks" ON public.lookbooks FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view homepage sections" ON public.homepage_sections FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

-- Public Click Insert Policy (For recording outbound clicks)
CREATE POLICY "Public can insert affiliate clicks" ON public.affiliate_clicks FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Full Access for verified admin users)
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to collections" ON public.collections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to lookbooks" ON public.lookbooks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to articles" ON public.articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to banners" ON public.banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to homepage_sections" ON public.homepage_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can view clicks" ON public.affiliate_clicks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR ALL USING (auth.role() = 'authenticated');
