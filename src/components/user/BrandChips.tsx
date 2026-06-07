"use client";

import type { Brand } from "@/lib/types";
import { cn } from "@/lib/cn";

export const ALL_BRANDS = "all";

interface BrandChipsProps {
  brands: Brand[];
  /** Selected brand id, or `ALL_BRANDS`. */
  selected: string;
  onSelect: (id: string) => void;
}

/** Horizontally-scrolling brand filter chips with single selection. */
export function BrandChips({ brands, selected, onSelect }: BrandChipsProps) {
  const options = [{ id: ALL_BRANDS, name: "Barchasi" }, ...brands];

  return (
    <div className="flex gap-stack-sm overflow-x-auto hide-scrollbar px-margin-mobile pb-2">
      {options.map((brand) => {
        const active = selected === brand.id;
        return (
          <button
            key={brand.id}
            type="button"
            onClick={() => onSelect(brand.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2 text-label-md transition-colors",
              active
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant/30",
            )}
          >
            {brand.name}
          </button>
        );
      })}
    </div>
  );
}
