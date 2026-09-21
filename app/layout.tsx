import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HandPreferenceProvider } from "@/components/HandPreferenceProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import HandPreferenceModal from "@/components/HandPreferenceModal";
import { NO_FLASH_SCRIPT } from "@/lib/theme";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SignSpell — ASL Fingerspelling Practice",
    template: "%s | SignSpell",
  },
  description:
    "Practice ASL (American Sign Language) fingerspelling with real-time hand tracking. Works on mobile and desktop cameras.",
  keywords: ["ASL", "sign language", "fingerspelling", "practice", "hand tracking", "MediaPipe"],
  authors: [{ name: "SignSpell" }],
  creator: "SignSpell",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SignSpell",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    title: "SignSpell — ASL Fingerspelling Practice",
    description: "Real-time ASL fingerspelling practice with hand tracking. Mobile-first PWA.",
    siteName: "SignSpell",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F2EC" },
    { media: "(prefers-color-scheme: dark)",  color: "#070709" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        {/* No-flash theme script: runs synchronously before first paint */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="bg-[var(--void)] text-[var(--ink-high)] antialiased min-h-dvh transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <HandPreferenceProvider>
              {children}
              <HandPreferenceModal />
            </HandPreferenceProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
