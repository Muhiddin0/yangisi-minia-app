/**
 * Narx (UZS) formatlash. Narxlar butun son sifatida so'mda saqlanadi.
 *
 * Ko'rsatish uchun ikki uslub bor:
 *  - `formatPrice`     — ixcham, xaridorga qulay: "12,5 mln so'm", "900 ming so'm"
 *  - `formatPriceFull` — to'liq, bo'sh joy ajratgich bilan: "12 500 000 so'm"
 * Kiritish maydoni uchun raqamlarni jonli ajratish: `groupDigits` ("12 500 000").
 */

/** Butun sonni bo'sh joy bilan minglarga ajratadi: 12500000 → "12 500 000". */
export function groupDigits(value: number | string): string {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Kasrli sonni o'zbekcha vergul bilan beradi va keraksiz ",0" ni olib tashlaydi. */
function trimDecimal(value: number): string {
  return value
    .toFixed(1)
    .replace(/\.0$/, "")
    .replace(".", ",");
}

/**
 * Xaridorga qulay ixcham narx: million va mingga yumaloqlanadi.
 *   12 500 000 → "12,5 mln so'm"
 *    2 000 000 → "2 mln so'm"
 *      900 000 → "900 ming so'm"
 *          500 → "500 so'm"
 */
export function formatPrice(value: number): string {
  const n = Math.max(0, Math.round(value));

  if (n >= 1_000_000) {
    return `${trimDecimal(n / 1_000_000)} mln so'm`;
  }
  if (n >= 1_000) {
    const thousands = Math.round(n / 1_000);
    // Yumaloqlash millionga o'tib ketsa, "1000 ming" emas "1 mln" ko'rsatamiz.
    if (thousands >= 1_000) return `${trimDecimal(thousands / 1_000)} mln so'm`;
    return `${thousands} ming so'm`;
  }
  return `${n} so'm`;
}

/** To'liq narx, bo'sh joy ajratgich bilan: 12500000 → "12 500 000 so'm". */
export function formatPriceFull(value: number): string {
  return `${groupDigits(Math.round(value))} so'm`;
}

/** Ixcham sanoq: 1200 → "1,2k". */
export function formatCount(value: number): string {
  if (value < 1000) return String(value);
  const k = value / 1000;
  return `${k.toFixed(value % 1000 === 0 ? 0 : 1).replace(".", ",")}k`;
}

/** ISO/PocketBase sanasidan "e'lon qilingan" nisbiy yorlig'i (o'zbekcha). */
export function relativeTime(value: string): string {
  if (!value) return "";
  const then = new Date(value.replace(" ", "T")).getTime();
  if (Number.isNaN(then)) return "";

  const minutes = Math.floor((Date.now() - then) / 60_000);
  if (minutes < 1) return "hozirgina";
  if (minutes < 60) return `${minutes} daqiqa oldin`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "kecha";
  if (days < 7) return `${days} kun oldin`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} hafta oldin`;

  const months = Math.floor(days / 30);
  return `${months} oy oldin`;
}
