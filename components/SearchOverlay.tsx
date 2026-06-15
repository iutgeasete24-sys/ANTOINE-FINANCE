"use client";

import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const overlayStyle: CSSProperties = {
    backgroundColor: open ? "rgba(0, 0, 0, 0.36)" : "rgba(0, 0, 0, 0)",
    backdropFilter: open ? "blur(16px)" : "blur(0px)",
    WebkitBackdropFilter: open ? "blur(16px)" : "blur(0px)",
    pointerEvents: open ? "auto" : "none"
  };

  return (
    <button
      type="button"
      aria-label="Fermer la recherche"
      onClick={onClose}
      tabIndex={open ? 0 : -1}
      style={overlayStyle}
      className={cn(
        "fixed inset-0 z-[60] min-h-dvh cursor-default transition-all duration-300 ease-out",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    />
  );
}
