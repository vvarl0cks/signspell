"use client";

import { type HandPreference } from "@/lib/handPreference";

interface PredictionPanelProps {
  predictedLetter: string | null;
  confidence: number;
  consecutiveCount: number;
  streakRequired: number;
  isMatch: boolean;
  isAccepted: boolean;
  targetLetter: string;
  isMotionGesture?: boolean;
  detectedHandedness?: HandPreference | null;
  isHandMismatch?: boolean;
  handPreference?: HandPreference;
  onOpenHandSettings?: () => void;
}

export default function PredictionPanel({
  predictedLetter,
  confidence,
  consecutiveCount,
  streakRequired,
  isMatch,
  isAccepted,
  targetLetter,
  isMotionGesture = false,
  detectedHandedness,
  isHandMismatch = false,
  handPreference,
  onOpenHandSettings,
}: PredictionPanelProps) {
  const confidencePct = Math.round(confidence * 100);

  if (isMotionGesture) {
    return (
      <div
        className="flex items-center gap-3 p-4 rounded-xl border"
        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
          style={{ background: "var(--amber-glow)", borderColor: "var(--amber)" }}
        >
          <span className="font-mono-display font-bold text-lg" style={{ color: "var(--amber)" }}>
            {targetLetter}
          </span>
        </div>
        <div>
          <p className="font-mono-display font-semibold text-sm" style={{ color: "var(--ink-high)" }}>Motion Gesture</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--ink-mid)" }}>
            {targetLetter === "J"
              ? 'Draw a "J" shape downward with your pinky'
              : 'Draw a "Z" shape with your index finger'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-xl border transition-all duration-300 relative"
      style={{
        background: isAccepted
          ? "color-mix(in srgb, var(--phosphor) 8%, var(--panel))"
          : "var(--panel)",
        borderColor: isAccepted
          ? "var(--phosphor)"
          : isMatch
          ? "color-mix(in srgb, var(--phosphor) 30%, var(--border))"
          : "var(--border)",
        boxShadow: isAccepted ? "0 0 12px var(--phosphor-glow)" : "none",
      }}
    >
      {/* Hand Mismatch Warning Pill */}
      {isHandMismatch && detectedHandedness && handPreference && (
        <div
          className="
            flex items-center justify-between gap-2 p-2 rounded-lg
            bg-[var(--amber-glow)] border border-[var(--amber)]
            text-xs font-mono-display text-[var(--amber)]
            slide-up
          "
        >
          <div className="flex items-center gap-1.5 leading-tight">
            <span>⚠️</span>
            <span>
              Detected <strong className="capitalize">{detectedHandedness}</strong> hand — you selected <strong className="capitalize">{handPreference}</strong>
            </span>
          </div>
          {onOpenHandSettings && (
            <button
              onClick={onOpenHandSettings}
              className="
                px-2 py-0.5 rounded bg-[var(--amber)] text-[var(--void)]
                font-bold text-[10px] uppercase tracking-wide
                hover:opacity-90 active:scale-95 transition-all flex-shrink-0
              "
            >
              Change
            </button>
          )}
        </div>
      )}

      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="font-mono-display text-xs tracking-widest uppercase" style={{ color: "var(--ink-low)" }}>
          Detected
        </span>
        <div className="flex items-center gap-2">
          {isAccepted && (
            <span className="font-mono-display text-xs font-semibold animate-pulse" style={{ color: "var(--phosphor)" }}>
              ✓ HELD
            </span>
          )}
          <span
            id="prediction-letter"
            className="font-mono-display font-bold text-3xl leading-none transition-all duration-150"
            style={{ color: isAccepted || isMatch ? "var(--phosphor)" : "var(--ink-mid)" }}
          >
            {predictedLetter ?? "—"}
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="font-mono-display text-xs" style={{ color: "var(--ink-low)" }}>Confidence</span>
          <span
            className="font-mono-display text-xs font-semibold"
            style={{ color: confidencePct >= 82 ? "var(--phosphor)" : "var(--ink-mid)" }}
          >
            {predictedLetter ? `${confidencePct}%` : "—"}
          </span>
        </div>
        <div className="confidence-bar">
          <div
            className="confidence-bar-fill"
            style={{ width: predictedLetter ? `${confidencePct}%` : "0%" }}
          />
        </div>
      </div>

      {/* Streak dots */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="font-mono-display text-xs" style={{ color: "var(--ink-low)" }}>Hold streak</span>
          <span className="font-mono-display text-xs" style={{ color: "var(--ink-low)" }}>
            {consecutiveCount}/{streakRequired}
          </span>
        </div>
        <div className="flex gap-1" aria-label={`${consecutiveCount} of ${streakRequired} frames held`}>
          {Array.from({ length: streakRequired }).map((_, i) => (
            <div
              key={i}
              id={`streak-dot-${i}`}
              className="h-1.5 flex-1 rounded-full transition-all duration-100"
              style={{
                background: i < consecutiveCount
                  ? "var(--phosphor)"
                  : "var(--border)",
                boxShadow: i < consecutiveCount && isAccepted
                  ? "0 0 4px var(--phosphor-glow)"
                  : "none",
                opacity: i < consecutiveCount ? 1 : 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
