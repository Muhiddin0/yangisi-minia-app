import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageCarousel } from "@/components/user/ImageCarousel";
import { SaveButton } from "@/components/user/SaveButton";
import { Img } from "@/components/common/Img";
import { BackButton } from "@/components/common/BackButton";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import type { Spec } from "@/lib/types";
import { formatPriceFull } from "@/lib/format";
import { getListingById, getShopById } from "@/data/queries";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: PageProps<"/user/listing/[id]">) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const shop = listing.shopId ? await getShopById(listing.shopId) : null;

  const specs: Spec[] = [
    { label: "Brend", value: listing.brandName ?? "—" },
    { label: "Model", value: listing.model },
    { label: "Xotira", value: listing.memory },
    { label: "RAM", value: listing.ram },
    { label: "Rang", value: listing.color },
    ...(listing.batteryHealth
      ? [{ label: "Batareya", value: `${listing.batteryHealth}% holat` }]
      : []),
  ];

  return (
    <>
      {/* Top app bar */}
      <header className="fixed top-0 z-40 flex h-16 w-full items-center justify-between bg-surface px-margin-mobile py-stack-sm">
        <BackButton fallback="/user" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Ulashish"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container active:scale-95"
          >
            <MaterialSymbol name="share" />
          </button>
          <button
            type="button"
            aria-label="Boshqa amallar"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container active:scale-95"
          >
            <MaterialSymbol name="more_vert" />
          </button>
        </div>
      </header>

      <main className="pb-32 pt-16">
        <ImageCarousel images={listing.images} alt={listing.title} />

        {/* Identity */}
        <section className="mt-stack-lg px-margin-mobile">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 inline-flex rounded-full bg-secondary-container px-3 py-1 text-label-sm text-on-secondary-container">
                {listing.conditionLabel}
              </div>
              <h1 className="text-headline-lg-mobile text-on-surface">
                {listing.title}
              </h1>
            </div>
            <SaveButton
              listingId={listing.id}
              variant="plain"
              className="rounded-full bg-surface-container-low p-3 shadow-sm"
            />
          </div>
          <div className="mt-2">
            <p className="text-headline-xl-mobile text-primary">
              {formatPriceFull(listing.price)}
            </p>
            <p className="mt-1 text-body-md text-on-surface-variant">
              {listing.publishedAt} • {listing.region}
            </p>
          </div>
        </section>

        <Divider />

        {/* Xususiyatlar */}
        <section className="px-margin-mobile">
          <h2 className="mb-stack-md text-headline-md">Xususiyatlar</h2>
          <div className="grid grid-cols-2 gap-x-gutter gap-y-stack-md">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col">
                <span className="text-label-md text-on-surface-variant">
                  {spec.label}
                </span>
                <span className="text-body-lg">{spec.value}</span>
              </div>
            ))}
            {listing.warranty && (
              <div className="col-span-2 flex flex-col">
                <span className="text-label-md text-on-surface-variant">
                  Kafolat
                </span>
                <span className="text-body-lg">{listing.warranty}</span>
              </div>
            )}
          </div>
        </section>

        <Divider />

        {/* Tavsif */}
        <section className="px-margin-mobile">
          <h2 className="mb-stack-sm text-headline-md">Tavsif</h2>
          <p className="text-body-lg leading-relaxed text-on-surface-variant">
            {listing.description}
          </p>
        </section>

        {shop && (
          <>
            <Divider />
            <section className="px-margin-mobile">
              <Link
                href={`/user/shop/${shop.id}`}
                className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-low p-stack-md shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-outline-variant/10 bg-white shadow-sm">
                    <Img src={shop.logo} alt={shop.name} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-headline-md">{shop.name}</h3>
                      {shop.verified && (
                        <MaterialSymbol
                          name="verified"
                          filled
                          className="text-lg text-primary"
                        />
                      )}
                    </div>
                    {shop.reviewsCount > 0 && (
                      <div className="mt-0.5 flex items-center gap-1">
                        <MaterialSymbol
                          name="star"
                          filled
                          className="text-sm text-[#FFB400]"
                        />
                        <span className="text-label-md text-on-surface">
                          {shop.rating}
                        </span>
                        <span className="text-label-md text-on-surface-variant">
                          • {shop.reviewsCount} sharh
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="rounded-full bg-surface p-2 text-primary">
                  <MaterialSymbol name="chevron_right" />
                </span>
              </Link>
            </section>
          </>
        )}
      </main>

      {/* Sticky contact bar */}
      <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-outline-variant/10 bg-surface-container-lowest/90 px-margin-mobile pb-safe pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl gap-4">
          <a
            href={`tel:${(shop?.phone ?? "").replace(/\s/g, "")}`}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary text-headline-md text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]"
          >
            <MaterialSymbol name="call" />
            Qo&apos;ng&apos;iroq
          </a>
          <button
            type="button"
            className="flex h-14 flex-[1.5] items-center justify-center gap-2 rounded-xl bg-primary text-headline-md text-on-primary shadow-lg shadow-primary/20 transition-colors hover:bg-primary-container active:scale-[0.98]"
          >
            <MaterialSymbol name="chat" />
            Yozish
          </button>
        </div>
      </footer>
    </>
  );
}

function Divider() {
  return (
    <div className="mx-margin-mobile my-stack-lg h-px bg-outline-variant opacity-30" />
  );
}
