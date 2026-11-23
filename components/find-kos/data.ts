import { supabase } from '@/lib/supabase';

export type KosType = 'Male' | 'Female' | 'Mixed';

export type Kos = {
  id: number;
  slug: string;
  name: string;
  area: string;
  type: KosType;
  price: number;
  size: string;
  left: number;
  rating: number;
  reviews: number;
  img: string;
  lat: number;
  lng: number;
  distance: number;
};

// Koordinat asli Universitas Pamulang Serang (Jl. Pantura No.6, Kalodran, Walantaka)
export const UNPAM_CENTER: [number, number] = [-6.1224969, 106.203183];
export const UNPAM_NAME = 'Universitas Pamulang Serang';
export const UNPAM_ADDRESS = 'Jl. Pantura No.6, Kalodran, Kec. Walantaka, Kota Serang';
export const UNPAM_MAPS_URL =
  'https://www.google.com/maps/place/Universitas+Pamulang+Serang/@-6.1224969,106.203183,17z';

/** Radius zona (meter) yang digambar di peta */
export const ZONE_RADIUS = 1500;

const M_PER_DEG = 111_320;

const at = (north: number, east: number): [number, number] => [
  UNPAM_CENTER[0] + north / M_PER_DEG,
  UNPAM_CENTER[1] + east / (M_PER_DEG * Math.cos((UNPAM_CENTER[0] * Math.PI) / 180)),
];

export function distanceMeters(a: [number, number], b: [number, number]) {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export const formatPrice = (n: number) =>
  n >= 1_000_000
    ? `Rp ${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    : `Rp ${Math.round(n / 1000)}K`;

export const formatDistance = (m: number) =>
  m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;

function mapCategoryToKosType(categoryId: number | null): KosType {
  if (categoryId === 1) return 'Male';
  if (categoryId === 2) return 'Female';
  return 'Mixed';
}

export async function fetchDynamicKosList(): Promise<Kos[]> {
  const [housesRes, roomsRes, reviewsRes] = await Promise.all([
    supabase
      .from('boarding_houses')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase.from('rooms').select('*'),
    supabase.from('testimonials').select('boarding_house_id, rating'),
  ]);

  if (housesRes.error) {
    console.error('Gagal memuat daftar kosan:', housesRes.error.message);
    return [];
  }

  const roomsByHouse = new Map<
    number,
    { available: number; sizes: number[] }
  >();
  for (const rm of roomsRes.data || []) {
    const hid = Number(rm.boarding_house_id);
    const cur = roomsByHouse.get(hid) || { available: 0, sizes: [] };
    if (rm.is_available !== false) cur.available += 1;
    if (Number(rm.square_feet) > 0) cur.sizes.push(Number(rm.square_feet));
    roomsByHouse.set(hid, cur);
  }

  const reviewByHouse = new Map<number, { sum: number; count: number }>();
  for (const rev of reviewsRes.data || []) {
    const hid = Number(rev.boarding_house_id);
    const cur = reviewByHouse.get(hid) || { sum: 0, count: 0 };
    cur.sum += Number(rev.rating || 0);
    cur.count += 1;
    reviewByHouse.set(hid, cur);
  }

  return (housesRes.data || []).map((row: any, idx: number) => {
    const id = Number(row.id);
    const hasCoords =
      row.latitude !== null &&
      row.longitude !== null &&
      Number.isFinite(Number(row.latitude)) &&
      Number.isFinite(Number(row.longitude));

    const fallbackOffset = at(((idx % 4) - 1.5) * 280, ((idx % 3) - 1) * 320);
    const lat = hasCoords ? Number(row.latitude) : fallbackOffset[0];
    const lng = hasCoords ? Number(row.longitude) : fallbackOffset[1];
    const distance = distanceMeters(UNPAM_CENTER, [lat, lng]);

    const rmInfo = roomsByHouse.get(id);
    const firstSize = rmInfo?.sizes[0];
    const sizeLabel = firstSize ? `${firstSize} m²` : '12 m²';
    const leftRooms = rmInfo ? rmInfo.available : 3;

    const revInfo = reviewByHouse.get(id);
    const avgRating =
      revInfo && revInfo.count > 0
        ? Number((revInfo.sum / revInfo.count).toFixed(1))
        : 4.5;
    const reviewCount = revInfo ? revInfo.count : 0;

    return {
      id,
      slug: row.slug || String(id),
      name: row.name || 'Unnamed Kos',
      area: row.address || 'Kelodran, Walantaka',
      type: mapCategoryToKosType(row.category_id),
      price: Number(row.price || 0),
      size: sizeLabel,
      left: leftRooms,
      rating: avgRating,
      reviews: reviewCount,
      img: row.thumbnail || '/assets/image01.png',
      lat,
      lng,
      distance,
    };
  });
}