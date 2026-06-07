"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Two-or-more option segmented control (e.g. New / Used). */
export function SegmentedControl({
  options,
  defaultValue,
  onChange,
}: {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState(defaultValue ?? options[0]);

  return (
    <div className="flex w-full rounded-xl border border-outline-variant bg-surface-container p-1">
      {options.map((option) => {
        const active = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelected(option);
              onChange?.(option);
            }}
            className={cn(
              "flex-1 rounded-lg py-2 text-label-lg transition-all",
              active
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
