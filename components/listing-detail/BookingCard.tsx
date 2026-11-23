// 'use client';

// import React, { useMemo, useState } from 'react';
// import { Calendar, ChevronDown, Clock } from 'lucide-react';

// type Props = {
//   price: string;
//   period: string;
//   priceNumber?: number; // opsional: kalau dikirim angka murni, hitungan total lebih akurat
//   onReserve?: (payload: {
//     startDate: string;
//     durationMonths: number;
//     totalAmount: number;
//   }) => void;
// };

// const DURATION_OPTIONS = [
//   { label: '1 Month', months: 1 },
//   { label: '3 Months', months: 3 },
//   { label: '6 Months', months: 6 },
//   { label: '12 Months', months: 12 },
// ];

// function getDefaultStartDate(): string {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   return tomorrow.toISOString().split('T')[0];
// }

// function parsePriceToNumber(priceStr: string): number {
//   const digitsOnly = priceStr.replace(/[^\d]/g, '');
//   return digitsOnly ? Number(digitsOnly) : 0;
// }

// export default function BookingCard({
//   price,
//   period,
//   priceNumber,
//   onReserve,
// }: Props) {
//   const [startDate, setStartDate] = useState<string>(getDefaultStartDate);
//   const [durationMonths, setDurationMonths] = useState<number>(1);

//   const unitPrice = useMemo(() => {
//     if (typeof priceNumber === 'number' && !Number.isNaN(priceNumber)) {
//       return priceNumber;
//     }
//     return parsePriceToNumber(price);
//   }, [price, priceNumber]);

//   const totalAmount = unitPrice * durationMonths;

//   const formattedTotal =
//     unitPrice > 0 ? `Rp ${totalAmount.toLocaleString('id-ID')}` : price;

//   const handleReserveClick = () => {
//     onReserve?.({
//       startDate,
//       durationMonths,
//       totalAmount,
//     });
//   };

//   return (
//     <div className="sticky top-8 rounded-[24px] border border-white/15 bg-[#181818] p-6 shadow-xl">
//       <h3 className="text-[15px] font-medium text-[#9c9c9c]">Details</h3>

//       <div className="mt-4 space-y-3">
//         {/* Start Date Picker */}
//         <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#222222] px-4 py-3 text-[13px] transition-colors focus-within:border-white/30 hover:border-white/20">
//           <div className="flex shrink-0 items-center gap-2.5 text-[#cfcfcf]">
//             <Calendar className="h-4 w-4 text-[#9c9c9c]" />
//             <span>Start Date</span>
//           </div>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="bg-transparent text-right font-medium text-white outline-none [color-scheme:dark]"
//           />
//         </label>

//         {/* Duration Select */}
//         <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-[#222222] px-4 py-3 text-[13px] transition-colors focus-within:border-white/30 hover:border-white/20">
//           <div className="flex items-center gap-2.5 text-[#cfcfcf]">
//             <Clock className="h-4 w-4 text-[#9c9c9c]" />
//             <span>Duration</span>
//           </div>

