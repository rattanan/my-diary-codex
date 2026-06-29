import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900",
        className,
      )}
      role="alert"
      {...props}
    />
  );
}
