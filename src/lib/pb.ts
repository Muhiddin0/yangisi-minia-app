import PocketBase from "pocketbase";

/**
 * Public PocketBase base for the browser, used to build file URLs and the
 * manual auth-with-telegram fetch.
 *
 * Empty string = the app's own origin, so these requests hit `/api/*` and are
 * proxied to PocketBase by the Next rewrite (see next.config.ts). That means no
 * cross-origin host and therefore no CORS — whether the app is opened at
 * http://localhost:3000 or through the public (ngrok) tunnel in Telegram.
 *
 * Only set NEXT_PUBLIC_POCKETBASE_URL to an absolute origin if the browser must
 * reach PocketBase on a DIFFERENT host than the app itself (then that host must
 * send the proper Access-Control-Allow-Origin headers).
 */
export const POCKETBASE_URL = (
  process.env.NEXT_PUBLIC_POCKETBASE_URL ?? ""
).replace(/\/+$/, "");

/** Origin the server talks to directly (bypassing the public proxy/tunnel). */
const SERVER_POCKETBASE_URL =
  process.env.POCKETBASE_ORIGIN ?? "http://127.0.0.1:8090";

/**
 * Shared PocketBase client for Client Components / browser usage. With an empty
 * POCKETBASE_URL the SDK resolves requests against the page's own origin ("/"),
 * so they go through the Next proxy and are never blocked by CORS. Its auth
 * store persists in the browser automatically.
 */
export const pb = new PocketBase(POCKETBASE_URL || "/");

/**
 * Telegram opens the mini-app through an ngrok tunnel. ngrok's free tier
 * otherwise serves an HTML "browser warning" interstitial for browser-issued
 * requests, which corrupts the JSON API responses (and the auth flow). This
 * header skips it. It is harmless on non-ngrok hosts, and because all browser
 * calls are same-origin (see POCKETBASE_URL) it never triggers a CORS preflight.
 */
pb.beforeSend = (url, options) => {
  options.headers = {
    ...options.headers,
    "ngrok-skip-browser-warning": "true",
  };
  return { url, options };
};

/**
 * Fresh PocketBase instance for server-side usage (Server Components, route
 * handlers). Reaches PocketBase directly and is never shared across requests.
 */
export function createServerClient(): PocketBase {
  return new PocketBase(SERVER_POCKETBASE_URL);
}
