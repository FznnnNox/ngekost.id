import { supabase } from '@/lib/supabase';
import type { BoardingHouse, Bonus, Room } from '@/components/admin/boarding-houses/data';

type HouseForm = Omit<BoardingHouse, 'id'>;

type HouseRow = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  city_id: number | null;
  category_id: number | null;
  description: string | null;
  price: number | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  owner_whatsapp: string | null;
};

type RoomRow = {
  id: number;
  boarding_house_id: number;
  name: string;
  room_type: string | null;
  square_feet: number | null;
  capacity: number | null;
  price_per_month: number | null;
  is_available: boolean | null;
  images: string[] | null;
};

type BonusRow = {
  id: number;
  boarding_house_id: number;
  name: string;
  description: string | null;
};

type DbError = { message: string; code?: string };

const fail = (err: DbError): never => {
  if (err.code === '23505') throw new Error('Slug sudah dipakai, gunakan slug lain.');
  throw new Error(err.message);
};

const toHouse = (r: HouseRow): BoardingHouse => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  thumbnail: r.thumbnail ?? '',
  cityId: r.city_id ?? 1,
  categoryId: r.category_id ?? 1,
  description: r.description ?? '',
  price: Number(r.price ?? 0),
  address: r.address ?? '',
  latitude: Number(r.latitude ?? -6.1154),
  longitude: Number(r.longitude ?? 106.1503),
  ownerWhatsapp: r.owner_whatsapp ?? '',
  owner_whatsapp: r.owner_whatsapp ?? '',
});

const toHouseRow = (f: HouseForm) => {
  const waNumber = (f.ownerWhatsapp ?? f.owner_whatsapp ?? '').trim();
  return {
    name: f.name,
    slug: f.slug,
    thumbnail: f.thumbnail || null,
    city_id: f.cityId,
    category_id: f.categoryId,
    description: f.description || null,
    price: f.price,
    address: f.address || null,
    latitude: f.latitude ?? -6.1154,
    longitude: f.longitude ?? 106.1503,
    owner_whatsapp: waNumber || null,
  };
};

const toRoom = (r: RoomRow): Room => ({
  id: r.id,
  boardingHouseId: r.boarding_house_id,
  name: r.name,
  roomType: r.room_type ?? 'Standard',
  squareFeet: Number(r.square_feet ?? 0),
  capacity: Number(r.capacity ?? 1),
  pricePerMonth: Number(r.price_per_month ?? 0),
  isAvailable: r.is_available ?? true,
  images: r.images ?? [],
});

const toBonus = (r: BonusRow): Bonus => ({
  id: r.id,
  boardingHouseId: r.boarding_house_id,
  name: r.name,
  description: r.description ?? '',
});

export async function fetchAll() {
  const [houses, rooms, bonuses] = await Promise.all([
    supabase.from('boarding_houses').select('*').order('created_at', { ascending: false }),
    supabase.from('rooms').select('*').order('id'),
    supabase.from('bonuses').select('*').order('id'),
  ]);

  if (houses.error) fail(houses.error);
  if (rooms.error) fail(rooms.error);
  if (bonuses.error) fail(bonuses.error);

  return {
    houses: (houses.data as HouseRow[]).map(toHouse),
    rooms: (rooms.data as RoomRow[]).map(toRoom),
    bonuses: (bonuses.data as BonusRow[]).map(toBonus),
  };
}

export async function createHouse(form: HouseForm): Promise<BoardingHouse> {
  const { data, error } = await supabase
    .from('boarding_houses')
    .insert(toHouseRow(form))
    .select()
    .single();
  if (error) fail(error);
  return toHouse(data as HouseRow);
}

export async function updateHouse(id: number, form: HouseForm): Promise<BoardingHouse> {
  const { data, error } = await supabase
    .from('boarding_houses')
    .update(toHouseRow(form))
    .eq('id', id)
    .select()
    .single();
  if (error) fail(error);
  return toHouse(data as HouseRow);
}

export async function deleteHouse(id: number): Promise<void> {
  const { error } = await supabase.from('boarding_houses').delete().eq('id', id);
  if (error) fail(error);
}

export async function createRoom(
  boardingHouseId: number,
  input: Omit<Room, 'id' | 'boardingHouseId'>
): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      boarding_house_id: boardingHouseId,
      name: input.name,
      room_type: input.roomType,
      square_feet: input.squareFeet,
      capacity: input.capacity,
      price_per_month: input.pricePerMonth,
      is_available: input.isAvailable,
      images: input.images,
    })
    .select()
    .single();
  if (error) fail(error);
  return toRoom(data as RoomRow);
}

export async function deleteRoom(id: number): Promise<void> {
  const { error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) fail(error);
}

export async function createBonus(
  boardingHouseId: number,
  name: string,
  description: string
): Promise<Bonus> {
  const { data, error } = await supabase
    .from('bonuses')
    .insert({ boarding_house_id: boardingHouseId, name, description })
    .select()
    .single();
  if (error) fail(error);
  return toBonus(data as BonusRow);
}

export async function deleteBonus(id: number): Promise<void> {
  const { error } = await supabase.from('bonuses').delete().eq('id', id);
  if (error) fail(error);
}

export async function fetchHouseDetail(idOrSlug: string) {
  const isNumericId = /^\d+$/.test(idOrSlug);

  // Ambil hanya 1 kosan yang sesuai slug atau id
  let query = supabase.from('boarding_houses').select('*');
  query = isNumericId ? query.eq('id', Number(idOrSlug)) : query.eq('slug', idOrSlug);

  const { data: houseData, error: houseErr } = await query.maybeSingle();
  if (houseErr) fail(houseErr);
  if (!houseData) return null;

  const house = toHouse(houseData as HouseRow);

  // Ambil kamar & bonus HANYA untuk house.id ini
  const [roomsRes, bonusesRes] = await Promise.all([
    supabase.from('rooms').select('*').eq('boarding_house_id', house.id).order('id'),
    supabase.from('bonuses').select('*').eq('boarding_house_id', house.id).order('id'),
  ]);

  if (roomsRes.error) fail(roomsRes.error);
  if (bonusesRes.error) fail(bonusesRes.error);

  return {
    house,
    rooms: (roomsRes.data as RoomRow[]).map(toRoom),
    bonuses: (bonusesRes.data as BonusRow[]).map(toBonus),
  };
}

export async function fetchUserWishlist(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('wishlists')
    .select('boarding_house_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
  return data.map((item) => Number(item.boarding_house_id));
}

export async function toggleUserWishlist(
  userId: string,
  boardingHouseId: number,
  isCurrentlySaved: boolean
): Promise<void> {
  if (isCurrentlySaved) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .match({ user_id: userId, boarding_house_id: boardingHouseId });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: userId, boarding_house_id: boardingHouseId });
    if (error) throw error;
  }
}