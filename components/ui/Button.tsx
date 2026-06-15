import Link from "next/link";
import { cn } from "@/utils/cn";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps extends BaseProps {
  type?: "button" | "submit";
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

interface LinkButtonProps extends BaseProps {
  href: string;
  variant?: "primary" | "secondary";
}

const variants = {
  primary: "bg-ink text-night shadow-glow hover:bg-ink/90",
  secondary: "border border-white/10 bg-white/[0.07] text-ink hover:bg-white/10"
};

export function Button({
  children,
  className,
  onClick,
  type = "button",
  variant = "primary"
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "tap-feedback inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black outline-none focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  className,
  href,
  variant = "primary"
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "tap-feedback inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black outline-none focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night",
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
