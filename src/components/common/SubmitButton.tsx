"use client";

import { useState } from "react";
import { MaterialSymbol } from "./MaterialSymbol";
import { cn } from "@/lib/cn";

interface SubmitButtonProps {
  label: string;
  savingLabel: string;
  savedLabel: string;
  icon?: string;
  /** Idle-state colour classes (e.g. "bg-primary text-on-primary"). */
  className?: string;
}

/**
 * Mock submit button with idle → saving → saved feedback. Stands in for the
 * real publish/save mutation until the backend lands.
 */
export function SubmitButton({
  label,
  savingLabel,
  savedLabel,
  icon,
  className = "bg-primary text-on-primary",
}: SubmitButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");

  const handleClick = () => {
    setState("saving");
    setTimeout(() => {
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    }, 1000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "saving"}
      className={cn(
        "flex h-14 w-full items-center justify-center gap-2 rounded-xl text-title-md shadow-lg transition-all active:scale-95",
        state === "done" ? "bg-tertiary-container text-on-tertiary-container" : className,
      )}
    >
      {state === "saving" && (
        <>
          <MaterialSymbol name="progress_activity" className="animate-spin" />
          {savingLabel}
        </>
      )}
      {state === "done" && (
        <>
          <MaterialSymbol name="check" />
          {savedLabel}
        </>
      )}
      {state === "idle" && (
        <>
          {icon && <MaterialSymbol name={icon} filled />}
          {label}
        </>
      )}
    </button>
  );
}
