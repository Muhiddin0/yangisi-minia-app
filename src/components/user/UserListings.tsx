"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SellerListing } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  deleteListing,
  getMyListings,
  markListingSold,
  USER_LISTING_LIMIT,
} from "@/data/client";
import { SellerListingCard } from "@/components/seller/SellerListingCard";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

/**
 * A regular user's own listings, with the post limit shown and sold/delete
 * actions. Mirrors the seller listings view but points at the individual
 * posting flow (`/user/new`).
 */
export function UserListings() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<SellerListing[] | null>(null);

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

  if (!user) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="mb-6 text-body-lg text-on-surface-variant">
          E&apos;lonlaringizni ko&apos;rish uchun tizimga kiring.
        </p>
        <Link
          href="/user/onboarding"
          className="rounded-full bg-primary px-8 py-3 text-label-md text-on-primary shadow-md"
        >
          Kirish
        </Link>
      </div>
    );
  }

  const activeCount = items.filter((i) => i.status !== "sold").length;
  const remaining = Math.max(0, USER_LISTING_LIMIT - activeCount);
  const atLimit = remaining === 0;

  return (
    <div className="space-y-stack-md">
      {/* Limit summary */}
      <div className="flex items-center gap-stack-md rounded-xl border border-outline-variant bg-surface-container-low p-stack-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container/15 text-primary">
          <MaterialSymbol name="inventory_2" />
        </div>
        <div className="flex-1">
          <p className="text-title-md text-on-surface">
            {activeCount} / {USER_LISTING_LIMIT} e&apos;lon
          </p>
          <p className="text-body-md text-on-surface-variant">
            {atLimit
              ? "Limitga yetdingiz"
              : `Yana ${remaining} ta joylashingiz mumkin`}
          </p>
        </div>
        {!atLimit && (
          <Link
            href="/user/new"
            className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm transition-transform active:scale-95"
          >
            <MaterialSymbol name="add" className="text-[18px]" />
            Yangi
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary-container/20 bg-primary-container/5 p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/10">
            <MaterialSymbol name="add_circle" className="text-4xl text-primary" />
          </div>
          <h4 className="text-title-lg text-on-surface">Hali e&apos;lon yo&apos;q</h4>
          <p className="mt-2 max-w-xs text-on-surface-variant">
            Sotmoqchi bo&apos;lgan narsangizning rasmini oling va tezda soting!
          </p>
          <Link
            href="/user/new"
            className="mt-6 rounded-xl bg-primary px-8 py-3 text-label-lg text-white transition-all hover:shadow-lg active:scale-95"
          >
            E&apos;lon berish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter">
          {items.map((listing) => (
            <SellerListingCard
              key={listing.id}
              listing={listing}
              onSold={handleSold}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
