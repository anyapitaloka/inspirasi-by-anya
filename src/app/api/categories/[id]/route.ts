import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory, recordAuditLog } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(sessionCookie);

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateCategory(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan." },
        { status: 404 }
      );
    }

    await recordAuditLog(
      session.email,
      "UPDATE_CATEGORY",
      "CATEGORY",
      id,
      `Updated category '${updated.name}'`
    );

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kategori." },
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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const result = await deleteCategory(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    await recordAuditLog(
      session.email,
      "DELETE_CATEGORY",
      "CATEGORY",
      id,
      `Deleted category ID: ${id}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kategori." },
      { status: 500 }
    );
  }
}
