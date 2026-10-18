import React from 'react';
import { ArrowRight, Home, Star, X } from 'lucide-react';
import { formatPrice, type KostMarker } from '@/components/map-view/data';

type Props = {
  kost: KostMarker;
  onClose: () => void;
};

export default function KostPopupCard({ kost: k, onClose }: Props) {
  return (
    <div className="absolute inset-x-3 bottom-3 z-10 rounded-[22px] bg-white/95 p-4 text-[#111] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/10 backdrop-blur sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[320px]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close details"
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-[#777] transition-colors hover:bg-black/5 hover:text-black"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3 pr-8">
        {k.img ? (
          <img src={k.img} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111] text-white">
            <Home className="h-5 w-5" strokeWidth={1.6} />
          </span>
        )}
        <div className="min-w-0">
          <h4 className="truncate text-[15px] font-medium">{k.name}</h4>
          <p className="truncate text-[11px] text-[#777]">{k.address}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-black/10 px-3 py-2 text-[11px] text-[#444]">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-[#f3c53b] text-[#f3c53b]" />
          {k.rating} ({k.reviews})
        </span>
        <span>{k.type}</span>
        <span className="font-semibold text-[#111]">{formatPrice(k.price)}/mo</span>
      </div>

      <p className="mt-3 text-[12px] font-light leading-relaxed text-[#555]">{k.description}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {k.tags.map((t) => (
          <li key={t} className="rounded-full border border-black/15 px-2.5 py-1 text-[10px] text-[#444]">
            {t}
          </li>
        ))}
      </ul>

      <a
        href="#how-it-works"
        className="group mt-4 flex h-10 items-center justify-center gap-2 rounded-full bg-[#111] text-[13px] font-medium text-white transition-colors hover:bg-black"
      >
        Book now
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}