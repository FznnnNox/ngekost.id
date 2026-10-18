'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const LocationMapView = dynamic(() => import('@/components/listing-detail/LocationMapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#eceae6] text-[13px] text-[#777]">
      Loading map…
    </div>
  ),
});

type Props = { name: string; lat: number; lng: number };

export default function LocationMap({ name, lat, lng }: Props) {
  return (
    <div className="isolate h-[420px] overflow-hidden rounded-[20px] ring-1 ring-white/10 sm:h-[500px]">
      <LocationMapView name={name} lat={lat} lng={lng} />
    </div>
  );
}