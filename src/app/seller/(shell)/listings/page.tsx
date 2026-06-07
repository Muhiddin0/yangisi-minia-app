import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerListings } from "@/components/seller/SellerListings";

export default function SellerListingsPage() {
  return (
    <>
      <SellerHeader variant="title" title="Mening e'lonlarim" />
      <main className="mx-auto mt-6 max-w-[1280px] px-margin-mobile">
        <SellerListings />
      </main>
    </>
  );
}
