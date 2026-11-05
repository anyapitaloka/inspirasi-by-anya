import test from "node:test";
import assert from "node:assert/strict";

// Pure functions under test
const DEFAULT_ALLOWED = [
  "shopee.co.id",
  "s.shopee.co.id",
  "shope.ee",
  "tiktok.com",
  "shop.tiktok.com",
  "vt.tiktok.com",
  "v.douyin.com",
  "tokopedia.com",
  "tokopedia.link",
  "shop-id.tokopedia.com",
];

function detectAffiliatePlatform(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("tiktok") || hostname.includes("douyin") || hostname.includes("tokopedia")) {
      return "tiktok";
    }
  } catch {}
  return "shopee";
}

function validateAffiliateUrl(rawUrl, extraAllowedDomains = []) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, error: "URL affiliate tidak boleh kosong." };
  }
  const trimmed = rawUrl.trim();
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: "Format URL tidak valid." };
  }
  if (parsed.protocol !== "https:") {
    return { isValid: false, error: "URL harus menggunakan protokol aman HTTPS." };
  }
  const hostname = parsed.hostname.toLowerCase();
  const allAllowed = [...DEFAULT_ALLOWED, ...extraAllowedDomains].map((d) =>
    d.toLowerCase().trim()
  );
  const isMatch = allAllowed.some((domain) => {
    return hostname === domain || hostname.endsWith(`.${domain}`);
  });
  if (!isMatch) {
    return {
      isValid: false,
      error: `Domain '${hostname}' tidak ada dalam daftar domain affiliate yang diizinkan.`,
    };
  }
  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
    platform: detectAffiliatePlatform(parsed.toString()),
  };
}

function formatIDR(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, "");
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

test("Affiliate Validator: accepts valid official Shopee short links", () => {
  const res = validateAffiliateUrl("https://s.shopee.co.id/heavyweight-boxy-tee");
  assert.equal(res.isValid, true);
  assert.equal(res.sanitizedUrl, "https://s.shopee.co.id/heavyweight-boxy-tee");
});

test("Affiliate Validator: accepts standard shopee.co.id links", () => {
  const res = validateAffiliateUrl("https://shopee.co.id/product/12345/67890");
  assert.equal(res.isValid, true);
});

test("Affiliate Validator: accepts shope.ee links", () => {
  const res = validateAffiliateUrl("https://shope.ee/anY4F1t5");
  assert.equal(res.isValid, true);
});

test("Affiliate Validator: rejects insecure HTTP protocol", () => {
  const res = validateAffiliateUrl("http://shopee.co.id/product/123");
  assert.equal(res.isValid, false);
  assert.match(res.error, /HTTPS/);
});

test("Affiliate Validator: prevents open redirects to arbitrary attacker domains", () => {
  const res1 = validateAffiliateUrl("https://malicious-site.com/steal-creds");
  assert.equal(res1.isValid, false);

  const res2 = validateAffiliateUrl("https://shopee.co.id.evil.com/fake-login");
  assert.equal(res2.isValid, false);
});

test("Affiliate Validator: respects custom domain allowlist configured by superadmin", () => {
  const res = validateAffiliateUrl("https://tokopedia.com/product/123", ["tokopedia.com"]);
  assert.equal(res.isValid, true);
});

test("Formatters: formatIDR correctly formats Indonesian Rupiah", () => {
  assert.equal(formatIDR(89000), "Rp89.000");
  assert.equal(formatIDR(185000), "Rp185.000");
  assert.equal(formatIDR(0), "Rp0");
});

test("Formatters: slugify creates SEO friendly slugs", () => {
  assert.equal(slugify("Heavyweight Boxy Tee 24s!"), "heavyweight-boxy-tee-24s");
  assert.equal(slugify("Anya's Personal Picks"), "anyas-personal-picks");
});

function appendShopeeSubIds(rawUrl, options = {}) {
  try {
    const url = new URL(rawUrl);
    const sub1 = options.subId1 || "inspirasibyanya";
    const sub2 = options.subId2 || "web";
    const sub3 = options.subId3 || "desktop";
    const sub4 = options.subId4 || "all";

    if (!url.searchParams.has("sub_id")) url.searchParams.set("sub_id", sub1);
    if (sub2 && !url.searchParams.has("sub_id2")) url.searchParams.set("sub_id2", sub2);
    if (sub3 && !url.searchParams.has("sub_id3")) url.searchParams.set("sub_id3", sub3);
    if (sub4 && !url.searchParams.has("sub_id4")) url.searchParams.set("sub_id4", sub4);
    if (options.subId5 && !url.searchParams.has("sub_id5")) url.searchParams.set("sub_id5", options.subId5);
    return url.toString();
  } catch {
    return rawUrl;
  }
}

test("Shopee Sub-ID Generator: automatically appends sub_id 1 through 4", () => {
  const tagged = appendShopeeSubIds("https://s.shopee.co.id/item-123", {
    subId1: "inspirasibyanya",
    subId2: "lookbook_hotspot",
    subId3: "mobile",
    subId4: "p1",
  });
  const url = new URL(tagged);
  assert.equal(url.searchParams.get("sub_id"), "inspirasibyanya");
  assert.equal(url.searchParams.get("sub_id2"), "lookbook_hotspot");
  assert.equal(url.searchParams.get("sub_id3"), "mobile");
  assert.equal(url.searchParams.get("sub_id4"), "p1");
});

test("Product Code Matcher: parses #1 and 1 cleanly", () => {
  const q1 = "#1";
  const m1 = q1.match(/^#?\s*(\d+)$/);
  assert.equal(parseInt(m1[1], 10), 1);

  const q2 = " 2 ";
  const m2 = q2.trim().match(/^#?\s*(\d+)$/);
  assert.equal(parseInt(m2[1], 10), 2);
});

function appendTikTokShopSubIds(rawUrl, options = {}) {
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

test("TikTok Shop Validator: accepts official TikTok Shop and Tokopedia link domains", () => {
  const res1 = validateAffiliateUrl("https://vt.tiktok.com/ZSj1BoxyTee/");
  assert.equal(res1.isValid, true);
  assert.equal(res1.platform, "tiktok");

  const res2 = validateAffiliateUrl("https://shop.tiktok.com/view/product/1729482910");
  assert.equal(res2.isValid, true);
  assert.equal(res2.platform, "tiktok");

  const res3 = validateAffiliateUrl("https://tokopedia.link/AnyaKnitSweater");
  assert.equal(res3.isValid, true);
  assert.equal(res3.platform, "tiktok");
});

test("TikTok Shop Sub-ID Generator: automatically appends UTM and tracking parameters", () => {
  const tagged = appendTikTokShopSubIds("https://vt.tiktok.com/ZSj1BoxyTee/", {
    source: "pdp",
    device: "mobile",
    productCode: 1,
  });
  const url = new URL(tagged);
  assert.equal(url.searchParams.get("utm_source"), "inspirasibyanya");
  assert.equal(url.searchParams.get("utm_medium"), "affiliate_tiktok");
  assert.equal(url.searchParams.get("utm_campaign"), "pdp");
  assert.equal(url.searchParams.get("track_id"), "code-1");
  assert.equal(url.searchParams.get("device"), "mobile");
});
