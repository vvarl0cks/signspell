"use client";

import { useCallback, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { HandTracker, type HandLandmarks } from "@/lib/handTracking";
import { type ReferenceEntry } from "@/lib/classifier";

import CameraView from "@/components/CameraView";
import BackToHomeButton from "@/components/BackToHomeButton";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AdminCollectPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackerRef = useRef<HandTracker | null>(null);
  const rafRef = useRef<number | null>(null);

  const [selectedLetter, setSelectedLetter] = useState("A");
  const [isTrackerReady, setIsTrackerReady] = useState(false);
  const [isTrackerLoading, setIsTrackerLoading] = useState(false);
  const [samples, setSamples] = useState<Record<string, ReferenceEntry[]>>({});
  const [lastCapture, setLastCapture] = useState<HandLandmarks | null>(null);
  const [captureFlash, setCaptureFlash] = useState(false);

  const camera = useCamera();

  const initTracker = useCallback(async () => {
    if (isTrackerReady) return;
    setIsTrackerLoading(true);
    try {
      const tracker = new HandTracker();
      await tracker.init();
      trackerRef.current = tracker;
      setIsTrackerReady(true);

      // Start loop
      const loop = (ts: number) => {
        const video = camera.videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && trackerRef.current) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
          }
          const { landmarks } = trackerRef.current.detectFrame(video, ts);
          trackerRef.current.drawLandmarks(canvas, landmarks);
          if (landmarks.length > 0) {
            setLastCapture(landmarks);
          } else {
            setLastCapture(null);
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      console.error("Tracker init failed:", e);
    } finally {
      setIsTrackerLoading(false);
    }
  }, [isTrackerReady, camera.videoRef]);

  const handleCameraReady = useCallback(async () => {
    await camera.requestCamera();
    await initTracker();
  }, [camera, initTracker]);

  const captureSample = useCallback(() => {
    if (!lastCapture) return;
    const entry: ReferenceEntry = {
      letter: selectedLetter,
      landmarks: lastCapture.map((lm) => ({ x: lm.x, y: lm.y, z: lm.z })),
    };
    setSamples((prev) => ({
      ...prev,
      [selectedLetter]: [...(prev[selectedLetter] ?? []), entry],
    }));
    setCaptureFlash(true);
    setTimeout(() => setCaptureFlash(false), 300);
  }, [lastCapture, selectedLetter]);

  const exportJSON = useCallback(() => {
    const allEntries: ReferenceEntry[] = Object.values(samples).flat();
    const json = JSON.stringify(allEntries, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "asl-alphabet-references.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [samples]);

  const totalSamples = Object.values(samples).reduce((a, b) => a + b.length, 0);

  return (
    <main className="min-h-dvh bg-void text-ink-high pt-safe pb-safe">
      {/* Header */}
      <header className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackToHomeButton />
          <div>
            <h1 className="font-mono-display font-bold text-ink-high text-sm">
              Data Collection Tool
            </h1>
            <p className="font-mono-display text-ink-low text-xs">
              Capture 3D hand landmarks for ASL reference dataset
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono-display text-ink-mid text-xs">
            {totalSamples} samples captured
          </span>
          {totalSamples > 0 && (
            <button
              id="export-json-btn"
              onClick={exportJSON}
              className="px-3 py-1.5 rounded-lg bg-phosphor text-void text-xs font-mono-display font-semibold active:scale-95 transition-all"
            >
              Export JSON
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-5xl mx-auto">
        {/* Camera panel */}
        <div className="flex-1 space-y-3">
          <CameraView
            videoRef={camera.videoRef}
            canvasRef={canvasRef}
            state={camera.state}
            errorMessage={camera.errorMessage}
            devices={camera.devices}
            selectedDeviceId={camera.selectedDeviceId}
            onRequestCamera={handleCameraReady}
            onSwitchDevice={camera.switchDevice}
            onFlipCamera={camera.flipCamera}
          />

          {/* Capture button */}
          <button
            id="capture-sample-btn"
            onClick={captureSample}
            disabled={!lastCapture || !isTrackerReady}
            className={`
              w-full py-4 rounded-xl font-mono-display font-bold text-lg
              transition-all duration-150 active:scale-95
              ${captureFlash ? "bg-phosphor text-void scale-105" : ""}
              ${lastCapture && isTrackerReady
                ? "bg-panel border border-phosphor/40 text-phosphor hover:bg-phosphor/10"
                : "bg-panel border border-border text-ink-low cursor-not-allowed"
              }
            `}
          >
            {captureFlash
              ? "✓ Captured!"
              : lastCapture && isTrackerReady
              ? `Capture Sample for "${selectedLetter}"`
              : isTrackerLoading
              ? "Loading tracker…"
              : "Position hand in frame"}
          </button>

          {/* Hand detected indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                lastCapture ? "bg-phosphor" : "bg-border"
              }`}
            />
            <span className="font-mono-display text-ink-low text-xs">
              {lastCapture ? "Hand detected" : "No hand in frame"}
            </span>
          </div>
        </div>

        {/* Control panel */}
        <div className="lg:w-72 space-y-4">
          {/* Letter selector */}
          <div className="p-4 rounded-xl bg-panel border border-border">
            <h2 className="font-mono-display text-ink-mid text-xs tracking-widest uppercase mb-3">
              Select Letter
            </h2>
            <div className="grid grid-cols-6 gap-1.5">
              {ALPHABET.map((letter) => {
                const count = samples[letter]?.length ?? 0;
                return (
                  <button
                    key={letter}
                    id={`select-${letter}`}
                    onClick={() => setSelectedLetter(letter)}
                    className={`
                      relative aspect-square rounded-lg font-mono-display text-sm font-bold
                      flex items-center justify-center
                      transition-all duration-150 active:scale-90
                      ${selectedLetter === letter
                        ? "bg-phosphor text-void"
                        : count > 0
                        ? "bg-phosphor/15 border border-phosphor/30 text-phosphor"
                        : "bg-surface border border-border text-ink-low hover:border-ink-low"
                      }
                    `}
                  >
                    {letter}
                    {count > 0 && selectedLetter !== letter && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-phosphor/60 text-void text-[8px] flex items-center justify-center font-bold">
                        {count > 9 ? "9+" : count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Samples per letter */}
          <div className="p-4 rounded-xl bg-panel border border-border">
            <h2 className="font-mono-display text-ink-mid text-xs tracking-widest uppercase mb-3">
              Samples per Letter
            </h2>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {ALPHABET.map((letter) => {
                const count = samples[letter]?.length ?? 0;
                const recommended = 5;
                return (
                  <div key={letter} className="flex items-center gap-2">
                    <span className="font-mono-display text-ink-mid text-xs w-4">{letter}</span>
                    <div className="flex-1 confidence-bar">
                      <div
                        className="confidence-bar-fill"
                        style={{ width: `${Math.min((count / recommended) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-mono-display text-ink-low text-xs w-6 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-panel border border-border text-xs text-ink-low leading-relaxed space-y-2">
            <p className="font-mono-display font-semibold text-ink-mid">Instructions</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Select a letter from the grid above</li>
              <li>Form the ASL sign for that letter</li>
              <li>Capture 3–5 samples per letter</li>
              <li>Vary your hand angle/distance slightly</li>
              <li>Export JSON and replace data/asl-alphabet-references.json</li>
            </ol>
            <p className="text-amber-DEFAULT/80">
              Note: J and Z are motion gestures — capture the starting position only.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
