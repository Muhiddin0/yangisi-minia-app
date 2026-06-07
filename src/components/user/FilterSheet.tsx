"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
}

const CONDITIONS = ["Yangi", "Ishlatilgan", "Tiklangan"];
const MEMORY = ["64 GB", "128 GB", "256 GB", "512 GB"];
const RAM = ["4 GB", "6 GB", "8 GB", "12 GB"];
const COLORS = [
  { name: "Qora", className: "bg-slate-900" },
  { name: "Kumush", className: "bg-slate-300" },
  { name: "Ko'k", className: "bg-blue-600" },
  { name: "Pushti", className: "bg-rose-300" },
  { name: "Yashil", className: "bg-emerald-600" },
];

/** Material-3 bottom sheet for refining the search results. */
export function FilterSheet({ open, onClose }: FilterSheetProps) {
  const [condition, setCondition] = useState("Yangi");
  const [memory, setMemory] = useState("128 GB");
  const [ram, setRam] = useState("8 GB");
  const [color, setColor] = useState("Qora");
  const [price, setPrice] = useState(18_000_000);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-on-background/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Sheet */}
      <section
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col overflow-hidden rounded-t-[28px] bg-surface-container-lowest shadow-2xl transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="flex flex-col items-center pb-stack-md pt-stack-sm">
          <div className="mb-stack-md h-1 w-10 rounded-full bg-outline-variant" />
          <div className="flex w-full items-center justify-between px-margin-mobile">
            <button
              type="button"
              onClick={() => {
                setCondition("Yangi");
                setMemory("128 GB");
                setRam("8 GB");
                setColor("Qora");
                setPrice(18_000_000);
              }}
              className="rounded-lg px-1 py-1 text-label-md text-primary transition-colors hover:bg-primary/5"
            >
              Tozalash
            </button>
            <h2 className="text-headline-md text-on-surface">Filtrlar</h2>
            <button
              type="button"
              aria-label="Yopish"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant"
            >
              <MaterialSymbol name="close" className="text-[20px]" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-stack-lg overflow-y-auto px-margin-mobile pb-40">
          <SelectField label="Brend" options={["Barchasi", "Apple", "Samsung", "Google", "Xiaomi", "Honor"]} />

          {/* Narx oralig'i */}
          <div>
            <div className="mb-stack-sm flex items-center justify-between px-1">
              <span className="text-label-md text-on-surface-variant">Narx oralig&apos;i</span>
              <span className="text-body-md font-semibold text-primary">
                {formatPrice(price)}gacha
              </span>
            </div>
            <input
              type="range"
              min={1_000_000}
              max={30_000_000}
              step={500_000}
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-container-high accent-primary"
            />
            <div className="mt-stack-sm flex justify-between px-1 text-label-sm text-outline">
              <span>1 mln</span>
              <span>30+ mln</span>
            </div>
          </div>

          <ChipGroup
            label="Holati"
            options={CONDITIONS}
            value={condition}
            onChange={setCondition}
            pill
          />
          <ChipGroup
            label="Ichki xotira"
            options={MEMORY}
            value={memory}
            onChange={setMemory}
            columns={4}
          />
          <ChipGroup
            label="Operativ xotira (RAM)"
            options={RAM}
            value={ram}
            onChange={setRam}
          />

          {/* Rang */}
          <div>
            <span className="mb-stack-sm block px-1 text-label-md text-on-surface-variant">
              Rang
            </span>
            <div className="flex gap-4">
              {COLORS.map((swatch) => {
                const active = color === swatch.name;
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    aria-label={swatch.name}
                    onClick={() => setColor(swatch.name)}
                    className="flex shrink-0 flex-col items-center gap-1.5"
                  >
                    <span
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-full",
                        swatch.className,
                        active
                          ? "ring-2 ring-primary ring-offset-2"
                          : "border border-outline-variant",
                      )}
                    >
                      {active && (
                        <MaterialSymbol name="check" className="text-[16px] text-white" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-label-sm",
                        active ? "text-on-surface" : "text-on-surface-variant",
                      )}
                    >
                      {swatch.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-stack-md">
            <SelectField label="Hudud" options={["Toshkent", "Samarqand", "Buxoro"]} />
            <SelectField label="Shahar" options={["Barchasi", "Yunusobod", "Chilonzor"]} />
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-surface-variant/50 bg-surface-container-lowest p-margin-mobile pb-safe shadow-[0px_-8px_24px_rgba(0,0,0,0.03)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-4 text-headline-md text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
          >
            Filtrlarni qo&apos;llash
          </button>
        </div>
      </section>
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-stack-sm block px-1 text-label-md text-on-surface-variant">
        {label}
      </label>
      <div className="relative">
        <select className="w-full appearance-none rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:ring-2 focus:ring-primary">
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <MaterialSymbol
          name="expand_more"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
  pill,
  columns,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  pill?: boolean;
  columns?: number;
}) {
  return (
    <div>
      <span className="mb-stack-sm block px-1 text-label-md text-on-surface-variant">
        {label}
      </span>
      <div
        className={cn("gap-2", columns ? "grid" : "flex flex-wrap")}
        style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "py-2.5 text-label-md transition-colors",
                pill ? "rounded-full px-5" : "rounded-xl px-4",
                active
                  ? pill
                    ? "bg-primary text-on-primary shadow-sm"
                    : "border border-primary bg-primary-container/10 text-primary"
                  : "border border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
