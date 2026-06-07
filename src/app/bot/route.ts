/**
 * Telegram bot webhook (the SELLER bot).
 *
 * Lives at `/bot` rather than `/api/bot` on purpose: next.config.ts rewrites
 * `/api/*` to PocketBase, so anything under `/api` would be proxied away.
 *
 * Commands:
 *   /start  — greet the user and show an "Ilovani ochish" reply button that
 *             opens the Mini App.
 *   /seller — if the user owns an approved shop, open the seller Mini App;
 *             otherwise point them to the "become a seller" flow.
 *
 * Always acks Telegram with 200 (even on internal errors) so a transient
 * failure doesn't trigger an endless retry loop; failures are logged instead.
 */

import type { NextRequest } from "next/server";
import { isSellerByTelegramId } from "@/data/botSeller";
import {
  escapeHtml,
  sendMessage,
  webAppKeyboard,
  type TgUpdate,
} from "@/lib/telegram";

// Reads request data and talks to external services on every call.
export const dynamic = "force-dynamic";

/** Public HTTPS origin the Mini App is served from (no trailing slash). */
const APP_BASE_URL = (process.env.APP_BASE_URL ?? "https://wordgram.uz").replace(
  /\/+$/,
  "",
);
const SELLER_URL = `${APP_BASE_URL}/seller`;
const BECOME_SELLER_URL = `${APP_BASE_URL}/user/become-seller`;
const OPEN_APP_LABEL = "Ilovani ochish";

export async function POST(req: NextRequest): Promise<Response> {
  // Reject forged requests when a webhook secret is configured (recommended).
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (
    secret &&
    req.headers.get("x-telegram-bot-api-secret-token") !== secret
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  let update: TgUpdate;
  try {
    update = (await req.json()) as TgUpdate;
  } catch {
    return Response.json({ ok: true });
  }

  try {
    await handleUpdate(update);
  } catch (err) {
    console.error("[bot] failed to handle update:", err);
  }
  return Response.json({ ok: true });
}

/** Lightweight health check so visiting `/bot` confirms the route is live. */
export function GET(): Response {
  return new Response("Bot webhook is running.", { status: 200 });
}

async function handleUpdate(update: TgUpdate): Promise<void> {
  const message = update.message;
  const text = message?.text?.trim();
  const chatId = message?.chat.id;
  const from = message?.from;
  if (!message || !text || chatId === undefined || !from) return;

  // Commands can arrive as "/start", "/start <payload>" or "/start@BotName".
  const command = text.split(/\s+/)[0].split("@")[0].toLowerCase();

  switch (command) {
    case "/start":
      await sendMessage(
        chatId,
        `Assalomu alaykum, <b>${escapeHtml(from.first_name ?? "")}</b>! 👋\n\n` +
          "Yangisi — ishonchli telefon bozoriga xush kelibsiz.\n" +
          `Boshlash uchun pastdagi <b>«${OPEN_APP_LABEL}»</b> tugmasini bosing.`,
        webAppKeyboard(OPEN_APP_LABEL, SELLER_URL),
      );
      return;

    case "/seller": {
      let isSeller: boolean;
      try {
        isSeller = await isSellerByTelegramId(from.id);
      } catch (err) {
        console.error("[bot] seller lookup failed:", err);
        await sendMessage(
          chatId,
          "Hozircha holatingizni tekshira olmadik. 😕\n" +
            "Birozdan so'ng qayta urinib ko'ring.",
        );
        return;
      }
      if (isSeller) {
        await sendMessage(
          chatId,
          "Sotuvchi paneliga xush kelibsiz! 🏪\n" +
            "Do'koningiz va e'lonlaringizni boshqarish uchun ilovani oching.",
          webAppKeyboard(OPEN_APP_LABEL, SELLER_URL),
        );
      } else {
        await sendMessage(
          chatId,
          "Siz hozircha sotuvchi emassiz. 🛍\n" +
            "Sotuvchi bo'lish uchun ilovada do'kon oching — arizangiz " +
            "tasdiqlangach panel ochiladi.",
          webAppKeyboard("Sotuvchi bo'lish", BECOME_SELLER_URL),
        );
      }
      return;
    }

    default:
      await sendMessage(
        chatId,
        "Mavjud buyruqlar:\n" +
          "/start — ilovani ochish\n" +
          "/seller — sotuvchi panelini ochish",
      );
  }
}
