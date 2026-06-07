import type { SellerListing } from "@/lib/types";
import { Img } from "@/components/common/Img";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { formatSom } from "@/lib/format";
import { cn } from "@/lib/cn";

const STATUS_BADGE: Record<SellerListing["status"], string> = {
  active: "bg-tertiary/10 text-tertiary",
  moderation: "bg-secondary-container text-on-secondary-container",
  sold: "bg-on-secondary-fixed-variant/10 text-on-secondary-fixed-variant",
};

export function SellerListingCard({
  listing,
  onSold,
  onDelete,
}: {
  listing: SellerListing;
  onSold?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const sold = listing.status === "sold";
  const moderation = listing.status === "moderation";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-outline-variant p-md transition-all",
        sold
          ? "bg-surface-container-low"
          : "bg-surface-container-lowest hover:shadow-lg",
      )}
    >
      {sold && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/40">
          <span className="rotate-12 rounded-full bg-secondary px-4 py-1.5 text-label-lg text-white shadow-md">
            SOTILDI
          </span>
        </div>
      )}

      <div className={cn("flex gap-4", sold && "grayscale")}>
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container">
          <Img src={listing.image} alt={listing.title} />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between">
            <span
              className={cn(
                "rounded px-2 py-0.5 text-label-sm",
                STATUS_BADGE[listing.status],
              )}
            >
              {listing.statusLabel}
            </span>
            <button
              type="button"
              aria-label="Listing actions"
              className="text-outline transition-colors hover:text-primary"
            >
              <MaterialSymbol name="more_vert" />
            </button>
          </div>
          <h3 className="mt-1 line-clamp-1 text-title-md">{listing.title}</h3>
          <p className="mt-0.5 font-bold text-primary">{formatSom(listing.price)}</p>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 flex items-center gap-6 border-t border-outline-variant pt-4",
          moderation && "opacity-60",
          sold && "grayscale",
        )}
      >
        <span className="flex items-center gap-1.5 text-on-surface-variant">
          <MaterialSymbol name="visibility" className="text-[18px]" />
          <span className="text-label-sm">{listing.views}</span>
        </span>
        <span className="flex items-center gap-1.5 text-on-surface-variant">
          <MaterialSymbol name="bookmark" className="text-[18px]" />
          <span className="text-label-sm">{listing.saves}</span>
        </span>
        <div className="ml-auto flex items-center gap-3">
          {moderation ? (
            <p className="text-label-sm italic text-on-surface-variant">
              Tekshirilmoqda...
            </p>
          ) : sold ? (
            onDelete && (
              <button
                type="button"
                onClick={() => onDelete(listing.id)}
                className="flex items-center gap-1 text-label-lg text-outline"
              >
                Arxivlash
              </button>
            )
          ) : (
            onSold && (
              <button
                type="button"
                onClick={() => onSold(listing.id)}
                className="flex items-center gap-1 text-label-lg text-primary"
              >
                Sotildi
                <MaterialSymbol name="check_circle" className="text-[16px]" />
              </button>
            )
          )}
          {onDelete && !sold && (
            <button
              type="button"
              aria-label="Delete listing"
              onClick={() => onDelete(listing.id)}
              className="text-error/70 transition-colors hover:text-error"
            >
              <MaterialSymbol name="delete" className="text-[18px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
