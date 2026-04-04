import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import HowItWorks from "@/components/landing/HowItWorks";
import ScriptPreview from "@/components/landing/ScriptPreview";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import AnimateOnScroll from "@/components/landing/AnimateOnScroll";

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
      <AnimateOnScroll />
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <ScriptPreview />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
