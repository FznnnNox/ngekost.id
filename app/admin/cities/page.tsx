import type { Metadata } from 'next';
import CitiesView from '@/components/admin/cities/CitiesView';

export const metadata: Metadata = {
  title: 'City - Ngekost.id',
  robots: { index: false, follow: false },
};

export default function CitiesPage() {
  return <CitiesView />;
}