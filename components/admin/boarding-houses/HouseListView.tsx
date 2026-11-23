'use client';

import React from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { categories, cities, rupiah, type BoardingHouse, type Bonus, type Room } from '@/components/admin/boarding-houses/data';

interface HouseListViewProps {
  houses: BoardingHouse[];
  rooms: Room[];
  bonuses: Bonus[];
  query: string;
  setQuery: (q: string) => void;
  onSelectHouse: (id: number) => void;
  onDeleteHouse: (id: number) => void;
  onStartCreate: () => void;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const btnPrimary =
  'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90';
const iconBtn =
  'flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function HouseListView({
  houses,
  rooms,
  bonuses,
  query,
  setQuery,
  onSelectHouse,
  onDeleteHouse,
  onStartCreate,
}: HouseListViewProps) {
  return (
    <section className={card}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 pb-4">
        <div>
          <h1 className="text-[18px] font-medium">Boarding Houses</h1>
          <p className="mt-0.5 text-[12px] text-[#8a8a86]">{houses.length} listings</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="flex h-10 w-full sm:w-[220px] items-center gap-2 rounded-full bg-[#262626] px-4 text-[12px]">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or address"
              className="w-full bg-transparent outline-none placeholder:text-[#6b6b68]"
            />
          </label>
          <button type="button" onClick={onStartCreate} className={btnPrimary}>
            <Plus className="h-4 w-4" /> Add boarding house
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[2.2fr_1fr_1fr_1.2fr_0.8fr_0.8fr_96px] bg-[#161616] px-5 py-2.5 text-[11px] text-[#8a8a86]">
            {['Boarding house', 'City', 'Category', 'Price / month', 'Rooms', 'Bonuses', ''].map(
              (h) => (
                <span key={h}>{h}</span>
              )
            )}
          </div>
          <ul>
            {houses.map((h) => (
              <li
                key={h.id}
                className="grid grid-cols-[2.2fr_1fr_1fr_1.2fr_0.8fr_0.8fr_96px] items-center border-t border-white/5 px-5 py-3 text-[12px] transition-colors hover:bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() => onSelectHouse(h.id)}
                  className="flex items-center gap-3 text-left min-w-0"
                >
                  <img
                    src={h.thumbnail || '/assets/image01.png'}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-xl bg-[#262626] object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px]">{h.name}</span>
                    <span className="block truncate text-[10px] text-[#8a8a86]">/{h.slug}</span>
                  </span>
                </button>
                <span>{cities.find((c) => c.id === h.cityId)?.name}</span>
                <span>{categories.find((c) => c.id === h.categoryId)?.name}</span>
                <span>{rupiah(h.price)}</span>
                <span>{rooms.filter((r) => r.boardingHouseId === h.id).length}</span>
                <span>{bonuses.filter((b) => b.boardingHouseId === h.id).length}</span>
                <span className="flex justify-end gap-1.5">
                  <button type="button" onClick={() => onSelectHouse(h.id)} className={iconBtn}>
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteHouse(h.id)}
                    className={`${iconBtn} hover:!bg-[#4a1f1c] hover:text-[#ff9a90]`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}