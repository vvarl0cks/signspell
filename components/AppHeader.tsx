"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useHandPreference } from "@/components/HandPreferenceProvider";
import { useLanguage } from "@/components/LanguageProvider";

interface AppHeaderProps {
  /** Optional right-side status indicator (tracker loading, live, error) */
  statusNode?: React.ReactNode;
}

export default function AppHeader({ statusNode }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { handPreference, openChoiceModal } = useHandPreference();
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavLinks = [
    { href: "/", label: t.navHome },
    { href: "/practice/alphabet", label: t.navAlphabet },
    { href: "/practice/words", label: t.navWords },
    { href: "/practice/reading", label: t.navReading },
    { href: "/about", label: t.navAbout },
    { href: "/use-cases", label: t.navUseCases },
    { href: "/terms", label: t.navTerms },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--void)]/95 backdrop-blur-md border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto">
        {/* ── Left: Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2 group flex-shrink-0"
          aria-label="SignSpell home"
        >
          <div
            className="
              w-8 h-8 rounded-lg
              flex items-center justify-center
              border border-[var(--border)]
              bg-[var(--panel)]
              group-hover:border-[var(--phosphor)]
              transition-colors duration-200
            "
          >
            <span className="font-mono-display font-bold text-[var(--phosphor)] text-sm leading-none">
              SS
            </span>
          </div>
          <span className="font-mono-display text-[var(--ink-mid)] text-xs tracking-widest uppercase hidden sm:block">
            SignSpell
          </span>
        </Link>

        {/* ── Center: Full Menubar (Desktop) ── */}
        <nav
          className="hidden md:flex items-center gap-1 overflow-x-auto py-0.5"
          aria-label="Main menubar"
        >
          {mainNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-2.5 py-1.5 rounded-lg
                  font-mono-display text-xs font-semibold
                  transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-[var(--phosphor)] text-[var(--void)] shadow-sm"
                      : "text-[var(--ink-mid)] hover:text-[var(--ink-high)] hover:bg-[var(--panel)]"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Status + Hand + Language + Theme + Mobile Menu ── */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Status slot */}
          {statusNode && <div className="hidden lg:block">{statusNode}</div>}

          {/* Language Toggle Button */}
          <button
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            aria-label={`Switch language. Current: ${language.toUpperCase()}`}
            title={language === "en" ? "Switch to Bahasa Indonesia" : "Switch to English"}
            className="
              h-9 px-2.5 rounded-lg
              flex items-center gap-1.5
              border border-[var(--border)]
              bg-[var(--panel)]
              text-[var(--ink-high)]
              hover:border-[var(--phosphor)]
              transition-all duration-200
              active:scale-95
              font-mono-display text-xs font-semibold
            "
          >
            <span>{language === "en" ? "🇺🇸" : "🇮🇩"}</span>
            <span className="uppercase text-[10px] tracking-wide font-bold">
              {language.toUpperCase()}
            </span>
          </button>

          {/* Hand Preference Settings Button */}
          <button
            id="hand-pref-toggle-btn"
            onClick={openChoiceModal}
            aria-label="Signing hand preference"
            title={`Signing hand preference: ${handPreference} hand (click to change)`}
            className="
              h-9 px-2.5 rounded-lg
              flex items-center gap-1
              border border-[var(--border)]
              bg-[var(--panel)]
              text-[var(--ink-mid)]
              hover:text-[var(--ink-high)]
              hover:border-[var(--phosphor)]
              transition-all duration-200
              active:scale-95
              font-mono-display text-xs font-semibold
            "
          >
            <span>{handPreference === "left" ? "🖐️" : "✋"}</span>
            <span className="uppercase text-[10px] tracking-wide text-[var(--phosphor)] font-bold">
              {handPreference === "left" ? "L" : "R"}
            </span>
          </button>

          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="
              w-9 h-9 rounded-lg
              flex items-center justify-center
              border border-[var(--border)]
              text-[var(--ink-mid)]
              hover:text-[var(--ink-high)]
              hover:border-[var(--phosphor)]
              transition-all duration-200
              active:scale-95
            "
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="
              md:hidden w-9 h-9 rounded-lg
              flex items-center justify-center
              border border-[var(--border)]
              text-[var(--ink-mid)]
              hover:text-[var(--ink-high)]
              hover:border-[var(--phosphor)]
              transition-all duration-200
            "
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] p-3 slide-up space-y-1">
          {mainNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-3 py-2 rounded-lg font-mono-display text-xs font-semibold
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-[var(--phosphor)] text-[var(--void)]"
                      : "text-[var(--ink-high)] hover:bg-[var(--panel)]"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

// ── Tracker status helper ───────────────────────────────────────────────────
interface TrackerStatusProps {
  isLoading: boolean;
  isLoaded: boolean;
  loadError: string | null;
}

export function TrackerStatus({ isLoading, isLoaded, loadError }: TrackerStatusProps) {
  const { t } = useLanguage();

  if (isLoading) return (
    <span className="font-mono-display text-[var(--ink-low)] text-xs animate-pulse">
      {t.trackerLoading}
    </span>
  );
  if (loadError) return (
    <span className="font-mono-display text-[var(--danger)] text-xs">
      {t.trackerError}
    </span>
  );
  if (isLoaded) return (
    <span className="font-mono-display text-xs" style={{ color: "var(--phosphor)", opacity: 0.85 }}>
      ● {t.trackerLive}
    </span>
  );
  return null;
}

// ── Inline Icons ────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
