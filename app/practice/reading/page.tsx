"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useSignRecognition } from "@/hooks/useSignRecognition";
import AppHeader, { TrackerStatus } from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import wordListData from "@/data/word-list.json";

import CameraView from "@/components/CameraView";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useHandPreference } from "@/components/HandPreferenceProvider";

// Flat word list for autocomplete prefix matching
const ALL_WORDS = [
  ...wordListData.easy,
  ...wordListData.medium,
  ...wordListData.hard,
];

/** Find top-N words that start with the given prefix */
function getPrefixMatches(prefix: string, n = 3): string[] {
  if (!prefix) return [];
  const p = prefix.toUpperCase();
  return ALL_WORDS.filter((w) => w.startsWith(p) && w !== p).slice(0, n);
}

interface TranscriptWord {
  text: string;
  committed: boolean;
}

export default function ReadingModePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { handPreference } = useHandPreference();
  const camera = useCamera();
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Transcript state
  const [words, setWords] = useState<TranscriptWord[]>([]);
  const [currentInput, setCurrentInput] = useState(""); // letters being built
  const [lastAcceptedLetter, setLastAcceptedLetter] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleLetterAccepted = useCallback((letter: string) => {
    setCurrentInput((prev) => {
      const next = prev + letter;
      setSuggestions(getPrefixMatches(next));
      return next;
    });
    setLastAcceptedLetter(letter);
    // Clear the "last accepted" flash after 800ms
    setTimeout(() => setLastAcceptedLetter(null), 800);
  }, []);

  const recognition = useSignRecognition({
    videoRef: camera.videoRef,
    canvasRef,
    targetLetter: null, // free mode — no target
    handPreference,
    onLetterAccepted: handleLetterAccepted,
  });

  // Init tracker when camera activates
  useEffect(() => {
    if (camera.state === "active") {
      recognition.initialize().then(() => recognition.startLoop());
    } else {
      recognition.stopLoop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera.state]);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [words, currentInput]);

  const commitWord = useCallback(() => {
    if (!currentInput) return;
    setWords((prev) => [...prev, { text: currentInput, committed: true }]);
    setCurrentInput("");
    setSuggestions([]);
  }, [currentInput]);

  const clearTranscript = useCallback(() => {
    setWords([]);
    setCurrentInput("");
    setSuggestions([]);
  }, []);

  const acceptSuggestion = useCallback((word: string) => {
    setWords((prev) => [...prev, { text: word, committed: true }]);
    setCurrentInput("");
    setSuggestions([]);
  }, []);

  const deleteLast = useCallback(() => {
    setCurrentInput((prev) => {
      const next = prev.slice(0, -1);
      setSuggestions(getPrefixMatches(next));
      return next;
    });
  }, []);

  const fullTranscript = [
    ...words.map((w) => w.text),
    currentInput || "",
  ].join(" ").trim();

  const TranscriptPanel = () => (
    <div className="flex flex-col gap-3 h-full">
      {/* Back to Home button */}
      <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]/40">
        <BackToHomeButton />
        <span className="font-mono-display text-xs text-[var(--ink-low)] uppercase tracking-wider">
          Reading Mode
        </span>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <span className="font-mono-display text-[var(--ink-low)] text-xs self-center mr-1">
            Suggestions:
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              id={`suggestion-${s}`}
              onClick={() => acceptSuggestion(s)}
              className="
                px-3 py-1 rounded-full
                font-mono-display text-xs font-semibold
                border border-[var(--phosphor)]/40
                text-[var(--phosphor)]
                hover:bg-[var(--phosphor)] hover:text-[var(--void)]
                transition-all duration-150 active:scale-95
              "
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Transcript display */}
      <div
        ref={transcriptRef}
        id="transcript-output"
        className="
          flex-1 overflow-y-auto
          p-4 rounded-xl
          bg-[var(--panel)] border border-[var(--border)]
          font-mono-display text-lg sm:text-xl leading-relaxed
          min-h-[120px]
        "
      >
        {/* Committed words */}
        {words.map((w, i) => (
          <span key={i} className="text-[var(--ink-high)]">
            {w.text}{" "}
          </span>
        ))}
        {/* Current building word */}
        {currentInput && (
          <span>
            {/* Each letter lights up as accepted */}
            {currentInput.split("").map((ch, i) => (
              <span
                key={i}
                className="text-[var(--phosphor)] transition-colors duration-150"
                style={{
                  opacity: i === currentInput.length - 1 && ch === lastAcceptedLetter ? 1 : 0.8,
                }}
              >
                {ch}
              </span>
            ))}
            {/* Blinking cursor */}
            <span className="blink-cursor text-[var(--phosphor)] font-bold">|</span>
          </span>
        )}
        {/* Empty state */}
        {!fullTranscript && (
          <span className="text-[var(--ink-low)] text-base italic">
            Start signing to build a transcript…
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          id="commit-word-btn"
          onClick={commitWord}
          disabled={!currentInput}
          className="
            flex-1 py-3 rounded-xl font-mono-display text-sm font-semibold
            transition-all duration-200 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            bg-[var(--phosphor)] text-[var(--void)]
            hover:opacity-90
          "
        >
          Space ⎵
        </button>
        <button
          id="delete-last-btn"
          onClick={deleteLast}
          disabled={!currentInput}
          className="
            py-3 px-4 rounded-xl font-mono-display text-sm
            border border-[var(--border)] text-[var(--ink-mid)]
            hover:border-[var(--ink-mid)]
            transition-all duration-200 active:scale-95
            disabled:opacity-40
          "
        >
          ⌫
        </button>
        <button
          id="clear-transcript-btn"
          onClick={clearTranscript}
          className="
            py-3 px-4 rounded-xl font-mono-display text-sm
            border border-[var(--border)] text-[var(--ink-low)]
            hover:border-[var(--danger)] hover:text-[var(--danger)]
            transition-all duration-200 active:scale-95
          "
        >
          Clear
        </button>
      </div>

      {/* Live prediction indicator */}
      {recognition.predictedLetter && camera.state === "active" && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
          <span className="font-mono-display text-[var(--ink-low)] text-xs">Detecting:</span>
          <span
            className="font-mono-display font-bold text-2xl leading-none"
            style={{ color: "var(--phosphor)", opacity: recognition.isAccepted ? 1 : 0.6 }}
          >
            {recognition.predictedLetter}
          </span>
          <div className="flex-1 confidence-bar">
            <div
              className="confidence-bar-fill"
              style={{ width: `${Math.round(recognition.confidence * 100)}%` }}
            />
          </div>
          <span className="font-mono-display text-[var(--ink-low)] text-xs">
            {Math.round(recognition.confidence * 100)}%
          </span>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-dvh bg-[var(--void)] text-[var(--ink-high)] flex flex-col pb-[56px] md:pb-0">
      <AppHeader
        statusNode={
          <TrackerStatus
            isLoading={recognition.isLoading}
            isLoaded={recognition.isLoaded}
            loadError={recognition.loadError}
          />
        }
      />

      {/* ── MOBILE LAYOUT ── */}
      <div className="flex flex-col flex-1 lg:hidden gap-3 p-4">
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
        <div className="flex-1 min-h-0">
          <TranscriptPanel />
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Camera left */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
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
        </div>

        <div className="w-px bg-[var(--border)]" />

        {/* Transcript panel right */}
        <div className="w-[480px] xl:w-[560px] flex flex-col p-6 bg-[var(--surface)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono-display font-bold text-[var(--ink-high)] text-lg">
              Live Transcript
            </h2>
            <span className="font-mono-display text-[var(--ink-low)] text-xs">
              Sign letters, use Space to separate words
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <TranscriptPanel />
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
