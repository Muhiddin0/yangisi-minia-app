import type { SellerStat } from "@/lib/types";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

export function StatCard({ stat }: { stat: SellerStat }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md transition-all hover:shadow-md">
      <MaterialSymbol
        name={stat.icon}
        filled={stat.filled}
        className={cn("mb-sm", stat.iconClass)}
      />
      <p className="text-label-lg text-on-surface-variant">{stat.label}</p>
      <h3 className="text-headline-sm text-on-surface">{stat.value}</h3>
    </div>
  );
}
