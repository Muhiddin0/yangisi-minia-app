import type { NextConfig } from "next";

// PocketBase origin the server reaches directly (and the proxy forwards to).
// Override with POCKETBASE_ORIGIN in production.
const PB_ORIGIN = process.env.POCKETBASE_ORIGIN ?? "http://127.0.0.1:8090";

const nextConfig: NextConfig = {
  // Emit a self-contained server (.next/standalone/server.js) so the production
  // Docker image stays small and needs no node_modules at runtime.
  output: "standalone",

  // Allow loading the dev app through an ngrok tunnel (Telegram needs HTTPS).
  // This host changes every ngrok session — update it accordingly.
  allowedDevOrigins: ["02ef-95-214-211-27.ngrok-free.app"],

  // Proxy PocketBase through the Next origin, so the mini-app needs only ONE
  // public URL. Browser calls `<origin>/api/...` → forwarded to PocketBase.
  // `/_/...` is the PocketBase admin (superuser) UI — proxied too so it is
  // reachable at `<origin>/_/` without exposing port 8090 publicly.
  // In Docker this resolves to the compose service (http://backend:8090) and is
  // baked at build time, so POCKETBASE_ORIGIN must be set as a build arg.
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${PB_ORIGIN}/api/:path*` },
      { source: "/_/:path*", destination: `${PB_ORIGIN}/_/:path*` },
    ];
  },
};

export default nextConfig;
