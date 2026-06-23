"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface PremiumSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface PremiumSelectProps {
  label?: string;
  value: string;
  options: PremiumSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PremiumSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Sélectionner"
}: PremiumSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div className="relative">
      {label && (
        <p className="mb-1.5 text-xs font-bold uppercase tracking-normal text-graphite/80">
          {label}
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="tap-feedback flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-left text-sm font-black text-ink outline-none focus:border-mint/50 focus:ring-4 focus:ring-mint/10"
      >
        <span className={cn("truncate", !selected && "text-graphite")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={17}
          className={cn("shrink-0 text-graphite transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="animate-soft-enter absolute left-0 right-0 top-[calc(100%+0.45rem)] z-50 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-paper/95 p-2 shadow-soft backdrop-blur-2xl">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "tap-feedback flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left",
                  active ? "bg-mint/[0.14] text-mint" : "text-ink hover:bg-white/[0.08]"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="mt-0.5 block truncate text-xs font-semibold text-graphite">
                      {option.description}
                    </span>
                  )}
                </span>
                {active && <Check size={16} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
