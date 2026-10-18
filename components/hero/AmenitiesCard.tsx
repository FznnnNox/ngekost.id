import React from "react";
import { Wifi, ShieldCheck, MoreHorizontal } from "lucide-react";

const features = [
  { icon: Wifi, title: "Feature #1", desc: "Wi-Fi & Utilities Included" },
  {
    icon: ShieldCheck,
    title: "Feature #2",
    desc: "Verified Owners & Secure Payment",
  },
];

export default function AmenitiesCard() {
  return (
    <div className="h-full w-full rounded-[28px] bg-[#ededed] p-[10px] text-[#111]">
      <div className="mb-[34px] flex h-9 items-center justify-between pl-[2px] pr-[2px]">
        <h3 className="text-[20px] font-normal tracking-tight">Top Filters</h3>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#161616] text-white">
          <MoreHorizontal className="h-3 w-3" />
        </span>
      </div>

      <div className="flex flex-col gap-[10px]">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex h-20 items-center gap-4 rounded-[24px] bg-[#262626] px-[13px] text-white"
          >
            <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-white text-black">
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <div className="leading-snug">
              <div className="text-[14px] font-medium">{title}</div>
              <div className="text-[12px] text-white/85">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
