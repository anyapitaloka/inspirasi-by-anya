import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings, recordAuditLog } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memuat pengaturan." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(sessionCookie);

    if (!session || session.role !== "superadmin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Hanya superadmin yang dapat mengubah pengaturan situs." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updated = await updateSiteSettings(body);

    await recordAuditLog(
      session.email,
      "UPDATE_SITE_SETTINGS",
      "SETTINGS",
      "1",
      "Site settings updated"
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pengaturan situs." },
      { status: 500 }
    );
  }
}
