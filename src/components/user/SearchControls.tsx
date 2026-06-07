"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { SORT_OPTIONS, type SortKey } from "@/lib/search";
import { cn } from "@/lib/cn";

interface SearchControlsProps {
  query: string;
  onQueryChange: (value: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

/** Search bar + filter / sort entry points. Fully controlled by the parent. */
export function SearchControls({
  query,
  onQueryChange,
  onOpenFilters,
  activeFilterCount,
  sort,
  onSortChange,
}: SearchControlsProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === sort)?.label ?? SORT_OPTIONS[0].label;

  return (
    <section className="flex flex-col gap-stack-md">
      <div className="flex h-12 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3 transition-colors focus-within:border-primary">
        <MaterialSymbol name="search" className="text-outline" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Telefon qidirish..."
          className="flex-1 bg-transparent text-body-md outline-none placeholder:text-outline-variant"
        />
        {query && (
          <button
            type="button"
            aria-label="Qidiruvni tozalash"
            onClick={() => onQueryChange("")}
            className="text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <MaterialSymbol name="close" className="text-[20px]" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-label-md transition-all",
            activeFilterCount > 0
              ? "bg-primary text-on-primary shadow-sm"
              : "border border-transparent bg-surface-container-high text-on-surface-variant hover:border-outline-variant",
          )}
        >
          <MaterialSymbol name="tune" className="text-[18px]" />
          <span>Filtrlar</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-on-primary px-1 text-label-sm text-primary">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent bg-surface-container-high px-4 py-2 text-label-md text-on-surface-variant hover:border-outline-variant"
          >
            <MaterialSymbol name="sort" className="text-[18px]" />
            <span>{sortLabel}</span>
            <MaterialSymbol name="expand_more" className="text-[16px]" />
          </button>

          {sortOpen && (
            <>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setSortOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest py-1 shadow-xl">
                {SORT_OPTIONS.map((option) => {
                  const active = option.key === sort;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        onSortChange(option.key);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 text-left text-body-md transition-colors hover:bg-surface-container",
                        active ? "text-primary" : "text-on-surface",
                      )}
                    >
                      {option.label}
                      {active && (
                        <MaterialSymbol name="check" className="text-[18px]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
