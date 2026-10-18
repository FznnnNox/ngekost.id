import React from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';

type Props = {
  price: string;
  period: string;
};

/** Widget booking (menempel saat scroll di desktop). Masih statis. */
export default function BookingCard({ price, period }: Props) {
  return (
    <div className="sticky top-8 rounded-[24px] border border-white/15 bg-[#181818] p-6 shadow-xl">
      <h3 className="text-[15px] font-medium text-[#9c9c9c]">Details</h3>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#222222] px-4 py-3 text-[13px]">
          <div className="flex items-center gap-2.5 text-[#cfcfcf]">
            <Calendar className="h-4 w-4 text-[#9c9c9c]" />
            <span>Start Date</span>
          </div>
          <span className="font-medium text-white">01 Nov 2026</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#222222] px-4 py-3 text-[13px]">
          <div className="flex items-center gap-2.5 text-[#cfcfcf]">
            <Clock className="h-4 w-4 text-[#9c9c9c]" />
            <span>Duration</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-white">
            <span>1 Month</span>
            <ChevronDown className="h-4 w-4 text-[#9c9c9c]" />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-[#9c9c9c]">Total Rate</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{price}</span>
            <span className="text-[12px] text-[#9c9c9c]">/{period}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-[#ededed] py-3.5 text-center text-[14px] font-medium text-[#111] transition-colors hover:bg-white"
      >
        Reserve Now
      </button>

      <p className="mt-3 text-center text-[11px] text-[#888888]">You won&apos;t be charged yet</p>
    </div>
  );
}