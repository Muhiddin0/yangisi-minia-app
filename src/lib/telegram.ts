/**
 * Minimal Telegram Bot API client for the webhook bot (see `app/bot/route.ts`).
 *
 * Reuses the same `BOT_TOKEN` that PocketBase's auth-with-telegram endpoint
 * uses, so a single token drives both the bot and the Mini App login. The token
 * is read at call time (server-only env, never `NEXT_PUBLIC_`).
 */

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";

/** A Telegram user (the `from` of an incoming message). */
export interface TgUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

/** The chat a message belongs to. For a bot DM, `id` equals the user id. */
export interface TgChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
}

export interface TgMessage {
  message_id: number;
  from?: TgUser;
  chat: TgChat;
  text?: string;
}

/** A single Telegram webhook update. We only consume `message`. */
export interface TgUpdate {
  update_id: number;
  message?: TgMessage;
}

/** A reply-keyboard button that opens a Mini App (private chats only). */
interface WebAppButton {
  text: string;
  web_app: { url: string };
}

interface ReplyKeyboardMarkup {
  keyboard: WebAppButton[][];
  resize_keyboard?: boolean;
  is_persistent?: boolean;
}

/**
 * Builds a single-button reply keyboard whose button opens `url` as a Telegram
 * Mini App. Reply-keyboard `web_app` buttons work in private chats only, which
 * is exactly how this bot is used.
 */
export function webAppKeyboard(text: string, url: string): ReplyKeyboardMarkup {
  return {
    keyboard: [[{ text, web_app: { url } }]],
    resize_keyboard: true,
    is_persistent: true,
  };
}

/** Calls a Bot API method, throwing with Telegram's description on failure. */
export async function tgCall<T = unknown>(
  method: string,
  payload: Record<string, unknown>,
): Promise<T> {
  if (!BOT_TOKEN) throw new Error("BOT_TOKEN is not set");

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const json = (await res.json()) as { ok: boolean; result?: T; description?: string };
  if (!json.ok) {
    throw new Error(`Telegram ${method} failed: ${json.description ?? res.status}`);
  }
  return json.result as T;
}

/** Sends a text message, optionally with a reply keyboard. HTML-formatted. */
export function sendMessage(
  chatId: number,
  text: string,
  replyMarkup?: ReplyKeyboardMarkup,
): Promise<TgMessage> {
  return tgCall<TgMessage>("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });
}

/** Escapes the few characters Telegram's HTML parse mode treats as markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
