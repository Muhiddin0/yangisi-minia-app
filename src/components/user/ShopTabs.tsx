"use client";

import { useState, type ReactNode } from "react";
import { MaterialSymbol } from "@/components/common/MaterialSymbol";
import { ChipRow } from "./ChipRow";
import { cn } from "@/lib/cn";

const CATEGORIES = ["Barchasi", "iPhone", "Samsung", "Xiaomi", "Google Pixel"];

const DEMO_REVIEWS = [
  { name: "Jasur K.", rating: 5, text: "Tez yetkazib berishdi, telefon aynan tavsifdagidek. Tavsiya qilaman!" },
  { name: "Dilnoza A.", rating: 5, text: "Juda professional do'kon, rasmiy kafolat muammosiz amalga oshdi." },
  { name: "Bekzod T.", rating: 4, text: "Narxlari yaxshi. Aloqa biroz tezroq bo'lsa bo'lardi, umuman mamnunman." },
];

/** Listings / Reviews tabs for the shop profile. */
export function ShopTabs({ listingsSlot }: { listingsSlot: ReactNode }) {
  const [tab, setTab] = useState<"listings" | "reviews">("listings");

  return (
    <>
      <div className="sticky top-16 z-30 mt-stack-lg flex border-b border-outline-variant/30 bg-background">
        <TabButton active={tab === "listings"} onClick={() => setTab("listings")}>
          E&apos;lonlar
        </TabButton>
        <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
          Sharhlar
        </TabButton>
      </div>

      {tab === "listings" ? (
        <>
          <ChipRow options={CATEGORIES} />
          {listingsSlot}
        </>
      ) : (
        <div className="mt-stack-md space-y-stack-md">
          {DEMO_REVIEWS.map((review) => (
            <div
              key={review.name}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-stack-md shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-title-md text-on-surface">{review.name}</span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <MaterialSymbol
                      key={index}
                      name="star"
                      filled={index < review.rating}
                      className={cn(
                        "text-[16px]",
                        index < review.rating ? "text-[#FFB400]" : "text-outline-variant",
                      )}
                    />
                  ))}
                </span>
              </div>
              <p className="mt-1 text-body-md text-on-surface-variant">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex-1 py-4 text-center text-body-md transition-colors",
        active ? "font-bold text-primary" : "text-on-surface-variant hover:bg-surface-container",
      )}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-1/4 right-1/4 h-1 rounded-t-full bg-primary" />
      )}
    </button>
  );
}
