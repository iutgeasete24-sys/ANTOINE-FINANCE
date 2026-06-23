import { cn } from "@/utils/cn";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "from-white/6 via-white/12 to-white/6 animate-pulse rounded-2xl bg-gradient-to-r",
        className
      )}
    />
  );
}
