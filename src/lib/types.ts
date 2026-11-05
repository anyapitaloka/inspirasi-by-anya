export type Audience = 'women' | 'men' | 'unisex';

export type ProductStatus = 'draft' | 'published';

export type AdminRole = 'superadmin' | 'editor';

export type AffiliatePlatform = 'shopee' | 'tiktok';

export interface Product {
  id: string;
  product_code: number; // e.g. 1 -> displayed as #1
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  brand: string;
  audience: Audience;
  primary_category_id: string;
  additional_category_ids?: string[];
  price: number;
  original_price?: number;
  currency: string;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  style_tags: string[];
  occasion_tags: string[];
  main_image: string;
  additional_images?: string[];
  image_alt: string;
  shopee_product_url?: string;
  affiliate_url: string; // Primary / Shopee affiliate URL
  tiktok_product_url?: string;
  tiktok_affiliate_url?: string; // TikTok Shop affiliate URL
  internal_notes?: string;
  seo_title?: string;
  seo_description?: string;
  is_featured: boolean;
  is_editors_pick: boolean;
  is_new_arrival: boolean;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  price_verified_at?: string;
  affiliate_url_verified_at?: string;
  related_product_ids?: string[];
  collection_ids?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  audience?: Audience | 'all';
  type: 'general' | 'style' | 'budget';
  description?: string;
  icon?: string;
  cover_image?: string;
  display_order: number;
  parent_id?: string;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  product_ids: string[];
  audience?: Audience | 'all';
  style_tags: string[];
  is_published: boolean;
  display_order: number;
  seo_title?: string;
  seo_description?: string;
}

export interface LookbookHotspot {
  productId: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  label?: string;
}

export interface Lookbook {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover_image: string;
  audience: Audience | 'all';
  style_tags: string[];
  occasion: string;
  vibe_description: string;
  product_ids: string[];
  hotspots?: LookbookHotspot[];
  is_published: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string;
  author: string;
  category: string;
  tags: string[];
  is_published: boolean;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
  read_time_minutes: number;
  related_product_ids?: string[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_url: string;
  desktop_image: string;
  mobile_image?: string;
  alt_text: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
}

export interface HomepageSection {
  id: string;
  section_type:
    | 'hero'
    | 'categories'
    | 'trending'
    | 'style_inspo'
    | 'latest_finds'
    | 'budget'
    | 'gender_edit'
    | 'unisex_essentials'
    | 'lookbook'
    | 'collections'
    | 'journal'
    | 'newsletter';
  title: string;
  subtitle?: string;
  is_enabled: boolean;
  display_order: number;
  config?: Record<string, any>;
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  description: string;
  primary_logo_url: string;
  compact_logo_url: string;
  favicon_url: string;
  announcement_bar_enabled: boolean;
  announcement_bar_text: string;
  announcement_bar_link: string;
  footer_bio: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  affiliate_disclosure_text: string;
  approved_affiliate_domains: string[];
  default_currency: string;
  products_per_page: number;
}

export interface AffiliateClick {
  id: string;
  product_id: string;
  product_slug: string;
  platform?: AffiliatePlatform | string; // 'shopee' | 'tiktok'
  timestamp: string;
  source_page?: string;
  referrer?: string;
  user_agent?: string;
  device?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  destination_url: string;
}

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity: string;
  entity_id: string;
  details?: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}
