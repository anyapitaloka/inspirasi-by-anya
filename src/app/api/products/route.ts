import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct, recordAuditLog } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";
import { validateAffiliateUrl } from "@/lib/affiliate/tracker";
import { slugify } from "@/lib/utils/formatters";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience") || undefined;
    const categorySlug = searchParams.get("category") || undefined;
    const styleTag = searchParams.get("style") || undefined;
    const statusParam = searchParams.get("status") as any;
    const status = statusParam || "published";
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "mixed";

    const products = await getProducts({
      audience,
      categorySlug,
      styleTag,
      status,
      search,
      sortBy,
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat produk." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(sessionCookie);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Required fields validation
    if (!body.name || !body.brand || !body.price || !body.main_image) {
      return NextResponse.json(
        { success: false, error: "Nama produk, brand, harga, dan gambar utama wajib diisi." },
        { status: 400 }
      );
    }

    // Validate affiliate URL
    const urlValidation = validateAffiliateUrl(body.affiliate_url);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { success: false, error: urlValidation.error },
        { status: 400 }
      );
    }

    let sanitizedTikTokUrl = undefined;
    if (body.tiktok_affiliate_url) {
      const tiktokVal = validateAffiliateUrl(body.tiktok_affiliate_url);
      if (!tiktokVal.isValid) {
        return NextResponse.json(
          { success: false, error: `TikTok Shop URL: ${tiktokVal.error}` },
          { status: 400 }
        );
      }
      sanitizedTikTokUrl = tiktokVal.sanitizedUrl;
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);

    const newProduct = await createProduct({
      product_code: body.product_code ? Number(body.product_code) : undefined as any,
      name: body.name,
      slug,
      short_description: body.short_description || "",
      full_description: body.full_description || "",
      brand: body.brand,
      audience: body.audience || "unisex",
      primary_category_id: body.primary_category_id,
      additional_category_ids: body.additional_category_ids || [],
      price: Number(body.price),
      original_price: body.original_price ? Number(body.original_price) : undefined,
      currency: "IDR",
      sizes: body.sizes || [],
      colors: body.colors || [],
      materials: body.materials || [],
      style_tags: body.style_tags || [],
      occasion_tags: body.occasion_tags || [],
      main_image: body.main_image,
      additional_images: body.additional_images || [],
      image_alt: body.image_alt || body.name,
      shopee_product_url: body.shopee_product_url || "",
      affiliate_url: urlValidation.sanitizedUrl!,
      tiktok_product_url: body.tiktok_product_url || "",
      tiktok_affiliate_url: sanitizedTikTokUrl,
      internal_notes: body.internal_notes || "",
      seo_title: body.seo_title || body.name,
      seo_description: body.seo_description || body.short_description,
      is_featured: Boolean(body.is_featured),
      is_editors_pick: Boolean(body.is_editors_pick),
      is_new_arrival: Boolean(body.is_new_arrival),
      status: body.status || "draft",
      price_verified_at: new Date().toISOString(),
      affiliate_url_verified_at: new Date().toISOString(),
      related_product_ids: body.related_product_ids || [],
      collection_ids: body.collection_ids || [],
    });

    await recordAuditLog(
      session.email,
      "CREATE_PRODUCT",
      "PRODUCT",
      newProduct.id,
      `Created product '${newProduct.name}'`
    );

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat produk baru." },
      { status: 500 }
    );
  }
}
