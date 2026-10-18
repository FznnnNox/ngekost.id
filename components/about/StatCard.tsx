import React from 'react';

type Props = {
  value: string;
  label: string;
  light?: boolean;
};

export default function StatCard({ value, label, light = false }: Props) {
  return (
    <div
      className={`flex min-h-[150px] flex-col justify-between rounded-[28px] p-6 ${
        light ? 'bg-[#ededed] text-[#111]' : 'bg-[#1d1d1d] text-[#ededed]'
      }`}
    >
      <span className={`text-[14px] ${light ? 'text-[#666]' : 'text-[#9c9c9c]'}`}>{label}</span>
      <span className="text-[48px] font-light leading-none tracking-tight">{value}</span>
    </div>
  );
}