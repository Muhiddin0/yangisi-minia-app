import Link from "next/link";
import { BrandChips } from "@/components/user/BrandChips";
import { ProductCard } from "@/components/user/ProductCard";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { getActiveListings, getBrands } from "@/data/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [listings, brands] = await Promise.all([
    getActiveListings(),
    getBrands(),
  ]);

  return (
    <>
      {/* Search entry point */}
      <section className="px-margin-mobile pt-stack-md">
        <Link
          href="/user/search"
          className="relative flex items-center rounded-xl bg-surface-container-low py-4 pl-12 pr-4"
        >
          <MaterialSymbol
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
          />
          <span className="text-body-md text-outline-variant">
            Telefon qidirish...
          </span>
        </Link>
      </section>

      <section className="mt-stack-lg">
        <BrandChips brands={brands} />
      </section>

      <section className="mt-stack-lg flex items-center justify-between px-margin-mobile">
        <h2 className="text-headline-md text-on-surface">Tavsiya etamiz</h2>
        <Link href="/user/search" className="text-label-md text-primary">
          Barchasi
        </Link>
      </section>

      <main className="mt-stack-md px-margin-mobile">
        <div className="grid grid-cols-2 gap-gutter">
          {listings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      </main>
    </>
  );
}
