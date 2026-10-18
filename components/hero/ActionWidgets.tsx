import React from "react";
import { ArrowRight, DollarSign } from "lucide-react";

export function BookNowCard() {
  return (
    <a
      href="#rooms"
      className="group flex h-full w-full flex-col rounded-[28px] bg-[#ededed] p-[18px] text-[#111] transition-colors hover:bg-white"
    >
      <div className="flex items-center justify-between">
        <span className="text-[17px] font-normal">
          Compare prices, save more
        </span>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#161616] text-white">
          <DollarSign className="h-3 w-3" />
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-[20px] font-medium leading-none tracking-tight">
          Search Now
        </span>
        <ArrowRight
          className="h-8 w-8 transition-transform group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </div>
    </a>
  );
}

export function SuggestionCard() {
  return (
    <div className="flex h-full w-full items-center gap-3 rounded-[28px] bg-[#ededed] px-[17px] text-[#111]">
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
        <path
          d="M16 0 L18.2 12.4 L27.3 4.7 L19.6 13.8 L32 16 L19.6 18.2 L27.3 27.3 L18.2 19.6 L16 32 L13.8 19.6 L4.7 27.3 L12.4 18.2 L0 16 L12.4 13.8 L4.7 4.7 L13.8 12.4 Z"
          fill="#161616"
        />
      </svg>
      <div className="leading-tight">
        <div className="text-[18px] font-bold">Today's</div>
        <div className="text-[14px] text-[#444]">Suggestion</div>
      </div>
    </div>
  );
}
