// 'use client';

// import dynamic from 'next/dynamic';

// const MapView = dynamic(() => import('./MapView'), {
//   ssr: false,
//   loading: () => (
//     <div className="flex h-[500px] w-full items-center justify-center rounded-xl bg-gray-100">
//       Memuat peta...
//     </div>
//   ),
// });

// export default MapView;
'use client';

import dynamic from 'next/dynamic';

const MapViewDynamic = dynamic(() => import('@/components/map-view/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#eceae6] text-[13px] text-[#777]">
      Loading map…
    </div>
  ),
});

export default MapViewDynamic;