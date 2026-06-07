"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/seller", label: "Asosiy", icon: "dashboard" },
  { href: "/seller/listings", label: "E'lonlar", icon: "list_alt" },
  { href: "/seller/stats", label: "Statistika", icon: "bar_chart" },
  { href: "/seller/profile", label: "Profil", icon: "storefront" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/seller") return pathname === "/seller";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SellerBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface-container px-4 py-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-5 py-1 transition-all active:scale-90",
              active
                ? "rounded-full bg-primary-container text-on-primary-container"
                : "text-on-secondary-container hover:bg-secondary-container",
            )}
          >
            <MaterialSymbol name={item.icon} filled={active} />
            <span className="mt-1 text-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
