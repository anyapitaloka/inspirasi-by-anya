import { NextRequest, NextResponse } from "next/server";

/**
 * Edge-compatible quick token format & expiration inspector
 */
function isSessionCookieValid(token?: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [encodedData, signature] = parts;
  if (!encodedData || !signature) return false;

  try {
    // Decode base64url safely in Edge Runtime
    const base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return false; // Expired
    }

    if (!payload.userId || !payload.role) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow login pages and public login API
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Protect Admin Web Routes (/admin, /admin/products, /admin/categories, etc.)
  if (pathname.startsWith("/admin")) {
    const sessionToken = req.cookies.get("admin_session")?.value;
    const isValid = isSessionCookieValid(sessionToken);

    if (!isValid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Protect Admin API Routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    const sessionToken = req.cookies.get("admin_session")?.value;
    const isValid = isSessionCookieValid(sessionToken);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Anda harus login sebagai admin terlebih dahulu." },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
