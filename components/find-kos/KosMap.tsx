'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { AttributionControl, Circle, MapContainer, Marker, TileLayer } from 'react-leaflet';
import MapControls from '@/components/find-kos/MapControls';
import { UNPAM_CENTER, UNPAM_NAME, ZONE_RADIUS, formatPrice, type Kos } from '@/components/find-kos/data';

const ACCENT = '#0f7b62';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

type PinSize = 'compact' | 'medium' | 'full';

const sizeFromZoom = (zoom: number): PinSize => (zoom >= 16 ? 'full' : zoom >= 15 ? 'medium' : 'compact');

/** Chip harga (+ foto bulat). Titik koordinat = dasar pin. */
function priceIcon(k: Kos, active: boolean, zoomSize: PinSize) {
  const size: PinSize = active ? 'full' : zoomSize;
  const chip = active ? 'bg-[#0f7b62] text-white' : 'bg-white text-[#111]';
  const tip = active ? 'bg-[#0f7b62]' : 'bg-white';

  const chipSize =
    size === 'compact'
      ? 'rounded-lg px-2 py-1 text-[11px]'
      : size === 'medium'
        ? 'rounded-xl px-2.5 py-1.5 text-[12px]'
        : 'rounded-xl px-3 py-1.5 text-[14px]';

  const photoSize = size === 'medium' ? 'h-8 w-8' : 'h-10 w-10';

  const photo =
    size === 'compact'
      ? ''
      : `<div class="mt-1 ${photoSize} overflow-hidden rounded-full shadow-lg ring-2 ${active ? 'ring-[#0f7b62]' : 'ring-white'}">
          <img src="${esc(k.img)}" alt="" class="h-full w-full object-cover" />
        </div>`;

  return L.divIcon({
    className: 'kos-marker',
    iconSize: [0, 0],
    html: `
      <div style="position:absolute;left:0;top:0;transform:translate(-50%,-100%)" class="flex flex-col items-center ${active ? 'scale-110' : ''}">
        <div class="whitespace-nowrap font-semibold shadow-lg ${chipSize} ${chip}">${esc(formatPrice(k.price))}</div>
        <span class="-mt-1 block h-2 w-2 rotate-45 ${tip}"></span>
        ${photo}
      </div>`,
  });
}

/** Penanda kampus di pusat zona */
const campusIcon = L.divIcon({
  className: 'kos-marker',
  iconSize: [0, 0],
  html: `
    <div style="position:absolute;left:0;top:0;transform:translate(-50%,-50%)" class="flex flex-col items-center">
      <div class="flex h-11 w-11 items-center justify-center rounded-full bg-[#111] text-white shadow-xl ring-4 ring-white">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      </div>
      <span class="mt-1.5 whitespace-nowrap rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium text-white shadow-lg">${esc(UNPAM_NAME)}</span>
    </div>`,
});

type Props = {
  items: Kos[];
  selectedId: number | null;
  hoveredId: number | null;
  onSelect: (id: number) => void;
};

