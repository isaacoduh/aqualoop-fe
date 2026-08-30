import { LoadingRegion, LoadingSkeleton } from "@/components/ui";

export function BusinessGridLoading({ count = 3 }: { count?: number }) {
  return (
    <LoadingRegion label="Loading refill businesses" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-card border border-border bg-surface">
          <LoadingSkeleton className="h-32 rounded-none" />
          <div className="space-y-3 p-5">
            <LoadingSkeleton shape="text" className="w-2/3" />
            <LoadingSkeleton shape="text" className="w-1/2" />
            <LoadingSkeleton shape="text" className="mt-5 w-full" />
            <LoadingSkeleton shape="text" className="w-4/5" />
          </div>
        </div>
      ))}
    </LoadingRegion>
  );
}
