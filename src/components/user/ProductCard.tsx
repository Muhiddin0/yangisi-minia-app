import Link from "next/link";
import type { Listing } from "@/lib/types";
import { Img } from "@/components/common/Img";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { SaveButton } from "./SaveButton";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Maps a listing condition to its badge styling. */
function conditionBadgeClass(listing: Listing): string {
  return listing.condition === "used"
    ? "bg-on-surface-variant/80 text-white"
    : "bg-primary/90 text-on-primary";
}

interface ProductCardProps {
  listing: Listing;
  /** Card image aspect ratio. */
  aspect?: "square" | "tall";
}

/** Product grid card used on home, search, saved and shop screens. */
export function ProductCard({ listing, aspect = "square" }: ProductCardProps) {
  // Dedicated poster first, then fall back to the first gallery image.
  const cover = listing.poster || listing.images[0];
  return (
    <Link
      href={`/user/listing/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-transform active:scale-[0.98]"
    >
      <div
        className={cn(
          "relative overflow-hidden bg-surface-container-high",
          aspect === "square" ? "aspect-square" : "aspect-[4/5]",
        )}
      >
        {cover ? (
          <Img
            src={cover}
            alt={listing.title}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-outline">
            <MaterialSymbol name="smartphone" className="text-4xl" />
          </div>
        )}
        <SaveButton
          listingId={listing.id}
          className="absolute right-2 top-2"
        />
        <span
          className={cn(
            "absolute bottom-2 left-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            conditionBadgeClass(listing),
          )}
        >
          {listing.conditionLabel}
        </span>
      </div>
      <div className="flex flex-col gap-1 p-stack-sm">
        <span className="text-headline-md leading-tight text-primary">
          {formatPrice(listing.price)}
        </span>
        <h3 className="truncate text-body-md text-on-surface-variant">
          {listing.title}
        </h3>
        <div className="mt-1 flex items-center gap-1">
          <MaterialSymbol
            name="location_on"
            className="text-[14px] text-outline"
          />
          <span className="text-label-sm text-outline">{listing.region}</span>
        </div>
      </div>
    </Link>
  );
}
