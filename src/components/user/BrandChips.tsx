"use client";

import { useState } from "react";
import type { Brand } from "@/lib/types";
import { cn } from "@/lib/cn";

const ALL = "all";

/** Horizontally-scrolling brand filter chips with single selection. */
export function BrandChips({ brands }: { brands: Brand[] }) {
  const [selected, setSelected] = useState(ALL);
  const options = [{ id: ALL, name: "All Brands" }, ...brands];

  return (
    <div className="flex gap-stack-sm overflow-x-auto hide-scrollbar px-margin-mobile pb-2">
      {options.map((brand) => {
        const active = selected === brand.id;
        return (
          <button
            key={brand.id}
            type="button"
            onClick={() => setSelected(brand.id)}
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
