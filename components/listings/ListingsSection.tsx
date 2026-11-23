// 'use client';

// import React, { useState, useEffect } from 'react';
// import SectionHeading from '@/components/sections/SectionHeading';
// import ListingFilters from '@/components/listings/ListingFilters';
// import ListingCard from '@/components/listings/ListingCard';
// import { type Filter, type Listing } from '@/components/listings/data';
// import { categories, cities } from '@/components/admin/boarding-houses/data';
// import * as api from '@/components/admin/boarding-houses/api';

// export default function ListingsSection() {
//   const [filter, setFilter] = useState<Filter>('All');
//   const [saved, setSaved] = useState<Set<string>>(new Set());
//   const [listings, setListings] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Ambil data wishlist dari localStorage saat pertama kali dimuat
//   useEffect(() => {
//     const stored = localStorage.getItem('ngekost_saved_listings');
//     if (stored) {
//       try {
//         setSaved(new Set(JSON.parse(stored)));
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     async function loadListings() {
//       try {
//         const { houses, rooms, bonuses } = await api.fetchAll();

//         const mappedListings: Listing[] = houses.map((house) => {
//           const cat = categories.find((c) => c.id === house.categoryId);
//           const kind = (
//             cat?.name === 'Male' || cat?.name === 'Female' || cat?.name === 'Mixed'
//               ? cat.name
//               : 'Mixed'
//           ) as 'Male' | 'Female' | 'Mixed';

//           const cityObj = cities.find((c) => c.id === house.cityId);
//           const areaName = cityObj ? cityObj.name : 'Serang';

//           const houseRooms = rooms.filter((r) => r.boardingHouseId === house.id);
//           const totalLeft = houseRooms.filter((r) => r.isAvailable).length;
//           const sizeStr = houseRooms.length > 0 ? `${houseRooms[0].squareFeet} m²` : '12 m²';

//           const houseBonuses = bonuses.filter((b) => b.boardingHouseId === house.id);
//           const tags = houseBonuses.map((b) => b.name as any);
//           if (tags.length === 0) tags.push('Wi-Fi');

//           return {
//             slug: house.slug || String(house.id),
//             name: house.name,
//             area: `${house.address || ''}, ${areaName}`.replace(/^,\s*/, ''),
//             type: kind,
//             rating: 4.8,
//             reviews: 100,
//             price: `Rp ${house.price.toLocaleString('id-ID')}`,
//             size: sizeStr,
//             left: totalLeft > 0 ? totalLeft : 1,
//             tags: tags,
//             img: house.thumbnail || '/assets/image01.png',
//           };
//         });

//         setListings(mappedListings);
//       } catch (err) {
//         console.error('Gagal memuat data listings:', err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadListings();
//   }, []);

//   const shown = listings.filter((l) => filter === 'All' || l.type === filter);

//   const toggleSaved = (name: string) => {
//     setSaved((prev) => {
//       const next = new Set(prev);
//       if (next.has(name)) {
//         next.delete(name);
//       } else {
//         next.add(name);
//       }
//       const arr = Array.from(next);
//       localStorage.setItem('ngekost_saved_listings', JSON.stringify(arr));
      
//       // Gunakan setTimeout agar event dijalankan setelah siklus render selesai
//       setTimeout(() => {
//         window.dispatchEvent(new Event('wishlistUpdated'));
//       }, 0);
      
//       return next;
//     });
//   };

//   return (
//     <section id="listings" className="bg-[#121212] px-4 py-20 text-[#ededed] sm:px-8">
//       <div className="mx-auto max-w-[1050px] min-[1400px]:max-w-[1200px]">
//         <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
//           <SectionHeading eyebrow="Featured" title="Listings" />
//           <ListingFilters value={filter} onChange={setFilter} />
//         </div>

//         {!loading && (
//           <p className="mt-6 text-[13px] text-[#9c9c9c]">
//             Showing {shown.length} kosan{filter !== 'All' && ` for ${filter.toLowerCase()}`}
//           </p>
//         )}

//         {loading ? (
//           <div className="flex items-center justify-center py-24">
//             <div
//               className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#ededed]"
//               role="status"
//               aria-label="Loading listings"
//             />
//           </div>
//         ) : shown.length === 0 ? (
//           <div className="py-16 text-center text-[14px] text-[#8a8a86]">
//             Belum ada data kosan yang ditambahkan di dashboard admin.
//           </div>
//         ) : (
//           <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
//             {shown.map((l) => (
//               <ListingCard
//                 key={l.slug}
//                 listing={l}
//                 saved={saved.has(l.name)}
//                 onToggleSaved={toggleSaved}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import SectionHeading from '@/components/sections/SectionHeading';
import ListingFilters from '@/components/listings/ListingFilters';
import ListingCard from '@/components/listings/ListingCard';
import { type Filter, type Listing } from '@/components/listings/data';
import { categories, cities } from '@/components/admin/boarding-houses/data';
import * as api from '@/components/admin/boarding-houses/api';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ListingsSection() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('All');
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [listings, setListings] = useState<(Listing & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function initData() {
      try {
        // Cek user yang sedang login
        const { data: authData } = await supabase.auth.getSession();
        const userId = authData.session?.user?.id || null;
        setCurrentUserId(userId);

        // Ambil data listings dan wishlist secara paralel
        const [{ houses, rooms, bonuses }, userWishlist] = await Promise.all([
          api.fetchAll(),
          userId ? api.fetchUserWishlist(userId) : Promise.resolve([]),
        ]);

        setSavedIds(new Set(userWishlist));

        const mappedListings = houses.map((house) => {
          const cat = categories.find((c) => c.id === house.categoryId);
          const kind = (
            cat?.name === 'Male' || cat?.name === 'Female' || cat?.name === 'Mixed'
              ? cat.name
              : 'Mixed'
          ) as 'Male' | 'Female' | 'Mixed';

          const cityObj = cities.find((c) => c.id === house.cityId);
          const areaName = cityObj ? cityObj.name : 'Serang';

          const houseRooms = rooms.filter((r) => r.boardingHouseId === house.id);
          const totalLeft = houseRooms.filter((r) => r.isAvailable).length;
          const sizeStr = houseRooms.length > 0 ? `${houseRooms[0].squareFeet} m²` : '12 m²';

          const houseBonuses = bonuses.filter((b) => b.boardingHouseId === house.id);
          const tags = houseBonuses.map((b) => b.name as any);
          if (tags.length === 0) tags.push('Wi-Fi');

          return {
            id: house.id,
            slug: house.slug || String(house.id),
            name: house.name,
            area: `${house.address || ''}, ${areaName}`.replace(/^,\s*/, ''),
            type: kind,
            rating: 4.8,
            reviews: 100,
            price: `Rp ${house.price.toLocaleString('id-ID')}`,
            size: sizeStr,
            left: totalLeft > 0 ? totalLeft : 1,
            tags: tags,
            img: house.thumbnail || '/assets/image01.png',
          };
        });

        setListings(mappedListings);
      } catch (err) {
        console.error('Gagal memuat data listings:', err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  const shown = listings.filter((l) => filter === 'All' || l.type === filter);

  // Toggle wishlist ke database Supabase
  const toggleSaved = async (houseName: string) => {
    if (!currentUserId) {
      router.push('/login');
      return;
    }

    const targetItem = listings.find((l) => l.name === houseName);
    if (!targetItem) return;

    const isCurrentlySaved = savedIds.has(targetItem.id);

    // Optimistic UI update
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) next.delete(targetItem.id);
      else next.add(targetItem.id);
      return next;
    });

    try {
      await api.toggleUserWishlist(currentUserId, targetItem.id, isCurrentlySaved);
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      console.error('Gagal memperbarui wishlist:', err);
      // Revert jika gagal
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) next.add(targetItem.id);
        else next.delete(targetItem.id);
        return next;
      });
    }
  };

  return (
    <section id="listings" className="bg-[#121212] px-4 py-20 text-[#ededed] sm:px-8">
      <div className="mx-auto max-w-[1050px] min-[1400px]:max-w-[1200px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Featured" title="Listings" />
          <ListingFilters value={filter} onChange={setFilter} />
        </div>

        {!loading && (
          <p className="mt-6 text-[13px] text-[#9c9c9c]">
            Showing {shown.length} kosan{filter !== 'All' && ` for ${filter.toLowerCase()}`}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#ededed]" />
          </div>
        ) : shown.length === 0 ? (
          <div className="py-16 text-center text-[14px] text-[#8a8a86]">
            Belum ada data kosan yang ditambahkan di dashboard admin.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((l) => (
              <ListingCard
                key={l.slug}
                listing={l}
                saved={savedIds.has(l.id)}
                onToggleSaved={() => toggleSaved(l.name)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}