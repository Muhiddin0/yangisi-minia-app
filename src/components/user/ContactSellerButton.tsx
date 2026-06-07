"use client";

import { useState, type ReactNode } from "react";
import { formatPriceFull } from "@/lib/format";

interface ContactSellerButtonProps {
  /** Seller's Telegram handle as stored: "@shop", "shop", or a full t.me URL. */
  telegram?: string;
  /**
   * Optional listing context. When present, the title/price/link are copied to
   * the clipboard so the buyer can paste them into the chat that opens —
   * Telegram doesn't allow pre-filling a direct message to another user.
   */
  listing?: { title: string; price: number };
  className?: string;
  children: ReactNode;
}

/** Normalizes a stored Telegram handle into a `t.me` chat URL, or null. */
function telegramChatUrl(handle: string): string | null {
  const cleaned = handle
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^t\.me\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");
  return cleaned ? `https://t.me/${cleaned}` : null;
}

/** Opens a t.me link inside Telegram when available, else in a new tab. */
function openChat(url: string) {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
  if (tg?.openTelegramLink) tg.openTelegramLink(url);
  else window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * "Yozish" button — opens the seller's Telegram chat. On the listing screen it
 * also copies the listing details to the clipboard and prompts the buyer to
 * paste them, since Telegram has no API to pre-fill a DM to another user.
 */
export function ContactSellerButton({
  telegram,
  listing,
  className,
  children,
}: ContactSellerButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const tg =
      typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
    const url = telegram ? telegramChatUrl(telegram) : null;

    if (!url) {
      const message =
        "Bu sotuvchi Telegram havolasini ko'rsatmagan. «Qo'ng'iroq» orqali bog'laning.";
      if (tg?.showAlert) tg.showAlert(message);
      else alert(message);
      return;
    }

    // No listing context (e.g. the shop screen) — just open the chat.
    if (!listing) {
      openChat(url);
      return;
    }

    const text = [
      listing.title,
      formatPriceFull(listing.price),
      window.location.href,
    ]
      .filter(Boolean)
      .join("\n");

    let didCopy = false;
    try {
      await navigator.clipboard.writeText(text);
      didCopy = true;
    } catch {
      /* clipboard blocked — open the chat anyway */
    }

    try {
      tg?.HapticFeedback?.notificationOccurred?.("success");
    } catch {
      /* haptics unsupported */
    }

    // Telegram's native popup tells the buyer to paste, then opens the chat
    // once they dismiss it. Outside Telegram, fall back to an inline toast.
    if (didCopy && tg?.showAlert) {
      tg.showAlert(
        "E'lon ma'lumotlari nusxalandi. Sotuvchiga yuborish uchun chatda joylashtiring (Paste).",
        () => openChat(url),
      );
      return;
    }

    if (didCopy) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    openChat(url);
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
      {copied && (
        <div className="fixed bottom-28 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-on-surface px-4 py-2 text-label-md text-surface shadow-lg">
          E&apos;lon ma&apos;lumotlari nusxalandi — chatga joylang
        </div>
      )}
    </>
  );
}
