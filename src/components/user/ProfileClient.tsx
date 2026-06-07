"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

export function ProfileClient() {
  const { user, shop, favorites, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-on-surface-variant">
        <MaterialSymbol name="progress_activity" className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="mb-6 text-body-lg text-on-surface-variant">
          Profilingizni ko&apos;rish uchun tizimga kiring.
        </p>
        <Link
          href="/user/onboarding"
          className="rounded-full bg-primary px-8 py-3 text-label-md text-on-primary shadow-md"
        >
          Kirish
        </Link>
      </div>
    );
  }

  const name = user.name || user.telegram_username || "Yangisi foydalanuvchisi";
  const handle = user.telegram_username
    ? `@${user.telegram_username}`
    : "Xaridor hisobi";
  const initial = name.trim().charAt(0).toUpperCase() || "Y";

  // Approved sellers manage their shop listings; everyone else gets the
  // individual "my listings" page.
  const isApprovedSeller = shop?.status === "approved";
  const myListingsHref = isApprovedSeller ? "/seller/listings" : "/user/listings";

  return (
    <main className="px-margin-mobile pb-32">
      {/* Hero */}
      <section className="mb-8 mt-stack-lg flex flex-col items-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary-fixed text-headline-lg font-bold text-primary shadow-md">
          {initial}
        </div>
        <h2 className="text-headline-md text-on-surface">{name}</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">{handle}</p>
      </section>

      {/* Seller status card */}
      <SellerCard shop={shop} />

      {/* Menu */}
      <nav className="mt-2 space-y-2">
        <Row href={myListingsHref} icon="list_alt" label="Mening e'lonlarim" />
        <Row
          href="/user/saved"
          icon="favorite"
          label={`Saqlangan (${favorites.size})`}
        />
      </nav>
    </main>
  );
}

function SellerCard({ shop }: { shop: ReturnType<typeof useAuth>["shop"] }) {
  if (!shop) {
    return (
      <Link
        href="/user/become-seller"
        className="flex items-center gap-4 rounded-xl border border-primary-container/20 bg-primary-container/10 p-4 transition-colors hover:bg-primary-container/20"
      >
        <MaterialSymbol name="storefront" className="text-primary" />
        <div className="flex-1">
          <p className="text-title-md text-on-surface">Sotuvchi bo&apos;lish</p>
          <p className="text-body-md text-on-surface-variant">
            Do&apos;kon oching va telefonlaringizni soting.
          </p>
        </div>
        <MaterialSymbol name="chevron_right" className="text-outline" />
      </Link>
    );
  }

  const status = shop.status as string;
  if (status === "approved") {
    return (
      <Link
        href="/seller"
        className="flex items-center gap-4 rounded-xl border border-tertiary/20 bg-tertiary-fixed p-4 transition-colors hover:opacity-90"
      >
        <MaterialSymbol name="verified" filled className="text-tertiary" />
        <div className="flex-1">
          <p className="text-title-md text-on-surface">{shop.name}</p>
          <p className="text-body-md text-on-surface-variant">
            Sotuvchi panelini oching.
          </p>
        </div>
        <MaterialSymbol name="chevron_right" className="text-outline" />
      </Link>
    );
  }

  // pending / rejected
  const rejected = status === "rejected";
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4",
        rejected
          ? "border-error/20 bg-error-container/30"
          : "border-[#FFE7C4] bg-[#FFF4E5]",
      )}
    >
      <MaterialSymbol
        name={rejected ? "cancel" : "pending_actions"}
        className={rejected ? "text-error" : "text-[#E65100]"}
      />
      <div className="flex-1">
        <p className="text-title-md text-on-surface">{shop.name}</p>
        <p className="text-body-md text-on-surface-variant">
          {rejected
            ? "Sotuvchilik so'rovingiz rad etildi."
            : "Sotuvchilik so'rovingiz ko'rib chiqilmoqda."}
        </p>
      </div>
    </div>
  );
}

function Row({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
    >
      <span className="flex items-center gap-4">
        <MaterialSymbol
          name={icon}
          className="text-on-surface-variant transition-colors group-hover:text-primary"
        />
        <span className="text-body-lg text-on-surface">{label}</span>
      </span>
      <MaterialSymbol name="chevron_right" className="text-outline-variant" />
    </Link>
  );
}
