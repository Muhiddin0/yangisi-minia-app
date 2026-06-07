"use client";

import { useEffect, useState } from "react";
import { Img } from "@/components/common/Img";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  /** Optional product clip, shown as the first slide when present. */
  video?: string;
}

type Slide =
  | { type: "video"; src: string }
  | { type: "image"; src: string };

/** Auto-advancing media carousel with tappable indicator dots. When a video is
 *  present it leads as the first slide; the rest are gallery images. */
export function ImageCarousel({ images, alt, video }: ImageCarouselProps) {
  const slides: Slide[] = [
    ...(video ? [{ type: "video" as const, src: video }] : []),
    ...images.map((src) => ({ type: "image" as const, src })),
  ];
  const count = slides.length;
  const [index, setIndex] = useState(0);

  // Auto-advance only across images; never auto-scroll away from the video.
  const hasVideo = Boolean(video);
  useEffect(() => {
    if (count <= 1) return;
    if (hasVideo && index === 0) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 4000);
    return () => clearInterval(timer);
  }, [count, hasVideo, index]);

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
        {slides.map((slide, i) => (
          <div key={i} className="h-full w-full flex-shrink-0">
            {slide.type === "video" ? (
              <video
                src={slide.src}
                poster={images[0] || undefined}
                controls
                playsInline
                className="h-full w-full bg-black object-contain"
              />
            ) : (
              <Img src={slide.src} alt={`${alt} — ${i + 1}-rasm`} />
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/10 px-3 py-1.5 backdrop-blur-md">
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              aria-label={
                slide.type === "video" ? "Videoga o'tish" : `${i + 1}-slaydga o'tish`
              }
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
