import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "primary" | "compact";
  className?: string;
  linkToHome?: boolean;
}

export function Logo({
  variant = "primary",
  className = "",
  linkToHome = true,
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {variant === "compact" ? (
        <div className="relative w-9 h-9 rounded-xl bg-ink p-1.5 flex items-center justify-center shadow-sm">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 20V44"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M30 44L38 20L46 44"
              stroke="#D8F36A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M33 36H43"
              stroke="#D8F36A"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M48 10L49.5 13.5L53 15L49.5 16.5L48 20L46.5 16.5L43 15L46.5 13.5L48 10Z"
              fill="#B9A7F2"
            />
          </svg>
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-ink flex items-center justify-center shadow-sm">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 22V42"
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M32 42L39 22L46 42"
                stroke="#D8F36A"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M35 34H43"
                stroke="#D8F36A"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 tracking-tight">
            <span className="font-extrabold text-lg tracking-wider text-ink">
              INSPIRASI
            </span>
            <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-mint text-ink uppercase">
              BY ANYA
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
