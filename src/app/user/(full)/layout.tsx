/** Buyer screens that take over the full viewport (no bottom navigation). */
export default function UserFullLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
