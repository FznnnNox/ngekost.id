import React from 'react';
import { CalendarCheck, Check, KeyRound, Search } from 'lucide-react';
import type { Step, StepId } from '@/components/how-it-works/data';

const stepIcon: Record<StepId, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  search: Search,
  survey: CalendarCheck,
  movein: KeyRound,
};

const tones = {
  dark: {
    card: 'bg-[#1d1d1d] text-[#ededed]',
    circle: 'bg-white text-black',
    number: 'text-white/15',
    desc: 'text-[#9c9c9c]',
    divider: 'border-white/15',
    label: 'text-[#9c9c9c]',
    chip: 'border-white/15 text-[#cfcfcf]',
    chipActive: 'border-transparent bg-[#ededed] text-[#111]',
    check: 'bg-[#ededed] text-[#111]',
  },
  light: {
    card: 'bg-[#ededed] text-[#111]',
    circle: 'bg-[#161616] text-white',
    number: 'text-black/10',
    desc: 'text-[#666]',
    divider: 'border-black/15',
    label: 'text-[#777]',
    chip: 'border-black/15 text-[#444]',
    chipActive: 'border-transparent bg-[#161616] text-white',
    check: 'bg-[#161616] text-white',
  },
} as const;

type Props = {
  step: Step;
  index: number;
};

export default function StepCard({ step, index }: Props) {
  const t = tones[step.tone];
  const Icon = stepIcon[step.id];
  const { preview } = step;

  return (
    <li className={`flex min-h-[360px] flex-col rounded-[28px] p-6 ${t.card}`}>
      <div className="flex items-start justify-between">
        <span className={`flex h-14 w-14 items-center justify-center rounded-full ${t.circle}`}>
          <Icon className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <span aria-hidden className={`text-[64px] font-light leading-none ${t.number}`}>
          0{index + 1}
        </span>
      </div>

      <h4 className="mt-8 text-[22px] font-medium tracking-tight">{step.title}</h4>
      <p className={`mt-2 text-[14px] font-light leading-relaxed ${t.desc}`}>{step.desc}</p>

      {/* Preview mini */}
      <div className={`mt-auto border-t border-dashed pt-5 ${t.divider}`}>
        <div className={`mb-3 text-[11px] uppercase tracking-[0.12em] ${t.label}`}>{preview.label}</div>

        {preview.type === 'chips' ? (
          <ul className="flex flex-wrap gap-2">
            {preview.items.map((item, i) => (
              <li
                key={item}
                className={`rounded-full border px-3 py-1.5 text-[12px] ${i === preview.active ? t.chipActive : t.chip}`}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2.5">
            {preview.items.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[13px]">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${t.check}`}>
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}