"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, Sparkles, Tag } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/context";

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useWishlist();

  // Don't show public bottom nav if inside admin dashboard
  if (pathname.startsWith("/admin")) return null;

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Compass },
    { label: "Lookbook", href: "/lookbook", icon: Sparkles },
    { label: "Cari #Kode", href: "/shop?search=%23", icon: Tag },
    { label: "Saved", href: "/wishlist", icon: Heart, badge: count },
  ];

  return (
    <nav aria-label="Navigasi bawah mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-bordergray py-2 px-3 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors relative ${
              isActive ? "text-ink font-bold" : "text-coolgray hover:text-ink"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              {typeof item.badge === "number" && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-lime text-ink text-[9px] font-black rounded-full flex items-center justify-center border border-ink">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
