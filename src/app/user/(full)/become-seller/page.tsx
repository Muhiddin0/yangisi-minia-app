import { BackButton } from "@/components/common/BackButton";
import { BecomeSellerForm } from "@/components/user/BecomeSellerForm";

export default function BecomeSellerPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 bg-surface px-margin-mobile py-stack-sm">
        <BackButton fallback="/user/profile" />
        <h1 className="text-headline-md text-primary">Sotuvchi bo&apos;lish</h1>
      </header>
      <main className="mx-auto max-w-2xl px-margin-mobile pb-16 pt-stack-md">
        <BecomeSellerForm />
      </main>
    </>
  );
}
