import { NextRequest, NextResponse } from "next/server";
import { getLookbooks, createLookbook, recordAuditLog } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    const lookbooks = await getLookbooks();
    return NextResponse.json({ success: true, lookbooks });
  } catch (error) {
    console.error("Failed to get lookbooks:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data lookbook." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      summary,
      cover_image,
      audience = "women",
      style_tags = ["Daily Wear"],
      occasion = "Casual",
      vibe_description = "",
      product_ids = [],
      hotspots = [],
      is_published = true,
    } = body;

    if (!title || !cover_image) {
      return NextResponse.json(
        { success: false, error: "Judul dan foto lookbook wajib diisi." },
        { status: 400 }
      );
    }

    const cleanSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newLookbook = await createLookbook({
      title,
      slug: cleanSlug,
      summary: summary || title,
      cover_image,
      audience,
      style_tags,
      occasion,
      vibe_description: vibe_description || summary || title,
      product_ids,
      hotspots,
      is_published,
    });

    await recordAuditLog(
      session.email,
      "CREATE_LOOKBOOK",
      "LOOKBOOK",
      newLookbook.id,
      `Lookbook created: "${newLookbook.title}"`
    );

    return NextResponse.json({ success: true, lookbook: newLookbook });
  } catch (error) {
    console.error("Failed to create lookbook:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan lookbook baru." },
      { status: 500 }
    );
  }
}
