"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Labelled on/off switch row. */
export function ToggleRow({
  title,
  description,
  defaultOn = false,
}: {
  title: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-body-md font-semibold">{title}</h4>
        <p className="text-label-md text-outline">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={title}
        onClick={() => setOn((value) => !value)}
        className={cn(
          "relative h-6 w-12 rounded-full transition-colors",
          on ? "bg-primary" : "bg-surface-container-highest",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
            on ? "left-[calc(100%-22px)]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}
