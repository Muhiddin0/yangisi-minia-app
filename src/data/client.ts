/**
 * Client-side data operations against PocketBase. These run in the browser
 * using the shared `pb` client, so they carry the signed-in user's auth token.
 * Listing/shop status is governed by the backend (field defaults + hooks); we
 * never set it from the client on create.
 */

import { pb } from "@/lib/pb";
import { toSellerListing } from "@/data/map";
import type { SellerListing } from "@/lib/types";

/** Max active (non-sold) listings an individual (non-shop) user may keep. */
export const USER_LISTING_LIMIT = 3;

export interface NewListingInput {
  title: string;
  brandId?: string;
  model: string;
  price: number;
  condition: string;
  memory: string;
  ram: string;
  color: string;
  region: string;
  description: string;
  /** Set when posting under an approved shop. */
  shopId?: string;
}

export interface ShopInput {
  name: string;
  phone: string;
  telegram: string;
  location: string;
  description: string;
}

/** Brand `{ id, name }` options for the create-listing form. */
export async function getBrandOptions(): Promise<{ id: string; name: string }[]> {
  const records = await pb.collection("brands").getFullList({ sort: "name" });
  return records.map((r) => ({ id: r.id, name: r.name as string }));
}

/** The signed-in user's own listings (any status), newest first. */
export async function getMyListings(userId: string): Promise<SellerListing[]> {
  const records = await pb.collection("listings").getFullList({
    filter: `owner = "${userId}"`,
    sort: "-created",
  });
  return records.map(toSellerListing);
}

/** Creates a listing owned by the current user, with image uploads. */
export async function createListing(input: NewListingInput, files: File[]) {
  const user = pb.authStore.record;
  if (!user) throw new Error("Not authenticated");

  // Individual (non-shop) listings are capped per user. Sold ones don't count.
  if (!input.shopId) {
    const mine = await pb.collection("listings").getFullList({
      filter: `owner = "${user.id}" && status != "sold"`,
      fields: "id,shop",
    });
    const individualCount = mine.filter((r) => !r.shop).length;
    if (individualCount >= USER_LISTING_LIMIT) {
      throw new Error(
        `Oddiy foydalanuvchilar bir vaqtda ko'pi bilan ${USER_LISTING_LIMIT} ta e'lon joylashi mumkin. Avval birortasini o'chiring yoki sotilgan deb belgilang.`,
      );
    }
  }

  const form = new FormData();
  form.append("title", input.title);
  if (input.brandId) form.append("brand", input.brandId);
  form.append("model", input.model);
  form.append("price", String(input.price));
  form.append("condition", input.condition);
  form.append("memory", input.memory);
  form.append("ram", input.ram);
  form.append("color", input.color);
  form.append("region", input.region);
  form.append("description", input.description);
  form.append("owner", user.id);
  if (input.shopId) form.append("shop", input.shopId);
  for (const file of files) form.append("images", file);

  return pb.collection("listings").create(form);
}

/** Submits a new shop request owned by the current user. */
export async function createShop(input: ShopInput, logo: File | null) {
  const user = pb.authStore.record;
  if (!user) throw new Error("Not authenticated");

  const form = new FormData();
  form.append("name", input.name);
  form.append("phone", input.phone);
  form.append("telegram", input.telegram);
  form.append("location", input.location);
  form.append("description", input.description);
  form.append("owner", user.id);
  if (logo) form.append("logo", logo);

  return pb.collection("shops").create(form);
}

/** Updates an existing shop's editable fields (and optionally its logo). */
export async function updateShop(
  id: string,
  input: ShopInput,
  logo: File | null,
) {
  const form = new FormData();
  form.append("name", input.name);
  form.append("phone", input.phone);
  form.append("telegram", input.telegram);
  form.append("location", input.location);
  form.append("description", input.description);
  if (logo) form.append("logo", logo);

  return pb.collection("shops").update(id, form);
}

/** Marks a listing as sold. */
export async function markListingSold(id: string): Promise<void> {
  await pb.collection("listings").update(id, { status: "sold" });
}

/** Permanently deletes a listing. */
export async function deleteListing(id: string): Promise<void> {
  await pb.collection("listings").delete(id);
}
