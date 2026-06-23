import Link from "next/link";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  action?: {
    href: string;
    label: string;
  };
}

export function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-normal text-mint">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-black leading-tight text-ink">{title}</h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="tap-feedback inline-flex min-h-11 shrink-0 items-center rounded-xl px-2 text-xs font-black text-mint"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
