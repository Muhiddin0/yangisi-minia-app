import { cn } from "@/lib/cn";

interface MaterialSymbolProps {
  /** The Material Symbols ligature name, e.g. "favorite". */
  name: string;
  /** Render the filled variant (FILL 1). */
  filled?: boolean;
  className?: string;
}

/**
 * Thin wrapper around the Material Symbols Outlined icon font.
 * The font is loaded once in the root layout.
 */
export function MaterialSymbol({ name, filled, className }: MaterialSymbolProps) {
  return (
    <span
      aria-hidden
      className={cn("material-symbols-outlined", className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
