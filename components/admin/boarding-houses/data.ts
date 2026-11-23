export type BoardingHouse = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  cityId: number;
  categoryId: number;
  description: string;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  ownerWhatsapp: string;
  owner_whatsapp?: string;
};

export type Room = {
  id: number;
  boardingHouseId: number;
  name: string;
  roomType: string;
  squareFeet: number;
  capacity: number;
  pricePerMonth: number;
  isAvailable: boolean;
  images: string[];
};

export type Bonus = {
  id: number;
  boardingHouseId: number;
  name: string;
  description: string;
};

export const cities = [
  { id: 1, name: 'Serang' },
  { id: 2, name: 'Cilegon' },
  { id: 3, name: 'Tangerang' },
];

export const categories = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'Mixed' },
];

export const roomTypes = ['Standard', 'Deluxe', 'Premium', 'VIP'];

export const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');