import { Language } from "@/lib/i18n";

export interface Translations {
  // Nav & Header
  navHome: string;
  navAlphabet: string;
  navWords: string;
  navReading: string;
  navAbout: string;
  navUseCases: string;
  navTerms: string;
  backToHome: string;
  
  // Home Page
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroDesc: string;
  startPractice: string;
  noAccountNeeded: string;
  privacyNotice: string;
  
  // Modes & Features
  modeAlphabetTitle: string;
  modeAlphabetDesc: string;
  modeWordsTitle: string;
  modeWordsDesc: string;
  modeReadingTitle: string;
  modeReadingDesc: string;
  
  // Camera & Tracker
  enableCamera: string;
  cameraAccessNeeded: string;
  cameraPrivacyNotice: string;
  waitingPermission: string;
  cameraDeniedTitle: string;
  cameraErrorTitle: string;
  tryAgain: string;
  trackerLive: string;
  trackerLoading: string;
  trackerError: string;
  
  // Alphabet & Practice
  guideOn: string;
  guideOff: string;
  letterProgress: string;
  handshapeRef: string;
  signingTip: string;
  skipLetter: string;
  skipWord: string;
  detected: string;
  confidence: string;
  holdStreak: string;
  heldStatus: string;
  
  // Hand Preference
  handPrefTitle: string;
  handPrefDesc: string;
  leftHand: string;
  rightHand: string;
  leftDominant: string;
  rightDominant: string;
  mismatchWarning: string;

  // Reading Mode
  liveTranscript: string;
  suggestions: string;
  spaceBtn: string;
  clearBtn: string;
  startSigningHint: string;

  // Words Practice
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;
  wordsCompleted: string;
  lettersCompleted: string;
  avgTimeLetter: string;
  sessionStats: string;

  // Footer & Credits
  footerAttribution: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    navHome: "Home",
    navAlphabet: "Alphabet",
    navWords: "Words",
    navReading: "Reading",
    navAbout: "About",
    navUseCases: "Use Cases",
    navTerms: "Terms",
    backToHome: "Back to Home",

    heroTitle1: "Sign",
    heroTitle2: "Spell",
    heroSubtitle: "ASL Fingerspelling Practice",
    heroDesc: "Practice American Sign Language fingerspelling with real-time hand tracking. Works on mobile and desktop cameras.",
    startPractice: "Start Practice",
    noAccountNeeded: "A → Z alphabet · words · reading mode · No account needed",
    privacyNotice: "Camera is used locally only. No video is recorded or transmitted.",

    modeAlphabetTitle: "Alphabet",
    modeAlphabetDesc: "A–Z sequential drill",
    modeWordsTitle: "Words",
    modeWordsDesc: "Spell full words",
    modeReadingTitle: "Reading",
    modeReadingDesc: "Live sign transcript",

    enableCamera: "Enable Camera",
    cameraAccessNeeded: "Camera Access Needed",
    cameraPrivacyNotice: "SignSpell uses your camera to track hand signs in real time. No video is recorded or stored.",
    waitingPermission: "Waiting for permission…",
    cameraDeniedTitle: "Camera Access Denied",
    cameraErrorTitle: "Camera Error",
    tryAgain: "Try Again",
    trackerLive: "Live",
    trackerLoading: "Loading…",
    trackerError: "Tracker unavailable",

    guideOn: "Guide: ON",
    guideOff: "Guide: OFF",
    letterProgress: "Letter",
    handshapeRef: "Handshape Reference",
    signingTip: "Signing Tip",
    skipLetter: "Skip →",
    skipWord: "Skip Word ⇥",
    detected: "Detected",
    confidence: "Confidence",
    holdStreak: "Hold streak",
    heldStatus: "✓ HELD",

    handPrefTitle: "Which hand do you sign with?",
    handPrefDesc: "Select your dominant signing hand. SignSpell uses this to optimize AI hand tracking and guide your practice.",
    leftHand: "Left Hand",
    rightHand: "Right Hand",
    leftDominant: "Left-dominant",
    rightDominant: "Right-dominant",
    mismatchWarning: "Detected hand differs from your selected preference.",

