# Telegram bot (seller)

A small webhook bot served by the Next.js app itself — no extra process.

- **Endpoint:** `POST /bot` ([src/app/bot/route.ts](src/app/bot/route.ts)).
  It is **not** under `/api`, because `next.config.ts` proxies `/api/*` to
  PocketBase.
- **`/start`** → greeting + an "Ilovani ochish" reply button that opens the
  Mini App (`<APP_BASE_URL>/seller`).
- **`/seller`** → looks the Telegram user up by `telegram_id` and reads
  `users.is_seller`; if set, opens the seller Mini App, otherwise points them to
  the "become a seller" flow ([src/data/botSeller.ts](src/data/botSeller.ts)).
  The `users` collection isn't publicly readable, so this lookup authenticates
  as a PocketBase superuser (see env below).

## Env

Set in `.env` (see `.env.example`):

| Var | Purpose |
| --- | --- |
| `BOT_TOKEN` | Bot token from @BotFather (shared with PocketBase auth). |
| `APP_BASE_URL` | Public HTTPS origin of the Mini App, no trailing slash. In dev use your ngrok URL. |
| `TELEGRAM_WEBHOOK_SECRET` | Optional. If set, the webhook rejects requests without the matching `X-Telegram-Bot-Api-Secret-Token` header. |
| `POCKETBASE_SUPERUSER_EMAIL` / `POCKETBASE_SUPERUSER_PASSWORD` | Superuser the `/seller` check uses to read `users.is_seller`. Create one in the admin UI (`/_/`). |

In Docker these are passed to the `web` service in `docker-compose.yml` (the
standalone server reads process env, not `.env`).

## Register the webhook

```bash
# Production
npm run bot:webhook set https://wordgram.uz

# Dev (Telegram needs HTTPS — tunnel localhost:3000 with ngrok first)
npm run bot:webhook set https://<your-ngrok-host>

npm run bot:webhook info     # inspect
npm run bot:webhook delete   # remove
```

The endpoint becomes `<baseUrl>/bot`. The script sends `TELEGRAM_WEBHOOK_SECRET`
as the webhook `secret_token` automatically when it is set.
