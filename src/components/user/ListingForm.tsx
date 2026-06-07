"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createListing,
  getBrandOptions,
  getMyListings,
  USER_LISTING_LIMIT,
} from "@/data/client";
import { MediaUploader } from "@/components/common/form/MediaUploader";
import { ChipSelect } from "@/components/common/form/ChipSelect";
import { FieldLabel, TextArea, TextField } from "@/components/common/form/Fields";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { groupDigits } from "@/lib/format";

/** Ro'yxatda yo'q brend tanlanganda yuboriladigan maxsus qiymat. */
const OTHER_BRAND = "__other__";

const CONDITIONS = [
  { value: "new", label: "Yangi" },
  { value: "like-new", label: "Yangidek" },
  { value: "used", label: "Ishlatilgan" },
  { value: "refurbished", label: "Tiklangan" },
];
const MEMORY = ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"];
const RAM = ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB"];
const COLORS = [
  { value: "Qora", label: "Qora", swatch: "bg-slate-900" },
  { value: "Oq", label: "Oq", swatch: "bg-white ring-1 ring-inset ring-outline-variant" },
  { value: "Kumush", label: "Kumush", swatch: "bg-slate-300" },
  { value: "Ko'k", label: "Ko'k", swatch: "bg-blue-600" },
  { value: "Yashil", label: "Yashil", swatch: "bg-emerald-600" },
  { value: "Oltin", label: "Oltin", swatch: "bg-amber-400" },
];
const REGIONS = ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Namangan"];

const inputClass =
  "w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-lg outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary";

/**
 * Create-listing form. mode="seller" posts under the user's approved shop
 * (published instantly); mode="user" posts as an individual (goes to
 * moderation). Final status is enforced by the server hook either way.
 */
export function ListingForm({ mode }: { mode: "user" | "seller" }) {
  const router = useRouter();
  const { user, shop, loading } = useAuth();

  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [brandId, setBrandId] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("used");
  const [memory, setMemory] = useState("128 GB");
  const [ram, setRam] = useState("8 GB");
  const [color, setColor] = useState("Qora");
  const [region, setRegion] = useState("Toshkent");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Individual posters are limited; null = still counting.
  const [userListingCount, setUserListingCount] = useState<number | null>(null);

  useEffect(() => {
    getBrandOptions()
      .then((list) => {
        setBrands(list);
        setBrandId((current) => current || list[0]?.id || "");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode !== "user" || !user) return;
    let active = true;
    getMyListings(user.id)
      .then((list) => {
        if (active) {
          setUserListingCount(list.filter((l) => l.status !== "sold").length);
        }
      })
      .catch(() => active && setUserListingCount(0));
    return () => {
      active = false;
    };
  }, [mode, user]);

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <Notice
        title="Kirish talab etiladi"
        body="E'lon joylash uchun hisobingizga kiring."
        cta="Kirish"
        href="/user/onboarding"
      />
    );
  }

  const approvedShop = mode === "seller" && shop?.status === "approved" ? shop : null;

  if (mode === "seller" && !approvedShop) {
    return (
      <Notice
        title="Tasdiqlangan do'kon kerak"
        body="Sotuvchi panelidan e'lon joylash uchun do'koningiz tasdiqlangan bo'lishi kerak."
        cta="Sotuvchi bo'lish"
        href="/user/become-seller"
      />
    );
  }

  if (mode === "user" && userListingCount === null) {
    return <Spinner />;
  }

  if (mode === "user" && (userListingCount ?? 0) >= USER_LISTING_LIMIT) {
    return (
      <Notice
        title="E'lon limiti to'ldi"
        body={`Oddiy foydalanuvchilar bir vaqtda ko'pi bilan ${USER_LISTING_LIMIT} ta e'lon joylashi mumkin. Yangi e'lon qo'shish uchun avval mavjudlaridan birini o'chiring yoki sotilgan deb belgilang.`}
        cta="E'lonlarimni boshqarish"
        href="/user/listings"
      />
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return setError("Sarlavha kiritilishi shart.");
    if (!price || Number(price) <= 0) return setError("To'g'ri narx kiriting.");
    if (files.length === 0) return setError("Kamida bitta rasm qo'shing.");

    setBusy(true);
    setError("");
    try {
      await createListing(
        {
          title,
          brandId: brandId && brandId !== OTHER_BRAND ? brandId : undefined,
          model,
          price: Number(price),
          condition,
          memory,
          ram,
          color,
          region,
          description,
          shopId: approvedShop?.id,
        },
        files,
      );
      if (mode === "seller") {
        router.replace("/seller/listings");
      } else {
        router.replace("/user");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      setError(
        message && !message.toLowerCase().includes("failed")
          ? message
          : "E'lonni joylab bo'lmadi. Maydonlarni tekshirib, qayta urinib ko'ring.",
      );
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-stack-lg">
      <section>
        <FieldLabel className="mb-stack-sm block uppercase">Rasm / Video</FieldLabel>
        <MediaUploader value={files} onChange={setFiles} />
      </section>

      <TextField
        label="Sarlavha *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Masalan: iPhone 15 Pro Max 256GB"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <FieldLabel>Brend</FieldLabel>
          <div className="relative">
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className={`${inputClass} appearance-none pr-12`}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
              <option value={OTHER_BRAND}>Boshqa</option>
            </select>
            <MaterialSymbol
              name="expand_more"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline"
            />
          </div>
        </div>
        <TextField
          label="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="15 Pro Max"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel className="block">Holati</FieldLabel>
        <ChipSelect
          options={CONDITIONS}
          defaultValue="used"
          onChange={setCondition}
        />
      </div>

      <div className="space-y-1">
        <FieldLabel>Narxi *</FieldLabel>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={groupDigits(price)}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className={`${inputClass} pr-16 font-bold`}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-body-md text-on-surface-variant">
            so&apos;m
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel className="block">Xotira</FieldLabel>
          <ChipSelect
            options={MEMORY}
            defaultValue="128 GB"
            variant="rounded"
            size="sm"
            onChange={setMemory}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel className="block">Operativ xotira (RAM)</FieldLabel>
          <ChipSelect
            options={RAM}
            defaultValue="8 GB"
            variant="rounded"
            size="sm"
            onChange={setRam}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel className="block">Rang</FieldLabel>
        <ChipSelect options={COLORS} defaultValue="Qora" onChange={setColor} />
      </div>

      <div className="space-y-1">
        <FieldLabel>Hudud</FieldLabel>
        <div className="relative">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`${inputClass} appearance-none pr-12`}
          >
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <MaterialSymbol
            name="location_on"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline"
          />
        </div>
      </div>

      <TextArea
        label="Tavsif"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Holati, chizilishlari, qo'shimcha aksessuarlar…"
      />

      {error && (
        <p className="rounded-lg bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
          {error}
        </p>
      )}

      {mode === "user" && (
        <p className="text-body-md text-on-surface-variant">
          E&apos;loningiz e&apos;lon qilinishidan oldin tekshiruvdan o&apos;tadi.{" "}
          Yana {Math.max(0, USER_LISTING_LIMIT - (userListingCount ?? 0))} ta
          e&apos;lon joylashingiz mumkin.
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-headline-md text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? (
          <MaterialSymbol name="progress_activity" className="animate-spin" />
        ) : mode === "seller" ? (
          "E'lonni joylash"
        ) : (
          "E'lonni yuborish"
        )}
      </button>
    </form>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-24 text-on-surface-variant">
      <MaterialSymbol name="progress_activity" className="animate-spin" />
    </div>
  );
}

function Notice({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
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
