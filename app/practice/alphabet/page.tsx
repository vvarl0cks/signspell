"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useHandTracking } from "./useHandTracking";
import LetterDisplay from "@/components/LetterDisplay";
import PredictionPanel from "@/components/PredictionPanel";
import ProgressBar from "@/components/ProgressBar";
import AppHeader, { TrackerStatus } from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import CameraView from "@/components/CameraView";
import ASLHandshapeSVG from "@/components/ASLHandshapeSVG";
import BackToHomeButton from "@/components/BackToHomeButton";
import aslTipsData from "@/data/asl-alphabet-tips.json";

import { useHandPreference } from "@/components/HandPreferenceProvider";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MOTION_LETTERS = new Set(["J", "Z"]);
const tipsMap = aslTipsData as Record<string, string>;

export default function AlphabetPracticePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [isFlashing, setIsFlashing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const { handPreference, openChoiceModal } = useHandPreference();

  const isAdvancingRef = useRef(false);

  const currentLetter = ALPHABET[currentIndex];
  const isMotionGesture = MOTION_LETTERS.has(currentLetter);
  const currentTip = tipsMap[currentLetter] ?? "Form the ASL handshape for this letter.";

  const camera = useCamera(true);

  const handleLetterAccepted = useCallback((letter: string) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    setIsFlashing(true);
    setCompletedLetters((prev) => new Set(Array.from(prev).concat(letter)));
    setTimeout(() => {
      setIsFlashing(false);
      setCurrentIndex((idx) => Math.min(idx + 1, ALPHABET.length - 1));
      isAdvancingRef.current = false;
    }, 600);
  }, []);

  const tracking = useHandTracking(
    camera.videoRef,
    canvasRef,
    currentLetter,
    isMotionGesture,
    handleLetterAccepted,
    handPreference
  );

  // Sync hand tracker with camera status
  useEffect(() => {
    if (camera.state === "active") {
      tracking.initialize().then(() => tracking.startLoop());
    } else {
      tracking.stopLoop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera.state]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        if (currentIndex < ALPHABET.length - 1) setCurrentIndex((i) => i + 1);
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0) setCurrentIndex((i) => i - 1);
      }
      if (e.code === "KeyG") {
        e.preventDefault();
        setShowGuide((g) => !g);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  const handleJumpToLetter = useCallback((letter: string) => {
    const idx = ALPHABET.indexOf(letter);
    if (idx >= 0) setCurrentIndex(idx);
  }, []);

  const handleSkipLetter = useCallback(() => {
    if (currentIndex < ALPHABET.length - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex]);

  return (
    <main className="min-h-dvh bg-[var(--void)] text-[var(--ink-high)] flex flex-col pb-[56px] md:pb-0">
      <AppHeader
        statusNode={
          <TrackerStatus
            isLoading={tracking.isLoading}
            isLoaded={tracking.isLoaded}
            loadError={tracking.loadError}
          />
        }
      />

      {/* ── HEADER TOOLBAR ── */}
      <div className="px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BackToHomeButton />
          <button
            id="toggle-guide-btn"
            onClick={() => setShowGuide((g) => !g)}
            className={`
              px-3 py-1.5 rounded-xl font-mono-display text-xs font-semibold
              transition-all duration-200 flex items-center gap-1.5 active:scale-95 border
              ${showGuide
                ? "bg-[var(--phosphor)] text-[var(--void)] border-[var(--phosphor)] shadow-sm"
                : "bg-[var(--panel)] border-[var(--border)] text-[var(--ink-mid)] hover:text-[var(--ink-high)]"
              }
            `}
          >
            <span>📖</span>
            <span>{showGuide ? "Guide: ON" : "Guide: OFF"}</span>
          </button>
        </div>

        <div className="font-mono-display text-xs text-[var(--ink-mid)]">
          Letter <span className="font-bold text-[var(--phosphor)]">{currentIndex + 1}</span> of {ALPHABET.length}
        </div>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="flex flex-col flex-1 lg:hidden">
        {/* Target Letter + Reference Card */}
        <div className="px-4 pt-2 pb-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <LetterDisplay
                letter={currentLetter}
                isMotionGesture={isMotionGesture}
                isSuccess={isFlashing}
                letterIndex={currentIndex}
                totalLetters={ALPHABET.length}
              />
            </div>

            {/* Visual Handshape Reference Card */}
            {showGuide && (
              <div className="p-2.5 rounded-2xl bg-[var(--panel)] border border-[var(--border)] flex flex-col items-center justify-center flex-shrink-0 text-[var(--phosphor)] shadow-sm">
                <ASLHandshapeSVG letter={currentLetter} size={65} />
                <span className="font-mono-display text-[9px] text-[var(--ink-low)] mt-1 font-semibold uppercase tracking-wider">
                  Handshape
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tip Box when Guide is ON */}
        {showGuide && (
          <div className="px-4 pb-2">
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--ink-mid)] flex items-start gap-2">
              <span className="text-xs">💡</span>
              <span className="leading-tight">{currentTip}</span>
            </div>
          </div>
        )}

        {/* Progress Minimap */}
        <div className="px-4 pb-2">
          <ProgressBar
            completedLetters={completedLetters}
            currentLetter={currentLetter}
            onLetterClick={handleJumpToLetter}
          />
        </div>

        {/* Camera View */}
        <div className="px-4 flex-1 min-h-0">
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

        {/* Live Prediction Panel (ALWAYS VISIBLE for detection feedback) */}
        <div className="px-4 pt-3 pb-4">
          <PredictionPanel
            predictedLetter={tracking.predictedLetter}
            confidence={tracking.confidence}
            consecutiveCount={tracking.consecutiveCount}
            streakRequired={tracking.streakRequired}
            isMatch={tracking.isMatch}
            isAccepted={tracking.isAccepted}
            targetLetter={currentLetter}
            isMotionGesture={isMotionGesture}
            detectedHandedness={tracking.detectedHandedness}
            isHandMismatch={tracking.isHandMismatch}
            handPreference={handPreference}
            onOpenHandSettings={openChoiceModal}
          />

          {camera.state === "active" && (
            <div className="flex gap-2 mt-3">
              {isMotionGesture ? (
                <button
                  id="skip-motion-btn"
                  onClick={handleSkipLetter}
                  className="flex-1 py-3 rounded-xl font-mono-display text-sm font-semibold bg-[var(--amber)]/10 border border-[var(--amber)]/30 text-[var(--amber)] active:scale-95 transition-all duration-200"
                >
                  Skip → Next Letter
                </button>
              ) : (
                <button
                  id="skip-letter-btn"
                  onClick={handleSkipLetter}
                  className="py-3 px-4 rounded-xl font-mono-display text-xs border border-[var(--border)] text-[var(--ink-low)] active:scale-95 transition-all duration-200 hover:border-[var(--ink-low)] hover:text-[var(--ink-mid)]"
                >
                  Skip →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left Side: Camera & Live Detection Feedback */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[var(--void)]">
          <div className="w-full max-w-2xl space-y-4">
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
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)] text-[var(--ink-mid)]">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)] text-[var(--ink-mid)]">→</kbd> skip · <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)] text-[var(--ink-mid)]">G</kbd> toggle guide
              </p>
            )}
          </div>
        </div>

        <div className="w-px bg-[var(--border)]" />

        {/* Right Side: Letter Display, Reference Handshape, Live Prediction & Progress */}
        <div className="w-96 xl:w-[440px] flex flex-col overflow-y-auto bg-[var(--surface)]">
          {/* Target Letter Header */}
          <div className="p-6 border-b border-[var(--border)]">
            <LetterDisplay
              letter={currentLetter}
              isMotionGesture={isMotionGesture}
              isSuccess={isFlashing}
              letterIndex={currentIndex}
              totalLetters={ALPHABET.length}
            />
          </div>

          {/* Reference Handshape & Tip Box (when Guide ON) */}
          {showGuide && (
            <div className="p-6 border-b border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-display text-xs tracking-widest uppercase text-[var(--ink-low)]">
                  Handshape Reference
                </span>
                <span className="font-mono-display text-xs font-bold text-[var(--phosphor)]">
                  {currentLetter}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--panel)] border border-[var(--border)] flex items-center justify-center text-[var(--phosphor)] shadow-sm">
                <ASLHandshapeSVG letter={currentLetter} size={110} />
              </div>

              <div className="p-3 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-xs text-[var(--ink-mid)] space-y-1">
                <div className="flex items-center gap-1.5 font-mono-display font-semibold text-[var(--phosphor)]">
                  <span>💡</span>
                  <span>Signing Tip</span>
                </div>
                <p className="leading-relaxed">{currentTip}</p>
              </div>
            </div>
          )}

          {/* LIVE PREDICTION PANEL (ALWAYS VISIBLE for detection feedback) */}
          <div className="p-6 border-b border-[var(--border)] space-y-3">
            <PredictionPanel
              predictedLetter={tracking.predictedLetter}
              confidence={tracking.confidence}
              consecutiveCount={tracking.consecutiveCount}
              streakRequired={tracking.streakRequired}
              isMatch={tracking.isMatch}
              isAccepted={tracking.isAccepted}
              targetLetter={currentLetter}
              isMotionGesture={isMotionGesture}
              detectedHandedness={tracking.detectedHandedness}
              isHandMismatch={tracking.isHandMismatch}
              handPreference={handPreference}
              onOpenHandSettings={openChoiceModal}
            />

            {(isMotionGesture || !tracking.isLoaded) && camera.state === "active" && (
              <button
                id="skip-letter-desktop-btn"
                onClick={handleSkipLetter}
                className="mt-3 w-full py-3 rounded-xl font-mono-display text-sm border border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--phosphor)]/40 hover:text-[var(--phosphor)] active:scale-95 transition-all duration-200"
              >
                Skip → Next Letter
              </button>
            )}
          </div>

          {/* Progress Minimap */}
          <div className="p-6">
            <ProgressBar
              completedLetters={completedLetters}
              currentLetter={currentLetter}
              onLetterClick={handleJumpToLetter}
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
