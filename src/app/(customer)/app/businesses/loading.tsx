import { BusinessGridLoading } from "@/features/discovery";

export default function BusinessesLoading() {
  return (
    <div>
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded-pill bg-disabled" />
        <div className="h-9 w-72 max-w-full animate-pulse rounded-control bg-disabled" />
      </div>
      <div className="mt-8">
        <BusinessGridLoading />
      </div>
    </div>
  );
}
