/**
 * Static presentation config for the seller screens.
 *
 * The 7-day views chart has no backend analytics source yet, so it renders
 * flat (zeros) rather than fabricated numbers. Replace `weeklyViews` with real
 * per-day data once an analytics endpoint exists.
 */

import type { ListingStatus } from "@/lib/types";

/** Weekday labels (Uzbek) for the dashboard chart, Mon → Sun. */
export const weekdayLabels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

/** Normalised (0–1) daily view values for the chart. No analytics yet → flat. */
export const weeklyViews = [0, 0, 0, 0, 0, 0, 0];

export type SellerListingFilter = "all" | ListingStatus;

/** Tabs for filtering the seller's own listings. */
export const sellerListingFilters: {
  id: SellerListingFilter;
  label: string;
}[] = [
  { id: "all", label: "Hammasi" },
  { id: "active", label: "Faol" },
  { id: "moderation", label: "Moderatsiyada" },
  { id: "sold", label: "Sotilgan" },
];
