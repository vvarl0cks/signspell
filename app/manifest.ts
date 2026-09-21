import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SignSpell — ASL Fingerspelling Practice",
    short_name: "SignSpell",
    description:
      "Practice ASL fingerspelling with real-time hand tracking. Works on mobile and desktop.",
    start_url: "/practice/alphabet",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070709",
    theme_color: "#070709",
    categories: ["education", "health", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  };
}
