"use client";

import { useMemo, useState } from "react";
import type { Listing } from "@/lib/types";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { formatPrice } from "@/lib/format";
import {
  deriveFacets,
  EMPTY_FILTERS,
  filterListings,
  type ListingFilters,
} from "@/lib/search";
import { cn } from "@/lib/cn";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  /** All listings — used to derive the available options and price bounds. */
  listings: Listing[];
  /** Currently applied filters. */
  value: ListingFilters;
  /** Called with the new filters when the user taps "Qo'llash". */
  onApply: (filters: ListingFilters) => void;
}

/** Material-3 bottom sheet that refines the search results. Changes are held in
 *  a draft and only committed when the user applies them. */
export function FilterSheet({
  open,
  onClose,
  listings,
  value,
  onApply,
}: FilterSheetProps) {
  const facets = useMemo(() => deriveFacets(listings), [listings]);
  const [draft, setDraft] = useState<ListingFilters>(value);
  const [wasOpen, setWasOpen] = useState(open);

  // Re-seed the draft from the applied value each time the sheet opens, so an
  // abandoned edit (closed via X / backdrop) doesn't leak into the next open.
  // (Adjusting state during render — React's recommended alternative to an
  // effect for syncing state to a changing prop.)
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(value);
  }

  const update = (patch: Partial<ListingFilters>) =>
    setDraft((d) => ({ ...d, ...patch }));

  function toggle<K extends keyof ListingFilters>(
    key: K,
    optionValue: ListingFilters[K],
  ) {
    setDraft((d) => ({ ...d, [key]: d[key] === optionValue ? null : optionValue }));
  }

  // Cities depend on the selected region so the two never contradict.
  const cities = useMemo(() => {
    const pool = draft.region
      ? listings.filter((l) => l.region === draft.region)
      : listings;
    return Array.from(
      new Set(pool.map((l) => l.city).filter((c): c is string => Boolean(c))),
    ).sort((a, b) => a.localeCompare(b));
  }, [listings, draft.region]);

  const hasPriceRange = facets.priceMax > facets.priceMin;
  const priceValue = draft.priceMax ?? facets.priceMax;
  const matchCount = filterListings(listings, "", draft).length;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Yopish"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-on-background/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Sheet */}
      <section
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col overflow-hidden rounded-t-[28px] bg-surface-container-lowest shadow-2xl transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filtrlar"
      >
        <div className="flex flex-col items-center pb-stack-md pt-stack-sm">
          <div className="mb-stack-md h-1 w-10 rounded-full bg-outline-variant" />
          <div className="flex w-full items-center justify-between px-margin-mobile">
            <button
              type="button"
              onClick={() => setDraft(EMPTY_FILTERS)}
              className="rounded-lg px-1 py-1 text-label-md text-primary transition-colors hover:bg-primary/5"
            >
              Tozalash
            </button>
            <h2 className="text-headline-md text-on-surface">Filtrlar</h2>
            <button
              type="button"
              aria-label="Yopish"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant"
            >
              <MaterialSymbol name="close" className="text-[20px]" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-stack-lg overflow-y-auto px-margin-mobile pb-40">
          <SelectField
            label="Brend"
            options={facets.brands.map((b) => ({ value: b.id, label: b.name }))}
            value={draft.brandId}
            onChange={(v) => update({ brandId: v })}
          />

          {/* Narx oralig'i */}
          {hasPriceRange && (
            <div>
              <div className="mb-stack-sm flex items-center justify-between px-1">
                <span className="text-label-md text-on-surface-variant">
                  Narx oralig&apos;i
                </span>
                <span className="text-body-md font-semibold text-primary">
                  {formatPrice(priceValue)}gacha
                </span>
              </div>
              <input
                type="range"
                min={facets.priceMin}
                max={facets.priceMax}
                step={Math.max(
                  100_000,
                  Math.round((facets.priceMax - facets.priceMin) / 40),
                )}
                value={priceValue}
                onChange={(event) => {
                  const v = Number(event.target.value);
                  update({ priceMax: v >= facets.priceMax ? null : v });
                }}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-container-high accent-primary"
              />
              <div className="mt-stack-sm flex justify-between px-1 text-label-sm text-outline">
                <span>{formatPrice(facets.priceMin)}</span>
                <span>{formatPrice(facets.priceMax)}</span>
              </div>
            </div>
          )}

          <ChipGroup
            label="Holati"
            options={facets.conditions}
            value={draft.condition}
            onToggle={(v) => toggle("condition", v)}
            pill
          />
          <ChipGroup
            label="Ichki xotira"
            options={facets.memory}
            value={draft.memory}
            onToggle={(v) => toggle("memory", v)}
            columns={4}
          />
          <ChipGroup
            label="Operativ xotira (RAM)"
            options={facets.ram}
            value={draft.ram}
            onToggle={(v) => toggle("ram", v)}
          />
          <ChipGroup
            label="Rang"
            options={facets.colors}
            value={draft.color}
            onToggle={(v) => toggle("color", v)}
          />

          <div className="grid grid-cols-2 gap-stack-md">
            <SelectField
              label="Hudud"
              options={facets.regions.map((r) => ({ value: r, label: r }))}
              value={draft.region}
              // Changing region clears any city that no longer applies.
              onChange={(v) => update({ region: v, city: null })}
            />
            <SelectField
              label="Shahar"
              options={cities.map((c) => ({ value: c, label: c }))}
              value={draft.city}
              onChange={(v) => update({ city: v })}
            />
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-surface-variant/50 bg-surface-container-lowest p-margin-mobile pb-safe shadow-[0px_-8px_24px_rgba(0,0,0,0.03)]">
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="w-full rounded-xl bg-primary py-4 text-headline-md text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
          >
            {matchCount} ta e&apos;lonni ko&apos;rsatish
          </button>
        </div>
      </section>
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

function SelectField({
  label,
  options,
  value,
  onChange,
  allLabel = "Barchasi",
}: {
  label: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  allLabel?: string;
}) {
  return (
    <div>
      <label className="mb-stack-sm block px-1 text-label-md text-on-surface-variant">
        {label}
      </label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full appearance-none rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{allLabel}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <MaterialSymbol
          name="expand_more"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onToggle,
  pill,
  columns,
}: {
  label: string;
  options: string[];
  value: string | null;
  onToggle: (value: string) => void;
  pill?: boolean;
  columns?: number;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <span className="mb-stack-sm block px-1 text-label-md text-on-surface-variant">
        {label}
      </span>
      <div
        className={cn("gap-2", columns ? "grid" : "flex flex-wrap")}
        style={
          columns
            ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={cn(
                "py-2.5 text-label-md transition-colors",
                pill ? "rounded-full px-5" : "rounded-xl px-4",
                active
                  ? pill
                    ? "bg-primary text-on-primary shadow-sm"
                    : "border border-primary bg-primary-container/10 text-primary"
                  : "border border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
