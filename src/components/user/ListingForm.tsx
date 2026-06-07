"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { createListing, getBrandOptions } from "@/data/client";
import { MediaUploader } from "@/components/common/form/MediaUploader";
import { ChipSelect } from "@/components/common/form/ChipSelect";
import { FieldLabel, TextArea, TextField } from "@/components/common/form/Fields";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];
const MEMORY = ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"];
const RAM = ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB"];
const COLORS = ["Black", "White", "Silver", "Blue", "Green", "Gold"];
const REGIONS = ["Tashkent", "Samarkand", "Bukhara", "Andijan", "Fergana", "Namangan"];

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
  const [color, setColor] = useState("Black");
  const [region, setRegion] = useState("Tashkent");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBrandOptions()
      .then((list) => {
        setBrands(list);
        setBrandId((current) => current || list[0]?.id || "");
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <Notice
        title="Sign in to post"
        body="You need an account to create a listing."
        cta="Sign in"
        href="/user/onboarding"
      />
    );
  }

  const approvedShop = mode === "seller" && shop?.status === "approved" ? shop : null;

  if (mode === "seller" && !approvedShop) {
    return (
      <Notice
        title="Approved shop required"
        body="Your shop must be approved before posting from the seller dashboard."
        cta="Become a seller"
        href="/user/become-seller"
      />
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return setError("Title is required.");
    if (!price || Number(price) <= 0) return setError("Enter a valid price.");
    if (files.length === 0) return setError("Add at least one photo.");

    setBusy(true);
    setError("");
    try {
      await createListing(
        {
          title,
          brandId: brandId || undefined,
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
    } catch {
      setError("Could not publish. Please check the fields and try again.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-stack-lg">
      <section>
        <FieldLabel className="mb-stack-sm block uppercase">Photos / Video</FieldLabel>
        <MediaUploader value={files} onChange={setFiles} />
      </section>

      <TextField
        label="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. iPhone 15 Pro Max 256GB"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <FieldLabel>Brand</FieldLabel>
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
        <FieldLabel className="block">Condition</FieldLabel>
        <ChipSelect
          options={CONDITIONS}
          defaultValue="used"
          onChange={setCondition}
        />
      </div>

      <div className="space-y-1">
        <FieldLabel>Price (so&apos;m) *</FieldLabel>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0"
          className={`${inputClass} font-bold`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel className="block">Memory</FieldLabel>
          <ChipSelect
            options={MEMORY}
            defaultValue="128 GB"
            variant="rounded"
            size="sm"
            onChange={setMemory}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel className="block">RAM</FieldLabel>
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
        <FieldLabel className="block">Color</FieldLabel>
        <ChipSelect options={COLORS} defaultValue="Black" onChange={setColor} />
      </div>

      <div className="space-y-1">
        <FieldLabel>Region</FieldLabel>
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
        label="Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Condition, scratches, accessories included…"
      />

      {error && (
        <p className="rounded-lg bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
          {error}
        </p>
      )}

      {mode === "user" && (
        <p className="text-body-md text-on-surface-variant">
          Your listing will be reviewed before it goes live.
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
          "Publish Listing"
        ) : (
          "Submit Listing"
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
