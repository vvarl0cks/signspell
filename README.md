# SignSpell

**Real-time ASL fingerspelling practice — mobile-first PWA**

Practice American Sign Language (ASL) fingerspelling using your phone's front camera or desktop webcam. Built with Next.js 14, MediaPipe HandLandmarker, and a KNN cosine-similarity classifier — no backend, no account required.

---

## Features

- 📱 **Mobile-first** — optimised for smartphone front cameras; works seamlessly with external USB webcams on PC
- 🤚 **Real-time hand tracking** — MediaPipe HandLandmarker (GPU delegate, 60 fps rAF loop)
- 📖 **Inline ASL Guide** — vector SVG line-art diagrams for all A–Z handshapes + plain-language signing tips
- 🔤 **Alphabet practice** — sequential A–Z fingerspelling drill with real-time detection feedback and J/Z motion gesture support
- 📝 **Word practice** — letter-by-letter word practice grouped by difficulty (Easy, Medium, Hard) with session stats
- 📖 **Reading mode** — free signing with live real-time transcript output, word suggestions, and space/clear controls
- 📹 **External webcam support** — multi-stage fallback, automatic device enumeration, and device selection for Logitech/USB webcams
- ⚡ **Auto-request camera** — native camera permission popup triggers automatically on page load
- ☀️ **Theme system** — light mode default with cream background, dark mode toggle, `localStorage` persistence & no-flash inline hydration
- 🎯 **Streak guard** — requires 9 consecutive matching frames before accepting a sign (avoids M/N/S, U/V/K false positives)
- 📲 **PWA installable** — "Add to Home Screen" works on iOS Safari and Android Chrome
- 🔒 **Fully local** — camera feed never leaves the device

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### Available Routes

| Route | Description |
|---|---|
| `/` | Retro-futurist landing page |
| `/practice/alphabet` | Alphabet practice & learn mode (A–Z) |
| `/practice/words` | Word practice mode (Easy/Medium/Hard) |
| `/practice/reading` | Reading mode (free sign to live transcript) |
| `/admin/collect` | Reference dataset builder |
| `/~offline` | PWA offline fallback page |

---

## Architecture Overview

```
app/
├── practice/alphabet/     # Alphabet practice page (Guide toggle + live detection)
├── practice/words/        # Word practice page + useWordPractice hook
├── practice/reading/      # Reading mode page (free sign to transcript)
├── admin/collect/         # Data collection tool
├── api/references/        # Serves asl-alphabet-references.json
├── api/words/             # Serves word-list.json
├── sw.ts                  # Serwist service worker
└── manifest.ts            # Next.js 14 PWA manifest

lib/
├── theme.ts               # Light/dark mode management & no-flash hydration script
├── camera.ts              # CameraManager, isMobile(), Logitech/USB webcam fallback
├── handTracking.ts        # MediaPipe HandTracker, mirror handling, normalization
└── classifier.ts          # KNN cosine-similarity + consecutive-frame streak guard

hooks/
├── useSignRecognition.ts  # Shared sign recognition pipeline hook
├── useCamera.ts           # Camera state machine (autoRequest on mount + device switching)
└── useTheme.ts            # ThemeContext hook

data/
├── asl-alphabet-references.json   # Synthetic reference dataset (A–Z landmarks)
├── asl-alphabet-tips.json         # Plain-language instructions per letter (A–Z)
└── word-list.json                 # Curated word list grouped by difficulty

components/
├── ASLHandshapeSVG.tsx    # Vector SVG line-art handshape diagrams (A–Z)
├── AppHeader.tsx          # Persistent top nav + status indicator + theme toggle
├── BottomNav.tsx          # Mobile bottom tab bar
├── CameraView.tsx         # Video + canvas overlay, camera selector dropdown
├── LetterDisplay.tsx      # Giant monospace target letter with scanline texture
├── PredictionPanel.tsx    # Confidence bar + streak dots
└── ProgressBar.tsx        # A–Z minimap with letter chips
```

---

## Key Engineering Concepts

### 1. Mirror Coordinate Handling
The `<video>` element is CSS-mirrored (`transform: scaleX(-1)`) for a natural selfie view. MediaPipe returns raw (unmirrored) coordinates. We immediately apply `x = 1 − x` to all 21 landmarks after detection — **before** classification and canvas drawing. This keeps the skeleton overlay perfectly aligned with the video.

### 2. Frame Throttling
`requestAnimationFrame` drives the render loop at display refresh rate (60 fps). On mobile devices (`matchMedia('(max-width: 768px)')` or `hardwareConcurrency < 4`), MediaPipe inference runs on every 2nd frame while redrawing the canvas continuously using cached landmarks.

### 3. Streak Guard & Cosine Similarity Classifier
Flattens 21 normalized 3D landmarks into a 63-element vector `[x0,y0,z0,...,x20,y20,z20]`. Computes cosine similarity against reference samples. Requires **9 consecutive frames** with `>0.82` confidence before accepting a letter match, eliminating single-frame false positives for visually similar letters (e.g. M/N/S, U/V/K).

### 4. Logitech & External USB Webcam Compatibility
Desktop PC USB webcams do not report `facingMode: "user"`. On desktop, `buildConstraints()` omits `facingMode` so Chrome/Edge open USB webcams natively. Includes a **3-stage fallback system** and **camera device selector dropdown** when multiple video inputs are available.

