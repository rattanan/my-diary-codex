import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "default" | "sm" | "icon";
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
};

const variants = {
  default:
    "bg-zinc-950 text-white shadow-sm shadow-zinc-950/10 hover:bg-zinc-800 active:bg-zinc-900",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300",
  outline:
    "border border-zinc-200 bg-white text-zinc-900 shadow-sm hover:bg-zinc-50 active:bg-zinc-100",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 active:bg-zinc-200",
  destructive:
    "bg-red-600 text-white shadow-sm shadow-red-600/10 hover:bg-red-700 active:bg-red-800",
};

const sizes = {
  default: "h-10 px-4",
  sm: "h-9 px-3",
  icon: "h-9 w-9",
};

export function Button({
  className,
  size = "default",
  variant = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
