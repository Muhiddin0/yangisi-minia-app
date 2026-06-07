import { SearchControls } from "@/components/user/SearchControls";
import { ProductCard } from "@/components/user/ProductCard";
import { getActiveListings } from "@/data/queries";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const listings = await getActiveListings();

  return (
    <>
      <main className="px-margin-mobile pt-stack-md">
        <SearchControls />

        <section className="mt-stack-lg grid grid-cols-2 gap-gutter">
          {listings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} aspect="tall" />
          ))}
        </section>
      </main>
    </>
  );
}
