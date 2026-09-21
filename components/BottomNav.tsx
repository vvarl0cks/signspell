"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/practice/alphabet",
    label: "Alphabet",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.6}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 6h16M4 10h16M4 14h8" />
      </svg>
    ),
  },
  {
    href: "/practice/words",
    label: "Words",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.6}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/practice/reading",
    label: "Reading",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.6}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0
        flex items-stretch
        border-t border-[var(--border)]
        bg-[var(--void)]/95 backdrop-blur-sm
        pb-safe
        z-40
      "
      aria-label="Practice navigation"
    >
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            id={`bottom-nav-${tab.label.toLowerCase()}`}
            className={`
              flex-1 flex flex-col items-center justify-center
              gap-1 py-3 px-2
              min-h-[56px]
              font-mono-display text-[10px] font-semibold tracking-wide
              transition-all duration-200
              relative
              ${isActive
                ? "text-[var(--phosphor)]"
                : "text-[var(--ink-low)] active:text-[var(--ink-mid)]"
              }
            `}
          >
            {/* Active underline indicator */}
            {isActive && (
              <span
                className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full"
                style={{ background: "var(--phosphor)" }}
              />
            )}
            {tab.icon(isActive)}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
