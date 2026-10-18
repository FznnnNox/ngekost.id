import React from 'react';
import { ChevronDown } from 'lucide-react';

export type TypeFilter = 'All' | 'Male' | 'Female' | 'Mixed';
export type Sort = 'nearest' | 'cheapest' | 'priciest' | 'rating';

export const typeFilters: TypeFilter[] = ['All', 'Male', 'Female', 'Mixed'];

const sorts: { value: Sort; label: string }[] = [
  { value: 'nearest', label: 'Nearest to campus' },
  { value: 'cheapest', label: 'Price: low to high' },
  { value: 'priciest', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

type Props = {
  type: TypeFilter;
  onType: (t: TypeFilter) => void;
  counts: Record<TypeFilter, number>;
  sort: Sort;
  onSort: (s: Sort) => void;
};

export default function ResultsHeader({ type, onType, counts, sort, onSort }: Props) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[clamp(22px,3vw,28px)] font-medium tracking-tight text-[#111]">Kosan near UNPAM Serang</h2>
          <p className="mt-1.5 max-w-[460px] text-[13px] leading-relaxed text-[#777]">
            Prices are per month. Distances are measured from the UNPAM Serang campus, shown as the green zone on the map.
          </p>
        </div>

        <label className="relative flex h-10 shrink-0 items-center rounded-full border border-black/10 bg-white pl-4 pr-9 text-[13px] text-[#333]">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as Sort)}
            className="h-full cursor-pointer appearance-none bg-transparent outline-none"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-[#888]" />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by tenant type">
        {typeFilters.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onType(t)}
            aria-pressed={type === t}
            className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
              type === t
                ? 'border-[#111] bg-[#111] text-white'
                : 'border-black/10 bg-white text-[#333] hover:border-black/25'
            }`}
          >
            {t} <span className={type === t ? 'text-white/60' : 'text-[#999]'}>{counts[t]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}