import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function StockLoading() {
  return (
    <main className="space-y-4">
      <LoadingSkeleton className="h-14" />
      <LoadingSkeleton className="h-96" />
      <LoadingSkeleton className="h-44" />
      <LoadingSkeleton className="h-64" />
    </main>
  );
}
