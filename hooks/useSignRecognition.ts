"use client";

/**
 * useSignRecognition.ts
 * Unified sign recognition hook — incorporates hand preference ("left" | "right")
 * filtering, hand mismatch warnings, and multi-hand selection.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { HandTracker, type DetectedHandInfo } from "@/lib/handTracking";
import { Classifier, type ReferenceEntry, type ClassificationResult } from "@/lib/classifier";
import { type HandPreference } from "@/lib/handPreference";

export interface SignRecognitionState {
  predictedLetter: string | null;
  confidence: number;
  consecutiveCount: number;
  isMatch: boolean;
  isAccepted: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
  lastResult: ClassificationResult | null;
  detectedHandedness: HandPreference | null;
  isHandMismatch: boolean;
}

export interface UseSignRecognitionOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  targetLetter?: string | null;
  isMotionGesture?: boolean;
  handPreference?: HandPreference;
  onLetterAccepted?: (letter: string) => void;
}

export function useSignRecognition({
  videoRef,
  canvasRef,
  targetLetter = null,
  isMotionGesture = false,
  handPreference = "right",
  onLetterAccepted,
}: UseSignRecognitionOptions) {
  const trackerRef = useRef<HandTracker | null>(null);
  const classifierRef = useRef<Classifier>(new Classifier());
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const lastFiredLetterRef = useRef<string | null>(null);

  const [state, setState] = useState<SignRecognitionState>({
    predictedLetter: null,
    confidence: 0,
    consecutiveCount: 0,
    isMatch: false,
    isAccepted: false,
    isLoaded: false,
    isLoading: false,
    loadError: null,
    lastResult: null,
    detectedHandedness: null,
    isHandMismatch: false,
  });

  const initialize = useCallback(async () => {
    setState((s) => {
      if (s.isLoaded || s.isLoading) return s;
      return { ...s, isLoading: true, loadError: null };
    });

    try {
      const res = await fetch("/api/references");
      let refs: ReferenceEntry[] = [];
      if (res.ok) {
        refs = await res.json();
      } else {
        const mod = await import("@/data/asl-alphabet-references.json");
        refs = mod.default as ReferenceEntry[];
      }
      classifierRef.current.loadReferences(refs);

      if (!trackerRef.current) {
        const tracker = new HandTracker();
        await tracker.init();
        trackerRef.current = tracker;
      }

      setState((s) => ({ ...s, isLoaded: true, isLoading: false }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load hand tracker";
      setState((s) => ({ ...s, isLoading: false, loadError: msg }));
    }
  }, []);

  const startLoop = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const loop = (timestamp: number) => {
      if (!isRunningRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const tracker = trackerRef.current;

      if (video && canvas && tracker) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }

        const { hands, wasThrottled } = tracker.detectFrame(video, timestamp);

        // Draw skeletons for all detected hands
        const allLandmarks = hands.map((h) => h.landmarks);
        tracker.drawLandmarks(canvas, allLandmarks);

        if (!wasThrottled && !isMotionGesture) {
          if (hands.length > 0) {
            // Select the hand matching handPreference if multiple hands are present
            let selectedHand: DetectedHandInfo = hands[0];
            const matchingHand = hands.find((h) => h.handedness === handPreference);
            if (matchingHand) {
              selectedHand = matchingHand;
            }

            const detectedHandedness = selectedHand.handedness;
            const isHandMismatch = detectedHandedness !== handPreference;

            const result = classifierRef.current.classify(selectedHand.landmarks);

            if (result) {
              const isMatch = targetLetter !== null
                ? result.letter === targetLetter && result.isAccepted
                : false;

              setState({
                predictedLetter: result.letter === "?" ? null : result.letter,
                confidence: result.confidence,
                consecutiveCount: result.consecutiveCount,
                isMatch,
                isAccepted: result.isAccepted,
                isLoaded: true,
                isLoading: false,
                loadError: null,
                lastResult: result,
                detectedHandedness,
                isHandMismatch,
              });

              if (
                result.isAccepted &&
                targetLetter !== null &&
                result.letter === targetLetter &&
                lastFiredLetterRef.current !== targetLetter &&
                onLetterAccepted
              ) {
                lastFiredLetterRef.current = targetLetter;
                setTimeout(() => onLetterAccepted(targetLetter), 500);
              }
            } else {
              setState((s) => ({
                ...s,
                predictedLetter: null,
                confidence: 0,
                consecutiveCount: 0,
                isMatch: false,
                isAccepted: false,
                lastResult: null,
                detectedHandedness,
                isHandMismatch,
              }));
            }
          } else {
            setState((s) => ({
              ...s,
              predictedLetter: null,
              confidence: 0,
              consecutiveCount: 0,
              isMatch: false,
              isAccepted: false,
              lastResult: null,
              detectedHandedness: null,
              isHandMismatch: false,
            }));
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [videoRef, canvasRef, targetLetter, isMotionGesture, handPreference, onLetterAccepted]);

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    classifierRef.current.resetStreak();
    lastFiredLetterRef.current = null;
    setState((s) => ({
      ...s,
      predictedLetter: null,
      confidence: 0,
      consecutiveCount: 0,
      isMatch: false,
      isAccepted: false,
      lastResult: null,
    }));
  }, [targetLetter]);

  useEffect(() => {
    return () => {
      stopLoop();
      trackerRef.current?.destroy();
      trackerRef.current = null;
    };
  }, [stopLoop]);

  return {
    ...state,
    streakRequired: classifierRef.current.streakRequirement,
    initialize,
    startLoop,
    stopLoop,
    resetStreak: () => {
      classifierRef.current.resetStreak();
      lastFiredLetterRef.current = null;
    },
  };
}
