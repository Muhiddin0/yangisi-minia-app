import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

/** Empty "add photo" placeholder slot (upload is wired up with the backend). */
export function AddPhotoSlot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low transition-all hover:border-primary",
        className,
      )}
    >
      <MaterialSymbol name="add" className="text-outline" />
    </div>
  );
}
