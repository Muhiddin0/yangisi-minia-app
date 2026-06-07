"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { BrandChips, ALL_BRANDS } from "./BrandChips";
import { ProductCard } from "./ProductCard";

/** Home feed: brand chips that actually filter the listing grid below them. */
export function HomeFeed({ listings }: { listings: Listing[] }) {
  const [brand, setBrand] = useState(ALL_BRANDS);

  // Only show chips for brands that have at least one active listing.
  const brands = useMemo(() => {
    const map = new Map<string, string>();
    for (const l of listings) {
      if (l.brandId && l.brandName) map.set(l.brandId, l.brandName);
    }
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [listings]);

  const visible = useMemo(
    () =>
      brand === ALL_BRANDS
        ? listings
        : listings.filter((l) => l.brandId === brand),
    [listings, brand],
  );

  return (
    <>
      <section className="mt-stack-lg">
        <BrandChips brands={brands} selected={brand} onSelect={setBrand} />
      </section>

      <section className="mt-stack-lg flex items-center justify-between px-margin-mobile">
        <h2 className="text-headline-md text-on-surface">Tavsiya etamiz</h2>
        <Link href="/user/search" className="text-label-md text-primary">
          Barchasi
        </Link>
      </section>

      <main className="mt-stack-md px-margin-mobile pb-4">
        {visible.length > 0 ? (
          <div className="grid grid-cols-2 gap-gutter">
            {visible.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-body-md text-on-surface-variant">
            Bu brend bo&apos;yicha e&apos;lon topilmadi.
          </p>
        )}
      </main>
    </>
  );
}
