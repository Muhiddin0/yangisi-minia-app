/**
 * Mappers from PocketBase records to the app's domain types, plus the helper
 * that builds public file URLs. Pure, isomorphic functions — safe to import
 * from both Server Components (via `queries.ts`) and Client Components.
 */

import type { RecordModel } from "pocketbase";
import { POCKETBASE_URL } from "@/lib/pb";
import type {
  Brand,
  Listing,
  ListingStatus,
  SellerListing,
  Shop,
} from "@/lib/types";
import { relativeTime } from "@/lib/format";

const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  "like-new": "Like New",
  used: "Used",
  refurbished: "Refurbished",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  moderation: "On moderation",
  sold: "Sold",
};

/**
 * Public PocketBase file URL for a stored file on a record. Always built from
 * the browser-reachable `POCKETBASE_URL` so the URL works once it reaches the
 * client, regardless of which client fetched the record.
 */
export function fileUrl(
  record: Pick<RecordModel, "id" | "collectionId" | "collectionName">,
  filename: string,
): string {
  if (!filename) return "";
  const collection = record.collectionId || record.collectionName;
  return `${POCKETBASE_URL}/api/files/${collection}/${record.id}/${filename}`;
}

export function toBrand(record: RecordModel): Brand {
  return { id: record.id, name: record.name };
}

/** A public marketplace listing. Pass an `expand: "brand"` record for the name. */
export function toListing(record: RecordModel): Listing {
  const brand = record.expand?.brand as RecordModel | undefined;
  const condition: string = record.condition || "used";
  const images: string[] = Array.isArray(record.images) ? record.images : [];

  return {
    id: record.id,
    title: record.title ?? "",
    brandId: record.brand ?? "",
    brandName: brand?.name,
    model: record.model ?? "",
    price: record.price ?? 0,
    condition: condition as Listing["condition"],
    conditionLabel: CONDITION_LABELS[condition] ?? condition,
    memory: record.memory ?? "",
    ram: record.ram ?? "",
    color: record.color ?? "",
    batteryHealth: record.battery_health || undefined,
    warranty: record.warranty || undefined,
    region: record.region ?? "",
    city: record.city ?? "",
    images: images.map((file) => fileUrl(record, file)),
    description: record.description ?? "",
    publishedAt: relativeTime(record.created),
    shopId: record.shop ?? "",
  };
}

export function toShop(record: RecordModel): Shop {
  return {
    id: record.id,
    name: record.name ?? "",
    logo: record.logo ? fileUrl(record, record.logo) : "",
    verified: Boolean(record.verified),
    // Reviews/ratings/hours are not tracked in the backend yet; default to
    // neutral values so the UI can decide whether to show them.
    rating: record.rating ?? 0,
    reviewsCount: record.reviewsCount ?? 0,
    location: record.location ?? "",
    hours: record.hours ?? "",
    description: record.description ?? "",
    phone: record.phone ?? "",
    telegram: record.telegram || undefined,
  };
}

/** A listing as seen by its owner in the seller dashboard. */
export function toSellerListing(record: RecordModel): SellerListing {
  const status: string = record.status || "moderation";
  const images: string[] = Array.isArray(record.images) ? record.images : [];

  return {
    id: record.id,
    title: record.title ?? "",
    price: record.price ?? 0,
    image: images[0] ? fileUrl(record, images[0]) : "",
    status: status as ListingStatus,
    statusLabel: STATUS_LABELS[status] ?? status,
    views: record.views ?? 0,
    saves: record.saves ?? 0,
  };
}
