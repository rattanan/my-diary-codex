"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <Card className="w-full max-w-lg p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle aria-hidden="true" className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          The diary could not finish loading. Try again, and check the local
          diary file if the problem continues.
        </p>
        <Button className="mt-6" onClick={reset}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Try again
        </Button>
      </Card>
    </main>
  );
}
