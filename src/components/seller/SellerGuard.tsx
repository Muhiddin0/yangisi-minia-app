"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

/** Renders the seller area only for users with an approved shop. */
export function SellerGuard({ children }: { children: ReactNode }) {
  const { user, shop, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-on-surface-variant">
        <MaterialSymbol name="progress_activity" className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Gate
        icon="lock"
        title="Tizimga kirish kerak"
        body="Sotuvchi paneliga kirish uchun tizimga kiring."
        cta="Kirish"
        href="/user/onboarding"
      />
    );
  }

  if (!shop) {
    return (
      <Gate
        icon="storefront"
        title="Hozircha do'kon yo'q"
        body="Sotuvchi panelida sotishni boshlash uchun do'kon oching."
        cta="Sotuvchi bo'lish"
        href="/user/become-seller"
      />
    );
  }

  if (shop.status !== "approved") {
    return (
      <Gate
        icon="pending_actions"
        title="Do'kon tasdiqlanmoqda"
        body={`"${shop.name}" administrator tasdig'ini kutmoqda. Tasdiqlangach kirish ochiladi.`}
        cta="Ilovaga qaytish"
        href="/user"
      />
    );
  }

  return <>{children}</>;
}

function Gate({
  icon,
  title,
  body,
  cta,
  href,
}: {
  icon: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-margin-mobile text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container text-primary">
        <MaterialSymbol name={icon} className="text-3xl" />
      </div>
      <h2 className="text-title-lg text-on-surface">{title}</h2>
      <p className="mb-6 mt-1 text-body-md text-on-surface-variant">{body}</p>
      <Link
        href={href}
        className="rounded-full bg-primary px-8 py-3 text-label-md text-on-primary shadow-md"
      >
        {cta}
      </Link>
    </div>
  );
}
