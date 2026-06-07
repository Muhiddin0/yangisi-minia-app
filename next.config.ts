import type { NextConfig } from "next";

// PocketBase origin the server reaches directly (and the proxy forwards to).
// Override with POCKETBASE_ORIGIN in production.
const PB_ORIGIN = process.env.POCKETBASE_ORIGIN ?? "http://127.0.0.1:8090";

const nextConfig: NextConfig = {
  // Allow loading the dev app through an ngrok tunnel (Telegram needs HTTPS).
  // This host changes every ngrok session — update it accordingly.
  allowedDevOrigins: ["02ef-95-214-211-27.ngrok-free.app"],

  // Proxy PocketBase through the Next origin, so the mini-app needs only ONE
  // public URL. Browser calls `<origin>/api/...` → forwarded to PocketBase.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${PB_ORIGIN}/api/:path*` }];
  },
};

export default nextConfig;
