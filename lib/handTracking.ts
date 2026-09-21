/**
 * handTracking.ts
 * Wrapper around MediaPipe HandLandmarker (@mediapipe/tasks-vision).
 *
 * Responsibilities:
 *  - MediaPipe initialization via CDN WASM runtime
 *  - Frame-throttled detection (runs every frame on desktop, alternate frames on mobile)
 *  - Mirror correction: transforms raw MediaPipe landmarks (x) into mirrored
 *    canvas space (1 - x) IMMEDIATELY after detection so coordinates align
 *    with the CSS-mirrored <video> element (transform: scaleX(-1)).
 *  - Extracts handedness ("left" | "right") for detected hands.
 *  - Normalization: shifts wrist (landmark 0) to origin, scales by wrist->middleMCP
 *  - Canvas rendering: draws 21 joints + 5 finger bone connections
 */

import {
  FilesetResolver,
  HandLandmarker,
  type Landmark,
} from "@mediapipe/tasks-vision";
import { isMobile } from "./camera";

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type HandLandmarks = NormalizedLandmark[];

export interface DetectedHandInfo {
  landmarks: HandLandmarks;
  handedness: "left" | "right";
  score: number;
}

// MediaPipe 21 landmark connection pairs (finger bones)
const HAND_CONNECTIONS: Array<[number, number]> = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [9, 10], [10, 11], [11, 12],
  // Ring
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm cross-connects
  [5, 9], [9, 13], [13, 17],
];

/**
 * Normalize 21 landmarks for invariant classification:
 * 1. Translate wrist (landmark 0) to origin (0, 0, 0)
 * 2. Scale by Euclidean distance from wrist to middle finger MCP (landmark 9)
 */
export function normalizeLandmarks(landmarks: HandLandmarks): HandLandmarks {
  if (landmarks.length === 0) return [];
  const wrist = landmarks[0];
  const middleMCP = landmarks[9];

  const dx = middleMCP.x - wrist.x;
  const dy = middleMCP.y - wrist.y;
  const dz = middleMCP.z - wrist.z;
  const scale = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1.0;

  return landmarks.map((lm) => ({
    x: (lm.x - wrist.x) / scale,
    y: (lm.y - wrist.y) / scale,
    z: (lm.z - wrist.z) / scale,
    visibility: lm.visibility,
  }));
}

export class HandTracker {
  private landmarker: HandLandmarker | null = null;
  private frameCount = 0;
  private isInitialized = false;
  private mobile: boolean;

  // Cached detected hands for smooth canvas drawing between throttled frames
  private lastHands: DetectedHandInfo[] = [];

  constructor() {
    this.mobile = isMobile();
  }

  async init(): Promise<void> {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    this.landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
      minHandDetectionConfidence: 0.55,
      minHandPresenceConfidence: 0.55,
      minTrackingConfidence: 0.5,
    });

    this.isInitialized = true;
  }

  /**
   * Run detection for a single video frame.
   * Returns mirrored landmarks and handedness ready for classification and drawing.
   */
  detectFrame(
    videoEl: HTMLVideoElement,
    timestamp: number
  ): { hands: DetectedHandInfo[]; landmarks: HandLandmarks; wasThrottled: boolean } {
    if (!this.landmarker || !this.isInitialized) {
      return {
        hands: [],
        landmarks: this.lastHands[0]?.landmarks ?? [],
        wasThrottled: true,
      };
    }

    this.frameCount++;

    // THROTTLING: mobile skips every other frame
    const shouldSkip = this.mobile && this.frameCount % 2 !== 0;

    if (shouldSkip) {
      return {
        hands: this.lastHands,
        landmarks: this.lastHands[0]?.landmarks ?? [],
        wasThrottled: true,
      };
    }

    if (
      videoEl.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      videoEl.videoWidth === 0
    ) {
      return {
        hands: this.lastHands,
        landmarks: this.lastHands[0]?.landmarks ?? [],
        wasThrottled: true,
      };
    }

    const results = this.landmarker.detectForVideo(videoEl, timestamp);

    if (!results.worldLandmarks || results.worldLandmarks.length === 0) {
      this.lastHands = [];
      return { hands: [], landmarks: [], wasThrottled: false };
    }

    // Process all detected hands
    const detectedHands: DetectedHandInfo[] = results.worldLandmarks.map(
      (rawLandmarks, i) => {
        // MIRROR CORRECTION: transform x = 1 - x
        const mirrored: HandLandmarks = rawLandmarks.map((lm: Landmark) => ({
          x: 1 - lm.x,
          y: lm.y,
          z: lm.z,
          visibility: lm.visibility,
        }));

        // Handedness output from MediaPipe ("Left" or "Right")
        const handednessObj = results.handednesses?.[i]?.[0];
        const categoryName = handednessObj?.categoryName?.toLowerCase();
        // In selfie mirrored view, MediaPipe's "Left" category corresponds to user's Right hand in selfie view, and vice versa
        // We normalize so "left" means user's Left hand and "right" means user's Right hand
        const handedness: "left" | "right" =
          categoryName === "left" ? "right" : "left";

        const score = handednessObj?.score ?? 0.9;

        return {
          landmarks: mirrored,
          handedness,
          score,
        };
      }
    );

    this.lastHands = detectedHands;

    return {
      hands: detectedHands,
      landmarks: detectedHands[0]?.landmarks ?? [],
      wasThrottled: false,
    };
  }

  /**
   * Draw hand skeleton on target canvas.
   */
  drawLandmarks(
    canvas: HTMLCanvasElement,
    landmarksArray: HandLandmarks[] | HandLandmarks
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const handsToDraw: HandLandmarks[] = Array.isArray(landmarksArray[0])
      ? (landmarksArray as HandLandmarks[])
      : landmarksArray.length > 0
      ? [landmarksArray as HandLandmarks]
      : [];

    if (handsToDraw.length === 0) return;

    for (const landmarks of handsToDraw) {
      const W = canvas.width;
      const H = canvas.height;

      // Draw bone connections
      ctx.strokeStyle = "rgba(0, 255, 140, 0.6)";
      ctx.lineWidth = Math.max(2, Math.round(W / 240));

      for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
        const start = landmarks[startIdx];
        const end = landmarks[endIdx];
        if (!start || !end) continue;

        ctx.beginPath();
        ctx.moveTo(start.x * W, start.y * H);
        ctx.lineTo(end.x * W, end.y * H);
        ctx.stroke();
      }

      // Draw joint dots
      for (let i = 0; i < landmarks.length; i++) {
        const lm = landmarks[i];
        if (!lm) continue;
        const x = lm.x * W;
        const y = lm.y * H;

        ctx.beginPath();
        ctx.arc(x, y, i === 0 ? 5 : i % 4 === 0 ? 4 : 3, 0, 2 * Math.PI);
        ctx.fillStyle = i === 0 ? "#FFB347" : "var(--phosphor)";
        ctx.fill();
      }
    }
  }

  destroy(): void {
    if (this.landmarker) {
      this.landmarker.close();
      this.landmarker = null;
    }
    this.isInitialized = false;
  }
}
