import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insta Analytics",
  description: "Analytics Instagram personnelles — honnêtes et denses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Sidebar />
        <div className="md:pl-56">{children}</div>
      </body>
    </html>
  );
}
