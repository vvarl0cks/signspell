"use client";

import { useEffect, useState } from "react";

interface ASLHandshapeSVGProps {
  letter: string;
  className?: string;
  size?: number | string;
}

// In-memory cache for fetched SVG files so each letter is only requested once
const svgCache = new Map<string, string>();

/**
 * ASLHandshapeSVG Component
 * Renders official Gallaudet public-domain ASL handshape SVG illustrations
 * from `public/asl-handshape-refs/{letter}.svg`.
 *
 * Inlines the SVG so theme CSS variables (`var(--phosphor)`, `var(--panel)`,
 * `currentColor`) automatically recolor the strokes and fills when switching
 * between Light and Dark mode.
 */
export default function ASLHandshapeSVG({
  letter,
  className = "",
  size = 120,
}: ASLHandshapeSVGProps) {
  const lower = letter.toLowerCase();
  const [svgContent, setSvgContent] = useState<string | null>(
    svgCache.get(lower) ?? null
  );

  useEffect(() => {
    if (svgCache.has(lower)) {
      setSvgContent(svgCache.get(lower)!);
      return;
    }

    let isMounted = true;
    fetch(`/asl-handshape-refs/${lower}.svg`)
      .then((res) => {
        if (!res.ok) throw new Error("SVG fetch failed");
        return res.text();
      })
      .then((text) => {
        if (isMounted) {
          svgCache.set(lower, text);
          setSvgContent(text);
        }
      })
      .catch((err) => {
        console.warn(`Could not load ASL SVG for letter ${letter}:`, err);
      });

    return () => {
      isMounted = false;
    };
  }, [lower, letter]);

  return (
    <div
      className={`inline-flex items-center justify-center text-[var(--phosphor)] asl-handshape-container ${className}`}
      style={{ width: size, height: size }}
      aria-label={`ASL Handshape diagram for letter ${letter.toUpperCase()}`}
    >
      {svgContent ? (
        <div
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block text-[var(--phosphor)]"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono-display text-2xl font-bold border border-[var(--border)] rounded-xl bg-[var(--panel)] text-[var(--phosphor)]">
          {letter.toUpperCase()}
        </div>
      )}
    </div>
  );
}
