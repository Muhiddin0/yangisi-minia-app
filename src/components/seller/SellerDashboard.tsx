"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SellerListing, SellerStat } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMyListings } from "@/data/client";
import { StatCard } from "./StatCard";
import { ViewsChart } from "./ViewsChart";
import { SellerListingCard } from "./SellerListingCard";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { weekdayLabels, weeklyViews } from "@/data/seller";
import { formatCount } from "@/lib/format";

export function SellerDashboard() {
  const { user, shop } = useAuth();
  const [items, setItems] = useState<SellerListing[]>([]);

  useEffect(() => {
    if (user) getMyListings(user.id).then(setItems).catch(() => {});
  }, [user]);

  const active = items.filter((i) => i.status === "active").length;
  const moderation = items.filter((i) => i.status === "moderation").length;
  const views = items.reduce((sum, i) => sum + i.views, 0);
  const saves = items.reduce((sum, i) => sum + i.saves, 0);

  const stats: SellerStat[] = [
    { key: "active", label: "Faol e'lonlar", value: String(active), icon: "inventory_2", iconClass: "text-primary" },
    { key: "views", label: "Ko'rishlar", value: formatCount(views), icon: "visibility", iconClass: "text-primary" },
    { key: "saved", label: "Saqlanganlar", value: String(saves), icon: "favorite", iconClass: "text-error", filled: true },
    { key: "rating", label: "Reyting", value: "4.8", icon: "star", iconClass: "text-[#FFB300]", filled: true },
  ];

  const recent = items.slice(0, 3);

  return (
    <>
      <main className="mx-auto max-w-[1280px] space-y-md px-margin-mobile pb-12 pt-6">
        <section className="flex flex-col gap-1">
          <h1 className="text-headline-sm text-on-surface">
            Xush kelibsiz, {(shop?.name as string) || "do'kon"}!
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Sizning bugungi statistikangiz va so&apos;nggi yangiliklar.
          </p>
        </section>

        {moderation > 0 && (
          <Link
            href="/seller/listings"
            className="flex items-center gap-md rounded-xl border border-[#FFE7C4] bg-[#FFF4E5] p-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9800]/20">
              <MaterialSymbol name="pending_actions" className="text-[#E65100]" />
            </div>
            <div className="flex-1">
              <p className="text-title-md text-[#E65100]">
                Moderatsiyada: {moderation} ta e&apos;lon
              </p>
              <p className="text-body-md text-[#E65100]/80">
                E&apos;lonlaringiz 24 soat ichida ko&apos;rib chiqiladi.
              </p>
            </div>
            <MaterialSymbol name="chevron_right" className="text-[#E65100]" />
          </Link>
        )}

        <div className="grid grid-cols-2 gap-md lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.key} stat={stat} />
          ))}
        </div>

        <div className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
          <h2 className="text-title-lg text-on-surface">Ko&apos;rishlar (7 kun)</h2>
          <ViewsChart data={weeklyViews} labels={weekdayLabels} />
        </div>

        {recent.length > 0 && (
          <section className="space-y-md">
            <div className="flex items-center justify-between">
              <h2 className="text-title-lg text-on-surface">So&apos;nggi e&apos;lonlar</h2>
              <Link href="/seller/listings" className="text-label-lg text-primary">
                Hammasi
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
              {recent.map((listing) => (
                <SellerListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Link
        href="/seller/new"
        className="fixed bottom-24 right-margin-mobile z-40 flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-on-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
      >
        <MaterialSymbol name="add" />
        <span className="text-title-md">Yangi e&apos;lon joylash</span>
      </Link>
    </>
  );
}
