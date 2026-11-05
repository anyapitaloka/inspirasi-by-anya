import { NextRequest, NextResponse } from "next/server";
import { getAffiliateAnalytics, getAuditLogs } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(sessionCookie);

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") || 30);

    const [analytics, auditLogs] = await Promise.all([
      getAffiliateAnalytics(days),
      getAuditLogs(),
    ]);

    return NextResponse.json({
      success: true,
      analytics,
      recentAuditLogs: auditLogs.slice(0, 15),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memuat analitik." },
      { status: 500 }
    );
  }
}
