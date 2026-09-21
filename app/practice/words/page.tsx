"use client";

import { useEffect, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useWordPractice, type Difficulty } from "./useWordPractice";
import AppHeader, { TrackerStatus } from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import PredictionPanel from "@/components/PredictionPanel";

import CameraView from "@/components/CameraView";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useHandPreference } from "@/components/HandPreferenceProvider";

const MOTION_LETTERS = new Set(["J", "Z"]);

export default function WordPracticePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const { handPreference, openChoiceModal } = useHandPreference();
  const camera = useCamera();

  const practice = useWordPractice(camera.videoRef, canvasRef, difficulty, handPreference);

  // Init tracker when camera goes active
  useEffect(() => {
    if (camera.state === "active") {
      practice.initialize().then(() => practice.startLoop());
    } else {
      practice.stopLoop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera.state]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        practice.skipLetter();
      }
      if (e.code === "KeyW") {
        e.preventDefault();
        practice.skipWord();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practice.skipLetter, practice.skipWord]);

  const WordDisplay = () => (
    <div className="flex flex-col items-center gap-4 py-4 select-none">
      {/* Back to Home & Difficulty chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <BackToHomeButton />
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            id={`difficulty-${d}`}
            onClick={() => setDifficulty(d)}
            className={`
              px-3 py-1 rounded-full font-mono-display text-xs font-semibold
              transition-all duration-200 capitalize active:scale-95
              ${difficulty === d
                ? "bg-[var(--phosphor)] text-[var(--void)]"
                : "border border-[var(--border)] text-[var(--ink-low)] hover:border-[var(--ink-low)]"
              }
            `}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Word counter */}
      <p className="font-mono-display text-[var(--ink-low)] text-xs tracking-widest uppercase">
        Word {practice.wordIndex + 1} of {practice.words.length}
      </p>

      {/* Target word with per-letter highlighting */}
      <div
        className={`flex items-center gap-1 sm:gap-2 ${practice.isWordFlashing ? "word-success" : ""}`}
      >
        {practice.currentWord.split("").map((ch, i) => {
          const isDone    = i < practice.letterIndex;
          const isCurrent = i === practice.letterIndex;
          const isMotion  = MOTION_LETTERS.has(ch);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className={`
                  font-mono-display font-bold leading-none
                  text-[12vw] sm:text-[8vw] md:text-[5rem] lg:text-[5rem]
                  transition-all duration-200
                  ${isDone
                    ? "text-[var(--phosphor)] opacity-50"
                    : isCurrent
                    ? "text-[var(--ink-high)] scale-110"
                    : "text-[var(--ink-low)]"
                  }
                `}
                style={isCurrent ? {
                  textShadow: practice.isMatch
                    ? "0 0 30px var(--phosphor-glow)"
                    : "none"
                } : {}}
              >
                {ch}
              </span>
              {/* Current letter underline */}
              {isCurrent && (
                <span
                  className="h-0.5 w-full rounded-full transition-all duration-300"
                  style={{
                    background: practice.isMatch ? "var(--phosphor)" : "var(--ink-low)",
                    boxShadow: practice.isMatch ? "0 0 6px var(--phosphor-glow)" : "none",
                  }}
                />
              )}
              {/* Checkmark for done letters */}
              {isDone && (
                <span className="text-[var(--phosphor)] text-[10px] font-bold">✓</span>
              )}
              {/* Motion badge */}
              {isCurrent && isMotion && (
                <span className="text-[var(--amber)] text-[9px] font-mono-display">motion</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const StatsPanel = () => (
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Words", value: practice.stats.wordsCompleted },
        { label: "Letters", value: practice.stats.lettersCompleted },
        { label: "Avg/Letter", value: practice.stats.avgMsPerLetter > 0 ? `${(practice.stats.avgMsPerLetter / 1000).toFixed(1)}s` : "—" },
      ].map((s) => (
        <div key={s.label} className="p-3 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-center">
          <div className="font-mono-display font-bold text-[var(--ink-high)] text-lg leading-none">
            {s.value}
          </div>
          <div className="font-mono-display text-[var(--ink-low)] text-[10px] mt-1 uppercase tracking-wider">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-dvh bg-[var(--void)] text-[var(--ink-high)] flex flex-col pb-[56px] md:pb-0">
      <AppHeader
        statusNode={
          <TrackerStatus
            isLoading={practice.isLoading}
            isLoaded={practice.isLoaded}
            loadError={practice.loadError}
          />
        }
      />

      {/* ── MOBILE LAYOUT ── */}
      <div className="flex flex-col flex-1 lg:hidden">
        <div className="px-4 pt-2">
          <WordDisplay />
        </div>

        <div className="px-4 py-2">
          <CameraView
            videoRef={camera.videoRef}
            canvasRef={canvasRef}
            state={camera.state}
            errorMessage={camera.errorMessage}
            devices={camera.devices}
            selectedDeviceId={camera.selectedDeviceId}
            onRequestCamera={camera.requestCamera}
            onSwitchDevice={camera.switchDevice}
            onFlipCamera={camera.flipCamera}
          />
        </div>

        <div className="px-4 pb-3 space-y-3">
          <PredictionPanel
            predictedLetter={practice.predictedLetter}
            confidence={practice.confidence}
            consecutiveCount={practice.consecutiveCount}
            streakRequired={practice.streakRequired}
            isMatch={practice.isMatch}
            isAccepted={practice.isAccepted}
            targetLetter={practice.currentLetter}
            isMotionGesture={practice.isMotionGesture}
            detectedHandedness={practice.detectedHandedness}
            isHandMismatch={practice.isHandMismatch}
            handPreference={handPreference}
            onOpenHandSettings={openChoiceModal}
          />
          <StatsPanel />
          {camera.state === "active" && (
            <div className="flex gap-2">
              <button
                id="skip-word-letter-btn"
                onClick={practice.skipLetter}
                className="
                  flex-1 py-3 rounded-xl font-mono-display text-xs
                  border border-[var(--border)] text-[var(--ink-mid)]
                  active:scale-95 transition-all duration-200
                "
              >
                Skip Letter →
              </button>
              <button
                id="skip-word-btn"
                onClick={practice.skipWord}
                className="
                  py-3 px-4 rounded-xl font-mono-display text-xs
                  border border-[var(--border)] text-[var(--ink-low)]
                  active:scale-95 transition-all duration-200
                "
              >
                Skip Word ⇥
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Camera left */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl space-y-3">
            <CameraView
              videoRef={camera.videoRef}
              canvasRef={canvasRef}
              state={camera.state}
              errorMessage={camera.errorMessage}
              devices={camera.devices}
              selectedDeviceId={camera.selectedDeviceId}
              onRequestCamera={camera.requestCamera}
              onSwitchDevice={camera.switchDevice}
              onFlipCamera={camera.flipCamera}
            />
            {camera.state === "active" && (
              <p className="text-center text-[var(--ink-low)] font-mono-display text-xs">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)]">Space</kbd> skip letter ·{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)]">W</kbd> skip word
              </p>
            )}
          </div>
        </div>

        <div className="w-px bg-[var(--border)]" />

        {/* Info panel right */}
        <div className="w-96 xl:w-[420px] flex flex-col overflow-y-auto bg-[var(--surface)]">
          <div className="p-6 border-b border-[var(--border)]">
            <WordDisplay />
          </div>
          <div className="p-6 border-b border-[var(--border)] space-y-3">
            <PredictionPanel
              predictedLetter={practice.predictedLetter}
              confidence={practice.confidence}
              consecutiveCount={practice.consecutiveCount}
              streakRequired={practice.streakRequired}
              isMatch={practice.isMatch}
              isAccepted={practice.isAccepted}
              targetLetter={practice.currentLetter}
              isMotionGesture={practice.isMotionGesture}
              detectedHandedness={practice.detectedHandedness}
              isHandMismatch={practice.isHandMismatch}
              handPreference={handPreference}
              onOpenHandSettings={openChoiceModal}
            />
            {camera.state === "active" && (
              <div className="flex gap-2">
                <button
                  id="skip-word-letter-desktop-btn"
                  onClick={practice.skipLetter}
                  className="flex-1 py-2.5 rounded-xl font-mono-display text-xs border border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--phosphor)] hover:text-[var(--phosphor)] active:scale-95 transition-all duration-200"
                >
                  Skip Letter →
                </button>
                <button
                  id="skip-word-desktop-btn"
                  onClick={practice.skipWord}
                  className="py-2.5 px-4 rounded-xl font-mono-display text-xs border border-[var(--border)] text-[var(--ink-low)] hover:border-[var(--ink-low)] active:scale-95 transition-all duration-200"
                >
                  Skip Word ⇥
                </button>
              </div>
            )}
          </div>
          <div className="p-6">
            <p className="font-mono-display text-[var(--ink-low)] text-xs tracking-widest uppercase mb-3">Session</p>
            <StatsPanel />
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
