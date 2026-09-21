"use client";

import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useLanguage } from "@/components/LanguageProvider";

export default function TermsPage() {
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
              {isEn ? "Legal & Privacy" : "Legal & Privasi"}
            </span>
            <h1 className="font-mono-display text-3xl sm:text-4xl font-bold mt-1 text-[var(--ink-high)]">
              {isEn ? "Terms of Use & Privacy" : "Ketentuan Penggunaan & Privasi"}
            </h1>
          </div>
          <BackToHomeButton />
        </div>

        <div className="space-y-6">
          {/* Section 1: Privacy */}
          <div className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-3">
            <h2 className="font-mono-display font-bold text-lg text-[var(--ink-high)] flex items-center gap-2">
              <span>🔒</span>
              <span>{isEn ? "1. Camera & Data Privacy Guarantee" : "1. Jaminan Privasi Kamera & Data"}</span>
            </h2>
            <p className="text-xs leading-relaxed text-[var(--ink-mid)]">
              {isEn
                ? "SignSpell processes all camera video frames locally inside your Web browser using client-side WebAssembly (MediaPipe). Camera feeds are never uploaded, recorded, streamed, or stored on remote servers. Your camera permissions can be revoked at any time via browser site settings."
                : "SignSpell memproses semua bingkai video kamera secara lokal di dalam browser Anda menggunakan WebAssembly client-side (MediaPipe). Umpan kamera tidak pernah diunggah, direkam, disiarkan, atau disimpan di server jauh. Izin kamera dapat dicabut kapan saja melalui setelan browser."}
            </p>
          </div>

          {/* Section 2: Educational Use */}
          <div className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-3">
            <h2 className="font-mono-display font-bold text-lg text-[var(--ink-high)] flex items-center gap-2">
              <span>📚</span>
              <span>{isEn ? "2. Educational Purpose Disclaimer" : "2. Penafian Tujuan Edukasi"}</span>
            </h2>
            <p className="text-xs leading-relaxed text-[var(--ink-mid)]">
              {isEn
                ? "SignSpell is designed as a practice tool for learning ASL fingerspelling. It is not a replacement for certified sign language instruction or professional translation services."
                : "SignSpell dirancang sebagai alat bantu latihan ejaan jari ASL. Aplikasi ini bukan pengganti instruksi bahasa isyarat tersertifikasi atau layanan penerjemahan profesional."}
            </p>
          </div>

          {/* Section 3: Asset Attribution */}
          <div className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-3">
            <h2 className="font-mono-display font-bold text-lg text-[var(--ink-high)] flex items-center gap-2">
              <span>🎨</span>
              <span>{isEn ? "3. Asset License & Attribution" : "3. Lisensi Aset & Atribusi"}</span>
            </h2>
            <p className="text-xs leading-relaxed text-[var(--ink-mid)]">
              {isEn
                ? "ASL handshape vector diagrams are derived from public domain artwork ('Asl alphabet gallaudet ann.svg' from Wikimedia Commons, PD-self license). Software source code is open for educational and non-commercial exploration."
                : "Diagram vektor bentuk tangan ASL berasal dari karya domain publik ('Asl alphabet gallaudet ann.svg' dari Wikimedia Commons, lisensi PD-self). Kode sumber terbuka untuk keperluan edukasi dan eksplorasi non-komersial."}
            </p>
          </div>
        </div>

        {/* Back button */}
        <div className="pt-4 flex justify-center">
          <BackToHomeButton />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
