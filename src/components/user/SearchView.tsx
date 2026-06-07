"use client";

import { useMemo, useState } from "react";
import type { Listing } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { SearchControls } from "./SearchControls";
import { FilterSheet } from "./FilterSheet";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import {
  countActiveFilters,
  EMPTY_FILTERS,
  filterListings,
  sortListings,
  type ListingFilters,
  type SortKey,
} from "@/lib/search";

/** Owns the search/filter/sort state and renders the filtered results. */
export function SearchView({ listings }: { listings: Listing[] }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ListingFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const visible = useMemo(
    () => sortListings(filterListings(listings, query, filters), sort),
    [listings, query, filters, sort],
  );
  const activeFilterCount = countActiveFilters(filters);

  return (
    <>
      <SearchControls
        query={query}
        onQueryChange={setQuery}
        onOpenFilters={() => setFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        sort={sort}
        onSortChange={setSort}
      />

      {visible.length > 0 ? (
        <section className="mt-stack-lg grid grid-cols-2 gap-gutter">
          {visible.map((listing) => (
            <ProductCard key={listing.id} listing={listing} aspect="tall" />
          ))}
        </section>
      ) : (
        <div className="mt-stack-lg flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container text-outline">
            <MaterialSymbol name="search_off" className="text-3xl" />
          </div>
          <h2 className="text-title-lg text-on-surface">Hech narsa topilmadi</h2>
          <p className="mt-1 max-w-xs text-body-md text-on-surface-variant">
            Qidiruv yoki filtrlarni o&apos;zgartirib ko&apos;ring.
          </p>
          {(query || activeFilterCount > 0) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilters(EMPTY_FILTERS);
              }}
              className="mt-6 rounded-full bg-primary px-8 py-3 text-label-md text-on-primary shadow-md transition-transform active:scale-95"
            >
              Tozalash
            </button>
          )}
        </div>
      )}

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        listings={listings}
        value={filters}
        onApply={setFilters}
      />
    </>
  );
}
