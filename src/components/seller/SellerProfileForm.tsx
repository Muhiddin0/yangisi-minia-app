"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { updateShop } from "@/data/client";
import { fileUrl } from "@/data/map";
import { TextArea, TextField } from "@/components/common/form/Fields";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

export function SellerProfileForm() {
  const { shop, refresh } = useAuth();

  // SellerGuard guarantees an approved shop is present when this mounts,
  // so we can seed the form fields directly from it.
  const [name, setName] = useState((shop?.name as string) || "");
  const [phone, setPhone] = useState((shop?.phone as string) || "");
  const [telegram, setTelegram] = useState((shop?.telegram as string) || "");
  const [location, setLocation] = useState((shop?.location as string) || "");
  const [description, setDescription] = useState(
    (shop?.description as string) || "",
  );
  const [logo, setLogo] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");

  if (!shop) return null;

  const currentLogo = shop.logo ? fileUrl(shop, shop.logo as string) : null;
  const preview = logo ? URL.createObjectURL(logo) : currentLogo;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("saving");
    try {
      await updateShop(
        shop.id,
        { name, phone, telegram, location, description },
        logo,
      );
      await refresh();
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-2xl space-y-lg px-margin-mobile pb-16 pt-lg"
    >
      <section className="flex flex-col items-center space-y-md">
        <label className="relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border-4 border-surface-container-highest bg-surface-container-low shadow-lg">
          {preview ? (
            <img src={preview} alt="Do'kon logosi" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-outline">
              <MaterialSymbol name="add_a_photo" className="text-2xl" />
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
          />
          <span className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-on-primary shadow-md">
            <MaterialSymbol name="edit" className="text-[16px]" />
          </span>
        </label>
      </section>

      {shop.verified && (
        <section className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary-fixed p-md text-on-primary-fixed">
          <div className="flex items-center gap-md">
            <div className="rounded-full bg-primary-container p-2">
              <MaterialSymbol name="verified" filled className="text-on-primary-container" />
            </div>
            <div>
              <h3 className="text-title-md">Tasdiqlangan do&apos;kon</h3>
              <p className="text-body-md opacity-80">
                Do&apos;koningiz barcha tekshiruvlardan o&apos;tgan.
              </p>
            </div>
          </div>
          <MaterialSymbol name="check_circle" className="text-[32px] text-primary" />
        </section>
      )}

      <div className="space-y-md">
        <TextField label="Do'kon nomi" value={name} onChange={(e) => setName(e.target.value)} />
        <TextArea
          label="Do'kon haqida"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          <TextField label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextField label="Telegram" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
        </div>
        <TextField label="Manzil" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <button
        type="submit"
        disabled={state === "saving"}
        className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl text-title-md shadow-lg transition-all active:scale-95 ${
          state === "done"
            ? "bg-tertiary-container text-on-tertiary-container"
            : "bg-primary text-on-primary"
        }`}
      >
        {state === "saving" ? (
          <>
            <MaterialSymbol name="progress_activity" className="animate-spin" />
            Saqlanmoqda...
          </>
        ) : state === "done" ? (
          <>
            <MaterialSymbol name="check" />
            Saqlandi!
          </>
        ) : (
          <>
            <MaterialSymbol name="save" filled />
            Saqlash
          </>
        )}
      </button>
    </form>
  );
}
