import fs from "fs";
import path from "path";
import {
  Product,
  Category,
  Collection,
  Lookbook,
  Article,
  Banner,
  HomepageSection,
  SiteSettings,
  AffiliateClick,
  AuditLog,
  AdminUser,
} from "../types";
import {
  initialSiteSettings,
  initialAdminUsers,
  initialCategories,
  initialProducts,
  initialCollections,
  initialLookbooks,
  initialArticles,
  initialBanners,
  initialHomepageSections,
} from "./initialData";
import { hashPassword } from "../auth/admin";

interface DatabaseStore {
  siteSettings: SiteSettings;
  adminUsers: AdminUser[];
  categories: Category[];
  products: Product[];
  collections: Collection[];
  lookbooks: Lookbook[];
  articles: Article[];
  banners: Banner[];
  homepageSections: HomepageSection[];
  affiliateClicks: AffiliateClick[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

// In-memory cache + persistent disk backup with mtime invalidation
let cachedStore: DatabaseStore | null = null;
let lastStoreMtime = 0;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialStore(): DatabaseStore {
  return {
    siteSettings: initialSiteSettings,
    adminUsers: initialAdminUsers,
    categories: initialCategories,
    products: initialProducts,
    collections: initialCollections,
    lookbooks: initialLookbooks,
    articles: initialArticles,
    banners: initialBanners,
    homepageSections: initialHomepageSections,
    affiliateClicks: [],
    auditLogs: [
      {
        id: "log-init",
        admin_email: "system@inspirasibyanya.id",
        action: "INITIALIZE_SYSTEM",
        entity: "SYSTEM",
        entity_id: "0",
        details: "Database initialized with curated Gen Z catalog & settings.",
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export function loadStore(): DatabaseStore {
  ensureDataDirectory();

  if (fs.existsSync(STORE_PATH)) {
    try {
      const stat = fs.statSync(STORE_PATH);
      if (cachedStore && stat.mtimeMs === lastStoreMtime) {
        return cachedStore;
      }
      const data = fs.readFileSync(STORE_PATH, "utf-8");
      cachedStore = JSON.parse(data);
      lastStoreMtime = stat.mtimeMs;
      return cachedStore!;
    } catch (err) {
      console.error("Error reading store from disk, resetting to initial:", err);
    }
  }

  if (cachedStore) return cachedStore;

  // If file doesn't exist, seed it
  const initial = getInitialStore();
  saveStore(initial);
  cachedStore = initial;
  return initial;
}

export function saveStore(store: DatabaseStore) {
  ensureDataDirectory();
  cachedStore = store;
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
    if (fs.existsSync(STORE_PATH)) {
      lastStoreMtime = fs.statSync(STORE_PATH).mtimeMs;
    }
  } catch (err) {
    console.error("Failed to persist store to disk:", err);
  }
}

// ----------------------------------------------------------------------
// PRODUCTS REPOSITORY
// ----------------------------------------------------------------------

export async function getProducts(options?: {
  status?: "published" | "draft" | "all";
  audience?: string;
  categorySlug?: string;
  styleTag?: string;
  occasionTag?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "editors_pick" | "mixed" | "random" | "code_asc" | "code_desc";
  limit?: number;
}): Promise<Product[]> {
  const store = loadStore();
  let list = [...store.products];

  const status = options?.status ?? "published";
  if (status !== "all") {
    list = list.filter((p) => p.status === status);
  }

  if (options?.audience && options.audience !== "all") {
    list = list.filter(
      (p) => p.audience === options.audience || p.audience === "unisex"
    );
  }

  if (options?.categorySlug) {
    const cat = store.categories.find((c) => c.slug === options.categorySlug);
    if (cat) {
      list = list.filter(
        (p) =>
          p.primary_category_id === cat.id ||
          (p.additional_category_ids && p.additional_category_ids.includes(cat.id))
      );
    }
  }

  if (options?.styleTag) {
    list = list.filter((p) =>
      p.style_tags.some((t) => t.toLowerCase() === options.styleTag!.toLowerCase())
    );
  }

  if (options?.occasionTag) {
    list = list.filter((p) =>
      p.occasion_tags.some((t) => t.toLowerCase() === options.occasionTag!.toLowerCase())
    );
  }

  if (typeof options?.minPrice === "number") {
    list = list.filter((p) => p.price >= options.minPrice!);
  }

  if (typeof options?.maxPrice === "number") {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }

  if (options?.search) {
    const raw = options.search.trim().toLowerCase();
    const codeMatch = raw.match(/^#?\s*(\d+)$/);
    const targetCode = codeMatch ? parseInt(codeMatch[1], 10) : null;

    list = list.filter((p) => {
      // Direct numeric product code match (#1, # 1, 1)
      if (targetCode !== null && p.product_code === targetCode) {
        return true;
      }
      return (
        `#${p.product_code}` === raw ||
        p.name.toLowerCase().includes(raw) ||
        p.brand.toLowerCase().includes(raw) ||
        p.short_description.toLowerCase().includes(raw) ||
        p.style_tags.some((t) => t.toLowerCase().includes(raw)) ||
        p.occasion_tags.some((t) => t.toLowerCase().includes(raw))
      );
    });

    if (targetCode !== null) {
      list.sort((a, b) => {
        if (a.product_code === targetCode) return -1;
        if (b.product_code === targetCode) return 1;
        return 0;
      });
    }
  }

  // Sorting
  const sortBy = options?.sortBy ?? "mixed";
  switch (sortBy) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "code_asc":
      list.sort((a, b) => a.product_code - b.product_code);
      break;
    case "code_desc":
      list.sort((a, b) => b.product_code - a.product_code);
      break;
    case "editors_pick":
      list.sort((a, b) => (b.is_editors_pick ? 1 : 0) - (a.is_editors_pick ? 1 : 0));
      break;
    case "newest":
      list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "mixed":
    case "random":
    default:
      // Keep naturally shuffled and interleaved
      break;
  }

  if (options?.limit) {
    list = list.slice(0, options.limit);
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const store = loadStore();
  return store.products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const store = loadStore();
  return store.products.find((p) => p.id === id) ?? null;
}

export async function getProductByCode(code: number): Promise<Product | null> {
  const store = loadStore();
  return store.products.find((p) => p.product_code === code) ?? null;
}

export async function createProduct(
  productData: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> {
  const store = loadStore();
  const id = `prod-${Date.now()}`;
  const now = new Date().toISOString();

  let product_code = productData.product_code;
  if (!product_code) {
    const maxCode = store.products.reduce(
      (max, p) => Math.max(max, p.product_code || 0),
      0
    );
    product_code = maxCode + 1;
  }

  const newProduct: Product = {
    ...productData,
    product_code,
    id,
    created_at: now,
    updated_at: now,
  };
  store.products.unshift(newProduct);
  saveStore(store);
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const store = loadStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.products[index] = {
    ...store.products[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveStore(store);
  return store.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const store = loadStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.products.splice(index, 1);
  saveStore(store);
  return true;
}

// ----------------------------------------------------------------------
// CATEGORIES REPOSITORY
// ----------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const store = loadStore();
  return [...store.categories].sort((a, b) => a.display_order - b.display_order);
}

export async function createCategory(cat: Omit<Category, "id">): Promise<Category> {
  const store = loadStore();
  const id = `cat-${Date.now()}`;
  const newCat: Category = { ...cat, id };
  store.categories.push(newCat);
  saveStore(store);
  return newCat;
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<Category | null> {
  const store = loadStore();
  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  store.categories[index] = { ...store.categories[index], ...updates };
  saveStore(store);
  return store.categories[index];
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const store = loadStore();
  // Safe relation validation: Check if any product is using this category
  const inUse = store.products.some(
    (p) =>
      p.primary_category_id === id ||
      (p.additional_category_ids && p.additional_category_ids.includes(id))
  );

  if (inUse) {
    return {
      success: false,
      error: "Kategori tidak dapat dihapus karena masih digunakan oleh satu atau lebih produk.",
    };
  }

  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) return { success: false, error: "Kategori tidak ditemukan." };

  store.categories.splice(index, 1);
  saveStore(store);
  return { success: true };
}

// ----------------------------------------------------------------------
// COLLECTIONS REPOSITORY
// ----------------------------------------------------------------------

export async function getCollections(): Promise<Collection[]> {
  const store = loadStore();
  return [...store.collections].sort((a, b) => a.display_order - b.display_order);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const store = loadStore();
  return store.collections.find((c) => c.slug === slug) ?? null;
}

export async function createCollection(col: Omit<Collection, "id">): Promise<Collection> {
  const store = loadStore();
  const id = `col-${Date.now()}`;
  const newCol: Collection = { ...col, id };
  store.collections.push(newCol);
  saveStore(store);
  return newCol;
}

export async function updateCollection(
  id: string,
  updates: Partial<Collection>
): Promise<Collection | null> {
  const store = loadStore();
  const index = store.collections.findIndex((c) => c.id === id);
  if (index === -1) return null;

  store.collections[index] = { ...store.collections[index], ...updates };
  saveStore(store);
  return store.collections[index];
}

export async function deleteCollection(id: string): Promise<boolean> {
  const store = loadStore();
  const index = store.collections.findIndex((c) => c.id === id);
  if (index === -1) return false;
  store.collections.splice(index, 1);
  saveStore(store);
  return true;
}

// ----------------------------------------------------------------------
// LOOKBOOKS REPOSITORY
// ----------------------------------------------------------------------

export async function getLookbooks(): Promise<Lookbook[]> {
  const store = loadStore();
  return [...store.lookbooks];
}

export async function getLookbookBySlug(slug: string): Promise<Lookbook | null> {
  const store = loadStore();
  return store.lookbooks.find((l) => l.slug === slug) ?? null;
}

export async function createLookbook(look: Omit<Lookbook, "id" | "created_at">): Promise<Lookbook> {
  const store = loadStore();
  const id = `look-${Date.now()}`;
  const newLook: Lookbook = {
    ...look,
    id,
    created_at: new Date().toISOString(),
  };
  store.lookbooks.unshift(newLook);
  saveStore(store);
  return newLook;
}

export async function updateLookbook(id: string, updates: Partial<Lookbook>): Promise<Lookbook | null> {
  const store = loadStore();
  const index = store.lookbooks.findIndex((l) => l.id === id);
  if (index === -1) return null;
  store.lookbooks[index] = { ...store.lookbooks[index], ...updates };
  saveStore(store);
  return store.lookbooks[index];
}

export async function deleteLookbook(id: string): Promise<boolean> {
  const store = loadStore();
  const index = store.lookbooks.findIndex((l) => l.id === id);
  if (index === -1) return false;
  store.lookbooks.splice(index, 1);
  saveStore(store);
  return true;
}

// ----------------------------------------------------------------------
// ARTICLES REPOSITORY
// ----------------------------------------------------------------------

export async function getArticles(): Promise<Article[]> {
  const store = loadStore();
  return [...store.articles].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const store = loadStore();
  return store.articles.find((a) => a.slug === slug) ?? null;
}

export async function createArticle(art: Omit<Article, "id">): Promise<Article> {
  const store = loadStore();
  const id = `art-${Date.now()}`;
  const newArt: Article = { ...art, id };
  store.articles.unshift(newArt);
  saveStore(store);
  return newArt;
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  const store = loadStore();
  const index = store.articles.findIndex((a) => a.id === id);
  if (index === -1) return null;
  store.articles[index] = { ...store.articles[index], ...updates };
  saveStore(store);
  return store.articles[index];
}

export async function deleteArticle(id: string): Promise<boolean> {
  const store = loadStore();
  const index = store.articles.findIndex((a) => a.id === id);
  if (index === -1) return false;
  store.articles.splice(index, 1);
  saveStore(store);
  return true;
}

// ----------------------------------------------------------------------
// BANNERS REPOSITORY
// ----------------------------------------------------------------------

export async function getBanners(): Promise<Banner[]> {
  const store = loadStore();
  return [...store.banners].sort((a, b) => a.display_order - b.display_order);
}

export async function saveBanners(banners: Banner[]): Promise<Banner[]> {
  const store = loadStore();
  store.banners = banners;
  saveStore(store);
  return store.banners;
}

// ----------------------------------------------------------------------
// HOMEPAGE SECTIONS REPOSITORY
// ----------------------------------------------------------------------

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const store = loadStore();
  return [...store.homepageSections].sort((a, b) => a.display_order - b.display_order);
}

export async function saveHomepageSections(sections: HomepageSection[]): Promise<HomepageSection[]> {
  const store = loadStore();
  store.homepageSections = sections;
  saveStore(store);
  return store.homepageSections;
}

// ----------------------------------------------------------------------
// SITE SETTINGS REPOSITORY
// ----------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  const store = loadStore();
  return { ...store.siteSettings };
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = loadStore();
  store.siteSettings = { ...store.siteSettings, ...updates };
  saveStore(store);
  return store.siteSettings;
}

// ----------------------------------------------------------------------
// AFFILIATE CLICKS & ANALYTICS
// ----------------------------------------------------------------------

export async function recordAffiliateClick(
  click: Omit<AffiliateClick, "id" | "timestamp">
): Promise<AffiliateClick> {
  const store = loadStore();
  const record: AffiliateClick = {
    ...click,
    id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  store.affiliateClicks.unshift(record);
  saveStore(store);
  return record;
}

export async function getAffiliateAnalytics(days: number = 30) {
  const store = loadStore();
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const clicks = store.affiliateClicks.filter(
    (c) => new Date(c.timestamp) >= cutoff
  );

  const totalClicks = clicks.length;

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const clicksToday = clicks.filter((c) => new Date(c.timestamp) >= todayStart).length;

  // Clicks by product
  const productClickMap: Record<string, { count: number; name: string; slug: string }> = {};
  for (const c of clicks) {
    if (!productClickMap[c.product_id]) {
      const prod = store.products.find((p) => p.id === c.product_id);
      productClickMap[c.product_id] = {
        count: 0,
        name: prod ? prod.name : c.product_slug,
        slug: c.product_slug,
      };
    }
    productClickMap[c.product_id].count++;
  }

  const topProducts = Object.values(productClickMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Daily clicks timeline (last 7 days)
  const timeline: { date: string; clicks: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = d.toISOString().split("T")[0];
    const count = clicks.filter((c) => c.timestamp.startsWith(dateKey)).length;
    timeline.push({ date: dateKey, clicks: count });
  }

  return {
    totalClicks,
    clicksToday,
    topProducts,
    timeline,
    publishedProductsCount: store.products.filter((p) => p.status === "published").length,
    draftProductsCount: store.products.filter((p) => p.status === "draft").length,
    categoriesCount: store.categories.filter((c) => c.is_active).length,
  };
}

// ----------------------------------------------------------------------
// AUDIT LOGS
// ----------------------------------------------------------------------

export async function recordAuditLog(
  adminEmail: string,
  action: string,
  entity: string,
  entityId: string,
  details?: string
): Promise<AuditLog> {
  const store = loadStore();
  const log: AuditLog = {
    id: `log-${Date.now()}`,
    admin_email: adminEmail,
    action,
    entity,
    entity_id: entityId,
    details,
    timestamp: new Date().toISOString(),
  };
  store.auditLogs.unshift(log);
  if (store.auditLogs.length > 200) {
    store.auditLogs.pop(); // keep last 200 logs
  }
  saveStore(store);
  return log;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const store = loadStore();
  return [...store.auditLogs];
}
