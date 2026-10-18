// export type KostMarker = {
//   id: number;
//   name: string;
//   address: string;
//   price: number; // per bulan
//   lat: number;
//   lng: number;
// };

// export const kostMarkers: KostMarker[] = [
//   {
//     id: 1,
//     name: 'Kos Putra Pakupatan',
//     address: 'Pakupatan, Kota Serang',
//     price: 650000,
//     lat: -6.1185,
//     lng: 106.1545,
//   },
//   {
//     id: 2,
//     name: 'Kos Putri Cipocok',
//     address: 'Cipocok Jaya, Kota Serang',
//     price: 800000,
//     lat: -6.1495,
//     lng: 106.1575,
//   },
//   {
//     id: 3,
//     name: 'Kos Campur Kota Serang',
//     address: 'Dekat Alun-alun Serang',
//     price: 700000,
//     lat: -6.1103,
//     lng: 106.164,
//   },
// ];

// // Titik tengah peta (Kota Serang)
// export const SERANG_CENTER: [number, number] = [-6.1201, 106.1503];
export type KostType = 'Male' | 'Female' | 'Mixed';

export type KostMarker = {
  id: number;
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
  img?: string; // path di /public, contoh: '/assets/image01.png'
};

export const kostMarkers: KostMarker[] = [
  {
    id: 1,
    name: 'Kos Putra Pakupatan',
    address: 'Pakupatan, Serang City',
    price: 650000,
    lat: -6.1185,
    lng: 106.1545,
    type: 'Male',
    rating: 4.7,
    reviews: 58,
    tags: ['Wi-Fi', 'Fan', 'Shared bath'],
    description: 'A quiet boarding house a short ride from the city center, popular with students and young workers.',
    img: '/assets/image01.png',
  },
  {
    id: 2,
    name: 'Kos Putri Cipocok',
    address: 'Cipocok Jaya, Serang City',
    price: 800000,
    lat: -6.1495,
    lng: 106.1575,
    type: 'Female',
    rating: 4.9,
    reviews: 91,
    tags: ['Wi-Fi', 'AC', 'Private bath'],
    description: 'Clean rooms with a private bathroom and 24-hour security, in a calm residential street.',
    img: '/assets/image02.png',
  },
  {
    id: 3,
    name: 'Kos Campur Kota Serang',
    address: 'Near Alun-alun Serang',
    price: 700000,
    lat: -6.1103,
    lng: 106.164,
    type: 'Mixed',
    rating: 4.5,
    reviews: 34,
    tags: ['Wi-Fi', 'AC'],
    description: 'Walking distance to the town square, food stalls, and public transport.',
    img: '/assets/image01.png',
  },
];

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