// 'use client';

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix icon marker bawaan Leaflet yang sering hilang di Next.js
// const customIcon = L.icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// interface LocationPickerMapProps {
//   latitude: number;
//   longitude: number;
//   onLocationChange: (lat: number, lng: number) => void;
// }

// function LocationMarker({ latitude, longitude, onLocationChange }: LocationPickerMapProps) {
//   useMapEvents({
//     click(e) {
//       onLocationChange(e.latlng.lat, e.latlng.lng);
//     },
//   });

//   return latitude && longitude ? (
//     <Marker position={[latitude, longitude]} icon={customIcon} />
//   ) : null;
// }

// export default function LocationPickerMap({ latitude, longitude, onLocationChange }: LocationPickerMapProps) {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return <div className="h-64 w-full rounded-2xl bg-[#262626] animate-pulse flex items-center justify-center text-[12px] text-[#8a8a86]">Memuat Peta...</div>;
//   }

//   // Default titik tengah di sekitar Serang, Banten jika koordinat belum diatur
//   const centerLat = latitude || -6.1154;
//   const centerLng = longitude || 106.1503;

//   return (
//     <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10 z-0">
//       <MapContainer
//         center={[centerLat, centerLng]}
//         zoom={14}
//         scrollWheelZoom={false}
//         style={{ height: '100%', width: '100%', background: '#1c1c1c' }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <LocationMarker latitude={latitude} longitude={longitude} onLocationChange={onLocationChange} />
//       </MapContainer>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function LocationMarker({ latitude, longitude, onLocationChange }: LocationPickerMapProps) {
  useMapEvents({
    click(e) {
      onLocationChange(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });

  return latitude && longitude ? (
    <Marker position={[latitude, longitude]} icon={customIcon} />
  ) : null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-2xl bg-[#262626] text-[12px] text-[#8a8a86]">
        Memuat Peta...
      </div>
    );
  }

  const centerLat = latitude || -6.1154;
  const centerLng = longitude || 106.1503;

  return (
    <div className="relative z-0 h-64 w-full overflow-hidden rounded-2xl border border-white/10">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#1c1c1c' }}
      >
        <ChangeView center={[centerLat, centerLng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          latitude={latitude}
          longitude={longitude}
          onLocationChange={onLocationChange}
        />
      </MapContainer>
    </div>
  );
}