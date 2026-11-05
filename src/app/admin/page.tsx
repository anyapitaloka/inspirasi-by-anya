import React from "react";
import Link from "next/link";
import {
  Shirt,
  FolderTree,
  MousePointerClick,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";
import { getAffiliateAnalytics, getAuditLogs } from "@/lib/db";
import { formatDateIndo } from "@/lib/utils/formatters";

export default async function AdminDashboardOverview() {
  const [analytics, auditLogs] = await Promise.all([
    getAffiliateAnalytics(30),
    getAuditLogs(),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-coolgray mt-1">
            Ringkasan performa katalog, trafik affiliate Shopee, dan pembaruan konten.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-white text-xs font-bold rounded-xl hover:bg-ink-light transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-lime" />
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Published Products */}
        <div className="p-6 rounded-2xl bg-white border border-bordergray shadow-sm space-y-2">
          <div className="flex items-center justify-between text-coolgray">
            <span className="text-xs font-bold uppercase tracking-wider">
              Produk Published
            </span>
            <Shirt className="w-4 h-4 text-ink" />
          </div>
          <div className="text-3xl font-black text-ink">
            {analytics.publishedProductsCount}
          </div>
          <div className="text-[11px] text-coolgray">
            +{analytics.draftProductsCount} produk dalam status draft
          </div>
        </div>

        {/* Active Categories */}
        <div className="p-6 rounded-2xl bg-white border border-bordergray shadow-sm space-y-2">
          <div className="flex items-center justify-between text-coolgray">
            <span className="text-xs font-bold uppercase tracking-wider">
              Kategori Aktif
            </span>
            <FolderTree className="w-4 h-4 text-ink" />
          </div>
          <div className="text-3xl font-black text-ink">
            {analytics.categoriesCount}
          </div>
          <div className="text-[11px] text-coolgray">
            Women, Men, Unisex, Style, Budget
          </div>
        </div>

        {/* Total Affiliate Clicks */}
        <div className="p-6 rounded-2xl bg-white border border-bordergray shadow-sm space-y-2">
          <div className="flex items-center justify-between text-coolgray">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Klik Shopee (30 Hari)
            </span>
            <MousePointerClick className="w-4 h-4 text-lime-dark" />
          </div>
          <div className="text-3xl font-black text-ink">
            {analytics.totalClicks}
          </div>
          <div className="text-[11px] text-coolgray">
            Outbound redirect aman ke Shopee
          </div>
        </div>

        {/* Clicks Today */}
        <div className="p-6 rounded-2xl bg-white border border-bordergray shadow-sm space-y-2">
          <div className="flex items-center justify-between text-coolgray">
            <span className="text-xs font-bold uppercase tracking-wider">
              Klik Hari Ini
            </span>
            <Calendar className="w-4 h-4 text-mint-dark" />
          </div>
          <div className="text-3xl font-black text-ink">
            {analytics.clicksToday}
          </div>
          <div className="text-[11px] text-coolgray">
            Real-time tracking via /go/[slug]
          </div>
        </div>
      </div>

      {/* Analytics Drilldown: Top Products & Click Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Clicked Products */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bordergray">
            <h2 className="font-extrabold text-sm text-ink flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-ink" />
              Produk Paling Sering Diklik (Shopee)
            </h2>
            <span className="text-[11px] text-coolgray">30 Hari Terakhir</span>
          </div>

          {analytics.topProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-coolgray">
              Belum ada data klik outbound. Klik tombol Shopee pada katalog publik untuk mulai merekam.
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.topProducts.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-ivory text-xs"
                >
                  <div className="font-bold text-ink truncate max-w-[280px]">
                    {idx + 1}. {item.name}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-lime text-ink font-extrabold text-[11px]">
                    {item.count} klik
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Click Timeline (Last 7 Days) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bordergray">
            <h2 className="font-extrabold text-sm text-ink flex items-center gap-2">
              <Calendar className="w-4 h-4 text-ink" />
              Tren Klik 7 Hari Terakhir
            </h2>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4 items-end h-36">
            {analytics.timeline.map((t, idx) => {
              const maxVal = Math.max(...analytics.timeline.map((x) => x.clicks), 5);
              const heightPct = Math.round((t.clicks / maxVal) * 100);

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-ink">{t.clicks}</span>
                  <div
                    style={{ height: `${Math.max(heightPct, 8)}%` }}
                    className="w-full rounded-t-lg bg-lime transition-all"
                  />
                  <span className="text-[9px] text-coolgray truncate w-full text-center">
                    {t.date.split("-").slice(1).join("/")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audit Log / Activity Trail */}
      <div className="bg-white p-6 rounded-2xl border border-bordergray shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-bordergray">
          <h2 className="font-extrabold text-sm text-ink flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink" />
            Aktivitas Administrasi Terbaru (Audit Log)
          </h2>
          <span className="text-xs text-coolgray">{auditLogs.length} Aktivitas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-coolgray border-b border-bordergray uppercase font-bold text-[10px]">
                <th className="pb-2.5">Waktu</th>
                <th className="pb-2.5">Admin</th>
                <th className="pb-2.5">Aksi</th>
                <th className="pb-2.5">Entitas</th>
                <th className="pb-2.5">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordergray/60 font-medium text-ink">
              {auditLogs.slice(0, 8).map((log) => (
                <tr key={log.id} className="hover:bg-ivory/50">
                  <td className="py-2.5 text-coolgray">{formatDateIndo(log.timestamp)}</td>
                  <td className="py-2.5">{log.admin_email}</td>
                  <td className="py-2.5 font-bold">
                    <span className="px-2 py-0.5 rounded bg-ivory text-ink border border-bordergray">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 text-coolgray">{log.entity}</td>
                  <td className="py-2.5 text-coolgray">{log.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
