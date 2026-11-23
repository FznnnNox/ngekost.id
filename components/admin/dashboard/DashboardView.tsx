'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  CalendarDays,
  Home,
  Mars,
  RefreshCw,
  SlidersHorizontal,
  Users,
  Venus,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  UNPAM_CENTER,
  formatDistance,
  formatPrice,
} from '@/components/find-kos/data';
import type {
  DashboardKosItem,
  MapSort,
} from '@/components/admin/dashboard/DashboardMap';

const DashboardMap = dynamic(
  () => import('@/components/admin/dashboard/DashboardMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-[22px] bg-[#e9e5dc]" />
    ),
  },
);

const pills = ['All', 'Male', 'Female', 'Mixed'] as const;
const DEFAULT_ROOMS_PER_KOS = 10;

const card = 'rounded-[22px] bg-[#1c1c1c] p-5 text-[#ededed]';
const muted = 'text-[#8a8a86]';
const typeIcon = { Male: Mars, Female: Venus, Mixed: Users } as const;

function calcDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Number((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

function mapCategoryType(categoryId: number | null): 'Male' | 'Female' | 'Mixed' {
  if (categoryId === 1) return 'Male';
  if (categoryId === 2) return 'Female';
  return 'Mixed';
}

export default function DashboardView() {
  const router = useRouter();
  const [kosItems, setKosItems] = useState<DashboardKosItem[]>([]);
  const [totalRoomsCount, setTotalRoomsCount] = useState<number>(0);
  const [occupiedRoomsCount, setOccupiedRoomsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<MapSort>('nearest');
  const [type, setType] = useState<(typeof pills)[number]>('All');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [onlyAlmostFull, setOnlyAlmostFull] = useState<boolean>(false);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [housesRes, roomsRes, reviewsRes] = await Promise.all([
        supabase
          .from('boarding_houses')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.from('rooms').select('*'),
        supabase.from('testimonials').select('boarding_house_id, rating'),
      ]);

      if (housesRes.error) {
        console.error('Error fetching boarding_houses:', housesRes.error.message);
        setLoading(false);
        return;
      }

      const houses = housesRes.data || [];
      const rooms = roomsRes.data || [];
      const reviews = reviewsRes.data || [];

      const ratingMap = new Map<number, { sum: number; count: number }>();
      for (const rev of reviews) {
        const hid = Number(rev.boarding_house_id);
        const cur = ratingMap.get(hid) || { sum: 0, count: 0 };
        cur.sum += Number(rev.rating || 0);
        cur.count += 1;
        ratingMap.set(hid, cur);
      }

      const roomsByHouse = new Map<
        number,
        { total: number; available: number; sizes: number[] }
      >();
      for (const rm of rooms) {
        const hid = Number(rm.boarding_house_id);
        const cur = roomsByHouse.get(hid) || {
          total: 0,
          available: 0,
          sizes: [],
        };
        cur.total += 1;
        if (rm.is_available !== false) cur.available += 1;
        if (Number(rm.square_feet) > 0) cur.sizes.push(Number(rm.square_feet));
        roomsByHouse.set(hid, cur);
      }

      let aggRooms = 0;
      let aggOccupied = 0;

      const mapped: DashboardKosItem[] = houses.map((h: any) => {
        const id = Number(h.id);
        const lat = Number(h.latitude ?? UNPAM_CENTER[0]);
        const lng = Number(h.longitude ?? UNPAM_CENTER[1]);
        const distance = calcDistanceKm(UNPAM_CENTER[0], UNPAM_CENTER[1], lat, lng);

        const rInfo = ratingMap.get(id);
        const avgRating =
          rInfo && rInfo.count > 0
            ? Number((rInfo.sum / rInfo.count).toFixed(1))
            : 4.5;

        const rmInfo = roomsByHouse.get(id);
        const houseTotalRooms =
          rmInfo && rmInfo.total > 0 ? rmInfo.total : DEFAULT_ROOMS_PER_KOS;
        const houseAvailableRooms =
          rmInfo && rmInfo.total > 0
            ? rmInfo.available
            : Math.max(1, DEFAULT_ROOMS_PER_KOS - 2);
        const houseOccupiedRooms = Math.max(
          0,
          houseTotalRooms - houseAvailableRooms,
        );

        aggRooms += houseTotalRooms;
        aggOccupied += houseOccupiedRooms;

        const firstSize = rmInfo?.sizes[0];
        const sizeLabel = firstSize ? `${firstSize} m²` : '12 m²';

        return {
          id,
          slug: h.slug || String(id),
          name: h.name || 'Unnamed Kos',
          area: h.address || 'Serang, Banten',
          type: mapCategoryType(h.category_id),
          price: Number(h.price || 0),
          lat,
          lng,
          distance,
          rating: avgRating,
          size: sizeLabel,
          left: houseAvailableRooms,
          thumbnail: h.thumbnail || '/assets/image01.png',
        };
      });

      setKosItems(mapped);
      setTotalRoomsCount(aggRooms);
      setOccupiedRoomsCount(aggOccupied);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const total = kosItems.length;
  const rooms = totalRoomsCount;
  const occupied = occupiedRoomsCount;
  const occPct = rooms > 0 ? Math.min(1, Math.max(0, occupied / rooms)) : 0;

  const typeCount = useCallback(
    (t: 'Male' | 'Female' | 'Mixed') =>
      kosItems.filter((k) => k.type === t).length,
    [kosItems],
  );

  const avgPrice = useMemo(() => {
    if (total === 0) return 0;
    return Math.round(kosItems.reduce((a, k) => a + k.price, 0) / total);
  }, [kosItems, total]);

  const maxPrice = useMemo(() => {
    if (total === 0) return 0;
    return Math.max(...kosItems.map((k) => k.price));
  }, [kosItems, total]);

  const minPrice = useMemo(() => {
    if (total === 0) return 0;
    return Math.min(...kosItems.map((k) => k.price));
  }, [kosItems, total]);

  const avgRating = useMemo(() => {
    if (total === 0) return '0.0';
    return (kosItems.reduce((a, k) => a + k.rating, 0) / total).toFixed(1);
  }, [kosItems, total]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = kosItems.filter(
      (k) =>
        (type === 'All' || k.type === type) &&
        (!onlyAlmostFull || k.left <= 2) &&
        (!q ||
          k.name.toLowerCase().includes(q) ||
          k.area.toLowerCase().includes(q)),
    );
    if (sort === 'nearest') list.sort((a, b) => a.distance - b.distance);
    if (sort === 'cheapest') list.sort((a, b) => a.price - b.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [kosItems, query, type, sort, onlyAlmostFull]);

  const t = occPct;
  const dotY = (1 - t) ** 2 * 30 + 2 * (1 - t) * t * 38 + t ** 2 * 12;

  return (
    <div className="grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Kolom kiri */}
      <div className="flex flex-col gap-3">
        {/* Room occupancy */}
        <section className={`${card} relative overflow-hidden`}>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-medium">Room Occupancy</h2>
            <button
              type="button"
              onClick={() => router.push('/admin/boarding-houses')}
              aria-label="Manage boarding houses"
              className="rounded-full p-1 transition-colors hover:bg-white/10"
            >
              <ArrowUpRight className={`h-4 w-4 ${muted}`} />
            </button>
          </div>
          <div className="relative mt-3 h-[130px]">
            <img
              src={kosItems[0]?.thumbnail || '/assets/image01.png'}
              alt=""
              className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-25 grayscale"
            />
            {[
              { t: 'Male' as const, c: 'left-0 top-2' },
              { t: 'Mixed' as const, c: 'right-0 top-8' },
              { t: 'Female' as const, c: 'left-[18%] top-[72px]' },
            ].map(({ t: ty, c }) => {
              const Icon = typeIcon[ty];
              return (
                <span
                  key={ty}
                  className={`absolute ${c} flex items-center gap-1.5 rounded-xl bg-white/10 px-2.5 py-1.5 text-[11px] backdrop-blur`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {ty}{' '}
                  <span className={muted}>{typeCount(ty)} kos</span>
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
            <svg
              viewBox="0 0 260 44"
              className="h-11 w-full overflow-visible"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="occ" x1="0" x2="1">
                  <stop offset="0" stopColor="#e5484d" />
                  <stop offset="1" stopColor="#9be07a" />
                </linearGradient>
              </defs>
              <path
                d="M0 30 Q130 38 260 12"
                fill="none"
                stroke="url(#occ)"
                strokeWidth="2"
              />
              <circle cx={t * 260} cy={dotY} r="4" fill="#fff" />
            </svg>
            <div className={`flex justify-between text-[10px] ${muted}`}>
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <p className={`mt-2 text-center text-[11px] ${muted}`}>
            {loading
              ? 'Loading room occupancy...'
              : `${occupied} / ${rooms} rooms occupied (${Math.round(occPct * 100)}%)`}
          </p>
        </section>

        {/* Listings by type */}
        <section className={card}>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-medium">Listings by type</h2>
            <button
              type="button"
              onClick={() => router.push('/admin/boarding-houses')}
              aria-label="View all listings"
              className="rounded-full p-1 transition-colors hover:bg-white/10"
            >
              <ArrowUpRight className={`h-4 w-4 ${muted}`} />
            </button>
          </div>
          <ul className="mt-4 grid gap-3.5">
            {(['Male', 'Female', 'Mixed'] as const).map((ty) => {
              const Icon = typeIcon[ty];
              const n = typeCount(ty);
              const pct = total > 0 ? n / total : 0;
              return (
                <li
                  key={ty}
                  className="grid grid-cols-[84px_24px_1fr_34px] items-center gap-2 text-[12px]"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {ty}
                  </span>
                  <span>{n}</span>
                  <span className="flex gap-[2px]" aria-hidden>
                    {Array.from({ length: 28 }, (_, i) => (
                      <i
                        key={i}
                        className={`h-3.5 flex-1 rounded-[1px] ${
                          i < Math.round(pct * 28)
                            ? 'bg-[#e8e2b8]'
                            : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </span>
                  <span className={`text-right ${muted}`}>
                    {Math.round(pct * 100)}%
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Price overview */}
        <section className={card}>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-medium">Price Overview</h2>
            <button
              type="button"
              onClick={loadDashboardData}
              aria-label="Refresh statistics"
              className="rounded-full p-1 transition-colors hover:bg-white/10"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${muted} ${loading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[10px]">
            <div className={muted}>
              <p className="text-[#ededed]">{formatPrice(minPrice)}</p>Cheapest
              <p className="mt-2 text-[#ededed]">{formatPrice(maxPrice)}</p>Priciest
            </div>
            <div className="text-center">
              <p className={muted}>Average / month</p>
              <p className="mt-1 text-[30px] font-light leading-none">
                {formatPrice(avgPrice)}
              </p>
            </div>
            <div className={`text-right ${muted}`}>
              <p className="text-[#ededed]">{total} kos</p>Total listings
              <p className="mt-2 text-[#ededed]">★ {avgRating}</p>Avg. rating
            </div>
          </div>
          <div className="relative mt-4 flex h-[70px] items-end gap-1.5">
            {[...kosItems]
              .sort((a, b) => a.distance - b.distance)
              .map((k) => {
                const heightPct =
                  maxPrice > 0 ? Math.max(12, (k.price / maxPrice) * 100) : 12;
                return (
                  <i
                    key={k.id}
                    title={`${k.name} ${formatPrice(k.price)}`}
                    className="flex-1 rounded-t-[2px] bg-white/90"
                    style={{ height: `${heightPct}%` }}
                  />
                );
              })}
            {maxPrice > 0 && (
              <span
                className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#e8e2b8]"
                style={{
                  bottom: `${Math.min(100, (avgPrice / maxPrice) * 100)}%`,
                }}
              />
            )}
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
          <DashboardMap
            items={shown}
            selectedId={selectedId}
            onSelect={setSelectedId}
            query={query}
            onQuery={setQuery}
            sort={sort}
            onSort={setSort}
          />
        </div>

        {/* Tabel listing */}
        <section className="flex-1 overflow-hidden rounded-[22px] bg-[#1c1c1c] text-[#ededed]">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-3">
            <h2 className="pl-1 text-[16px] font-medium">
              Listings {loading ? '(Loading...)' : `(${shown.length})`}
            </h2>
            <div className="flex items-center gap-2">
              <div
                className="flex rounded-full bg-[#262626] p-1 text-[11px]"
                role="group"
                aria-label="Filter by type"
              >
                {pills.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setType(p)}
                    aria-pressed={type === p}
                    className={`rounded-full px-3.5 py-1.5 transition-colors ${
                      type === p
                        ? 'bg-[#e8e2b8] font-medium text-[#111]'
                        : 'text-[#cfcfcf] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={loadDashboardData}
                aria-label="Refresh data"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#262626] hover:bg-[#303030]"
              >
                <CalendarDays className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOnlyAlmostFull((v) => !v)}
                aria-pressed={onlyAlmostFull}
                aria-label="Filter almost full"
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  onlyAlmostFull
                    ? 'bg-[#e8e2b8] text-[#111]'
                    : 'bg-[#262626] hover:bg-[#303030]'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div
                className={`grid grid-cols-[1.1fr_1.3fr_1.7fr_0.8fr_0.9fr_0.9fr] bg-[#161616] px-6 py-2.5 text-[11px] ${muted}`}
              >
                {['Listing ID', 'Kos', 'Location', 'Size', 'Price', 'Status'].map(
                  (h, i) => (
                    <span key={h} className={i === 5 ? 'text-right' : ''}>
                      {h}
                    </span>
                  ),
                )}
              </div>
              <ul className="max-h-[216px] overflow-y-auto">
                {loading && shown.length === 0 && (
                  <li className={`px-6 py-8 text-center text-[12px] ${muted}`}>
                    Loading listings from Supabase...
                  </li>
                )}
                {!loading && shown.length === 0 && (
                  <li className={`px-6 py-8 text-center text-[12px] ${muted}`}>
                    No listings match.
                  </li>
                )}
                {shown.map((k) => {
                  const almost = k.left <= 2;
                  return (
                    <li
                      key={k.id}
                      onClick={() => setSelectedId(k.id)}
                      onDoubleClick={() =>
                        router.push(`/listings/${encodeURIComponent(k.slug)}`)
                      }
                      className={`grid cursor-pointer grid-cols-[1.1fr_1.3fr_1.7fr_0.8fr_0.9fr_0.9fr] items-center border-t border-white/5 px-6 py-3.5 text-[12px] transition-colors hover:bg-white/[0.03] ${
                        selectedId === k.id ? 'bg-white/[0.05]' : ''
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Home className="h-4 w-4" />#KS
                        {String(k.id).padStart(3, '0')}
                      </span>
                      <span>
                        <span className="block">{k.name}</span>
                        <span className={`block text-[10px] ${muted}`}>
                          {k.type}
                        </span>
                      </span>
                      <span className="relative pl-4 text-[11px] leading-tight">
                        <i className="absolute left-0 top-1 h-[26px] w-px bg-white/30" />
                        <i className="absolute -left-[2px] top-0 h-[5px] w-[5px] rounded-full border border-white/60" />
                        <i className="absolute -left-[2px] top-[27px] h-[5px] w-[5px] rounded-full bg-white/60" />
                        <span className="block">{k.area}</span>
                        <span className={`mt-2 block ${muted}`}>
                          UNPAM · {formatDistance(k.distance)}
                        </span>
                      </span>
                      <span>{k.size}</span>
                      <span>
                        {formatPrice(k.price)}
                        <span className={`text-[10px] ${muted}`}>/mo</span>
                      </span>
                      <span
                        className={`text-right ${almost ? 'text-[#e8e2b8]' : ''}`}
                      >
                        {almost ? 'Almost full' : 'Available'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}