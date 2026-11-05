import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct, recordAuditLog } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";
import { validateAffiliateUrl } from "@/lib/affiliate/tracker";
import { slugify } from "@/lib/utils/formatters";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data produk." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(sessionCookie);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const body = await req.json();

    // If affiliate_url is changed, validate it
    let sanitizedAffiliateUrl = body.affiliate_url;
    if (body.affiliate_url) {
      const validation = validateAffiliateUrl(body.affiliate_url);
      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }
      sanitizedAffiliateUrl = validation.sanitizedUrl;
    }

    let sanitizedTikTokUrl = body.tiktok_affiliate_url;
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

    const updates = {
      ...body,
      affiliate_url: sanitizedAffiliateUrl,
      tiktok_affiliate_url: sanitizedTikTokUrl,
      slug: body.slug ? slugify(body.slug) : undefined,
    };

    const updated = await updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan untuk diperbarui." },
        { status: 404 }
      );
    }

    await recordAuditLog(
      session.email,
      "UPDATE_PRODUCT",
      "PRODUCT",
      id,
      `Updated product '${updated.name}'`
    );

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui produk." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(sessionCookie);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const product = await getProductById(id);
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan untuk dihapus." },
        { status: 404 }
      );
    }

    await recordAuditLog(
      session.email,
      "DELETE_PRODUCT",
      "PRODUCT",
      id,
      `Deleted product '${product?.name || id}'`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus produk." },
      { status: 500 }
    );
  }
}
