/**
 * Server-side reads from PocketBase, used by Server Components. Each call uses
 * a fresh server client that reaches PocketBase directly (bypassing the public
 * proxy/tunnel). File URLs in the mapped results are still public.
 */

import { createServerClient } from "@/lib/pb";
import { toBanner, toBrand, toListing, toShop } from "@/data/map";
import type { Banner, Brand, Listing, Shop } from "@/lib/types";

/** All published listings, newest first. Optionally scoped to a brand. */
export async function getActiveListings(brandId?: string): Promise<Listing[]> {
  const pb = createServerClient();
  const filterParts = ['status = "active"'];
  if (brandId) filterParts.push(`brand = "${brandId}"`);

  const records = await pb.collection("listings").getFullList({
    filter: filterParts.join(" && "),
    expand: "brand",
    sort: "-created",
  });
  return records.map(toListing);
}

/**
 * Active home-page carousel banners, ordered by `sort_order` then newest.
 * Banners without a usable image are dropped. Tolerant: if the `banners`
 * collection doesn't exist yet (backend not migrated), returns [].
 */
export async function getActiveBanners(): Promise<Banner[]> {
  const pb = createServerClient();
  try {
    const records = await pb.collection("banners").getFullList({
      filter: "active = true",
      sort: "sort_order,-created",
    });
    return records.map(toBanner).filter((b) => b.image);
  } catch {
    return [];
  }
}

/** All brands, alphabetically. */
export async function getBrands(): Promise<Brand[]> {
  const pb = createServerClient();
  const records = await pb.collection("brands").getFullList({ sort: "name" });
  return records.map(toBrand);
}

/** A single listing by id, or null if it doesn't exist. */
export async function getListingById(id: string): Promise<Listing | null> {
  const pb = createServerClient();
  try {
    const record = await pb
      .collection("listings")
      .getOne(id, { expand: "brand" });
    return toListing(record);
  } catch {
    return null;
  }
}

/** A single shop by id, or null if it doesn't exist. */
export async function getShopById(id: string): Promise<Shop | null> {
  const pb = createServerClient();
  try {
    const record = await pb.collection("shops").getOne(id);
    return toShop(record);
  } catch {
    return null;
  }
}

/** Published listings belonging to a shop, newest first. */
export async function getShopListings(shopId: string): Promise<Listing[]> {
  const pb = createServerClient();
  const records = await pb.collection("listings").getFullList({
    filter: `shop = "${shopId}" && status = "active"`,
    expand: "brand",
    sort: "-created",
  });
  return records.map(toListing);
}
