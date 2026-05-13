"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Lightbulb,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/videos", label: "Vidéos", icon: Film },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/shorzy", label: "Acquisition Shorzy", icon: Sparkles },
  { href: "/settings", label: "Réglages", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r bg-card md:flex">
      <div className="flex h-14 items-center px-5 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-500" />
          <span className="text-sm font-semibold">Insta Analytics</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        v0.1 · local mode
      </div>
    </aside>
  );
}
