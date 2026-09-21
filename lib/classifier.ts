/**
 * classifier.ts
 * KNN cosine-similarity ASL letter classifier for SignSpell.
 *
 * Strategy:
 * - Flatten normalized 21-landmark pose to a 63-element float vector [x0,y0,z0,...,x20,y20,z20]
 * - Compute cosine similarity against all reference samples
 * - Take the best matching letter (top-1 KNN, k=1 per letter then averaged)
 * - Apply a consecutive-frame streak guard: require N_REQUIRED frames of the
 *   same letter above CONFIDENCE_THRESHOLD before emitting an accepted match.
 *   This prevents single-frame false positives on visually similar letters
 *   like M/N/S, U/V/K, and E/O/C.
 *
 * J and Z:
 * - These are motion gestures (air-drawn strokes) that cannot be classified
 *   from a single static frame.
 * - They are included in the practice queue with isMotion=true.
 * - The classifier will never emit J or Z as a prediction.
 */

import { type HandLandmarks, normalizeLandmarks } from "./handTracking";

// ─── Tuning parameters ───────────────────────────────────────────────────────
/** Minimum cosine similarity to even consider a match */
const CONFIDENCE_THRESHOLD = 0.82;
/** Number of consecutive frames required to accept a match */
const N_REQUIRED_FRAMES = 9;
// ─────────────────────────────────────────────────────────────────────────────

export interface ReferenceEntry {
  letter: string;
  landmarks: Array<{ x: number; y: number; z: number }>;
  motion?: boolean; // true for J and Z
}

export interface ClassificationResult {
  letter: string;
  confidence: number; // 0–1 cosine similarity
  consecutiveCount: number;
  isAccepted: boolean; // true when streak requirement met
  allScores: Array<{ letter: string; score: number }>;
}

/** Flatten normalized landmarks into a 63-element vector */
function flattenLandmarks(landmarks: HandLandmarks): number[] {
  const result: number[] = [];
  for (const lm of landmarks) {
    result.push(lm.x, lm.y, lm.z);
  }
  return result;
}

/** Cosine similarity between two equal-length vectors */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

export class Classifier {
  private references: ReferenceEntry[] = [];
  private lastLetter: string | null = null;
  private streak = 0;

  loadReferences(refs: ReferenceEntry[]): void {
    // Filter out motion gestures — they can never be static-frame classified
    this.references = refs.filter((r) => !r.motion);
  }

  /**
   * Classify a hand pose.
   * Returns null if no hand is visible or no references loaded.
   */
  classify(rawLandmarks: HandLandmarks): ClassificationResult | null {
    if (!rawLandmarks || rawLandmarks.length === 0) {
      // Hand lost — reset streak
      this.lastLetter = null;
      this.streak = 0;
      return null;
    }

    if (this.references.length === 0) return null;

    // Normalize landmarks (translate to wrist, scale by wrist→middleMCP distance)
    const normalized = normalizeLandmarks(rawLandmarks);
    const queryVec = flattenLandmarks(normalized);

    // Score each reference entry
    const rawScores = this.references.map((ref) => {
      const refVec = ref.landmarks.flatMap((lm) => [lm.x, lm.y, lm.z]);
      return {
        letter: ref.letter,
        score: cosineSimilarity(queryVec, refVec),
      };
    });

    // Group by letter and take the max score per letter
    const bestPerLetter = new Map<string, number>();
    for (const { letter, score } of rawScores) {
      const prev = bestPerLetter.get(letter) ?? 0;
      if (score > prev) bestPerLetter.set(letter, score);
    }

    const allScores = Array.from(bestPerLetter.entries())
      .map(([letter, score]) => ({ letter, score }))
      .sort((a, b) => b.score - a.score);

    const top = allScores[0];
    const confidence = top?.score ?? 0;
    const topLetter = top?.letter ?? "?";

    // Consecutive frame guard
    if (topLetter === this.lastLetter && confidence >= CONFIDENCE_THRESHOLD) {
      this.streak++;
    } else {
      this.streak = confidence >= CONFIDENCE_THRESHOLD ? 1 : 0;
      this.lastLetter = confidence >= CONFIDENCE_THRESHOLD ? topLetter : null;
    }

    return {
      letter: confidence >= CONFIDENCE_THRESHOLD ? topLetter : "?",
      confidence,
      consecutiveCount: this.streak,
      isAccepted:
        this.streak >= N_REQUIRED_FRAMES &&
        confidence >= CONFIDENCE_THRESHOLD,
      allScores,
    };
  }

  resetStreak(): void {
    this.lastLetter = null;
    this.streak = 0;
  }

  get streakRequirement(): number {
    return N_REQUIRED_FRAMES;
  }

  get confidenceThreshold(): number {
    return CONFIDENCE_THRESHOLD;
  }
}
