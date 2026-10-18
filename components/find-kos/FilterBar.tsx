import React from 'react';
import { ChevronDown, MapPin, RotateCcw, Search, Wallet } from 'lucide-react';

export type PriceRange = 'any' | 'low' | 'mid' | 'high';

export const priceOptions: { value: PriceRange; label: string }[] = [
  { value: 'any', label: 'Any price' },
  { value: 'low', label: 'Under Rp 500K' },
  { value: 'mid', label: 'Rp 500K - 1M' },
  { value: 'high', label: 'Above Rp 1M' },
];

export const distanceOptions = [
  { value: 500, label: 'Within 500 m' },
  { value: 1000, label: 'Within 1 km' },
  { value: 1500, label: 'Within 1.5 km' },
];

type Props = {
  query: string;
  onQuery: (v: string) => void;
  price: PriceRange;
  onPrice: (v: PriceRange) => void;
  maxDistance: number;
  onMaxDistance: (v: number) => void;
  onReset: () => void;
  onSubmit: () => void;
};

const chip =
  'relative flex h-11 items-center rounded-full border border-black/10 bg-white text-[13px] text-[#333] transition-colors focus-within:border-[#111] hover:border-black/25';

export default function FilterBar({ query, onQuery, price, onPrice, maxDistance, onMaxDistance, onReset, onSubmit }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-3 rounded-[28px] bg-white p-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)] ring-1 ring-black/5 md:flex-row md:items-center"
    >
      <label className={`${chip} flex-1 pl-4 pr-4`}>
        <Search className="mr-2 h-4 w-4 shrink-0 text-[#888]" />
        <span className="sr-only">Search by name or area</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search kost name or area…"
          className="w-full bg-transparent outline-none placeholder:text-[#999]"
        />
      </label>

      <label className={`${chip} pl-4 pr-9`}>
        <Wallet className="mr-2 h-4 w-4 shrink-0 text-[#888]" />
        <span className="sr-only">Price range</span>
        <select
          value={price}
          onChange={(e) => onPrice(e.target.value as PriceRange)}
          className="h-full w-full cursor-pointer appearance-none bg-transparent outline-none"
        >
          {priceOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-[#888]" />
      </label>

      <label className={`${chip} pl-4 pr-9`}>
        <MapPin className="mr-2 h-4 w-4 shrink-0 text-[#888]" />
        <span className="sr-only">Distance from campus</span>
        <select
          value={maxDistance}
          onChange={(e) => onMaxDistance(Number(e.target.value))}
          className="h-full w-full cursor-pointer appearance-none bg-transparent outline-none"
        >
          {distanceOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-[#888]" />
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset filters"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#333] transition-colors hover:bg-[#f3f3f1]"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="submit"
          className="h-11 flex-1 rounded-full bg-[#111] px-8 text-[14px] font-medium text-white transition-colors hover:bg-black md:flex-none"
        >
          Search
        </button>
      </div>
    </form>
  );
}