### 5. Auto-Request Camera & Instant Load
`useCamera(true)` automatically initiates camera permission prompts on mount. Handles DOM element readiness safely with an instant `readyState` check and fail-safe timeout to prevent promise hanging.

---

## Keyboard Shortcuts (Desktop)

| Key | Action | Mode |
|---|---|---|
| `Space` / `→` | Skip to next letter | Alphabet / Words |
| `←` | Go back to previous letter | Alphabet |
| `G` | Toggle ASL Guide (Diagram + Tips) | Alphabet |
| `W` | Skip word | Words |

---

## Changelog

### v2.4.0 — Menubar, Bilingual System & Dark Mode Fixes (2026-08-10)

- **Persistent Menubar & New Pages** (`components/AppHeader.tsx`, `app/about`, `app/use-cases`, `app/terms`):
  - Added full top navigation menubar containing links to `Home`, `Alphabet`, `Words`, `Reading`, `About`, `Use Cases`, and `Terms of Use`.
  - Created responsive mobile menu drawer for small screens.
  - Implemented rich, bilingual `/about`, `/use-cases`, and `/terms` pages.
- **Language Toggle (EN / ID)** (`lib/i18n.ts`, `data/translations.ts`, `components/LanguageProvider.tsx`):
  - Added bilingual support for English (default) and Bahasa Indonesia.
  - Interactive flag toggle button (🇺🇸 EN / 🇮🇩 ID) in `AppHeader` with `localStorage` persistence.
- **Dark Mode Contrast Fixes** (`app/globals.css`, `components/ASLHandshapeSVG.tsx`):
  - Fixed dark mode visibility for ASL Handshape vector diagrams (`.asl-handshape-container`).
  - Styled SVG path strokes with `--hand-stroke` (`#00FF8C` glowing phosphor in dark mode) and soft contrast fills.
- **Universal "Back to Home" Buttons** (`components/BackToHomeButton.tsx`):
  - Added prominent `← Back to Home` navigation button across all practice modes (`Alphabet`, `Words`, `Reading`), data collector, and info pages.

### v2.3.0 — Hand Preference Toggle & Landing Attribution (2026-08-10)

- **Hand Preference System** (`lib/handPreference.ts`, `components/HandPreferenceProvider.tsx`, `components/HandPreferenceModal.tsx`):
  - Prompts users to select Left or Right signing hand preference before practice starts.
  - Choice persisted in `localStorage` under `signspell-hand-preference`.
  - Accessible anytime via the ✋/🖐️ button in `AppHeader`.
  - Prioritizes user's preferred hand when multiple hands are detected in frame.
  - Displays a gentle inline warning pill in `PredictionPanel` when detected hand handedness differs from stated preference.
- **Landing Page Attribution & GitHub Link** (`app/page.tsx`):
  - Added public domain Wikimedia Commons Gallaudet ASL chart attribution link.
  - Added theme-aware GitHub icon link pointing to `https://github.com/vvarl0cks`.

### v2.2.0 — Camera Robustness & Inline ASL Guide (2026-08-10)

- **External Camera Support** (`lib/camera.ts`, `hooks/useCamera.ts`):
  - Fixed issue where desktop Logitech/USB webcams failed due to `facingMode: "user"` constraint on PC.
  - Implemented 3-stage fallback logic for camera acquisition.
  - Added camera device selector dropdown in `CameraView.tsx`.
- **Auto-Request Camera**: Camera permission prompt now automatically triggers on page load without requiring manual button clicks.
- **Fixed Promise Deadlock**: Resolved HTML5 video `onloadedmetadata` promise hang during camera stream initialization.
- **Inline ASL Guide** (`components/ASLHandshapeSVG.tsx`, `data/asl-alphabet-tips.json`):
  - Vector SVG diagrams for all 26 ASL handshapes (A–Z) with theme-aware styling.
  - Live prediction panel (`PredictionPanel`) remains always visible and active alongside the reference guide.
  - Shortcut `G` toggles the visual guide.

### v2.0.0 — Phase 2 Release (2026-08-10)

- **Word Practice Mode** (`/practice/words`): Letter-by-letter word drills with difficulty selection (Easy/Medium/Hard) and session statistics.
- **Reading Mode** (`/practice/reading`): Real-time free sign transcript with word autocomplete suggestions and Space/Clear controls.
- **Theme System** (`lib/theme.ts`): Light mode default with cream palette, dark mode toggle, `localStorage` persistence, and no-flash inline hydration script.
- **Shared Recognition Hook** (`hooks/useSignRecognition.ts`): Consolidated camera tracking & classifier pipeline.

### v1.0.0 — Initial Release (2026-08-10)

- A–Z alphabet practice, MediaPipe hand tracking, 9-frame streak guard, PWA manifest, and admin data collection tool.

---

## Credits & Attribution

- **ASL Handshape Illustrations**: Based on public domain artwork from Wikimedia Commons ([Gallaudet ASL alphabet chart](https://commons.wikimedia.org/wiki/File:Asl_alphabet_gallaudet_ann.svg)).
- **Hand Tracking**: Powered by Google MediaPipe (`@mediapipe/tasks-vision`).

