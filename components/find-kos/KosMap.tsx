'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  AttributionControl,
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';
import MapControls from '@/components/find-kos/MapControls';
import {
  UNPAM_ADDRESS,
  UNPAM_MAPS_URL,
  UNPAM_NAME,
  ZONE_RADIUS,
  formatDistance,
  formatPrice,
  type Kos,
} from '@/components/find-kos/data';

const ACCENT = '#0f7b62';

// Titik koordinat resmi Universitas Pamulang (UNPAM) Kampus Serang
const UNPAM_COORDS: [number, number] = [
  -6.121254714844191,
  106.20603540755263,
];

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ] as string,
  );

type PinSize = 'compact' | 'medium' | 'full';

const sizeFromZoom = (zoom: number): PinSize =>
  zoom >= 16 ? 'full' : zoom >= 15 ? 'medium' : 'compact';

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

/** Label jarak di titik tengah garis penghubung kampus -> kosan */
function distanceBadgeIcon(distanceMetersValue: number) {
  const label = `${formatDistance(distanceMetersValue)} dari kampus`;
  return L.divIcon({
    className: 'kos-distance-badge',
    iconSize: [0, 0],
    html: `
      <div style="position:absolute;left:0;top:0;transform:translate(-50%,-50%)" class="pointer-events-none">
        <span class="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#111] px-3 py-1 text-[11px] font-semibold text-white shadow-lg ring-2 ring-white">
          ${esc(label)}
        </span>
      </div>`,
  });
}

/** Penanda kampus di pusat zona */
const campusIcon = L.divIcon({
  className: 'kos-marker',
  iconSize: [0, 0],
  html: `
    <div style="position:absolute;left:0;top:0;transform:translate(-50%,-50%)" class="flex cursor-pointer flex-col items-center transition-transform hover:scale-105">
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
  const [zoom, setZoom] = useState(14);
  const wrapRef = useRef<HTMLDivElement>(null);
  const prevSelected = useRef<number | null>(selectedId);
  const selectedRef = useRef<number | null>(selectedId);
  selectedRef.current = selectedId;

  const zoneBounds = useMemo(
    () => L.latLng(UNPAM_COORDS).toBounds(ZONE_RADIUS * 2),
    [],
  );
  const zoomSize = sizeFromZoom(zoom);

  const selectedKos = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId],
  );

  const midPoint = useMemo<[number, number] | null>(() => {
    if (!selectedKos) return null;
    return [
      (UNPAM_COORDS[0] + selectedKos.lat) / 2,
      (UNPAM_COORDS[1] + selectedKos.lng) / 2,
    ];
  }, [selectedKos]);

  const icons = useMemo(
    () =>
      Object.fromEntries(
        items.map((k) => [
          k.id,
          priceIcon(k, k.id === selectedId || k.id === hoveredId, zoomSize),
        ]),
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

  // Pas-kan tampilan ke kampus + semua kosan yang tampil
  const fitToItems = (instant = false) => {
    if (!map) return;
    const points: [number, number][] = [
      UNPAM_COORDS,
      ...items.map((k): [number, number] => [k.lat, k.lng]),
    ];
    map.fitBounds(L.latLngBounds(points), {
      paddingTopLeft: [56, 64],
      paddingBottomRight: [56, 40],
      maxZoom: 16,
      animate: !instant,
    });
  };

  // Saat filter berubah, zoom ulang supaya pin tersebar rapi
  useEffect(() => {
    if (selectedRef.current === null) fitToItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, items]);

  // Saat kosan dipilih, bingkai kampus + kosan terpilih agar garis jarak terlihat penuh
  useEffect(() => {
    if (!map || selectedId === null || prevSelected.current === selectedId) return;
    prevSelected.current = selectedId;
    const k = items.find((i) => i.id === selectedId);
    if (k) {
      const pairBounds = L.latLngBounds([UNPAM_COORDS, [k.lat, k.lng]]);
      map.fitBounds(pairBounds, {
        paddingTopLeft: [70, 80],
        paddingBottomRight: [70, 60],
        maxZoom: 16,
        animate: true,
      });
    }
  }, [map, selectedId, items]);

  // Scroll-zoom hanya aktif setelah peta diklik
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

  // Hitung ulang ukuran peta saat masuk/keluar fullscreen
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

  const directionsUrl = selectedKos
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        `${UNPAM_COORDS[0]},${UNPAM_COORDS[1]}`,
      )}&destination=${encodeURIComponent(
        `${selectedKos.lat},${selectedKos.lng}`,
      )}&travelmode=driving`
    : null;

  return (
    <div
      ref={wrapRef}
      className="relative isolate h-full w-full overflow-hidden rounded-[28px] bg-[#eceae6]"
    >
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
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          className="[filter:grayscale(1)_contrast(0.9)_brightness(1.08)]"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <AttributionControl position="bottomleft" prefix={false} />

        {zoneOn && (
          <Circle
            center={UNPAM_COORDS}
            radius={ZONE_RADIUS}
            pathOptions={{
              color: ACCENT,
              weight: 2.5,
              fillColor: '#5eead4',
              fillOpacity: 0.12,
              interactive: false,
            }}
          />
        )}

        {/* Garis jarak dari kampus ke kosan yang diklik */}
        {selectedKos && midPoint && (
          <>
            <Polyline
              positions={[UNPAM_COORDS, [selectedKos.lat, selectedKos.lng]]}
              pathOptions={{
                color: ACCENT,
                weight: 3.5,
                dashArray: '8 8',
                opacity: 0.95,
              }}
            />
            <Marker
              position={midPoint}
              icon={distanceBadgeIcon(selectedKos.distance)}
              interactive={false}
              keyboard={false}
              zIndexOffset={1500}
            />
          </>
        )}

        {/* Marker Universitas Pamulang Serang (bisa diklik -> lihat di Google Maps) */}
        <Marker
          position={UNPAM_COORDS}
          icon={campusIcon}
          title={UNPAM_NAME}
          zIndexOffset={2000}
        >
          <Popup closeButton={true} offset={[0, -24]}>
            <div className="min-w-[200px] space-y-2 p-0.5 font-sans text-[#111]">
              <div>
                <p className="text-[13px] font-semibold leading-snug">
                  {UNPAM_NAME}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#666]">
                  {UNPAM_ADDRESS}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <a
                  href={UNPAM_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-[#111] px-3 py-1.5 text-[11px] font-medium !text-white transition-opacity hover:opacity-90"
                >
                  Lihat di Google Maps ↗
                </a>
                {directionsUrl && selectedKos && (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-black/15 bg-white px-3 py-1.5 text-[11px] font-medium !text-[#111] transition-colors hover:bg-[#f3f3f1]"
                  >
                    Rute ke {selectedKos.name} ↗
                  </a>
                )}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Marker Kosan */}
        {items.map((k) => (
          <Marker
            key={k.id}
            position={[k.lat, k.lng]}
            icon={icons[k.id]}
            title={`${k.name} - ${formatPrice(k.price)}/month`}
            zIndexOffset={
              k.id === selectedId ? 1000 : k.id === hoveredId ? 500 : 0
            }
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