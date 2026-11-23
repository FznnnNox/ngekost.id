import type { Metadata } from 'next';
import TestimonialsView from '@/components/admin/testimonials/TestimonialsView';

export const metadata: Metadata = {
  title: 'Testimoni - Ngekost.id',
  robots: { index: false, follow: false },
};

export default function TestimonialPages() {
  return <TestimonialsView />;
}