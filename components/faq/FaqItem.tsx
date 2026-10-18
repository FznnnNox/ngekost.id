import React from 'react';
import { Plus } from 'lucide-react';
import type { Faq } from '@/components/faq/data';

type Props = {
  faq: Faq;
  open: boolean;
  onToggle: (id: string) => void;
};

export default function FaqItem({ faq, open, onToggle }: Props) {
  const buttonId = `faq-btn-${faq.id}`;
  const panelId = `faq-panel-${faq.id}`;

  return (
    <li className="border-b border-black/10">
      <h4>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(faq.id)}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="text-[clamp(16px,2.2vw,19px)] font-medium tracking-tight text-[#111]">{faq.question}</span>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              open ? 'border-[#111] bg-[#111] text-white' : 'border-black/15 text-[#111] group-hover:border-[#111]'
            }`}
          >
            <Plus className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
          </span>
        </button>
      </h4>

      {/* Animasi buka/tutup lewat grid-rows (tanpa menghitung tinggi) */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[560px] pb-6 text-[14px] font-light leading-relaxed text-[#555]">{faq.answer}</p>
        </div>
      </div>
    </li>
  );
}