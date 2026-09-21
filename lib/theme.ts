/**
 * lib/theme.ts
 * Theme utilities for light/dark mode management.
 * Uses localStorage key "signspell-theme" to persist user preference.
 * Default: "light" (Phase 2 change from Phase 1's dark-default).
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "signspell-theme";

/** Read theme from localStorage, defaulting to "light" on first visit */
export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }
  return "light";
}

/** Apply theme to <html> element and persist to localStorage */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

/**
 * Inline script string to inject into <head> to prevent theme flash.
 * Must run synchronously before React hydrates.
 * Sets the "dark" class on <html> before the first paint if the user
 * previously chose dark mode.
 */
export const NO_FLASH_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem("${STORAGE_KEY}");
    if (t === "dark") document.documentElement.classList.add("dark");
  } catch(e) {}
})();
`.trim();
