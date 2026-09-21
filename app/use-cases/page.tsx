"use client";

import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useLanguage } from "@/components/LanguageProvider";

export default function UseCasesPage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const CASES = [
    {
      icon: "🎓",
      titleEn: "ASL Beginners & Self-Learners",
      titleId: "Pemula & Pembelajar Mandiri ASL",
      descEn: "Master handshapes for A–Z with real-time feedback. Instant confidence checks ensure your fingers and thumb are positioned correctly before advancing.",
      descId: "Kuasai bentuk tangan A–Z dengan umpan balik langsung. Evaluasi posisi jari dan ibu jari secara akurat sebelum berlanjut.",
    },
    {
      icon: "🏫",
      titleEn: "Educators & Sign Language Classrooms",
      titleId: "Pendidik & Kelas Bahasa Isyarat",
      descEn: "Use SignSpell as an interactive classroom tool or daily homework drill. Students practice spelling words interactively with instant computer feedback.",
      descId: "Gunakan SignSpell sebagai alat bantu kelas interaktif atau latihan harian. Siswa mengeja kata dengan penilaian otomatis dari komputer.",
    },
    {
      icon: "📖",
      titleEn: "Live Sign-to-Text Practice (Reading Mode)",
      titleId: "Latihan Isyarat-ke-Teks Langsung (Mode Membaca)",
      descEn: "Build muscle memory by free-signing letters and watching a live transcript form in real time with word autocomplete suggestions.",
      descId: "Latih ingatan otot dengan berisyarat bebas dan melihat transkrip terbentuk secara langsung disertai rekomendasi kata otomatis.",
    },
    {
      icon: "♿",
      titleEn: "Accessibility Researchers & Developers",
      titleId: "Peneliti Aksesibilitas & Pengembang",
      descEn: "Demonstrates high-performance, privacy-preserving computer vision in the browser without server dependencies or costly API calls.",
      descId: "Demonstrasi visi komputer performa tinggi berorientasi privasi di browser tanpa ketergantungan server atau biaya API.",
    },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--void)] text-[var(--ink-high)]">
      <AppHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header & Back Button */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <span className="font-mono-display text-xs tracking-widest uppercase text-[var(--phosphor)] font-bold">
              {isEn ? "Applications" : "Aplikasi & Manfaat"}
            </span>
            <h1 className="font-mono-display text-3xl sm:text-4xl font-bold mt-1 text-[var(--ink-high)]">
              {isEn ? "SignSpell Use Cases" : "Kasus Penggunaan SignSpell"}
            </h1>
          </div>
          <BackToHomeButton />
        </div>

        {/* Introduction */}
        <p className="text-sm leading-relaxed text-[var(--ink-mid)] bg-[var(--panel)] p-4 rounded-xl border border-[var(--border)]">
          {isEn
            ? "SignSpell is built for learners, educators, accessibility advocates, and anyone looking for an engaging way to practice ASL fingerspelling. Here is how SignSpell helps different users:"
            : "SignSpell dirancang untuk pembelajar, pendidik, dan praktisi aksesibilitas yang menginginkan cara interaktif melatih ejaan jari ASL. Berikut cara SignSpell membantu berbagai pengguna:"}
        </p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {CASES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--border)] space-y-3"
            >
              <div className="text-3xl">{item.icon}</div>
              <h2 className="font-mono-display font-bold text-lg text-[var(--ink-high)]">
                {isEn ? item.titleEn : item.titleId}
              </h2>
              <p className="text-xs leading-relaxed text-[var(--ink-mid)]">
                {isEn ? item.descEn : item.descId}
              </p>
            </div>
          ))}
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
