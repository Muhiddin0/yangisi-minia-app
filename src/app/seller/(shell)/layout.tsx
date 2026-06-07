import { SellerBottomNav } from "@/components/seller/SellerBottomNav";
import { SellerGuard } from "@/components/seller/SellerGuard";

/** Seller dashboard shell — gated to approved shops, with bottom nav. */
export default function SellerShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background pb-24">
      <SellerGuard>{children}</SellerGuard>
      <SellerBottomNav />
    </div>
  );
}
