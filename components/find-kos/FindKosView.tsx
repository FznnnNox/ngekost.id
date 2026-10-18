'use client';

import React, { useMemo, useState } from 'react';
import FilterBar, { type PriceRange } from '@/components/find-kos/FilterBar';
import ResultsHeader, { type Sort, type TypeFilter, typeFilters } from '@/components/find-kos/ResultsHeader';
import KosCard from '@/components/find-kos/KosCard';
import KosMapDynamic from '@/components/find-kos/KosMapDynamic';
import { kosList } from '@/components/find-kos/data';

const priceMatch = (price: number, range: PriceRange) =>
  range === 'any' ||
  (range === 'low' && price < 500_000) ||
  (range === 'mid' && price >= 500_000 && price <= 1_000_000) ||
  (range === 'high' && price > 1_000_000);

export default function FindKosView() {
  const [query, setQuery] = useState('');
  const [price, setPrice] = useState<PriceRange>('any');
  const [maxDistance, setMaxDistance] = useState(1500);
  const [type, setType] = useState<TypeFilter>('All');
  const [sort, setSort] = useState<Sort>('nearest');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Filter selain tipe, supaya jumlah di tombol tipe ikut berubah
  const base = useMemo(() => {
    const q = query.trim().toLowerCase();
    return kosList.filter(
      (k) =>
        (q === '' || k.name.toLowerCase().includes(q) || k.area.toLowerCase().includes(q)) &&
        priceMatch(k.price, price) &&
        k.distance <= maxDistance,
    );
  }, [query, price, maxDistance]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        typeFilters.map((t) => [t, t === 'All' ? base.length : base.filter((k) => k.type === t).length]),
      ) as Record<TypeFilter, number>,
    [base],
  );

  const shown = useMemo(() => {
    const list = base.filter((k) => type === 'All' || k.type === type);
    const sorted = [...list];
    if (sort === 'nearest') sorted.sort((a, b) => a.distance - b.distance);
    if (sort === 'cheapest') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'priciest') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [base, type, sort]);

  const reset = () => {
    setQuery('');
    setPrice('any');
    setMaxDistance(1500);
    setType('All');
    setSort('nearest');
    setSelectedId(null);
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <FilterBar
        query={query}
        onQuery={setQuery}
        price={price}
        onPrice={setPrice}
        maxDistance={maxDistance}
        onMaxDistance={setMaxDistance}
        onReset={reset}
        onSubmit={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Peta: di atas daftar pada layar kecil */}
        <div className="h-[380px] lg:sticky lg:top-24 lg:order-2 lg:h-[calc(100vh-8rem)] lg:min-h-[560px]">
          <KosMapDynamic items={shown} selectedId={selectedId} hoveredId={hoveredId} onSelect={setSelectedId} />
        </div>

        {/* Daftar kosan */}
        <section
          id="results"
          aria-label="Kosan results"
          className="scroll-mt-24 rounded-[28px] bg-white p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)] ring-1 ring-black/5 sm:p-6 lg:order-1"
        >
          <ResultsHeader type={type} onType={setType} counts={counts} sort={sort} onSort={setSort} />

          {shown.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-black/15 p-10 text-center text-[14px] text-[#777]">
              No kosan matches your filters.{' '}
              <button type="button" onClick={reset} className="font-medium text-[#111] underline underline-offset-4">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((k) => (
                <KosCard
                  key={k.id}
                  kos={k}
                  selected={k.id === selectedId}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}