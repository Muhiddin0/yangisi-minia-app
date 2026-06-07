"use client";

import { useState } from "react";

/** Labelled range slider that shows its live value (e.g. battery health). */
export function RangeField({
  label,
  min = 0,
  max = 100,
  defaultValue = 100,
  suffix = "",
}: {
  label: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-label-md text-on-surface">{label}</span>
        <span className="text-label-md font-bold text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high accent-primary"
      />
    </div>
  );
}
