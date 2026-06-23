"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitCompare, Home, PieChart, Search, Star } from "lucide-react";
import { cn } from "@/utils/cn";

const items = [
  { href: "/analysis", label: "Analyse", icon: Home },
  { href: "/explorer", label: "Explorer", icon: Search },
  { href: "/compare", label: "Comparer", icon: GitCompare },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/portfolio", label: "Portf.", ariaLabel: "Portefeuille", icon: PieChart }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-1/2 z-50 w-[calc(100vw-1.25rem)] max-w-xl -translate-x-1/2 rounded-[1.25rem] border border-ink/10 bg-paper/90 p-1.5 shadow-soft backdrop-blur-xl"
    >
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.ariaLabel ?? item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "tap-feedback flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl text-[9px] font-black outline-none transition-colors sm:text-[10px]",
                "text-graphite hover:bg-mist hover:text-ink focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night",
                active && "bg-mint/10 text-mint shadow-glow"
              )}
            >
              <Icon size={19} strokeWidth={active ? 2.6 : 2.25} className="shrink-0" />
              <span className="max-w-full truncate leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
