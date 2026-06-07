import { BackButton } from "@/components/common/BackButton";
import { ListingForm } from "@/components/user/ListingForm";

export default function CreateListingPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center bg-surface px-margin-mobile py-stack-sm">
        <div className="flex items-center gap-4">
          <BackButton fallback="/user" />
          <h1 className="text-headline-md text-primary">Yangi e&apos;lon</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-margin-mobile pb-16 pt-stack-md">
        <ListingForm mode="user" />
      </main>
    </>
  );
}
