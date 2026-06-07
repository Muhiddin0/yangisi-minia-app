"use client";

import { useEffect, useState } from "react";
import type { SellerListing, SellerStat } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMyListings } from "@/data/client";
import { StatCard } from "./StatCard";
import { ViewsChart } from "./ViewsChart";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { weekdayLabels, weeklyViews } from "@/data/seller";
import { formatCount, formatSom } from "@/lib/format";

export function SellerStatsView() {
  const { user } = useAuth();
  const [items, setItems] = useState<SellerListing[]>([]);

  useEffect(() => {
    if (user) getMyListings(user.id).then(setItems).catch(() => {});
  }, [user]);

  const active = items.filter((i) => i.status === "active").length;
  const views = items.reduce((sum, i) => sum + i.views, 0);
  const saves = items.reduce((sum, i) => sum + i.saves, 0);
  const sold = items.filter((i) => i.status === "sold").length;

  const stats: SellerStat[] = [
    { key: "active", label: "Faol", value: String(active), icon: "inventory_2", iconClass: "text-primary" },
    { key: "views", label: "Ko'rishlar", value: formatCount(views), icon: "visibility", iconClass: "text-primary" },
    { key: "saved", label: "Saqlanganlar", value: String(saves), icon: "favorite", iconClass: "text-error", filled: true },
    { key: "sold", label: "Sotilgan", value: String(sold), icon: "sell", iconClass: "text-tertiary" },
  ];

  const topViewed = [...items].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <main className="mx-auto max-w-[1280px] space-y-md px-margin-mobile py-6">
      <div className="grid grid-cols-2 gap-md lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>

      <div className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
        <h2 className="text-title-lg text-on-surface">Ko&apos;rishlar (7 kun)</h2>
        <ViewsChart data={weeklyViews} labels={weekdayLabels} />
      </div>

      <div className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
        <h2 className="text-title-lg text-on-surface">Eng ko&apos;p ko&apos;rilgan</h2>
        {topViewed.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">Hali ma&apos;lumot yo&apos;q.</p>
        ) : (
          topViewed.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between border-b border-outline-variant/30 pb-2 last:border-0 last:pb-0"
            >
              <span className="line-clamp-1 text-body-md text-on-surface">
                {listing.title}
              </span>
              <span className="flex items-center gap-3 text-label-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <MaterialSymbol name="visibility" className="text-[16px]" />
                  {listing.views}
                </span>
                <span className="text-title-md text-primary">
                  {formatSom(listing.price)}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
