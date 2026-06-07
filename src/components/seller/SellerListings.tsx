"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SellerListing } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  deleteListing,
  getMyListings,
  markListingSold,
} from "@/data/client";
import { SellerListingCard } from "./SellerListingCard";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import {
  sellerListingFilters,
  type SellerListingFilter,
} from "@/data/seller";
import { cn } from "@/lib/cn";

/** The signed-in seller's own listings with filtering + sold/delete actions. */
export function SellerListings() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<SellerListing[] | null>(null);
  const [filter, setFilter] = useState<SellerListingFilter>("all");

  const reload = () => {
    if (!user) return;
    getMyListings(user.id)
      .then(setItems)
      .catch(() => setItems([]));
  };

  useEffect(() => {
    if (loading || !user) return;
    let active = true;
    getMyListings(user.id)
      .then((data) => active && setItems(data))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, [loading, user]);

  const handleSold = async (id: string) => {
    await markListingSold(id);
    reload();
  };

  const handleDelete = async (id: string) => {
    await deleteListing(id);
    setItems((prev) => prev?.filter((i) => i.id !== id) ?? null);
  };

  if (loading || items === null) {
    return (
      <div className="flex justify-center py-24 text-on-surface-variant">
        <MaterialSymbol name="progress_activity" className="animate-spin" />
      </div>
    );
  }

  const visible =
    filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <>
      <div className="-mx-margin-mobile mb-8 flex gap-2 overflow-x-auto hide-scrollbar px-margin-mobile">
        {sellerListingFilters.map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-full px-6 py-2.5 text-label-lg transition-all active:scale-95",
                active
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "bg-surface-container text-on-secondary-container hover:bg-surface-container-high",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {visible.map((listing) => (
            <SellerListingCard
              key={listing.id}
              listing={listing}
              onSold={handleSold}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary-container/20 bg-primary-container/5 p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/10">
            <MaterialSymbol name="add_circle" className="text-4xl text-primary" />
          </div>
          <h4 className="text-title-lg text-on-surface">
            Hali e&apos;lon yo&apos;q
          </h4>
          <p className="mt-2 max-w-xs text-on-surface-variant">
            Sotmoqchi bo&apos;lgan narsangizni rasmini oling va tezda soting!
          </p>
          <Link
            href="/seller/new"
            className="mt-6 rounded-xl bg-primary px-8 py-3 text-label-lg text-white transition-all hover:shadow-lg active:scale-95"
          >
            E&apos;lon berish
          </Link>
        </div>
      )}
    </>
  );
}
