import React from 'react';
import { filters, type Filter } from '@/components/listings/data';

type Props = {
  value: Filter;
  onChange: (f: Filter) => void;
};

export default function ListingFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter listings">
      {filters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          aria-pressed={value === f}
          className={`rounded-full px-5 py-2 text-[13px] transition-colors ${
            value === f ? 'bg-[#ededed] text-[#111]' : 'bg-[#1d1d1d] text-[#cfcfcf] hover:bg-[#262626]'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}