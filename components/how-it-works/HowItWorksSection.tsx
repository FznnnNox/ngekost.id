import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/sections/SectionHeading';
import StepCard from '@/components/how-it-works/StepCard';
import { steps } from '@/components/how-it-works/data';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#121212] px-4 py-20 text-[#ededed] sm:px-8">
      <div className="mx-auto max-w-[1050px] min-[1400px]:max-w-[1200px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Simple as" title="1-2-3" />
          <p className="max-w-[300px] text-[14px] font-light leading-relaxed text-[#9c9c9c]">
            From searching to getting your key, everything happens in one place, with no hidden steps.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-[18px] font-light text-[#cfcfcf]">Ready to find your kosan?</p>
          <a
            href="#listings"
            className="group flex h-12 items-center gap-3 rounded-full bg-[#ededed] pl-6 pr-2 text-[14px] font-medium text-[#111] transition-colors hover:bg-white"
          >
            Browse listings
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#161616] text-white">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}