export default function KosMap({ items, selectedId, hoveredId, onSelect }: Props) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [zoneOn, setZoneOn] = useState(true);
  const [zoom, setZoom] = useState(13);
  const wrapRef = useRef<HTMLDivElement>(null);
  const prevSelected = useRef<number | null>(selectedId);
  const selectedRef = useRef<number | null>(selectedId);
  selectedRef.current = selectedId;

  const zoneBounds = useMemo(() => L.latLng(UNPAM_CENTER).toBounds(ZONE_RADIUS * 2), []);
  const zoomSize = sizeFromZoom(zoom);

  const icons = useMemo(
    () =>
      Object.fromEntries(
        items.map((k) => [k.id, priceIcon(k, k.id === selectedId || k.id === hoveredId, zoomSize)]),
      ),
    [items, selectedId, hoveredId, zoomSize],
  );

  // Ikuti level zoom supaya ukuran pin menyesuaikan
  useEffect(() => {
    if (!map) return;
    const onZoom = () => setZoom(map.getZoom());
    onZoom();
    map.on('zoomend', onZoom);
    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map]);

  // Pas-kan tampilan ke kampus + semua kosan yang tampil (tanpa ruang kosong berlebih)
  const fitToItems = (instant = false) => {
    if (!map) return;
    const points: [number, number][] = [UNPAM_CENTER, ...items.map((k): [number, number] => [k.lat, k.lng])];
    map.fitBounds(L.latLngBounds(points), { paddingTopLeft: [56, 64], paddingBottomRight: [56, 40], maxZoom: 16, animate: !instant });
  };

  // Saat filter berubah, zoom ulang supaya pin tersebar rapi (dilewati jika ada kosan terpilih)
  useEffect(() => {
    if (selectedRef.current === null) fitToItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, items]);

  // Terbang ke kosan yang dipilih
  useEffect(() => {
    if (!map || selectedId === null || prevSelected.current === selectedId) return;
    prevSelected.current = selectedId;
    const k = items.find((i) => i.id === selectedId);
    if (k) map.flyTo([k.lat, k.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
  }, [map, selectedId, items]);

  // Scroll-zoom hanya aktif setelah peta diklik (agar scroll halaman/Lenis tidak terganggu)
  useEffect(() => {
    if (!map) return;
    const el = map.getContainer();
    const onFocus = () => {
      map.scrollWheelZoom.enable();
      el.setAttribute('data-lenis-prevent-wheel', '');
    };
    const onBlur = () => {
      map.scrollWheelZoom.disable();
      el.removeAttribute('data-lenis-prevent-wheel');
    };
    map.on('focus', onFocus);
    map.on('blur', onBlur);
    return () => {
      map.off('focus', onFocus);
      map.off('blur', onBlur);
    };
  }, [map]);

  // Ukuran peta perlu dihitung ulang saat masuk/keluar layar penuh
  useEffect(() => {
    if (!map) return;
    const onChange = () => setTimeout(() => map.invalidateSize(), 150);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [map]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  };

  return (
    <div ref={wrapRef} className="relative isolate h-full w-full overflow-hidden rounded-[28px] bg-[#eceae6]">
      <MapContainer
        ref={setMap}
        bounds={zoneBounds}
        boundsOptions={{ padding: [24, 24] }}
        minZoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
        style={{ background: '#eceae6', fontFamily: 'inherit' }}
      >
        {/* OpenStreetMap dibuat abu terang agar pin & zona lebih menonjol */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          className="[filter:grayscale(1)_contrast(0.9)_brightness(1.08)]"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <AttributionControl position="bottomleft" prefix={false} />

        {zoneOn && (
          <Circle
            center={UNPAM_CENTER}
            radius={ZONE_RADIUS}
            pathOptions={{ color: ACCENT, weight: 2.5, fillColor: '#5eead4', fillOpacity: 0.12, interactive: false }}
          />
        )}

        <Marker position={UNPAM_CENTER} icon={campusIcon} interactive={false} keyboard={false} zIndexOffset={2000} />

        {items.map((k) => (
          <Marker
            key={k.id}
            position={[k.lat, k.lng]}
            icon={icons[k.id]}
            title={`${k.name} - ${formatPrice(k.price)}/month`}
            zIndexOffset={k.id === selectedId ? 1000 : k.id === hoveredId ? 500 : 0}
            eventHandlers={{ click: () => onSelect(k.id) }}
          />
        ))}
      </MapContainer>

      <MapControls
        zoneOn={zoneOn}
        onFullscreen={toggleFullscreen}
        onToggleZone={() => setZoneOn((v) => !v)}
        onZoomIn={() => map?.zoomIn()}
        onZoomOut={() => map?.zoomOut()}
        onRecenter={() => fitToItems()}
      />
    </div>
  );
}