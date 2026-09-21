/**
 * lib/handPreference.ts
 * Hand preference storage & types for SignSpell.
 * Stores whether the user signs with their left or right hand.
 * Persisted in localStorage under "signspell-hand-preference".
 */

export type HandPreference = "left" | "right";

const STORAGE_KEY = "signspell-hand-preference";

/** Read hand preference from localStorage. Returns null if user hasn't chosen yet. */
export function getStoredHandPreference(): HandPreference | null {
  if (typeof window === "undefined") return null;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === "left" || val === "right") return val;
  } catch {
    // localStorage unavailable
  }
  return null;
}

/** Save hand preference to localStorage. */
export function setStoredHandPreference(pref: HandPreference): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    // ignore
  }
}
