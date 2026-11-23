import React from 'react';
import { Building2 } from 'lucide-react';

export default function LoginShowcase() {
  return (
    <section className="relative hidden flex-col overflow-hidden bg-[#0a0a0a] p-10 text-white lg:flex xl:p-14">
      {/* Dekorasi cincin */}
      <span aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full border-[28px] border-white/[0.06]" />
      <span aria-hidden className="pointer-events-none absolute -right-24 top-1/3 h-[300px] w-[300px] rounded-full border-[22px] border-white/[0.06]" />

      <div className="relative flex items-center gap-2.5 text-[18px] font-semibold tracking-tight">
        <Building2 className="h-7 w-7 fill-white" strokeWidth={1.5} />
        Ngekost.id
      </div>

      <div className="relative my-auto max-w-[420px]">
        <h2 className="text-[clamp(26px,2.6vw,34px)] font-medium leading-tight tracking-tight">
          Built for managing kos listings
        </h2>
        <p className="mt-3 text-[15px] font-light leading-relaxed text-white/75">
          Update prices and availability, and keep owner contacts accurate from anywhere.
        </p>
        <div className="mt-6 flex gap-1.5" aria-hidden>
          <i className="h-1 w-7 rounded-full bg-white" />
          <i className="h-1 w-1 rounded-full bg-white/50" />
          <i className="h-1 w-1 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}