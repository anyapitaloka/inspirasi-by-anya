import { NextRequest, NextResponse } from "next/server";
import { updateLookbook, deleteLookbook, recordAuditLog, getLookbooks } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updateLookbook(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Lookbook tidak ditemukan." },
        { status: 404 }
      );
    }

    await recordAuditLog(
      session.email,
      "UPDATE_LOOKBOOK",
      "LOOKBOOK",
      id,
      `Lookbook updated: "${updated.title}"`
    );

    return NextResponse.json({ success: true, lookbook: updated });
  } catch (error) {
    console.error("Failed to update lookbook:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data lookbook." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const ok = await deleteLookbook(id);

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Lookbook tidak ditemukan atau gagal dihapus." },
        { status: 404 }
      );
    }

    await recordAuditLog(
      session.email,
      "DELETE_LOOKBOOK",
      "LOOKBOOK",
      id,
      `Lookbook deleted ID: ${id}`
    );

    return NextResponse.json({ success: true, message: "Lookbook berhasil dihapus." });
  } catch (error) {
    console.error("Failed to delete lookbook:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus lookbook." },
      { status: 500 }
    );
  }
}
