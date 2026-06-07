"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { createShop } from "@/data/client";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { TextArea, TextField } from "@/components/common/form/Fields";

export function BecomeSellerForm() {
  const router = useRouter();
  const { user, shop, loading, refresh } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-on-surface-variant">
        <MaterialSymbol name="progress_activity" className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Notice
        icon="lock"
        title="Avval tizimga kiring"
        body="Do'kon ochish uchun tizimga kirishingiz kerak."
        cta="Kirish"
        href="/user/onboarding"
      />
    );
  }

  if (shop) {
    const statusLabels: Record<string, string> = {
      pending: "ko'rib chiqilmoqda",
      approved: "tasdiqlangan",
      rejected: "rad etilgan",
    };
    const statusLabel = statusLabels[shop.status as string] ?? (shop.status as string);
    return (
      <Notice
        icon="storefront"
        title="Sizda allaqachon do'kon bor"
        body={`"${shop.name}" — holati: ${statusLabel}.`}
        cta="Profilga qaytish"
        href="/user/profile"
      />
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Do'kon nomi kiritilishi shart.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await createShop(
        { name, phone, telegram, location, description },
        logo,
      );
      await refresh();
      router.replace("/user/profile");
    } catch {
      setError("So'rovni yuborib bo'lmadi. Qayta urinib ko'ring.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-stack-md">
      <p className="rounded-xl border border-[#FFE7C4] bg-[#FFF4E5] p-4 text-body-md text-[#E65100]">
        So&apos;rovingiz administrator tomonidan ko&apos;rib chiqiladi. Tasdiqlangach,
        e&apos;lonlaringiz moderatsiyasiz darhol e&apos;lon qilinadi.
      </p>

      {/* Logo */}
      <div className="flex items-center gap-4">
        <label className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-outline-variant bg-surface-container-low">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={URL.createObjectURL(logo)}
              alt="Do'kon logosi"
              className="h-full w-full object-cover"
            />
          ) : (
            <MaterialSymbol name="add_a_photo" className="text-outline" />
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
          />
        </label>
        <span className="text-body-md text-on-surface-variant">Do&apos;kon logosi (ixtiyoriy)</span>
      </div>

      <TextField
        label="Do'kon nomi *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Masalan: TechnoShop"
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998 90 123 45 67"
        />
        <TextField
          label="Telegram"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          placeholder="@username"
        />
      </div>
      <TextField
        label="Manzil"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Toshkent, Yunusobod"
      />
      <TextArea
        label="Do'kon haqida"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Nima sotasiz?"
      />

      {error && (
        <p className="rounded-lg bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-headline-md text-on-primary shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? (
          <MaterialSymbol name="progress_activity" className="animate-spin" />
        ) : (
          "So'rov yuborish"
        )}
      </button>
    </form>
  );
}

function Notice({
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
    <div className="flex flex-col items-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container text-primary">
        <MaterialSymbol name={icon} className="text-3xl" />
      </div>
      <h2 className="text-title-lg text-on-surface">{title}</h2>
      <p className="mb-6 mt-1 max-w-xs text-body-md text-on-surface-variant">{body}</p>
      <Link
        href={href}
        className="rounded-full bg-primary px-8 py-3 text-label-md text-on-primary shadow-md"
      >
        {cta}
      </Link>
    </div>
  );
}
