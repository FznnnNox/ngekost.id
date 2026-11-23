// 'use client';

// import React from 'react';

// export type Tab = 'info' | 'bonuses' | 'rooms';

// interface TabNavigationProps {
//   activeTab: Tab;
//   onChangeTab: (tab: Tab) => void;
//   bonusCount: number;
//   roomCount: number;
// }

// export function TabNavigation({
//   activeTab,
//   onChangeTab,
//   bonusCount,
//   roomCount,
// }: TabNavigationProps) {
//   return (
//     <div className="mb-6 flex border-b border-white/10 overflow-x-auto no-scrollbar" role="tablist">
//       <div className="flex min-w-max pb-1">
//         <button
//           type="button"
//           onClick={() => onChangeTab('info')}
//           className={`pb-3 pr-5 text-[13px] sm:text-[14px] font-medium transition-colors border-b-2 whitespace-nowrap ${
//             activeTab === 'info'
//               ? 'border-[#e8e2b8] text-[#e8e2b8]'
//               : 'border-transparent text-[#8a8a86] hover:text-white'
//           }`}
//         >
//           General Information
//         </button>
//         <button
//           type="button"
//           onClick={() => onChangeTab('bonuses')}
//           className={`pb-3 px-5 text-[13px] sm:text-[14px] font-medium transition-colors border-b-2 whitespace-nowrap ${
//             activeTab === 'bonuses'
//               ? 'border-[#e8e2b8] text-[#e8e2b8]'
//               : 'border-transparent text-[#8a8a86] hover:text-white'
//           }`}
//         >
//           Bonuses {bonusCount > 0 && `(${bonusCount})`}
//         </button>
//         <button
//           type="button"
//           onClick={() => onChangeTab('rooms')}
//           className={`pb-3 px-5 text-[13px] sm:text-[14px] font-medium transition-colors border-b-2 whitespace-nowrap ${
//             activeTab === 'rooms'
//               ? 'border-[#e8e2b8] text-[#e8e2b8]'
//               : 'border-transparent text-[#8a8a86] hover:text-white'
//           }`}
//         >
//           Room {roomCount > 0 && `(${roomCount})`}
//         </button>
//       </div>
//     </div>
//   );
// }
'use client';

import React from 'react';

export type Tab = 'info' | 'bonuses' | 'rooms';

interface TabNavigationProps {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
  bonusCount: number;
  roomCount: number;
  disabledTabs?: Tab[];
}

export function TabNavigation({
  activeTab,
  onChangeTab,
  bonusCount,
  roomCount,
  disabledTabs = [],
}: TabNavigationProps) {
  const items: { key: Tab; label: string }[] = [
    { key: 'info', label: 'General Information' },
    { key: 'bonuses', label: `Bonuses${bonusCount > 0 ? ` (${bonusCount})` : ''}` },
    { key: 'rooms', label: `Room${roomCount > 0 ? ` (${roomCount})` : ''}` },
  ];

  return (
    <div className="mb-6 flex border-b border-white/10 overflow-x-auto no-scrollbar" role="tablist">
      <div className="flex min-w-max pb-1">
        {items.map(({ key, label }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={disabledTabs.includes(key)}
              onClick={() => onChangeTab(key)}
              className={`pb-3 px-5 first:pl-0 text-[13px] sm:text-[14px] font-medium transition-colors border-b-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? 'border-[#e8e2b8] text-[#e8e2b8]'
                  : 'border-transparent text-[#8a8a86] hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}