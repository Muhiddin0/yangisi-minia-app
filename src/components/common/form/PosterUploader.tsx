"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

interface PosterUploaderProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

/** Single-image picker for a listing's product-card poster. */
export function PosterUploader({ value, onChange }: PosterUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : ""),
    [value],
  );

  // Revoke the object URL when it changes/unmounts to avoid leaks.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (value) {
    return (
      <div className="relative aspect-square w-28 overflow-hidden rounded-xl bg-surface-container">
        <img src={previewUrl} alt="Poster" className="h-full w-full object-cover" />
        <button
          type="button"
          aria-label="O'chirish"
          onClick={() => onChange(null)}
          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-on-background/60 text-white"
        >
          <MaterialSymbol name="close" className="text-[16px]" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex aspect-square w-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low text-primary transition-all hover:bg-primary-fixed/20"
      >
        <MaterialSymbol name="image" className="text-2xl" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
    </>
  );
}
