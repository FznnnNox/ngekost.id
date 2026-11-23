import { supabase } from '@/lib/supabase';
import type { Testimonial } from './data';

export type TestimonialRow = {
  id: number;
  boarding_house_id: number | null;
  name: string;
  role: string | null;
  avatar: string | null;
  rating: number;
  content: string;
  created_at: string;
};

const toTestimonial = (r: TestimonialRow): Testimonial & { boardingHouseId?: number | null; createdAt?: string } => ({
  id: r.id,
  boardingHouseId: r.boarding_house_id,
  name: r.name,
  role: r.role || 'Penghuni Kos',
  avatar: r.avatar || '',
  rating: r.rating,
  content: r.content,
  createdAt: r.created_at,
});

export async function fetchAllTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as TestimonialRow[]).map(toTestimonial);
}

export async function fetchTestimonialsByHouse(boardingHouseId: number) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('boarding_house_id', boardingHouseId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as TestimonialRow[]).map(toTestimonial);
}

export async function createTestimonial(input: {
  boardingHouseId?: number;
  name: string;
  role?: string;
  rating: number;
  content: string;
}) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      boarding_house_id: input.boardingHouseId ?? null,
      name: input.name,
      role: input.role || 'Penghuni Kos',
      rating: input.rating,
      content: input.content,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toTestimonial(data as TestimonialRow);
}

export async function deleteTestimonial(id: number) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
}