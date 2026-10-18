'use client';

import React, { useState } from 'react';
import SectionHeading from '@/components/sections/SectionHeading';
import ListingFilters from '@/components/listings/ListingFilters';
import ListingCard from '@/components/listings/ListingCard';
import { listings, type Filter } from '@/components/listings/data';

export default function ListingsSection() {
  const [filter, setFilter] = useState<Filter>('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const shown = listings.filter((l) => filter === 'All' || l.type === filter);

  const toggleSaved = (name: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (!next.delete(name)) next.add(name);
      return next;
    });

  return (
    <section id="listings" className="bg-[#121212] px-4 py-20 text-[#ededed] sm:px-8">
      <div className="mx-auto max-w-[1050px] min-[1400px]:max-w-[1200px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Featured" title="Listings" />
          <ListingFilters value={filter} onChange={setFilter} />
        </div>

        <p className="mt-6 text-[13px] text-[#9c9c9c]">
          Showing {shown.length} kosan{filter !== 'All' && ` for ${filter.toLowerCase()}`}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((l) => (
            <ListingCard key={l.name} listing={l} saved={saved.has(l.name)} onToggleSaved={toggleSaved} />
          ))}
        </div>
      </div>
    </section>
  );
}