"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  Sparkles,
  Sliders,
  LogOut,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Logo } from "../brand/Logo";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      window.location.href = "/admin/login";
    }
  };

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Katalog Produk (899)", href: "/admin/products", icon: Shirt },
    { label: "Lookbook & OOTD", href: "/admin/lookbooks", icon: Sparkles },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Homepage CMS", href: "/admin/homepage-cms", icon: Sliders },
    { label: "Site Settings", href: "/admin/settings", icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-ink text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-ink-light">
      <div className="p-6 space-y-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Logo variant="compact" linkToHome={false} />
            <div>
              <span className="font-extrabold text-sm tracking-wider block">
                ANYA ADMIN
              </span>
              <span className="text-[10px] text-lime font-bold uppercase tracking-widest block">
                Affiliate Control
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-coolgray block mb-2 px-3">
            Management
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-lime text-ink shadow-sm"
                    : "text-coolgray hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/10 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-coolgray hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </span>
          <span className="text-[10px] text-mint">Live</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
