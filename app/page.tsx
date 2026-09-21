"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useLanguage } from "@/components/LanguageProvider";

const FEATURES = [
  { icon: "📱", labelEn: "Mobile-first", descEn: "Front camera optimized", labelId: "Optimal HP", descId: "Optimasi kamera depan" },
  { icon: "🖥️", labelEn: "Desktop ready", descEn: "Webcam supported", labelId: "PC & Webcam", descId: "Dukungan webcam PC" },
  { icon: "🤚", labelEn: "Hand tracking", descEn: "MediaPipe AI", labelId: "Pelacakan Tangan", descId: "AI MediaPipe" },
  { icon: "⚡", labelEn: "Real-time", descEn: "60 fps detection", labelId: "Real-time", descId: "Deteksi 60 fps" },
];

export default function HomePage() {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const MODES = [
    { href: "/practice/alphabet", label: t.modeAlphabetTitle, desc: t.modeAlphabetDesc, icon: "🔤" },
    { href: "/practice/words", label: t.modeWordsTitle, desc: t.modeWordsDesc, icon: "📝" },
    { href: "/practice/reading", label: t.modeReadingTitle, desc: t.modeReadingDesc, icon: "📖" },
  ];

  return (
    <div className="min-h-dvh bg-[var(--void)] flex flex-col">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orb */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--phosphor-glow) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-7 w-full my-auto">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2 pulse-glow"
              style={{ background: "var(--panel)", border: "1px solid var(--phosphor)", opacity: 0.9 }}
            >
              <span className="font-mono-display font-bold text-3xl tracking-tighter" style={{ color: "var(--phosphor)" }}>
                SS
              </span>
            </div>
            <h1 className="font-mono-display font-bold text-5xl sm:text-6xl tracking-tighter leading-none" style={{ color: "var(--ink-high)" }}>
              {t.heroTitle1}<span className="glow-text" style={{ color: "var(--phosphor)" }}>{t.heroTitle2}</span>
            </h1>
            <p className="font-mono-display text-xs tracking-widest uppercase mt-1" style={{ color: "var(--ink-low)" }}>
              {t.heroSubtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed max-w-sm" style={{ color: "var(--ink-mid)" }}>
            {t.heroDesc}
          </p>

          {/* Practice mode cards */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {MODES.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                id={`mode-${m.label.toLowerCase()}`}
                className="p-3 rounded-xl flex flex-col items-center gap-1.5 text-center border transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="font-mono-display font-semibold text-xs" style={{ color: "var(--ink-high)" }}>
                  {m.label}
                </span>
                <span className="font-mono-display text-[10px]" style={{ color: "var(--ink-low)" }}>
                  {m.desc}
                </span>
              </Link>
            ))}
          </div>

          {/* Feature chips */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-xl text-left border"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="font-mono-display font-semibold text-xs" style={{ color: "var(--ink-high)" }}>
                  {isEn ? f.labelEn : f.labelId}
                </div>
                <div className="font-mono-display text-xs mt-0.5" style={{ color: "var(--ink-low)" }}>
                  {isEn ? f.descEn : f.descId}
                </div>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col gap-3 w-full">
            <Link
              href="/practice/alphabet"
              id="start-practice-btn"
              className="w-full py-4 rounded-2xl font-mono-display font-bold text-lg text-center transition-all duration-200 active:scale-95"
              style={{
                background: "var(--phosphor)",
                color: "var(--void)",
                boxShadow: "0 0 20px var(--phosphor-glow)",
              }}
            >
              {t.startPractice}
            </Link>
            <p className="font-mono-display text-xs" style={{ color: "var(--ink-low)" }}>
              {t.noAccountNeeded}
            </p>
          </div>

          {/* Footer Attribution & GitHub Link */}
          <div className="flex flex-col items-center gap-3 pt-6 border-t border-[var(--border)]/40 w-full text-center">
            <p className="text-[11px] leading-relaxed text-[var(--ink-low)] max-w-md">
              {t.footerAttribution}{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:Asl_alphabet_gallaudet_ann.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--phosphor)] transition-colors"
              >
                &quot;Asl alphabet gallaudet ann.svg&quot;
              </a>{" "}
              (Public Domain).
            </p>
            <a
              href="https://github.com/vvarl0cks"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="
                px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)]
                text-[var(--ink-mid)] hover:text-[var(--phosphor)] hover:border-[var(--phosphor)]
                transition-all duration-200 active:scale-90 flex items-center gap-2
                font-mono-display text-xs font-semibold
              "
            >
              <GithubIcon className="w-5 h-5" />
              <span>vvarl0cks</span>
            </a>
          </div>
        </div>

        <div
          className="absolute top-4 right-4 font-mono-display text-xs tracking-widest opacity-40 hidden sm:block"
          style={{ color: "var(--ink-low)" }}
        >
          v2.5 / Phase 2
        </div>
      </main>
    </div>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
