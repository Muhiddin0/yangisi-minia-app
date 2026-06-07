import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerDashboard } from "@/components/seller/SellerDashboard";

export default function SellerDashboardPage() {
  return (
    <>
      <SellerHeader variant="shop" />
      <SellerDashboard />
    </>
  );
}
