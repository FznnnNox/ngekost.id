import React from 'react';
import type { FacilityItem } from '@/components/listing-detail/data';

export default function FacilityGrid({ items }: { items: FacilityItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 text-[13px] sm:grid-cols-3">
      {items.map(({ name, icon: Icon, value }) => (
        <li
          key={name}
          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#1a1a1a] p-3 text-[#cfcfcf]"
        >
          <Icon className="h-4 w-4 shrink-0 text-[#ededed]" />
          <span className="min-w-0">
            {name}
            {value && <span className="mt-0.5 block text-[11px] text-[#9c9c9c]">{value}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}