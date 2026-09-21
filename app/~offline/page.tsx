import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline | SignSpell",
};

export default function OfflinePage() {
  return (
    <main className="min-h-dvh bg-void flex flex-col items-center justify-center px-6 pt-safe pb-safe">
      <div className="flex flex-col items-center text-center gap-6 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-panel border border-border flex items-center justify-center">
          <svg className="w-8 h-8 text-ink-low" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3l18 18M8.111 8.111A5.5 5.5 0 0012 7c3.036 0 5.5 2.464 5.5 5.5 0 1.457-.564 2.782-1.483 3.767M5.083 9.5C4.389 10.443 4 11.626 4 12.5a8 8 0 0010.67 7.53M6.53 6.53A9.985 9.985 0 0012 5c5.523 0 10 4.477 10 10a9.984 9.984 0 01-1.536 5.33" />
          </svg>
        </div>
        <div>
          <h1 className="font-mono-display font-bold text-ink-high text-2xl mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-ink-mid text-sm leading-relaxed">
            SignSpell needs a connection to load the hand tracking model.
            Connect to the internet and try again.
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-mono-display font-semibold text-sm border border-border text-ink-high hover:border-phosphor hover:text-phosphor transition-all duration-200 active:scale-95"
        >
          Try Again
        </Link>
      </div>
    </main>
  );
}
