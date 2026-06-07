import { BackButton } from "@/components/common/BackButton";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { ListingForm } from "@/components/user/ListingForm";

export default function CreateListingPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-surface px-margin-mobile py-stack-sm">
        <div className="flex items-center gap-4">
          <BackButton fallback="/user" />
          <h1 className="text-headline-md text-primary">Yangi e&apos;lon</h1>
        </div>
        <button
          type="button"
          aria-label="Boshqa amallar"
          className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container active:scale-95"
        >
          <MaterialSymbol name="more_vert" />
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-margin-mobile pb-16 pt-stack-md">
        <ListingForm mode="user" />
      </main>
    </>
  );
}
