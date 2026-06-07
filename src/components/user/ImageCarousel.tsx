"use client";

import { useEffect, useState } from "react";
import { Img } from "@/components/common/Img";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

/** Auto-advancing hero carousel with tappable indicator dots. */
export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 4000);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) {
    return (
      <section className="flex aspect-square w-full items-center justify-center bg-surface-container-high text-outline md:aspect-video">
        <MaterialSymbol name="smartphone" className="text-6xl" />
      </section>
    );
  }

  return (
    <section className="relative aspect-square w-full overflow-hidden md:aspect-video">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="h-full w-full flex-shrink-0">
            <Img src={src} alt={`${alt} — ${i + 1}-rasm`} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/10 px-3 py-1.5 backdrop-blur-md">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}-rasmga o'tish`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === index ? "bg-primary" : "bg-white/50",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
