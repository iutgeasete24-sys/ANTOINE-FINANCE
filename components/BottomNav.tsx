"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, PieChart, UserCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const items = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/analysis", label: "Analyse", icon: BarChart3 },
  { href: "/portfolio", label: "Portefeuille", icon: PieChart },
  { href: "/profile", label: "Profil", icon: UserCircle }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-1/2 z-50 max-w-[calc(100vw-1rem)] -translate-x-1/2 rounded-[1.25rem] border border-white/20 bg-black/40 p-1.5 shadow-lg shadow-black/20 backdrop-blur-xl dark:bg-zinc-900/70"
    >
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "tap-feedback flex h-14 w-[4.375rem] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-black outline-none transition-colors",
                "text-graphite hover:bg-white/[0.08] hover:text-ink focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night",
                active && "bg-white/10 text-mint shadow-glow"
              )}
            >
              <Icon
                size={19}
                strokeWidth={active ? 2.6 : 2.25}
                className="shrink-0"
              />
              <span className="max-w-full truncate leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
