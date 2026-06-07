import Link from "next/link";
import { HomeFeed } from "@/components/user/HomeFeed";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { getActiveListings } from "@/data/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listings = await getActiveListings();

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

      <HomeFeed listings={listings} />
    </>
  );
}
