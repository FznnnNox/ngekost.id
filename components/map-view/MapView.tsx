// 'use client';

// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { kostMarkers, SERANG_CENTER } from './data';

// // Perbaikan icon marker default Leaflet yang sering hilang di Next.js
// const markerIcon = L.icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// export default function MapView() {
//   return (
//     <MapContainer
//       center={SERANG_CENTER}
//       zoom={13}
//       scrollWheelZoom={false}
//       style={{ height: '500px', width: '100%', borderRadius: '12px' }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {kostMarkers.map((kost) => (
//         <Marker key={kost.id} position={[kost.lat, kost.lng]} icon={markerIcon}>
//           <Popup>
//             <strong>{kost.name}</strong>
//             <br />
//             {kost.address}
//             <br />
//             Rp {kost.price.toLocaleString('id-ID')} / bulan
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }
'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { AttributionControl, MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import {
  SERANG_BOUNDS,
  SERANG_CENTER,
  formatPrice,
  type KostMarker,
  type KostType,
} from '@/components/map-view/data';

const ACTIVE = '#111111'; 
const typeColor: Record<KostType, string> = {
  Female: '#ff7eb6',
  Male: '#5b8cff',
  Mixed: '#9b7bff',
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

function makeIcon(k: KostMarker, active: boolean) {
  const ring = active ? ACTIVE : typeColor[k.type];
  const chip = active ? 'bg-[#111] text-white' : 'bg-white text-[#111] ring-1 ring-black/10';
  const sub = active ? 'text-white/60' : 'text-[#777]';

  return L.divIcon({
    className: 'kos-marker',
    iconSize: [0, 0],
    html: `
      <div style="position:absolute;left:0;top:0;transform:translate(-50%,-20px)" class="flex flex-col items-center ${active ? 'scale-110' : ''}">
        <div style="box-shadow:0 0 0 ${active ? 4 : 3}px ${ring}" class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111] shadow-lg">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>
        </div>
        <div class="mt-2 whitespace-nowrap rounded-xl px-2.5 py-1 text-center shadow-lg ${chip}">
          <div class="text-[10px] leading-none ${sub}">${escapeHtml(k.name)}</div>
          <div class="mt-1 text-[11px] font-semibold leading-none">${escapeHtml(formatPrice(k.price))}</div>
        </div>
      </div>`,
  });
}

/** Sesuaikan zoom agar semua pin yang tampil terlihat (saat filter/pencarian berubah). */
function FitToItems({ items }: { items: KostMarker[] }) {
  const map = useMap();
  const key = items.map((i) => i.id).join(',');

  useEffect(() => {
    if (items.length === 0) return;
    const bounds = L.latLngBounds(items.map((i) => [i.lat, i.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [90, 90], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);

  return null;
}

/** Terbang ke kosan yang dipilih (dilewati saat pertama tampil). */
function FlyToSelected({ item }: { item?: KostMarker }) {
  const map = useMap();
  const prevId = useRef<number | undefined>(item?.id);

  useEffect(() => {
    if (!item || prevId.current === item.id) return;
    prevId.current = item.id;
    map.flyTo([item.lat, item.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [map, item]);

  return null;
}

/** Scroll-zoom hanya aktif setelah peta diklik, supaya scroll halaman tidak terganggu. */
function CooperativeScroll() {
  const map = useMapEvents({
    focus: () => map.scrollWheelZoom.enable(),
    blur: () => map.scrollWheelZoom.disable(),
  });
  return null;
}

type Props = {
  items: KostMarker[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function MapView({ items, selectedId, onSelect }: Props) {
  const selected = items.find((i) => i.id === selectedId);

  const icons = useMemo(
    () => Object.fromEntries(items.map((k) => [k.id, makeIcon(k, k.id === selectedId)])),
    [items, selectedId],
  );

  return (
    <MapContainer
      center={SERANG_CENTER}
      zoom={13}
      minZoom={11}
      maxBounds={SERANG_BOUNDS}
      maxBoundsViscosity={0.8}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      className="h-full w-full"
      style={{ background: '#eceae6', fontFamily: 'inherit' }}
    >
      {/* Tile OpenStreetMap, sedikit dipucatkan agar terasa bersih dan modern */}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        className="[filter:saturate(0.7)_contrast(0.95)_brightness(1.03)]"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="topright" />
      <AttributionControl position="bottomright" prefix={false} />
      <CooperativeScroll />
      <FitToItems items={items} />
      <FlyToSelected item={selected} />

      {items.map((k) => (
        <Marker
          key={k.id}
          position={[k.lat, k.lng]}
          icon={icons[k.id]}
          zIndexOffset={k.id === selectedId ? 1000 : 0}
          title={`${k.name} - ${formatPrice(k.price)}/month`}
          eventHandlers={{ click: () => onSelect(k.id) }}
        />
      ))}
    </MapContainer>
  );
}