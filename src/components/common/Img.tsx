/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/cn";

interface ImgProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Plain <img> for the demo's remote product photography. Centralised in one
 * component (with the lint exception) so swapping to next/image — or to
 * PocketBase file URLs — later happens in a single place.
 */
export function Img({ src, alt, className }: ImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
