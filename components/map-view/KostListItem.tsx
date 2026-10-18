import React from 'react';
import { Home, MapPin, Star } from 'lucide-react';
import { formatPrice, type KostMarker } from '@/components/map-view/data';

type Props = {
  kost: KostMarker;
  selected: boolean;
  onSelect: (id: number) => void;
};

export default function KostListItem({ kost: k, selected, onSelect }: Props) {
  return (
    <li aria-current={selected ? 'true' : undefined}>
      <button
        type="button"
        onClick={() => onSelect(k.id)}
        className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${
          selected ? 'border-[#111] bg-[#f6f6f4]' : 'border-transparent hover:bg-[#f6f6f4]'
        }`}
      >
        {k.img ? (
          <img src={k.img} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f3f3f1] text-[#777]">
            <Home className="h-5 w-5" strokeWidth={1.6} />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[14px] font-medium text-[#111]">{k.name}</h4>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-[#777]">
            <MapPin className="h-3 w-3 shrink-0" />
            {k.address}
          </p>
          <p className="mt-1 flex items-center justify-between text-[11px] text-[#777]">
            <span>
              <span className="text-[13px] font-semibold text-[#111]">{formatPrice(k.price)}</span> /month
            </span>
            <span className="flex items-center gap-1 text-[#111]">
              <Star className="h-3 w-3 fill-[#f3c53b] text-[#f3c53b]" />
              {k.rating}
            </span>
          </p>
        </div>
      </button>
    </li>
  );
}