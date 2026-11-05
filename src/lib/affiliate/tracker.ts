/**
 * Shopee Affiliate Link & Security Validation Engine
 * INSPIRASI BY ANYA
 */

export const DEFAULT_ALLOWED_DOMAINS = [
  // Shopee Domains
  "shopee.co.id",
  "s.shopee.co.id",
  "shope.ee",
  // TikTok Shop & Shop Tokopedia Domains
  "tiktok.com",
  "shop.tiktok.com",
  "vt.tiktok.com",
  "v.douyin.com",
  "tokopedia.com",
  "tokopedia.link",
  "shop-id.tokopedia.com",
];

export interface ValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  platform?: 'shopee' | 'tiktok';
  error?: string;
}

/**
 * Detects affiliate marketplace platform (Shopee vs TikTok Shop)
 */
export function detectAffiliatePlatform(url?: string): 'shopee' | 'tiktok' {
  if (!url) return 'shopee';
  const lower = url.toLowerCase();
  if (
    lower.includes("tiktok.com") ||
    lower.includes("tokopedia.com") ||
    lower.includes("tokopedia.link")
  ) {
    return 'tiktok';
  }
  return 'shopee';
}

/**
 * Validates that an affiliate URL is HTTPS and belongs to an authorized Shopee affiliate domain.
 * Strictly guards against arbitrary open redirects and SSRF attacks.
 */
export function validateAffiliateUrl(
  rawUrl: string,
  extraAllowedDomains: string[] = []
): ValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, error: "URL affiliate tidak boleh kosong." };
  }

  const trimmed = rawUrl.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: "Format URL tidak valid." };
  }

  // Must strictly use HTTPS
  if (parsed.protocol !== "https:") {
    return { isValid: false, error: "URL harus menggunakan protokol aman HTTPS." };
  }

  const hostname = parsed.hostname.toLowerCase();
  const allAllowed = [...DEFAULT_ALLOWED_DOMAINS, ...extraAllowedDomains].map((d) =>
    d.toLowerCase().trim()
  );

  const isMatch = allAllowed.some((domain) => {
    return hostname === domain || hostname.endsWith(`.${domain}`);
  });

  if (!isMatch) {
    return {
      isValid: false,
      error: `Domain '${hostname}' tidak ada dalam daftar domain affiliate resmi (Shopee / TikTok Shop) yang diizinkan.`,
    };
  }

  const sanitized = parsed.toString();
  return {
    isValid: true,
    sanitizedUrl: sanitized,
    platform: detectAffiliatePlatform(sanitized),
  };
}

/**
 * Safe client detection helper
 */
export function parseDeviceType(userAgent?: string): 'mobile' | 'tablet' | 'desktop' {
  if (!userAgent) return 'desktop';
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export interface ShopeeSubIdOptions {
  subId1?: string; // Brand identifier (default: 'inspirasibyanya')
  subId2?: string; // Traffic source (e.g. 'pdp', 'lookbook', 'home', 'shop')
  subId3?: string; // Device type ('mobile', 'tablet', 'desktop')
  subId4?: string; // Product identifier or code (e.g. 'code-1')
  subId5?: string; // Additional campaign tag
}

/**
 * Appends Shopee Affiliate Sub-ID tracking parameters (sub_id, sub_id2, sub_id3, sub_id4, sub_id5)
 * without overriding parameters if they were already explicitly present.
 */
export function appendShopeeSubIds(
  rawUrl: string,
  options: ShopeeSubIdOptions = {}
): string {
  try {
    const url = new URL(rawUrl);
    const sub1 = options.subId1 || "inspirasibyanya";
    const sub2 = options.subId2 || "web";
    const sub3 = options.subId3 || "desktop";
    const sub4 = options.subId4 || "all";

    if (!url.searchParams.has("sub_id")) {
      url.searchParams.set("sub_id", sub1);
    }
    if (sub2 && !url.searchParams.has("sub_id2")) {
      url.searchParams.set("sub_id2", sub2);
    }
    if (sub3 && !url.searchParams.has("sub_id3")) {
      url.searchParams.set("sub_id3", sub3);
    }
    if (sub4 && !url.searchParams.has("sub_id4")) {
      url.searchParams.set("sub_id4", sub4);
    }
    if (options.subId5 && !url.searchParams.has("sub_id5")) {
      url.searchParams.set("sub_id5", options.subId5);
    }

    return url.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * Appends TikTok Shop affiliate & UTM tracking parameters
 */
export function appendTikTokShopSubIds(
  rawUrl: string,
  options: {
    source?: string;
    device?: string;
    productCode?: string | number;
    campaign?: string;
  } = {}
): string {
  try {
    const url = new URL(rawUrl);
    if (!url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", "inspirasibyanya");
    }
    if (!url.searchParams.has("utm_medium")) {
      url.searchParams.set("utm_medium", "affiliate_tiktok");
    }
    if (options.source && !url.searchParams.has("utm_campaign")) {
      url.searchParams.set("utm_campaign", options.source);
    }
    if (options.productCode && !url.searchParams.has("track_id")) {
      url.searchParams.set("track_id", `code-${options.productCode}`);
    }
    if (options.device && !url.searchParams.has("device")) {
      url.searchParams.set("device", options.device);
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}
