"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface ChipOption {
  value: string;
  label: string;
  /** Optional Tailwind bg class for a leading color swatch. */
  swatch?: string;
}

type Option = string | ChipOption;

const normalize = (option: Option): ChipOption =>
  typeof option === "string" ? { value: option, label: option } : option;

interface ChipSelectProps {
  options: Option[];
  defaultValue?: string;
  /** Pill (fully round) or rounded-rectangle chips. */
  variant?: "pill" | "rounded";
  /** Active fill: solid primary, or the softer primary-container. */
  accent?: "solid" | "container";
  size?: "sm" | "md";
  /** Lay chips out in an N-column grid instead of wrapping flex. */
  columns?: number;
  className?: string;
  /** Notified when the selection changes. */
  onChange?: (value: string) => void;
}

/** Single-select chip group with local state. */
export function ChipSelect({
  options,
  defaultValue,
  variant = "pill",
  accent = "solid",
  size = "md",
  columns,
  className,
  onChange,
}: ChipSelectProps) {
  const items = options.map(normalize);
  const [selected, setSelected] = useState(defaultValue ?? items[0]?.value);

  const select = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  const activeClass =
    accent === "solid"
      ? "border-transparent bg-primary text-on-primary"
      : "border-primary bg-primary-container text-on-primary-container";

  return (
    <div
      className={cn(columns ? "grid gap-2" : "flex flex-wrap gap-2", className)}
      style={
        columns
          ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
          : undefined
      }
    >
      {items.map((item) => {
        const active = selected === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => select(item.value)}
            className={cn(
              "flex items-center justify-center gap-2 border transition-colors",
              size === "sm" ? "px-3 py-2 text-label-sm" : "px-4 py-2 text-label-lg",
              variant === "pill" ? "rounded-full" : "rounded-lg",
              active
                ? activeClass
                : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant/20",
            )}
          >
            {item.swatch && (
              <span
                className={cn(
                  "h-3 w-3 rounded-full border border-white/20",
                  item.swatch,
                )}
              />
            )}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
