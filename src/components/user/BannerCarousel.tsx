"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { Img } from "@/components/common/Img";
import { cn } from "@/lib/cn";
import type { Banner } from "@/lib/types";

const AUTOPLAY_MS = 5000;
/** Min horizontal travel (px) that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 40;

/**
 * Home hero carousel. Each slide is a promotional image that links to a shop
 * or a listing detail page (slides are managed in PocketBase). Auto-advances,
 * supports touch swipe, and exposes tappable indicator dots. Renders nothing
 * when there are no banners.
 */
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const count = banners.length;
  const startX = useRef(0);
  // Set true while a touch is dragging, so the slide's click is suppressed.
  const dragged = useRef(false);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % count),
      AUTOPLAY_MS,
    );
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <section className="px-margin-mobile pt-stack-md">
      <div
        className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-surface-container-high"
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
          dragged.current = false;
        }}
        onTouchMove={(e) => {
          if (Math.abs(e.touches[0].clientX - startX.current) > 8) {
            dragged.current = true;
          }
        }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - startX.current;
          if (delta > SWIPE_THRESHOLD) go(index - 1);
          else if (delta < -SWIPE_THRESHOLD) go(index + 1);
        }}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((banner) => (
            <BannerSlide key={banner.id} banner={banner} dragged={dragged} />
          ))}
        </div>

        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur-md">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}-bannerga o'tish`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-5 bg-white" : "w-2 bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** A single slide: wraps the image in the right link kind, or none. */
function BannerSlide({
  banner,
  dragged,
}: {
  banner: Banner;
  dragged: RefObject<boolean>;
}) {
  const image = (
    <Img
      src={banner.image}
      alt={banner.title || "Reklama banneri"}
      className="pointer-events-none select-none"
    />
  );
  const className = "block h-full w-full flex-shrink-0";
  // A swipe ends in a click on the slide; cancel it so we don't navigate.
  const guard = (e: { preventDefault: () => void }) => {
    if (dragged.current) e.preventDefault();
  };

  if (banner.listingId) {
    return (
      <Link
        href={`/user/listing/${banner.listingId}`}
        className={className}
        onClick={guard}
        draggable={false}
      >
        {image}
      </Link>
    );
  }
  if (banner.shopId) {
    return (
      <Link
        href={`/user/shop/${banner.shopId}`}
        className={className}
        onClick={guard}
        draggable={false}
      >
        {image}
      </Link>
    );
  }
  if (banner.url) {
    return (
      <a
        href={banner.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={guard}
        draggable={false}
      >
        {image}
      </a>
    );
  }
  return <div className={className}>{image}</div>;
}
