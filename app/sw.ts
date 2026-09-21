// SignSpell service worker (Serwist-based)
// Provides app-shell precaching for PWA "Add to Home Screen" experience.
// Does NOT cache camera feed or MediaPipe model inference (network-only for those).
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

declare const self: Window &
  typeof globalThis & {
    __SW_MANIFEST: (string | { url: string; revision: string | null })[];
  };

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }: { request: Request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
