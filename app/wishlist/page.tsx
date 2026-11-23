'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import { type Listing } from '@/components/listings/data';
import * as api from '@/components/admin/boarding-houses/api';
import { categories, cities } from '@/components/admin/boarding-houses/data';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [listings, setListings] = useState<(Listing & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadWishlistPage() {
      try {
        const { data: authData } = await supabase.auth.getSession();
        const userId = authData.session?.user?.id || null;
        
        if (!userId) {
          router.push('/login');
          return;
        }
        setCurrentUserId(userId);

        const [{ houses, rooms, bonuses }, userWishlistIds] = await Promise.all([
          api.fetchAll(),
          api.fetchUserWishlist(userId),
        ]);

        setSavedIds(new Set(userWishlistIds));

        const mapped: (Listing & { id: number })[] = houses.map((house) => {
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

        setListings(mapped);
      } catch (err) {
        console.error('Gagal memuat wishlist:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistPage();
  }, [router]);

  const toggleSaved = async (houseName: string) => {
    if (!currentUserId) return;
    const targetItem = listings.find((l) => l.name === houseName);
    if (!targetItem) return;

    const isCurrentlySaved = savedIds.has(targetItem.id);

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
      console.error('Gagal menghapus wishlist:', err);
    }
  };

  const savedListings = listings.filter((l) => savedIds.has(l.id));

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-12 text-[#ededed] sm:px-8">
      <div className="mx-auto max-w-[1050px] min-[1400px]:max-w-[1200px]">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/#listings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1c] border border-white/10 text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[24px] font-medium tracking-tight">My Wishlist</h1>
            <p className="text-[13px] text-[#8a8a86]">
              {savedListings.length} kosan disimpan ke daftar favorit
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#ededed]" />
          </div>
        ) : savedListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-white/10 bg-[#1c1c1c] py-20 text-center px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-[#8a8a86] mb-4">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-[16px] font-medium text-white">Belum ada wishlist</h3>
            <p className="mt-1 text-[13px] text-[#8a8a86] max-w-sm">
              Kamu belum menyimpan kosan apa pun. Klik ikon hati pada kartu kosan untuk menyimpannya ke sini.
            </p>
            <Link
              href="/#listings"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#ededed] px-6 text-[13px] font-medium text-[#111] transition-colors hover:bg-white"
            >
              Visited Kosan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {savedListings.map((l) => (
              <ListingCard
                key={l.slug}
                listing={l}
                saved={true}
                onToggleSaved={() => toggleSaved(l.name)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}