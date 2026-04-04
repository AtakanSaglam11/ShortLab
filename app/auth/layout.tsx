import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion – ShortLab",
  description: "Connecte-toi à ShortLab pour transformer tes vidéos YouTube en scripts viraux pour TikTok et Instagram Reels.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
