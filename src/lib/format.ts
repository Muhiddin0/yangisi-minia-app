/**
 * Price formatting. Prices are stored as integers in Uzbek so'm (UZS) and
 * rendered with thin-space thousands grouping, e.g. 12500000 → "12 500 000".
 */

const groups = (value: number): string =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** "8 500 000 so'm" — used on the seller (Uzbek) screens. */
export function formatSom(value: number): string {
  return `${groups(value)} so'm`;
}

/** "12 500 000 UZS" — used on the buyer screens. */
export function formatUzs(value: number): string {
  return `${groups(value)} UZS`;
}

/** Compact counters: 1200 → "1.2k". */
export function formatCount(value: number): string {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
}

/** Relative "published" label from an ISO/PocketBase datetime string. */
export function relativeTime(value: string): string {
  if (!value) return "";
  const then = new Date(value.replace(" ", "T")).getTime();
  if (Number.isNaN(then)) return "";

  const minutes = Math.floor((Date.now() - then) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;

  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? "month" : "months"} ago`;
}
