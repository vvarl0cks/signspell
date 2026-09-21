/**
 * lib/i18n.ts
 * Language management utilities for SignSpell.
 * Supports "en" (English, default) and "id" (Bahasa Indonesia).
 * Persisted in localStorage under "signspell-lang".
 */

export type Language = "en" | "id";

const STORAGE_KEY = "signspell-lang";

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === "en" || val === "id") return val;
  } catch {
    // localStorage unavailable
  }
  return "en";
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}
