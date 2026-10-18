import React from 'react';
import LocationMap from '@/components/listing-detail/LocationMap';
import type { NearbyItem } from '@/components/listing-detail/data';

type Props = {
  name: string;
  address: string;
  landmark: string;
  lat: number;
  lng: number;
  nearby: NearbyItem[];
};

export default function LocationSection({ name, address, landmark, lat, lng, nearby }: Props) {
  return (
    <div>
      <div className="space-y-2 text-[14px] leading-relaxed text-[#9c9c9c]">
        <p>
          <span className="font-semibold text-white">Address: </span>
          {address}
        </p>
        <p>
          <span className="font-semibold text-white">Landmark: </span>
          {landmark}
        </p>
      </div>

      <div className="mt-5">
        <LocationMap name={name} lat={lat} lng={lng} />
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-3">
        {nearby.map(({ name: place, distance, icon: Icon }) => (
          <li
            key={place}
            className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#1a1a1a] p-3 text-[#cfcfcf]"
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-[#ededed]" />
              {place}
            </span>
            <span className="text-[12px] text-[#9c9c9c]">{distance}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}