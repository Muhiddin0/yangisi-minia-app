import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerStatsView } from "@/components/seller/SellerStatsView";

export default function SellerStatsPage() {
  return (
    <>
      <SellerHeader variant="title" title="Statistika" />
      <SellerStatsView />
    </>
  );
}
