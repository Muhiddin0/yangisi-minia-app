"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RecordModel } from "pocketbase";
import { pb, POCKETBASE_URL } from "@/lib/pb";

/** Resolves once the Telegram WebApp script has loaded, or after a timeout. */
function waitForTelegram(maxMs = 3000): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || window.Telegram?.WebApp) {
      return resolve();
    }
    const start = Date.now();
    const id = setInterval(() => {
      if (window.Telegram?.WebApp || Date.now() - start > maxMs) {
        clearInterval(id);
        resolve();
      }
    }, 80);
  });
}

/** Rejects if `promise` hasn't settled within `ms`, so init can never hang. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

interface AuthContextValue {
  user: RecordModel | null;
  /** The signed-in user's shop (any status), if they created one. */
  shop: RecordModel | null;
  favorites: Set<string>;
  loading: boolean;
  isSeller: boolean;
  /** Last auto-login error (e.g. Telegram validation failure), if any. */
  authError: string | null;
  loginWithTelegram: () => Promise<void>;
  loginDev: () => Promise<void>;
  logout: () => void;
  isFavorite: (listingId: string) => boolean;
  /** Toggles a favorite; returns the new saved state. */
  toggleFavorite: (listingId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [shop, setShop] = useState<RecordModel | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadUserData = useCallback(async (current: RecordModel | null) => {
    if (!current) {
      setShop(null);
      setFavorites(new Set());
      return;
    }
    const [shopRes, favRes] = await Promise.allSettled([
      pb.collection("shops").getFirstListItem(`owner = "${current.id}"`),
      pb.collection("favorites").getFullList({ filter: `user = "${current.id}"` }),
    ]);
    setShop(shopRes.status === "fulfilled" ? shopRes.value : null);
    setFavorites(
      favRes.status === "fulfilled"
        ? new Set(favRes.value.map((f) => f.listing as string))
        : new Set(),
    );
  }, []);

  const refresh = useCallback(async () => {
    const current = pb.authStore.record;
    setUser(current);
    await loadUserData(current);
  }, [loadUserData]);

  const loginWithTelegram = useCallback(async () => {
    const initData =
      typeof window !== "undefined" ? window.Telegram?.WebApp?.initData : "";
    if (!initData) {
      throw new Error(
        "Telegram ma'lumotlari topilmadi. Ilovani to'g'ridan-to'g'ri havola orqali emas, botning menyu tugmasi orqali oching.",
      );
    }

    const res = await fetch(
      `${POCKETBASE_URL}/api/collections/users/auth-with-telegram`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ data: initData }),
        // Don't let a stuck tunnel keep the login (and the spinner) pending.
        signal: AbortSignal.timeout(8000),
      },
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(
          "Serverga ulanib bo'lmadi (404). Iltimos, birozdan so'ng qayta urinib ko'ring.",
        );
      }
      // Surface PocketBase field-level details, e.g. "email: Cannot be blank."
      let detail = json?.message || `HTTP ${res.status}`;
      const fields = json?.data as Record<string, { message?: string }> | undefined;
      if (fields && typeof fields === "object") {
        const parts = Object.entries(fields)
          .map(([k, v]) => `${k}: ${v?.message ?? String(v)}`)
          .filter(Boolean);
        if (parts.length) detail += ` (${parts.join(", ")})`;
      }
      throw new Error(detail);
    }
    pb.authStore.save(json.token, json.record);
    await refresh();
  }, [refresh]);

  const loginDev = useCallback(async () => {
    await pb
      .collection("users")
      .authWithPassword("demo@yangisi.uz", "demo12345678");
    await refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
    setShop(null);
    setFavorites(new Set());
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.has(id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (listingId: string): Promise<boolean> => {
      const current = pb.authStore.record;
      if (!current) throw new Error("Not authenticated");

      if (favorites.has(listingId)) {
        const rec = await pb
          .collection("favorites")
          .getFirstListItem(`user = "${current.id}" && listing = "${listingId}"`);
        await pb.collection("favorites").delete(rec.id);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(listingId);
          return next;
        });
        return false;
      }

      await pb
        .collection("favorites")
        .create({ user: current.id, listing: listingId });
      setFavorites((prev) => new Set(prev).add(listingId));
      return true;
    },
    [favorites],
  );

  useEffect(() => {
    let active = true;
    const finish = () => {
      if (active) setLoading(false);
    };

    // Safety net: never leave the app stuck on a spinner, even if a network
    // call never settles (e.g. an unreachable tunnel in the Telegram WebView).
    const hardStop = setTimeout(finish, 9000);

    (async () => {
      try {
        if (pb.authStore.isValid) {
          try {
            await withTimeout(pb.collection("users").authRefresh(), 6000);
          } catch {
            pb.authStore.clear();
          }
        }

        // Not signed in yet — wait for the Telegram script, then auto-login
        // with initData if we're running inside Telegram.
        if (!pb.authStore.isValid) {
          await waitForTelegram();
          const initData = window.Telegram?.WebApp?.initData;
          if (initData) {
            try {
              window.Telegram?.WebApp.ready();
            } catch {
              /* ignore */
            }
            try {
              await loginWithTelegram();
            } catch (e) {
              // Keep the user anonymous, but remember why so the login
              // screen can show the exact reason.
              setAuthError(e instanceof Error ? e.message : "Telegram orqali kirishda xatolik yuz berdi.");
            }
          }
        }

        try {
          await withTimeout(refresh(), 6000);
        } catch {
          // Show whatever state we have; the pages fall back to a sign-in
          // prompt rather than spinning forever.
        }
      } finally {
        clearTimeout(hardStop);
        finish();
      }
    })();

    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.record);
    });

    return () => {
      active = false;
      clearTimeout(hardStop);
      unsubscribe();
    };
  }, [loginWithTelegram, refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      shop,
      favorites,
      loading,
      isSeller: Boolean(user?.is_seller),
      authError,
      loginWithTelegram,
      loginDev,
      logout,
      isFavorite,
      toggleFavorite,
      refresh,
    }),
    [
      user,
      shop,
      favorites,
      loading,
      authError,
      loginWithTelegram,
      loginDev,
      logout,
      isFavorite,
      toggleFavorite,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
