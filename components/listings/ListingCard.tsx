"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import {
  Bath,
  Heart,
  MapPin,
  Mars,
  Maximize2,
  Star,
  Users,
  Venus,
  Wifi,
  Wind,
} from "lucide-react";
import type { Kind, Listing, Tag } from "@/components/listings/data";
import ImageModal from "@/components/listings/ImageModal";

const tagIcon: Record<
  Tag,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "Wi-Fi": Wifi,
  AC: Wind,
  "Private bath": Bath,
};

const kindStyle: Record<
  Kind,
  {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    bg: string;
    fold: string;
  }
> = {
  Female: { icon: Venus, bg: "bg-[#333333]", fold: "bg-[#9c2a56]" },
  Male: { icon: Mars, bg: "bg-[#333333]", fold: "bg-[#0b3aa8]" },
  Mixed: { icon: Users, bg: "bg-[#333333]", fold: "bg-[#4f2eb3]" },
};

type Props = {
  listing: Listing;
  saved: boolean;
  onToggleSaved: (name: string) => void;
};

export default function ListingCard({
  listing: l,
  saved,
  onToggleSaved,
}: Props) {
  const [open, setOpen] = useState(false);
  const closeModal = useCallback(() => setOpen(false), []);

  const filledStars = Math.round(l.rating);
  const kind = kindStyle[l.type];
  const KindIcon = kind.icon;

  return (
    <article className="group flex flex-col text-[#ededed]">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View larger photo of ${l.name}`}
          className="relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <img
            src={l.img}
            alt={`${l.name} kosan`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            aria-hidden
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#121212]/70 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100"
          >
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>

        <div className="pointer-events-none absolute -left-1.5 top-4 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">
          <span
            aria-hidden
            className={`absolute left-0 top-full h-1.5 w-1.5 ${kind.fold}`}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
          />
          <span
            className={`flex h-7 items-center gap-1.5 pl-3.5 pr-7 text-[12px] font-medium text-white ${kind.bg}`}
            style={{
              clipPath:
                "polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%)",
            }}
          >
            <KindIcon className="h-3.5 w-3.5" strokeWidth={2} />
            {l.type}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h4 className="min-w-0 text-[19px] font-medium leading-tight tracking-tight">
            {l.name}
          </h4>

          <div className="shrink-0 whitespace-nowrap text-right text-[12px] leading-tight text-[#9c9c9c]">
            <div className="text-[#ededed]">{l.size}</div>
            <div className="mt-1 flex items-center justify-end gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f0f0f0]" />
              {l.left} room{l.left > 1 ? "s" : ""} left
            </div>
          </div>
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#9c9c9c]">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {l.area}
        </p>

        <div className="mt-2.5 flex items-center gap-2">
          <div
            className="flex gap-0.5"
            aria-label={`Rating ${l.rating} out of 5`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < filledStars ? "fill-[#f3c53b] text-[#f3c53b]" : "text-[#555]"}`}
              />
            ))}
          </div>
          <span className="text-[12px] text-[#ededed]">{l.rating}</span>
          <span className="text-[12px] text-[#9c9c9c]">
            ({l.reviews} reviews)
          </span>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {l.tags.map((t) => {
            const Icon = tagIcon[t];
            return (
              <li
                key={t}
                className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] text-[#cfcfcf]"
              >
                <Icon className="h-3 w-3" strokeWidth={1.8} />
                {t}
              </li>
            );
          })}
        </ul>

        <div className="mt-4">
          <span className="text-[22px] font-semibold leading-none tracking-tight">
            {l.price}
          </span>
          <span className="text-[12px] text-[#9c9c9c]"> /month</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Link
            href="/listings/cedar-house"
            className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#ededed] text-[13px] font-medium text-[#111] transition-colors hover:bg-white"
          >
            Book now
          </Link>
          <button
            type="button"
            onClick={() => onToggleSaved(l.name)}
            aria-pressed={saved}
            aria-label={
              saved ? `Remove ${l.name} from saved` : `Save ${l.name}`
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
          >
            <Heart
              className={`h-4 w-4 ${saved ? "fill-[#ee4b5f] text-[#ee4b5f]" : ""}`}
            />
          </button>
        </div>
      </div>

      <ImageModal
        open={open}
        onClose={closeModal}
        src={l.img}
        alt={`${l.name} kosan`}
        title={l.name}
        subtitle={l.area}
      />
    </article>
  );
}