"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";

interface VideoUploaderProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

/** Max allowed clip length in seconds (a small tolerance avoids rejecting
 *  videos that report e.g. 60.04s). */
const MAX_SECONDS = 60;

/** Reads a video file's duration (seconds) via a detached <video> element. */
function readDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement("video");
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(el.duration);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("metadata"));
    };
    el.src = url;
  });
}

/** Single-video picker that rejects clips longer than 1 minute. */
export function VideoUploader({ value, onChange }: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const previewUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : ""),
    [value],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const pick = async (file: File | null) => {
    setError("");
    if (!file) return;
    setChecking(true);
    try {
      const duration = await readDuration(file);
      if (duration > MAX_SECONDS + 0.5) {
        setError("Video 1 daqiqadan oshmasligi kerak.");
        onChange(null);
      } else {
        onChange(file);
      }
    } catch {
      setError("Videoni o'qib bo'lmadi. Boshqa fayl tanlang.");
      onChange(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative aspect-square w-28 overflow-hidden rounded-xl bg-surface-container">
          <video src={previewUrl} className="h-full w-full object-cover" muted />
          <span className="absolute inset-0 flex items-center justify-center text-white">
            <MaterialSymbol name="play_circle" filled className="text-3xl drop-shadow" />
          </span>
          <button
            type="button"
            aria-label="O'chirish"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-on-background/60 text-white"
          >
            <MaterialSymbol name="close" className="text-[16px]" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={checking}
          className="flex aspect-square w-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low text-primary transition-all hover:bg-primary-fixed/20 disabled:opacity-60"
        >
          <MaterialSymbol
            name={checking ? "progress_activity" : "videocam"}
            className={checking ? "animate-spin text-2xl" : "text-2xl"}
          />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-2 text-label-md text-error">{error}</p>}
    </div>
  );
}
