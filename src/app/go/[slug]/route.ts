import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug, recordAffiliateClick, getSiteSettings } from "@/lib/db";
import {
  validateAffiliateUrl,
  parseDeviceType,
  appendShopeeSubIds,
  appendTikTokShopSubIds,
  detectAffiliatePlatform,
} from "@/lib/affiliate/tracker";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);

    const platformParam = (searchParams.get("platform") || "shopee").toLowerCase();
    const sourcePage = searchParams.get("source") || "direct";
    const utmSource = searchParams.get("utm_source") || undefined;
    const utmMedium = searchParams.get("utm_medium") || undefined;
    const utmCampaign = searchParams.get("utm_campaign") || undefined;

    // 1. Fetch product from database
    const product = await getProductBySlug(slug);

    if (!product || product.status !== "published") {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="utf-8">
          <title>Produk Tidak Ditemukan | INSPIRASI BY ANYA</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, sans-serif; background: #F7F6F2; color: #1B1B1F; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
            .card { background: #fff; padding: 40px; border-radius: 20px; border: 1px solid #E7E5E1; max-width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            h1 { font-size: 20px; margin-bottom: 10px; }
            p { font-size: 14px; color: #85858D; margin-bottom: 24px; }
            a { display: inline-block; background: #1B1B1F; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Produk Belum Tersedia</h1>
            <p>Maaf, produk outfit ini belum dipublikasikan atau tautan affiliate sedang dalam peninjauan editor.</p>
            <a href="/shop">Jelajahi Outfit Lain</a>
          </div>
        </body>
        </html>`,
        {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    // 2. Select target affiliate URL (TikTok Shop vs Shopee)
    let targetRawUrl = product.affiliate_url;
    if (platformParam === "tiktok") {
      targetRawUrl = product.tiktok_affiliate_url || product.affiliate_url;
    }

    // 3. Validate affiliate URL & domain
    const settings = await getSiteSettings();
    const validation = validateAffiliateUrl(
      targetRawUrl,
      settings.approved_affiliate_domains
    );

    if (!validation.isValid || !validation.sanitizedUrl) {
      console.warn(
        `[SECURITY WARNING] Invalid affiliate URL for product ${slug}: ${targetRawUrl}`
      );
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="utf-8">
          <title>Tautan Tidak Valid | INSPIRASI BY ANYA</title>
          <style>
            body { font-family: -apple-system, sans-serif; background: #F7F6F2; color: #1B1B1F; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: #fff; padding: 32px; border-radius: 16px; border: 1px solid #E7E5E1; max-width: 380px; }
            a { display: inline-block; background: #1B1B1F; color: #fff; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 13px; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h3>Tautan Belum Terverifikasi</h3>
            <p style="color:#85858D;font-size:13px;">Tautan affiliate untuk produk ini tidak lolos verifikasi keamanan.</p>
            <a href="/shop">Kembali ke Katalog</a>
          </div>
        </body>
        </html>`,
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    // 4. Attach Platform-Specific Sub-IDs / UTM tracking
    const userAgent = req.headers.get("user-agent") || undefined;
    const referrer = req.headers.get("referer") || undefined;
    const device = parseDeviceType(userAgent);
    const resolvedPlatform =
      validation.platform || detectAffiliatePlatform(validation.sanitizedUrl);

    let finalDestinationUrl = validation.sanitizedUrl;
    if (resolvedPlatform === "tiktok") {
      finalDestinationUrl = appendTikTokShopSubIds(validation.sanitizedUrl, {
        source: sourcePage,
        device,
        productCode: product.product_code || product.id,
        campaign: utmCampaign,
      });
    } else {
      finalDestinationUrl = appendShopeeSubIds(validation.sanitizedUrl, {
        subId1: "inspirasibyanya",
        subId2: sourcePage,
        subId3: device,
        subId4: product.product_code ? `p${product.product_code}` : product.id,
        subId5: utmCampaign,
      });
    }

    try {
      await recordAffiliateClick({
        product_id: product.id,
        product_slug: product.slug,
        platform: resolvedPlatform,
        source_page: sourcePage,
        referrer,
        user_agent: userAgent?.substring(0, 255),
        device,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        destination_url: finalDestinationUrl,
      });
    } catch (trackError) {
      console.error("Non-fatal: Failed to log affiliate click:", trackError);
    }

    // 5. Safe 307 Temporary Redirect to validated destination with sub-IDs
    return NextResponse.redirect(finalDestinationUrl, {
      status: 307,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
    });
  } catch (error) {
    console.error("Fatal /go/[slug] redirect error:", error);
    return NextResponse.redirect(new URL("/shop", req.url));
  }
}
