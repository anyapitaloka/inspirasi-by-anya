import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifySessionToken } from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin session
    const token = req.cookies.get("admin_session")?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Anda harus login sebagai admin." },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan dalam permintaan." },
        { status: 400 }
      );
    }

    // 3. Validate image MIME type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
    if (!validMimes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      return NextResponse.json(
        { success: false, error: "Format file harus berupa gambar (JPG, PNG, atau WEBP)." },
        { status: 400 }
      );
    }

    // 4. Save file to public/images/lookbook
    const uploadDir = path.join(process.cwd(), "public", "images", "lookbook");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".jpg";
    const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 25);
    const fileName = `anya-${Date.now()}-${cleanName}${ext}`;
    const targetPath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/images/lookbook/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah foto. Pastikan ukuran file tidak melebihi 10MB." },
      { status: 500 }
    );
  }
}
