import { cn } from "@/utils/cn";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "article" | "div";
}

export function SectionCard({
  children,
  className,
  as: Tag = "section"
}: SectionCardProps) {
  return (
    <Tag className={cn("premium-card animate-soft-enter rounded-2xl p-4", className)}>
      {children}
    </Tag>
  );
}
