'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { ChevronDown, Maximize2, Minus, Plus, Search } from 'lucide-react';
import { UNPAM_CENTER, formatPrice } from '@/components/find-kos/data';

export type MapSort = 'nearest' | 'cheapest' | 'rating';

export type DashboardKosItem = {
  id: number;
  slug: string;
  name: string;
  area: string;
  type: 'Male' | 'Female' | 'Mixed';
  price: number;
  lat: number;
  lng: number;
  distance: number; // dalam km dari UNPAM_CENTER
  rating: number;
  size: string;
  left: number; // sisa kamar tersedia
  thumbnail?: string;
};

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ] as string,
  );

/** Pin hitam bulat + titik kecil di bawah. Saat dipilih, label putih muncul di sampingnya. */
function pinIcon(k: DashboardKosItem, active: boolean) {
  const label = active
    ? `<div class="absolute left-full top-0 ml-2 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-left shadow-lg">
         <p class="text-[12px] font-semibold leading-tight text-[#111]">${esc(k.name)}</p>
         <p class="text-[10px] leading-tight text-[#888]">${esc(k.type)} · ${esc(formatPrice(k.price))}</p>
       </div>`
    : '';
  return L.divIcon({
    className: 'kos-marker',
    iconSize: [0, 0],
    html: `
      <div style="position:absolute;left:0;top:0;transform:translate(-50%,-100%)" class="relative flex flex-col items-center">
        <div class="flex ${active ? 'h-10 w-10' : 'h-8 w-8'} items-center justify-center rounded-full bg-[#111] text-white shadow-lg ring-2 ring-white transition-all">
          <svg viewBox="0 0 24 24" width="${active ? 18 : 15}" height="${active ? 18 : 15}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-9h6v9"/></svg>
        </div>
        <span class="mt-1 block h-1.5 w-1.5 rounded-full bg-[#111]"></span>
        ${label}
      </div>`,
  });
}

type Props = {
  items: DashboardKosItem[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  query: string;
  onQuery: (v: string) => void;
  sort: MapSort;
  onSort: (v: MapSort) => void;
};

const round =
  'flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111] shadow-md transition-colors hover:bg-[#f1f1ee]';

export default function DashboardMap({
  items,
  selectedId,
  onSelect,
  query,
  onQuery,
  sort,
  onSort,
}: Props) {
  const [map, setMap] = useState<L.Map | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pas-kan peta ke kampus + semua kosan yang tampil
  useEffect(() => {
    if (!map) return;
    const pts: [number, number][] = [
      UNPAM_CENTER,
      ...items
        .filter((k) => Number.isFinite(k.lat) && Number.isFinite(k.lng))
        .map((k): [number, number] => [k.lat, k.lng]),
    ];
    map.fitBounds(L.latLngBounds(pts), {
      padding: [56, 56],
      maxZoom: 16,
      animate: false,
    });
  }, [map, items]);

  useEffect(() => {
    if (!map) return;
    const onClick = () => onSelect(null);
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, onSelect]);

  useEffect(() => {
    if (!map) return;
    const onFs = () => setTimeout(() => map.invalidateSize(), 150);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, [map]);

  const fullscreen = () =>
    document.fullscreenElement
      ? document.exitFullscreen()
      : wrapRef.current?.requestFullscreen?.();

  return (
    <div
      ref={wrapRef}
      className="relative isolate h-full w-full overflow-hidden rounded-[22px] bg-[#e9e5dc]"
    >
      <MapContainer
        ref={setMap}
        center={UNPAM_CENTER}
        zoom={15}
        minZoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
        style={{ background: '#e9e5dc', fontFamily: 'inherit' }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {items.map((k) => (
          <Marker
            key={k.id}
            position={[k.lat, k.lng]}
            icon={pinIcon(k, k.id === selectedId)}
            zIndexOffset={k.id === selectedId ? 1000 : 0}
            eventHandlers={{ click: () => onSelect(k.id) }}
          />
        ))}
      </MapContainer>

      {/* Pencarian + sort */}
      <div className="absolute left-4 top-4 z-[500] flex max-w-[calc(100%-5rem)] flex-wrap gap-2">
        <label className="flex h-10 w-[200px] items-center gap-2 rounded-full bg-white px-4 text-[12px] shadow-md">
          <Search className="h-3.5 w-3.5 shrink-0 text-[#111]" />
          <span className="sr-only">Search kos</span>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search kos or area"
            className="w-full bg-transparent text-[#111] outline-none placeholder:text-[#888]"
          />
        </label>
        <label className="relative flex h-10 items-center gap-1.5 rounded-full bg-white pl-4 pr-8 text-[12px] shadow-md">
          <span className="text-[#888]">Sort by</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as MapSort)}
            className="cursor-pointer appearance-none bg-transparent font-medium text-[#111] outline-none"
          >
            <option value="nearest">Nearest</option>
            <option value="cheapest">Cheapest</option>
            <option value="rating">Top rated</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-[#111]" />
        </label>
      </div>

      {/* Layar penuh */}
      <button
        type="button"
        onClick={fullscreen}
        aria-label="Toggle fullscreen"
        className={`${round} absolute right-4 top-4 z-[500]`}
      >
        <Maximize2 className="h-4 w-4" />
      </button>

      {/* Zoom */}
      <div className="absolute bottom-4 right-4 z-[500] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => map?.zoomIn()}
          aria-label="Zoom in"
          className={round}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => map?.zoomOut()}
          aria-label="Zoom out"
          className={round}
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}