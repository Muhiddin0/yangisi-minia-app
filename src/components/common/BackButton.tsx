"use client";

import { useRouter } from "next/navigation";
import { MaterialSymbol } from "./MaterialSymbol";
import { cn } from "@/lib/cn";

/** Navigates back in history; falls back to a sensible route if there's none. */
export function BackButton({
  fallback = "/",
  className,
}: {
  fallback?: string;
  className?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallback);
  };

  return (
    <button
      type="button"
      aria-label="Orqaga"
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-surface-container active:scale-95",
        className,
      )}
    >
      <MaterialSymbol name="arrow_back" />
    </button>
  );
}
