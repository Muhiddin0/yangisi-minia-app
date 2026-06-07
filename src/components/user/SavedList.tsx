"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { RecordModel } from "pocketbase";
import type { Listing } from "@/lib/types";
import { pb } from "@/lib/pb";
import { toListing } from "@/data/map";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProductCard } from "./ProductCard";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

/** The signed-in user's saved listings (PocketBase favorites). */
export function SavedList() {
  const { user, loading: authLoading, favorites } = useAuth();
  const [listings, setListings] = useState<Listing[] | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    let active = true;
    pb.collection("favorites")
      .getFullList({
        filter: `user = "${user.id}"`,
        expand: "listing",
        sort: "-created",
      })
      .then((favs) => {
        if (!active) return;
        setListings(
          favs
            .map((f) => f.expand?.listing as RecordModel | undefined)
            .filter((l): l is RecordModel => Boolean(l))
            .map(toListing),
        );
      })
      .catch(() => active && setListings([]));
    return () => {
      active = false;
    };
  }, [authLoading, user, favorites]);

  if (authLoading) {
    return (
      <div className="flex justify-center py-24 text-on-surface-variant">
        <MaterialSymbol name="progress_activity" className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in to see saved phones"
        body="Log in to save your favorite devices and find them here."
        cta="Sign in"
        href="/user/onboarding"
      />
    );
  }

  if (listings === null) {
    return (
      <div className="flex justify-center py-24 text-on-surface-variant">
        <MaterialSymbol name="progress_activity" className="animate-spin" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No saved phones yet"
        body="Explore the marketplace and save your favorite devices here."
        cta="Start searching"
        href="/user/search"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-gutter">
      {listings.map((listing) => (
        <ProductCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

function EmptyState({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container text-outline">
        <MaterialSymbol name="favorite" className="!text-5xl" />
      </div>
      <h2 className="mb-2 text-headline-md text-on-surface">{title}</h2>
      <p className="mb-8 max-w-[240px] text-body-md text-on-surface-variant">
        {body}
      </p>
      <Link
        href={href}
        className="rounded-full bg-primary px-8 py-3 text-label-md text-on-primary shadow-md transition-transform active:scale-95"
      >
        {cta}
      </Link>
    </div>
  );
}
