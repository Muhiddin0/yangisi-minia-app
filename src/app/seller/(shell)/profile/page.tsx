import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerProfileForm } from "@/components/seller/SellerProfileForm";

export default function SellerProfilePage() {
  return (
    <>
      <SellerHeader variant="title" title="Do'kon profili" />
      <SellerProfileForm />
    </>
  );
}
