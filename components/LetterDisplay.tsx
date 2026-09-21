"use client";

import { useEffect, useRef } from "react";

interface LetterDisplayProps {
  letter: string;
  isMotionGesture?: boolean;
  isSuccess?: boolean;
  letterIndex: number;
  totalLetters: number;
}

export default function LetterDisplay({
  letter,
  isMotionGesture = false,
  isSuccess = false,
  letterIndex,
  totalLetters,
}: LetterDisplayProps) {
  const letterRef = useRef<HTMLSpanElement>(null);
  const prevSuccessRef = useRef(false);

  useEffect(() => {
    if (isSuccess && !prevSuccessRef.current && letterRef.current) {
      letterRef.current.classList.remove("letter-flash");
      void letterRef.current.offsetWidth; // force reflow
      letterRef.current.classList.add("letter-flash");
    }
    prevSuccessRef.current = isSuccess;
  }, [isSuccess]);

  return (
    <div className="relative flex flex-col items-center justify-center py-4 px-4 select-none">
      {/* Retro grid background */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.3,
        }}
      />

      {/* Letter counter */}
      <p className="font-mono-display text-xs tracking-widest uppercase mb-2 z-10" style={{ color: "var(--ink-low)" }}>
        Letter {letterIndex + 1} of {totalLetters}
      </p>

      {/* Giant target letter */}
      <div className="relative z-10 mb-2">
        <span
          ref={letterRef}
          id="target-letter"
          className="font-mono-display font-bold text-[22vw] sm:text-[18vw] md:text-[12vw] lg:text-[10rem] xl:text-[12rem] leading-none tracking-tighter transition-colors duration-200"
          style={{ color: isSuccess ? "var(--phosphor)" : "var(--ink-high)" }}
        >
          {letter}
        </span>

        {isSuccess && (
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "var(--phosphor)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--void)" }}>
              <path fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Motion gesture badge */}
      {isMotionGesture && (
        <div
          className="z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "var(--amber-glow)", border: "1px solid var(--amber)" }}
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--amber)" }}>
            <path fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd" />
          </svg>
          <span className="font-mono-display text-xs font-medium" style={{ color: "var(--amber)" }}>
            Motion gesture — draw in the air
          </span>
        </div>
      )}

      {/* Scanline texture */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)",
        }}
      />
    </div>
  );
}
