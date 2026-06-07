"use client";

import { useState, type ReactNode } from "react";

interface ShareButtonProps {
  /** Text shared alongside the link, e.g. the listing title + price. */
  text: string;
  /** Accessible label for the icon-only button. */
  label?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Shares the current page. Inside Telegram it opens the native "forward to a
 * chat" sheet; in browsers that support it, the Web Share API; otherwise it
 * copies the link to the clipboard.
 */
export function ShareButton({
  text,
  label = "Ulashish",
  className,
  children,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const url = window.location.href;
    const tg = window.Telegram?.WebApp;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(
          url,
        )}&text=${encodeURIComponent(text)}`,
      );
      return;
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text, url });
      } catch {
        /* user cancelled or sharing failed — no-op */
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* nothing else we can do */
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={handleClick}
        className={className}
      >
        {children}
      </button>
      {copied && (
        <div className="fixed bottom-28 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-on-surface px-4 py-2 text-label-md text-surface shadow-lg">
          Havola nusxalandi
        </div>
      )}
    </>
  );
}
