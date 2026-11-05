import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/lib/wishlist/context";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { getSiteSettings } from "@/lib/db";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      template: `%s | ${settings.brand_name}`,
      default: `${settings.brand_name} — Gen Z Fashion Discovery & Shopee Finds`,
    },
    description: settings.description,
    keywords: [
      "fashion Gen Z",
      "OOTD",
      "outfit inspiration",
      "shopee fashion",
      "clean fit",
      "streetwear indonesia",
      "korean outfit",
      "affiliate fashion",
    ],
    authors: [{ name: "Anya Pitaloka" }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    openGraph: {
      title: `${settings.brand_name} — Your Next Fit Starts Here`,
      description: settings.description,
      siteName: settings.brand_name,
      locale: "id_ID",
      type: "website",
    },
    icons: {
      icon: "/logo-compact.svg",
      apple: "/logo-compact.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="id" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-ivory text-ink antialiased selection:bg-lime selection:text-ink">
        <WishlistProvider>
          <AnnouncementBar
            text={settings.announcement_bar_text}
            link={settings.announcement_bar_link}
            enabled={settings.announcement_bar_enabled}
          />
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </WishlistProvider>
      </body>
    </html>
  );
}
