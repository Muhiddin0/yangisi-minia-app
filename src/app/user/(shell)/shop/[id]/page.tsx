import { notFound } from "next/navigation";
import { ShopTabs } from "@/components/user/ShopTabs";
import { ProductCard } from "@/components/user/ProductCard";
import { Img } from "@/components/common/Img";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { getShopById, getShopListings } from "@/data/queries";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  params,
}: PageProps<"/user/shop/[id]">) {
  const { id } = await params;

  const shop = await getShopById(id);
  if (!shop) notFound();

  const listings = await getShopListings(id);

  return (
    <>
      <main className="px-margin-mobile pt-stack-md">
        {/* Shop hero */}
        <section className="flex flex-col gap-stack-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-stack-md shadow-sm">
          <div className="flex items-start gap-stack-md">
            <div className="relative">
              <Img
                src={shop.logo}
                alt={shop.name}
                className="h-20 w-20 rounded-xl bg-surface-container-highest"
              />
              {shop.verified && (
                <div className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border-2 border-surface bg-primary p-1 text-on-primary">
                  <MaterialSymbol
                    name="verified"
                    filled
                    className="text-[16px]"
                  />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-headline-lg-mobile text-on-surface">
                {shop.name}
              </h2>
              {shop.reviewsCount > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  <MaterialSymbol
                    name="star"
                    filled
                    className="text-[18px] text-[#FFB400]"
                  />
                  <span className="text-body-md font-bold">{shop.rating}</span>
                  <span className="text-body-md text-on-surface-variant">
                    ({shop.reviewsCount} sharh)
                  </span>
                </div>
              )}
              <div className="mt-2 flex flex-col gap-1 text-body-md text-on-surface-variant">
                {shop.location && (
                  <div className="flex items-center gap-2">
                    <MaterialSymbol name="location_on" className="text-[18px]" />
                    <span>{shop.location}</span>
                  </div>
                )}
                {shop.hours && (
                  <div className="flex items-center gap-2">
                    <MaterialSymbol name="schedule" className="text-[18px]" />
                    <span>{shop.hours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-stack-md">
            <a
              href={`tel:${shop.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95"
            >
              <MaterialSymbol name="call" />
              <span>Qo&apos;ng&apos;iroq</span>
            </a>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-secondary-container py-3 font-bold text-on-secondary-container transition-all hover:bg-outline-variant/30 active:scale-95"
            >
              <MaterialSymbol name="chat" />
              <span>Yozish</span>
            </button>
          </div>
        </section>

        <ShopTabs
          listingsSlot={
            <section className="mt-stack-md grid grid-cols-2 gap-gutter pb-4">
              {listings.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </section>
          }
        />
      </main>
    </>
  );
}
