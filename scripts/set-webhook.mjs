#!/usr/bin/env node
/**
 * Register / inspect / remove the Telegram webhook for the bot.
 *
 * Reads BOT_TOKEN and (optionally) TELEGRAM_WEBHOOK_SECRET from `.env`.
 *
 *   node scripts/set-webhook.mjs set <publicBaseUrl>   # e.g. https://wordgram.uz
 *   node scripts/set-webhook.mjs info
 *   node scripts/set-webhook.mjs delete
 *
 * The webhook endpoint is always `<publicBaseUrl>/bot`. Telegram requires the
 * URL to be HTTPS on port 443/80/88/8443.
 */

import { readFileSync } from "node:fs";

/** Minimal .env loader (existing process env wins). */
function loadDotEnv(path = ".env") {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return;
  }
  for (const line of raw.replace(/^﻿/, "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

async function api(token, method, body) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return res.json();
}

async function main() {
  loadDotEnv();
  const token = process.env.BOT_TOKEN;
  if (!token) throw new Error("BOT_TOKEN is not set (put it in .env)");

  const cmd = process.argv[2];

  if (cmd === "set") {
    const base = process.argv[3];
    if (!base) throw new Error("Usage: set <publicBaseUrl>  e.g. https://wordgram.uz");
    const url = `${base.replace(/\/+$/, "")}/bot`;
    const body = { url, allowed_updates: ["message"], drop_pending_updates: true };
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret) body.secret_token = secret;
    console.log(`Setting webhook → ${url}${secret ? " (with secret)" : ""}`);
    console.log(await api(token, "setWebhook", body));
  } else if (cmd === "info") {
    console.log(await api(token, "getWebhookInfo"));
  } else if (cmd === "delete") {
    console.log(await api(token, "deleteWebhook", { drop_pending_updates: true }));
  } else {
    console.log("Usage: node scripts/set-webhook.mjs <set|info|delete> [publicBaseUrl]");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exitCode = 1;
});
