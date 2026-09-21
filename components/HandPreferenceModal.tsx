"use client";

import { useHandPreference } from "@/components/HandPreferenceProvider";
import { type HandPreference } from "@/lib/handPreference";

export default function HandPreferenceModal() {
  const {
    handPreference,
    isChoiceModalOpen,
    setHandPreference,
    closeChoiceModal,
    hasChosenPreference,
  } = useHandPreference();

  if (!isChoiceModalOpen) return null;

  const handleSelect = (pref: HandPreference) => {
    setHandPreference(pref);
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4 bg-black/60 backdrop-blur-sm
        slide-up
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="hand-pref-title"
    >
      <div
        className="
          w-full max-w-md p-6 rounded-2xl
          bg-[var(--surface)] border border-[var(--border)]
          shadow-2xl flex flex-col gap-6
          text-center relative overflow-hidden
        "
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[var(--panel)] border border-[var(--border)] flex items-center justify-center mx-auto text-2xl">
            🤚
          </div>
          <h2
            id="hand-pref-title"
            className="font-mono-display font-bold text-xl text-[var(--ink-high)]"
          >
            Which hand do you sign with?
          </h2>
          <p className="text-xs text-[var(--ink-mid)] leading-relaxed max-w-xs mx-auto">
            Select your dominant signing hand. SignSpell uses this to optimize AI hand tracking and guide your practice.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left Hand Option */}
          <button
            id="select-left-hand-btn"
            onClick={() => handleSelect("left")}
            className={`
              p-4 rounded-xl border text-center flex flex-col items-center gap-3
              transition-all duration-200 active:scale-95 group
              ${
                handPreference === "left" && hasChosenPreference
                  ? "bg-[var(--phosphor)]/10 border-[var(--phosphor)] text-[var(--phosphor)] shadow-md"
                  : "bg-[var(--panel)] border-[var(--border)] text-[var(--ink-high)] hover:border-[var(--phosphor)]/50"
              }
            `}
          >
            <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
              🖐️
            </div>
            <div>
              <div className="font-mono-display font-bold text-sm">
                Left Hand
              </div>
              <div className="font-mono-display text-[10px] text-[var(--ink-low)] mt-0.5">
                Left-dominant
              </div>
            </div>
          </button>

          {/* Right Hand Option */}
          <button
            id="select-right-hand-btn"
            onClick={() => handleSelect("right")}
            className={`
              p-4 rounded-xl border text-center flex flex-col items-center gap-3
              transition-all duration-200 active:scale-95 group
              ${
                handPreference === "right" && hasChosenPreference
                  ? "bg-[var(--phosphor)]/10 border-[var(--phosphor)] text-[var(--phosphor)] shadow-md"
                  : "bg-[var(--panel)] border-[var(--border)] text-[var(--ink-high)] hover:border-[var(--phosphor)]/50"
              }
            `}
          >
            <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
              ✋
            </div>
            <div>
              <div className="font-mono-display font-bold text-sm">
                Right Hand
              </div>
              <div className="font-mono-display text-[10px] text-[var(--ink-low)] mt-0.5">
                Right-dominant
              </div>
            </div>
          </button>
        </div>

        {/* Footer info / Close if already chosen */}
        <div className="flex items-center justify-between text-[11px] text-[var(--ink-low)] font-mono-display pt-2 border-t border-[var(--border)]">
          <span>You can change this anytime in settings</span>
          {hasChosenPreference && (
            <button
              onClick={closeChoiceModal}
              className="text-[var(--ink-mid)] hover:text-[var(--ink-high)] underline"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
