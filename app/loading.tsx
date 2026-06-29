import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="mt-8 h-12 w-full max-w-2xl" />
          <Skeleton className="mt-4 h-6 w-full max-w-xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(300px,400px)_1fr]">
          <Skeleton className="h-[520px]" />
          <div className="grid gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    </main>
  );
}
