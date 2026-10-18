'use client';

import 'leaflet/dist/leaflet.css';
import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

// Pin biru berbentuk tetesan (ujung bawah = koordinat)
const pinIcon = L.divIcon({
  className: 'kos-pin',
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -50],
  html: `
    <svg width="40" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.35))">
      <path d="M20 1C9.5 1 1 9.5 1 20c0 14 19 31 19 31s19-17 19-31C39 9.5 30.5 1 20 1z" fill="#1457fe" stroke="#fff" stroke-width="2"/>
      <circle cx="20" cy="20" r="9" fill="#fff"/>
      <circle cx="20" cy="20" r="4" fill="#1457fe"/>
    </svg>`,
});

/** Scroll-zoom hanya aktif setelah peta diklik, supaya scroll halaman (Lenis) tidak terganggu. */
function CooperativeScroll() {
  const map = useMapEvents({
    focus: () => {
      map.scrollWheelZoom.enable();
      map.getContainer().setAttribute('data-lenis-prevent-wheel', '');
    },
    blur: () => {
      map.scrollWheelZoom.disable();
      map.getContainer().removeAttribute('data-lenis-prevent-wheel');
    },
  });
  return null;
}

type Props = {
  name: string;
  lat: number;
  lng: number;
};

export default function LocationMapView({ name, lat, lng }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      minZoom={5}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: '#eceae6', fontFamily: 'inherit' }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CooperativeScroll />

      <Marker
        position={[lat, lng]}
        icon={pinIcon}
        title={name}
        // Popup nama kosan langsung terbuka saat peta dimuat
        eventHandlers={{ add: (e) => e.target.openPopup() }}
      >
        <Popup
          autoClose={false}
          closeOnClick={false}
          closeButton={false}
          minWidth={170}
          maxWidth={240}
          className="[&_.leaflet-popup-content-wrapper]:!rounded-xl [&_.leaflet-popup-content-wrapper]:!bg-white [&_.leaflet-popup-content-wrapper]:!shadow-lg [&_.leaflet-popup-content]:!m-3.5"
        >
          <div className="text-center text-[15px] font-semibold leading-snug text-[#111]">{name}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}