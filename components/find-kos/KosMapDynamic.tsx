'use client';

import dynamic from 'next/dynamic';

// Leaflet butuh `window`, jadi hanya dirender di browser
const KosMapDynamic = dynamic(() => import('@/components/find-kos/KosMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-[#eceae6] text-[13px] text-[#777]">
      Loading map…
    </div>
  ),
});

export default KosMapDynamic;