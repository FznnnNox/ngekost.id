'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowUpRight, Bell, Building2, CalendarDays, ChevronDown, Home, Mars, Search, SlidersHorizontal, Users, Venus,
} from 'lucide-react';
import { formatDistance, formatPrice, kosList, type KosType } from '@/components/find-kos/data';
import type { MapSort } from '@/components/dashboard/DashboardMap';

const DashboardMap = dynamic(() => import('@/components/dashboard/DashboardMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-[22px] bg-[#e9e5dc]" />,
});

const navLinks = ['Overview', 'Listings', 'Owners', 'Inquiries', 'Analytics'];
const pills = ['All', 'Male', 'Female', 'Mixed'] as const;
const ROOMS_PER_KOS = 10; // TODO: ganti dengan total kamar asli tiap kos

const card = 'rounded-[22px] bg-[#1c1c1c] p-5 text-[#ededed]';
const muted = 'text-[#8a8a86]';
const typeIcon = { Male: Mars, Female: Venus, Mixed: Users } as const;

// ---- Statistik (dari data kos) ----
const total = kosList.length;
const rooms = total * ROOMS_PER_KOS;
const free = kosList.reduce((a, k) => a + k.left, 0);
const occupied = rooms - free;
const occPct = occupied / rooms;
const typeCount = (t: KosType) => kosList.filter((k) => k.type === t).length;
const avgPrice = Math.round(kosList.reduce((a, k) => a + k.price, 0) / total);
const maxPrice = Math.max(...kosList.map((k) => k.price));
const minPrice = Math.min(...kosList.map((k) => k.price));
const avgRating = (kosList.reduce((a, k) => a + k.rating, 0) / total).toFixed(1);

function ArrowBtn() {
  return <ArrowUpRight className={`h-4 w-4 ${muted}`} />;
}

