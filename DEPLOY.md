# Deployment (Docker)

Two services, defined in [`docker-compose.yml`](./docker-compose.yml):

- **backend** — the custom PocketBase (`backend/`, module `yangisi-pb`). Built
  from Go source into a static Linux binary; Go migrations apply automatically
  on start.
- **web** — the Next.js app, built as a standalone server.

The browser only ever talks to **web** (same origin). Next proxies `/api/*` to
the backend over the internal Docker network, so PocketBase needs no public URL
and there is no CORS.

```
browser ──▶ web:3000 ──(/api/* rewrite)──▶ backend:8090 (PocketBase)
```

## First run

```bash
# 1. Configure the Telegram bot token
cp .env.example .env
#    edit .env → set BOT_TOKEN

# 2. Build & start
docker compose up -d --build

# 3. Create a PocketBase superuser (for the admin UI)
docker compose exec backend /pb/yangisi-pb superuser upsert admin@example.com 'ChangeMe123!'
```

- App:        http://localhost:3000
- PB admin:   http://127.0.0.1:8090/_/  (bound to localhost only)

## Notes

- **Data persistence** — PocketBase data (DB, uploaded files, backups) lives in
  the `pb_data` named volume. It survives `docker compose down`; remove it with
  `docker compose down -v` (deletes all data).
- **BOT_TOKEN** is read from the environment and overrides the source fallback —
  keep the real token in `.env` only (git-ignored).
- **Production URL / HTTPS** — put a reverse proxy (nginx/Caddy/Traefik) with TLS
  in front of `web:3000`. The browser base URL stays empty (same origin), so no
  rebuild is needed when the public hostname changes. For Telegram, point the
  mini-app at that HTTPS URL.
- If the public host ever needs to reach PocketBase on a **different** origin,
  rebuild `web` with `--build-arg NEXT_PUBLIC_POCKETBASE_URL=https://...` (and
  enable CORS on PocketBase). The default same-origin proxy avoids this.
- The leftover `backend/yangisi-pb.exe` (Windows binary) is not used by Docker
  and is git/docker-ignored — safe to delete.
