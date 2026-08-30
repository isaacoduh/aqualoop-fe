import { LoadingSkeleton } from "@/components/ui";

export default function OrderLoading() {
  return (
    <div className="space-y-5">
      <LoadingSkeleton shape="text" className="w-24" />
      <LoadingSkeleton shape="text" className="w-72" />
      <div className="grid gap-4 md:grid-cols-2">
        <LoadingSkeleton className="h-56" />
        <LoadingSkeleton className="h-56" />
      </div>
    </div>
  );
}
