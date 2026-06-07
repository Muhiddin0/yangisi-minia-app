/**
 * Client-side search, filter and sort for listings. Pure functions plus the
 * facet/option derivation used by the filter UI. Filter options are derived
 * from the real listing data (not hard-coded), so every option always maps to
 * at least one listing and a filter can never silently match nothing.
 */

import type { Listing } from "@/lib/types";

export type SortKey = "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Avval yangilari" },
  { key: "price-asc", label: "Avval arzonlari" },
  { key: "price-desc", label: "Avval qimmatlari" },
];

/** A `null` field means "not filtered" — that facet is left wide open. */
export interface ListingFilters {
  brandId: string | null;
  /** Inclusive upper price bound; `null` = no cap. */
  priceMax: number | null;
  condition: string | null;
  memory: string | null;
  ram: string | null;
  color: string | null;
  region: string | null;
  city: string | null;
}

export const EMPTY_FILTERS: ListingFilters = {
  brandId: null,
  priceMax: null,
  condition: null,
  memory: null,
  ram: null,
  color: null,
  region: null,
  city: null,
};

/** How many facets are actively narrowing the results. */
export function countActiveFilters(f: ListingFilters): number {
  return [
    f.brandId,
    f.priceMax,
    f.condition,
    f.memory,
    f.ram,
    f.color,
    f.region,
    f.city,
  ].filter((v) => v !== null && v !== "").length;
}

/** Free-text + faceted filtering. */
export function filterListings(
  listings: Listing[],
  query: string,
  f: ListingFilters,
): Listing[] {
  const q = query.trim().toLowerCase();
  return listings.filter((l) => {
    if (q) {
      const haystack =
        `${l.title} ${l.brandName ?? ""} ${l.model} ${l.color}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.brandId && l.brandId !== f.brandId) return false;
    if (f.priceMax != null && l.price > f.priceMax) return false;
    if (f.condition && l.conditionLabel !== f.condition) return false;
    if (f.memory && l.memory !== f.memory) return false;
    if (f.ram && l.ram !== f.ram) return false;
    if (f.color && l.color !== f.color) return false;
    if (f.region && l.region !== f.region) return false;
    if (f.city && l.city !== f.city) return false;
    return true;
  });
}

/** Returns a new, sorted array — never mutates the input. */
export function sortListings(listings: Listing[], sort: SortKey): Listing[] {
  const copy = [...listings];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
    default:
      return copy; // server already returns newest-first
  }
}

export interface Facets {
  brands: { id: string; name: string }[];
  conditions: string[];
  memory: string[];
  ram: string[];
  colors: string[];
  regions: string[];
  cities: string[];
  priceMin: number;
  priceMax: number;
}

/** Storage/RAM rank in GB, so "1 TB" sorts above "512 GB". */
function storageRank(value: string): number {
  const n = parseFloat(value.replace(",", ".")) || 0;
  return /tb/i.test(value) ? n * 1024 : n;
}

function uniqueAlpha(values: (string | undefined)[]): string[] {
  return Array.from(
    new Set(values.filter((v): v is string => Boolean(v && v.trim()))),
  ).sort((a, b) => a.localeCompare(b));
}

function uniqueByStorage(values: (string | undefined)[]): string[] {
  return Array.from(
    new Set(values.filter((v): v is string => Boolean(v && v.trim()))),
  ).sort((a, b) => storageRank(a) - storageRank(b));
}

/** Derives the available filter options from the listings themselves. */
export function deriveFacets(listings: Listing[]): Facets {
  const brandMap = new Map<string, string>();
  for (const l of listings) {
    if (l.brandId && l.brandName) brandMap.set(l.brandId, l.brandName);
  }
  const brands = Array.from(brandMap, ([id, name]) => ({ id, name })).sort(
    (a, b) => a.name.localeCompare(b.name),
  );

  const prices = listings.map((l) => l.price).filter((p) => p > 0);

  return {
    brands,
    conditions: uniqueAlpha(listings.map((l) => l.conditionLabel)),
    memory: uniqueByStorage(listings.map((l) => l.memory)),
    ram: uniqueByStorage(listings.map((l) => l.ram)),
    colors: uniqueAlpha(listings.map((l) => l.color)),
    regions: uniqueAlpha(listings.map((l) => l.region)),
    cities: uniqueAlpha(listings.map((l) => l.city)),
    priceMin: prices.length ? Math.min(...prices) : 0,
    priceMax: prices.length ? Math.max(...prices) : 0,
  };
}
