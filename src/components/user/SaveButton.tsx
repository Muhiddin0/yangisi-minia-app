"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

interface SaveButtonProps {
  listingId: string;
  /** Floating chip on cards, or a plain button on the detail screen. */
  variant?: "chip" | "plain";
  className?: string;
}

/** Heart toggle backed by the user's PocketBase favorites. */
export function SaveButton({
  listingId,
  variant = "chip",
  className,
}: SaveButtonProps) {
  const router = useRouter();
  const { user, loading, isFavorite, toggleFavorite } = useAuth();
  const [busy, setBusy] = useState(false);
  const saved = isFavorite(listingId);

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (loading) return; // auth still initializing — ignore the tap
    if (!user) {
      router.push("/user/onboarding");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      await toggleFavorite(listingId);
    } catch {
      /* ignore — keep current state */
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={saved ? "Saqlanganlardan olib tashlash" : "Saqlash"}
      aria-pressed={saved}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center transition-transform active:scale-90",
        variant === "chip" &&
          "h-8 w-8 rounded-full bg-surface/80 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <MaterialSymbol
        name="favorite"
        filled={saved}
        className={cn(
          "text-[20px] transition-colors",
          saved ? "text-error" : "text-on-surface-variant",
        )}
      />
    </button>
  );
}