export default function DashboardView() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<MapSort>('nearest');
  const [type, setType] = useState<(typeof pills)[number]>('All');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = kosList.filter(
      (k) => (type === 'All' || k.type === type) && (!q || k.name.toLowerCase().includes(q) || k.area.toLowerCase().includes(q)),
    );
    if (sort === 'nearest') list.sort((a, b) => a.distance - b.distance);
    if (sort === 'cheapest') list.sort((a, b) => a.price - b.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, type, sort]);

  // Titik indikator pada kurva progres
  const t = occPct;
  const dotY = (1 - t) ** 2 * 30 + 2 * (1 - t) * t * 38 + t ** 2 * 12;

  return (
    <div className="min-h-screen bg-[#c9c5c1] p-3 sm:p-8">
      <div className="mx-auto max-w-[1280px] rounded-[28px] bg-[#0f0f0f] p-4 text-[#ededed] sm:p-5">
        {/* Navbar */}
        <header className="flex items-center justify-between gap-4 px-2 pb-4 pt-1">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 text-[18px] font-semibold tracking-tight">
              <Building2 className="h-6 w-6 fill-white" strokeWidth={1.5} />
              Ngekost.
            </Link>
            <nav className="hidden gap-7 text-[12px] md:flex" aria-label="Dashboard">
              {navLinks.map((l, i) => (
                <a key={l} href="#" className={i === 0 ? 'text-white' : muted + ' transition-colors hover:text-white'}>
                  {l}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {[Search, Bell].map((Icon, i) => (
              <button key={i} type="button" aria-label={i ? 'Notifications' : 'Search'} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1c1c1c] hover:bg-[#262626]">
                <Icon className="h-4 w-4" />
              </button>
            ))}
            <button type="button" className="flex h-10 items-center gap-2.5 rounded-full border border-white/10 bg-[#1c1c1c] py-1 pl-1 pr-3 hover:bg-[#262626]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e2b8] text-[12px] font-semibold text-[#111]">A</span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-[12px]">Admin</span>
                <span className={`block text-[10px] ${muted}`}>Ngekost.id</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        <div className="grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Kolom kiri */}
          <div className="flex flex-col gap-3">
            {/* Room occupancy */}
            <section className={`${card} relative overflow-hidden`}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-medium">Room Occupancy</h2>
                <ArrowBtn />
              </div>
              <div className="relative mt-3 h-[130px]">
                <img src="/assets/image01.png" alt="" className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-25 grayscale" />
                {[
                  { t: 'Male' as const, c: 'left-0 top-2' },
                  { t: 'Mixed' as const, c: 'right-0 top-8' },
                  { t: 'Female' as const, c: 'left-[18%] top-[72px]' },
                ].map(({ t: ty, c }) => {
                  const Icon = typeIcon[ty];
                  return (
                    <span key={ty} className={`absolute ${c} flex items-center gap-1.5 rounded-xl bg-white/10 px-2.5 py-1.5 text-[11px] backdrop-blur`}>
                      <Icon className="h-3.5 w-3.5" />
                      {ty} <span className={muted}>{typeCount(ty)} kos</span>
                    </span>
                  );
                })}
              </div>
              <div className="relative mt-2">
                <span
                  className="absolute -top-7 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#111]"
                  style={{ left: `${t * 100}%` }}
                >
                  {Math.round(t * 100)}%
                </span>
                <svg viewBox="0 0 260 44" className="h-11 w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
                  <defs>
                    <linearGradient id="occ" x1="0" x2="1">
                      <stop offset="0" stopColor="#e5484d" />
                      <stop offset="1" stopColor="#9be07a" />
                    </linearGradient>
                  </defs>
                  <path d="M0 30 Q130 38 260 12" fill="none" stroke="url(#occ)" strokeWidth="2" />
                  <circle cx={t * 260} cy={dotY} r="4" fill="#fff" />
                </svg>
                <div className={`flex justify-between text-[10px] ${muted}`}>
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
              <p className={`mt-2 text-center text-[11px] ${muted}`}>
                {occupied} / {rooms} rooms occupied ({Math.round(occPct * 100)}%)
              </p>
            </section>

            {/* Listings by type */}
            <section className={card}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-medium">Listings by type</h2>
                <ArrowBtn />
              </div>
              <ul className="mt-4 grid gap-3.5">
                {(['Male', 'Female', 'Mixed'] as const).map((ty) => {
                  const Icon = typeIcon[ty];
                  const n = typeCount(ty);
                  const pct = n / total;
                  return (
                    <li key={ty} className="grid grid-cols-[84px_24px_1fr_34px] items-center gap-2 text-[12px]">
                      <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{ty}</span>
                      <span>{n}</span>
                      <span className="flex gap-[2px]" aria-hidden>
                        {Array.from({ length: 28 }, (_, i) => (
                          <i key={i} className={`h-3.5 flex-1 rounded-[1px] ${i < Math.round(pct * 28) ? 'bg-[#e8e2b8]' : 'bg-white/15'}`} />
                        ))}
                      </span>
                      <span className={`text-right ${muted}`}>{Math.round(pct * 100)}%</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Price overview */}
            <section className={card}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-medium">Price Overview</h2>
                <ArrowBtn />
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[10px]">
                <div className={muted}>
                  <p className="text-[#ededed]">{formatPrice(minPrice)}</p>Cheapest
                  <p className="mt-2 text-[#ededed]">{formatPrice(maxPrice)}</p>Priciest
                </div>
                <div className="text-center">
                  <p className={muted}>Average / month</p>
                  <p className="mt-1 text-[30px] font-light leading-none">{formatPrice(avgPrice)}</p>
                </div>
                <div className={`text-right ${muted}`}>
                  <p className="text-[#ededed]">{total} kos</p>Total listings
                  <p className="mt-2 text-[#ededed]">★ {avgRating}</p>Avg. rating
                </div>
              </div>
              <div className="relative mt-4 flex h-[70px] items-end gap-1.5">
                {[...kosList].sort((a, b) => a.distance - b.distance).map((k) => (
                  <i key={k.id} title={`${k.name} ${formatPrice(k.price)}`} className="flex-1 rounded-t-[2px] bg-white/90" style={{ height: `${(k.price / maxPrice) * 100}%` }} />
                ))}
                <span className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#e8e2b8]" style={{ bottom: `${(avgPrice / maxPrice) * 100}%` }} />
              </div>
              <div className={`mt-1 flex justify-between text-[10px] ${muted}`}>
                <span>Nearest</span>
                <span>Farthest</span>
              </div>
            </section>
          </div>

          {/* Kolom kanan */}
          <div className="flex min-w-0 flex-col gap-3">
            <div className="h-[340px] lg:h-[300px]">
              <DashboardMap items={shown} selectedId={selectedId} onSelect={setSelectedId} query={query} onQuery={setQuery} sort={sort} onSort={setSort} />
            </div>

            {/* Tabel listing */}
            <section className="flex-1 overflow-hidden rounded-[22px] bg-[#1c1c1c] text-[#ededed]">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-3">
                <h2 className="pl-1 text-[16px] font-medium">Listings</h2>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-full bg-[#262626] p-1 text-[11px]" role="group" aria-label="Filter by type">
                    {pills.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setType(p)}
                        aria-pressed={type === p}
                        className={`rounded-full px-3.5 py-1.5 transition-colors ${type === p ? 'bg-[#e8e2b8] font-medium text-[#111]' : 'text-[#cfcfcf] hover:text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  {[CalendarDays, SlidersHorizontal].map((Icon, i) => (
                    <button key={i} type="button" aria-label={i ? 'Filters' : 'Date'} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#262626] hover:bg-[#303030]">
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                  <div className={`grid grid-cols-[1.1fr_1.3fr_1.7fr_0.8fr_0.9fr_0.9fr] bg-[#161616] px-6 py-2.5 text-[11px] ${muted}`}>
                    {['Listing ID', 'Kos', 'Location', 'Size', 'Price', 'Status'].map((h, i) => (
                      <span key={h} className={i === 5 ? 'text-right' : ''}>{h}</span>
                    ))}
                  </div>
                  <ul className="max-h-[216px] overflow-y-auto">
                    {shown.length === 0 && <li className={`px-6 py-8 text-center text-[12px] ${muted}`}>No listings match.</li>}
                    {shown.map((k) => {
                      const almost = k.left <= 2;
                      return (
                        <li
                          key={k.id}
                          onClick={() => setSelectedId(k.id)}
                          className={`grid cursor-pointer grid-cols-[1.1fr_1.3fr_1.7fr_0.8fr_0.9fr_0.9fr] items-center border-t border-white/5 px-6 py-3.5 text-[12px] transition-colors hover:bg-white/[0.03] ${selectedId === k.id ? 'bg-white/[0.05]' : ''}`}
                        >
                          <span className="flex items-center gap-3"><Home className="h-4 w-4" />#KS{String(k.id).padStart(3, '0')}</span>
                          <span>
                            <span className="block">{k.name}</span>
                            <span className={`block text-[10px] ${muted}`}>{k.type}</span>
                          </span>
                          <span className="relative pl-4 text-[11px] leading-tight">
                            <i className="absolute left-0 top-1 h-[26px] w-px bg-white/30" />
                            <i className="absolute -left-[2px] top-0 h-[5px] w-[5px] rounded-full border border-white/60" />
                            <i className="absolute -left-[2px] top-[27px] h-[5px] w-[5px] rounded-full bg-white/60" />
                            <span className="block">{k.area}</span>
                            <span className={`mt-2 block ${muted}`}>UNPAM · {formatDistance(k.distance)}</span>
                          </span>
                          <span>{k.size}</span>
                          <span>{formatPrice(k.price)}<span className={`text-[10px] ${muted}`}>/mo</span></span>
                          <span className={`text-right ${almost ? 'text-[#e8e2b8]' : ''}`}>{almost ? 'Almost full' : 'Available'}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}