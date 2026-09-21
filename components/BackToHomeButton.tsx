"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

interface BackToHomeButtonProps {
  className?: string;
}

export default function BackToHomeButton({ className = "" }: BackToHomeButtonProps) {
  const { t } = useLanguage();

  return (
    <Link
      href="/"
      id="back-to-home-btn"
      className={`
        inline-flex items-center gap-2
        px-3.5 py-1.5 rounded-xl
        border border-[var(--border)]
        bg-[var(--panel)]
        text-[var(--ink-mid)] hover:text-[var(--ink-high)]
        hover:border-[var(--phosphor)]
        transition-all duration-200
        active:scale-95
        font-mono-display text-xs font-semibold
        shadow-sm
        ${className}
      `}
    >
      <span>←</span>
      <span>{t.backToHome}</span>
    </Link>
  );
}
