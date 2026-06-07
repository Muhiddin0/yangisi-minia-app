"use client";

import { Img } from "@/components/common/Img";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { useAuth } from "@/components/auth/AuthProvider";
import { fileUrl } from "@/data/map";

interface SellerHeaderProps {
  variant?: "shop" | "title";
  title?: string;
}

/** Sticky top app bar for the seller screens — reads the signed-in shop. */
export function SellerHeader({ variant = "shop", title }: SellerHeaderProps) {
  const { shop } = useAuth();
  const logo = shop?.logo ? fileUrl(shop, shop.logo as string) : null;
  const name = (shop?.name as string) || "Yangisi";

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-margin-mobile">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-fixed text-title-md font-bold text-primary">
            {logo ? (
              <Img src={logo} alt={name} />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          {variant === "shop" ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-title-md text-on-surface">{name}</span>
                {shop?.verified && (
                  <MaterialSymbol
                    name="verified"
                    filled
                    className="text-[16px] text-primary"
                  />
                )}
              </div>
              <span className="text-label-sm text-on-surface-variant">
                {(shop?.location as string) || "Toshkent, O'zbekiston"}
              </span>
            </div>
          ) : (
            <h1 className="text-title-lg text-primary">{title}</h1>
          )}
        </div>
        <button
          type="button"
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container active:scale-95"
        >
          <MaterialSymbol name="settings" />
        </button>
      </div>
    </header>
  );
}
