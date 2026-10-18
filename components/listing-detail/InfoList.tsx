import React from 'react';
import type { InfoItem } from '@/components/listing-detail/data';

export default function InfoList({ items }: { items: InfoItem[] }) {
  return (
    <dl className="space-y-3 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 text-[13px]">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-none last:pb-0"
        >
          <dt className="flex items-center gap-2 text-[#9c9c9c]">
            <Icon className="h-4 w-4" />
            {label}
          </dt>
          <dd className="font-medium text-[#ededed]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}