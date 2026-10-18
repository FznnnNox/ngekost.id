export type KosType = 'Male' | 'Female' | 'Mixed';

export type Kos = {
  id: number;
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

export const UNPAM_CENTER: [number, number] = [-6.1639, 106.1112];
export const UNPAM_NAME = 'UNPAM Serang';

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
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export const formatPrice = (n: number) =>
  n >= 1_000_000 ? `Rp ${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M` : `Rp ${Math.round(n / 1000)}K`;

export const formatDistance = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`);

type Seed = Omit<Kos, 'lat' | 'lng' | 'distance'> & { north: number; east: number };

const seeds: Seed[] = [
  { id: 1, name: 'Cedar House', area: 'Kelodran, Walantaka', type: 'Male', price: 650000, size: '12 m²', left: 3, rating: 4.8, reviews: 126, img: '/assets/image01.png', north: 250, east: 180 },
  { id: 2, name: 'Lotus Residence', area: 'Kelodran, Walantaka', type: 'Female', price: 800000, size: '15 m²', left: 1, rating: 4.9, reviews: 98, img: '/assets/image02.png', north: -300, east: 420 },
  { id: 3, name: 'Sunrise Kost', area: 'Walantaka', type: 'Mixed', price: 450000, size: '9 m²', left: 5, rating: 4.6, reviews: 64, img: '/assets/image03.png', north: 520, east: -380 },
  { id: 4, name: 'Maple Corner', area: 'Walantaka', type: 'Male', price: 350000, size: '12 m²', left: 2, rating: 4.7, reviews: 81, img: '/assets/image04.png', north: -650, east: -520 },
  { id: 5, name: 'Orchid Stay', area: 'Kelodran, Walantaka', type: 'Female', price: 1200000, size: '14 m²', left: 4, rating: 4.8, reviews: 110, img: '/assets/image01.png', north: 880, east: 760 },
  { id: 6, name: 'Pine Lodge', area: 'Walantaka', type: 'Mixed', price: 550000, size: '8 m²', left: 6, rating: 4.5, reviews: 47, img: '/assets/image02.png', north: -980, east: 300 },
  { id: 7, name: 'Jasmine Kost', area: 'Kelodran, Walantaka', type: 'Female', price: 600000, size: '10 m²', left: 2, rating: 4.7, reviews: 72, img: '/assets/image03.png', north: 120, east: -900 },
  { id: 8, name: 'Bamboo Stay', area: 'Walantaka', type: 'Male', price: 950000, size: '16 m²', left: 3, rating: 4.4, reviews: 39, img: '/assets/image04.png', north: -420, east: 1150 },
];

export const kosList: Kos[] = seeds.map(({ north, east, ...rest }) => {
  const [lat, lng] = at(north, east);
  return { ...rest, lat, lng, distance: distanceMeters(UNPAM_CENTER, [lat, lng]) };
});