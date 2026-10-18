import React from 'react';
import type { Value } from '@/components/about/data';

export default function ValueCard({ value: v }: { value: Value }) {
  const Icon = v.icon;

  return (
    <li className="flex flex-col rounded-[28px] border border-white/10 p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <h4 className="mt-6 text-[20px] font-medium tracking-tight text-[#ededed]">{v.title}</h4>
      <p className="mt-2 text-[14px] font-light leading-relaxed text-[#9c9c9c]">{v.desc}</p>
    </li>
  );
}