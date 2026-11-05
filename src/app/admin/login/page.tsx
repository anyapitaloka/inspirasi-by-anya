"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.isLocked) {
          setIsLocked(true);
        }
        setError(data.error || "Gagal login. Periksa username dan password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi gangguan koneksi jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-12 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo variant="primary" linkToHome={false} />
          </div>
          <h1 className="text-2xl font-black text-ink tracking-tight">
            Portal Admin Terproteksi
          </h1>
          <p className="text-xs text-stone-500">
            Akses khusus kurator & pengelola katalog INSPIRASI BY ANYA.
          </p>
        </div>

        {/* Security Shield Indicator */}
        <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Proteksi Aktif:</strong> Rate limit & anti brute-force otomatis aktif (maks. 5 percobaan).
          </span>
        </div>

        {error && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            isLocked
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-amber-50 border-amber-300 text-amber-800"
          }`}>
            {isLocked ? (
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            )}
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink block">
              Username Admin
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={isLocked || loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin..."
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-ink focus:bg-white font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                disabled={isLocked || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-ink focus:bg-white font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-3.5 bg-ink text-white font-bold text-sm rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Memverifikasi Keamanan..." : isLocked ? "Akun Terkunci Sementara" : "Masuk ke Dashboard"}</span>
            <ArrowRight className="w-4 h-4 text-lime" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-400">
            Sistem mencatat alamat IP dan aktivitas login secara otomatis untuk kepatuhan keamanan.
          </p>
        </div>
      </div>
    </div>
  );
}
