import { BackButton } from "@/components/common/BackButton";
import { ListingForm } from "@/components/user/ListingForm";

export default function SellerNewListingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b border-outline-variant bg-surface px-margin-mobile">
        <BackButton fallback="/seller" />
        <h1 className="text-headline-md text-primary">Yangi e&apos;lon</h1>
      </header>

      <main className="mx-auto max-w-2xl px-margin-mobile pb-16 pt-stack-md">
        <ListingForm mode="seller" />
      </main>
    </div>
  );
}
