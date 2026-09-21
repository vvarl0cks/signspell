"use client";

import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useLanguage } from "@/components/LanguageProvider";

export default function AboutPage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--void)] text-[var(--ink-high)]">
      <AppHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header & Back Button */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <span className="font-mono-display text-xs tracking-widest uppercase text-[var(--phosphor)] font-bold">
              {isEn ? "Information" : "Informasi"}
            </span>
            <h1 className="font-mono-display text-3xl sm:text-4xl font-bold mt-1 text-[var(--ink-high)]">
              {isEn ? "About SignSpell" : "Tentang SignSpell"}
            </h1>
          </div>
          <BackToHomeButton />
        </div>

        {/* Hero Section */}
        <div className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--phosphor)] flex items-center justify-center text-2xl font-bold font-mono-display text-[var(--phosphor)]">
            SS
          </div>
          <h2 className="font-mono-display text-xl font-bold text-[var(--ink-high)]">
            {isEn
              ? "Interactive Real-Time ASL Fingerspelling Practice"
              : "Latihan Isyarat Jari ASL Real-Time & Interaktif"}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--ink-mid)]">
            {isEn
              ? "SignSpell is a modern, privacy-first web application designed to help learners master American Sign Language (ASL) fingerspelling (A–Z) using instant computer vision AI hand tracking."
              : "SignSpell adalah aplikasi web modern berorientasi privasi yang dirancang untuk membantu pengguna menguasai ejaan jari Bahasa Isyarat Amerika (ASL) menggunakan teknologi pelacakan tangan AI real-time."}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-2">
            <div className="text-2xl">🤖</div>
            <h3 className="font-mono-display font-bold text-base text-[var(--ink-high)]">
              {isEn ? "MediaPipe Hand Tracking AI" : "AI Pelacak Tangan MediaPipe"}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--ink-mid)]">
              {isEn
                ? "Runs Google MediaPipe Tasks Vision on-device at 60 fps to detect 21 3D hand joints and classify sign shapes with cosine similarity vector matching."
                : "Menjalankan Google MediaPipe Tasks Vision di perangkat secara lokal (60 fps) untuk mendeteksi 21 sendi tangan 3D dan mengklasifikasikan bentuk isyarat."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-2">
            <div className="text-2xl">🔒</div>
            <h3 className="font-mono-display font-bold text-base text-[var(--ink-high)]">
              {isEn ? "100% On-Device Privacy" : "Privasi 100% Lokal di Perangkat"}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--ink-mid)]">
              {isEn
                ? "Your camera feed is processed directly inside your browser. No video, audio, or biometric data is ever recorded, stored, or transmitted to any server."
                : "Umpan kamera Anda diproses langsung di dalam browser. Tidak ada video, suara, atau data biometrik yang direkam atau dikirim ke server mana pun."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-2">
            <div className="text-2xl">🎨</div>
            <h3 className="font-mono-display font-bold text-base text-[var(--ink-high)]">
              {isEn ? "Theme & Hand Preference" : "Tema & Preferensi Tangan"}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--ink-mid)]">
              {isEn
                ? "Includes Light/Dark mode, vector SVG handshape diagrams, and custom Left/Right dominant hand tracking optimization."
                : "Dilengkapi mode Terang/Gelap, diagram SVG vektor bentuk tangan, serta optimasi pelacakan tangan dominan Kiri/Kanan."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-2">
            <div className="text-2xl">⚡</div>
            <h3 className="font-mono-display font-bold text-base text-[var(--ink-high)]">
              {isEn ? "Progressive Web App (PWA)" : "Aplikasi Web Progresif (PWA)"}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--ink-mid)]">
              {isEn
                ? "Installable on iOS, Android, and Desktop PC with offline caching, fast loading, and zero app store installation hassle."
                : "Dapat diinstal di iOS, Android, dan PC Desktop dengan caching offline, pemuatan cepat, dan tanpa ribet instalasi app store."}
            </p>
          </div>
        </div>

        {/* Back link at bottom */}
        <div className="pt-4 flex justify-center">
          <BackToHomeButton />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
