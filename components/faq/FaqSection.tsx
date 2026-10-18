'use client';

import React, { useState } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import SectionHeading from '@/components/sections/SectionHeading';
import FaqItem from '@/components/faq/FaqItem';
import { WHATSAPP_URL, faqCategories, faqs } from '@/components/faq/data';

export default function FaqSection() {
  const [category, setCategory] = useState<(typeof faqCategories)[number]>('All');
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  const visible = faqs.filter((f) => category === 'All' || f.category === category);
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <section id="faq" className="bg-white px-4 py-20 text-[#111] sm:px-8">
      <div className="mx-auto grid max-w-[1050px] grid-cols-1 gap-12 min-[1400px]:max-w-[1200px] lg:grid-cols-[360px_1fr] lg:gap-16">
        {/* Kiri: judul + CTA */}
        <div className="lg:sticky lg:top-12 lg:self-start">
          <SectionHeading eyebrow="Frequently asked" title="FAQ" tone="light" />
          <p className="mt-6 max-w-[320px] text-[14px] font-light leading-relaxed text-[#666]">
            Quick answers about booking, paying, and living in a kosan found through KosFinder.
          </p>

          <div className="mt-8 rounded-[28px] bg-[#111] p-6 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
              <MessageCircle className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <h4 className="mt-5 text-[20px] font-medium tracking-tight">Still have questions?</h4>
            <p className="mt-2 text-[13px] font-light leading-relaxed text-white/60">
              Our team in Serang is happy to help you choose the right kosan.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex h-11 items-center gap-3 rounded-full bg-[#ededed] pl-5 pr-1.5 text-[13px] font-medium text-[#111] transition-colors hover:bg-white"
            >
              Chat on WhatsApp
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111] text-white">
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </span>
            </a>
          </div>
        </div>

        {/* Kanan: kategori + accordion */}
        <div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions">
            {faqCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full px-5 py-2 text-[13px] transition-colors ${
                  category === c ? 'bg-[#111] text-white' : 'bg-[#f3f3f1] text-[#444] hover:bg-[#ebebe8]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <ul className="mt-6 border-t border-black/10">
            {visible.map((f) => (
              <FaqItem key={f.id} faq={f} open={openId === f.id} onToggle={toggle} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}