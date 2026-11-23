import { supabase } from '@/lib/supabase';

export type KostType = 'Male' | 'Female' | 'Mixed';

export type KostMarker = {
  id: number;
  slug: string;
  name: string;
  address: string;
  price: number; // per bulan (Rupiah)
  lat: number;
  lng: number;
  type: KostType;
  rating: number;
  reviews: number;
  tags: string[];
  description: string;
  img?: string;
};

// Titik tengah peta (Kota Serang)
export const SERANG_CENTER: [number, number] = [-6.1201, 106.1503];

// Batas gerak peta supaya tetap di wilayah Serang
export const SERANG_BOUNDS: [[number, number], [number, number]] = [
  [-6.3, 105.95],
  [-5.95, 106.35],
];

/** 650000 -> "Rp 650K", 1200000 -> "Rp 1.2M" */
export function formatPrice(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  return `Rp ${Math.round(n / 1000)}K`;
}

function mapCategoryToKostType(categoryId: number | null): KostType {
  if (categoryId === 1) return 'Male';
  if (categoryId === 2) return 'Female';
  return 'Mixed';
}

function stripHtml(html: string | null): string {
  if (!html) return 'Kos nyaman di area strategis Serang.';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function fetchDynamicKostMarkers(): Promise<KostMarker[]> {
  const [housesRes, bonusesRes, reviewsRes] = await Promise.all([
    supabase.from('boarding_houses').select('*').order('created_at', { ascending: false }),
    supabase.from('bonuses').select('boarding_house_id, name'),
    supabase.from('testimonials').select('boarding_house_id, rating'),
  ]);

  if (housesRes.error) {
    console.error('Gagal memuat data kosan untuk peta:', housesRes.error);
    return [];
  }

  const bonusMap = new Map<number, string[]>();
  for (const b of bonusesRes.data || []) {
    const list = bonusMap.get(Number(b.boarding_house_id)) || [];
    if (b.name && !list.includes(b.name)) list.push(b.name);
    bonusMap.set(Number(b.boarding_house_id), list);
  }

  const reviewMap = new Map<number, { sum: number; count: number }>();
  for (const r of reviewsRes.data || []) {
    const id = Number(r.boarding_house_id);
    const current = reviewMap.get(id) || { sum: 0, count: 0 };
    current.sum += Number(r.rating || 0);
    current.count += 1;
    reviewMap.set(id, current);
  }

  return (housesRes.data || [])
    .filter((row: any) => row.latitude !== null && row.longitude !== null)
    .map((row: any) => {
      const id = Number(row.id);
      const rev = reviewMap.get(id);
      const avgRating = rev && rev.count > 0 ? Number((rev.sum / rev.count).toFixed(1)) : 0;
      const tags = bonusMap.get(id) || [];

      return {
        id,
        slug: row.slug || String(id),
        name: row.name,
        address: row.address || 'Serang, Banten',
        price: Number(row.price || 0),
        lat: Number(row.latitude),
        lng: Number(row.longitude),
        type: mapCategoryToKostType(row.category_id),
        rating: avgRating,
        reviews: rev?.count || 0,
        tags: tags.slice(0, 4),
        description: stripHtml(row.description),
        img: row.thumbnail || '/assets/image01.png',
      };
    });
}