import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import SectionHeading from '@/components/sections/SectionHeading';
import StatCard from '@/components/about/StatCard';
import ValueCard from '@/components/about/ValueCard';
import { stats, story, values } from '@/components/about/data';

export default function AboutSection() {
  return (
    <section id="about" className="border-t border-white/10 bg-[#121212] px-4 py-20 text-[#ededed] sm:px-8">
      <div className="mx-auto max-w-[1050px] min-[1400px]:max-w-[1200px]">
        <SectionHeading eyebrow="Get to know" title="About Us" />

        {/* Cerita + foto */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[clamp(20px,3vw,26px)] font-light leading-snug tracking-tight text-[#ededed]">
              We help people in Serang find a kosan that feels like home.
            </p>
            <div className="mt-6 space-y-4">
              {story.map((p) => (
                <p key={p} className="text-[14px] font-light leading-relaxed text-[#9c9c9c]">
                  {p}
                </p>
              ))}
            </div>
            <a
              href="#listings"
              className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-[#ededed] pl-6 pr-2 text-[14px] font-medium text-[#111] transition-colors hover:bg-white"
            >
              Browse listings
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#161616] text-white">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>

          {/* Kolase bentuk khas hero */}
          <div className="relative grid grid-cols-2 items-end gap-4">
            <div className="h-[300px] overflow-hidden sm:h-[360px]" style={{ borderRadius: '85px 6px 80px 6px' }}>
              <img
                src="/assets/image01.png"
                alt="KosFinder boarding house exterior"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div
              className="aspect-square w-full overflow-hidden"
              style={{ borderRadius: '50% 50% 50% 6px' }}
            >
              <img
                src="/assets/image02.png"
                alt="Cozy kosan room interior"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <span className="absolute -bottom-3 left-4 flex items-center gap-2 rounded-full bg-[#121212] px-4 py-2 text-[12px] text-[#ededed] ring-1 ring-white/15">
              <MapPin className="h-3.5 w-3.5 text-[#d6ee6a]" />
              Made in Serang, Banten
            </span>
          </div>
        </div>

        {/* Statistik */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} value={s.value} label={s.label} light={i % 2 === 0} />
          ))}
        </div>

        {/* Nilai */}
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {values.map((v) => (
            <ValueCard key={v.title} value={v} />
          ))}
        </ul>
      </div>
    </section>
  );
}