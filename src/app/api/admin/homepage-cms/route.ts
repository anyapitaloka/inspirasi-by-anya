import { NextRequest, NextResponse } from "next/server";
import {
  getHomepageSections,
  saveHomepageSections,
  getBanners,
  saveBanners,
  recordAuditLog,
} from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    const [sections, banners] = await Promise.all([
      getHomepageSections(),
      getBanners(),
    ]);
    return NextResponse.json({ success: true, sections, banners });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memuat CMS." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(sessionCookie);

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (Array.isArray(body.sections)) {
      await saveHomepageSections(body.sections);
    }

    if (Array.isArray(body.banners)) {
      await saveBanners(body.banners);
    }

    await recordAuditLog(
      session.email,
      "UPDATE_HOMEPAGE_CMS",
      "CMS",
      "homepage",
      "Updated homepage sections and banners"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/homepage-cms error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan perubahan CMS." },
      { status: 500 }
    );
  }
}
