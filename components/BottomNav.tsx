"use client";

import { useEffect, useRef, useState } from "react";
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

function getScrollY() {
  if (typeof window === "undefined") return 0;
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function BottomNav() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    function updateCompactMode() {
      const currentScrollY = getScrollY();
      const scrollingDown = currentScrollY > lastScrollYRef.current + 8;
      const scrollingUp = currentScrollY < lastScrollYRef.current - 8;

      if (scrollingDown && currentScrollY > 80) {
        setCompact(true);
      }

      if (scrollingUp || currentScrollY < 24) {
        setCompact(false);
      }

      lastScrollYRef.current = Math.max(currentScrollY, 0);
      tickingRef.current = false;
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(updateCompactMode);
    }

    lastScrollYRef.current = getScrollY();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Navigation principale"
      className={cn(
        "fixed left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/20 bg-black/40 shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 ease-out dark:bg-zinc-900/70",
        "bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] max-w-[calc(100vw-1rem)]",
        compact ? "px-1.5 py-1.5" : "px-2.5 py-2"
      )}
    >
      <div className={cn("flex items-center transition-all duration-300 ease-out", compact ? "gap-1" : "gap-1.5")}>
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
                "tap-feedback group relative grid shrink-0 place-items-center rounded-full transition-all duration-300 ease-out",
                "text-graphite outline-none hover:bg-white/[0.08] hover:text-ink focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night",
                compact ? "h-11 w-11" : "h-12 w-12",
                active && "bg-white/10 text-ink shadow-glow"
              )}
              aria-label={item.label}
            >
              <Icon
                size={compact ? 20 : 21}
                strokeWidth={active ? 2.6 : 2.25}
                className={cn(
                  "shrink-0 transition-all duration-300 ease-out",
                  active ? "scale-105 text-mint" : "scale-100"
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bottom-1 h-1 w-1 rounded-full bg-mint shadow-[0_0_12px_rgba(79,214,156,0.8)] transition-all duration-300 ease-out",
                  active ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