    liveTranscript: "Live Transcript",
    suggestions: "Suggestions:",
    spaceBtn: "Space ⎵",
    clearBtn: "Clear",
    startSigningHint: "Start signing to build a transcript…",

    difficultyEasy: "Easy",
    difficultyMedium: "Medium",
    difficultyHard: "Hard",
    wordsCompleted: "Words",
    lettersCompleted: "Letters",
    avgTimeLetter: "Avg/Letter",
    sessionStats: "Session Statistics",

    footerAttribution: "ASL alphabet illustrations: 'Asl alphabet gallaudet ann.svg' from Wikimedia Commons — Public Domain.",
  },

  id: {
    navHome: "Beranda",
    navAlphabet: "Alfabet",
    navWords: "Kata",
    navReading: "Membaca",
    navAbout: "Tentang",
    navUseCases: "Kasus Penggunaan",
    navTerms: "Ketentuan",
    backToHome: "Kembali ke Beranda",

    heroTitle1: "Sign",
    heroTitle2: "Spell",
    heroSubtitle: "Latihan Bahasa Isyarat ASL",
    heroDesc: "Latihan ejaan jari Bahasa Isyarat ASL dengan pelacakan tangan real-time. Bekerja di kamera HP dan webcam PC.",
    startPractice: "Mulai Latihan",
    noAccountNeeded: "Alfabet A → Z · Latihan kata · Mode membaca · Tanpa akun",
    privacyNotice: "Kamera digunakan lokal saja. Video tidak direkam atau dikirim.",

    modeAlphabetTitle: "Alfabet",
    modeAlphabetDesc: "Latihan berurutan A–Z",
    modeWordsTitle: "Kata",
    modeWordsDesc: "Eja kata lengkap",
    modeReadingTitle: "Membaca",
    modeReadingDesc: "Transkrip isyarat langsung",

    enableCamera: "Aktifkan Kamera",
    cameraAccessNeeded: "Akses Kamera Diperlukan",
    cameraPrivacyNotice: "SignSpell menggunakan kamera untuk melacak isyarat tangan secara real-time. Tidak ada video yang disimpan.",
    waitingPermission: "Menunggu izin kamera…",
    cameraDeniedTitle: "Akses Kamera Ditolak",
    cameraErrorTitle: "Kamera Bermasalah",
    tryAgain: "Coba Lagi",
    trackerLive: "Aktif",
    trackerLoading: "Memuat…",
    trackerError: "Tracker tidak tersedia",

    guideOn: "Panduan: AKTIF",
    guideOff: "Panduan: NONAKTIF",
    letterProgress: "Huruf",
    handshapeRef: "Referensi Bentuk Tangan",
    signingTip: "Tips Isyarat",
    skipLetter: "Lewati →",
    skipWord: "Lewati Kata ⇥",
    detected: "Terdeteksi",
    confidence: "Akurasi",
    holdStreak: "Tahan isyarat",
    heldStatus: "✓ BERHASIL",

    handPrefTitle: "Tangan mana yang Anda gunakan untuk berisyarat?",
    handPrefDesc: "Pilih tangan dominan Anda. SignSpell menggunakannya untuk mengoptimalkan pelacakan AI.",
    leftHand: "Tangan Kiri",
    rightHand: "Tangan Kanan",
    leftDominant: "Dominan Kiri",
    rightDominant: "Dominan Kanan",
    mismatchWarning: "Tangan yang terdeteksi berbeda dari preferensi yang Anda pilih.",

    liveTranscript: "Transkrip Langsung",
    suggestions: "Saran Kata:",
    spaceBtn: "Spasi ⎵",
    clearBtn: "Hapus",
    startSigningHint: "Mulai berisyarat untuk membuat transkrip…",

    difficultyEasy: "Mudah",
    difficultyMedium: "Sedang",
    difficultyHard: "Sulit",
    wordsCompleted: "Kata",
    lettersCompleted: "Huruf",
    avgTimeLetter: "Rata-rata/Huruf",
    sessionStats: "Statistik Sesi",

    footerAttribution: "Ilustrasi alfabet ASL: 'Asl alphabet gallaudet ann.svg' dari Wikimedia Commons — Public Domain.",
  },
};
