/** Domain types for the Yangisi marketplace. */

export type Condition = "new" | "like-new" | "used" | "refurbished";

export type ListingStatus = "active" | "moderation" | "sold";

export interface Brand {
  id: string;
  name: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  /** Human-readable location, e.g. "Tashkent, Malika Market". */
  location: string;
  /** Working-hours summary, e.g. "Open until 20:00". */
  hours: string;
  description: string;
  phone: string;
  telegram?: string;
}

export interface Listing {
  id: string;
  title: string;
  brandId: string;
  /** Resolved brand name (from the expanded relation), when available. */
  brandName?: string;
  model: string;
  /** Price in Uzbek so'm. */
  price: number;
  condition: Condition;
  conditionLabel: string;
  memory: string;
  ram: string;
  color: string;
  batteryHealth?: number;
  warranty?: string;
  region: string;
  city: string;
  images: string[];
  description: string;
  /** Relative "published" label, e.g. "2 hours ago". */
  publishedAt: string;
  shopId: string;
  saved?: boolean;
}

/** A listing as seen by its owner (the seller dashboard). */
export interface SellerListing {
  id: string;
  title: string;
  price: number;
  image: string;
  status: ListingStatus;
  statusLabel: string;
  views: number;
  saves: number;
}

export interface SellerStat {
  key: string;
  label: string;
  value: string;
  icon: string;
  /** Tailwind text-color class for the icon. */
  iconClass: string;
  filled?: boolean;
}

export interface SellerActivity {
  id: string;
  icon: string;
  /** Tailwind text-color class for the icon. */
  iconClass: string;
  /** Tailwind background class for the icon bubble. */
  bubbleClass: string;
  title: string;
  description: string;
  time: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  avatar: string;
  activeAds: number;
  totalSales: number;
}
