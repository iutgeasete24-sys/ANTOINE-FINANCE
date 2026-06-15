import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function Loading() {
  return (
    <main className="space-y-4">
      <LoadingSkeleton className="h-28" />
      <LoadingSkeleton className="h-48" />
      <LoadingSkeleton className="h-28" />
    </main>
  );
}
