import React from 'react';
import type { RuleItem } from '@/components/listing-detail/data';

export default function RuleList({ items }: { items: RuleItem[] }) {
  return (
    <ul className="space-y-3 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 text-[13px]">
      {items.map(({ text, icon: Icon }) => (
        <li key={text} className="flex items-start gap-3 text-[#cfcfcf]">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9c9c9c]" />
          {text}
        </li>
      ))}
    </ul>
  );
}