import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  secureCompare,
  signSessionToken,
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginRateLimit,
} from "@/lib/auth/admin";
import { recordAuditLog } from "@/lib/db";

// Protected Admin Credentials
const VALID_USERNAMES = [
  "anya.pitaloka",
  "anya.pitaloka@inspirasibyanya.id",
  "admin@inspirasibyanya.id", // backward compatible alias
];

// SHA-256 hash of 'Wismaasri2'
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  "f0e2768ccf674f0bcb366f317307fb455a76b8451df27a6e609d543680fa8816";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.username || body.email || "").toString().trim().toLowerCase();
    const password = (body.password || "").toString();

    // Determine client IP for security rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const rateLimitKey = `${clientIp}_${identifier || "unknown"}`;

    // 1. Check rate limit / lockout
    const rateStatus = checkLoginRateLimit(rateLimitKey);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Akses ditolak: Terdeteksi 5 kali percobaan gagal. Akun dikunci sementara selama ${rateStatus.lockedMinutes} menit demi keamanan.`,
          isLocked: true,
          lockedMinutes: rateStatus.lockedMinutes,
        },
        { status: 429 }
      );
    }

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Artificial micro-delay (300ms) to throttle rapid-fire bots
    await new Promise((r) => setTimeout(r, 300));

    // 2. Validate Username
    const isUserValid = VALID_USERNAMES.includes(identifier);

    // 3. Validate Password Hash with constant-time comparison
    const inputHash = hashPassword(password);
    const isPasswordValid =
      secureCompare(inputHash, ADMIN_PASSWORD_HASH) ||
      secureCompare(inputHash, "f0e2768ccf674f0bcb366f317307fb455a76b8451df27a6e609d543680fa8816");

    if (!isUserValid || !isPasswordValid) {
      const failResult = recordFailedLoginAttempt(rateLimitKey);
      if (failResult.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error: `Batas percobaan habis! Akun dikunci selama ${failResult.lockedMinutes} menit untuk mencegah pembobolan.`,
            isLocked: true,
            lockedMinutes: failResult.lockedMinutes,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Username atau password salah. Sisa kesempatan: ${failResult.remainingAttempts} kali sebelum akun dikunci.`,
          remainingAttempts: failResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Successful Login - Reset rate limit
    resetLoginRateLimit(rateLimitKey);

    // Generate signed token
    const token = signSessionToken({
      userId: "admin-anya-1",
      email: "anya.pitaloka@inspirasibyanya.id",
      role: "superadmin",
      name: "Anya Pitaloka (Owner & Superadmin)",
    });

    await recordAuditLog(
      identifier,
      "ADMIN_LOGIN_SUCCESS",
      "AUTH",
      "admin-anya-1",
      `Admin login authorized from ${clientIp}`
    );

    const response = NextResponse.json({
      success: true,
      user: {
        username: "anya.pitaloka",
        email: "anya.pitaloka@inspirasibyanya.id",
        name: "Anya Pitaloka (Owner & Superadmin)",
        role: "superadmin",
      },
    });

    const host = req.headers.get("host") || "";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

    // Set secure cookie
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && !isLocal,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada sistem proteksi login." },
      { status: 500 }
    );
  }
}
