import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory, recordAuditLog } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";
import { slugify } from "@/lib/utils/formatters";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memuat kategori." },
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
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Nama kategori wajib diisi." },
        { status: 400 }
      );
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);

    const newCat = await createCategory({
      name: body.name,
      slug,
      type: body.type || "general",
      audience: body.audience || "all",
      description: body.description || "",
      display_order: Number(body.display_order) || 0,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      seo_title: body.seo_title,
      seo_description: body.seo_description,
    });

    await recordAuditLog(
      session.email,
      "CREATE_CATEGORY",
      "CATEGORY",
      newCat.id,
      `Created category '${newCat.name}'`
    );

    return NextResponse.json({ success: true, category: newCat });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal membuat kategori." },
      { status: 500 }
    );
  }
}
