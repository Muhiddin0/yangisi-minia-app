"use client";

import { useEffect } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { cn } from "@/lib/cn";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** Optional supporting text under the title. */
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Material Symbol shown in the bubble above the title. */
  icon?: string;
  /** "primary" — odatiy amal; "danger" — qaytarib bo'lmaydigan amal. */
  tone?: "primary" | "danger";
  /** Tasdiqlash davom etayotganda spinner ko'rsatadi va tugmalarni bloklaydi. */
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Material-3 tasdiqlash oynasi (alert dialog). Markazda chiqadi, fonni bosish
 * yoki Escape bekor qiladi. Yopiq holatda umuman render qilinmaydi (yashirin
 * fokuslanadigan tugmalar bo'lmasligi uchun). `busy` paytida yopib bo'lmaydi.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Tasdiqlash",
  cancelLabel = "Bekor qilish",
  icon,
  tone = "primary",
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-margin-mobile">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Yopish"
        onClick={() => !busy && onClose()}
        className="absolute inset-0 bg-on-background/40 backdrop-blur-sm animate-[confirm-backdrop-in_0.2s_ease-out]"
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-sm rounded-[28px] bg-surface-container-lowest p-lg shadow-2xl animate-[confirm-dialog-in_0.2s_ease-out]"
      >
        {icon && (
          <div
            className={cn(
              "mx-auto mb-md flex h-14 w-14 items-center justify-center rounded-full",
              tone === "danger"
                ? "bg-error-container/40 text-error"
                : "bg-primary-container/20 text-primary",
            )}
          >
            <MaterialSymbol name={icon} className="text-[28px]" />
          </div>
        )}

        <h2 className="text-center text-title-lg text-on-surface">{title}</h2>
        {message && (
          <p className="mt-2 text-center text-body-md text-on-surface-variant">
            {message}
          </p>
        )}

        <div className="mt-lg flex gap-stack-sm">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-12 flex-1 rounded-xl border border-outline-variant text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-label-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-60",
              tone === "danger"
                ? "bg-error text-on-error"
                : "bg-primary text-on-primary",
            )}
          >
            {busy ? (
              <MaterialSymbol name="progress_activity" className="animate-spin text-[20px]" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
