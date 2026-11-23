'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import SectionHeading from '@/components/sections/SectionHeading';
import MapViewDynamic from '@/components/map-view/MapViewDynamic';
import KostListItem from '@/components/map-view/KostListItem';
import KostPopupCard from '@/components/map-view/KostPopupCard';
import {
  fetchDynamicKostMarkers,
  type KostMarker,
  type KostType,
} from '@/components/map-view/data';

const typeFilters = ['All', 'Male', 'Female', 'Mixed'] as const;
type TypeFilter = (typeof typeFilters)[number];

const sorts = [
  { value: 'default', label: 'Default' },
  { value: 'low', label: 'Price: low to high' },
  { value: 'high', label: 'Price: high to low' },
] as const;
type Sort = (typeof sorts)[number]['value'];

export default function MapViewSection() {
  const [markers, setMarkers] = useState<KostMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('All');
  const [sort, setSort] = useState<Sort>('default');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const data = await fetchDynamicKostMarkers();
      if (!active) return;
      setMarkers(data);
      setSelectedId((prev) => prev ?? data[0]?.id ?? null);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = markers.filter(
      (k) =>
        (type === 'All' || k.type === (type as KostType)) &&
        (q === '' ||
          k.name.toLowerCase().includes(q) ||
          k.address.toLowerCase().includes(q)),
    );
    if (sort === 'low') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [markers, query, type, sort]);

  const selected = visible.find((k) => k.id === selectedId) ?? null;

  useEffect(() => {
    const box = listRef.current;
    const el = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!box || !el) return;
    const out =
      el.offsetTop < box.scrollTop ||
      el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight;
    if (out) {
      box.scrollTo({ top: Math.max(el.offsetTop - 8, 0), behavior: 'smooth' });
    }
  }, [selectedId]);

  return (
    <section id="map" className="bg-white px-4 py-20 text-[#111] sm:px-8">
      <div className="mx-auto max-w-[1050px] min-[1400px]:max-w-[1200px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Kosan map in" title="Serang" tone="light" />
          <p className="max-w-[300px] text-[14px] font-light leading-relaxed text-[#666]">
            Search, filter, and pick a kosan on the map to see its price, facilities, and how to book.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] ring-1 ring-black/10 lg:grid lg:grid-cols-[380px_1fr]">
          {/* Panel kiri: pencarian + daftar */}
          <div className="flex flex-col gap-4 border-b border-black/10 p-5 lg:h-[640px] lg:border-b-0 lg:border-r">
            <label className="relative block">
              <span className="sr-only">Search kosan</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or area…"
                className="h-11 w-full rounded-full bg-[#f3f3f1] pl-11 pr-4 text-[13px] text-[#111] outline-none placeholder:text-[#999] focus:ring-1 focus:ring-[#111]"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {typeFilters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setType(f)}
                  aria-pressed={type === f}
                  className={`rounded-full px-4 py-1.5 text-[12px] transition-colors ${
                    type === f
                      ? 'bg-[#111] text-white'
                      : 'bg-[#f3f3f1] text-[#444] hover:bg-[#ebebe8]'
                  }`}
                >
                  {f}
                </button>
              ))}

              <label className="relative ml-auto">
                <span className="sr-only">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-8 appearance-none rounded-full bg-[#f3f3f1] pl-4 pr-8 text-[12px] text-[#444] outline-none focus:ring-1 focus:ring-[#111]"
                >
                  {sorts.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#888]" />
              </label>
            </div>

            <p className="text-[12px] text-[#777]">
              {loading ? 'Loading kosan…' : `${visible.length} kosan found`}
            </p>

            <ul
              ref={listRef}
              className="relative -mr-2 max-h-[340px] flex-1 space-y-2 overflow-y-auto pr-2 [scrollbar-color:#cfcfcc_transparent] [scrollbar-width:thin] lg:max-h-none"
            >
              {loading ? (
                <li className="rounded-2xl border border-black/10 p-6 text-center text-[13px] text-[#777]">
                  Memuat daftar kosan dari database…
                </li>
              ) : visible.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-black/15 p-6 text-center text-[13px] text-[#777]">
                  No kosan matches your search. Try a different name or area.
                </li>
              ) : (
                visible.map((k) => (
                  <KostListItem
                    key={k.id}
                    kost={k}
                    selected={k.id === selectedId}
                    onSelect={setSelectedId}
                  />
                ))
              )}
            </ul>
          </div>

          {/* Peta */}
          <div className="relative h-[460px] lg:h-[640px]">
            <div className="isolate h-full w-full">
              <MapViewDynamic
                items={visible}
                selectedId={selected?.id ?? null}
                onSelect={setSelectedId}
              />
            </div>
            {selected && (
              <KostPopupCard kost={selected} onClose={() => setSelectedId(null)} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}