//           <div className="relative flex items-center">
//             <select
//               aria-label="Duration"
//               value={durationMonths}
//               onChange={(e) => setDurationMonths(Number(e.target.value))}
//               className="cursor-pointer appearance-none bg-transparent pr-5 text-right font-medium text-white outline-none"
//             >
//               {DURATION_OPTIONS.map((option) => (
//                 <option
//                   key={option.months}
//                   value={option.months}
//                   className="bg-[#181818] text-white"
//                 >
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-[#9c9c9c]" />
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 border-t border-white/10 pt-4">
//         <div className="flex items-baseline justify-between">
//           <span className="text-[13px] text-[#9c9c9c]">Total Rate</span>
//           <div className="text-right">
//             <span className="text-2xl font-bold text-white">{formattedTotal}</span>
//             <span className="text-[12px] text-[#9c9c9c]">/{period}</span>
//           </div>
//         </div>
//       </div>

//       <button
//         type="button"
//         onClick={handleReserveClick}
//         className="mt-6 w-full cursor-pointer rounded-full bg-[#ededed] py-3.5 text-center text-[14px] font-medium text-[#111] transition-colors hover:bg-white"
//       >
//         Reserve Now
//       </button>

//       <p className="mt-3 text-center text-[11px] text-[#888888]">
//         You won&apos;t be charged yet
//       </p>
//     </div>
//   );
// }
'use client';

import React, { useMemo, useState } from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';

type ReservePayload = {
  startDate: string;
  durationMonths: number;
  totalAmount: number;
};

type Props = {
  price: string;
  period: string;
  priceNumber?: number;
  loading?: boolean;
  onReserve?: (payload: ReservePayload) => void | Promise<void>;
};

const DURATION_OPTIONS = [
  { label: '1 Month', months: 1 },
  { label: '3 Months', months: 3 },
  { label: '6 Months', months: 6 },
  { label: '12 Months', months: 12 },
];

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDefaultStartDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parsePriceToNumber(priceStr: string): number {
  const digitsOnly = priceStr.replace(/[^\d]/g, '');
  return digitsOnly ? Number(digitsOnly) : 0;
}

export default function BookingCard({
  price,
  period,
  priceNumber,
  loading = false,
  onReserve,
}: Props) {
  const minDate = useMemo(() => getTodayDateString(), []);
  const [startDate, setStartDate] = useState<string>(getDefaultStartDate);
  const [durationMonths, setDurationMonths] = useState<number>(1);

  const unitPrice = useMemo(() => {
    if (typeof priceNumber === 'number' && !Number.isNaN(priceNumber) && priceNumber > 0) {
      return priceNumber;
    }
    return parsePriceToNumber(price);
  }, [price, priceNumber]);

  const totalAmount = unitPrice * durationMonths;

  const formattedTotal =
    unitPrice > 0 ? `Rp ${totalAmount.toLocaleString('id-ID')}` : price;

  const durationSummaryText =
    durationMonths === 1 ? `for 1 ${period}` : `for ${durationMonths} ${period}s`;

  const handleReserveClick = async () => {
    if (loading || !onReserve) return;
    await onReserve({
      startDate,
      durationMonths,
      totalAmount,
    });
  };

  return (
    <div className="sticky top-8 rounded-[24px] border border-white/15 bg-[#181818] p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-[#9c9c9c]">Details</h3>
        <span className="text-[12px] text-[#9c9c9c]">
          {price} / {period}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {/* Start Date Picker */}
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#222222] px-4 py-3 text-[13px] transition-colors focus-within:border-white/30 hover:border-white/20">
          <div className="flex shrink-0 items-center gap-2.5 text-[#cfcfcf]">
            <Calendar className="h-4 w-4 text-[#9c9c9c]" />
            <span>Start Date</span>
          </div>
          <input
            type="date"
            min={minDate}
            value={startDate}
            onChange={(e) => {
              const chosen = e.target.value;
              setStartDate(chosen && chosen >= minDate ? chosen : minDate);
            }}
            className="bg-transparent text-right font-medium text-white outline-none [color-scheme:dark]"
          />
        </label>

        {/* Duration Select */}
        <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-[#222222] px-4 py-3 text-[13px] transition-colors focus-within:border-white/30 hover:border-white/20">
          <div className="flex items-center gap-2.5 text-[#cfcfcf]">
            <Clock className="h-4 w-4 text-[#9c9c9c]" />
            <span>Duration</span>
          </div>

          <div className="relative flex items-center">
            <select
              aria-label="Duration"
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              className="cursor-pointer appearance-none bg-transparent pr-5 text-right font-medium text-white outline-none"
            >
              {DURATION_OPTIONS.map((option) => (
                <option
                  key={option.months}
                  value={option.months}
                  className="bg-[#181818] text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-[#9c9c9c]" />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="block text-[13px] text-[#9c9c9c]">Total Rate</span>
            <span className="text-[11px] text-[#777777]">{durationSummaryText}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{formattedTotal}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleReserveClick}
        className="mt-6 w-full cursor-pointer rounded-full bg-[#ededed] py-3.5 text-center text-[14px] font-medium text-[#111] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Processing...' : 'Reserve Now'}
      </button>

      <p className="mt-3 text-center text-[11px] text-[#888888]">
        You won&apos;t be charged yet · Redirects to WhatsApp
      </p>
    </div>
  );
}