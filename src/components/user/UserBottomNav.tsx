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
  { href: "/user", label: "Asosiy", icon: "home" },
  { href: "/user/search", label: "Qidiruv", icon: "search" },
  { href: "/user/saved", label: "Saqlangan", icon: "favorite" },
  { href: "/user/profile", label: "Profil", icon: "person" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/user") return pathname === "/user";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function UserBottomNav() {
  const pathname = usePathname();

  // Two tabs sit on each side of the raised "Add" button.
  const [left, right] = [NAV_ITEMS.slice(0, 2), NAV_ITEMS.slice(2)];

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-end justify-around rounded-t-xl bg-surface-container-lowest px-margin-mobile pb-safe pt-2 shadow-[0px_-4px_12px_rgba(0,0,0,0.05)]">
      {left.map((item) => (
        <NavTab key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}

      <Link
        href="/user/new"
        aria-label="E'lon joylash"
        className="-top-4 relative flex flex-col items-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform active:scale-95">
          <MaterialSymbol name="add" className="text-[32px]" />
        </span>
      </Link>

      {right.map((item) => (
        <NavTab key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}
    </nav>
  );
}

function NavTab({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center rounded-full p-2 transition-colors",
        active
          ? "font-bold text-primary"
          : "text-on-surface-variant hover:bg-surface-variant/20",
      )}
    >
      <MaterialSymbol name={item.icon} filled={active} />
      <span className="text-label-sm">{item.label}</span>
    </Link>
  );
}
