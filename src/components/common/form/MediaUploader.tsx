"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

interface MediaUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  max?: number;
}

/** Controlled gallery image picker with previews. Files are uploaded to S3
 *  (via PocketBase) when the listing is created. Video lives in its own field
 *  (see VideoUploader), so this gallery accepts images only. */
export function MediaUploader({ value, onChange, max = 10 }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(
    () => value.map((file) => URL.createObjectURL(file)),
    [value],
  );

  // Revoke object URLs when previews change/unmount to avoid leaks.
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const add = (list: FileList | null) => {
    if (!list) return;
    onChange([...value, ...Array.from(list)].slice(0, max));
  };

  const removeAt = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {previews.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-xl bg-surface-container"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="O'chirish"
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-on-background/60 text-white"
            >
              <MaterialSymbol name="close" className="text-[16px]" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low text-primary transition-all hover:bg-primary-fixed/20"
          >
            <MaterialSymbol name="add_a_photo" className="text-2xl" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
      <p className="mt-2 text-label-md text-outline">
        {value.length}/{max} — rasm
      </p>
    </div>
  );
}
