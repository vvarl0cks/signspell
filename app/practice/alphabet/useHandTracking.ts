"use client";

/**
 * useHandTracking.ts (shim)
 * Backward-compatible re-export that wraps useSignRecognition for the
 * alphabet practice page.
 */

import { useSignRecognition } from "@/hooks/useSignRecognition";
import { type HandPreference } from "@/lib/handPreference";

export type { SignRecognitionState as HandTrackingState } from "@/hooks/useSignRecognition";

export function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  targetLetter: string,
  isMotionGesture: boolean,
  onAccepted: (letter: string) => void,
  handPreference: HandPreference = "right"
) {
  return useSignRecognition({
    videoRef,
    canvasRef,
    targetLetter,
    isMotionGesture,
    handPreference,
    onLetterAccepted: onAccepted,
  });
}
