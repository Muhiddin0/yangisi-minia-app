"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { FilterSheet } from "./FilterSheet";
import { cn } from "@/lib/cn";

const QUICK_FILTERS = [
  { label: "Brand", icon: "expand_more" },
  { label: "Price", icon: "expand_more" },
  { label: "Condition", icon: "expand_more" },
];

/** Search bar + quick filter chips that open the full filter sheet. */
export function SearchControls() {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex flex-col gap-stack-md">
      <div className="relative">
        <MaterialSymbol
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline"
        />
        <input
          type="text"
          placeholder="Search for phones..."
          className="h-12 w-full rounded-xl border border-outline-variant bg-surface-container-low pl-12 pr-12 text-body-md outline-none transition-colors focus:border-primary"
        />
        <button
          type="button"
          aria-label="Open filters"
          onClick={() => setOpen(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
        >
          <MaterialSymbol name="tune" />
        </button>
      </div>

      <div className="-mx-margin-mobile flex items-center gap-2 overflow-x-auto hide-scrollbar px-margin-mobile">
        {QUICK_FILTERS.map((filter, index) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-label-md transition-all",
              index === 0
                ? "bg-primary text-on-primary shadow-sm"
                : "border border-transparent bg-surface-container-high text-on-surface-variant hover:border-outline-variant",
            )}
          >
            <span>{filter.label}</span>
            <MaterialSymbol name={filter.icon} className="text-[16px]" />
          </button>
        ))}
        <div className="mx-1 h-6 w-px shrink-0 bg-outline-variant" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent bg-surface-container-high px-4 py-2 text-label-md text-on-surface-variant hover:border-outline-variant"
        >
          <MaterialSymbol name="sort" className="text-[18px]" />
          <span>Sort</span>
        </button>
      </div>

      <FilterSheet open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
