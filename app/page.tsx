import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ShortLab – Transforme tes vidéos YouTube en scripts viraux",
  description:
    "Colle un lien YouTube et obtiens 3 scripts optimisés pour TikTok et Instagram Reels en 30 secondes grâce à l'IA. Gratuit pour commencer.",
  openGraph: {
    title: "ShortLab – Transforme tes vidéos YouTube en scripts viraux",
    description:
      "Colle un lien YouTube et obtiens 3 scripts optimisés pour TikTok et Instagram Reels en 30 secondes grâce à l'IA.",
    url: "https://shortlab.app",
  },
};

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
