import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shortlab.app"),
  title: {
    default: "ShortLab – Transforme tes vidéos YouTube en scripts viraux",
    template: "%s – ShortLab",
  },
  description:
    "Colle un lien YouTube et obtiens 3 scripts optimisés pour TikTok et Instagram Reels en 30 secondes grâce à l'IA.",
  keywords: ["scripts viraux", "TikTok", "Instagram Reels", "YouTube", "contenu court", "IA", "générateur de scripts"],
  authors: [{ name: "ShortLab" }],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ShortLab",
    title: "ShortLab – Transforme tes vidéos YouTube en scripts viraux",
    description:
      "Colle un lien YouTube et obtiens 3 scripts optimisés pour TikTok et Instagram Reels en 30 secondes grâce à l'IA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShortLab – Transforme tes vidéos YouTube en scripts viraux",
    description:
      "Colle un lien YouTube et obtiens 3 scripts optimisés pour TikTok et Instagram Reels en 30 secondes grâce à l'IA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#f0f0ff]">
        {children}
      </body>
    </html>
  );
}
