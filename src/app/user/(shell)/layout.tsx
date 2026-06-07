import { UserBottomNav } from "@/components/user/UserBottomNav";

/** Buyer screens that show the persistent bottom navigation. */
export default function UserShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background pb-24">
      {children}
      <UserBottomNav />
    </div>
  );
}
