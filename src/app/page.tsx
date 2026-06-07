import Link from "next/link";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

interface RoleCard {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const ROLES: RoleCard[] = [
  {
    href: "/user",
    icon: "shopping_bag",
    title: "Xaridor ilovasi",
    description: "Telefonlarni ko'ring, qidiring va saqlang — bozor mini-ilovasi.",
  },
  {
    href: "/seller",
    icon: "storefront",
    title: "Sotuvchi paneli",
    description: "Do'koningiz, e'lonlaringiz va statistikangizni boshqaring.",
  },
];

/**
 * Dev entry point / role chooser. The buyer (`/user`) and seller (`/seller`)
 * trees are independent and will each be served by their own Telegram bot.
 */
export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-margin-mobile py-12">
      <header className="mb-10 text-center">
        <h1 className="text-headline-xl text-primary">Yangisi</h1>
        <p className="mt-2 text-body-lg text-on-surface-variant">
          Telegram uchun yaratilgan, mobil texnika uchun ishonchli savdo maydoni.
        </p>
      </header>

      <div className="grid w-full gap-4">
        {ROLES.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="group flex items-center gap-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-stack-md shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary-container/10 text-primary">
              <MaterialSymbol name={role.icon} className="text-[28px]" />
            </div>
            <div className="flex-1">
              <h2 className="text-title-lg text-on-surface">{role.title}</h2>
              <p className="text-body-md text-on-surface-variant">
                {role.description}
              </p>
            </div>
            <MaterialSymbol
              name="arrow_forward"
              className="text-outline transition-transform group-hover:translate-x-1"
            />
          </Link>
        ))}
      </div>

      <Link
        href="/user/onboarding"
        className="mt-8 text-label-lg text-primary hover:underline"
      >
        Kirish / ro&apos;yxatdan o&apos;tish ekrani
      </Link>

      {/* Atmospheric decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>
    </main>
  );
}
