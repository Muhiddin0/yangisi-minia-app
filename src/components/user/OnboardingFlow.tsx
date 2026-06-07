"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

/**
 * Login screen. Inside Telegram the AuthProvider auto-authenticates via
 * initData; this screen handles the manual "Continue with Telegram" action
 * and a dev login (seeded demo account) for browser testing.
 */
export function OnboardingFlow() {
  const router = useRouter();
  const { user, loading, loginWithTelegram, loginDev, authError } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const shownError = error || authError;

  useEffect(() => {
    if (!loading && user) router.replace("/user");
  }, [loading, user, router]);

  const run = async (fn: () => Promise<void>, fallbackMsg: string) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      router.replace("/user");
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : fallbackMsg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex w-full max-w-[400px] flex-col items-center">
      <header className="mb-stack-lg text-center">
        <h1 className="mb-2 text-headline-xl-mobile text-primary">Yangisi</h1>
        <p className="text-body-md text-on-surface-variant">
          The trusted marketplace for mobile tech
        </p>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 text-on-surface-variant">
          <MaterialSymbol name="progress_activity" className="animate-spin" />
          Signing you in…
        </div>
      ) : (
        <section className="w-full space-y-stack-md">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              run(
                loginWithTelegram,
                "Telegram login is only available inside the Telegram app.",
              )
            }
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-headline-md text-on-primary shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? (
              <MaterialSymbol name="progress_activity" className="animate-spin" />
            ) : (
              <>
                <MaterialSymbol name="send" filled />
                Continue with Telegram
              </>
            )}
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => run(loginDev, "Dev login failed. Is PocketBase running?")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant text-label-lg text-on-surface-variant transition-all active:scale-[0.98] disabled:opacity-60"
          >
            <MaterialSymbol name="science" className="text-[20px]" />
            Dev login (demo account)
          </button>

          {shownError && (
            <p className="rounded-lg bg-error-container/40 px-4 py-3 text-center text-body-md text-on-error-container">
              {shownError}
            </p>
          )}

          <p className="px-4 text-center text-label-md text-outline">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </section>
      )}
    </main>
  );
}
