"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface ColorOption {
  name: string;
  /** Tailwind bg class for the swatch. */
  className: string;
}

/** Horizontally-scrolling circular colour picker with labels. */
export function ColorSwatches({
  colors,
  defaultValue,
  onChange,
}: {
  colors: ColorOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState(defaultValue ?? colors[0]?.name);

  return (
    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
      {colors.map((color) => {
        const active = selected === color.name;
        return (
          <button
            key={color.name}
            type="button"
            onClick={() => {
              setSelected(color.name);
              onChange?.(color.name);
            }}
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <span
              className={cn(
                "h-12 w-12 rounded-full p-0.5",
                color.className,
                active ? "border-2 border-primary" : "border border-outline-variant",
              )}
            >
              <span className="block h-full w-full rounded-full border border-white/20" />
            </span>
            <span
              className={cn(
                "text-label-sm",
                active ? "text-on-surface" : "text-on-surface-variant",
              )}
            >
              {color.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
