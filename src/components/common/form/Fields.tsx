import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

const inputClass =
  "w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-lg outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary";

/** Field label rendered above its control. */
export function FieldLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("px-1 text-label-md text-on-surface-variant", className)}>
      {children}
    </label>
  );
}

export function TextField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <FieldLabel>{label}</FieldLabel>
      <input className={inputClass} {...props} />
    </div>
  );
}

export function TextArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1">
      <FieldLabel>{label}</FieldLabel>
      <textarea className={cn(inputClass, "resize-none")} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  options,
  icon = "expand_more",
  ...props
}: {
  label: string;
  options: string[];
  icon?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <select className={cn(inputClass, "appearance-none pr-12")} {...props}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <MaterialSymbol
          name={icon}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline"
        />
      </div>
    </div>
  );
}
