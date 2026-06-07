/**
 * Seller check for the Telegram bot, by Telegram user id.
 *
 * The bot webhook is unauthenticated. The `users` collection is not publicly
 * readable (view rule: `id = @request.auth.id`), and filtering a public
 * collection by a relation sub-field (`owner.telegram_id`) does NOT help —
 * PocketBase applies the related collection's view rule to the join, so an
 * unauthenticated lookup matches nothing. We therefore authenticate as a
 * PocketBase superuser (which bypasses all collection rules) and read
 * `users.is_seller` directly. That flag is kept in sync with an approved shop
 * by a backend hook. `telegram_id` is stored as the decimal string of the
 * Telegram id by the auth-with-telegram plugin.
 */

import { ClientResponseError } from "pocketbase";
import { createServerClient } from "@/lib/pb";

export async function isSellerByTelegramId(
  telegramId: number | string,
): Promise<boolean> {
  const email = process.env.POCKETBASE_SUPERUSER_EMAIL;
  const password = process.env.POCKETBASE_SUPERUSER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "POCKETBASE_SUPERUSER_EMAIL / POCKETBASE_SUPERUSER_PASSWORD are not set",
    );
  }

  const pb = createServerClient();
  await pb.collection("_superusers").authWithPassword(email, password);

  try {
    const user = await pb
      .collection("users")
      .getFirstListItem(
        pb.filter("telegram_id = {:tid}", { tid: String(telegramId) }),
      );
    return Boolean(user.is_seller);
  } catch (err) {
    // No user linked to this Telegram id yet → simply not a seller.
    if (err instanceof ClientResponseError && err.status === 404) return false;
    throw err;
  }
}
