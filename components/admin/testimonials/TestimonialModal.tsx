'use client';

import React from 'react';
import { X, Star } from 'lucide-react';
import { type Testimonial } from './data';

interface TestimonialModalProps {
  testimonial: Testimonial;
  onClose: () => void;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function TestimonialModal({
  testimonial,
  onClose,
}: TestimonialModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${card} max-h-[90vh] w-full max-w-[500px] overflow-y-auto p-5 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-medium">Testimonial Detail</h2>
            <p className="text-[12px] text-[#8a8a86]">Review ID: #{testimonial.id}</p>
          </div>
          <button type="button" onClick={onClose} className={iconBtn}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 text-[13px]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#262626] border border-white/5">
            <img src={testimonial.avatar || '/assets/image01.png'} alt="" className="h-12 w-12 rounded-full object-cover border border-white/10" />
            <div>
              <p className="font-medium text-[#ededed] text-[14px]">{testimonial.name}</p>
              <p className="text-[12px] text-[#8a8a86]">{testimonial.role}</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#262626] p-4 grid gap-3 border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-[#8a8a86]">Rating:</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#e8e2b8]/10 px-2.5 py-0.5 text-[12px] font-medium text-[#e8e2b8]">
                <Star className="h-3.5 w-3.5 fill-[#e8e2b8]" /> {testimonial.rating}.0 Stars
              </span>
            </div>
            <div>
              <span className="block text-[#8a8a86] mb-1">Content:</span>
              <p className="text-[#ededed] italic bg-[#1c1c1c] p-3 rounded-lg border border-white/5 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-5 text-[13px] text-[#ededed] hover:bg-white/5">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}