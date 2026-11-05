import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | INSPIRASI BY ANYA",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  const session = verifySessionToken(sessionCookie);

  // If on login route or not logged in, let children handle it or redirect
  // Note: we'll create a nested layout or check if session exists.
  return (
    <div className="min-h-screen bg-ivory flex">
      {session ? (
        <>
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <header className="h-16 bg-white border-b border-bordergray px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-coolgray uppercase tracking-wider">
                  Admin Panel
                </span>
                <span className="text-coolgray">/</span>
                <span className="text-xs font-bold text-ink">Control Center</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-mint text-ink">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                  {session.name} ({session.role})
                </span>
              </div>
            </header>
            <main className="flex-1 p-6 sm:p-10">{children}</main>
          </div>
        </>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </div>
  );
}
