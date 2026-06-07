"use client";

import { cn } from "@/lib/cn";

interface ChipRowProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

/** A horizontally-scrolling, single-select pill chip row. */
export function ChipRow({ options, selected, onSelect }: ChipRowProps) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-stack-md">
      {options.map((option) => {
        const active = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2 text-label-md transition-colors",
              active
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
