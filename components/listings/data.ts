export type Tag = 'Wi-Fi' | 'AC' | 'Private bath';
export type Kind = 'Male' | 'Female' | 'Mixed';

export type Listing = {
  name: string;
  area: string;
  type: Kind;
  rating: number;
  reviews: number;
  price: string;
  size: string;
  left: number;
  tags: Tag[];
  img: string;
};

export const filters = ['All', 'Male', 'Female', 'Mixed'] as const;
export type Filter = (typeof filters)[number];

export const shapes = ['76px 22px 22px 22px', '22px 22px 76px 22px', '22px 76px 22px 22px'];

export const listings: Listing[] = [
  { name: 'Cedar House', area: 'Near State University', type: 'Male', rating: 4.8, reviews: 126, price: 'Rp 200k', size: '12 m²', left: 3, tags: ['Wi-Fi', 'AC', 'Private bath'], img: '/assets/image01.png' },
  { name: 'Lotus Residence', area: 'City Center', type: 'Female', rating: 4.9, reviews: 98, price: 'Rp 500k', size: '15 m²', left: 1, tags: ['Wi-Fi', 'AC'], img: '/assets/image02.png' },
  { name: 'Sunrise Kost', area: 'Business District', type: 'Mixed', rating: 4.6, reviews: 64, price: 'Rp 900K', size: '9 m²', left: 5, tags: ['Wi-Fi', 'Private bath'], img: '/assets/image03.png' },
  { name: 'Maple Corner', area: 'Near Tech Park', type: 'Male', rating: 4.7, reviews: 81, price: 'Rp 350k', size: '12 m²', left: 2, tags: ['Wi-Fi', 'AC'], img: '/assets/image04.png' },
  { name: 'Orchid Stay', area: 'Old Town', type: 'Female', rating: 4.8, reviews: 110, price: 'Rp 250k', size: '14 m²', left: 4, tags: ['Wi-Fi', 'AC', 'Private bath'], img: '/assets/image01.png' },
  { name: 'Pine Lodge', area: 'Near Train Station', type: 'Mixed', rating: 4.5, reviews: 47, price: 'Rp 800K', size: '8 m²', left: 6, tags: ['Wi-Fi'], img: '/assets/image01.png' },
];