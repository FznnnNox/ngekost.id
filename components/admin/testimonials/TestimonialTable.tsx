'use client';

import React from 'react';
import { Eye, Search, Star, Trash2 } from 'lucide-react';
import { type Testimonial } from './data';

interface TestimonialTableProps {
  testimonials: Testimonial[];
  query: string;
  setQuery: (q: string) => void;
  onOpenDetail: (item: Testimonial) => void;
  onDelete: (id: number) => void;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function TestimonialTable({
  testimonials,
  query,
  setQuery,
  onOpenDetail,
  onDelete,
}: TestimonialTableProps) {
  return (
    <section className={card}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 pb-4">
        <div>
          <h1 className="text-[18px] font-medium">Testimonials Management</h1>
          <p className="mt-0.5 text-[12px] text-[#8a8a86]">{testimonials.length} testimonials total</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="flex h-10 w-full sm:w-[240px] items-center gap-2 rounded-full bg-[#262626] px-4 text-[12px]">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reviewer name"
              className="w-full bg-transparent outline-none placeholder:text-[#6b6b68]"
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[1.5fr_1.2fr_2.5fr_1fr_96px] bg-[#161616] px-5 py-2.5 text-[11px] text-[#8a8a86]">
            <span>Reviewer</span>
            <span>Role</span>
            <span>Content</span>
            <span>Rating</span>
            <span className="text-right">Actions</span>
          </div>
          <ul>
            {testimonials.length === 0 ? (
              <li className="px-5 py-10 text-center text-[12px] text-[#8a8a86]">No testimonials found.</li>
            ) : (
              testimonials.map((t) => (
                <li
                  key={t.id}
                  className="grid grid-cols-[1.5fr_1.2fr_2.5fr_1fr_96px] items-center border-t border-white/5 px-5 py-3.5 text-[12px] transition-colors hover:bg-white/[0.03]"
                >
                  <span className="font-medium text-[#ededed] flex items-center gap-2.5 min-w-0">
                    <img src={t.avatar || '/assets/image01.png'} alt="" className="h-8 w-8 rounded-full object-cover bg-[#262626] shrink-0 border border-white/10" />
                    <span className="truncate">{t.name}</span>
                  </span>
                  <span className="text-[#8a8a86] truncate">{t.role}</span>
                  <span className="text-[#ededed] truncate pr-4">{t.content}</span>
                  <span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#e8e2b8]/10 px-2 py-0.5 text-[11px] font-medium text-[#e8e2b8]">
                      <Star className="h-3 w-3 fill-[#e8e2b8]" /> {t.rating}.0
                    </span>
                  </span>
                  <span className="flex justify-end gap-1.5">
                    <button type="button" onClick={() => onOpenDetail(t)} className={iconBtn} aria-label={`View review by ${t.name}`}>
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(t.id)}
                      className={`${iconBtn} hover:!bg-[#4a1f1c] hover:text-[#ff9a90]`}
                      aria-label={`Delete review by ${t.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}