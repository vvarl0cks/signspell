"use client";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MOTION_LETTERS = new Set(["J", "Z"]);

interface ProgressBarProps {
  completedLetters: Set<string>;
  currentLetter: string;
  onLetterClick?: (letter: string) => void;
}

export default function ProgressBar({
  completedLetters,
  currentLetter,
  onLetterClick,
}: ProgressBarProps) {
  const completedCount = completedLetters.size;
  const totalCount = ALPHABET.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <span className="font-mono-display text-xs tracking-widest uppercase" style={{ color: "var(--ink-low)" }}>
          Progress
        </span>
        <span className="font-mono-display text-xs">
          <span className="font-semibold" style={{ color: "var(--phosphor)" }}>{completedCount}</span>
          <span style={{ color: "var(--ink-low)" }}> / {totalCount}</span>
        </span>
      </div>

      {/* Letter chips */}
      <div className="flex flex-wrap gap-1" role="list" aria-label="Alphabet progress">
        {ALPHABET.map((letter) => {
          const isDone    = completedLetters.has(letter);
          const isCurrent = letter === currentLetter;
          const isMotion  = MOTION_LETTERS.has(letter);

          let bg = "var(--panel)";
          let borderColor = "var(--border)";
          let color = "var(--ink-low)";
          let transform = "";
          let boxShadow = "";

          if (isCurrent) {
            bg = "var(--phosphor)";
            color = "var(--void)";
            borderColor = "var(--phosphor)";
            transform = "scale(1.1)";
            boxShadow = "0 0 8px var(--phosphor-glow)";
          } else if (isDone) {
            bg = "color-mix(in srgb, var(--phosphor) 12%, var(--panel))";
            color = "var(--phosphor)";
            borderColor = "color-mix(in srgb, var(--phosphor) 30%, var(--border))";
          } else if (isMotion) {
            bg = "color-mix(in srgb, var(--amber) 8%, var(--panel))";
            color = "var(--amber)";
            borderColor = "color-mix(in srgb, var(--amber) 20%, var(--border))";
          }

          return (
            <button
              key={letter}
              id={`letter-chip-${letter}`}
              role="listitem"
              onClick={() => onLetterClick?.(letter)}
              aria-label={`Letter ${letter}${isDone ? " (completed)" : ""}${isCurrent ? " (current)" : ""}`}
              className="w-7 h-7 rounded-md font-mono-display text-xs font-semibold flex items-center justify-center transition-all duration-200 relative border"
              style={{ background: bg, borderColor, color, transform, boxShadow }}
            >
              {letter}
              {isDone && !isCurrent && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ background: "var(--phosphor)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress track */}
      <div className="confidence-bar mt-1">
        <div className="confidence-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
}
