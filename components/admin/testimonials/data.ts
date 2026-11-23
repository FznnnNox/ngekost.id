export type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number; // 1 to 5
  avatar: string;
};

export const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rian Pratama',
    role: 'College Student',
    content: 'Ngekost.id helped me find a cozy boarding house near campus very easily. Highly recommended!',
    rating: 5,
    avatar: '/assets/image01.png',
  },
  {
    id: 2,
    name: 'Dewi Lestari',
    role: 'Private Employee',
    content: 'The facilities match the description, and the payment process is extremely fast and secure.',
    rating: 4,
    avatar: '/assets/image01.png',
  },
];