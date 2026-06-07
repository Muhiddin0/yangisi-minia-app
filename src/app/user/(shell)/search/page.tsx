import { SearchView } from "@/components/user/SearchView";
import { getActiveListings } from "@/data/queries";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const listings = await getActiveListings();

  return (
    <main className="px-margin-mobile pt-stack-md">
      <SearchView listings={listings} />
    </main>
  );
}
